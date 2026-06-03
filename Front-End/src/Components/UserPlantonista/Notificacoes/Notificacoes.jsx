import { useState, useEffect, useCallback } from "react";
import "./Notificacoes.css";
import Sidebar from "../../Sidebar/Sidebar";
import { Bell, CircleUserRound, CheckCheck, BellOff } from "lucide-react";
import { getStoredUser } from "../../../utils/authStorage";
import {
    getMinhasNotificacoes,
    marcarNotificacaoLida,
} from "../../../services/doctorServices";

const TIPO_CONFIG = {
    COBERTURA_ASSUMIDA: {
        rotulo: "Oferta aceita",
        cor: "assumida",
    },
};

const formatarDataRelativa = (isoStr) => {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    const agora = new Date();
    const diffDias = Math.floor((agora - d) / 86400000);

    if (diffDias < 1) return "hoje";
    if (diffDias === 1) return "há 1 dia";
    return `há ${diffDias} dias`;
};

export default function Notificacoes() {
    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Plantonista";

    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [filtro, setFiltro] = useState("todas");
    const [marcandoTodas, setMarcandoTodas] = useState(false);

    const carregar = useCallback(async () => {
        try {
            setLoading(true);
            setErro(null);
            const data = await getMinhasNotificacoes();
            setNotificacoes(Array.isArray(data) ? data : []);
        } catch (e) {
            setErro(e.message || "Não foi possível carregar as notificações.");
            setNotificacoes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const marcarLida = async (id) => {
        try {
            const atualizada = await marcarNotificacaoLida(id);
            setNotificacoes((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, ...atualizada, lida: true } : n
                )
            );
            window.dispatchEvent(new Event("notificacoes-atualizadas"));
        } catch (e) {
            setErro(e.message || "Não foi possível marcar a notificação como lida.");
        }
    };

    const marcarTodasLidas = async () => {
        try {
            setMarcandoTodas(true);
            setErro(null);
            const atualizadas = await Promise.all(
                notificacoes
                    .filter((n) => !n.lida)
                    .map((n) => marcarNotificacaoLida(n.id)),
            );
            const atualizadasPorId = new Map(
                atualizadas.map((n) => [n.id, n]),
            );

            setNotificacoes((prev) =>
                prev.map((n) =>
                    atualizadasPorId.has(n.id)
                        ? { ...n, ...atualizadasPorId.get(n.id), lida: true }
                        : n,
                )
            );
            window.dispatchEvent(new Event("notificacoes-atualizadas"));
        } catch (e) {
            setErro(e.message || "Não foi possível marcar todas como lidas.");
        } finally {
            setMarcandoTodas(false);
        }
    };

    const naoLidas = notificacoes.filter((n) => !n.lida);
    const exibidas = filtro === "nao-lidas" ? naoLidas : notificacoes;

    return (
        <div className="pagina-notificacoes">
            <Sidebar />

            <main className="conteudo-notificacoes">
                <header className="topo-notificacoes">
                    <div>
                        <h1 className="titulo-pagina-notif">
                            Notificações
                            {naoLidas.length > 0 && (
                                <span className="badge-nao-lidas">{naoLidas.length}</span>
                            )}
                        </h1>
                        <p className="subtitulo-pagina-notif">
                            Acompanhe as atualizações sobre suas ofertas e plantões.
                        </p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <div className="usuario-topo">
                            <CircleUserRound className="perfilPlantonista" />
                            <span className="perfilPlantonista">{nomeUsuario}</span>
                        </div>
                    </div>
                </header>

                <section className="painel-notificacoes">
                    <div className="barra-acoes-notif">
                        <div className="filtros-notif">
                            <button
                                className={`btn-filtro ${filtro === "todas" ? "ativo" : ""}`}
                                onClick={() => setFiltro("todas")}
                            >
                                Todas ({notificacoes.length})
                            </button>
                            <button
                                className={`btn-filtro ${filtro === "nao-lidas" ? "ativo" : ""}`}
                                onClick={() => setFiltro("nao-lidas")}
                            >
                                Não lidas ({naoLidas.length})
                            </button>
                        </div>

                        {naoLidas.length > 0 && (
                            <button
                                className="btn-marcar-todas"
                                onClick={marcarTodasLidas}
                                disabled={marcandoTodas}
                            >
                                <CheckCheck size={16} />
                                {marcandoTodas ? "Marcando..." : "Marcar todas como lidas"}
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="notif-estado">Carregando notificações...</div>
                    )}

                    {erro && (
                        <div className="notif-estado notif-erro">{erro}</div>
                    )}

                    {!loading && !erro && exibidas.length === 0 && (
                        <div className="notif-vazia">
                            <BellOff size={40} className="notif-vazia-icone" />
                            <p>
                                {filtro === "nao-lidas"
                                    ? "Nenhuma notificação não lida."
                                    : "Nenhuma notificação por enquanto."}
                            </p>
                        </div>
                    )}

                    {!loading && !erro && exibidas.length > 0 && (
                        <div className="lista-notificacoes">
                            {exibidas.map((notif) => {
                                const config = TIPO_CONFIG[notif.tipo] ?? {
                                    rotulo: notif.tipo,
                                    cor: "padrao",
                                };
                                return (
                                    <div
                                        key={notif.id}
                                        className={`card-notif ${notif.lida ? "lida" : "nao-lida"} cor-${config.cor}`}
                                        onClick={() => !notif.lida && marcarLida(notif.id)}
                                        role={notif.lida ? undefined : "button"}
                                        tabIndex={notif.lida ? undefined : 0}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && !notif.lida && marcarLida(notif.id)
                                        }
                                    >
                                        <div className="notif-barra-lateral" />

                                        <div className="notif-corpo">
                                            <div className="notif-cabecalho">
                                                <span className={`tag-tipo tag-${config.cor}`}>
                                                    {config.rotulo}
                                                </span>
                                                <span className="notif-tempo">
                                                    {formatarDataRelativa(notif.criadoEm)}
                                                </span>
                                            </div>

                                            {notif.titulo && (
                                                <p className="notif-titulo">{notif.titulo}</p>
                                            )}

                                            <p className="notif-mensagem">{notif.mensagem}</p>

                                            {notif.plantao && (
                                                <div className="notif-plantao-info">
                                                    <span>{notif.plantao.setor}</span>
                                                    {notif.plantao.hospital && (
                                                        <>
                                                            <span className="separador">·</span>
                                                            <span>{notif.plantao.hospital}</span>
                                                        </>
                                                    )}
                                                    {notif.plantao.time && (
                                                        <>
                                                            <span className="separador">·</span>
                                                            <span>{notif.plantao.time}</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {!notif.lida && (
                                                <button
                                                    className="btn-marcar-lida"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        marcarLida(notif.id);
                                                    }}
                                                >
                                                    Marcar como lida
                                                </button>
                                            )}
                                        </div>

                                        {!notif.lida && <span className="ponto-nao-lida" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
