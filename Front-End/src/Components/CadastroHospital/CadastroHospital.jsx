import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import {
  validarEmail,
  validarCNPJ,
  validarCampoObrigatorio,
  formatarCNPJ,
} from "../../utils/validacoes";
import { cadastrarHospital } from "../../services/api";
import logo from "../../assets/logo-icon.png";
import Footer from "../../Components/Footer/Footer.jsx";
import "./CadastroHospital.css";
import "../../utils/validacoes.css";

export default function CadastroHospital() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    responsavel: "",
    email: "",
    senha: "",
    confirmaSenha: "",
  });

  const [erros, setErros] = useState({});
  const [formularioTocado, setFormularioTocado] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  const validarFormulario = () => {
    const novoErros = {};

    if (!validarCampoObrigatorio(formData.nome)) {
      novoErros.nome = "Nome da instituição é obrigatório";
    }

    if (!validarCampoObrigatorio(formData.cnpj)) {
      novoErros.cnpj = "CNPJ é obrigatório";
    } else if (!validarCNPJ(formData.cnpj)) {
      novoErros.cnpj = "CNPJ inválido";
    }

    if (!validarCampoObrigatorio(formData.endereco)) {
      novoErros.endereco = "Endereço é obrigatório";
    }

    if (!validarCampoObrigatorio(formData.responsavel)) {
      novoErros.responsavel = "Responsável é obrigatório";
    }

    if (!validarCampoObrigatorio(formData.email)) {
      novoErros.email = "Email corporativo é obrigatório";
    } else if (!validarEmail(formData.email)) {
      novoErros.email = "Email inválido";
    }

    if (!validarCampoObrigatorio(formData.senha)) {
      novoErros.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      novoErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!validarCampoObrigatorio(formData.confirmaSenha)) {
      novoErros.confirmaSenha = "Confirmação de senha é obrigatória";
    } else if (formData.confirmaSenha !== formData.senha) {
      novoErros.confirmaSenha = "Senhas não conferem";
    }

    return novoErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === "cnpj") {
      novoValor = formatarCNPJ(value);
    }

    setFormData({ ...formData, [name]: novoValor });
    setErroEnvio("");
    setMensagemSucesso("");

    // Validação em tempo real se o campo foi tocado
    if (formularioTocado[name]) {
      const novoErros = validarFormulario();
      setErros(novoErros);
    }
  };

  const handleBlur = (field) => {
    setFormularioTocado({ ...formularioTocado, [field]: true });
    const novoErros = validarFormulario();
    setErros(novoErros);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoErros = validarFormulario();
    setErroEnvio("");
    setMensagemSucesso("");

    if (Object.keys(novoErros).length === 0) {
      const payload = {
        nomeFantasia: formData.nome.trim(),
        cnpj: formData.cnpj.replace(/\D/g, ""),
        endereco: formData.endereco.trim(),
        nomeGestor: formData.responsavel.trim(),
        email: formData.email.trim(),
        password: formData.senha,
      };

      try {
        setEnviando(true);
        await cadastrarHospital(payload);
        setMensagemSucesso("Hospital cadastrado com sucesso. Redirecionando para login...");
        setTimeout(() => navigate("/Login"), 1200);
      } catch (error) {
        setErroEnvio(
          error.message.includes("Failed to fetch")
            ? "Nao foi possivel conectar à API. Confirme se o backend está rodando em http://localhost:8080."
            : "Nao foi possivel cadastrar o hospital. Verifique se email ou CNPJ já estao cadastrados."
        );
      } finally {
        setEnviando(false);
      }
    } else {
      setErros(novoErros);
      setFormularioTocado({
        nome: true,
        cnpj: true,
        endereco: true,
        responsavel: true,
        email: true,
        senha: true,
        confirmaSenha: true,
      });
    }
  };

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
          <form className="form-cadastro" onSubmit={handleSubmit}>
            <h1>Cadastro da Instituição</h1>

            <span className="subtitulo">
              Preencha os dados para análise da sua instituição.
            </span>

            <div className={`campo ${erros.nome ? "campo-com-erro" : ""}`}>
              <label>Nome da instituição</label>
              <input
                type="text"
                name="nome"
                placeholder="Hospital Central"
                value={formData.nome}
                onChange={handleChange}
                onBlur={() => handleBlur("nome")}
              />
              {erros.nome && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.nome}
                </span>
              )}
            </div>

            <div className={`campo ${erros.cnpj ? "campo-com-erro" : ""}`}>
              <label>CNPJ</label>
              <input
                type="text"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleChange}
                onBlur={() => handleBlur("cnpj")}
              />
              {erros.cnpj && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.cnpj}
                </span>
              )}
            </div>

            <div className={`campo ${erros.endereco ? "campo-com-erro" : ""}`}>
              <label>Endereço</label>
              <input
                type="text"
                name="endereco"
                placeholder="Rua, número, bairro e cidade"
                value={formData.endereco}
                onChange={handleChange}
                onBlur={() => handleBlur("endereco")}
              />
              {erros.endereco && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.endereco}
                </span>
              )}
            </div>

            <div
              className={`campo ${erros.responsavel ? "campo-com-erro" : ""}`}
            >
              <label>Responsável</label>
              <input
                type="text"
                name="responsavel"
                placeholder="Nome completo"
                value={formData.responsavel}
                onChange={handleChange}
                onBlur={() => handleBlur("responsavel")}
              />
              {erros.responsavel && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.responsavel}
                </span>
              )}
            </div>

            <div className={`campo ${erros.email ? "campo-com-erro" : ""}`}>
              <label>Email corporativo</label>
              <input
                type="email"
                name="email"
                placeholder="contato@hospital.com.br"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
              />
              {erros.email && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.email}
                </span>
              )}
            </div>

            <div className="linha-2">
              <div className={`campo ${erros.senha ? "campo-com-erro" : ""}`}>
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleChange}
                  onBlur={() => handleBlur("senha")}
                />
                {erros.senha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.senha}
                  </span>
                )}
              </div>

              <div
                className={`campo ${erros.confirmaSenha ? "campo-com-erro" : ""}`}
              >
                <label>Confirmar senha</label>
                <input
                  type="password"
                  name="confirmaSenha"
                  placeholder="••••••••"
                  value={formData.confirmaSenha}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmaSenha")}
                />
                {erros.confirmaSenha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.confirmaSenha}
                  </span>
                )}
              </div>
            </div>

            {erroEnvio && <div className="alerta-formulario erro">{erroEnvio}</div>}
            {mensagemSucesso && (
              <div className="alerta-formulario sucesso">{mensagemSucesso}</div>
            )}

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={enviando || Object.keys(erros).length > 0}
            >
              {enviando ? "Enviando..." : "Cadastrar hospital"}{" "}
              <ArrowRight size={18} />
            </button>

            {/*LINK PARA LOGIN */}
            <Link to="/Login" className="link-login">
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
