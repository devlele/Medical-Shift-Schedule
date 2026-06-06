import "./DetalhesOferta.css";
import Sidebar from "../../Sidebar/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useState } from "react";
import {
  assumirCobertura,
  cancelarPedidoCobertura,
} from "../../../services/doctorServices";
import {
  formatDateLong,
  normalizePedidoCobertura,
} from "../../../utils/plantaoFormatters";

export default function DetalhesOferta() {
  const navigate = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido
    ? normalizePedidoCobertura(location.state.pedido)
    : null;
  const modo = location.state?.modo;
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleAssumir() {
    if (!pedido) {
      return;
    }

    try {
      setLoading(true);
      setErro("");
      await assumirCobertura(pedido.id);
      navigate("/UserPlantonista/PlantoesOfertados");
    } catch (error) {
      setErro(error.message || "Nao foi possivel assumir este plantao.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar() {
    if (!pedido) {
      return;
    }

    try {
      setLoading(true);
      setErro("");
      await cancelarPedidoCobertura(pedido.id);
      navigate("/UserPlantonista/PlantoesOfertados");
    } catch (error) {
      setErro(error.message || "Nao foi possivel cancelar este pedido.");
    } finally {
      setLoading(false);
    }
  }

  const statusClass = pedido
    ? pedido.status === "ABERTO"
      ? "status-aberto"
      : pedido.status === "ASSUMIDO"
        ? "status-assumido"
        : "status-cancelado"
    : "";

  return (
    <div className="detalhes-layout">
      <Sidebar />

      <main className="detalhes-content">
        {/* HEADER */}
        <header className="detalhes-header">
          <div className="title-section">
            <Link to="/UserPlantonista/PlantoesOfertados" className="back-btn">
              <ArrowLeft size={24} />
            </Link>

            <div>
              <h1>{pedido?.setor || "Detalhes da Oferta"}</h1>
            </div>
          </div>

          {pedido && modo !== "meu" && (
            <div className="header-buttons">
              <button
                className="aceitar-btn"
                disabled={loading}
                onClick={handleAssumir}
              >
                {loading ? "Assumindo..." : "Aceitar Plantão"}
              </button>
            </div>
          )}

          {pedido && modo === "meu" && pedido.status === "ABERTO" && (
            <div className="header-buttons">
              <button
                className="aceitar-btn"
                disabled={loading}
                onClick={handleCancelar}
              >
                {loading ? "Cancelando..." : "Cancelar Pedido"}
              </button>
            </div>
          )}
        </header>

        {/* CONTEÚDO */}
        <section className="top-section">
          <div className="details-card">
            {!pedido ? (
              <p>Selecione uma oferta na lista para visualizar os detalhes.</p>
            ) : (
              <>
                {erro && <div className="erro-oferta">{erro}</div>}

                <span className={`shift-badge ${statusClass}`}>
                  {pedido.status}
                </span>

                <div className="info-container">
                  <div className="info-item">
                    <span className="info-title">Data do Plantão</span>

                    <div className="info-value">
                      <CalendarDays size={24} />
                      <strong>{formatDateLong(pedido.plantao.date)}</strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-title">Carga Horária</span>

                    <div className="info-value">
                      <Clock3 size={24} />
                      <strong>{pedido.plantao.time}</strong>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-title">Localização</span>

                    <div className="info-value">
                      <MapPin size={24} />
                      <strong>{pedido.plantao.local}</strong>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="general-info">
                  <h3>INFORMAÇÕES GERAIS</h3>

                  {modo === "meu" ? (
                    <p>
                      Você abriu este pedido de cobertura para o plantão em{" "}
                      {pedido.setor}, no {pedido.hospital}. Status atual:{" "}
                      {pedido.status}
                      {pedido.medicoCobridor
                        ? `. Coberto por ${pedido.medicoCobridor}.`
                        : "."}
                    </p>
                  ) : (
                    <p>
                      {pedido.medicoSolicitante} está oferecendo este plantão em{" "}
                      {pedido.setor}, no {pedido.hospital}. Ao aceitar, você se
                      torna o médico responsável por essa cobertura.
                    </p>
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