import { useState, useEffect } from "react";
import "./Delegacao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getStoredUser } from "../../../utils/authStorage";
import { Bell, CircleUserRound } from "lucide-react";

// TODO: substituir por chamada real quando o endpoint GET /coberturas/setor/ofertas estiver disponível
// import { getOfertasDoSetor } from "../../UserHospital/Setores/setorServices";

const OFERTAS_MOCK = [
    {
        id: 1,
        status: "ABERTO",
        setorNome: "UTI Adulto",
        medicoSolicitanteNome: "Dr. Carlos Mendes",
        medicoCobridorNome: null,
        abertoEm: "2026-05-29T14:30:00",
        plantao: {
            dataInicio: "2026-06-02T07:00:00",
            dataFim: "2026-06-02T19:00:00",
        },
    },
    {
        id: 2,
        status: "ASSUMIDO",
        setorNome: "UTI Adulto",
        medicoSolicitanteNome: "Dra. Ana Paula Lima",
        medicoCobridorNome: "Dr. Rafael Costa",
        abertoEm: "2026-05-28T09:15:00",
        plantao: {
            dataInicio: "2026-05-31T19:00:00",
            dataFim: "2026-06-01T07:00:00",
        },
    },
    {
        id: 3,
        status: "ABERTO",
        setorNome: "UTI Adulto",
        medicoSolicitanteNome: "Dr. João Ferreira",
        medicoCobridorNome: null,
        abertoEm: "2026-05-30T08:00:00",
        plantao: {
            dataInicio: "2026-06-05T07:00:00",
            dataFim: "2026-06-05T19:00:00",
        },
    },
];

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

    useEffect(() => {
        const carregar = async () => {
            try {
                // TODO: trocar por chamada real: const data = await getOfertasDoSetor();
                await new Promise((r) => setTimeout(r, 400));
                setOfertas(OFERTAS_MOCK);
            } catch (e) {
                setErro(e.message);
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, []);

    const abertas = ofertas.filter((o) => o.status === "ABERTO");
    const fechadas = ofertas.filter((o) => o.status === "ASSUMIDO");

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
                                <h2>Ofertas de Plantão</h2>

                                {ofertas.length === 0 ? (
                                    <div className="delegacao-empty">
                                        Nenhuma oferta de plantão registrada no momento.
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
                                                {ofertas.map((oferta) => (
                                                    <tr key={oferta.id}>
                                                        <td>{formatarData(oferta.plantao?.dataInicio)}</td>
                                                        <td className="coluna-horario">
                                                            {formatarHora(oferta.plantao?.dataInicio)}
                                                            {" – "}
                                                            {formatarHora(oferta.plantao?.dataFim)}
                                                        </td>
                                                        <td>{oferta.setorNome || "—"}</td>
                                                        <td>{oferta.medicoSolicitanteNome || "—"}</td>
                                                        <td className={oferta.medicoCobridorNome ? "" : "celula-vazia"}>
                                                            {oferta.medicoCobridorNome || "Aguardando"}
                                                        </td>
                                                        <td>{formatarData(oferta.abertoEm)}</td>
                                                        <td>
                                                            <span
                                                                className={`badge-status ${
                                                                    oferta.status === "ABERTO"
                                                                        ? "badge-aberta"
                                                                        : "badge-fechada"
                                                                }`}
                                                            >
                                                                {oferta.status === "ABERTO" ? "Aberta" : "Fechada"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
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