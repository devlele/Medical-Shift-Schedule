import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  function CadastrarMedico() {
    navigate("/CadastroMedico");
  }

  function Login() {
    navigate("/Login");
  }

  return (
    <div>
      <button onClick={CadastrarMedico}>Cadastrar</button>
      <button onClick={Login}>Login</button>
    </div>
  );
};

export default Home;
