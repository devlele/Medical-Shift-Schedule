import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import {
  validarEmail,
  validarTelefone,
  validarCNPJ,
  validarCampoObrigatorio,
  formatarTelefone,
  formatarCNPJ,
} from "../../utils/validacoes";
import logo from "../../assets/logo-icon.png";
import Footer from "../../Components/Footer/Footer.jsx";
import "./CadastroHospital.css";
import "../../utils/validacoes.css";

export default function CadastroHospital() {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    responsavel: "",
    telefone: "",
    email: "",
    descricao: "",
  });

  const [erros, setErros] = useState({});
  const [formularioTocado, setFormularioTocado] = useState({});

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

    if (!validarCampoObrigatorio(formData.responsavel)) {
      novoErros.responsavel = "Responsável é obrigatório";
    }

    if (!validarCampoObrigatorio(formData.telefone)) {
      novoErros.telefone = "Telefone é obrigatório";
    } else if (!validarTelefone(formData.telefone)) {
      novoErros.telefone = "Telefone inválido. Formato: (XX) XXXXX-XXXX";
    }

    if (!validarCampoObrigatorio(formData.email)) {
      novoErros.email = "Email corporativo é obrigatório";
    } else if (!validarEmail(formData.email)) {
      novoErros.email = "Email inválido";
    }

    if (!validarCampoObrigatorio(formData.descricao)) {
      novoErros.descricao = "Descrição é obrigatória";
    }

    return novoErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    // Aplicar formatação automática
    if (name === "telefone") {
      novoValor = formatarTelefone(value);
    } else if (name === "cnpj") {
      novoValor = formatarCNPJ(value);
    }

    setFormData({ ...formData, [name]: novoValor });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoErros = validarFormulario();

    if (Object.keys(novoErros).length === 0) {
      console.log("Formulário válido! Dados:", formData);
      // Aqui irá a lógica de envio
    } else {
      setErros(novoErros);
      setFormularioTocado({
        nome: true,
        cnpj: true,
        responsavel: true,
        telefone: true,
        email: true,
        descricao: true,
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

            <div className={`campo ${erros.telefone ? "campo-com-erro" : ""}`}>
              <label>Telefone</label>
              <input
                type="tel"
                name="telefone"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                onBlur={() => handleBlur("telefone")}
              />
              {erros.telefone && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.telefone}
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

            <div className={`campo ${erros.descricao ? "campo-com-erro" : ""}`}>
              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Descreva sua necessidade..."
                value={formData.descricao}
                onChange={handleChange}
                onBlur={() => handleBlur("descricao")}
              ></textarea>
              {erros.descricao && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.descricao}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={Object.keys(erros).length > 0}
            >
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
