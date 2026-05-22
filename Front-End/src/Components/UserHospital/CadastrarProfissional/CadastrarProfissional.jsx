<<<<<<< HEAD
import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { validarCPF } from "../../../utils/validarCPF";
import { AlertCircle, CheckCircle } from "lucide-react";

import {
  validarCampoObrigatorio,
  validarEmail,
  validarSenha,
} from "../../../utils/validacoes";

import {
  criarEscalista,
  getSetores,
} from "../Setores/setorServices.js";

import "./CadastrarProfissional.css";

const initialFormData = {
  nome: "",
  cpf: "",
  email: "",
  nascimento: "",
  cargo: "",
  setorId: "",
  senha: "",
  confirmaSenha: "",
};

export default function CadastrarProfissional() {
  const [formData, setFormData] = useState(initialFormData);
  const [setores, setSetores] = useState([]);
  const [loadingSetores, setLoadingSetores] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erros, setErros] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    carregarSetores();
  }, []);

  const carregarSetores = async () => {
    try {
      setLoadingSetores(true);
      const setoresData = await getSetores();
      setSetores(setoresData);
    } catch (error) {
      console.error(error);
      setErroEnvio("Não foi possível carregar os setores do hospital.");
    } finally {
      setLoadingSetores(false);
    }
  };

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);
=======
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
>>>>>>> origin/Front-End
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

<<<<<<< HEAD
  const normalizarCPF = (valor) => valor.replace(/\D/g, "");

  const obterMensagemErro = (error) => {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    return error.message || data?.message || "Não foi possível cadastrar o escalista.";
  };

  const validarFormulario = (dados = formData) => {
    const novoErros = {};

    if (!validarCampoObrigatorio(dados.nome)) {
      novoErros.nome = "Nome é obrigatório";
    }

    if (!validarCampoObrigatorio(dados.cpf)) {
      novoErros.cpf = "CPF é obrigatório";
    } else if (!validarCPF(dados.cpf)) {
      novoErros.cpf = "CPF inválido";
    }

    if (!validarCampoObrigatorio(dados.email)) {
      novoErros.email = "Email é obrigatório";
    } else if (!validarEmail(dados.email)) {
      novoErros.email = "Email inválido";
    }

    if (!validarCampoObrigatorio(dados.nascimento)) {
      novoErros.nascimento = "Data de nascimento é obrigatória";
    }

    if (!validarCampoObrigatorio(dados.cargo)) {
      novoErros.cargo = "Cargo é obrigatório";
    }

    if (!validarCampoObrigatorio(dados.setorId)) {
      novoErros.setorId = "Setor é obrigatório";
    }

    if (!validarCampoObrigatorio(dados.senha)) {
      novoErros.senha = "Senha é obrigatória";
    } else if (!validarSenha(dados.senha)) {
      novoErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!validarCampoObrigatorio(dados.confirmaSenha)) {
      novoErros.confirmaSenha = "Confirme a senha";
    } else if (dados.senha !== dados.confirmaSenha) {
      novoErros.confirmaSenha = "As senhas não conferem";
    }
=======
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
>>>>>>> origin/Front-End

    return novoErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    const novoValor = name === "cpf" ? formatarCPF(value) : value;
    const dadosAtualizados = { ...formData, [name]: novoValor };

    setFormData(dadosAtualizados);
    setErroEnvio("");
    setMensagemSucesso("");

    if (submitted) {
      setErros(validarFormulario(dadosAtualizados));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErroEnvio("");
    setMensagemSucesso("");

    const novoErros = validarFormulario();
    setErros(novoErros);

    if (Object.keys(novoErros).length > 0) {
      return;
    }

    const payload = {
      name: formData.nome.trim(),
      cpf: normalizarCPF(formData.cpf),
      email: formData.email.trim(),
      birthday: formData.nascimento,
      department: formData.cargo.trim(),
      password: formData.senha,
      setor: {
        id: Number(formData.setorId),
      },
    };

    try {
      setSubmitting(true);
      await criarEscalista(payload);
      setFormData(initialFormData);
      setSubmitted(false);
      setErros({});
      setMensagemSucesso("Escalista cadastrado e vinculado ao setor com sucesso.");
    } catch (error) {
      console.error(error);
      setErroEnvio(obterMensagemErro(error));
    } finally {
      setSubmitting(false);
=======

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
>>>>>>> origin/Front-End
    }
  };

  return (
    <div className="cadastro-layout">
      <Sidebar />

      <main className="cadastro-main">
<<<<<<< HEAD
        <header className="cadastro-header">
          <div>
            <h1>Cadastrar Escalista</h1>
            <p>Preencha os dados do profissional responsável pelo setor</p>
          </div>
        </header>

        <section className="cadastro-card">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            {erroEnvio && (
              <div className="alerta-formulario erro">
                <AlertCircle size={18} />
                <span>{erroEnvio}</span>
              </div>
            )}

            {mensagemSucesso && (
              <div className="alerta-formulario sucesso">
                <CheckCircle size={18} />
                <span>{mensagemSucesso}</span>
              </div>
            )}

=======
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
>>>>>>> origin/Front-End
            <div className="form-group">
              <label>Nome</label>
              <input
                name="nome"
<<<<<<< HEAD
                placeholder="Ex: Ana Souza"
                value={formData.nome}
                onChange={handleChange}
                className={submitted && erros.nome ? "input-erro" : ""}
=======
                placeholder="Ex: Dr. João Silva"
                value={formData.nome}
                onChange={handleChange}
>>>>>>> origin/Front-End
              />
              {submitted && erros.nome && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} /> {erros.nome}
                </span>
              )}
            </div>

