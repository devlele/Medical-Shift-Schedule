const AUTH_KEYS = ["token", "emailUsuario", "usuario", "role"];

const ROLE_GROUPS = {
  hospital: ["hospital"],
  escalista: ["escalista", "manager"],
  medico: ["medico", "doctor", "plantonista"],
};

const DEFAULT_ROUTES = {
  hospital: "/UserHospital/TelaPrincipal",
  escalista: "/UserEscalista/TelaPrincipal",
  manager: "/UserEscalista/TelaPrincipal",
  medico: "/UserPlantonista/TelaPrincipal",
  doctor: "/UserPlantonista/TelaPrincipal",
  plantonista: "/UserPlantonista/TelaPrincipal",
};

export function normalizeRole(role) {
  return role ? String(role).toLowerCase().trim() : "";
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function getStoredRole() {
  return normalizeRole(sessionStorage.getItem("role"));
}

export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario")) || {};
  } catch {
    return {};
  }
}

export function clearAuthSession() {
  AUTH_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

export function saveAuthSession({ token, user, email }) {
  clearAuthSession();

  if (token) {
    sessionStorage.setItem("token", token);
  }

  if (email) {
    sessionStorage.setItem("emailUsuario", email);
  }

  if (user) {
    sessionStorage.setItem("usuario", JSON.stringify(user));
  }

  if (user?.role) {
    sessionStorage.setItem("role", user.role);
  }
}

export function getDefaultRouteForRole(role) {
  return DEFAULT_ROUTES[normalizeRole(role)] || "/Login";
}

export function isRoleAllowed(currentRole, allowedRoles = []) {
  const normalizedRole = normalizeRole(currentRole);
  const normalizedAllowed = allowedRoles.flatMap((role) => {
    const roleKey = normalizeRole(role);
    return ROLE_GROUPS[roleKey] || [roleKey];
  });

  return normalizedAllowed.includes(normalizedRole);
}
