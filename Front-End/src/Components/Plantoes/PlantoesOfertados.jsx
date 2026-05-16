// TELA COM OS PLANTÕES QUE ESTÃO OFERTADOS
import fotoPerfil from "../../assets/drhouse.png";
import "./PlantoesOfertados.css";
import Sidebar from "../Sidebar/Sidebar"
import { Link } from "react-router-dom";
import { Bell, Settings, CalendarDays, Clock3, UserRound, ArrowLeftRight, } from "lucide-react";

const shifts = [
    {
        id: 1,
        title: "Pronto Socorro Adulto",
        hospital: "Hospital Santa Maria",
        date: "Terça-feira, 24 de Outubro",
        time: "19:00 - 07:00 (12h - Noturno)",
        doctor: "Dr. Ricardo S.",
        type: "URGENTE",
        typeClass: "urgent",
    },
    {
        id: 2,
        title: "UTI Cardiológica",
        hospital: "Hospital Santa Maria",
        date: "Quarta-feira, 25 de Outubro",
        time: "07:00 - 19:00 (12h - Diurno)",
        doctor: "Dra. Mariana L.",
        type: "ROTINA",
        typeClass: "routine",
    },
    {
        id: 3,
        title: "Ambulatório Clínico",
        hospital: "Hospital Santa Maria",
        date: "Sexta-feira, 27 de Outubro",
        time: "08:00 - 14:00 (06h - Diurno)",
        doctor: "Dr. Arthur P.",
        type: "ROTINA",
        typeClass: "routine",
    },
    {
        id: 4,
        title: "UTI Cardiológica",
        hospital: "Hospital Santa Maria",
        date: "Quarta-feira, 25 de Outubro",
        time: "07:00 - 19:00 (12h - Diurno)",
        doctor: "Dra. Mariana L.",
        type: "ROTINA",
        typeClass: "routine",
    },
];

export default function PlantoesOfertados() {
    return (
        <div className="plantoes-layout">
            <Sidebar />

            <main className="plantoes-content">
                <header className="topo">
                    <div>
                        <h1>Oferta de Plantões</h1>
                        <p>Plantões ofertados, para ver mais informações clique em "ver detalhes".</p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <Settings className="icone-topo" />
                        <div className="user">
                            <img src={fotoPerfil} alt="Dr. House" />
                            <span>Dr. House</span>
                        </div>
                    </div>
                </header>

                <div className="offer-button-container">
                    <button className="offer-btn">
                        <ArrowLeftRight size={18} />
                        Oferecer plantão
                    </button>
                </div>

                <section className="cards-grid">
                    {shifts.map((shift) => (
                        <div className="shift-card" key={shift.id}>
                            <div className="card-header">
                                <div className="card-title-section">

                                    <div>
                                        <h3>{shift.title}</h3>
                                        <span>{shift.hospital}</span>
                                    </div>
                                </div>

                                <span className={`badge ${shift.typeClass}`}>
                                    {shift.type}
                                </span>
                            </div>

                            <div className="card-info">
                                <div className="info-row">
                                    <CalendarDays size={18} />
                                    <span>{shift.date}</span>
                                </div>

                                <div className="info-row">
                                    <Clock3 size={18} />
                                    <span>{shift.time}</span>
                                </div>

                                <div className="info-row">
                                    <UserRound size={18} />
                                    <span>Ofertado por: {shift.doctor}</span>
                                </div>
                            </div>

                            <div className="card-buttons">
                                <button className="details-btn">
                                    <Link to="/DetalhesOferta" className="detalhes-oferta">
                                        Ver Detalhes
                                    </Link> 
                                </button>

                                <button className="accept-btn">
                                    Aceitar Plantão
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}