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
      <nav>
        <img className="logo" src="" alt="" />
        <button onClick={CadastrarMedico}>Cadastrar</button>
        <button onClick={Login}>Login</button>
      </nav>

      <div className="content">
        <section className="inicio">
          <img className="frufru" src="" alt="" />
        </section>

        <section className="info">
          <div>
            <h3>Sobre</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus labore blanditiis atque? Quasi magni explicabo quisquam fugit velit nulla tempora! Possimus est perferendis voluptatum qui quod commodi magnam rem deserunt.</p>
          </div>
          <div>
            <h3>Sobre 20.</h3>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut, libero ad error mollitia perferendis accusantium architecto, aliquid distinctio, at cumque quis? Autem eligendi assumenda quia similique modi aliquam nihil suscipit.</p>
          </div>

        </section>

        <section className="imagem">
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </section>
      </div>

      <section className="planos">
        <div>
          <h3>Planos</h3>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem, at, dolor accusantium error culpa quidem sit magni incidunt nesciunt velit unde perferendis dignissimos sint dolorum iure quod sed exercitationem aliquam.
          </p>
        </div>
      </section>

      <button onClick={CadastrarMedico}>Cadastrar</button>

    </div>
  );
};

export default Home;
