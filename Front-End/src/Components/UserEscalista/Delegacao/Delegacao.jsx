import "./Delegacao.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getStoredUser } from "../../../utils/authStorage";
import { Bell, CircleUserRound } from "lucide-react";

const atividades = [
    {
        id: 1,
        tempo: "Há 10 minutos",
        titulo: "Dra. Aline aceitou o plantão de Pediatria - 01/05",
        descricao: "Originado por Dr. Ricardo",
        tipo: "sucesso",
    },
    {
        id: 2,
        tempo: "Há 2 horas",
        titulo: "Nova Oferta Adicionada",
        descricao: "Dr. João S. ofertou seu plantão em UTI Adulto - 23/04",
        tipo: "neutro",
    },
    {
        id: 3,
        tempo: "Há 2 dias",
        titulo: "Nova Oferta Adicionada",
        descricao: "Dra. Maria C. ofertou seu plantão em Cardiologia - 30/04",
        tipo: "neutro",
    },
];

    const usuario = getStoredUser();
    const nomeUsuario = usuario?.name || "Hospital";

const Delegacao = () => {
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
                            {atividades.map((atividade) => (
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
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Delegacao;