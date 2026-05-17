import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import "./OferecerPlantao.css";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle,
} from "lucide-react";

const appointments = [
  {
    id: 1,
    hospital: "Hospital Santa Marta",
    setor: "Cardiologia - Unidade Morumbi",
    date: "24 de Outubro",
    time: "07:00 - 19:00",
    type: "Plantão diurno",
  },
  {
    id: 2,
    hospital: "Santa Casa de Misericórdia",
    setor: "Enfermaria - Cardiologia",
    date: "28 de Outubro",
    time: "08:00 - 14:00",
    type: "Plantão diurno",
  },
  {
    id: 3,
    hospital: "Hospital Sírio-Libanês",
    setor: "Pronto Atendimento - Cardiologia",
    date: "26 de Outubro",
    time: "19:00 - 07:00",
    type: "Plantão noturno",
  },
];

export default function OferecerPlantao() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const selectedAppointment = appointments.find(
    (appointment) => appointment.id === selectedId,
  );

  return (
    <div className="oferecer-layout">
      <Sidebar />

      <main className="oferecer-content">
        <header className="oferecer-header">
          <div className="header-top">
            <Link to="/PlantoesOfertados" className="back-btn">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1>Selecione um Plantão para Oferecer</h1>
              <p>
                Escolha um dos seus plantões agendados para disponibilizar na
                rede.
              </p>
            </div>
          </div>
        </header>

        <section className="appointments-panel">
          <div className="appointments-info-card">
            <h2>Meus Próximos Plantões</h2>
            <p>
              Selecione o plantão que deseja repassar. Depois, confirme para
              publicar a oferta.
            </p>
          </div>

          <div className="appointments-grid">
            {appointments.map((appointment) => (
              <button
                key={appointment.id}
                type="button"
                className={`appointment-card ${
                  selectedId === appointment.id ? "selected" : ""
                }`}
                onClick={() => setSelectedId(appointment.id)}
              >
                <div className="card-heading">
                  <div className="card-title-info">
                    <div>
                      <strong>{appointment.hospital}</strong>
                      <span>{appointment.setor}</span>
                    </div>
                    <div className="summary-info">
                      <span>{appointment.date}</span>
                      <span>{appointment.time}</span>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  {selectedId === appointment.id && <CheckCircle size={32} />}
                </div>
              </button>
            ))}
          </div>

          <div className="action-footer">
            <button
              type="button"
              className="confirm-btn"
              onClick={() =>
                selectedAppointment && navigate("/PlantoesOfertados")
              }
              disabled={!selectedAppointment}
            >
              Oferecer este Plantão
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
