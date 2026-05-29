import { getStoredUser } from "./authStorage";

export const getUsuarioLogado = getStoredUser;

export function getPlantaoDate(plantao) {
  return plantao?.date || plantao?.dataInicio?.slice(0, 10) || "";
}

export function getPlantaoType(plantao) {
  const type = plantao?.type || plantao?.turno || "";
  return String(type).toLowerCase();
}

export function formatTurno(plantao) {
  const type = getPlantaoType(plantao);

  if (type.includes("noturno") || type.includes("noite")) {
    return "Noturno";
  }

  if (type.includes("diurno") || type.includes("dia")) {
    return "Diurno";
  }

  return "Personalizado";
}

export function formatDateLong(value) {
  if (!value) {
    return "Data nao informada";
  }

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);

  if (Number.isNaN(date.getTime())) {
    return "Data nao informada";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatWeekday(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
}

export function formatPlantaoTime(plantao) {
  if (plantao?.time) {
    return plantao.time;
  }

  if (!plantao?.dataInicio || !plantao?.dataFim) {
    return "Horario nao informado";
  }

  const inicio = new Date(plantao.dataInicio);
  const fim = new Date(plantao.dataFim);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return "Horario nao informado";
  }

  const horaInicio = inicio.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const horaFim = fim.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${horaInicio} - ${horaFim}`;
}

export function formatPlantaoRecorrencia(plantao) {
  const tipoPlantao = String(plantao?.tipoPlantao || plantao?.tipo || "")
    .toUpperCase()
    .trim();
  const tipoRecorrencia = String(plantao?.tipoRecorrencia || "")
    .toUpperCase()
    .trim();

  if (tipoPlantao === "AVULSO") {
    return "Avulso";
  }

  if (tipoPlantao === "FIXO") {
    if (tipoRecorrencia.startsWith("MENSAL")) {
      return "Mensal";
    }

    return "Semanal";
  }

  if (tipoRecorrencia.startsWith("MENSAL")) {
    return "Mensal";
  }

  if (tipoRecorrencia === "SEMANAL") {
    return "Semanal";
  }

  return "Avulso";
}

export function normalizePlantao(plantao) {
  return {
    id: plantao.id,
    setor: plantao.setor || "Setor nao informado",
    hospital: plantao.hospital || "Hospital nao informado",
    local: plantao.local || plantao.hospital || "Local nao informado",
    doctor: resolvePlantaoDoctors(plantao),
    date: getPlantaoDate(plantao),
    time: formatPlantaoTime(plantao),
    type: getPlantaoType(plantao),
    turno: formatTurno(plantao),
    recorrencia: formatPlantaoRecorrencia(plantao),
    status: plantao.status || "AGENDADO",
    raw: plantao,
  };
}

function resolvePlantaoDoctors(plantao) {
  const nomes = Array.isArray(plantao?.medicos)
    ? plantao.medicos
        .map((medico) => medico.medicoResponsavelAtualNome || medico.medicoTitularNome)
        .filter(Boolean)
    : [];

  if (nomes.length === 1) {
    return nomes[0];
  }

  if (nomes.length > 1) {
    return `${nomes.slice(0, 2).join(", ")}${nomes.length > 2 ? ` +${nomes.length - 2}` : ""}`;
  }

  return plantao?.doctor || "Medico nao informado";
}

export function normalizePedidoCobertura(pedido) {
  const plantao = normalizePlantao(pedido.plantao || {});

  return {
    id: pedido.id,
    status: pedido.status,
    hospital: pedido.hospitalNome || plantao.hospital,
    setor: pedido.setorNome || plantao.setor,
    medicoSolicitante: pedido.medicoSolicitanteNome || "Medico solicitante",
    medicoCobridor: pedido.medicoCobridorNome,
    abertoEm: pedido.abertoEm,
    plantao,
    raw: pedido,
  };
}
