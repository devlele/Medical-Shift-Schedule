import React from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import logo from "../../assets/Logo-H.png";
import "./Login.css";

const Login = () => {
  return (
    <div className="pagina-login">
      <div className="conteudo-login">
        {/* LOGO */}
        <div className="area-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* CARD */}
        <div className="cartao-login">
          <form>
            {/* EMAIL */}
            <div className="grupo-formulario">
              <label className="label-formulario">Email</label>

              <div className="area-input">
                <Mail className="icone-input" />
                <input
                  type="email"
                  placeholder="nome@hospital.com"
                  className="campo-input"
                />
              </div>
            </div>

            {/* SENHA */}
            <div className="grupo-formulario">
              <div className="linha-label">
                <label className="label-formulario">Senha</label>

                <button type="button" className="botao-esqueceu">
                  Esqueci minha senha
                </button>
              </div>

              <div className="area-input">
                <Lock className="icone-input" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="campo-input"
                />
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="linha-lembrar">
              <input type="checkbox" id="lembrar" className="checkbox" />
              <label htmlFor="lembrar" className="label-lembrar">
                Lembrar acesso neste dispositivo
              </label>
            </div>

            {/* BOTÃO */}
            <button type="submit" className="botao-principal">
              Entrar
            </button>
          </form>

          {/* CADASTRO */}
          <div className="texto-cadastro">
            <p>
              Não possui uma conta?{" "}
              <Link to="/CadastroTipo" className="link-cadastro">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="rodape-login">
        © 2026 Medical Shift Schedule. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Login;
