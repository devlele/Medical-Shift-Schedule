import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import "./Perfil.css";
import Sidebar from "../../Sidebar/Sidebar";
import { getMeuPerfilMedico, getDoctorMe } from "../../../services/doctorServices";
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

        // Tenta /doctor/me/profile primeiro; se falhar, usa /doctor/me
        let data;
        try {
          data = await getMeuPerfilMedico();
        } catch {
          data = await getDoctorMe();
        }

        if (ativo) setPerfil(data);
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

  const nome = perfil?.name || perfil?.nome || usuario?.name || "Médico";
  const cpf = perfil?.cpf || "Não informado";
  const especialidade = perfil?.specialty || perfil?.especialidade || "Não informada";
  const crm = perfil?.crm || "Não informado";
  const uf = perfil?.uf || perfil?.ufCrm || perfil?.estadoCrm || "";
  const telefone = perfil?.telefone || perfil?.phone || "Não informado";
  const email = perfil?.email || usuario?.email || "Não informado";
  const dataNascimento = formatarData(perfil?.birthday || perfil?.birthDate || perfil?.dataNascimento);

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
              <CircleUserRound className="perfilPlantonista" />
              <span className="perfilPlantonista">{nome}</span>
            </div>
          </div>
        </header>

        {erro && <div className="alerta-login erro">{erro}</div>}

        <section className="card-perfil">
          <div className="lado-foto">
            <CircleUserRound
              aria-label="Perfil"
              className="foto-perfil perfilPlantonista"
            />
          </div>

          <div className="dados-perfil">
            <h2>{loading ? "Carregando..." : nome}</h2>
            <p>
              {especialidade} • CRM {crm}-{uf}
            </p>
          </div>
        </section>

        <section className="area-baixo">
          <div className="card-info">
            <h3>Informações Pessoais</h3>

            <InfoCampo label="NOME COMPLETO" value={nome} />
            <InfoCampo label="CPF" value={cpf} />
            <InfoCampo label="DATA DE NASCIMENTO" value={dataNascimento} />
            <InfoCampo label="E-MAIL PROFISSIONAL" value={email} />

            <div className="linha-dupla">
              <InfoCampo label="CRM" value={crm} />
              <InfoCampo label="UF" value={uf} />
            </div>

            <div className="linha-dupla">
              <InfoCampo label="ESPECIALIDADE" value={especialidade} />
              <InfoCampo label="TELEFONE" value={telefone} />
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

function formatarData(value) {
  if (!value) {
    return "Nao informada";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Nao informada"
    : date.toLocaleDateString("pt-BR");
}

export default Perfil;
