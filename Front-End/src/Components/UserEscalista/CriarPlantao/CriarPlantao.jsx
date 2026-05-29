import { useEffect, useMemo, useState } from "react";
import "./CriarPlantao.css";
import Sidebar from "../../Sidebar/Sidebar";

import {
  Bell,
  CalendarDays,
  Clock3,
  Building2,
  CircleUserRound,
  UserRound,
  RotateCcw,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import {
  criarPlantaoAvulso,
  criarPlantaoFixo,
  getDoctors,
  getMeusSetoresEscalista,
} from "../../UserHospital/Setores/setorServices.js";

import { getStoredUser } from "../../../utils/authStorage";

// const initialFormData = {
//   dataPlantao: "",
//   horaInicio: "07:00",
//   horaFim: "19:00",
//   setorId: "",
//   medicoIds: [],
//   openMedico: false,
//   frequencia: "unico",
// };

const initialFormData = {
  dataPlantao: "",
  horaInicio: "07:00",
  horaFim: "19:00",
  tipoTurno: "DIURNO",
  setorId: "",
  medicoIds: [],
  openMedico: false,
  frequencia: "unico",
};

export default function CriarPlantao() {
  const usuario = obterUsuarioLogado();
  const nomeUsuario = usuario?.name || "Escalista";

  const [formData, setFormData] = useState(initialFormData);
  const [setores, setSetores] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const medicosDisponiveis = useMemo(() => medicos, [medicos]);

  async function carregarDados() {
    try {
      setLoadingDados(true);
      setErro("");

      const [setoresData, medicosData] = await Promise.all([
        getMeusSetoresEscalista(),
        getDoctors(),
      ]);

      const setoresNormalizados = Array.isArray(setoresData)
        ? setoresData
          .filter((v) => v.ativo !== false)
          .map((v) => ({
            id: v.setorId,
            nome: v.setorNome,
          }))
        : [];

      const medicosNormalizados = Array.isArray(medicosData)
        ? medicosData.filter((m) => m.ativo !== false)
        : [];

      setSetores(setoresNormalizados);
      setMedicos(medicosNormalizados);

      setFormData((prev) => ({
        ...prev,
        setorId: String(setoresNormalizados[0]?.id || ""),
      }));
    } catch (error) {
      setErro(error.message || "Erro ao carregar dados");
    } finally {
      setLoadingDados(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErro("");
    setSucesso("");
  }

  function toggleMedico(id) {
    setFormData((prev) => {
      const exists = prev.medicoIds.includes(id);

      return {
        ...prev,
        medicoIds: exists
          ? prev.medicoIds.filter((m) => m !== id)
          : [...prev.medicoIds, id],
      };
    });
  }

  function handleFrequencia(tipo) {
    setFormData((prev) => ({
      ...prev,
      frequencia: tipo,
    }));
  }

  // ADICIONADO
  function handleTipoTurno(tipo) {
    setErro("");
    setSucesso("");

    if (tipo === "DIURNO") {
      setFormData((prev) => ({
        ...prev,
        tipoTurno: tipo,
        horaInicio: "07:00",
        horaFim: "19:00",
      }));
    }

    else if (tipo === "NOTURNO") {
      setFormData((prev) => ({
        ...prev,
        tipoTurno: tipo,
        horaInicio: "19:00",
        horaFim: "07:00",
      }));
    }

    else {
      setFormData((prev) => ({
        ...prev,
        tipoTurno: tipo,
        horaInicio: "",
        horaFim: "",
      }));
    }
  }

  function handleClear() {
    setFormData({
      ...initialFormData,
      setorId: String(setores[0]?.id || ""),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.dataPlantao) return setErro("Data do plantão é obrigatória");
    if (!formData.horaInicio || !formData.horaFim)
      return setErro("Horário obrigatório");
    if (!formData.setorId) return setErro("Setor obrigatório");
    if (!formData.medicoIds.length)
      return setErro("Selecione pelo menos um médico");

    try {
      setSubmitting(true);

      if (formData.frequencia === "unico") {
        // await criarPlantaoAvulso({
        //   setorId: Number(formData.setorId),
        //   medicoIds: formData.medicoIds.map(Number),
        //   data: formData.dataPlantao,
        //   horaInicio: formData.horaInicio,
        //   horaFim: formData.horaFim,
        // });
        await criarPlantaoAvulso({
          setorId: Number(formData.setorId),
          medicoIds: formData.medicoIds.map(Number),
          data: formData.dataPlantao,
          turno: formData.tipoTurno,
          horaInicio:
            formData.tipoTurno === "PERSONALIZADO"
              ? formData.horaInicio
              : null,
          horaFim:
            formData.tipoTurno === "PERSONALIZADO"
              ? formData.horaFim
              : null,
        });

      } else {
        // await criarPlantaoFixo({
        //   setorId: Number(formData.setorId),
        //   medicoIds: formData.medicoIds.map(Number),
        //   frequencia: formData.frequencia,
        //   dataInicioVigencia: formData.dataPlantao,
        // });
        await criarPlantaoFixo({
          setorId: Number(formData.setorId),
          medicoIds: formData.medicoIds.map(Number),
          frequencia: formData.frequencia,
          turno: formData.tipoTurno,

          horaInicio:
            formData.tipoTurno === "PERSONALIZADO"
              ? formData.horaInicio
              : null,

          horaFim:
            formData.tipoTurno === "PERSONALIZADO"
              ? formData.horaFim
              : null,

          dataInicioVigencia: formData.dataPlantao,
        });
      }

      setSucesso("Plantão criado com sucesso!");
      handleClear();
    } catch (error) {
      setErro(error.message || "Erro ao criar plantão");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="layout-escalista">
      <Sidebar />

      <main className="criar-plantao-container">
        <header className="topo-escalista">
          <div>
            <h1>Criar Plantão</h1>
            <p>Crie um plantão e associe médicos ao setor</p>
          </div>

          <div className="topo-direita">
            <Bell size={20} />
            <div className="usuario-topo">
              <CircleUserRound className='perfilEscalista' size={18} />
              <span className='perfilEscalista'>{nomeUsuario}</span>
            </div>
          </div>
        </header>

        <form className="plantao-card" onSubmit={handleSubmit}>
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

          <div className="campo">
            <label>Tipo de Turno</label>

            <div className="input-box">
              <Clock3 size={18} />

              <select
                value={formData.tipoTurno}
                onChange={(e) => handleTipoTurno(e.target.value)}
              >
                <option value="DIURNO">Diurno</option>
                <option value="NOTURNO">Noturno</option>
                <option value="PERSONALIZADO">Personalizado</option>
              </select>
            </div>
          </div>

          {/* DATA + HORAS */}
          <div className="linha-tripla">
            <div className="campo">
              <label>Data do Plantão</label>
              <div className="input-box">
                <CalendarDays size={18} />
                <input
                  type="date"
                  name="dataPlantao"
                  value={formData.dataPlantao}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="campo">
              <label>Hora Início</label>
              <div className="input-box">
                <Clock3 size={18} />
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  disabled={formData.tipoTurno !== "PERSONALIZADO"}
                />
              </div>
            </div>

            <div className="campo">
              <label>Hora Fim</label>
              <div className="input-box">
                <Clock3 size={18} />
                <input
                  type="time"
                  name="horaFim"
                  value={formData.horaFim}
                  onChange={handleChange}
                  disabled={formData.tipoTurno !== "PERSONALIZADO"}
                />
              </div>
            </div>
          </div>

          {/* SETOR */}
          <div className="campo">
            <label>Setor</label>
            <div className="input-box">
              <Building2 size={18} />
              <input
                type="text"
                value={
                  loadingDados
                    ? "Carregando setor..."
                    : setores.find((s) => s.id == formData.setorId)?.nome || ""
                }
                readOnly
                disabled
              />
            </div>
          </div>

          {/* MÉDICOS DROPDOWN MULTISELECT */}
          <div className="campo">
            <label>Médicos responsáveis</label>

            <div
              className="input-box"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  openMedico: !prev.openMedico,
                }))
              }
              style={{ cursor: "pointer" }}
            >
              <UserRound size={18} />
              <span>
                {formData.medicoIds.length > 0
                  ? `${formData.medicoIds.length} selecionado(s)`
                  : loadingDados
                    ? "Carregando médicos..."
                    : "Selecione médicos"}
              </span>
            </div>

            {formData.openMedico && (
              <div className="dropdown-medicos">
                {medicosDisponiveis.map((m) => {
                  const selected = formData.medicoIds.includes(String(m.id));

                  return (
                    <label key={m.id} className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleMedico(String(m.id))}
                      />
                      {m.name}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* FREQUÊNCIA */}
          <div className="campo">
            <label>Frequência</label>

            <div className="frequencia-buttons">
              <button
                type="button"
                className={`freq-btn ${formData.frequencia === "unico" ? "active" : ""
                  }`}
                onClick={() => handleFrequencia("unico")}
              >
                Plantão Único
              </button>

              <button
                type="button"
                className={`freq-btn ${formData.frequencia === "semanal" ? "active" : ""
                  }`}
                onClick={() => handleFrequencia("semanal")}
              >
                Toda semana
              </button>

              <button
                type="button"
                className={`freq-btn ${formData.frequencia === "mensal" ? "active" : ""
                  }`}
                onClick={() => handleFrequencia("mensal")}
              >
                Todo Mês
              </button>

              {/* INTEGRAR */}
              {/* PODE TIRAR O TODO DIA NÉ? */}
              <button
                type="button"
                className={`freq-btn ${formData.frequencia === "semanal" ? "active" : ""
                  }`}
                onClick={() => handleFrequencia("semanal")}
              >
                Toda dia
              </button>
            </div>
          </div>

          <div className="divider" />

          {/* FOOTER */}
          <div className="footer-form">
            <button type="button" className="limpar-btn" onClick={handleClear}>
              <RotateCcw size={18} />
              Limpar Campos
            </button>

            <button
              type="submit"
              className="criar-btn"
              disabled={submitting || loadingDados}
            >
              <Upload size={18} />
              {submitting ? "Criando..." : "Criar Plantão"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function obterUsuarioLogado() {
  return getStoredUser();
}
