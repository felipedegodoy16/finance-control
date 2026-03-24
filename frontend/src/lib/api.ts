import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_API_URL || "";

if (baseURL) {
  // Garante que a URL termine com /api/
  if (!baseURL.endsWith("/api") && !baseURL.endsWith("/api/")) {
    baseURL = baseURL.endsWith("/") ? `${baseURL}api/` : `${baseURL}/api/`;
  } else if (baseURL.endsWith("/api")) {
    baseURL = `${baseURL}/`;
  }
} else {
  console.warn("AVISO: NEXT_PUBLIC_API_URL não está definida!");
  baseURL = "http://localhost:8000/api/";
}

console.log("Conectando ao Backend na URL:", baseURL);

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.group("Erro na API");
    console.error("URL:", error.config?.url);
    console.error("Método:", error.config?.method);
    console.error("Status:", error.response?.status);
    console.error("Dados:", error.response?.data);
    console.groupEnd();

    const isPublicPage =
      typeof window !== "undefined" &&
      (window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/register"));

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isPublicPage
    ) {
      console.warn("Retornando 401. Deslogando...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login?error=session_expired";
    }
    return Promise.reject(error);
  },
);

export default api;
