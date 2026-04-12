import { Link } from "react-router-dom";
import { Calendar, Users, Shield } from "lucide-react";
import Logo from "../../assets/Logo-H.png";
import img1 from "../../assets/imgHome-1.png";
import img2 from "../../assets/imgHome-2.png";
import mala from "../../assets/img-mala.png";
import "./Home.css";

export default function HomePage() {
  return (
    <>
      <div className="container">
        {/* HEADER */}
        <header className="header">
          <div className="header-conteudo">
            <img src={Logo} alt="Logo" className="logo" />

            <div className="header-botoes">
              <Link to="/Login" className="btn-link">
                Login
              </Link>

              <Link to="/CadastroMedico" className="btn-primario">
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* DESTAQUE */}
          <section className="destaque">
            <div className="destaque-texto">
              <h1>A clareza que sua rotina médica merece.</h1>

              <p>
                Elimine a confusão de planilhas e grupos de mensagens. Uma
                plataforma intuitiva para o fluxo real de hospitais e clínicas.
              </p>

              <p className="destaque-sub">
                Comece agora e se junte a uma instituição de saúde!
              </p>

              <Link to="/CadastroMedico" className="btn-principal">
                Começar agora
              </Link>
            </div>

            {/* TEM QUE AJUSTAR*/}
            <div className="destaque-cards">
              <div className="card">
                <p>Agenda Mensal</p>
                <img src={img2} alt="Agenda" />
              </div>

              <div className="card pequeno">
                <img src={mala} alt="Plantões" />
                <p>+12 Plantões</p>
              </div>

              <div className="card">
                <p>Conflito Resolvido</p>
                <span>Plantão das 19:00 delegado.</span>
              </div>

              <div className="card-destaque">
                <h2>98%</h2>
                <p>ocupação</p>
              </div>
            </div>
          </section>

          {/* BENEFÍCIOS */}
          <section className="beneficios">
            <h2>Menos atrito, mais eficiência</h2>

            <p className="beneficios-sub">
              Ferramentas que entendem o fluxo médico, focadas em simplicidade.
            </p>

            {/* TEM QUE ARRUMAR */}
            <div className="beneficios-grid">
              <div className="card">
                <Calendar size={32} />
                <h3>Organização de plantões</h3>
                <p>Visualize escalas por dia, semana ou unidade.</p>
              </div>

              <div className="card">
                <Shield size={32} />
                <h3>Evitar conflitos</h3>
                <p>Bloqueio automático de horários.</p>
              </div>

              <div className="card">
                <Users size={32} />
                <h3>Gestão centralizada</h3>
                <p>Escalas e comunicação em um só lugar.</p>
              </div>
            </div>
          </section>

          {/* PROFISSIONAL */}
          <section className="profissional">
            <div className="profissional-texto">
              <h2>Desenhado para profissionais</h2>

              {/* tem que colocar a imagem de check */}
              <div className="profissional-item">
                <span>✔</span>
                <div>
                  <strong>Tudo na palma da mão</strong>
                  <p>Confirme plantões direto do celular.</p>
                </div>
              </div>

              <div className="profissional-item">
                <span>✔</span>
                <div>
                  <strong>Relatórios em tempo real</strong>
                  <p>Visualize escalas atualizadas.</p>
                </div>
              </div>
            </div>

            <img src={img1} alt="Tablet" className="profissional-img" />
          </section>

          {/* AÇÃO */}
          <section className="acao">
            <h2>Pronto para transformar sua gestão?</h2>

            <p>Desenvolvido para profissionais da saúde</p>

            <Link to="/CadastroMedico" className="btn-principal">
              Começar agora
            </Link>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-conteudo">
          <img src={Logo} alt="Logo" className="logo" />

          <p className="footer-texto">
            A plataforma definitiva para médicos e gestores.
          </p>

          <p className="footer-copy">© 2026 Medical Shift Schedule.</p>
        </div>
      </footer>
    </>
  );
}
