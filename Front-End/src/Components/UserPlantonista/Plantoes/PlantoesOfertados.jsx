// TELA COM OS PLANTÕES QUE ESTÃO OFERTADOS
import React, { useEffect, useState } from "react";
import "./PlantoesOfertados.css";
import Sidebar from "../../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Clock3,
  CircleUserRound,
  UserRound,
  ArrowLeftRight,
} from "lucide-react";
import {
  assumirCobertura,
  cancelarPedidoCobertura,
  getCoberturasDisponiveis,
  getMeusPedidosCobertura,
} from "../../../services/doctorServices";
import {
  formatDateLong,
  getUsuarioLogado,
  normalizePedidoCobertura,
} from "../../../utils/plantaoFormatters";

export default function PlantoesOfertados() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [disponiveis, setDisponiveis] = useState([]);
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [erro, setErro] = useState("");

  async function carregarCoberturas() {
    try {
      setLoading(true);
      setErro("");

      const [disponiveisData, meusPedidosData] = await Promise.all([
        getCoberturasDisponiveis(),
        getMeusPedidosCobertura(),
      ]);

      setDisponiveis(
        (Array.isArray(disponiveisData) ? disponiveisData : []).map(
          normalizePedidoCobertura,
        ),
      );
      setMeusPedidos(
        (Array.isArray(meusPedidosData) ? meusPedidosData : []).map(
          normalizePedidoCobertura,
        ),
      );
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar as ofertas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCoberturas();
  }, []);

  async function handleAssumir(pedidoId) {
    try {
      setActionLoading(`assumir-${pedidoId}`);
      setErro("");
      await assumirCobertura(pedidoId);
      await carregarCoberturas();
    } catch (error) {
      setErro(error.message || "Nao foi possivel assumir o plantao.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelar(pedidoId) {
    try {
      setActionLoading(`cancelar-${pedidoId}`);
      setErro("");
      await cancelarPedidoCobertura(pedidoId);
      await carregarCoberturas();
    } catch (error) {
      setErro(error.message || "Nao foi possivel cancelar o pedido.");
    } finally {
      setActionLoading(null);
    }
  }

  function abrirDetalhes(pedido, modo) {
    navigate("/UserPlantonista/DetalhesOferta", {
      state: { pedido: pedido.raw, modo },
    });
  }

  function renderCard(pedido, modo) {
    const isDisponivel = modo === "disponivel";
    const isAberto = pedido.status === "ABERTO";

    return (
      <div className="shift-card" key={`${modo}-${pedido.id}`}>
        <div className="card-header">
          <div className="card-title-section">
            <div>
              <h3>{pedido.setor}</h3>
              <span>{pedido.hospital}</span>
            </div>
          </div>

          <span className={`badge ${isDisponivel ? "urgent" : "routine"}`}>
            {pedido.status}
          </span>
        </div>

        <div className="card-info">
          <div className="info-row">
            <CalendarDays size={18} />
            <span>{formatDateLong(pedido.plantao.date)}</span>
          </div>

          <div className="info-row">
            <Clock3 size={18} />
            <span>{pedido.plantao.time}</span>
          </div>

          <div className="info-row">
            <UserRound size={18} />
            <span>
              {isDisponivel
                ? `Ofertado por: ${pedido.medicoSolicitante}`
                : pedido.medicoCobridor
                  ? `Coberto por: ${pedido.medicoCobridor}`
                  : "Aguardando cobertura"}
            </span>
          </div>
        </div>

        <div className="card-buttons">
          <button
            className="details-btn"
            onClick={() => abrirDetalhes(pedido, modo)}
          >
            Ver Detalhes
          </button>

          {isDisponivel ? (
            <button
              className="accept-btn"
              disabled={actionLoading === `assumir-${pedido.id}`}
              onClick={() => handleAssumir(pedido.id)}
            >
              {actionLoading === `assumir-${pedido.id}`
                ? "Assumindo..."
                : "Aceitar Plantão"}
            </button>
          ) : (
            <button
              className="accept-btn"
              disabled={!isAberto || actionLoading === `cancelar-${pedido.id}`}
              onClick={() => handleCancelar(pedido.id)}
            >
              {actionLoading === `cancelar-${pedido.id}`
                ? "Cancelando..."
                : "Cancelar Pedido"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="plantoes-layout">
      <Sidebar />

      <main className="plantoes-content">
        <header className="topo">
          <div>
            <h1>Oferta de Plantões</h1>
            <p>
              Plantões ofertados, para ver mais informações clique em "ver
              detalhes".
            </p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <div className="usuario-topo">
              <CircleUserRound className="perfilPlantonista" />
              <span className="perfilPlantonista">{usuario?.name || "Medico"}</span>
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

        {erro && <div className="alerta-login erro">{erro}</div>}

        <section className="cards-grid">
          <div className="section-heading">
            <h2>Disponíveis para assumir</h2>
          </div>

          {loading ? (
            <p>Carregando ofertas...</p>
          ) : disponiveis.length > 0 ? (
            disponiveis.map((pedido) => renderCard(pedido, "disponivel"))
          ) : (
            <p>Nenhum plantão disponível para cobertura no momento.</p>
          )}

          <div className="section-heading">
            <h2>Meus pedidos de cobertura</h2>
          </div>

          {loading ? (
            <p>Carregando pedidos...</p>
          ) : meusPedidos.length > 0 ? (
            meusPedidos.map((pedido) => renderCard(pedido, "meu"))
          ) : (
            <p>Você ainda não abriu pedidos de cobertura.</p>
          )}
        </section>
      </main>
    </div>
  );
}
