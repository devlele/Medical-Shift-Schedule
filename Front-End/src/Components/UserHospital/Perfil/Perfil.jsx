import React, { useEffect, useState } from "react";
import { Bell, Settings, ImagePlus } from "lucide-react";
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
        const data = await getMeuPerfilMedico(); // mudar para getMeuPerfilHospital

        if (ativo) {
          setPerfil(data);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar o perfil.");
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

  const nome = perfil?.name || usuario?.name || "Hospital";
  const cnpj = perfil?.cnpj || "Nao informado";
  const uf = perfil?.uf || "UF";
  const email = perfil?.email || usuario?.email || "Email nao informado";
  const foto = perfil?.fotoPerfilUrl
    ? perfil.fotoPerfilUrl.startsWith("http")
      ? perfil.fotoPerfilUrl
      : `${API_URL}${perfil.fotoPerfilUrl}`
    : fotoPerfil;
  const endereco = perfil?.endereco || "Endereço não informado";

  return (
    <div className="pagina-perfil">
      {/* MENU LATERAL */}
      <Sidebar />

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
            <Bell className="icone icone-click" />
            <Settings className="icone icone-click" />

            <div className="usuario-topo">
              <img src={foto} alt="Usuário" className="foto-usuario-topo" />
              <span>{nome}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        {/* CARD PERFIL */}
        <section className="card-perfil">
          <div className="lado-foto">
            <img src={foto} alt="Perfil" className="foto-perfil" />
            <button className="botao-foto">
              <ImagePlus className="icone" />
            </button>
          </div>

          <div className="dados-perfil">
            <h2>{loading ? "Carregando..." : nome}</h2>
          </div>
          <p>
            {endereco} -{uf}
          </p>
        </section>

        {/* ÁREA INFERIOR */}
        <section className="area-baixo">
          {/* INFORMAÇÕES */}
          <div className="card-info">
            <h3>Informações Pessoais</h3>

            <div className="grupo-campo">
              <label>NOME COMPLETO</label>
              <div className="campo-fixo">{nome}</div>
            </div>

            <div className="grupo-campo">
              <label>E-MAIL PROFISSIONAL</label>
              <div className="campo-fixo">{email}</div>
            </div>

            <div className="linha-dupla">
              <div className="grupo-campo">
                <label>CNPJ</label>
                <div className="campo-fixo">{cnpj}</div>
              </div>

              <div className="grupo-campo">
                <label>UF</label>
                <div className="campo-fixo">{uf}</div>
              </div>
            </div>
          </div>

          {/* Histórico removido conforme solicitado */}
        </section>
      </main>
    </div>
  );
};

export default Perfil;
