import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CircleUserRound, Clock3, MapPin, Moon, Sun } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import Sidebar from "../../Sidebar/Sidebar";
import {
    getDoctors,
    getMeusSetoresEscalista,
    getMinhaAgenda,
} from "../../UserHospital/Setores/setorServices.js";
import { getStoredUser } from "../../../utils/authStorage";
import {
    formatDateLong,
    getPlantaoType,
    normalizePlantao,
} from "../../../utils/plantaoFormatters";
import "./TelaPrincipal.css";

export default function TelaPrincipal() {
    const navigate = useNavigate();
    const usuario = obterUsuarioLogado();
    const nomeUsuario = usuario?.name || "Escalista";
    const [view, setView] = useState("week");
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTurnos, setSelectedTurnos] = useState(["diurno", "noturno"]);
    const [weekReference, setWeekReference] = useState(() => new Date());
    const [setores, setSetores] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setLoading(true);
            setErro("");

            const [setoresData, medicosData, agendaData] = await Promise.all([
                getMeusSetoresEscalista(),
                getDoctors(),
                getMinhaAgenda(),
            ]);

            const setoresAtivos = Array.isArray(setoresData)
                ? setoresData.filter((setor) => setor.ativo !== false)
                : [];

            setSetores(setoresAtivos);
            setMedicos(Array.isArray(medicosData) ? medicosData.filter((medico) => medico.ativo !== false) : []);
            setPlantoes(Array.isArray(agendaData) ? agendaData : []);
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar os dados do painel.");
            setSetores([]);
            setMedicos([]);
            setPlantoes([]);
        } finally {
            setLoading(false);
        }
    }

    const shifts = useMemo(() => {
        return plantoes.map((plantao) => ({
            ...normalizePlantao(plantao),
            setorId: String(plantao.setorId || ""),
        }));
    }, [plantoes]);

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

    const selectedTurnosSet = useMemo(() => new Set(selectedTurnos), [selectedTurnos]);

    const weeklyShifts = useMemo(() => {
        return shifts.filter((shift) => shift.date >= weekStartStr && shift.date <= weekEndStr);
    }, [shifts, weekEndStr, weekStartStr]);

    const filteredShifts = useMemo(() => {
        const base = view === "week" ? weeklyShifts : shifts;

        return base.filter((shift) => {
            const turnoMatch = selectedTurnosSet.has(resolveTurnoFiltro(shift));
            const dayMatch = !selectedDay || shift.date === selectedDay;

            return turnoMatch && dayMatch;
        });
    }, [selectedDay, selectedTurnosSet, shifts, view, weeklyShifts]);

    const calendarEvents = useMemo(() => {
        return shifts
            .filter((shift) => selectedTurnosSet.has(resolveTurnoFiltro(shift)))
            .map((shift) => ({
                id: String(shift.id),
                title: `${shift.doctor} - ${shift.setor}`,
                start: shift.date,
                allDay: true,
                className: getPlantaoType(shift).includes("noite")
                    ? "event-night"
                    : "event-day",
            }));
    }, [selectedTurnosSet, shifts]);

    function handleTurnoChange(turno) {
        setSelectedTurnos((current) =>
            current.includes(turno)
                ? current.filter((item) => item !== turno)
                : [...current, turno],
        );
    }

    function handleAllTurnos() {
        if (selectedTurnos.length === 2) {
            setSelectedTurnos([]);
            return;
        }

        setSelectedTurnos(["diurno", "noturno"]);
    }

    function handleWeekNavigation(direction) {
        setSelectedDay(null);
        setWeekReference((current) => {
            const next = new Date(current);
            next.setDate(current.getDate() + direction * 7);
            return next;
        });
    }

    function getDotTypesForDate(date) {
        const types = new Set(
            weeklyShifts
                .filter((shift) => shift.date === date)
                .filter((shift) => selectedTurnosSet.has(resolveTurnoFiltro(shift)))
                .map((shift) => getPlantaoType(shift).includes("noite") ? "noite" : "dia"),
        );

        return ["dia", "noite"].filter((type) => types.has(type));
    }

    return (
        <div className="layout-escalista">
            <Sidebar />

            <main className="gestao-container">
                <header className="topo-escalista">
                    <div>
                        <h1>Painel de Controle</h1>
                        <p>Bem-vindo de volta, {nomeUsuario}.</p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />

                        <div className="usuario-topo">
                            <CircleUserRound className="perfilEscalista" />
                            <span className="perfilEscalista">{nomeUsuario}</span>
                        </div>
                    </div>
                </header>

                {erro && <div className="estado-escalista erro">{erro}</div>}

                <section className="escalista-dashboard-card">
                    <span className="label">MÉDICOS VINCULADOS</span>

                    <div className="number-row">
                        <h2>{loading ? "..." : medicos.length}</h2>
                        <span>Profissionais ativos</span>
                    </div>
                </section>

                <div className="agenda-escalista-grid">
                    <aside className="filters-card">
                        <div className="view-tabs">
                            <button
                                type="button"
                                className={view === "week" ? "active" : ""}
                                onClick={() => setView("week")}
                            >
                                Semanal
                            </button>

                            <button
                                type="button"
                                className={view === "month" ? "active" : ""}
                                onClick={() => setView("month")}
                            >
                                Mensal
                            </button>
                        </div>

                        <div className="filters">
                            <h3>FILTROS</h3>
                            <span>TURNO</span>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTurnos.length === 2}
                                    onChange={handleAllTurnos}
                                />
                                Todos
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTurnos.includes("diurno")}
                                    onChange={() => handleTurnoChange("diurno")}
                                />
                                Diurno
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTurnos.includes("noturno")}
                                    onChange={() => handleTurnoChange("noturno")}
                                />
                                Noturno
                            </label>
                        </div>
                    </aside>

                    <section className="main-panel">
                        {view === "week" && (
                            <>
                                <div className="week-toolbar">
                                    <button type="button" onClick={() => handleWeekNavigation(-1)}>
                                        Anterior
                                    </button>

                                    <strong>
                                        {formatDateLong(weekStartStr)} - {formatDateLong(weekEndStr)}
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
                                                type="button"
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
                                                            <span className={`day-dot day-dot-${type}`} key={type} />
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <ShiftList loading={loading} shifts={filteredShifts} erro={erro} navigate={navigate} />
                            </>
                        )}

                        {view === "month" && (
                            <div className="calendar-wrapper">
                                <FullCalendar
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
                                    dateClick={(info) => setSelectedDay(info.dateStr)}
                                    eventClick={(info) =>
                                        navigate(`/UserEscalista/DetalhePlantao/${info.event.id}`)
                                    }
                                />
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

function ShiftList({ loading, shifts, erro, navigate }) {
    return (
        <div className="shifts-list">
            {loading ? (
                <p>Carregando agenda...</p>
            ) : shifts.length > 0 ? (
                shifts.map((shift) => {
                    const isNight = getPlantaoType(shift).includes("noite");

                    return (
                        <article className="shift-card" key={shift.id}>
                            <div className={`shift-icon ${isNight ? "noite" : "dia"}`}>
                                {isNight ? <Moon size={28} /> : <Sun size={28} />}
                                <span>{isNight ? "NOITE" : "DIA"}</span>
                            </div>

                            <div className="shift-info">
                                <small>{shift.setor}</small>
                                <h3>{shift.doctor}</h3>

                                <div className="shift-details">
                                    <span>{formatDateLong(shift.date)}</span>
                                    <span className="recurrence-badge">{shift.recorrencia}</span>
                                    <span>
                                        <Clock3 size={15} />
                                        {shift.time}
                                    </span>
                                    <span>
                                        <MapPin size={15} />
                                        {shift.local}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="ver-detalhes-btn"
                                onClick={() => navigate(`/UserEscalista/DetalhePlantao/${shift.id}`)}
                            >
                                Ver detalhes
                            </button>
                        </article>
                    );
                })
            ) : (
                <p>{erro || "Nenhum plantão encontrado para os filtros selecionados."}</p>
            )}
        </div>
    );
}

function obterUsuarioLogado() {
    return getStoredUser();
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

function resolveTurnoFiltro(shift) {
    return getPlantaoType(shift).includes("noite") ||
        getPlantaoType(shift).includes("noturno")
        ? "noturno"
        : "diurno";
}
