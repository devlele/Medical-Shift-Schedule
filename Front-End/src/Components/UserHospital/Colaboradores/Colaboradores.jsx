import { useEffect, useMemo, useState } from "react";
import { Bell, CircleUserRound, Plus } from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../../utils/authStorage";
import {
  getDoctors,
  getEscalistas,
} from "../Setores/setorServices.js";
import "./Colaboradores.css";

export default function Colaboradores() {
  const navigate = useNavigate();
  const usuario = getStoredUser();

  const nomeUsuario =
    usuario?.nomeFantasia || usuario?.hospitalNome || "Hospital";

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarColaboradores();
  }, []);

  const carregarColaboradores = async () => {
    try {
      setLoading(true);
      setErro("");

      const [escalistasData, doctorsData] = await Promise.all([
        getEscalistas(),
        getDoctors(),
      ]);

      const escalistas = Array.isArray(escalistasData)
        ? escalistasData
            .filter((escalista) => escalista.ativo !== false)
            .map(normalizarEscalista)
        : [];

      const plantonistas = Array.isArray(doctorsData)
        ? doctorsData
            .filter((doctor) => doctor.ativo !== false)
            .map(normalizarPlantonista)
        : [];

      setColaboradores([...escalistas, ...plantonistas]);
    } catch (error) {
      console.error(error);
      setColaboradores([]);
      setErro(error.message || "Não foi possível carregar os colaboradores.");
    } finally {
      setLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    return colaboradores.filter((c) => {
      const matchBusca =
        !termo ||
        [
          c.nome,
          c.email,
          c.setor,
          c.cpf,
          c.crm,
          c.especialidade,
        ].some((valor) => valor?.toLowerCase().includes(termo));

      const matchTipo = tipoFiltro === "todos" || c.tipo === tipoFiltro;

      return matchBusca && matchTipo;
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
            <span>{loading ? "..." : colaboradores.length}</span>
          </div>

          <div className="card-info">
            <h3>Escalistas</h3>
            <span>{loading ? "..." : totalEscalistas}</span>
          </div>

          <div className="card-info">
            <h3>Plantonistas</h3>
            <span>{loading ? "..." : totalPlantonistas}</span>
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

          {erro && <div className="estado-colaboradores erro">{erro}</div>}

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
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="estado-colaboradores">Carregando colaboradores...</div>
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="estado-colaboradores">Nenhum colaborador encontrado.</div>
                  </td>
                </tr>
              ) : (
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>

                    <td>{c.email}</td>

                    <td>
                      <span className={`tag ${c.tipo}`}>{c.tipo}</span>
                    </td>

                    <td>{c.setor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function normalizarEscalista(escalista) {
  return {
    id: `escalista-${escalista.id}`,
    nome: escalista.name || escalista.nome || "Escalista sem nome",
    email: escalista.email || "-",
    cpf: escalista.cpf || "",
    crm: "",
    especialidade: escalista.cargo || "",
    tipo: "escalista",
    setor: escalista.setorNome || "Sem setor vinculado",
  };
}

function normalizarPlantonista(doctor) {
  return {
    id: `plantonista-${doctor.id}`,
    nome: doctor.name || doctor.nome || "Médico sem nome",
    email: doctor.email || "-",
    cpf: doctor.cpf || "",
    crm: doctor.crm || "",
    especialidade: doctor.specialty || doctor.especialidade || "",
    tipo: "plantonista",
    setor: doctor.setorNome || "Sem setor vinculado",
  };
}
