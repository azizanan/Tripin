import api from "./api";

export const getDestinations = (params = {}) => api.get("/destinations", { params });
export const getDestination = (id) => api.get(`/destinations/${id}`);
export const createDestination = (payload) => api.post("/destinations", payload);
export const updateDestination = (id, payload) => api.put(`/destinations/${id}`, payload);
export const deleteDestination = (id) => api.delete(`/destinations/${id}`);
