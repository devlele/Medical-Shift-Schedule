import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

export const getSetores = async () => {
    const response = await axios.get(
        `${API_URL}/setor`,
        getAuthHeaders()
    );

    return response.data;
};

export const getDoctors = async () => {
    const response = await axios.get(
        `${API_URL}/doctor`,
        getAuthHeaders()
    );

    return response.data;
};

export const criarSetor = async (data) => {
    const response = await axios.post(
        `${API_URL}/setor`,
        data,
        getAuthHeaders()
    );

    return response.data;
};

export const editarSetor = async (id, data) => {
    const response = await axios.put(
        `${API_URL}/setor/${id}`,
        data,
        getAuthHeaders()
    );

    return response.data;
};