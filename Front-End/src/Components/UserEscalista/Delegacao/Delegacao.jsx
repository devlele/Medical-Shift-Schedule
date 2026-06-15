import { useState, useEffect } from "react";
import "./Delegacao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getStoredUser } from "../../../utils/authStorage";
import { Bell, CircleUserRound } from "lucide-react";
import { getCoberturasDoSetorEscalista } from "../../UserHospital/Setores/setorServices";

const formatarData = (isoStr) => {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatarHora = (isoStr) => {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const Delegacao = () => {
    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Escalista";

    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [statusFiltro, setStatusFiltro] = useState("todos");
    const [ordenacao, setOrdenacao] = useState("recentes");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        let ativo = true;

        const carregar = async () => {
            try {
                setLoading(true);
                setErro(null);
                const data = await getCoberturasDoSetorEscalista();
                if (ativo) {
                    setOfertas(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                if (ativo) {
                    setErro(e.message || "Não foi possível carregar as ofertas de plantão.");
                    setOfertas([]);
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        };
        carregar();

        return () => {
            ativo = false;
        };
    }, []);

    const abertas = ofertas.filter((o) => o.status === "ABERTO");
    const fechadas = ofertas.filter((o) => o.status !== "ABERTO");

    const getStatusInfo = (status) => {
        if (status === "ABERTO") return { label: "Aberta", className: "badge-aberta" };
        if (status === "CANCELADO") return { label: "Cancelado", className: "badge-cancelada" };
        return { label: "Ofertado", className: "badge-fechada" };
    };

    const getDataPlantao = (oferta) =>
        oferta.plantao?.dataInicio ? new Date(oferta.plantao.dataInicio).getTime() : 0;

    const getDataAbertura = (oferta) =>
        oferta.abertoEm ? new Date(oferta.abertoEm).getTime() : 0;

    const ofertasFiltradas = ofertas
        .filter((o) => {
            if (statusFiltro === "ABERTO") return o.status === "ABERTO";
            if (statusFiltro === "FECHADO") return o.status !== "ABERTO";
            return true;
        })
        .filter((o) => {
            const termo = busca.trim().toLowerCase();
            if (!termo) return true;
            return (
                (o.setorNome || "").toLowerCase().includes(termo) ||
                (o.medicoSolicitanteNome || "").toLowerCase().includes(termo) ||
                (o.medicoCobridorNome || "").toLowerCase().includes(termo)
            );
        })
        .slice()
        .sort((a, b) => {
            if (ordenacao === "proximas") return getDataPlantao(a) - getDataPlantao(b);
            if (ordenacao === "distantes") return getDataPlantao(b) - getDataPlantao(a);
            return getDataAbertura(b) - getDataAbertura(a);
        });

    return (
        <div className="pagina-delegacao">
            <Sidebar />

            <main className="conteudo-delegacao">
                <header className="topo-delegacao">
                    <div>
                        <h1 className="titulo-pagina">Supervisão de Plantões Delegados</h1>
                        <p className="subtitulo-pagina">
                            Acompanhe as ofertas de plantão feitas pelos profissionais do seu setor.
                        </p>
                    </div>

                    <div className="acoes-topo">
                        <Bell className="icone icone-click" />
                        <div className="usuario-topo">
                            <CircleUserRound className="perfilEscalista" />
                            <span className="perfilEscalista">{nomeUsuario}</span>
                        </div>
                    </div>
                </header>

                <section className="painel-delegacao">
                    {loading && <div className="delegacao-loading">Carregando ofertas...</div>}

                    {erro && <div className="delegacao-erro">{erro}</div>}

                    {!loading && !erro && (
                        <>
                            <div className="resumo-ofertas">
                                <div className="resumo-card aberta">
                                    <span className="resumo-numero">{abertas.length}</span>
                                    <span className="resumo-label">Abertas</span>
                                </div>
                                <div className="resumo-card fechada">
                                    <span className="resumo-numero">{fechadas.length}</span>
                                    <span className="resumo-label">Fechadas</span>
                                </div>
                                <div className="resumo-card total">
                                    <span className="resumo-numero">{ofertas.length}</span>
                                    <span className="resumo-label">Total</span>
                                </div>
                            </div>

                            <div className="secao-ofertas">
                                <div className="cabecalho-secao-ofertas">
                                    <h2>Ofertas de Plantão</h2>

                                    <div className="filtros-ofertas">
                                        <input
                                            type="text"
                                            className="busca-input"
                                            placeholder="Buscar por..."
                                            value={busca}
                                            onChange={(e) => setBusca(e.target.value)}
                                        />

                                        <select
                                            className="filtro-select"
                                            value={statusFiltro}
                                            onChange={(e) => setStatusFiltro(e.target.value)}
                                        >
                                            <option value="todos">Todos os status</option>
                                            <option value="ABERTO">Aberto</option>
                                            <option value="FECHADO">Fechado</option>
                                        </select>

                                        <select
                                            className="filtro-select"
                                            value={ordenacao}
                                            onChange={(e) => setOrdenacao(e.target.value)}
                                        >
                                            <option value="recentes">Mais recentes</option>
                                            <option value="proximas">Plantões mais próximos</option>
                                            <option value="distantes">Plantões mais distantes</option>
                                        </select>
                                    </div>
                                </div>

                                {ofertas.length === 0 ? (
                                    <div className="delegacao-empty">
                                        Nenhuma oferta de plantão registrada no momento.
                                    </div>
                                ) : ofertasFiltradas.length === 0 ? (
                                    <div className="delegacao-empty">
                                        Nenhuma oferta encontrada para o filtro selecionado.
                                    </div>
                                ) : (
                                    <div className="tabela-ofertas-wrapper">
                                        <table className="tabela-ofertas">
                                            <thead>
                                                <tr>
                                                    <th>Data do Plantão</th>
                                                    <th>Horário</th>
                                                    <th>Setor</th>
                                                    <th>Ofertante</th>
                                                    <th>Cobriu</th>
                                                    <th>Aberta em</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ofertasFiltradas.map((oferta) => {
                                                    const cancelada = oferta.status === "CANCELADO";
                                                    const statusInfo = getStatusInfo(oferta.status);

                                                    return (
                                                        <tr key={oferta.id}>
                                                            <td>{formatarData(oferta.plantao?.dataInicio)}</td>
                                                            <td className="coluna-horario">
                                                                {formatarHora(oferta.plantao?.dataInicio)}
                                                                {" – "}
                                                                {formatarHora(oferta.plantao?.dataFim)}
                                                            </td>
                                                            <td>{oferta.setorNome || "—"}</td>
                                                            <td>{oferta.medicoSolicitanteNome || "—"}</td>
                                                            <td className={!cancelada && oferta.medicoCobridorNome ? "" : "celula-vazia"}>
                                                                {cancelada ? "—" : (oferta.medicoCobridorNome || "Aguardando")}
                                                            </td>
                                                            <td>{formatarData(oferta.abertoEm)}</td>
                                                            <td>
                                                                <span className={`badge-status ${statusInfo.className}`}>
                                                                    {statusInfo.label}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Delegacao;
