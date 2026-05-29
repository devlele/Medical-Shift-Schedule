import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import "./OferecerPlantao.css";
import {
  ArrowLeft,
  // CheckCircle,
} from "lucide-react";
import {
  criarPedidoCobertura,
  getMeusPedidosCobertura,
  getMinhaAgendaMedico,
} from "../../../services/doctorServices";
import {
  formatDateLong,
  formatTurno,
  normalizePlantao,
} from "../../../utils/plantaoFormatters";

export default function OferecerPlantao() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPlantoes() {
      try {
        setLoading(true);
        setErro("");

        const [agenda, meusPedidos] = await Promise.all([
          getMinhaAgendaMedico(),
          getMeusPedidosCobertura(),
        ]);

        if (!ativo) {
          return;
        }

        const agora = new Date();
        const plantaoIdsComPedidoAberto = new Set(
          (Array.isArray(meusPedidos) ? meusPedidos : [])
            .filter((pedido) => pedido.status === "ABERTO")
            .map((pedido) => pedido.plantao?.id)
            .filter((id) => id != null),
        );

        const normalizados = (Array.isArray(agenda) ? agenda : [])
          .filter((plantao) => {
            const inicio = plantao.dataInicio
              ? new Date(plantao.dataInicio)
              : null;

            return (
              plantao.status === "AGENDADO" &&
              !plantaoIdsComPedidoAberto.has(plantao.id) &&
              (!inicio || Number.isNaN(inicio.getTime()) || inicio >= agora)
            );
          })
          .map(normalizePlantao);

        setAppointments(normalizados);
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar seus plantoes.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarPlantoes();

    return () => {
      ativo = false;
    };
  }, []);

  const selectedAppointment = useMemo(() => {
    return appointments.find((appointment) => appointment.id === selectedId);
  }, [appointments, selectedId]);

  async function handleSubmit() {
    if (!selectedAppointment) {
      return;
    }

    try {
      setSubmitting(true);
      setErro("");
      await criarPedidoCobertura(selectedAppointment.id);
      navigate("/UserPlantonista/PlantoesOfertados");
    } catch (error) {
      setErro(error.message || "Nao foi possivel oferecer este plantao.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="oferecer-layout">
      <Sidebar />

      <main className="oferecer-content">
        <header className="oferecer-header">
          <div className="header-top">
            <Link to="/UserPlantonista/PlantoesOfertados" className="back-btn">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1>Selecione um Plantão para Oferecer</h1>
              <p>
                Escolha um dos seus plantões agendados para disponibilizar na
                rede.
              </p>
            </div>
          </div>
        </header>

        <section className="appointments-panel">
          <div className="appointments-info-card">
            <h2>Meus Próximos Plantões</h2>
            <p>
              Selecione o plantão que deseja repassar. Depois, confirme para
              publicar a oferta.
            </p>
          </div>

          {erro && <div className="alerta-login erro">{erro}</div>}

          <div className="appointments-grid">
            {loading ? (
              <p>Carregando plantões...</p>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <button
                  key={appointment.id}
                  type="button"
                  className={`appointment-card ${selectedId === appointment.id ? "selected" : ""
                    }`}
                  onClick={() => setSelectedId(appointment.id)}
                >
                  <div className="card-heading">
                    <div className="card-title-info">
                      <div>
                        <strong>{appointment.hospital}</strong>
                        <span>{appointment.setor}</span>
                      </div>
                      <div className="summary-info">
                        <span>{formatDateLong(appointment.date)}</span>
                        <span>{appointment.time}</span>
                        <span>Plantão {formatTurno(appointment.raw)}</span>
                      </div>
                    </div>
                    {selectedId === appointment.id && (
                      <button
                        type="button"
                        className="confirm-btn"
                        onClick={handleSubmit}
                        disabled={!selectedAppointment || submitting}
                      >
                        {submitting ? "Publicando..." : "Clique aqui para confirmar"}
                      </button>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p>
                Nenhum plantão agendado disponível para oferta. Plantões que já
                possuem pedido aberto não aparecem nesta lista.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
