import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    AlertCircle,
    Bell,
    CheckCircle,
    CircleUserRound,
    Search,
    Trash2,
    UserPlus,
    UserRound,
    Info,
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
            setErro("");

            const [setoresData, medicosData] = await Promise.all([
                getMeusSetoresEscalista(),
                getDoctors(),
            ]);

            const setoresNormalizados = normalizarSetores(setoresData);
            const medicosNormalizados = normalizarMedicos(medicosData);

            setSetores(setoresNormalizados);
            setMedicos(medicosNormalizados);
            setSetorId((current) => current || String(setoresNormalizados[0]?.id || ""));
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar os dados do setor.");
            setSetores([]);
            setMedicos([]);
        } finally {
            setLoading(false);
        }
    }

    async function recarregarMedicos() {
        const medicosData = await getDoctors();
        setMedicos(normalizarMedicos(medicosData));
    }

    async function buscarCandidatos(idSetor = setorId, termoBusca = termo) {
        if (!idSetor) {
            setCandidatos([]);
            return;
        }

        try {
            setBuscando(true);
            setErro("");
            const candidatosData = await getMedicosCandidatos(idSetor, termoBusca);
            setCandidatos(Array.isArray(candidatosData) ? candidatosData : []);
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível buscar médicos.");
            setCandidatos([]);
        } finally {
            setBuscando(false);
        }
    }

    async function associarMedico(medicoId) {
        if (!setorId) {
            setErro("Selecione um setor antes de associar um médico.");
            return;
        }

        try {
            setAssociandoId(String(medicoId));
            setErro("");
            setSucesso("");
            await vincularMedicoSetor(medicoId, setorId);
            await Promise.all([
                recarregarMedicos(),
                buscarCandidatos(setorId, termo),
            ]);
            setSucesso("Médico associado ao setor com sucesso.");
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível associar o médico ao setor.");
        } finally {
            setAssociandoId("");
        }
    }

    async function removerVinculo(medicoId) {
        if (!setorId) {
            return;
        }

        try {
            setRemovendoId(String(medicoId));
            setErro("");
            setSucesso("");
            await desvincularMedicoSetor(medicoId, setorId);
            await Promise.all([
                recarregarMedicos(),
                buscarCandidatos(setorId, termo),
            ]);
            setSucesso("Médico removido do setor.");
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível remover o vínculo do médico.");
        } finally {
            setRemovendoId("");
        }
    }

    return (
        <div className="medicos-setor-layout">
            <Sidebar />

            <main className="medicos-setor-main">
                <header className="medicos-setor-header">
                    <div>
                        <h1>Profissionais Vinculados</h1>
                        <p>Associe médicos cadastrados ao seu setor antes de montar plantões.</p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <div className="usuario-topo">
                            <CircleUserRound size={18} className="perfilEscalista" />
                            <span className="perfilEscalista">{nomeUsuario}</span>
                        </div>
                    </div>
                </header>

                {erro && (
                    <div className="medicos-alerta erro">
                        <AlertCircle size={18} />
                        <span>{erro}</span>
                    </div>
                )}

                {sucesso && (
                    <div className="medicos-alerta sucesso">
                        <CheckCircle size={18} />
                        <span>{sucesso}</span>
                    </div>
                )}

                <section className="medicos-info-card">
                    <div>
                        <span className="medicos-label">Setor responsável</span>
                        <strong>{setorAtual?.nome || "Nenhum setor vinculado"}</strong>
                    </div>
                </section>

                <section className="medicos-grid">
                    <article className="medicos-panel">
                        <div className="medicos-panel-header">
                            <div>
                                <h2>Buscar Médicos</h2>
                                <p>Pesquise por nome, CPF, CRM ou e-mail.</p>
                            </div>
                        </div>

                        <div className="medicos-search">
                            <Search size={18} />
                            <input
                                value={termo}
                                onChange={(event) => setTermo(event.target.value)}
                                placeholder="Digite nome, CPF, CRM ou email"
                                disabled={!setorId || buscando}
                            />
                            <button
                                type="button"
                                onClick={() => buscarCandidatos(setorId, termo)}
                                disabled={!setorId || buscando}
                            >
                                {buscando ? "Buscando..." : "Buscar"}
                            </button>
                        </div>

                        <div className="medicos-list">
                            {loading || buscando ? (
                                <div className="medicos-empty">Carregando médicos...</div>
                            ) : candidatos.length === 0 ? (
                                <div className="medicos-empty">Nenhum médico disponível para associação.</div>
                            ) : (
                                candidatos.map((medico) => (
                                    <div className="medico-row" key={medico.id}>
                                        <div className="medico-avatar">
                                            <UserRound size={20} />
                                        </div>

                                        <div className="medico-info">
                                            <strong>{medico.name}</strong>
                                            <span>{medico.crm || medico.email || medico.cpf}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="medico-associar-btn"
                                            onClick={() => associarMedico(medico.id)}
                                            disabled={associandoId === String(medico.id)}
                                        >
                                            <UserPlus size={16} />
                                            {associandoId === String(medico.id) ? "Associando..." : "Associar"}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </article>

                    <article className="medicos-panel">
                        <div className="medicos-panel-header">
                            <div>
                                <h2>Médicos do Setor</h2>
                                <p>{medicos.length} médico{medicos.length === 1 ? "" : "s"} vinculado{medicos.length === 1 ? "" : "s"}.</p>
                            </div>
                        </div>

                        <div className="medicos-list">
                            {loading ? (
                                <div className="medicos-empty">Carregando vínculos...</div>
                            ) : medicos.length === 0 ? (
                                <div className="medicos-empty">Nenhum médico vinculado ao setor.</div>
                            ) : (
                                medicos.map((medico) => (
                                    <div className="medico-row" key={medico.id}>
                                        <div className="medico-avatar">
                                            <UserRound size={20} />
                                        </div>

                                        <div className="medico-info">
                                            <strong>{medico.name}</strong>
                                            <span>{medico.crm || medico.email || medico.specialty || "Médico vinculado"}</span>
                                        </div>

                                        <NavLink
                                            to="/detalhePlantonista"
                                            className="medico-info-btn"
                                        >
                                            <Info size={18} />
                                        </NavLink>

                                        <button
                                            type="button"
                                            className="medico-remover-btn"
                                            onClick={() => removerVinculo(medico.id)}
                                            disabled={removendoId === String(medico.id)}
                                            aria-label="Remover médico do setor"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

function normalizarSetores(setoresData) {
    return Array.isArray(setoresData)
        ? setoresData
            .filter((vinculo) => vinculo.ativo !== false)
            .map((vinculo) => ({
                id: vinculo.setorId,
                nome: vinculo.setorNome,
            }))
            .filter((setor) => setor.id)
        : [];
}

function normalizarMedicos(medicosData) {
    return Array.isArray(medicosData)
        ? medicosData.filter((medico) => medico.ativo !== false)
        : [];
}

function obterUsuarioLogado() {
    return getStoredUser();
}
