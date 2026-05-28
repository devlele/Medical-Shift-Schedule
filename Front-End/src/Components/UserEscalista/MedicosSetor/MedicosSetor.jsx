import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  CircleUserRound,
  Search,
  Trash2,
  UserPlus,
  UserRound,
  Plus,
} from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import {
  desvincularMedicoSetor,
  getDoctors,
  getMedicosCandidatos,
  getMeusSetoresEscalista,
  vincularMedicoSetor,
} from "../../UserHospital/Setores/setorServices.js";
import { getStoredUser } from "../../../utils/authStorage";
import "./MedicosSetor.css";

export default function MedicosSetor() {
  const usuario = obterUsuarioLogado();
  const nomeUsuario = usuario?.name || "Escalista";

  const [setores, setSetores] = useState([]);
  const [setorId, setSetorId] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [termo, setTermo] = useState("");
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [associandoId, setAssociandoId] = useState("");
  const [removendoId, setRemovendoId] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (setorId) {
      buscarCandidatos(setorId, termo);
    }
  }, [setorId]);

  const setorAtual = useMemo(() => {
    return setores.find((setor) => String(setor.id) === String(setorId));
  }, [setorId, setores]);

  async function carregarDados() {
    try {
      setLoading(true);

      const [setoresData, medicosData] = await Promise.all([
        getMeusSetoresEscalista(),
        getDoctors(),
      ]);

      setSetores(setoresData || []);
      setMedicos(medicosData || []);
    } catch (error) {
      setErro("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function buscarCandidatos(idSetor = setorId, termoBusca = termo) {
    try {
      setBuscando(true);
      const data = await getMedicosCandidatos(idSetor, termoBusca);
      setCandidatos(data || []);
    } catch {
      setCandidatos([]);
    } finally {
      setBuscando(false);
    }
  }

  async function associarMedico(id) {
    await vincularMedicoSetor(id, setorId);
    await carregarDados();
  }

  async function removerVinculo(id) {
    await desvincularMedicoSetor(id, setorId);
    await carregarDados();
  }

  return (
    <div className="medicos-setor-layout">
      <Sidebar />

      <main className="medicos-setor-main">
        <header className="medicos-setor-header">
          <div>
            <h1>Profissionais Vinculados</h1>
            <p>Associe médicos ao setor</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <div className="usuario-topo">
              <CircleUserRound size={18} />
              <span>{nomeUsuario}</span>
            </div>
          </div>
        </header>

        <section className="medicos-info-card">
          <strong>{setorAtual?.nome || "Nenhum setor"}</strong>
        </section>

        <section className="medicos-grid">
          {/* BUSCA */}
          <article className="medicos-panel">
            <h2>Buscar Médicos</h2>

            <div className="medicos-search">
              <Search size={18} />
              <input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar..."
              />
              <button onClick={() => buscarCandidatos()}>Buscar</button>
            </div>

            {candidatos.map((m) => (
              <div className="medico-row" key={m.id}>
                <div className="medico-avatar">
                  <UserRound size={20} />
                </div>

                <div className="medico-info">
                  <strong>{m.name}</strong>
                  <span>{m.email}</span>
                </div>

                <button
                  className="medico-associar-btn"
                  onClick={() => associarMedico(m.id)}
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))}
          </article>

          {/* LISTA SETOR */}
          <article className="medicos-panel">
            <h2>Médicos do Setor</h2>

            {medicos.map((m) => (
              <div className="medico-row" key={m.id}>
                <div className="medico-avatar">
                  <UserRound size={20} />
                </div>

                <div className="medico-info">
                  <strong>{m.name}</strong>
                  <span>{m.email}</span>
                </div>

                <div className="medico-acoes">
                  {/* BOTÃO INFO (+) */}
                  <button
                    className="medico-info-btn"
                    onClick={() =>
                      (window.location.href = `/UserEscalista/MedicoSetor/MedicoInfo/${m.id}`)
                    }
                  >
                    <Plus size={18} />
                  </button>

                  {/* BOTÃO DELETE */}
                  <button
                    className="medico-remover-btn"
                    onClick={() => removerVinculo(m.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      </main>
    </div>
  );
}

function obterUsuarioLogado() {
  return getStoredUser();
}
