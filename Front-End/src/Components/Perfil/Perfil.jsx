import React from "react";
import {Bell, Settings, Home, ClipboardPlus, History, User, ImagePlus, CalendarDays,} from "lucide-react";
import logo from "../../assets/Logo-H.png";
import fotoPerfil from "../../assets/drhouse.png"; 
import "./Perfil.css";

const Perfil = () => {
    return (
        <div className="pagina-perfil">
            {/* MENU LATERAL */}
            <aside className="sidebar">
                <div className="area-logo">
                    <img src={logo} alt="Logo MSS" className="logo" />
                </div>

                <nav className="menu-lateral">
                    <div className="item-menu">
                        <Home className="icone" />
                        <span>Home</span>
                    </div>

                    <div className="item-menu">
                        <CalendarDays className="icone" />
                        <span>Agenda</span>
                    </div>

                    <div className="item-menu">
                        <ClipboardPlus className="icone" />
                        <span>Plantões</span>
                    </div>

                    <div className="item-menu">
                        <History className="icone" />
                        <span>Histórico</span>
                    </div>

                    <div className="item-menu ativo">
                        <User className="icone" />
                        <span>Perfil</span>
                    </div>
                </nav>
            </aside>

            {/* CONTEÚDO */}
            <main className="conteudo-perfil">
                {/* TOPO */}
                <header className="topo-perfil">
                    <div>
                        <h1 className="titulo-pagina">Perfil</h1>
                        <p className="subtitulo-pagina">
                            Visualize suas informações de Perfil
                        </p>
                    </div>

                    <div className="acoes-topo">
                        <Bell className="icone icone-click"/>
                        <Settings className="icone icone-click"/>

                        <div className="usuario-topo">
                            <img
                                src={fotoPerfil}
                                alt="Usuário"
                                className="foto-usuario-topo"
                            />
                            <span>Dr. House</span>
                        </div>
                    </div>
                </header>

                {/* CARD PERFIL */}
                <section className="card-perfil">
                    <div className="lado-foto">
                        <img src={fotoPerfil} alt="Perfil" className="foto-perfil" />
                        <button className="botao-foto">
                            <ImagePlus className="icone" />
                        </button>
                    </div>

                    <div className="dados-perfil">
                        <h2>Dr. House</h2>
                        <p>Cardiologia • CRM 123456-SP</p>
                    </div>
                </section>

                {/* ÁREA INFERIOR */}
                <section className="area-baixo">
                    {/* INFORMAÇÕES */}
                    <div className="card-info">
                        <h3>Informações Pessoais</h3>

                        <div className="grupo-campo">
                            <label>NOME COMPLETO</label>
                            <div className="campo-fixo">Dr. Anderson Silva</div>
                        </div>

                        <div className="grupo-campo">
                            <label>ESPECIALIDADE</label>
                            <div className="campo-fixo">Cardiologia Clínica</div>
                        </div>

                        <div className="grupo-campo">
                            <label>E-MAIL PROFISSIONAL</label>
                            <div className="campo-fixo">anderson.silva@clinical.com</div>
                        </div>

                        <div className="linha-dupla">
                            <div className="grupo-campo">
                                <label>CRM</label>
                                <div className="campo-fixo">123456</div>
                            </div>

                            <div className="grupo-campo">
                                <label>UF</label>
                                <div className="campo-fixo">SP</div>
                            </div>
                        </div>
                    </div>

                    {/* HISTÓRICO */}
                    <div className="card-historico">
                        <div className="topo-historico-geral">
                            <h3>Histórico Recente</h3>
                        </div>

                        <div className="item-historico">
                            <div className="linha-historico">
                                <span className="tag">NOTURNO</span>
                                <span>3 set</span>
                            </div>
                            <strong>Hospital Alvorada</strong>
                            <p>UTI Cardiológica • 12h</p>
                        </div>

                        <div className="item-historico">
                            <div className="linha-historico">
                                <span className="tag azul">DIURNO</span>
                                <span>15 out</span>
                            </div>
                            <strong>Clínica Sanctuary</strong>
                            <p>Emergência • 6h</p>
                        </div>

                        <div className="item-historico">
                            <div className="linha-historico">
                                <span className="tag">NOTURNO</span>
                                <span>12 out</span>
                            </div>
                            <strong>Hospital Central</strong>
                            <p>Plantão Geral • 12h</p>
                        </div>

                        <div className="item-historico">
                            <div className="linha-historico">
                                <span className="tag azul">DIURNO</span>
                                <span>10 out</span>
                            </div>
                            <strong>Hospital Alvorada</strong>
                            <p>UTI Cardiológica • 12h</p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
};

export default Perfil;
