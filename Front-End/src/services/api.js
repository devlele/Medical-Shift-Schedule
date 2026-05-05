const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Nao foi possivel concluir a requisicao.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function cadastrarHospital(payload) {
  return request("/hospital", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
