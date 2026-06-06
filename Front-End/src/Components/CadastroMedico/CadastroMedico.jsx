import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import logo from "../../assets/logo-icon.png";
import Footer from "../../Components/Footer/Footer.jsx";

import { validarCPF } from "../../utils/validarCPF";
import {
  validarEmail,
  validarTelefone,
  validarCRM,
  validarCampoObrigatorio,
  formatarTelefone,
} from "../../utils/validacoes";
import { cadastrarMedico } from "../../services/api";

import "./CadastroMedico.css";
import "../../utils/validacoes.css";

function CadastroUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    uf: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    especialidade: "",
    senha: "",
    confirmaSenha: "",
  });

  const [erros, setErros] = useState({});
  const [formularioTocado, setFormularioTocado] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

  const validarFormulario = () => {
    const novoErros = {};

    if (!validarCampoObrigatorio(formData.nome)) {
      novoErros.nome = "Nome é obrigatório";
    }

    if (!validarCampoObrigatorio(formData.crm)) {
      novoErros.crm = "CRM é obrigatório";
    } else if (!validarCRM(formData.crm)) {
      novoErros.crm = "CRM inválido (5-8 dígitos)";
    }

    if (!validarCampoObrigatorio(formData.uf)) {
      novoErros.uf = "UF é obrigatória";
    }

    if (!validarCampoObrigatorio(formData.email)) {
      novoErros.email = "Email é obrigatório";
    } else if (!validarEmail(formData.email)) {
      novoErros.email = "Email inválido";
    }

    if (!validarCampoObrigatorio(formData.cpf)) {
      novoErros.cpf = "CPF é obrigatório";
    } else if (!validarCPF(formData.cpf)) {
      novoErros.cpf = "CPF inválido";
    }

    if (!validarCampoObrigatorio(formData.dataNascimento)) {
      novoErros.dataNascimento = "Data de nascimento é obrigatória";
    } else {
      const [ano] = formData.dataNascimento.split("-");
      if (ano.length > 4) {
        novoErros.dataNascimento = "Ano inválido";
      } else if (new Date(formData.dataNascimento) > new Date()) {
        novoErros.dataNascimento = "Data de nascimento não pode ser no futuro";
      }
    }

    if (!validarCampoObrigatorio(formData.telefone)) {
      novoErros.telefone = "Telefone é obrigatório";
    } else if (!validarTelefone(formData.telefone)) {
      novoErros.telefone = "Telefone inválido. Formato: (XX) XXXXX-XXXX";
    }

    if (!validarCampoObrigatorio(formData.especialidade)) {
      novoErros.especialidade = "Especialidade é obrigatória";
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

    // Aplicar formatação automática
    if (name === "telefone") {
      novoValor = formatarTelefone(value);
    } else if (name === "cpf") {
      novoValor = formatarCPF(value);
    } else if (name === "dataNascimento") {
      if (value) {
        const [ano] = value.split("-");
        if (ano.length > 4) return;
      }
    }

    setFormData({ ...formData, [name]: novoValor });
    setErroEnvio("");
    setMensagemSucesso("");

    // Validação em tempo real se o campo foi tocado
    if (formularioTocado[name] && submitted) {
      const novoErros = validarFormulario();
      setErros(novoErros);
    }
  };

  const handleBlur = (field) => {
    setFormularioTocado({ ...formularioTocado, [field]: true });
    if (submitted) {
      const novoErros = validarFormulario();
      setErros(novoErros);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const novoErros = validarFormulario();
    setErroEnvio("");
    setMensagemSucesso("");

    if (Object.keys(novoErros).length === 0) {
      const payload = {
        name: formData.nome.trim(),
        crm: formData.crm.replace(/\D/g, ""),
        uf: formData.uf,
        email: formData.email.trim(),
        cpf: formData.cpf.replace(/\D/g, ""),
        birthday: formData.dataNascimento,
        telefone: formData.telefone.trim(),
        specialty: formData.especialidade,
        password: formData.senha,
      };

      try {
        setEnviando(true);
        await cadastrarMedico(payload);
        setMensagemSucesso(
          "Médico cadastrado com sucesso. Redirecionando para login...",
        );
        setTimeout(() => navigate("/Login"), 1200);
      } catch (error) {
        setErroEnvio(
          error.message.includes("Failed to fetch")
            ? "Nao foi possivel conectar à API. Confirme se o backend está rodando em http://localhost:8080."
            : "Nao foi possivel cadastrar o médico. Verifique se email, CPF ou CRM já estao cadastrados.",
        );
      } finally {
        setEnviando(false);
      }
    } else {
      setErros(novoErros);
      setFormularioTocado({
        nome: true,
        crm: true,
        uf: true,
        email: true,
        cpf: true,
        dataNascimento: true,
        telefone: true,
        especialidade: true,
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

          <p className="texto-esquerdo">
            Junte-se à nossa rede exclusiva de profissionais da saúde e
            simplifique a gestão de seus plantões com inteligência e elegância.
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="painel-direito">
          <form className="form-cadastro" onSubmit={handleSubmit}>
            <h1>Cadastro de Usuários</h1>
            <span className="subtitulo">
              Preencha os dados abaixo para criar sua conta profissional.
            </span>

            {/* Nome */}
            <div
              className={`campo ${submitted && erros.nome ? "campo-com-erro" : ""}`}
            >
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                placeholder="Seu Nome"
                value={formData.nome}
                onChange={handleChange}
                onBlur={() => handleBlur("nome")}
              />
              {submitted && erros.nome && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.nome}
                </span>
              )}
            </div>

            {/* CRM + UF */}
            <div className="linha-2">
              <div
                className={`campo ${submitted && erros.crm ? "campo-com-erro" : ""}`}
              >
                <label>CRM</label>
                <input
                  type="text"
                  name="crm"
                  placeholder="000000"
                  value={formData.crm}
                  onChange={handleChange}
                  onBlur={() => handleBlur("crm")}
                />
                {submitted && erros.crm && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.crm}
                  </span>
                )}
              </div>

              <div
                className={`campo ${submitted && erros.uf ? "campo-com-erro" : ""}`}
              >
                <label>UF</label>
                <select
                  name="uf"
                  value={formData.uf}
                  onChange={handleChange}
                  onBlur={() => handleBlur("uf")}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
                {submitted && erros.uf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.uf}
                  </span>
                )}
              </div>
            </div>

            {/* Email + CPF */}
            <div className="linha-2">
              <div
                className={`campo ${submitted && erros.email ? "campo-com-erro" : ""}`}
              >
                <label>E-mail Profissional</label>
                <input
                  type="email"
                  name="email"
                  placeholder="exemplo@clinica.com.br"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                />
                {submitted && erros.email && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.email}
                  </span>
                )}
              </div>

              <div
                className={`campo ${submitted && erros.cpf ? "campo-com-erro" : ""}`}
              >
                <label>CPF</label>
                <input
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  onBlur={() => handleBlur("cpf")}
                />
                {submitted && erros.cpf && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.cpf}
                  </span>
                )}
              </div>
            </div>

            {/* Data + Telefone */}
            <div className="linha-2">
              <div
                className={`campo ${submitted && erros.dataNascimento ? "campo-com-erro" : ""}`}
              >
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  onBlur={() => handleBlur("dataNascimento")}
                />
                {submitted && erros.dataNascimento && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.dataNascimento}
                  </span>
                )}
              </div>

              <div
                className={`campo ${submitted && erros.telefone ? "campo-com-erro" : ""}`}
              >
                <label>Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("telefone")}
                />
                {submitted && erros.telefone && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.telefone}
                  </span>
                )}
              </div>
            </div>

            {/* Especialidade */}
            <div
              className={`campo ${submitted && erros.especialidade ? "campo-com-erro" : ""}`}
            >
              <label>Especialidade</label>
              <select
                name="especialidade"
                value={formData.especialidade}
                onChange={handleChange}
                onBlur={() => handleBlur("especialidade")}
              >
                <option value="">Selecione sua especialidade</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Cirurgia Geral">Cirurgia Geral</option>
                <option value="Oncologia">Oncologia</option>
                <option value="Ginecologia">Ginecologia</option>
                <option value="Obstetrícia">Obstetrícia</option>
                <option value="Neonatologia">Neonatologia</option>
                <option value="Pediatria">Pediatria</option>
                <option value="Ortopedia">Ortopedia</option>
                <option value="Fisioterapia">Fisioterapia</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Neurologia">Neurologia</option>
                <option value="Psiquiatria">Psiquiatria</option>
                <option value="Endocrinologia">Endocrinologia</option>
              </select>
              {submitted && erros.especialidade && (
                <span className="mensagem-erro">
                  <AlertCircle size={14} />
                  {erros.especialidade}
                </span>
              )}
            </div>

            {/* Senha */}
            <div className="linha-2">
              <div
                className={`campo ${submitted && erros.senha ? "campo-com-erro" : ""}`}
              >
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Mínimo 6 caracteres "
                  value={formData.senha}
                  onChange={handleChange}
                  onBlur={() => handleBlur("senha")}
                />
                {submitted && erros.senha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.senha}
                  </span>
                )}
              </div>

              <div
                className={`campo ${submitted && erros.confirmaSenha ? "campo-com-erro" : ""}`}
              >
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmaSenha"
                  placeholder="Repita a senha"
                  value={formData.confirmaSenha}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmaSenha")}
                />
                {submitted && erros.confirmaSenha && (
                  <span className="mensagem-erro">
                    <AlertCircle size={14} />
                    {erros.confirmaSenha}
                  </span>
                )}
              </div>
            </div>

            {erroEnvio && (
              <div className="alerta-formulario erro">{erroEnvio}</div>
            )}
            {mensagemSucesso && (
              <div className="alerta-formulario sucesso">{mensagemSucesso}</div>
            )}

            <button type="submit" className="btn-cadastrar" disabled={enviando}>
              {enviando ? "Enviando..." : "Cadastrar"}
            </button>

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

export default CadastroUsuario;
