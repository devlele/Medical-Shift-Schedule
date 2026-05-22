import React from "react";
import {
  Bell,
  Settings,
  ArrowRight,
  Users,
  CalendarCheck,
  Building2,
  User,
} from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";

import "./TelaPrincipal.css";

const profissionais = [
  {
    id: 1,
    nome: "João Vitor",
  },
  {
    id: 2,
    nome: "Clara Nunes",
  },
  {
    id: 3,
    nome: "Pikachu",
  },
  {
    id: 4,
    nome: "Anya Forger",
  },
];

export default function TelaPrincipal() {
  const usuario = obterUsuarioLogado();
  const nomeUsuario = usuario?.name || "Usuário Hospital";

  return (
    <div className="layout-hospital">
      <Sidebar />

      <main className="conteudo-hospital">
        {/* HEADER */}
        <header className="topo-hospital">
          <div>
            <h1>Painel Hospitalar</h1>
            <p>Bem-vindo de volta, {nomeUsuario}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <Settings className="icone-topo" />

            {/* ROSQUINHA DO USUÁRIO */}
            <div className="avatar-default">
              <User size={18} />
            </div>

            <span className="nome-hospital">{nomeUsuario}</span>
          </div>
        </header>

        {/* CARDS */}
        <section className="cards-dashboard">
          <article className="card-dashboard">
            <div className="icone-card azul">
              <Users size={22} />
            </div>
            <span>Colaboradores</span>
            <strong>128</strong>
          </article>

          <article className="card-dashboard">
            <div className="icone-card verde">
              <CalendarCheck size={22} />
            </div>
            <span>Escalistas Disponíveis</span>
            <strong>12</strong>
          </article>

          <article className="card-dashboard">
            <div className="icone-card escuro">
              <Building2 size={22} />
            </div>
            <span>Setores Ativos</span>
            <strong>8</strong>
          </article>
        </section>

        {/* ESCALISTAS */}
        <section className="secao-profissionais">
          <div className="cabecalho-secao">
            <h2>Meus Escalistas</h2>

            <button type="button">Ver todos os profissionais</button>
          </div>

          <div className="grid-profissionais">
            {profissionais.map((profissional) => (
              <article key={profissional.id} className="card-profissional">
                {/* ROSQUINHA ESCALISTA */}
                <div className="avatar-escalista">
                  <User size={22} />
                </div>

                <div className="info-profissional">
                  <h3>{profissional.nome}</h3>
                </div>

                <button type="button" className="botao-seta">
                  <ArrowRight size={18} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function obterUsuarioLogado() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return null;
  }

  try {
    return JSON.parse(usuarioSalvo);
  } catch {
    return { name: usuarioSalvo };
  }
}
