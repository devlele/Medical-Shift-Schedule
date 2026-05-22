import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import "./TelaPrincipal.css";
import {
    Settings,
    Bell,
    UserRound,
} from "lucide-react";

import {
    getDoctors,
    getMeusSetoresEscalista,
    getMinhaAgenda,
} from "../../UserHospital/Setores/setorServices.js";
import { getStoredUser } from "../../../utils/authStorage";

export default function TelaPrincipal() {
    const usuario = obterUsuarioLogado();
    const nomeUsuario = usuario?.name || "Escalista";
    const [setores, setSetores] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    const proximosPlantoes = useMemo(() => {
        return [...plantoes]
            .filter((plantao) => plantao.dataInicio)
            .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
            .slice(0, 6);
    }, [plantoes]);

    async function carregarDados() {
        try {
            setLoading(true);
            setErro("");

            const [setoresData, medicosData, agendaData] = await Promise.all([
                getMeusSetoresEscalista(),
                getDoctors(),
                getMinhaAgenda(),
            ]);

            setSetores(Array.isArray(setoresData) ? setoresData.filter((setor) => setor.ativo !== false) : []);
            setMedicos(Array.isArray(medicosData) ? medicosData.filter((medico) => medico.ativo !== false) : []);
            setPlantoes(Array.isArray(agendaData) ? agendaData : []);
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar os dados do painel.");
            setSetores([]);
            setMedicos([]);
            setPlantoes([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="layout-escalista">
            <Sidebar />

            <main className="gestao-container">
                <header className="topo-escalista">
                    <div>
                        <h1>Painel de Controle</h1>
                        <p>Bem-vindo de volta, {nomeUsuario}.</p>
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

                {erro && <div className="estado-escalista erro">{erro}</div>}

                <div className="top-cards">
                    <div className="card colaboradores">
                        <span className="label">
                            MÉDICOS VINCULADOS
                        </span>

                        <div className="number-row">
                            <h2>{loading ? "..." : medicos.length}</h2>
                            <span>Profissionais ativos</span>
                        </div>
                    </div>

                    <div className="card live-card">
                        <h2>{loading ? "..." : `${setores.length} Setor${setores.length === 1 ? "" : "es"}`}</h2>

                        <p>
                            {setores[0]?.setorNome || "Nenhum setor vinculado"}
                        </p>
                    </div>
                </div>

                <div className="setores-grid">
                    {loading ? (
                        <div className="estado-escalista">Carregando dados...</div>
                    ) : setores.length === 0 ? (
                        <div className="estado-escalista">Nenhum setor vinculado ao escalista.</div>
                    ) : (
                        setores.map((setor) => (
                            <div className="setor-card" key={setor.id}>
                                <h3>{setor.setorNome}</h3>

                                <span className="subtitulo">
                                    SETOR RESPONSÁVEL
                                </span>

                                <div className="divider" />

                                <div className="info">
                                    <p>Médicos:</p>
                                    <strong>{medicos.length}</strong>
                                </div>

                                <div className="info">
                                    <p>Plantões:</p>
                                    <strong>{plantoes.length}</strong>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && proximosPlantoes.map((plantao) => (
                        <div className="setor-card" key={plantao.id}>
                            <h3>{plantao.doctor || "Médico não informado"}</h3>

                            <span className="subtitulo">
                                {plantao.setor || "PLANTÃO"}
                            </span>

                            <div className="divider" />

                            <div className="info">
                                <p>Data:</p>
                                <strong>{formatarData(plantao.dataInicio)}</strong>
                            </div>

                            <div className="info">
                                <p>Horário:</p>
                                <strong>{plantao.time || "-"}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

function obterUsuarioLogado() {
    return getStoredUser();
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
}
