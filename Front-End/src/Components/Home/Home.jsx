import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Shield } from "lucide-react";

import Footer from "../../Components/Footer/Footer.jsx";
import logo from "../../assets/Logo-H.png";
import img1 from "../../assets/imgHome-1.png";

import "./Home.css";

const Home = () => {
  return (
    <div className="pagina-inicial">
      {/* CABEÇALHO */}
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <img src={logo} alt="Logo" className="logo" />

          <div className="acoes-cabecalho">
            <Link to="/login" className="link-login">
              Login
            </Link>

            <Link to="/CadastroTipo" className="botao-cadastro">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="conteudo-principal">
        {/* HERO */}
        <section className="secao-principal">
          <div>
            <h1 className="titulo-principal">
              A clareza que sua <span>rotina médica</span> merece.
            </h1>

            <p className="descricao-principal">
              Elimine planilhas e mensagens confusas. Uma plataforma feita para
              hospitais e clínicas de alto desempenho.
            </p>

            <Link to="/CadastroTipo" className="botao-principal">
              Começar agora <ArrowRight size={18} />
            </Link>

            <p className="texto-rodape-hero">Comece hoje mesmo.</p>
          </div>

          {/* VISUAL */}
          <div className="visual-hero">
            <div className="cartao-previa">
              <img src={img1} alt="Preview" className="imagem-previa" />
            </div>

            <div className="selo-flutuante selo-topo">
              <Calendar size={18} />
              <div>
                <div>Plantões</div>
                <strong>+12 hoje</strong>
              </div>
            </div>

            <div className="selo-flutuante selo-inferior">98% ocupação</div>
          </div>
        </section>

        {/* RECURSOS */}
        <section className="secao-recursos">
          <div className="conteudo-recursos">
            <h2 className="titulo-secao">Menos atrito, mais eficiência</h2>

            <p className="descricao-secao">
              Ferramentas pensadas para o fluxo real de hospitais.
            </p>

            <div className="grade-recursos">
              <div className="cartao-recurso">
                <div className="icone-recurso">
                  <Calendar />
                </div>
                <h3 className="titulo-recurso">Escalas inteligentes</h3>
                <p className="descricao-recurso">
                  Visualize e ajuste plantões com facilidade total.
                </p>
              </div>

              <div className="cartao-recurso">
                <div className="icone-recurso">
                  <Shield />
                </div>
                <h3 className="titulo-recurso">Sem conflitos</h3>
                <p className="descricao-recurso">
                  Evite sobreposição de horários automaticamente.
                </p>
              </div>

              <div className="cartao-recurso">
                <div className="icone-recurso">
                  <Users />
                </div>
                <h3 className="titulo-recurso">Gestão centralizada</h3>
                <p className="descricao-recurso">
                  Tudo em um único lugar para sua equipe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