<<<<<<< HEAD
=======
            {/* CPF + CRM */}
>>>>>>> origin/Front-End
            <div className="form-row">
              <div className="form-group">
                <label>CPF</label>
                <input
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
<<<<<<< HEAD
                  className={submitted && erros.cpf ? "input-erro" : ""}
=======
>>>>>>> origin/Front-End
                />
                {submitted && erros.cpf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.cpf}
                  </span>
                )}
              </div>

              <div className="form-group">
<<<<<<< HEAD
                <label>Email</label>
                <input
                  type="email"
=======
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
>>>>>>> origin/Front-End
                  name="email"
                  placeholder="exemplo@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
<<<<<<< HEAD
                  className={submitted && erros.email ? "input-erro" : ""}
=======
>>>>>>> origin/Front-End
                />
                {submitted && erros.email && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.email}
                  </span>
                )}
              </div>
            </div>

<<<<<<< HEAD
=======
            {/* NASCIMENTO + TELEFONE */}
>>>>>>> origin/Front-End
            <div className="form-row">
              <div className="form-group">
                <label>Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
<<<<<<< HEAD
                  className={submitted && erros.nascimento ? "input-erro" : ""}
=======
>>>>>>> origin/Front-End
                />
                {submitted && erros.nascimento && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.nascimento}
                  </span>
                )}
              </div>

              <div className="form-group">
<<<<<<< HEAD
                <label>Cargo</label>
                <input
                  name="cargo"
                  placeholder="Ex: Escalista"
                  value={formData.cargo}
                  onChange={handleChange}
                  className={submitted && erros.cargo ? "input-erro" : ""}
                />
                {submitted && erros.cargo && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.cargo}
=======
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
>>>>>>> origin/Front-End
                  </span>
                )}
              </div>
            </div>

<<<<<<< HEAD
            <div className="form-group">
              <label>Setor responsável</label>
              <select
                name="setorId"
                value={formData.setorId}
                onChange={handleChange}
                disabled={loadingSetores}
                className={submitted && erros.setorId ? "input-erro" : ""}
              >
                <option value="">
                  {loadingSetores ? "Carregando setores..." : "Selecione o setor"}
                </option>
                {setores.map((setor) => (
                  <option key={setor.id} value={setor.id}>
                    {setor.nome}
                  </option>
                ))}
              </select>
              {submitted && erros.setorId && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} /> {erros.setorId}
=======
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
>>>>>>> origin/Front-End
                </span>
              )}
            </div>

<<<<<<< HEAD
            <div className="form-row">
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Mínimo de 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  className={submitted && erros.senha ? "input-erro" : ""}
                />
                {submitted && erros.senha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.senha}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Confirmar senha</label>
                <input
                  type="password"
                  name="confirmaSenha"
                  placeholder="Repita a senha"
                  value={formData.confirmaSenha}
                  onChange={handleChange}
                  className={submitted && erros.confirmaSenha ? "input-erro" : ""}
                />
                {submitted && erros.confirmaSenha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.confirmaSenha}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || loadingSetores}
            >
              {submitting ? "Cadastrando..." : "Cadastrar Escalista"}
=======
            {/* BOTÃO */}
            <button type="submit" className="btn-submit">
              Cadastrar
>>>>>>> origin/Front-End
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
