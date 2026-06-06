// TELA COM OS PLANTÕES QUE ESTÃO OFERTADOS
import React, { useEffect, useState } from "react";
import "./PlantoesOfertados.css";
import Sidebar from "../../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CircleUserRound,
  UserRound,
  ArrowLeftRight,
} from "lucide-react";
import NotificacaoBell from "../Notificacoes/NotificacaoBell";
import {
  assumirCobertura,
  cancelarPedidoCobertura,
  getCoberturasDisponiveis,
  getMeusPedidosCobertura,
  getDoctorMe,
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
  const [errosPorCard, setErrosPorCard] = useState({});
  const [filtro, setFiltro] = useState("disponivel");
  const [meuSetorIds, setMeuSetorIds] = useState(new Set());

  async function carregarCoberturas() {
    try {
      setLoading(true);
      setErro("");

      const [disponiveisData, meusPedidosData, perfilData] = await Promise.all([
        getCoberturasDisponiveis(),
        getMeusPedidosCobertura(),
        getDoctorMe(),
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

      const setorIds = new Set();
      if (perfilData?.setorId) setorIds.add(perfilData.setorId);
      if (Array.isArray(perfilData?.setores)) {
        perfilData.setores
          .filter((s) => s.ativo !== false)
          .forEach((s) => s.id && setorIds.add(s.id));
      }
      setMeuSetorIds(setorIds);
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
      setErrosPorCard((prev) => ({ ...prev, [pedidoId]: "" }));
      await assumirCobertura(pedidoId);
      await carregarCoberturas();
    } catch (error) {
      setErrosPorCard((prev) => ({
        ...prev,
        [pedidoId]: error.message || "Não foi possível assumir o plantão.",
      }));
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
    const podecancelar = isAberto && meuSetorIds.has(pedido.raw.setorId);

    const statusClass =
      pedido.status === "ABERTO"
        ? "status-aberto"
        : pedido.status === "ASSUMIDO"
          ? "status-assumido"
          : "status-cancelado";

    return (
      <div
        className={`shift-card${pedido.status === "CANCELADO" ? " shift-card--cancelado" : ""}`}
        key={`${modo}-${pedido.id}`}
      >
        <div className="card-header">
          <div className="card-title-section">
            <div>
              <h3>{pedido.setor}</h3>
              <span>{pedido.hospital}</span>
            </div>
          </div>

          <span className={`badge ${statusClass}`}>
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

        {errosPorCard[pedido.id] && (
          <div className="card-erro">
            {errosPorCard[pedido.id]}
          </div>
        )}

        <div className="card-buttons">
          <button
            className="details-btn"
            onClick={() => abrirDetalhes(pedido, modo)}
          >
            Ver Detalhes
          </button>

          {isDisponivel && (
            <button
              className="accept-btn"
              disabled={actionLoading === `assumir-${pedido.id}`}
              onClick={() => handleAssumir(pedido.id)}
            >
              {actionLoading === `assumir-${pedido.id}`
                ? "Assumindo..."
                : "Aceitar Plantão"}
            </button>
          )}

          {!isDisponivel && podecancelar && (
            <button
              className="accept-btn"
              disabled={actionLoading === `cancelar-${pedido.id}`}
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
            <NotificacaoBell className="icone-topo" />
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

        <div className="filtro-tabs">
          <button
            className={`filtro-tab${filtro === "disponivel" ? " filtro-tab--ativo" : ""}`}
            onClick={() => setFiltro("disponivel")}
          >
            Disponíveis para assumir
            {!loading && (
              <span className="filtro-contagem">{disponiveis.length}</span>
            )}
          </button>
          <button
            className={`filtro-tab${filtro === "meu" ? " filtro-tab--ativo" : ""}`}
            onClick={() => setFiltro("meu")}
          >
            Meus pedidos de cobertura
            {!loading && (
              <span className="filtro-contagem">
                {meusPedidos.filter((p) => p.status === "ABERTO").length}
              </span>
            )}
          </button>
        </div>

        {erro && <div className="alerta-login erro">{erro}</div>}

        <section className="cards-grid">
          {loading ? (
            <p>Carregando...</p>
          ) : filtro === "disponivel" ? (
            disponiveis.length > 0 ? (
              disponiveis.map((pedido) => renderCard(pedido, "disponivel"))
            ) : (
              <p>Nenhum plantão disponível para cobertura no momento.</p>
            )
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