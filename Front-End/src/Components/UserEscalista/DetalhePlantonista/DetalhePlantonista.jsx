import React, { useMemo, useRef, useState } from "react";
import {
    Bell,
    CircleUserRound,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { getStoredUser } from "../../../utils/authStorage";

import Sidebar from "../../Sidebar/Sidebar";
import "./DetalhePlantonista.css";

export default function ProfissionalVinculado() {
    const calendarRef = useRef(null);

    const [currentMonth, setCurrentMonth] = useState("Março 2026");

    const profissional = {
        nome: "Dr. House",
        especialidade: "Cardiologista",
        crm: "123456",
        cpf: "523.455.789-12",
        email: "house@gmail.com",
        telefone: "(15) 98117-1506",
    };

    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Escalista";

    const eventos = useMemo(
        () => [
            {
                title: "DAY SHIFT",
                start: "2026-03-02",
                className: "event-day",
            },
            {
                title: "NIGHT SHIFT",
                start: "2026-03-04",
                className: "event-night",
            },
            {
                title: "DAY SHIFT",
                start: "2026-03-10",
                className: "event-day",
            },
            {
                title: "NIGHT SHIFT",
                start: "2026-03-16",
                className: "event-night",
            },
            {
                title: "DAY SHIFT",
                start: "2026-03-20",
                className: "event-day",
            },
            {
                title: "NIGHT SHIFT",
                start: "2026-03-25",
                className: "event-night",
            },
        ],
        []
    );

    function updateMonthTitle(calendarApi) {
        const currentDate = calendarApi.getDate();

        const monthYear = currentDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        });

        setCurrentMonth(
            monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
        );
    }

    function handlePreviousMonth() {
        const calendarApi = calendarRef.current?.getApi();

        if (!calendarApi) return;

        calendarApi.prev();
        updateMonthTitle(calendarApi);
    }

    function handleNextMonth() {
        const calendarApi = calendarRef.current?.getApi();

        if (!calendarApi) return;

        calendarApi.next();
        updateMonthTitle(calendarApi);
    }

    return (
        <div className="professional-page">
            <Sidebar />

            <main className="professional-content">
                {/* HEADER */}
                <header className="professional-header">
                    <div>
                        <h1>Profissionais Vinculados</h1>

                        <p>
                            Visualiza as informações do Dr House e seus plantões.
                        </p>
                    </div>

                    <div className="header-actions">
                        <Bell size={22} />

                        <div className="usuario-topo">
                            <CircleUserRound className="perfilEscalista" />

                            <span className="perfilEscalista">
                                {nomeUsuario}
                            </span>
                        </div>
                    </div>
                </header>

                {/* CARD PROFISSIONAL */}
                <section className="doctor-card">
                    <div className="doctor-left">
                        <div>
                            <h2>{profissional.nome}</h2>

                            <p>CRM: {profissional.crm}</p>
                            <p>CPF: {profissional.cpf}</p>
                            <p>Telefone: {profissional.telefone}</p>
                        </div>
                    </div>

                    <div className="doctor-right">
                        <h4>{profissional.especialidade}</h4>
                        <h4>Email: {profissional.email}</h4>
                    </div>
                </section>

                {/* CALENDÁRIO */}
                <section className="calendar-section">
                    <div className="calendar-header">
                        <div>
                            <h2>{currentMonth}</h2>
                            <p>Escala Mensal</p>
                        </div>

                        <div className="calendar-navigation">
                            <button onClick={handlePreviousMonth}>
                                <ChevronLeft />
                            </button>

                            <button onClick={handleNextMonth}>
                                <ChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="calendar-wrapper">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[
                                dayGridPlugin,
                                interactionPlugin,
                            ]}
                            locale={ptBrLocale}
                            initialView="dayGridMonth"
                            initialDate="2026-03-01"
                            headerToolbar={false}
                            fixedWeekCount={false}
                            height="auto"
                            events={eventos}
                            datesSet={(dateInfo) => {
                                const monthYear =
                                    dateInfo.view.currentStart.toLocaleDateString(
                                        "pt-BR",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    );

                                setCurrentMonth(
                                    monthYear.charAt(0).toUpperCase() +
                                    monthYear.slice(1)
                                );
                            }}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}