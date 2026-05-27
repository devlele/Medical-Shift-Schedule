import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import "./ResolucaoConflito.css";
import { getMinhaAgendaMedico } from "../../../services/doctorServices";
import {
  formatDateLong,
  formatPlantaoTime,
  getPlantaoDate,
} from "../../../utils/plantaoFormatters";

export default function ResolucaoConflito() {
  const navigate = useNavigate();
  const [conflitos, setConflitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarConflitos() {
      try {
        setLoading(true);
        setErro("");

        const agenda = await getMinhaAgendaMedico();
        const plantoes = Array.isArray(agenda) ? agenda : [];
        const encontrados = [];

        for (let i = 0; i < plantoes.length; i += 1) {
          for (let j = i + 1; j < plantoes.length; j += 1) {
            if (temSobreposicao(plantoes[i], plantoes[j])) {
              encontrados.push([plantoes[i], plantoes[j]]);
            }
          }
        }

        if (ativo) {
          setConflitos(encontrados);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar conflitos.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarConflitos();

    return () => {
      ativo = false;
    };
  }, []);

  function temSobreposicao(first, second) {
    if (!first.dataInicio || !first.dataFim || !second.dataInicio || !second.dataFim) {
      return false;
    }

    const firstStart = new Date(first.dataInicio);
    const firstEnd = new Date(first.dataFim);
    const secondStart = new Date(second.dataInicio);
    const secondEnd = new Date(second.dataFim);

    return firstStart < secondEnd && secondStart < firstEnd;
  }

  function toCompromisso(plantao) {
    return {
      title: plantao.setor || "Plantão",
      subtitle: formatDateLong(getPlantaoDate(plantao)),
      horario: formatPlantaoTime(plantao),
      setor: plantao.setor || "Setor nao informado",
      hospital: plantao.hospital || "Hospital nao informado",
    };
  }

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
              {loading ? (
                <p>Carregando conflitos...</p>
              ) : erro ? (
                <p>{erro}</p>
              ) : conflitos.length > 0 ? (
                conflitos.map((conflito, conflitoIndex) => (
                  <div className="detalhes-conflito" key={conflitoIndex}>
                    {conflito.map((plantao, index) => {
                      const item = toCompromisso(plantao);

                      return (
                        <div className="compromisso-card" key={plantao.id}>
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
                            <button
                              type="button"
                              className="btn ofertar-btn"
                              onClick={() =>
                                navigate("/UserPlantonista/OferecerPlantao")
                              }
                            >
                              Ofertar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <p>Nenhum conflito de horário detectado.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
