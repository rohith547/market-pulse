import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: BASE });

export const fetchScore       = () => api.get("/api/score").then(r => r.data);
export const fetchMacro       = () => api.get("/api/macro").then(r => r.data);
export const fetchSentiment   = () => api.get("/api/sentiment").then(r => r.data);
export const fetchCrypto      = () => api.get("/api/crypto").then(r => r.data);
export const fetchPrices      = () => api.get("/api/market/prices").then(r => r.data);
export const fetchMonetary    = () => api.get("/api/market/monetary").then(r => r.data);
