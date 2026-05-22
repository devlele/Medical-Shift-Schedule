import { useEffect, useMemo, useState } from "react";
import "./CriarPlantao.css";
import Sidebar from "../../Sidebar/Sidebar";

import {
    Bell,
    Settings,
    CalendarDays,
    Clock3,
    Building2,
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

const initialFormData = {
    dataPlantao: "",
    horaInicio: "07:00",
    horaFim: "19:00",
    setorId: "",
    medicoId: "",
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

    const medicosDisponiveis = useMemo(() => {
        return medicos;
    }, [medicos]);

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
                    .filter((vinculo) => vinculo.ativo !== false)
                    .map((vinculo) => ({
                        id: vinculo.setorId,
                        nome: vinculo.setorNome,
                    }))
                    .filter((setor) => setor.id)
                : [];

            const medicosNormalizados = Array.isArray(medicosData)
                ? medicosData.filter((medico) => medico.ativo !== false)
                : [];

            setSetores(setoresNormalizados);
            setMedicos(medicosNormalizados);

            setFormData((prev) => ({
                ...prev,
                setorId: prev.setorId || String(setoresNormalizados[0]?.id || ""),
            }));
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar os dados do escalista.");
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

    function handleFrequencia(tipo) {
        setFormData((prev) => ({
            ...prev,
            frequencia: tipo,
        }));
        setErro("");
        setSucesso("");
    }

    function handleClear() {
        setFormData({
            ...initialFormData,
            setorId: String(setores[0]?.id || ""),
        });
        setErro("");
        setSucesso("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        const erroValidacao = validarFormulario(formData);
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        try {
            setSubmitting(true);

            if (formData.frequencia === "unico") {
                await criarPlantaoAvulso(montarPayloadAvulso(formData));
                setSucesso("Plantão avulso criado com sucesso.");
            } else {
                await criarPlantaoFixo(montarPayloadFixo(formData));
                setSucesso("Plantão fixo criado com sucesso.");
            }

            handleClear();
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível criar o plantão.");
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
                        <p>Crie um plantão e associe a um médico do setor</p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <Settings className="icone-topo" />

                        <div className="user">
                            <UserRound size={18} />
                            <span>{nomeUsuario}</span>
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
                                />
                            </div>
                        </div>
                    </div>

                    <div className="campo">
                        <label>Setor</label>

                        <div className="input-box">
                            <Building2 size={18} />

                            <select
                                name="setorId"
                                value={formData.setorId}
                                onChange={handleChange}
                                disabled={loadingDados || setores.length === 0}
                            >
                                <option value="">
                                    {loadingDados ? "Carregando setores..." : "Selecione"}
                                </option>

                                {setores.map((setor) => (
                                    <option key={setor.id} value={setor.id}>
                                        {setor.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="campo">
                        <label>Médico responsável</label>

                        <div className="input-box">
                            <UserRound size={18} />

                            <select
                                name="medicoId"
                                value={formData.medicoId}
                                onChange={handleChange}
                                disabled={loadingDados || medicosDisponiveis.length === 0}
                            >
                                <option value="">
                                    {loadingDados ? "Carregando médicos..." : "Selecione um médico vinculado"}
                                </option>

                                {medicosDisponiveis.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="campo">
                        <label>Frequência</label>

                        <div className="frequencia-buttons">
                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia === "unico" ? "active" : ""}`}
                                onClick={() => handleFrequencia("unico")}
                            >
                                Plantão Único
                            </button>

                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia === "semanal" ? "active" : ""}`}
                                onClick={() => handleFrequencia("semanal")}
                            >
                                Toda semana
                            </button>

                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia === "mensal" ? "active" : ""}`}
                                onClick={() => handleFrequencia("mensal")}
                            >
                                Todo Mês
                            </button>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="footer-form">
                        <button
                            type="button"
                            className="limpar-btn"
                            onClick={handleClear}
                        >
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

function validarFormulario(dados) {
    if (!dados.dataPlantao) {
        return "Data do plantão é obrigatória.";
    }

    if (!dados.horaInicio || !dados.horaFim) {
        return "Hora início e hora fim são obrigatórias.";
    }

    if (dados.horaInicio === dados.horaFim) {
        return "Hora início e hora fim não podem ser iguais.";
    }

    if (!dados.setorId) {
        return "Setor é obrigatório.";
    }

    if (!dados.medicoId) {
        return "Médico responsável é obrigatório.";
    }

    return "";
}

function montarPayloadAvulso(dados) {
    const turno = resolverTurno(dados.horaInicio, dados.horaFim);

    return {
        setorId: Number(dados.setorId),
        medicoId: Number(dados.medicoId),
        data: dados.dataPlantao,
        turno,
        dataInicio: turno === "PERSONALIZADO"
            ? montarDataHora(dados.dataPlantao, dados.horaInicio)
            : null,
        dataFim: turno === "PERSONALIZADO"
            ? montarDataHora(dados.dataPlantao, dados.horaFim, dados.horaFim <= dados.horaInicio)
            : null,
    };
}

function montarPayloadFixo(dados) {
    const turno = resolverTurno(dados.horaInicio, dados.horaFim);

    return {
        setorId: Number(dados.setorId),
        medicoId: Number(dados.medicoId),
        tipoRecorrencia: dados.frequencia === "semanal"
            ? "SEMANAL"
            : "MENSAL_DIA_FIXO",
        diaSemana: dados.frequencia === "semanal"
            ? diaSemanaBackend(dados.dataPlantao)
            : null,
        diaDoMes: dados.frequencia === "mensal"
            ? Number(dados.dataPlantao.split("-")[2])
            : null,
        turno,
        horaInicio: turno === "PERSONALIZADO" ? dados.horaInicio : null,
        horaFim: turno === "PERSONALIZADO" ? dados.horaFim : null,
        dataInicioVigencia: dados.dataPlantao,
        dataFimVigencia: null,
    };
}

function resolverTurno(horaInicio, horaFim) {
    if (horaInicio === "07:00" && horaFim === "19:00") {
        return "DIURNO";
    }

    if (horaInicio === "19:00" && horaFim === "07:00") {
        return "NOTURNO";
    }

    return "PERSONALIZADO";
}

function montarDataHora(data, hora, proximoDia = false) {
    const [ano, mes, dia] = data.split("-").map(Number);
    const [horaValor, minutoValor] = hora.split(":").map(Number);
    const dataHora = new Date(ano, mes - 1, dia + (proximoDia ? 1 : 0), horaValor, minutoValor);

    return `${dataHora.getFullYear()}-${pad(dataHora.getMonth() + 1)}-${pad(dataHora.getDate())}T${pad(dataHora.getHours())}:${pad(dataHora.getMinutes())}:00`;
}

function diaSemanaBackend(data) {
    const jsDay = new Date(`${data}T00:00:00`).getDay();
    return String(jsDay === 0 ? 7 : jsDay);
}

function pad(value) {
    return String(value).padStart(2, "0");
}
