import pool from "../config/database.js";
import { addFavorite, listFavorites, removeFavorite } from "../models/favoriteModel.js";
import { isPositiveInteger } from "../utils/validation.js";

export async function index(req, res, next) {
  try {
    return res.json({ success: true, data: await listFavorites(req.user.id) });
  } catch (error) { return next(error); }
}

export async function store(req, res, next) {
  try {
    const destinationId = Number(req.body.destination_id);
    if (!isPositiveInteger(destinationId)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    const [destinations] = await pool.execute(
      "SELECT id FROM destinations WHERE id = ? AND is_published = TRUE LIMIT 1",
      [destinationId]
    );
    if (!destinations.length) return res.status(404).json({ success: false, message: "Destinasi tidak ditemukan." });
    await addFavorite(req.user.id, destinationId);
    return res.status(201).json({ success: true, message: "Destinasi ditambahkan ke favorit." });
  } catch (error) { return next(error); }
}

export async function destroy(req, res, next) {
  try {
    const destinationId = Number(req.params.destinationId);
    if (!isPositiveInteger(destinationId)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    const removed = await removeFavorite(req.user.id, destinationId);
    if (!removed) return res.status(404).json({ success: false, message: "Favorit tidak ditemukan." });
    return res.json({ success: true, message: "Destinasi dihapus dari favorit." });
  } catch (error) { return next(error); }
}
