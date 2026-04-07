import { Link } from "react-router-dom";

import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";

import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    //entrar com o back-end
    alert("Enviando os dados: " + username + " - " + password);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <div className="recall-forget">
          <label>
            <input type="checkbox" />
            Lembre de mim
          </label>

          {/* criar página de recuperação de senha */}
          <Link to="/">Esqueceu a senha?</Link>
        </div>

        <button>Entrar</button>

        <div className="signup-link">
          <p>
            Não tem uma conta? <Link to="/CadastroMedico">Registrar</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
