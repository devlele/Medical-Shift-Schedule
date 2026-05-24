import React, { useEffect, useState } from "react";
import {
    Bell,
    Settings,
    ImagePlus,
} from "lucide-react";
import fotoPerfil from "../../../assets/drhouse.png";
import "./Perfil.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getMeuPerfilMedico } from "../../../services/doctorServices";
import { getUsuarioLogado } from "../../../utils/plantaoFormatters";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Perfil = () => {
    const usuario = getUsuarioLogado();

    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarPerfil() {
            try {
                setLoading(true);
                setErro("");

                const data = await getMeuPerfilMedico();

                if (ativo) {
                    setPerfil(data);
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                        "Não foi possível carregar o perfil."
                    );
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        carregarPerfil();

        return () => {
            ativo = false;
        };
    }, []);

    const nome = perfil?.name || usuario?.name || "Médico";
    const cpf = perfil?.cpf || "Não informado";
    const email =
        perfil?.email || usuario?.email || "Email não informado";

    const dataNascimento = perfil?.birthDate
        ? new Date(perfil.birthDate).toLocaleDateString("pt-BR")
        : "Não informada";

    const setorResponsavel =
        perfil?.responsibleSector || "Não informado";

    const foto = perfil?.fotoPerfilUrl
        ? perfil.fotoPerfilUrl.startsWith("http")
            ? perfil.fotoPerfilUrl
            : `${API_URL}${perfil.fotoPerfilUrl}`
        : fotoPerfil;

    return (
        <div className="pagina-perfil">
            <Sidebar />

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
                        <Bell className="icone icone-click" />
                        <Settings className="icone icone-click" />

                        <div className="usuario-topo">
                            <img
                                src={foto}
                                alt="Usuário"
                                className="foto-usuario-topo"
                            />
                            <span>{nome}</span>
                        </div>
                    </div>
                </header>

                {erro && (
                    <div className="alerta-login erro">
                        {erro}
                    </div>
                )}

                {/* CARD PERFIL */}
                <section className="card-perfil">
                    <div className="lado-foto">
                        <img
                            src={foto}
                            alt="Perfil"
                            className="foto-perfil"
                        />

                        <button className="botao-foto">
                            <ImagePlus className="icone" />
                        </button>
                    </div>

                    <div className="dados-perfil">
                        <h2>
                            {loading ? "Carregando..." : nome}
                        </h2>
                        <p>{setorResponsavel}</p>
                    </div>
                </section>

                {/* ÁREA INFERIOR */}
                <section className="area-baixo">
                    <div className="card-info">
                        <h3>Informações Pessoais</h3>

                        <div className="grupo-campo">
                            <label>NOME COMPLETO</label>
                            <div className="campo-fixo">
                                {nome}
                            </div>
                        </div>

                        <div className="grupo-campo">
                            <label>CPF</label>
                            <div className="campo-fixo">
                                {cpf}
                            </div>
                        </div>

                        <div className="grupo-campo">
                            <label>E-MAIL</label>
                            <div className="campo-fixo">
                                {email}
                            </div>
                        </div>

                        <div className="linha-dupla">
                            <div className="grupo-campo">
                                <label>
                                    DATA DE NASCIMENTO
                                </label>
                                <div className="campo-fixo">
                                    {dataNascimento}
                                </div>
                            </div>

                            <div className="grupo-campo">
                                <label>
                                    SETOR RESPONSÁVEL
                                </label>
                                <div className="campo-fixo">
                                    {setorResponsavel}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Perfil;