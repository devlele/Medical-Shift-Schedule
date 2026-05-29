import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import "./Perfil.css";
import Sidebar from "../../Sidebar/Sidebar";
import {
  getMeuDashboard,
  getMeusSetoresEscalista,
  getManagerMe,
} from "../../UserHospital/Setores/setorServices";
import { getUsuarioLogado } from "../../../utils/plantaoFormatters";

const Perfil = () => {
  const usuario = getUsuarioLogado();

  const [perfil, setPerfil] = useState(null);
  const [setores, setSetores] = useState([]);
  const [hospitalNomeState, setHospitalNomeState] = useState("");
  // hospital state removido — nome extraído diretamente dos setores
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        setLoading(true);
        setErro("");

        // Tenta /manager/me para dados do escalista; fallback para /dashboard/me
        const [managerData, setoresData] = await Promise.all([
          getManagerMe().catch(() => getMeuDashboard()),
          getMeusSetoresEscalista(),
        ]);

        const setoresAtivos = Array.isArray(setoresData)
          ? setoresData.filter((setor) => setor.ativo !== false)
          : [];

        const nomeHospital = managerData?.hospitalNome || "";

        if (ativo) {
          setPerfil(managerData);
          setSetores(setoresAtivos);
          setHospitalNomeState(nomeHospital);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Não foi possível carregar o perfil.");
          setPerfil(usuario);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarPerfil();
    return () => { ativo = false; };
  }, []);

  const nome = perfil?.name || perfil?.nome || usuario?.name || "Escalista";
  const cpf = perfil?.cpf || "Não disponível";
  const email = perfil?.email || usuario?.email || "Não informado";
  const cargo = perfil?.department || perfil?.cargo || "Escalista";
  const hospitalNome = hospitalNomeState || "Não disponível";
  const setoresTexto =
    setores
      .map((s) => s.nome || s.setorNome || s.name)
      .filter(Boolean)
      .join(", ") || "Não disponível";

  return (
    <div className="pagina-perfil">
      <Sidebar />

      <main className="conteudo-perfil">
        <header className="topo-perfil">
          <div>
            <h1 className="titulo-pagina">Perfil</h1>
            <p className="subtitulo-pagina">
              Visualize suas informações de Perfil
            </p>
          </div>

          <div className="topo-direita">
            <Bell className="icone-topo" />

            <div className="usuario-topo">
              <CircleUserRound className="perfilEscalista" />
              <span className="perfilEscalista">{nome}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        <section className="card-perfil">
          <div className="lado-foto">
            <CircleUserRound
              aria-label="Perfil"
              className="foto-perfil perfilEscalista"
            />
          </div>

          <div className="dados-perfil">
            <h2>{loading ? "Carregando..." : nome}</h2>
            <p>{setoresTexto}</p>
          </div>
        </section>

        <section className="area-baixo">
          <div className="card-info">
            <h3>Informações Pessoais</h3>

            <InfoCampo label="NOME COMPLETO" value={nome} />
            <InfoCampo label="CPF" value={cpf} />
            <InfoCampo label="E-MAIL" value={email} />

            <div className="linha-dupla">
              <InfoCampo label="CARGO" value={cargo} />
              <InfoCampo label="SETOR RESPONSÁVEL" value={setoresTexto} />
            </div>

            <InfoCampo label="HOSPITAL" value={hospitalNome} />
          </div>
        </section>
      </main>
    </div>
  );
};

function InfoCampo({ label, value }) {
  return (
    <div className="grupo-campo">
      <label>{label}</label>
      <div className="campo-fixo">{value || "Não informado"}</div>
    </div>
  );
}

export default Perfil;
