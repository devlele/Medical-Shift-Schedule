import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CircleUserRound, Clock3, MapPin, Sun, Moon } from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import Sidebar from "../../Sidebar/Sidebar";
import {
  getCoberturasDisponiveis,
  getMeusPedidosCobertura,
  getMinhaAgendaMedico,
} from "../../../services/doctorServices";
import {
  formatDateLong,
  getPlantaoType,
  getUsuarioLogado,
  normalizePedidoCobertura,
  normalizePlantao,
} from "../../../utils/plantaoFormatters";

import "./Agenda.css";

export default function Agenda() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [view, setView] = useState("week");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [plantoes, setPlantoes] = useState([]);
  const [coberturas, setCoberturas] = useState([]);
  const [meusPedidosCobertura, setMeusPedidosCobertura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [hospitalsInicializados, setHospitalsInicializados] = useState(false);
  const [weekReference, setWeekReference] = useState(() => new Date());

  useEffect(() => {
    let ativo = true;

    async function carregarAgenda() {
      try {
        setLoading(true);
        setErro("");

        const [agendaData, coberturasData, meusPedidosData] = await Promise.all(
          [
            getMinhaAgendaMedico(),
            getCoberturasDisponiveis(),
            getMeusPedidosCobertura(),
          ],
        );

        if (!ativo) {
          return;
        }

        setPlantoes(Array.isArray(agendaData) ? agendaData : []);
        setCoberturas(Array.isArray(coberturasData) ? coberturasData : []);
        setMeusPedidosCobertura(
          Array.isArray(meusPedidosData) ? meusPedidosData : [],
        );
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar a agenda.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarAgenda();

    return () => {
      ativo = false;
    };
  }, []);

  const shifts = useMemo(() => {
    const pedidosPropriosPorPlantaoId = new Map();

    meusPedidosCobertura.forEach((pedido) => {
      const cobertura = normalizePedidoCobertura(pedido);
      const plantaoId = cobertura.plantao.id;

      if (!plantaoId || cobertura.status !== "ABERTO") {
        return;
      }

      const pedidoAtual = pedidosPropriosPorPlantaoId.get(plantaoId);

      if (
        !pedidoAtual ||
        getPedidoTimestamp(cobertura.raw) > getPedidoTimestamp(pedidoAtual.raw)
      ) {
        pedidosPropriosPorPlantaoId.set(plantaoId, cobertura);
      }
    });

    const meusPlantoes = plantoes.map((plantao) => {
      const plantaoNormalizado = normalizePlantao(plantao);
      const pedidoProprio = pedidosPropriosPorPlantaoId.get(plantao.id);

      if (pedidoProprio) {
        return {
          ...plantaoNormalizado,
          kind: "pedido-proprio",
          pedidoId: pedidoProprio.id,
          plantaoId: plantaoNormalizado.id,
          raw: pedidoProprio.raw,
          pedidoStatus: pedidoProprio.status,
        };
      }

      return {
        ...plantaoNormalizado,
        kind: "plantao",
        plantaoId: plantaoNormalizado.id,
      };
    });

    const plantaoIdsNaAgenda = new Set(plantoes.map((plantao) => plantao.id));

    const ofertas = coberturas.map((pedido) => {
      const cobertura = normalizePedidoCobertura(pedido);

      return {
        ...cobertura.plantao,
        id: cobertura.id,
        plantaoId: cobertura.plantao.id,
        hospital: cobertura.hospital,
        setor: cobertura.setor,
        doctor: cobertura.medicoSolicitante,
        kind: "cobertura",
        raw: pedido,
      };
    });

    const pedidosPropriosSemPlantaoNaAgenda = Array.from(
      pedidosPropriosPorPlantaoId.values(),
    )
      .filter((pedido) => !plantaoIdsNaAgenda.has(pedido.plantao.id))
      .map((pedido) => ({
        ...pedido.plantao,
        id: pedido.plantao.id || pedido.id,
        pedidoId: pedido.id,
        plantaoId: pedido.plantao.id,
        hospital: pedido.hospital,
        setor: pedido.setor,
        doctor: pedido.medicoSolicitante,
        kind: "pedido-proprio",
        raw: pedido.raw,
        pedidoStatus: pedido.status,
      }));

    return [...meusPlantoes, ...ofertas, ...pedidosPropriosSemPlantaoNaAgenda];
  }, [plantoes, coberturas, meusPedidosCobertura]);

  const hospitals = useMemo(() => {
    return Array.from(new Set(shifts.map((shift) => shift.hospital))).filter(
      Boolean,
    );
  }, [shifts]);

  useEffect(() => {
    if (hospitals.length > 0 && !hospitalsInicializados) {
      setSelectedHospitals(hospitals);
      setHospitalsInicializados(true);
    }
  }, [hospitals, hospitalsInicializados]);

  // FILTRO HOSPITAIS
  function handleHospitalChange(hospital) {
    if (selectedHospitals.includes(hospital)) {
      setSelectedHospitals(
        selectedHospitals.filter((item) => item !== hospital),
      );
    } else {
      setSelectedHospitals([...selectedHospitals, hospital]);
    }
  }

  // TODOS
  function handleAllHospitals() {
    if (selectedHospitals.length === hospitals.length) {
      setSelectedHospitals([]);
    } else {
      setSelectedHospitals(hospitals);
    }
  }

  // EVENTOS CALENDÁRIO
  const calendarEvents = useMemo(() => {
    return shifts
      .filter((shift) => selectedHospitals.includes(shift.hospital))
      .map((shift) => ({
        id: `${shift.kind}-${shift.id}`,
        title:
          shift.kind === "cobertura"
            ? `Oferta: ${shift.setor}`
            : shift.kind === "pedido-proprio"
              ? `Meu pedido: ${shift.setor}`
              : shift.setor,
        start: shift.date,
        allDay: true,
        extendedProps: {
          pedido: shift.raw,
          pedidoId:
            shift.kind === "cobertura" || shift.kind === "pedido-proprio"
              ? shift.pedidoId || shift.id
              : null,
          plantaoId:
            shift.kind === "cobertura" || shift.kind === "pedido-proprio"
              ? shift.plantaoId
              : shift.id,
          kind: shift.kind,
          hospital: shift.hospital,
          time: shift.time,
          local: shift.local,
          type: shift.type,
        },
        className:
          shift.kind === "cobertura"
            ? "event-coverage"
            : shift.kind === "pedido-proprio"
              ? "event-own-coverage"
              : getPlantaoType(shift).includes("noite")
                ? "event-night"
                : "event-day",
      }));
  }, [selectedHospitals, shifts]);

  // LISTA DE PLANTÕES
  const weekDays = useMemo(() => {
    const startOfWeek = getStartOfWeek(weekReference);

    return Array.from({ length: 7 }).map((_, index) => {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + index);
      return currentDay;
    });
  }, [weekReference]);

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekStartStr = toDateInputValue(weekStart);
  const weekEndStr = toDateInputValue(weekEnd);

  const weeklyShifts = useMemo(() => {
    return shifts.filter((shift) => {
      return shift.date >= weekStartStr && shift.date <= weekEndStr;
    });
  }, [shifts, weekEndStr, weekStartStr]);

  const weeklyVisibleShifts = useMemo(() => {
    return weeklyShifts.filter((shift) =>
      selectedHospitals.includes(shift.hospital),
    );
  }, [selectedHospitals, weeklyShifts]);

  const filteredShifts = useMemo(() => {
    const base = view === "week" ? weeklyShifts : shifts;

    return base.filter((shift) => {
      const hospitalMatch = selectedHospitals.includes(shift.hospital);

      const dayMatch = !selectedDay ? true : shift.date === selectedDay;

      return hospitalMatch && dayMatch;
    });
  }, [selectedDay, selectedHospitals, shifts, view, weeklyShifts]);

  const nomeUsuario = usuario?.name || "medico";

  function handleWeekNavigation(direction) {
    setSelectedDay(null);
    setWeekReference((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + direction * 7);
      return next;
    });
  }

  function getDotTypesForDate(date) {
    const typeOrder = ["plantao", "cobertura", "pedido-proprio"];
    const types = new Set(
      weeklyVisibleShifts
        .filter((shift) => shift.date === date)
        .map((shift) => shift.kind),
    );

    return typeOrder.filter((type) => types.has(type));
  }

  return (
    <div className="agenda-container">
      <Sidebar />

      <main className="agenda-content">
        {/* HEADER */}
        <header className="topo">
          <div>
            <h1>Painel de Controle</h1>

            <p>Bem-vindo de volta, {nomeUsuario}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />

            <div className="usuario-topo">
              <CircleUserRound className="perfilPlantonista" />

              <span className="perfilPlantonista">{nomeUsuario}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* FILTROS */}
          <aside className="filters-card">
            <div className="view-tabs">
              <button
                className={view === "week" ? "active" : ""}
                onClick={() => setView("week")}
              >
                Semanal
              </button>

              <button
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                Mensal
              </button>
            </div>

            <div className="filters">
              <h3>FILTROS</h3>

              <span>UNIDADE HOSPITALAR</span>

              <label>
                <input
                  type="checkbox"
                  checked={selectedHospitals.length === hospitals.length}
                  onChange={handleAllHospitals}
                />
                Todos
              </label>

              {hospitals.map((hospital) => (
                <label key={hospital}>
                  <input
                    type="checkbox"
                    checked={selectedHospitals.includes(hospital)}
                    onChange={() => handleHospitalChange(hospital)}
                  />

                  {hospital}
                </label>
              ))}
            </div>
          </aside>

          {/* CONTEÚDO */}
          <section className="main-panel">
            {/* VISÃO SEMANAL */}
            {view === "week" && (
              <>
                <div className="week-toolbar">
                  <button
                    type="button"
                    onClick={() => handleWeekNavigation(-1)}
                  >
                    Anterior
                  </button>

                  <strong>
                    {formatDateLong(weekStartStr)} -{" "}
                    {formatDateLong(weekEndStr)}
                  </strong>

                  <button type="button" onClick={() => handleWeekNavigation(1)}>
                    Próxima
                  </button>
                </div>

                <div className="week-calendar">
                  {weekDays.map((currentDay) => {
                    const formattedDate = toDateInputValue(currentDay);
                    const weekDay = currentDay.toLocaleDateString("pt-BR", {
                      weekday: "short",
                    });

                    return (
                      <button
                        key={formattedDate}
                        className={`day-card ${
                          selectedDay === formattedDate ? "active" : ""
                        }`}
                        onClick={() =>
                          setSelectedDay((current) =>
                            current === formattedDate ? null : formattedDate,
                          )
                        }
                      >
                        <span>{weekDay.replace(".", "").toUpperCase()}</span>

                        <h2>{currentDay.getDate()}</h2>

                        {getDotTypesForDate(formattedDate).length > 0 && (
                          <div className="day-dots">
                            {getDotTypesForDate(formattedDate).map((type) => (
                              <span
                                className={`day-dot day-dot-${type}`}
                                key={type}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* PLANTÕES */}
                <div className="shifts-list">
                  {loading ? (
                    <p>Carregando agenda...</p>
                  ) : filteredShifts.length > 0 ? (
                    filteredShifts.map((shift) => (
                      <div
                        className="shift-card"
                        key={`${shift.kind}-${shift.id}`}
                      >
                        <div
                          className={`shift-icon ${
                            shift.kind === "cobertura"
                              ? "cobertura"
                              : shift.kind === "pedido-proprio"
                                ? "pedido-proprio"
                                : shift.type
                          }`}
                        >
                          {getPlantaoType(shift).includes("noite") ? (
                            <Moon size={28} />
                          ) : (
                            <Sun size={28} />
                          )}

                          <span>
                            {shift.kind === "cobertura"
                              ? "OFERTA"
                              : shift.kind === "pedido-proprio"
                                ? "PEDIDO"
                                : getPlantaoType(shift).includes("noite")
                                  ? "NOITE"
                                  : "DIA"}
                          </span>
                        </div>

                        <div className="shift-info">
                          <small>{shift.setor}</small>

                          <h3>{shift.hospital}</h3>

                          <div className="shift-details">
                            <span>{formatDateLong(shift.date)}</span>

                            <span className="recurrence-badge">
                              {shift.kind === "cobertura"
                                ? "Cobertura"
                                : shift.kind === "pedido-proprio"
                                  ? "Meu pedido"
                                  : shift.recorrencia}
                            </span>

                            <span>
                              <Clock3 size={15} />
                              {shift.time}
                            </span>

                            <span>
                              <MapPin size={15} />
                              {shift.local}
                            </span>
                            {shift.kind === "cobertura" && (
                              <span>Ofertado por: {shift.doctor}</span>
                            )}
                            {shift.kind === "pedido-proprio" && (
                              <span>
                                Status: {shift.pedidoStatus || "ABERTO"}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          className="details-btn"
                          onClick={() => {
                            if (shift.kind === "cobertura") {
                              navigate("/UserPlantonista/DetalhesOferta", {
                                state: {
                                  pedido: shift.raw,
                                  modo: "disponivel",
                                },
                              });
                              return;
                            }

                            if (shift.kind === "pedido-proprio") {
                              navigate("/UserPlantonista/DetalhesOferta", {
                                state: { pedido: shift.raw, modo: "meu" },
                              });
                              return;
                            }

                            navigate(
                              `/UserPlantonista/DetalhePlantao/${shift.id}`,
                            );
                          }}
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>
                      {erro ||
                        "Nenhum plantão ou pedido de cobertura encontrado."}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* VISÃO MENSAL */}
            {view === "month" && (
              <div className="calendar-wrapper">
                <FullCalendar
                  key="month"
                  plugins={[dayGridPlugin, interactionPlugin]}
                  locale={ptBrLocale}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "",
                  }}
                  height="auto"
                  fixedWeekCount={false}
                  events={calendarEvents}
                  dateClick={(info) => {
                    const event = calendarEvents.find(
                      (e) => e.start === info.dateStr,
                    );
                    if (event) {
                      if (
                        event.extendedProps.kind === "cobertura" ||
                        event.extendedProps.kind === "pedido-proprio"
                      ) {
                        navigate("/UserPlantonista/DetalhesOferta", {
                          state: {
                            pedido: event.extendedProps.pedido,
                            modo:
                              event.extendedProps.kind === "pedido-proprio"
                                ? "meu"
                                : "disponivel",
                          },
                        });
                        return;
                      }

                      navigate(
                        `/UserPlantonista/DetalhePlantao/${event.extendedProps.plantaoId}`,
                      );
                    } else {
                      setSelectedDay(info.dateStr);
                    }
                  }}
                  eventClick={(info) => {
                    if (
                      info.event.extendedProps.kind === "cobertura" ||
                      info.event.extendedProps.kind === "pedido-proprio"
                    ) {
                      navigate("/UserPlantonista/DetalhesOferta", {
                        state: {
                          pedido: info.event.extendedProps.pedido,
                          modo:
                            info.event.extendedProps.kind === "pedido-proprio"
                              ? "meu"
                              : "disponivel",
                        },
                      });
                      return;
                    }

                    navigate(
                      `/UserPlantonista/DetalhePlantao/${info.event.extendedProps.plantaoId}`,
                    );
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function getStartOfWeek(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  return start;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPedidoTimestamp(pedido) {
  const value =
    pedido?.atualizadoEm ||
    pedido?.assumidoEm ||
    pedido?.canceladoEm ||
    pedido?.abertoEm;
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
}
