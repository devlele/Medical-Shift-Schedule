import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { validarCPF } from "../../../utils/validarCPF";

import { AlertCircle } from "lucide-react";

import {
  validarEmail,
  validarTelefone,
  validarCRM,
  validarCampoObrigatorio,
  formatarTelefone,
} from "../../../utils/validacoes";

import "./CadastrarProfissional.css";

export default function CadastrarProfissional() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    crm: "",
    uf: "",
    email: "",
    nascimento: "",
    telefone: "",
    especialidade: "",
  });

  const [erros, setErros] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

  const validarFormulario = () => {
    const novoErros = {};

    if (!validarCampoObrigatorio(formData.nome))
      novoErros.nome = "Nome é obrigatório";

    if (!validarCampoObrigatorio(formData.cpf))
      novoErros.cpf = "CPF é obrigatório";
    else if (!validarCPF(formData.cpf)) novoErros.cpf = "CPF inválido";

    if (!validarCampoObrigatorio(formData.crm))
      novoErros.crm = "CRM é obrigatório";
    else if (!validarCRM(formData.crm)) novoErros.crm = "CRM inválido";

    if (!validarCampoObrigatorio(formData.uf))
      novoErros.uf = "UF é obrigatória";

    if (!validarCampoObrigatorio(formData.email))
      novoErros.email = "Email é obrigatório";
    else if (!validarEmail(formData.email)) novoErros.email = "Email inválido";

    if (!validarCampoObrigatorio(formData.nascimento))
      novoErros.nascimento = "Data de nascimento é obrigatória";

    if (!validarCampoObrigatorio(formData.telefone))
      novoErros.telefone = "Telefone é obrigatório";
    else if (!validarTelefone(formData.telefone))
      novoErros.telefone = "Telefone inválido";

    if (!validarCampoObrigatorio(formData.especialidade))
      novoErros.especialidade = "Especialidade é obrigatória";

    return novoErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === "telefone") {
      novoValor = formatarTelefone(value);
    }

    if (name === "cpf") {
      novoValor = formatarCPF(value);
    }

    setFormData({ ...formData, [name]: novoValor });

    if (submitted) {
      setErros(validarFormulario());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const novoErros = validarFormulario();

    if (Object.keys(novoErros).length === 0) {
      console.log("Form válido:", formData);
    } else {
      setErros(novoErros);
    }
  };

  return (
    <div className="cadastro-layout">
      <Sidebar />

      <main className="cadastro-main">
        {/* HEADER */}
        <header className="cadastro-header">
          <div>
            <h1>Cadastrar Escalista</h1>
            <p>Preencha os dados do profissional</p>
          </div>
        </header>

        {/* CARD */}
        <section className="cadastro-card">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            {/* NOME */}
            <div className="form-group">
              <label>Nome</label>
              <input
                name="nome"
                placeholder="Ex: Dr. João Silva"
                value={formData.nome}
                onChange={handleChange}
              />
              {submitted && erros.nome && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} /> {erros.nome}
                </span>
              )}
            </div>

            {/* CPF + CRM */}
            <div className="form-row">
              <div className="form-group">
                <label>CPF</label>
                <input
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                />
                {submitted && erros.cpf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.cpf}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>CRM</label>
                <input
                  name="crm"
                  placeholder="Ex: 123456"
                  value={formData.crm}
                  onChange={handleChange}
                />
                {submitted && erros.crm && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.crm}
                  </span>
                )}
              </div>
            </div>

            {/* UF + EMAIL */}
            <div className="form-row">
              <div className="form-group">
                <label>UF</label>
                <select name="uf" value={formData.uf} onChange={handleChange}>
                  <option value="">Selecione o estado</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                </select>
                {submitted && erros.uf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.uf}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  placeholder="exemplo@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {submitted && erros.email && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.email}
                  </span>
                )}
              </div>
            </div>

            {/* NASCIMENTO + TELEFONE */}
            <div className="form-row">
              <div className="form-group">
                <label>Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                />
                {submitted && erros.nascimento && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.nascimento}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                />
                {submitted && erros.telefone && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.telefone}
                  </span>
                )}
              </div>
            </div>

            {/* ESPECIALIDADE */}
            <div className="form-group">
              <label>Especialidade</label>
              <select
                name="especialidade"
                value={formData.especialidade}
                onChange={handleChange}
              >
                <option value="">Selecione a especialidade</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Ortopedia">Ortopedia</option>
              </select>

              {submitted && erros.especialidade && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} /> {erros.especialidade}
                </span>
              )}
            </div>

            {/* BOTÃO */}
            <button type="submit" className="btn-submit">
              Cadastrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
