import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Settings,
  ArrowRight,
  Users,
  CalendarCheck,
  Building2,
  User,
} from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import {
  getDoctors,
  getEscalistas,
  getSetores,
} from "../Setores/setorServices.js";

import "./TelaPrincipal.css";

export default function TelaPrincipal() {
  const usuario = obterUsuarioLogado();
  const nomeUsuario = usuario?.name || "Usuário Hospital";
  const [setores, setSetores] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [escalistas, setEscalistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      setErro("");

      const [setoresData, medicosData, escalistasData] = await Promise.all([
        getSetores(),
        getDoctors(),
        getEscalistas(),
      ]);

      setSetores(Array.isArray(setoresData) ? setoresData : []);
      setMedicos(Array.isArray(medicosData) ? medicosData : []);
      setEscalistas(Array.isArray(escalistasData) ? escalistasData : []);
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

  const dadosDashboard = useMemo(() => {
    const escalistasAtivos = escalistas.filter(
      (escalista) => escalista.ativo !== false
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
    <div className="layout-escalista">
      <Sidebar />

      <main className="conteudo-escalista">
        {/* HEADER */}
        <header className="topo-escalista">
          <div>
            <h1>Painel Hospitalar</h1>
            <p>Bem-vindo de volta, {nomeUsuario}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <Settings className="icone-topo" />

            {/* ROSQUINHA DO USUÁRIO */}
            <div className="avatar-default">
              <User size={18} />
            </div>

            <span className="nome-hospital">{nomeUsuario}</span>
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
                    <p>{profissional.setorNome || "Sem setor vinculado"}</p>
                  </div>

                  <button type="button" className="botao-seta" aria-label="Abrir escalista">
                    <ArrowRight size={18} />
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
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return null;
  }

  try {
    return JSON.parse(usuarioSalvo);
  } catch {
    return { name: usuarioSalvo };
  }
}
