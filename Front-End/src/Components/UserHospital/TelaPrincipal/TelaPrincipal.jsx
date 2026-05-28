import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Users,
  CalendarCheck,
  Building2,
  CircleUserRound,
  User,
  Info,
  Trash2,
} from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";

import {
  getDoctors,
  getEscalistas,
  getSetores,
  getMeuDashboard,
  getSetoresByEscalista,
  excluirEscalista as excluirEscalistaService,
} from "../Setores/setorServices.js";

import { getStoredUser } from "../../../utils/authStorage";

import "./TelaPrincipal.css";

export default function TelaPrincipal() {
  const usuario = obterUsuarioLogado();

  const [nomeHospital, setNomeHospital] = useState("Hospital");
  const [setores, setSetores] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [escalistas, setEscalistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindoId, setExcluindoId] = useState("");

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      setErro("");

      const [setoresData, medicosData, escalistasData, dashboardData] =
        await Promise.all([
          getSetores(),
          getDoctors(),
          getEscalistas(),
          getMeuDashboard(),
        ]);

      console.log("DADOS DASHBOARD:", dashboardData);

      // PEGA O NOME DO HOSPITAL
      setNomeHospital(
        dashboardData?.hospital?.nomeFantasia ||
          dashboardData?.nomeFantasia ||
          dashboardData?.hospitalNome ||
          dashboardData?.nome ||
          dashboardData?.name ||
          usuario?.hospitalNome ||
          "Hospital",
      );

      setSetores(Array.isArray(setoresData) ? setoresData : []);
      setMedicos(Array.isArray(medicosData) ? medicosData : []);

      const lista = Array.isArray(escalistasData) ? escalistasData : [];
      const comSetores = await Promise.all(
        lista.map(async (e) => {
          try {
            const setoresE = await getSetoresByEscalista(e.id);
            const nomes = Array.isArray(setoresE)
              ? setoresE
                  .filter((s) => s.ativo !== false)
                  .map((s) => s.setorNome || s.nome || s.name)
                  .filter(Boolean)
                  .join(", ")
              : "";
            return { ...e, setoresNomes: nomes };
          } catch {
            return { ...e, setoresNomes: e.setorNome || "" };
          }
        }),
      );
      setEscalistas(comSetores);
    } catch (error) {
      console.error(error);

      setSetores([]);
      setMedicos([]);
      setEscalistas([]);

      setErro("Não foi possível carregar os dados do painel.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirEscalista = async (id) => {
    if (!window.confirm("Deseja realmente excluir este escalista?")) return;
    try {
      setExcluindoId(String(id));
      setErro("");
      await excluirEscalistaService(id);
      setEscalistas((prev) => prev.filter((e) => String(e.id) !== String(id)));
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível excluir o escalista.");
    } finally {
      setExcluindoId("");
    }
  };

  const dadosDashboard = useMemo(() => {
    const escalistasAtivos = escalistas.filter(
      (escalista) => escalista.ativo !== false,
    );

    const medicosAtivos = medicos.filter((medico) => medico.ativo !== false);

    const setoresAtivos = setores.filter((setor) => setor.ativo !== false);

    return {
      colaboradores: escalistasAtivos.length + medicosAtivos.length,

      escalistas: escalistasAtivos.length,

      setores: setoresAtivos.length,

      escalistasAtivos,
    };
  }, [escalistas, medicos, setores]);

  return (
    <div className="layout-hospital">
      <Sidebar />

      <main className="conteudo-hospital">
        {/* HEADER */}
        <header className="topo-hospital">
          <div>
            <h1>Painel Hospitalar</h1>

            <p>Bem-vindo de volta, {loading ? "..." : nomeHospital}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />

            <div className="usuario-topo">
              <CircleUserRound className="perfilHospital" />

              <span className="perfilHospital">
                {loading ? "..." : nomeHospital}
              </span>
            </div>
          </div>
        </header>

        {erro && <div className="erro-dashboard">{erro}</div>}

        {/* CARDS */}
        <section className="cards-dashboard">
          <article className="card-dashboard">
            <div className="icone-card azul">
              <Users size={22} />
            </div>

            <span>Colaboradores</span>

            <strong>{loading ? "..." : dadosDashboard.colaboradores}</strong>
          </article>

          <article className="card-dashboard">
            <div className="icone-card verde">
              <CalendarCheck size={22} />
            </div>

            <span>Escalistas Disponíveis</span>

            <strong>{loading ? "..." : dadosDashboard.escalistas}</strong>
          </article>

          <article className="card-dashboard">
            <div className="icone-card escuro">
              <Building2 size={22} />
            </div>

            <span>Setores Ativos</span>

            <strong>{loading ? "..." : dadosDashboard.setores}</strong>
          </article>
        </section>

        {/* ESCALISTAS */}
        <section className="secao-profissionais">
          <div className="cabecalho-secao">
            <h2>Meus Escalistas</h2>
          </div>

          {loading ? (
            <div className="estado-dashboard">Carregando escalistas...</div>
          ) : dadosDashboard.escalistasAtivos.length === 0 ? (
            <div className="estado-dashboard">Nenhum escalista cadastrado.</div>
          ) : (
            <div className="grid-profissionais">
              {dadosDashboard.escalistasAtivos.map((profissional) => (
                <article key={profissional.id} className="card-profissional">
                  <div className="avatar-escalista">
                    <User size={22} />
                  </div>

                  <div className="info-profissional">
                    <h3>{profissional.name}</h3>
                    <p>{profissional.setoresNomes || "Sem setor vinculado"}</p>
                  </div>

                  <NavLink
                    to={`/UserHospital/EscalistaInfo/${profissional.id}`}
                    state={{ escalista: profissional }}
                    className="escalista-info-btn"
                    aria-label="Ver detalhes do escalista"
                  >
                    <Info size={18} />
                  </NavLink>

                  <button
                    type="button"
                    className="escalista-excluir-btn"
                    onClick={() => handleExcluirEscalista(profissional.id)}
                    disabled={excluindoId === String(profissional.id)}
                    aria-label="Excluir escalista"
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function obterUsuarioLogado() {
  return getStoredUser();
}
