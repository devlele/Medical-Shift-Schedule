import { getToken } from "../../../utils/authStorage";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

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

export const getSetores = async () => {
    return request("/setor");
};

export const getDoctors = async () => {
    return request("/doctor");
};

export const getMedicosCandidatos = async (setorId, termo = "") => {
    const params = new URLSearchParams();

    if (setorId) {
        params.set("setorId", setorId);
    }

    if (termo.trim()) {
        params.set("termo", termo.trim());
    }

    const query = params.toString();
    return request(`/doctor/link-candidates${query ? `?${query}` : ""}`);
};

export const getMeusSetoresEscalista = async () => {
    return request("/manager/me/setores");
};

export const getMinhaAgenda = async () => {
    return request("/agenda/me");
};

export const criarSetor = async (data) => {
    return request("/setor", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const getEscalistas = async () => {
    return request("/manager");
};

export const criarEscalista = async (data) => {
    return request("/manager", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const criarPlantaoAvulso = async (data) => {
    return request("/plantao/avulso", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const criarPlantaoFixo = async (data) => {
    return request("/plantao/fixo", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const vincularMedicoSetor = async (medicoId, setorId) => {
    return request(`/doctor/${medicoId}/setores/${setorId}`, {
        method: "POST",
    });
};

export const desvincularMedicoSetor = async (medicoId, setorId) => {
    return request(`/doctor/${medicoId}/setores/${setorId}`, {
        method: "DELETE",
    });
};

export const editarSetor = async (id, data) => {
    return request(`/setor/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};
