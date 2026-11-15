import { getPlaceById, getPlaces } from "../models/placeModel.js";

export async function listPlaces(req, res, next) {
  try {
    const search = String(req.query.search || "").trim().slice(0, 100);
    const category = String(req.query.category || "").trim().slice(0, 60);
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 12;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const offset = (page - 1) * limit;

    const places = await getPlaces({ search, category, limit, offset });

    res.json({
      success: true,
      data: places,
      pagination: { page, limit, returned: places.length }
    });
  } catch (error) {
    next(error);
  }
}

export async function showPlace(req, res, next) {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "ID tempat tidak valid."
      });
    }

    const place = await getPlaceById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Tempat tidak ditemukan."
      });
    }

    return res.json({ success: true, data: place });
  } catch (error) {
    return next(error);
  }
}
