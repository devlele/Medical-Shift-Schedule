import React, { useEffect, useMemo, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import userImg from "../../../assets/drhouse.png";
import Calendario from "../../Calendario/Calendario";
import {
  getCoberturasDisponiveis,
  getDoctorDashboard,
  getMeusPedidosCobertura,
  getMinhaAgendaMedico,
} from "../../../services/doctorServices";
import {
  formatPlantaoTime,
  getPlantaoDate,
  getPlantaoType,
  getUsuarioLogado,
  normalizePedidoCobertura,
  normalizePlantao,
} from "../../../utils/plantaoFormatters";

import "./TelaPrincipal.css";

export default function TelaPrincipal() {
  const usuario = getUsuarioLogado();
  const [dashboard, setDashboard] = useState(null);
  const [plantoes, setPlantoes] = useState([]);
  const [coberturas, setCoberturas] = useState([]);
  const [meusPedidosCobertura, setMeusPedidosCobertura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setErro("");

        const [dashboardData, agendaData, coberturasData, meusPedidosData] =
          await Promise.all([
            getDoctorDashboard(),
            getMinhaAgendaMedico(),
            getCoberturasDisponiveis(),
            getMeusPedidosCobertura(),
          ]);

        if (!ativo) {
          return;
        }

        setDashboard(dashboardData);
        setPlantoes(Array.isArray(agendaData) ? agendaData : []);
        setCoberturas(Array.isArray(coberturasData) ? coberturasData : []);
        setMeusPedidosCobertura(
          Array.isArray(meusPedidosData) ? meusPedidosData : [],
        );
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar o painel.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);

  const nomeUsuario = dashboard?.name || usuario?.name || "medico";

  const plantoesNormalizados = useMemo(() => {
    const base = dashboard?.proximosPlantoes?.length
      ? dashboard.proximosPlantoes
      : plantoes;

    return base.map(normalizePlantao);
  }, [dashboard, plantoes]);

  const eventosCalendario = useMemo(() => {
    const plantaoIdsComPedidoProprio = new Set(
      meusPedidosCobertura
        .map((pedido) => pedido.plantao?.id)
        .filter((id) => id != null),
    );

    const eventosPlantao = plantoes.map((plantao) => {
      const type = getPlantaoType(plantao);
      const hasPedidoProprio = plantaoIdsComPedidoProprio.has(plantao.id);
      const kind = hasPedidoProprio ? "pedido-proprio" : "plantao";

      return {
        id: plantao.id,
        title: plantao.hospital || plantao.setor || "Plantao",
        date: getPlantaoDate(plantao),
        tipo: `${plantao.setor || "Setor"} • ${formatPlantaoTime(plantao)}`,
        kind,
        color: hasPedidoProprio
          ? "#2f80ed"
          : type.includes("noite") || type.includes("noturno")
            ? "#3c8f75"
            : "#1f7a63",
        targetPath: hasPedidoProprio
          ? "/UserPlantonista/PlantoesOfertados"
          : `/UserPlantonista/DetalhePlantao/${plantao.id}`,
      };
    });

    const eventosCobertura = coberturas.map((pedido) => {
      const cobertura = normalizePedidoCobertura(pedido);

      return {
        id: `cobertura-${cobertura.id}`,
        title: `Oferta: ${cobertura.setor}`,
        date: cobertura.plantao.date,
        kind: "cobertura",
        color: "#d64545",
        targetPath: "/UserPlantonista/PlantoesOfertados",
      };
    });

    return [...eventosPlantao, ...eventosCobertura];
  }, [plantoes, coberturas, meusPedidosCobertura]);

  const plantoesNoMes = dashboard?.plantoesNoMes ?? plantoes.length;
  const alertasConflito = dashboard?.alertasConflito ?? 0;

  function getDateParts(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return { day: "--", month: "" };
    }

    return {
      day: String(date.getDate()).padStart(2, "0"),
      month: date
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "")
        .toUpperCase(),
    };
  }

  return (
    <div className="layout">
      <Sidebar />

      <main className="conteudo">
        {/* TOPO */}
        <header className="topo">
          <div>
            <h1>Painel de Controle</h1>
            <p>Bem-vindo de volta, {nomeUsuario}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <Settings className="icone-topo" />

            <div className="user">
              <img src={userImg} alt="user" />
              <span>{nomeUsuario}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        {/* CARDS */}
        <section className="cards">
          <NavLink
            to="/UserPlantonista/ResolucaoConflito"
            className="card alerta"
          >
            <span className="badge">CRITICO</span>
            <p>ALERTAS DE CONFLITO</p>
            <h2>{alertasConflito}</h2>
          </NavLink>

          <div className="card">
            <p>PLANTOES NO MES</p>
            <h2>{plantoesNoMes}</h2>
          </div>

          <NavLink to="/UserPlantonista/PlantoesOfertados" className="card">
            <p>OFERTAS DISPONIVEIS</p>
            <h2>{coberturas.length}</h2>
          </NavLink>
        </section>

        {/* CONTEÚDO */}
        <section className="grid">
          {/* CALENDÁRIO */}
          <Calendario eventos={eventosCalendario} />

          {/* LATERAL DIREITA */}
          <div className="proximos">
            <div className="proximos-topo">
              <h3>Próximos Plantões</h3>
              <NavLink to="/UserPlantonista/Agenda">Ver todos</NavLink>
            </div>

            {loading ? (
              <p>Carregando plantões...</p>
            ) : plantoesNormalizados.length > 0 ? (
              plantoesNormalizados.map((plantao) => {
                const dateParts = getDateParts(plantao.date);

                return (
                  <div className="plantao" key={plantao.id}>
                    <div className="data">
                      <span>{dateParts.month}</span>
                      <strong>{dateParts.day}</strong>
                    </div>

                    <div className="info">
                      <p>{plantao.hospital}</p>
                      <span>
                        {plantao.setor} • {plantao.time}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="plantao">
                <div className="info">
                  <p>Nenhum plantão agendado.</p>
                  <span>
                    Quando o escalista criar um plantão, ele aparecerá aqui.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
