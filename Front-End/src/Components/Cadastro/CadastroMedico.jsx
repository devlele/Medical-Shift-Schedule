import { Link } from "react-router-dom";

import "./CadastroMedico.css";

function CadastroUsuario() {
  return (
    <div className="container">
      <form className="form-cadastro">
        <h1>Cadastro de Usuários</h1>

        <div>
          <label htmlFor="nome">Nome completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite seu nome"
            required
          />
        </div>

        <div>
          <label htmlFor="crm">CRM</label>
          <input
            type="number"
            id="crm"
            name="crm"
            placeholder="Digite seu crm"
            required
          />
        </div>

        <div>
          <label htmlFor="uf">UF</label>
          <select id="uf" name="uf">
            <option value="">Selecione a UF</option>
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

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu email"
            required
          />
        </div>

        <div>
          <label htmlFor="data">Data de nascimento</label>
          <input type="date" id="data" name="data_nascimento" required />
        </div>

        <div>
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div>
          <label htmlFor="especialidade">Especialidade</label>
          <select id="especialidade" name="especialidade">
            <option value="">Selecione uma Especialidade</option>
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

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            placeholder="Confirme sua senha"
            required
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      <div>
        <Link className="back_login" id="back_login" to="/Login">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

export default CadastroUsuario;
