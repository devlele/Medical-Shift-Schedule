import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import "./Perfil.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getHospitalById, getMeuDashboard } from "../Setores/setorServices";
import { getUsuarioLogado } from "../../../utils/plantaoFormatters";

const Perfil = () => {
  const usuario = getUsuarioLogado();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        setLoading(true);
        setErro("");

        const dashboard = await getMeuDashboard();
        const hospital = dashboard?.id
          ? await getHospitalById(dashboard.id)
          : null;

        if (ativo) {
          setPerfil({ ...dashboard, ...hospital });
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar o perfil.");
          setPerfil(usuario);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  const nome =
    perfil?.nomeFantasia || perfil?.name || usuario?.name || "Hospital";
  const cnpj = perfil?.cnpj || "Nao informado";
  const telefone = perfil?.telefone || "Nao informado";
  const endereco = perfil?.endereco || "Nao informado";
  const gestor = perfil?.nomeGestor || "Nao informado";
  const email = perfil?.email || usuario?.email || "Email nao informado";

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
              <CircleUserRound className="perfilHospital" />
              <span className="perfilHospital">{nome}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        <section className="card-perfil">
          <div className="lado-foto">
            <CircleUserRound
              aria-label="Perfil"
              className="foto-perfil perfilHospital"
            />
          </div>

          <div className="dados-perfil">
            <h2>{loading ? "Carregando..." : nome}</h2>
            <p>Representando: {nome}</p>
          </div>
        </section>

        <section className="area-baixo">
          <div className="card-info">
            <h3>Informações do Hospital</h3>

            <InfoCampo label="HOSPITAL REPRESENTADO" value={nome} />
            <InfoCampo label="E-MAIL" value={email} />

            <div className="linha-dupla">
              <InfoCampo label="CNPJ" value={cnpj} />
              <InfoCampo label="TELEFONE" value={telefone} />
            </div>

            <div className="linha-dupla">
              <InfoCampo label="GESTOR RESPONSÁVEL" value={gestor} />
              <InfoCampo label="ENDEREÇO" value={endereco} />
            </div>
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
      <div className="campo-fixo">{value || "Nao informado"}</div>
    </div>
  );
}

export default Perfil;
