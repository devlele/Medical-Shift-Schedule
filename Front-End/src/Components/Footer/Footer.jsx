import React from "react";
import logo from "../../assets/apenasLogo.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="conteudo-rodape">
        <div className="topo-rodape">
          <img src={logo} alt="Logo" className="logo-rodape" />

          <p className="descricao-rodape">
            A plataforma definitiva para médicos e gestores organizarem plantões
            com eficiência.
          </p>
        </div>

        <div className="linha-divisoria"></div>

        <div className="base-rodape">
          <span>© 2026 Medical Shift Schedule</span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}
