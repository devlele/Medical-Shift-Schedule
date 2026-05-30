import "./DetalhePlantao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlantaoById } from "../../UserHospital/Setores/setorServices";
import {
  formatDateLong,
  formatPlantaoTime,
  formatTurno,
  normalizePlantao,
} from "../../../utils/plantaoFormatters";

export default function DetalhePlantao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantao, setPlantao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPlantao() {
      try {
        setLoading(true);
        setErro("");
        const data = await getPlantaoById(id);
        if (ativo) setPlantao(normalizePlantao(data));
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar o plantão.");
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarPlantao();
    return () => { ativo = false; };
  }, [id]);

  return (
    <div className="detalhes-layout">
      <Sidebar />

      <main className="detalhes-content">
        <header className="detalhes-header">
          <div className="title-section">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/UserEscalista/TelaPrincipal")}
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1>{plantao?.setor || "Detalhes do Plantão"}</h1>
            </div>
          </div>
        </header>

        <div className="offer-button-container">
          <button
            className="offer-btn"
            onClick={() => navigate(`/UserEscalista/GerenciarPlantao/${id}`)}
          >
            <Pencil size={18} />
            Editar plantão
          </button>
        </div>

        <section className="top-section">
          <div className="details-card">
            {loading ? (
              <p>Carregando plantão...</p>
            ) : erro ? (
              <p className="erro-texto">{erro}</p>
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

                <div className="divider" />

                <div className="general-info">
                  <h3>INFORMAÇÕES GERAIS</h3>
                  <p>
                    Plantão {formatTurno(plantao.raw).toLowerCase()} em{" "}
                    {plantao.setor}, no {plantao.hospital}. Status atual:{" "}
                    {plantao.status}.
                  </p>

                  {Array.isArray(plantao.raw?.medicos) && plantao.raw.medicos.length > 0 && (
                    <>
                      <h3 style={{ marginTop: 28 }}>MÉDICOS RESPONSÁVEIS</h3>
                      <ul className="medicos-lista">
                        {plantao.raw.medicos.map((m) => (
                          <li key={m.id}>
                            {m.medicoResponsavelAtualNome || m.medicoTitularNome || `Médico #${m.id}`}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}