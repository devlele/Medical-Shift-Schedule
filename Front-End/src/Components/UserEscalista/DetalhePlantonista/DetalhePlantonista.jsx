import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
    getDoctorById,
    getMinhaAgenda,
} from "../../UserHospital/Setores/setorServices.js";
import {
    getPlantaoType,
    normalizePlantao,
} from "../../../utils/plantaoFormatters";

import Sidebar from "../../Sidebar/Sidebar";
import "./DetalhePlantonista.css";

export default function ProfissionalVinculado() {
    const { id } = useParams();
    const calendarRef = useRef(null);

    const [currentMonth, setCurrentMonth] = useState("");
    const [profissional, setProfissional] = useState(null);
    const [plantoes, setPlantoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Escalista";

    useEffect(() => {
        carregarDetalhes();
    }, [id]);

    async function carregarDetalhes() {
        if (!id) {
            setErro("Médico não informado.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErro("");

            const [doctorData, agendaData] = await Promise.all([
                getDoctorById(id),
                getMinhaAgenda(),
            ]);

            setProfissional(doctorData);
            setPlantoes(
                Array.isArray(agendaData)
                    ? agendaData.filter((plantao) => plantaoPertenceAoMedico(plantao, id))
                    : [],
            );
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar o médico.");
            setProfissional(null);
            setPlantoes([]);
        } finally {
            setLoading(false);
        }
    }

    const eventos = useMemo(() => {
        return plantoes.map((plantao) => {
            const plantaoNormalizado = normalizePlantao(plantao);
            const isNight = getPlantaoType(plantaoNormalizado).includes("noite");

            return {
                title: isNight ? "Noturno" : "Diurno",
                start: plantaoNormalizado.date,
                className: isNight ? "event-night" : "event-day",
            };
        });
    }, [plantoes]);

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
                            Visualize as informações do médico e seus plantões.
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

                {erro && <div className="estado-profissional erro">{erro}</div>}

                {/* CARD PROFISSIONAL */}
                <section className="doctor-card">
                    {loading ? (
                        <div className="estado-profissional">Carregando médico...</div>
                    ) : profissional ? (
                        <>
                            <div className="doctor-left">
                                <div>
                                    <h2>{profissional.name || profissional.nome}</h2>

                                    <p>CRM: {profissional.crm || "-"}</p>
                                    <p>CPF: {profissional.cpf || "-"}</p>
                                    <p>Telefone: {profissional.telefone || "-"}</p>
                                </div>
                            </div>

                            <div className="doctor-right">
                                <h4>{profissional.specialty || "Especialidade não informada"}</h4>
                                <h4>Email: {profissional.email || "-"}</h4>
                            </div>
                        </>
                    ) : (
                        <div className="estado-profissional">Médico não encontrado.</div>
                    )}
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

function plantaoPertenceAoMedico(plantao, medicoId) {
    const id = String(medicoId);

    if (String(plantao.doctorId || "") === id) {
        return true;
    }

    return Array.isArray(plantao.medicos)
        ? plantao.medicos.some((medico) =>
            [medico.medicoTitularId, medico.medicoResponsavelAtualId]
                .filter(Boolean)
                .map(String)
                .includes(id),
        )
        : false;
}
