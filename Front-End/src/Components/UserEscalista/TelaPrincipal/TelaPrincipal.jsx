import Sidebar from "../../Sidebar/Sidebar";
import "./TelaPrincipal.css";
import userImg from "../../../assets/draGrey.png";
import {
    Settings,
    Bell,
    Zap,
    User,
} from "lucide-react";

export default function TelaPrincipal() {
    const setores = [
        {
            nome: "Cardiologia",
            subtitulo: "UNIDADE CORONÁRIA (UCO)",
            coordenador: "Dr. André Santos",
            staff: "24 Médicos",
            botao: "Ver Detalhes",
        },
        {
            nome: "Pronto Socorro",
            subtitulo: "EMERGÊNCIA ADULTO",
            coordenador: "Dra. Beatriz Lima",
            staff: "48 Médicos",
            botao: "Resolver Pendência",
        },
        {
            nome: "Pediatria",
            subtitulo: "ALA INFANTIL SUL",
            coordenador: "Dr. Ricardo Melo",
            staff: "18 Médicos",
            botao: "Ver Detalhes",
        },
        {
            nome: "UTI Adulto",
            subtitulo: "UNIDADE DE TERAPIA INTENSIVA",
            coordenador: "Dr. Carlos Eduardo",
            staff: "32 Médicos",
            botao: "Ver Detalhes",
        },
        {
            nome: "Neurologia",
            subtitulo: "CENTRO DE NEUROCIÊNCIAS",
            coordenador: "Dra. Helena Martins",
            staff: "12 Médicos",
            botao: "Ver Detalhes",
        },
    ];

    return (
        <div className="layout-escalista">
            <Sidebar />

            <main className="gestao-container">
                {/* HEADER */}
                <header className="topo-escalista">
                    <div>
                        <h1>Painel de Controle</h1>
                        <p>Bem-vindo de volta, Dr(a). Grey</p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <Settings className="icone-topo" />

                        <div className="user">
                            <img src={userImg} alt="user" />
                            <span>Dr(a). Grey</span>
                        </div>
                    </div>
                </header>

                {/* Cards superiores */}
                <div className="top-cards">
                    <div className="card colaboradores">
                        <span className="label">
                            COLABORADORES
                        </span>

                        <div className="number-row">
                            <h2>142</h2>
                            <span>Médicos Ativos</span>
                        </div>
                    </div>

                    <div className="card live-card">
                        <h2>08 Setores</h2>

                        <p>
                            Operando em regime de contingência
                            e alta demanda operacional no
                            momento.
                        </p>
                    </div>
                </div>

                {/* Lista de setores */}
                <div className="setores-grid">
                    {setores.map((setor, index) => (
                        <div className="setor-card" key={index}>
                            <h3>{setor.nome}</h3>

                            <span className="subtitulo">
                                {setor.subtitulo}
                            </span>

                            <div className="divider" />

                            <div className="info">
                                <p>Coordenador:</p>
                                <strong>
                                    {setor.coordenador}
                                </strong>
                            </div>

                            <div className="info">
                                <p>Staff total:</p>
                                <strong>
                                    {setor.staff}
                                </strong>
                            </div>

                            <button className="details-btn">
                                {setor.botao}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}