import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Shield } from "lucide-react";

import Footer from "../../Components/Footer/Footer.jsx";
import logo from "../../assets/apenasLogo.png";
import logoEscrita from "../../assets/nomeLogo.png";
import img1 from "../../assets/imgHome-1.png";

import "./Home.css";

/* COMPONENTE PRICING */
const PricingCard = ({ title, price, desc, features, btnText, featured }) => {
  return (
    <div className={`pricing-card ${featured ? "featured" : ""}`}>
      <h3>{title}</h3>

      <div className="pricing-price">{price}</div>

      <p className="pricing-desc">{desc}</p>

      <ul className="pricing-features">
        {features.map((item, index) => (
          <li key={index}>✓ {item}</li>
        ))}
      </ul>

      <button className="pricing-btn">{btnText}</button>
    </div>
  );
};

const Home = () => {
  return (
    <div className="pagina-inicial">
      {/* HEADER */}
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <div className="logo-container">
            <img src={logo} className="logo-icon" />
            <img src={logoEscrita} className="logo-texto" />
          </div>

          <div className="acoes-cabecalho">
            <Link to="/login" className="botao-login">
              Login
            </Link>
            <Link to="/CadastroTipo" className="botao-cadastro">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="conteudo-principal">
        {/* HERO */}
        <section className="secao-principal">
          <div>
            <h1 className="titulo-principal">
              A clareza que sua <span>rotina médica</span> merece.
            </h1>

            <p className="descricao-principal">
              Elimine planilhas e mensagens confusas.
            </p>

            <Link to="/CadastroTipo" className="botao-principal">
              Começar agora <ArrowRight size={18} />
            </Link>
          </div>

          <div className="visual-hero">
            <img src={img1} className="imagem-previa" />
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

        {/* PRICING */}
        <section className="pricing-section">
          <div className="section-container">
            <div className="section-header-centered">
              <h2>Escolha o plano ideal</h2>
              <p>Transparência total para escalar sua operação</p>
            </div>

            <div className="pricing-grid">
              <PricingCard
                title="SOU MÉDICO"
                price="Gratuito"
                desc="Para uso individual"
                features={["Gestão de escalas", "Alertas", "Mobile"]}
                btnText="Começar"
              />

              <PricingCard
                title="CLÍNICAS"
                price="R$ 299/mês"
                desc="Para equipes"
                features={["Dashboard", "Relatórios", "Suporte"]}
                btnText="Teste grátis"
                featured
              />

              <PricingCard
                title="HOSPITAIS"
                price="Consultar"
                desc="Solução enterprise"
                features={["API", "Integração", "Gerente dedicado"]}
                btnText="Contato"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
