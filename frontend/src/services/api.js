import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: apiBaseUrl,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("inventory_auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);

export const getInventory = () =>
  API.get("/inventory");

export const createInventoryItem = (data) =>
  API.post("/inventory", data);

export const updateInventoryItem = (id, data) =>
  API.put(`/inventory/${id}`, data);

export const deleteInventoryItem = (id) =>
  API.delete(`/inventory/${id}`);

export const createAudit = (data) =>
  API.post("/audits", data);

export const getAudits = () =>
  API.get("/audits");

export const getDashboard = () =>
  API.get("/dashboard");

export const getAuditReport = () =>
  API.get("/audits/report");


export default API;