import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Bell, CircleUserRound } from "lucide-react";

import Sidebar from "../../Sidebar/Sidebar";
import {
  getEscalistaById,
  getMeuDashboard,
} from "../Setores/setorServices.js";
import { getStoredUser } from "../../../utils/authStorage";
import "./EscalistaInfo.css";

export default function EscalistaInfo() {
  const { id } = useParams();
  const { state } = useLocation();

  const usuarioRef = useRef(getStoredUser());

  const [perfil, setPerfil] = useState(state?.escalista || null);
  const [nomeHospital, setNomeHospital] = useState(
    usuarioRef.current?.hospitalNome || usuarioRef.current?.name || "Hospital",
  );
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro("");

        const [escalistaData, dashboardData] = await Promise.all([
          getEscalistaById(id).catch(() => state?.escalista || null),
          getMeuDashboard().catch(() => null),
        ]);

        if (!ativo) return;

        if (escalistaData) setPerfil(escalistaData);

        setNomeHospital(
          dashboardData?.hospital?.nomeFantasia ||
            dashboardData?.nomeFantasia ||
            dashboardData?.hospitalNome ||
            dashboardData?.nome ||
            dashboardData?.name ||
            usuarioRef.current?.hospitalNome ||
            "Hospital",
        );
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar os dados.");
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [id, state]);

  const nome    = perfil?.name  || perfil?.nome  || "—";
  const cpf     = perfil?.cpf   || "Não disponível";
  const email   = perfil?.email || "Não informado";
  const cargo   = perfil?.department || perfil?.cargo || "Escalista";
  const setor   = perfil?.setorNome  || "Sem setor vinculado";

  return (
    <div className="ei-pagina">
      <Sidebar />

      <main className="ei-conteudo">
        {/* HEADER */}
        <header className="ei-topo">
          <div>
            <h1>Detalhes do Escalista</h1>
            <p>Visualize as informações de {loading ? "..." : nome}.</p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />
            <div className="usuario-topo">
              <CircleUserRound className="perfilHospital" />
              <span className="perfilHospital">{nomeHospital}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        {/* CARD AVATAR + NOME */}
        <section className="ei-card-perfil">
          <div className="ei-lado-foto">
            <CircleUserRound aria-label="Perfil" className="ei-foto-perfil" />
          </div>

          <div className="ei-dados-perfil">
            <h2>{loading ? "Carregando..." : nome}</h2>
            <p>{setor}</p>
          </div>
        </section>

        {/* CARD INFORMAÇÕES */}
        <section className="ei-area-baixo">
          <div className="ei-card-info">
            <h3>Informações Pessoais</h3>

            <InfoCampo label="NOME COMPLETO" value={nome} />
            <InfoCampo label="CPF"           value={cpf}  />
            <InfoCampo label="E-MAIL"        value={email} />

            <div className="ei-linha-dupla">
              <InfoCampo label="CARGO"              value={cargo} />
              <InfoCampo label="SETOR RESPONSÁVEL"  value={setor} />
            </div>

            <InfoCampo label="HOSPITAL" value={nomeHospital} />
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCampo({ label, value }) {
  return (
    <div className="ei-grupo-campo">
      <label>{label}</label>
      <div className="ei-campo-fixo">{value || "Não informado"}</div>
    </div>
  );
}
