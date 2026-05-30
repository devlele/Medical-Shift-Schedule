import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bell,
  CircleUserRound,
  CalendarDays,
  Clock3,
  Building2,
  UserRound,
  AlertCircle,
  CheckCircle,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import {
  getPlantaoById,
  getDoctors,
  atualizarPlantao,
  excluirPlantao,
} from "../../UserHospital/Setores/setorServices.js";
import { getStoredUser } from "../../../utils/authStorage";
import { formatDateLong, formatTurno } from "../../../utils/plantaoFormatters";
import "./GerenciarPlantao.css";

export default function GerenciarPlantao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = getStoredUser();
  const nomeUsuario = usuario?.name || "Escalista";

  const [plantao, setPlantao] = useState(null);
  const [todosMedicos, setTodosMedicos] = useState([]);
  const [medicoIdsSelecionados, setMedicoIdsSelecionados] = useState([]);
  const [openMedico, setOpenMedico] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [plantaoData, medicosData] = await Promise.all([
        getPlantaoById(id),
        getDoctors(),
      ]);

      setPlantao(plantaoData);

      const medicosFiltrados = Array.isArray(medicosData)
        ? medicosData.filter(
            (m) => m.ativo !== false && m.setorId == plantaoData?.setorId
          )
        : [];
      setTodosMedicos(medicosFiltrados);

      const idsAtuais = Array.isArray(plantaoData?.medicos)
        ? plantaoData.medicos
            .map((m) =>
              String(m.medicoResponsavelAtualId || m.medicoTitularId || "")
            )
            .filter(Boolean)
        : [];
      setMedicoIdsSelecionados(idsAtuais);
    } catch (err) {
      setErro(err.message || "Erro ao carregar dados do plantão.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMedico(medicoId) {
    setErro("");
    setSucesso("");
    setMedicoIdsSelecionados((prev) => {
      const exists = prev.includes(medicoId);
      if (!exists && prev.length >= 4) {
        setErro("Um plantão pode ter no máximo 4 médicos.");
        return prev;
      }
      return exists
        ? prev.filter((m) => m !== medicoId)
        : [...prev, medicoId];
    });
  }

  async function handleSalvar() {
    if (!medicoIdsSelecionados.length) {
      setErro("Selecione pelo menos um médico.");
      return;
    }
    try {
      setSubmitting(true);
      setErro("");
      setSucesso("");
      await atualizarPlantao(id, {
        medicoTitular: { id: Number(medicoIdsSelecionados[0]) },
        medicoResponsavelAtual: { id: Number(medicoIdsSelecionados[0]) },
      });
      setSucesso("Plantão atualizado com sucesso!");
    } catch (err) {
      setErro(err.message || "Erro ao salvar alterações.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExcluir() {
    try {
      setDeleting(true);
      setErro("");
      await excluirPlantao(id);
      navigate("/UserEscalista/TelaPrincipal");
    } catch (err) {
      setErro(err.message || "Erro ao excluir plantão.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const turnoLabel = plantao
    ? formatTurno({ turno: plantao.turno, type: plantao.type })
    : "—";
  const dataLabel = plantao?.date
    ? formatDateLong(plantao.date)
    : plantao?.dataInicio
    ? formatDateLong(plantao.dataInicio.slice(0, 10))
    : "—";
  const horarioLabel = plantao?.time || "—";
  const setorLabel = plantao?.setor || "—";
  const statusMap = {
    AGENDADO: "Agendado",
    CANCELADO: "Cancelado",
    CONCLUIDO: "Concluído",
  };
  const statusLabel = statusMap[plantao?.status] || plantao?.status || "—";
  const tipoLabel =
    plantao?.tipoPlantao === "FIXO"
      ? "Fixo"
      : plantao?.tipoPlantao === "AVULSO"
      ? "Avulso"
      : "—";

  return (
    <div className="layout-escalista">
      <Sidebar />

      <main className="gerenciar-plantao-container">
        <header className="topo-escalista">
          <div>
            <button
              type="button"
              className="voltar-btn"
              onClick={() => navigate("/UserEscalista/TelaPrincipal")}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <h1>Gerenciar Plantão</h1>
            <p>Visualize e edite as informações deste plantão</p>
          </div>

          <div className="topo-direita">
            <Bell size={20} />
            <div className="usuario-topo">
              <CircleUserRound className="perfilEscalista" size={18} />
              <span className="perfilEscalista">{nomeUsuario}</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="gerenciar-estado">Carregando plantão...</div>
        ) : (
          <div className="gerenciar-conteudo">
            {erro && (
              <div className="alerta-plantao erro">
                <AlertCircle size={18} />
                <span>{erro}</span>
              </div>
            )}

            {sucesso && (
              <div className="alerta-plantao sucesso">
                <CheckCircle size={18} />
                <span>{sucesso}</span>
              </div>
            )}

            {/* INFORMAÇÕES FIXAS */}
            <section className="plantao-card">
              <h3 className="card-secao-titulo">Informações do Plantão</h3>

              <div className="linha-dupla-info">
                <CampoFixo
                  icon={<CalendarDays size={18} />}
                  label="Data"
                  value={dataLabel}
                />
                <CampoFixo
                  icon={<Clock3 size={18} />}
                  label="Horário"
                  value={horarioLabel}
                />
              </div>

              <div className="linha-dupla-info">
                <CampoFixo
                  icon={<Building2 size={18} />}
                  label="Setor"
                  value={setorLabel}
                />
                <CampoFixo
                  icon={<Clock3 size={18} />}
                  label="Turno"
                  value={turnoLabel}
                />
              </div>

              <div className="linha-dupla-info">
                <CampoFixo label="Tipo" value={tipoLabel} />
                <CampoFixo label="Status" value={statusLabel} />
              </div>
            </section>

            {/* MÉDICOS EDITÁVEL */}
            <section className="plantao-card">
              <h3 className="card-secao-titulo">Médicos Responsáveis</h3>

              <div className="campo">
                <label>Médicos do plantão</label>

                <div
                  className="input-box"
                  onClick={() => setOpenMedico((v) => !v)}
                  style={{ cursor: "pointer" }}
                >
                  <UserRound size={18} />
                  <span>
                    {medicoIdsSelecionados.length > 0
                      ? `${medicoIdsSelecionados.length} selecionado(s)`
                      : "Selecione médicos"}
                  </span>
                </div>

                {openMedico && (
                  <div className="dropdown-medicos">
                    {todosMedicos.length === 0 ? (
                      <div className="dropdown-item disabled">
                        Nenhum médico vinculado ao setor.
                      </div>
                    ) : (
                      todosMedicos.map((m) => (
                        <label key={m.id} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={medicoIdsSelecionados.includes(
                              String(m.id)
                            )}
                            onChange={() => toggleMedico(String(m.id))}
                          />
                          {m.name}
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {medicoIdsSelecionados.length > 0 && (
                <div className="medicos-chips">
                  {medicoIdsSelecionados.map((mid) => {
                    const medico = todosMedicos.find(
                      (m) => String(m.id) === mid
                    );
                    return (
                      <span key={mid} className="medico-chip">
                        {medico?.name || `Médico #${mid}`}
                      </span>
                    );
                  })}
                </div>
              )}
            </section>

            {/* AÇÕES */}
            <div className="gerenciar-footer">
              {!confirmDelete ? (
                <button
                  type="button"
                  className="excluir-btn"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={18} />
                  Excluir Plantão
                </button>
              ) : (
                <div className="confirmar-exclusao">
                  <span>Tem certeza?</span>
                  <button
                    type="button"
                    className="confirmar-btn"
                    onClick={handleExcluir}
                    disabled={deleting}
                  >
                    {deleting ? "Excluindo..." : "Confirmar"}
                  </button>
                  <button
                    type="button"
                    className="cancelar-btn"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              <button
                type="button"
                className="criar-btn"
                onClick={handleSalvar}
                disabled={submitting}
              >
                <Save size={18} />
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CampoFixo({ icon, label, value }) {
  return (
    <div className="campo">
      <label>{label}</label>
      <div className="input-box input-box-readonly">
        {icon && icon}
        <span>{value}</span>
      </div>
    </div>
  );
}