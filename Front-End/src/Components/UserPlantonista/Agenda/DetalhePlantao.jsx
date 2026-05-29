import "./DetalhePlantao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft,ArrowLeftRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlantao } from "../../../services/doctorServices";
import {
  formatDateLong,
  formatPlantaoTime,
  formatTurno,
  normalizePlantao,
} from "../../../utils/plantaoFormatters";
import { useNavigate } from "react-router-dom";

export default function DetalhePlantao() {
  const { id } = useParams();
  const [plantao, setPlantao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregarPlantao() {
      try {
        setLoading(true);
        setErro("");

        const data = await getPlantao(id);

        if (ativo) {
          setPlantao(normalizePlantao(data));
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar o plantao.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarPlantao();

    return () => {
      ativo = false;
    };
  }, [id]);

  return (
    <div className="detalhes-layout">
      <Sidebar />

      <main className="detalhes-content">
        {/* HEADER */}
        <header className="detalhes-header">
          <div className="title-section">
            <Link to="/UserPlantonista/Agenda" className="back-btn">
              <ArrowLeft size={24} />
            </Link>

            <div>
              <h1>{plantao?.setor || "Detalhes do Plantao"}</h1>
            </div>
          </div>
        </header>

        <div className="offer-button-container">
          <button
            className="offer-btn"
            onClick={() => navigate("/UserPlantonista/OferecerPlantao")}
          >
            <ArrowLeftRight size={18} />
            Oferecer plantão
          </button>
        </div>

        {/* CONTEÚDO */}
        <section className="top-section">
          <div className="details-card">
            {loading ? (
              <p>Carregando plantao...</p>
            ) : erro ? (
              <p>{erro}</p>
            ) : (
              <>
                <span className="shift-badge">{plantao.turno}</span>

                <div className="info-container">
                  <div className="info-item">
                    <span className="info-title">Data do Plantão</span>

                    <div className="info-value">
                      <CalendarDays size={24} />
                      <strong>{formatDateLong(plantao.date)}</strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-title">Carga Horária</span>

                    <div className="info-value">
                      <Clock3 size={24} />
                      <strong>{formatPlantaoTime(plantao.raw)}</strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-title">Localização</span>

                    <div className="info-value">
                      <MapPin size={24} />
                      <strong>{plantao.local}</strong>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="general-info">
                  <h3>INFORMAÇÕES GERAIS</h3>

                  <p>
                    Plantão {formatTurno(plantao.raw).toLowerCase()} em{" "}
                    {plantao.setor}, no {plantao.hospital}. Status atual:{" "}
                    {plantao.status}.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
