import "./Delegacao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getStoredUser } from "../../../utils/authStorage";
import { Bell, CircleUserRound } from "lucide-react";

const Delegacao = () => {
    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Escalista";
    const atividades = [];

    return (
        <div className="pagina-delegacao">
            {/* MENU LATERAL */}
            <Sidebar />

            {/* CONTEÚDO */}
            <main className="conteudo-delegacao">
                {/* TOPO */}
                <header className="topo-delegacao">
                    <div>
                        <h1 className="titulo-pagina">
                            Supervisão de Plantões Delegados
                        </h1>

                        <p className="subtitulo-pagina">
                            Veifique as delegações feitas pelos profissionais.
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

                {/* ÁREA CENTRAL */}
                <section className="painel-delegacao">
                    <div className="espaco-vazio"></div>

                    {/* ATIVIDADE */}
                    <div className="atividade">
                        <h2>Atividades</h2>

                        <div className="lista-atividades">
                            {atividades.length === 0 ? (
                                <div className="delegacao-empty">
                                    Nenhuma delegação registrada até o momento.
                                </div>
                            ) : (
                                atividades.map((atividade) => (
                                    <div
                                        key={atividade.id}
                                        className={`card-atividade ${atividade.tipo}`}
                                    >
                                        <span className="tempo-atividade">
                                            {atividade.tempo}
                                        </span>

                                        <h3>{atividade.titulo}</h3>

                                        <p>{atividade.descricao}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Delegacao;
