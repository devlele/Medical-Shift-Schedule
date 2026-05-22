import { getToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || "Nao foi possivel concluir a requisicao.";

    throw new Error(message);
  }

  return data;
};

export const getDoctorDashboard = async () => {
  return request("/dashboard/me");
};

export const getMinhaAgendaMedico = async () => {
  return request("/agenda/doctor/me");
};

export const getPlantao = async (id) => {
  return request(`/plantao/${id}`);
};

export const criarPedidoCobertura = async (plantaoId) => {
  return request("/coberturas", {
    method: "POST",
    body: JSON.stringify({ plantaoId }),
  });
};

export const getCoberturasDisponiveis = async () => {
  return request("/coberturas/disponiveis");
};

export const getMeusPedidosCobertura = async () => {
  return request("/coberturas/me");
};

export const assumirCobertura = async (pedidoId) => {
  return request(`/coberturas/${pedidoId}/assumir`, {
    method: "POST",
  });
};

export const cancelarPedidoCobertura = async (pedidoId) => {
  return request(`/coberturas/${pedidoId}/cancelar`, {
    method: "POST",
  });
};

export const getMeuPerfilMedico = async () => {
  return request("/doctor/me/profile");
};
