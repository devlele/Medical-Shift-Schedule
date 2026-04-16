import { Link } from "react-router-dom";
import { Stethoscope, Building2, ArrowRight } from "lucide-react";

import logo from "../../assets/Logo-H.png";
import "./CadastroTipo.css";

const CadastroTipo = () => {
  return (
    <div className="pagina-tipo">
      {/* CABEÇALHO */}
      <div className="cabecalho-tipo">
        <img src={logo} alt="Logo" className="logo-tipo" />

        <p className="descricao-tipo">
          Escolha como deseja acessar a plataforma para gerenciar seus plantões
          e escalas com clareza e autoridade.
        </p>
      </div>

      {/* GRID */}
      <div className="grade-tipo">
        {/* MÉDICO */}
        <div className="cartao-tipo cartao-medico">
          <div className="icone-tipo icone-medico">
            <Stethoscope className="icone-principal" />
          </div>

          <h2 className="titulo-tipo">Sou um Médico</h2>

          <p className="texto-tipo">
            Encontre plantões disponíveis, gerencie sua agenda pessoal e receba
            pagamentos de forma simplificada e segura.
          </p>

          <Link to="/CadastroMedico" className="link-tipo">
            Começar jornada profissional <ArrowRight className="icone-link" />
          </Link>

          <Stethoscope className="icone-fundo" />
        </div>

        {/* HOSPITAL */}
        <div className="cartao-tipo cartao-hospital">
          <div className="icone-tipo icone-hospital">
            <Building2 className="icone-principal" />
          </div>

          <h2 className="titulo-tipo">Sou Hospital / Clínica</h2>

          <p className="texto-tipo">
            Organize escalas complexas, visualize a disponibilidade da equipe em
            tempo real e reduza a sobrecarga administrativa.
          </p>
          <Link to="/CadastroHospital" className="link-tipo">
            Fazer requisição dos serviços <ArrowRight className="icone-link" />
          </Link>

          <Building2 className="icone-fundo" />
        </div>
      </div>

      {/* LOGIN */}
      <div className="area-login">
        <p>
          Já possui uma conta?{" "}
          <Link to="/Login" className="link-login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CadastroTipo;
