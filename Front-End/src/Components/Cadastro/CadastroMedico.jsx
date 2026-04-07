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
          <label>Gênero</label>
          <div className="genero">
            <label>
              <input type="radio" name="genero" value="masculino" /> Masculino
            </label>

            <label>
              <input type="radio" name="genero" value="feminino" /> Feminino
            </label>

            <label>
              <input type="radio" name="genero" value="outro" /> Outro
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="area">Área médica</label>
          <select id="area" name="area_medica">
            <option value="">Selecione uma área</option>
            <option>Cardiologia</option>
            <option>Pediatria</option>
            <option>Cirurgia Geral</option>
            <option>Oncologia</option>
            <option>Ginecologia</option>
            <option>Ortopedia</option>
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
