import React from "react";
import {
  Bell,
  Settings,
  Home,
  ClipboardPlus,
  User,
  ImagePlus,
} from "lucide-react";
import fotoPerfil from "../../../assets/drhouse.png";
import "./Perfil.css";
import Sidebar from "../../Sidebar/Sidebar";

const Perfil = () => {
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

          {/* Histórico removido conforme solicitado */}
        </section>
      </main>
    </div>
  );
};

export default Perfil;
