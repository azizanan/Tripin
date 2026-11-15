import api from "./api";

export const getReviews = (destinationId) => api.get(`/reviews/${destinationId}`);
export const getMyReviews = () => api.get("/reviews/mine");
export const createReview = (payload) => api.post("/reviews", payload);
export const updateReview = (id, payload) => api.put(`/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
