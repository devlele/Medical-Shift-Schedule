import React from "react";
import { Bell, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import userImg from "../../../assets/drhouse.png";
import Calendario from "../../Calendario/Calendario";

import "./TelaPrincipal.css";

export default function TelaPrincipal() {
  // Dados para testes:
  const plantoes = [
    {
      id: 1,
      title: "Hospital da Luz",
      date: "2026-06-06",
      tipo: "Pediátrico • 12h",
      color: "#1f7a63",
    },
    {
      id: 2,
      title: "Clínica Santa Helena",
      date: "2026-06-08",
      tipo: "Plantão Geral • 6h",
      color: "#2bbf9c",
    },
    {
      id: 3,
      title: "CONFLITO",
      date: "2026-06-12",
      tipo: "Conflito de horário",
      color: "#e74c3c",
    },
  ];

  return (
    <div className="layout">
      <Sidebar />

      <main className="conteudo">
        {/* TOPO */}
        <header className="topo">
          <div>
            <h1>Painel de Controle</h1>
            <p>Bem-vindo de volta, Dr. House.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <Settings className="icone-topo" />

            <div className="user">
              <img src={userImg} alt="user" />
              <span>Dr. House</span>
            </div>
          </div>
        </header>

        {/* CARDS */}
        <section className="cards">
          <NavLink to="/ResolucaoConflito" className="card alerta">
            <span className="badge">CRÍTICO</span>
            <p>ALERTAS DE CONFLITO</p>
            <h2>{plantoes.filter((p) => p.title === "CONFLITO").length}</h2>
          </NavLink>

          <div className="card">
            <p>PLANTÕES NO MÊS</p>
            <h2>{plantoes.length}</h2>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="grid">
          {/* CALENDÁRIO */}
          <Calendario eventos={plantoes} />

          {/* LATERAL DIREITA */}
          <div className="proximos">
            <div className="proximos-topo">
              <h3>Próximos Plantões</h3>
              <span>Ver todos</span>
            </div>

            {plantoes.map((p, index) => (
              <div className="plantao" key={index}>
                <div className="data">
                  <span>JUN</span>
                  <strong>{p.date.split("-")[2]}</strong>
                </div>

                <div className="info">
                  <p>{p.title}</p>
                  <span>{p.tipo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
