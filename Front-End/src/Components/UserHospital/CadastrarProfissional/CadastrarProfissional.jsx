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
  // cargo: "",
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
      setSetores(Array.isArray(setoresData) ? setoresData : []);
    } catch (error) {
      console.error(error);
      setErroEnvio("Não foi possível carregar os setores do hospital.");
    } finally {
      setLoadingSetores(false);
    }
  };

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

  const normalizarCPF = (valor) => valor.replace(/\D/g, "");

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

    // if (!validarCampoObrigatorio(dados.cargo)) {
    //   novoErros.cargo = "Cargo é obrigatório";
    // }

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

    return novoErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      // department: formData.cargo.trim(),
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
      setErroEnvio(error.message || "Não foi possível cadastrar o escalista.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cadastro-layout">
      <Sidebar />

      <main className="cadastro-main">
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

            <div className="form-group">
              <label>Nome</label>
              <input
                name="nome"
                placeholder="Ex: Ana Souza"
                value={formData.nome}
                onChange={handleChange}
                className={submitted && erros.nome ? "input-erro" : ""}
              />
              {submitted && erros.nome && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} /> {erros.nome}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CPF</label>
                <input
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={submitted && erros.cpf ? "input-erro" : ""}
                />
                {submitted && erros.cpf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.cpf}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="exemplo@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={submitted && erros.email ? "input-erro" : ""}
                />
                {submitted && erros.email && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.email}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                  className={submitted && erros.nascimento ? "input-erro" : ""}
                />
                {submitted && erros.nascimento && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} /> {erros.nascimento}
                  </span>
                )}
              </div>

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
                  </span>
                )}
              </div>
            </div>

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

            {mensagemSucesso && (
              <div className="alerta-formulario sucesso">
                <CheckCircle size={18} />
                <span>{mensagemSucesso}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || loadingSetores}
            >
              {submitting ? "Cadastrando..." : "Cadastrar Escalista"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
