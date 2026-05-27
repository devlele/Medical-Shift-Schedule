import { useMemo, useState } from "react";
import { Bell, CircleUserRound, Plus } from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../../utils/authStorage";
import "./Colaboradores.css";

export default function Colaboradores() {
  const navigate = useNavigate();
  const usuario = getStoredUser();

  const nomeUsuario = usuario?.name || "Hospital";

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  // MOCK (sem backend)
  const [colaboradores] = useState([
    {
      id: 1,
      nome: "Dr. João Silva",
      email: "joao@hospital.com",
      tipo: "escalista",
      setor: "Cardiologia",
    },
    {
      id: 2,
      nome: "Dra. Maria Souza",
      email: "maria@hospital.com",
      tipo: "plantonista",
      setor: "Ortopedia",
    },
    {
      id: 3,
      nome: "Dr. Carlos Lima",
      email: "carlos@hospital.com",
      tipo: "escalista",
      setor: "Neurologia",
    },
  ]);

  const filtrados = useMemo(() => {
    return colaboradores.filter((c) => {
      const matchNome = c.nome.toLowerCase().includes(search.toLowerCase());

      const matchTipo = tipoFiltro === "todos" || c.tipo === tipoFiltro;

      return matchNome && matchTipo;
    });
  }, [search, tipoFiltro, colaboradores]);

  const totalEscalistas = colaboradores.filter(
    (c) => c.tipo === "escalista",
  ).length;

  const totalPlantonistas = colaboradores.filter(
    (c) => c.tipo === "plantonista",
  ).length;

  return (
    <div className="colaboradores-page">
      <Sidebar />

      <main className="colaboradores-content">
        {/* HEADER */}
        <header className="topo-hospital">
          <div>
            <h1>Colaboradores</h1>
            <p>Gerencie escalistas e plantonistas do hospital</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />

            <div className="usuario-topo">
              <CircleUserRound className="perfilHospital" />
              <span className="perfilHospital">{nomeUsuario}</span>
            </div>
          </div>
        </header>

        {/* CARDS */}
        <section className="cards-colaboradores">
          <div className="card-info">
            <h3>Total de Colaboradores</h3>
            <span>{colaboradores.length}</span>
          </div>

          <div className="card-info">
            <h3>Escalistas</h3>
            <span>{totalEscalistas}</span>
          </div>

          <div className="card-info">
            <h3>Plantonistas</h3>
            <span>{totalPlantonistas}</span>
          </div>
        </section>

        {/* BOTÃO */}
        <div className="acoes-colaboradores">
          <button
            className="btn-novo-escalista"
            onClick={() => navigate("/UserHospital/CadastrarProfissional")}
          >
            <Plus size={16} />
            Novo Escalista
          </button>
        </div>

        {/* TABELA */}
        <section className="table-container">
          <div className="table-top">
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="filtro-tipo"
            >
              <option value="todos">Todos</option>
              <option value="escalista">Escalistas</option>
              <option value="plantonista">Plantonistas</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Setor</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>

                  <td>{c.email}</td>

                  <td>
                    <span className={`tag ${c.tipo}`}>{c.tipo}</span>
                  </td>

                  <td>{c.setor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
