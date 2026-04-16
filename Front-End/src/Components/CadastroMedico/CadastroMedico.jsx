import { Link } from "react-router-dom";
import logo from "../../assets/Logo-H.png";
import Footer from "../../Components/Footer/Footer.jsx";

import "./CadastroMedico.css";

function CadastroUsuario() {
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
          <form className="form-cadastro">
            <h1>Cadastro de Usuários</h1>
            <span className="subtitulo">
              Preencha os dados abaixo para criar sua conta profissional.
            </span>

            {/* Nome */}
            <div className="campo">
              <label>Nome Completo</label>
              <input type="text" placeholder="Dr(a). Seu Nome" />
            </div>

            {/* CRM + UF */}
            <div className="linha-2">
              <div className="campo">
                <label>CRM</label>
                <input type="text" placeholder="000000" />
              </div>

              <div className="campo">
                <label>UF</label>
                <select>
                  <option>Selecione</option>
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
              </div>
            </div>

            {/* Email */}
            <div className="campo">
              <label>E-mail Profissional</label>
              <input type="email" placeholder="exemplo@clinica.com.br" />
            </div>

            {/* Data + Telefone */}
            <div className="linha-2">
              <div className="campo">
                <label>Data de Nascimento</label>
                <input type="date" />
              </div>

              <div className="campo">
                <label>Telefone</label>
                <input type="tel" placeholder="(11) 99999-9999" />
              </div>
            </div>

            {/* Especialidade */}
            <div className="campo">
              <label>Especialidade</label>
              <select>
                <option>Selecione sua especialidade</option>
                <option>Cardiologia</option>
                <option>Cirurgia Geral</option>
                <option>Oncologia</option>
                <option>Ginecologia</option>
                <option>Obstetrícia</option>
                <option>Neonatologia</option>
                <option>Pediatria</option>
                <option>Ortopedia</option>
                <option>Fisioterapia</option>
                <option>Dermatologia</option>
                <option>Neurologia</option>
                <option>Psiquiatria</option>
                <option>Endocrinologia</option>
              </select>
            </div>

            {/* Senha */}
            <div className="linha-2">
              <div className="campo">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" />
              </div>

              <div className="campo">
                <label>Confirmar Senha</label>
                <input type="password" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="btn-cadastrar">
              Cadastrar
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
