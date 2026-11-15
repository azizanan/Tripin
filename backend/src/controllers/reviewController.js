import {
  createReview, deleteReview, getReviewById, getReviewOwner, listReviews, updateReview
} from "../models/reviewModel.js";
import { isPositiveInteger } from "../utils/validation.js";

export async function index(req, res, next) {
  try {
    const destinationId = Number(req.params.destinationId);
    if (!isPositiveInteger(destinationId)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    return res.json({ success: true, data: await listReviews(destinationId) });
  } catch (error) { return next(error); }
}

export async function store(req, res, next) {
  try {
    const destinationId = Number(req.body.destination_id);
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!isPositiveInteger(destinationId) || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 3 || comment.length > 2000) {
      return res.status(400).json({ success: false, message: "Destinasi, rating 1–5, dan ulasan 3–2000 karakter wajib diisi." });
    }
    const review = await createReview({ userId: req.user.id, destinationId, rating, comment });
    return res.status(201).json({ success: true, message: "Ulasan berhasil ditambahkan.", data: review });
  } catch (error) { return next(error); }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!isPositiveInteger(id) || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 3 || comment.length > 2000) {
      return res.status(400).json({ success: false, message: "ID, rating 1–5, dan ulasan yang valid wajib diisi." });
    }
    const existing = await getReviewById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Ulasan tidak ditemukan." });
    if (Number(existing.user_id) !== Number(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Anda hanya dapat mengubah ulasan sendiri." });
    }
    return res.json({ success: true, message: "Ulasan berhasil diperbarui.", data: await updateReview(id, { rating, comment }) });
  } catch (error) { return next(error); }
}

export async function destroy(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID ulasan tidak valid." });
    const existing = await getReviewOwner(id);
    if (!existing) return res.status(404).json({ success: false, message: "Ulasan tidak ditemukan." });
    if (Number(existing.user_id) !== Number(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Anda hanya dapat menghapus ulasan sendiri." });
    }
    await deleteReview(id);
    return res.json({ success: true, message: "Ulasan berhasil dihapus." });
  } catch (error) { return next(error); }
}
