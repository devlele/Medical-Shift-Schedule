import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

import { validarEmail } from "../../utils/validacoes";
import logo from "../../assets/Logo-H.png";
import "./RecuperarSenha.css";
import "../../utils/validacoes.css";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const validarFormulario = () => {
    const novoErros = {};

    if (!email) {
      novoErros.email = "Email é obrigatório";
    } else if (!validarEmail(email)) {
      novoErros.email = "Email inválido";
    }

    return novoErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoErros = validarFormulario();

    if (Object.keys(novoErros).length === 0) {
      setEnviando(true);
      try {
        // Chamar API para enviar email de recuperação
        const response = await fetch(
          `http://localhost:8080/auth/recuperar-senha?email=${encodeURIComponent(email)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          setEnviado(true);
          setMensagem(
            "Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.",
          );
          setEmail("");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setMensagem("Não foi possível processar sua solicitação.");
        }
      } catch (error) {
        setMensagem(
          error.message.includes("Failed to fetch")
            ? "Não foi possível conectar à API. Confirme se o backend está rodando em http://localhost:8080."
            : "Erro ao processar solicitação. Tente novamente.",
        );
      } finally {
        setEnviando(false);
      }
    } else {
      setErros(novoErros);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (erros.email) {
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

  const handleBlur = () => {
    const novoErros = validarFormulario();
    setErros(novoErros);
  };

  if (enviado) {
    return (
      <div className="pagina-recuperar">
        <div className="conteudo-recuperar">
          <div className="area-logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <div className="cartao-recuperar sucesso">
            <div className="icone-sucesso">
              <CheckCircle size={48} />
            </div>
            <h2>Email enviado com sucesso!</h2>
            <p>{mensagem}</p>
            <p className="texto-redirect">
              Você será redirecionado para o login em alguns segundos...
            </p>
            <Link to="/login" className="botao-voltar">
              Voltar para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-recuperar">
      <div className="conteudo-recuperar">
        {/* LOGO */}
        <div className="area-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* CARD */}
        <div className="cartao-recuperar">
          <Link to="/login" className="botao-voltar-header">
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <h1 className="titulo-recuperar">Recuperar Senha</h1>
          <p className="descricao-recuperar">
            Digite seu email e enviaremos um link para resetar sua senha.
          </p>

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
                  placeholder="seu@email.com"
                  className="campo-input"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  disabled={enviando}
                />
              </div>
              {erros.email && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.email}
                </span>
              )}
            </div>

            {/* MENSAGEM DE ERRO/SUCESSO */}
            {mensagem && !enviado && (
              <div className="alerta-recuperar erro">{mensagem}</div>
            )}

            {/* BOTÃO ENVIAR */}
            <button
              type="submit"
              className="botao-enviar"
              disabled={enviando || Object.keys(erros).length > 0}
            >
              {enviando ? "Enviando..." : "Enviar Email de Recuperação"}
            </button>
          </form>

          <div className="rodape-recuperar">
            <p>
              Lembrou a senha?{" "}
              <Link to="/login" className="link-login-recuperar">
                Voltar para o login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
