import React, { useEffect, useMemo, useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import Sidebar from "../../Sidebar/Sidebar";
import "./Historico.css";
import { getMinhaAgendaMedico } from "../../../services/doctorServices";
import {
  formatDateShort,
  formatPlantaoTime,
  formatWeekday,
  getPlantaoDate,
  getUsuarioLogado,
} from "../../../utils/plantaoFormatters";

const Historico = () => {
  const usuario = getUsuarioLogado();
  const [selectedHospital, setSelectedHospital] =
    useState("Todos os Hospitais");
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarHistorico() {
      try {
        setLoading(true);
        setErro("");

        const agenda = await getMinhaAgendaMedico();
        const agora = new Date();

        const historico = (Array.isArray(agenda) ? agenda : [])
          .filter((plantao) => {
            if (!plantao.dataFim) {
              return plantao.status !== "AGENDADO";
            }

            return new Date(plantao.dataFim) < agora;
          })
          .map((plantao) => ({
            id: plantao.id,
            date: formatDateShort(getPlantaoDate(plantao)),
            weekday: formatWeekday(getPlantaoDate(plantao)),
            time: formatPlantaoTime(plantao),
            hospital: plantao.hospital || "Hospital nao informado",
            unit: plantao.setor || "Setor nao informado",
            status: plantao.status || "CONCLUIDO",
            statusClass:
              plantao.status === "CANCELADO" ? "cancelled" : "completed",
          }));

        if (ativo) {
          setRegistros(historico);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar o historico.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarHistorico();

    return () => {
      ativo = false;
    };
  }, []);

  const hospitais = useMemo(() => {
    return [
      "Todos os Hospitais",
      ...Array.from(new Set(registros.map((registro) => registro.hospital))),
    ];
  }, [registros]);

  const filteredRegistros = useMemo(() => {
    if (selectedHospital === "Todos os Hospitais") {
      return registros;
    }

    return registros.filter(
      (registro) => registro.hospital === selectedHospital,
    );
  }, [selectedHospital]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRegistros.length / itemsPerPage),
  );
  const validCurrentPage = Math.min(currentPage, totalPages);

  const currentPageRegistros = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredRegistros.slice(startIndex, startIndex + itemsPerPage);
  }, [validCurrentPage, filteredRegistros]);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="historico-layout">
      <Sidebar />

      <main className="historico-content">
        <header className="topo">
          <div>
            <h1>Histórico de Plantões</h1>
            <p>Gerencie e visualize sua jornada profissional com clareza.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <div className="usuario-topo">
              <CircleUserRound className="perfilPlantonista" />
              <span className="perfilPlantonista">{usuario?.name || "Medico"}</span>
            </div>
          </div>
        </header>

        <section className="historico-panel">
          <div className="historico-header">
            <div>
              <span>FILTRAR POR HOSPITAL</span>
              <select
                value={selectedHospital}
                onChange={(event) => {
                  setSelectedHospital(event.target.value);
                  setCurrentPage(1);
                }}
              >
                {hospitais.map((hospital, index) => (
                  <option value={hospital} key={index}>
                    {hospital}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="historico-table-card">
            <div className="table-top">
              <div>
                <strong>Histórico de Plantões</strong>
                <p>
                  Mostrando {filteredRegistros.length} de {registros.length}{" "}
                  registros
                </p>
              </div>
            </div>

            {loading ? (
              <p>Carregando histórico...</p>
            ) : erro ? (
              <p>{erro}</p>
            ) : currentPageRegistros.length > 0 ? (
              <table className="historico-table">
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>HORÁRIO</th>
                    <th>HOSPITAL</th>
                    <th>UNIDADE / ESPECIALIDADE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageRegistros.map((registro) => (
                    <tr key={registro.id}>
                      <td>
                        <div className="date-cell">
                          <strong>{registro.date}</strong>
                          <span>{registro.weekday}</span>
                        </div>
                      </td>
                      <td>
                        <div className="time-cell">
                          <strong>{registro.time}</strong>
                        </div>
                      </td>
                      <td>{registro.hospital}</td>
                      <td>{registro.unit}</td>
                      <td>
                        <span className={`status-badge ${registro.statusClass}`}>
                          {registro.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum plantão concluído encontrado.</p>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`page-button ${
                      pageNumber === validCurrentPage ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Historico;
