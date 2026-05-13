import React, { useMemo, useState } from "react";
import { Bell, Settings } from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import userImg from "../../assets/drhouse.png";
import "./Historico.css";

const hospitais = [
  "Todos os Hospitais",
  "Hospital Albert Einstein",
  "Hospital Sírio-Libanês",
  "Hospital Santa Marcelina",
  "InCor - e CFM/SP",
];

const registros = [
  {
    id: 1,
    date: "24 Mai 2024",
    weekday: "Sexta-feira",
    time: "07:00 — 19:00",
    hospital: "Hospital Albert Einstein",
    unit: "UTI Cardíaca",
    status: "COMPLETED",
    statusClass: "completed",
  },
  {
    id: 2,
    date: "22 Mai 2024",
    weekday: "Quarta-feira",
    time: "19:00 — 07:00",
    hospital: "Hospital Sírio-Libanês",
    unit: "Emergência Geral",
    status: "COMPLETED",
    statusClass: "completed",
  },
  {
    id: 3,
    date: "18 Mai 2024",
    weekday: "Sábado",
    time: "07:00 — 19:00",
    hospital: "Hospital Santa Marcelina",
    unit: "Radiologia",
    status: "CANCELLED",
    statusClass: "cancelled",
  },
  {
    id: 4,
    date: "15 Mai 2024",
    weekday: "Quarta-feira",
    time: "13:00 — 19:00",
    hospital: "InCor - e CFM/SP",
    unit: "Radiologia",
    status: "AUSENTE",
    statusClass: "absent",
  },
];

const Historico = () => {
  const [selectedHospital, setSelectedHospital] =
    useState("Todos os Hospitais");

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
            <Settings className="icone-topo" />
            <div className="user">
              <img src={userImg} alt="Dr. House" />
              <span>Dr. House</span>
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
