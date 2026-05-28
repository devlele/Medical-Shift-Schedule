import { useEffect, useMemo, useState } from "react";
import "./Setores.css";
import Sidebar from "../../Sidebar/Sidebar";
import { User, Bell, CircleUserRound } from "lucide-react";
import { getStoredUser } from "../../../utils/authStorage";

import {
  getDoctors,
  getSetores,
  criarSetor,
  editarSetor,
} from "./setorServices.js";

const ITEMS_PER_PAGE = 4;

export default function Setores() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
  });

  const carregarDados = async () => {
    try {
      setLoading(true);

      const [setoresData, doctorsData] = await Promise.all([
        getSetores(),
        getDoctors(),
      ]);

      const setoresComMedicos = setoresData.map((setor) => {
        const quantidadeMedicos = doctorsData.filter(
          (doctor) => doctor.setorId === setor.id,
        ).length;

        return {
          ...setor,
          quantidadeMedicos,
        };
      });

      setSetores(setoresComMedicos);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar setores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const setoresFiltrados = useMemo(() => {
    return setores.filter((setor) =>
      setor.nome?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [setores, search]);

  const totalPages = Math.ceil(setoresFiltrados.length / ITEMS_PER_PAGE);

  const setoresPaginados = setoresFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalMedicos = setores.reduce(
    (acc, setor) => acc + setor.quantidadeMedicos,
    0,
  );

  const abrirCriacao = () => {
    setEditingSetor(null);

    setForm({
      nome: "",
      descricao: "",
    });

    setModalOpen(true);
  };

  const abrirEdicao = (setor) => {
    setEditingSetor(setor);

    setForm({
      nome: setor.nome,
      descricao: setor.descricao,
    });

    setModalOpen(true);
  };

  const salvarSetor = async () => {
    try {
      if (!form.nome.trim()) {
        alert("Nome obrigatório");
        return;
      }

      if (editingSetor) {
        await editarSetor(editingSetor.id, form);
      } else {
        await criarSetor(form);
      }

      setModalOpen(false);
      carregarDados();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar setor");
    }
  };

  const usuario = getStoredUser();

  const nomeUsuario =
    usuario?.nomeFantasia || usuario?.hospitalNome || "Hospital";

  return (
    <div className="setores-page">
      <Sidebar />

      <main className="setores-content">
        <div className="setores-header">
          {/* HEADER */}
          <header className="topo">
            <div>
              <h1>Gestão de Setores</h1>
              <p>Administre os grupos médicos dos setores</p>
            </div>

            <div className="topo-direita">
              <Bell className="icone-topo" />

              {/* ROSQUINHA DO USUÁRIO */}
              <div className="usuario-topo">
                <CircleUserRound className="perfilHospital" />
                <span className="perfilHospital">{nomeUsuario}</span>
              </div>
            </div>
          </header>

          <button className="novo-setor-btn" onClick={abrirCriacao}>
            + Criar Novo Setor
          </button>
        </div>

        <div className="cards-container">
          <div className="card-info">
            <h3>Total de Grupos</h3>
            <span>{setores.length}</span>
          </div>

          <div className="card-info">
            <h3>Médicos Alocados</h3>
            <span>{totalMedicos}</span>
          </div>
        </div>

        <div className="table-container">
          <div className="table-top">
            <input
              type="text"
              placeholder="Pesquisar setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Nome do Grupo</th>
                    <th>Nº Médicos</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {setoresPaginados.map((setor) => (
                    <tr key={setor.id}>
                      <td>{setor.nome}</td>

                      <td>{setor.quantidadeMedicos}</td>

                      <td>
                        <button
                          className="editar-btn"
                          onClick={() => abrirEdicao(setor)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ←
                </button>

                <span>
                  {currentPage} de {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="novo-setor-modal">
            <button className="close-modal" onClick={() => setModalOpen(false)}>
              ✕
            </button>

            <h2>{editingSetor ? "Editar Setor" : "Criar Novo Setor"}</h2>

            <p className="modal-subtitle">
              Defina as configurações básicas da unidade.
            </p>

            <div className="form-group">
              <label>NOME DO SETOR</label>

              <input
                type="text"
                placeholder="Ex: Oncologia, Ortopedia..."
                value={form.nome}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nome: e.target.value,
                  })
                }
              />
            </div>

            {/* RESPOSÁVEL TECNICO TIRADO */}
            {/* <div className="form-group">
                            <label>
                                RESPONSÁVEL TÉCNICO
                            </label>

                            <input
                                type="text"
                                placeholder="Buscar escalista..."
                            />
                        </div> */}

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>

              <button className="save-btn" onClick={salvarSetor}>
                Salvar Setor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
