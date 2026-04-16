import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "../../assets/Logo-H.png";
import Footer from "../../Components/Footer/Footer.jsx";
import "./CadastroHospital.css";

export default function CadastroHospital() {
  return (
    <div>
      <div className="pagina-cadastro">
        {/* LADO ESQUERDO */}
        <div className="painel-esquerdo">
          <img src={logo} alt="Logo" className="logo-cadastro" />

          <h2 className="titulo-esquerdo">
            Eleve a gestão do seu corpo clínico
          </h2>

          <p className="texto-esquerdo">
            Simplifique o controle de plantões médicos com tecnologia
            inteligente, organização eficiente e visão analítica.
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="painel-direito">
          <form className="form-cadastro">
            <h1>Cadastro da Instituição</h1>

            <span className="subtitulo">
              Preencha os dados para análise da sua instituição.
            </span>

            <div className="campo">
              <label>Nome da instituição</label>
              <input type="text" placeholder="Hospital Central" required />
            </div>

            <div className="campo">
              <label>CNPJ</label>
              <input type="text" placeholder="00.000.000/0000-00" required />
            </div>

            <div className="campo">
              <label>Responsável</label>
              <input type="text" placeholder="Nome completo" required />
            </div>

            <div className="campo">
              <label>Telefone</label>
              <input type="tel" placeholder="(11) 99999-9999" required />
            </div>

            <div className="campo">
              <label>Email corporativo</label>
              <input
                type="email"
                placeholder="contato@hospital.com.br"
                required
              />
            </div>

            <div className="campo">
              <label>Descrição</label>
              <textarea
                placeholder="Descreva sua necessidade..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-cadastrar">
              Enviar Solicitação <ArrowRight size={18} />
            </button>

            {/*LINK PARA LOGIN */}
            <Link to="/login" className="link-login">
              Voltar para o login
            </Link>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
