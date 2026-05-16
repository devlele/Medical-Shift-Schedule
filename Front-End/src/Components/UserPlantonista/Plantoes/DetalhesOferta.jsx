import "./DetalhesOferta.css";
import Sidebar from "../../Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";

export default function DetalhesOferta() {
  return (
    <div className="detalhes-layout">
      <Sidebar />

      <main className="detalhes-content">
        {/* HEADER */}
        <header className="detalhes-header">
          <div className="title-section">
            <Link to="/PlantoesOfertados" className="back-btn">
              <ArrowLeft size={24} />
            </Link>

            <div>
              <h1>Unidade de Terapia Intensiva</h1>
            </div>
          </div>

          <div className="header-buttons">
            <button className="aceitar-btn">Aceitar Plantão</button>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section className="top-section">
          <div className="details-card">
            <span className="shift-badge">UTI</span>

            <div className="info-container">
              <div className="info-item">
                <span className="info-title">Data do Plantão</span>

                <div className="info-value">
                  <CalendarDays size={24} />
                  <strong>24 de Outubro</strong>
                </div>
              </div>

              <div className="info-item">
                <span className="info-title">Carga Horária</span>

                <div className="info-value">
                  <Clock3 size={24} />
                  <strong>07:00 — 19:00</strong>
                </div>
              </div>

              <div className="info-item">
                <span className="info-title">Localização</span>

                <div className="info-value">
                  <MapPin size={24} />
                  <strong>Hospital Santa Maria</strong>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="general-info">
              <h3>INFORMAÇÕES GERAIS</h3>

              <p>
                Plantão em UTI de alta complexidade. O profissional será
                responsável pela evolução diária, procedimentos invasivos
                necessários e interface com as equipes de apoio. Necessária
                experiência comprovada em ambiente de terapia intensiva.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
