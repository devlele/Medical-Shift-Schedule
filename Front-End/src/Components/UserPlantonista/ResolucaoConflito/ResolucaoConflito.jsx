import React from "react";
import { Bell, Settings } from "lucide-react";
import Sidebar from "../../Sidebar/Sidebar";
import "./ResolucaoConflito.css";

export default function ResolucaoConflito() {
  const compromissos = [
    {
      title: "Plantão UTI",
      subtitle: "25 Outubro, Domingo",
      horario: "07:00 — 12:00",
      setor: "UTI Cardiológica",
      hospital: "Hospital Alvorada",
    },
    {
      title: "Treinamento Obrigatório",
      subtitle: "25 Outubro, Domingo",
      horario: "10:30 — 14:30",
      setor: "Emergência",
      hospital: "Auditório Central",
    },
  ];

  return (
    <div className="layout">
      <Sidebar />

      <main className="conteudo">
        <header className="topo">
          <div>
            <h1>Resolução de Conflitos</h1>
            <p>Selecione uma oportunidade para ver mais informações.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <Settings className="icone-topo" />
          </div>
        </header>

        <section className="resolucao-conteudo">
          <div className="card-conflicto">
            <div className="card-topo">
              <div>
                <p className="tag-alerta">Alerta de Conflito</p>
                <h2>Sobreposição de Horários Detectada</h2>
              </div>
            </div>

            <p className="card-subtitulo">
              Dois compromissos possuem horários que se sobrepõem. O usuário não
              consegue estar em ambos ao mesmo tempo.
            </p>

            <div className="quadro-branco">
              <div className="detalhes-conflito">
                {compromissos.map((item, index) => (
                  <div className="compromisso-card" key={index}>
                    <div className="compromisso-header">
                      <span className="compromisso-label">
                        Compromisso {index + 1}
                      </span>
                      <strong>{item.subtitle}</strong>
                    </div>

                    <div className="compromisso-body">
                      <div className="campo">
                        <label>Nome</label>
                        <div className="valor">{item.title}</div>
                      </div>

                      <div className="campo">
                        <label>Horário</label>
                        <div className="valor">{item.horario}</div>
                      </div>

                      <div className="campo">
                        <label>Setor</label>
                        <div className="valor">{item.setor}</div>
                      </div>

                      <div className="campo">
                        <label>Hospital</label>
                        <div className="valor">{item.hospital}</div>
                      </div>
                    </div>

                    <div className="compromisso-actions">
                      <button type="button" className="btn manter-btn">
                        Manter
                      </button>
                      <button type="button" className="btn ofertar-btn">
                        Ofertar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
