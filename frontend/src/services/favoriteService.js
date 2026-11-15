import api from "./api";

export const getFavorites = () => api.get("/favorites");
export const addFavorite = (destinationId) => api.post("/favorites", { destination_id: destinationId });
export const removeFavorite = (destinationId) => api.delete(`/favorites/${destinationId}`);
