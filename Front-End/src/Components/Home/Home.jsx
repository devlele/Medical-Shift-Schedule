import { useNavigate } from "react-router-dom";
import "./Home.css";

import nomeLogo from "../../assets/nomeLogo.png";
import logo from "../../assets/logo.png";
import card1 from "../../assets/card-01.png";
import card2 from "../../assets/card-02.png";
import card3 from "../../assets/card-03.png";
import card4 from "../../assets/card-04.png";
import card5 from "../../assets/card-05.png";
import home1 from "../../assets/home1.png";
import home2 from "../../assets/home2.png";
import home3 from "../../assets/home3.png";

const Home = () => {
  const navigate = useNavigate();

  function CadastrarMedico() {
    navigate("/CadastroMedico");
  }

  function Login() {
    navigate("/Login");
  }

  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo-area">
          <img className="nomeLogo" src={nomeLogo} alt="nomeLogo" />
        </div>

        <div className="nav-buttons">
          <button className="btnCadastro" onClick={CadastrarMedico}>
            Cadastro
          </button>
          <button className="btnLogin" onClick={Login}>
            Login
          </button>
        </div>
      </nav>

      {/* ICONS */}
      <section className="inicio">
        <div className="icons">
          {/* Ícones ao redor */}
          <img className="icon i1" src={card4} alt="icon1" />
          <img className="icon i2" src={card3} alt="icon2" />
          <img className="icon i3" src={card1} alt="icon3" />
          <img className="icon i4" src={card2} alt="icon4" />
          <img className="icon i5" src={card5} alt="icon2" />
          <img className="icon i6" src={card4} alt="icon2" />

          {/* LOGO CENTRAL */}
          <div className="center-logo">
            <img className="logo" src={logo} alt="logo" />
          </div>
        </div>
      </section>

      {/* CARD INFO */}
      <section className="card-info">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
          ratione aliquid dignissimos, officiis deserunt.
        </p>
      </section>

      {/* IMAGENS */}
      <section className="imagem">
        <div className="img-grid">
          <img className="home1" src={home1} alt="imageHome1" />
          <img className="home2" src={home2} alt="imageHome2" />
          <img className="home3" src={home3} alt="imageHome3" />
        </div>
      </section>

      {/* PLANOS */}
      <section className="planos">
        <h3>Planos :</h3>

        <div className="planos-grid">
          <div className="plano-card">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          <div className="plano-card">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          <div className="plano-card">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
      </section>

      {/* BOTÃO FINAL */}
      <div className="btn-container">
        <button className="btn" onClick={CadastrarMedico}>
          Cadastrar AGORA
        </button>
      </div>
    </div>
  );
};

export default Home;
