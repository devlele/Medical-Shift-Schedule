import React, { useMemo, useState } from "react";
import { Bell, Settings, Clock3, MapPin, Sun, Moon } from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import Sidebar from "../../components/Sidebar/Sidebar";
import userImg from "../../assets/drhouse.png";

import "./Agenda.css";

const hospitals = [
  "Hospital Santa Marta",
  "Clínica Santa Maria",
  "UPA Central",
];

const shifts = [
  {
    id: 1,
    type: "dia",
    setor: "EMERGÊNCIA GERAL",
    hospital: "Hospital Santa Marta",
    time: "07:00 — 19:00 (12h)",
    local: "Asa Sul, Bloco C",
    date: "2026-05-05",
  },

  {
    id: 2,
    type: "noite",
    setor: "UTI",
    hospital: "Clínica Santa Maria",
    time: "19:00 — 07:00 (12h)",
    local: "Setor Hospitalar Norte",
    date: "2026-05-06",
  },

  {
    id: 3,
    type: "dia",
    setor: "TRIAGEM",
    hospital: "UPA Central",
    time: "08:00 — 20:00 (12h)",
    local: "Centro, Q.04",
    date: "2026-05-07",
  },

  {
    id: 4,
    type: "dia",
    setor: "AMBULATÓRIO",
    hospital: "Hospital Santa Marta",
    time: "08:00 — 18:00",
    local: "Bloco A",
    date: "2026-05-09",
  },
];

export default function Agenda() {
  const [view, setView] = useState("week");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHospitals, setSelectedHospitals] = useState(hospitals);

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
        id: shift.id,
        title: shift.setor,
        start: shift.date,
        allDay: true,
        extendedProps: {
          hospital: shift.hospital,
          time: shift.time,
          local: shift.local,
          type: shift.type,
        },
        className: shift.type === "dia" ? "event-day" : "event-night",
      }));
  }, [selectedHospitals]);

  // LISTA DE PLANTÕES
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const hospitalMatch = selectedHospitals.includes(shift.hospital);

      const dayMatch = !selectedDay ? true : shift.date === selectedDay;

      return hospitalMatch && dayMatch;
    });
  }, [selectedDay, selectedHospitals]);

  return (
    <div className="agenda-container">
      <Sidebar />

      <main className="agenda-content">
        {/* HEADER */}
        <header className="topo">
          <div>
            <h1>Painel de Controle</h1>

            <p>Bem-vindo de volta, Dr. House.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />

            <Settings className="icone-topo" />

            <div className="user">
              <img src={userImg} alt="user" />

              <span>Dr. House</span>
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

            <div className="sync-info">
              Sua agenda é sincronizada automaticamente com o RH das unidades
              selecionadas.
            </div>
          </aside>

          {/* CONTEÚDO */}
          <section className="main-panel">
            {/* VISÃO SEMANAL */}
            {view === "week" && (
              <>
                <div className="week-calendar">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const today = new Date();

                    const startOfWeek = new Date(today);

                    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

                    const currentDay = new Date(startOfWeek);

                    currentDay.setDate(startOfWeek.getDate() + index);

                    const formattedDate = currentDay
                      .toISOString()
                      .split("T")[0];

                    const weekDay = currentDay.toLocaleDateString("pt-BR", {
                      weekday: "short",
                    });

                    return (
                      <button
                        key={formattedDate}
                        className={`day-card ${
                          selectedDay === formattedDate ? "active" : ""
                        }`}
                        onClick={() => setSelectedDay(formattedDate)}
                      >
                        <span>{weekDay.replace(".", "").toUpperCase()}</span>

                        <h2>{currentDay.getDate()}</h2>

                        {selectedDay === formattedDate && (
                          <div className="dot" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* PLANTÕES */}
                <div className="shifts-list">
                  {filteredShifts.length > 0 ? (
                    filteredShifts.map((shift) => (
                      <div className="shift-card" key={shift.id}>
                        <div className={`shift-icon ${shift.type}`}>
                          {shift.type === "dia" ? (
                            <Sun size={28} />
                          ) : (
                            <Moon size={28} />
                          )}

                          <span>{shift.type === "dia" ? "DIA" : "NOITE"}</span>
                        </div>

                        <div className="shift-info">
                          <small>{shift.setor}</small>

                          <h3>{shift.hospital}</h3>

                          <div className="shift-details">
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

                        <button className="details-btn">Ver Detalhes</button>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum plantão encontrado.</p>
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
                    setSelectedDay(info.dateStr);
                  }}
                  eventClick={(info) => {
                    alert(`Plantão em ${info.event.extendedProps.hospital}`);
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
