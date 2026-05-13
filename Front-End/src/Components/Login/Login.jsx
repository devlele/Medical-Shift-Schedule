import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";

import { validarEmail, validarSenha } from "../../utils/validacoes";
import { loginHospital } from "../../services/api";
import logo from "../../assets/Logo-H.png";
import "./Login.css";
import "../../utils/validacoes.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [formularioTocado, setFormularioTocado] = useState({
    email: false,
    senha: false,
  });

  const validarFormulario = () => {
    const novoErros = {};

    if (!email) {
      novoErros.email = "Email é obrigatório";
    } else if (!validarEmail(email)) {
      novoErros.email = "Email inválido";
    }

    if (!senha) {
      novoErros.senha = "Senha é obrigatória";
    } else if (!validarSenha(senha)) {
      novoErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    return novoErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoErros = validarFormulario();
    setErroLogin("");

    if (Object.keys(novoErros).length === 0) {
      const payload = {
        email: email.trim(),
        password: senha,
      };

      try {
        setEnviando(true);
        const resposta = await loginHospital(payload);

        localStorage.setItem("token", resposta.token);
        localStorage.setItem("emailUsuario", payload.email);

        navigate("/TelaPrincipal");
      } catch (error) {
        setErroLogin(
          error.message.includes("Failed to fetch")
            ? "Nao foi possivel conectar à API. Confirme se o backend está rodando em http://localhost:8080."
            : "Email ou senha inválidos."
        );
      } finally {
        setEnviando(false);
      }
    } else {
      setErros(novoErros);
      setFormularioTocado({
        email: true,
        senha: true,
      });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErroLogin("");
    if (formularioTocado.email && erros.email) {
      const novoErros = { ...erros };
      if (!e.target.value) {
        novoErros.email = "Email é obrigatório";
      } else if (!validarEmail(e.target.value)) {
        novoErros.email = "Email inválido";
      } else {
        delete novoErros.email;
      }
      setErros(novoErros);
    }
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
    setErroLogin("");
    if (formularioTocado.senha && erros.senha) {
      const novoErros = { ...erros };
      if (!e.target.value) {
        novoErros.senha = "Senha é obrigatória";
      } else if (!validarSenha(e.target.value)) {
        novoErros.senha = "Senha deve ter pelo menos 6 caracteres";
      } else {
        delete novoErros.senha;
      }
      setErros(novoErros);
    }
  };

  const handleBlur = (field) => {
    setFormularioTocado({ ...formularioTocado, [field]: true });
    const novoErros = validarFormulario();
    setErros(novoErros);
  };

  return (
    <div className="pagina-login">
      <div className="conteudo-login">
        {/* LOGO */}
        <div className="area-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* CARD */}
        <div className="cartao-login">
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div
              className={`grupo-formulario ${erros.email ? "campo-com-erro" : ""}`}
            >
              <label className="label-formulario">Email</label>

              <div className="area-input">
                <Mail className="icone-input" />
                <input
                  type="email"
                  placeholder="nome@hospital.com"
                  className="campo-input"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                />
              </div>
              {erros.email && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.email}
                </span>
              )}
            </div>

            {/* SENHA */}
            <div
              className={`grupo-formulario ${erros.senha ? "campo-com-erro" : ""}`}
            >
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
                  value={senha}
                  onChange={handleSenhaChange}
                  onBlur={() => handleBlur("senha")}
                />
              </div>
              {erros.senha && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.senha}
                </span>
              )}
            </div>

            {/* CHECKBOX */}
            <div className="linha-lembrar">
              <input type="checkbox" id="lembrar" className="checkbox" />
              <label htmlFor="lembrar" className="label-lembrar">
                Lembrar acesso neste dispositivo
              </label>
            </div>

            {erroLogin && <div className="alerta-login erro">{erroLogin}</div>}

            {/* BOTÃO */}
            <button
              type="submit"
              className="botao-principal"
              disabled={enviando || Object.keys(erros).length > 0}
            >
              {enviando ? "Entrando..." : "Entrar"}
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
