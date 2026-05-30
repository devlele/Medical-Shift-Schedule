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

// TODO: remover quando integrado com o backend
const NOTIFICACOES_MOCK = [
    {
        id: 1,
        tipo: "COBERTURA_ASSUMIDA",
        titulo: "Oferta aceita",
        mensagem: "Dr. Rafael Costa aceitou sua oferta do dia 02/06/2026 do setor UTI Adulto do hospital Hospital São Lucas.",
        lida: false,
        criadoEm: new Date().toISOString(),
        plantao: { setor: "UTI Adulto", hospital: "Hospital São Lucas", time: "07:00 - 19:00 (12h)" },
    },
    {
        id: 2,
        tipo: "COBERTURA_ASSUMIDA",
        titulo: "Oferta aceita",
        mensagem: "Dra. Camila Souza aceitou sua oferta do dia 31/05/2026 do setor UTI Adulto do hospital Hospital São Lucas.",
        lida: false,
        criadoEm: new Date(Date.now() - 86400000).toISOString(),
        plantao: { setor: "UTI Adulto", hospital: "Hospital São Lucas", time: "19:00 - 07:00 (12h)" },
    },
    {
        id: 3,
        tipo: "COBERTURA_ASSUMIDA",
        titulo: "Oferta aceita",
        mensagem: "Dr. João Ferreira aceitou sua oferta do dia 28/05/2026 do setor UTI Adulto do hospital Hospital São Lucas.",
        lida: true,
        criadoEm: new Date(Date.now() - 86400000 * 3).toISOString(),
        plantao: { setor: "UTI Adulto", hospital: "Hospital São Lucas", time: "07:00 - 19:00 (12h)" },
    },
];

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
            setErro(null);
            // TODO: trocar por chamada real quando integrado com o backend
            // const data = await getMinhasNotificacoes();
            await new Promise((r) => setTimeout(r, 300));
            setNotificacoes(NOTIFICACOES_MOCK);
        } catch (e) {
            setErro(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const marcarLida = (id) => {
        // TODO: chamar marcarNotificacaoLida(id) quando integrado com o backend
        setNotificacoes((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, lida: true, lidaEm: new Date().toISOString() } : n
            )
        );
    };

    const marcarTodasLidas = () => {
        // TODO: chamar API para cada notificação quando integrado com o backend
        setMarcandoTodas(true);
        setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
        setMarcandoTodas(false);
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