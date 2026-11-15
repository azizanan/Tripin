import {
  createDestination, deleteDestination, getDestinationById,
  listDestinations, updateDestination
} from "../models/destinationModel.js";
import { isPositiveInteger, slugify, toNullableNumber } from "../utils/validation.js";

function parseDestination(body) {
  const name = String(body.name || "").trim();
  const categoryId = Number(body.category_id);
  const priceMin = toNullableNumber(body.price_min);
  const priceMax = toNullableNumber(body.price_max);
  const latitude = toNullableNumber(body.latitude);
  const longitude = toNullableNumber(body.longitude);

  if (name.length < 2 || name.length > 160 || !isPositiveInteger(categoryId)) {
    return { error: "Nama tempat dan kategori yang valid wajib diisi." };
  }
  if (priceMin !== null && (!Number.isFinite(priceMin) || priceMin < 0)) return { error: "Harga minimum tidak valid." };
  if (priceMax !== null && (!Number.isFinite(priceMax) || priceMax < 0)) return { error: "Harga maksimum tidak valid." };
  if (priceMin !== null && priceMax !== null && priceMax < priceMin) return { error: "Harga maksimum tidak boleh lebih kecil dari harga minimum." };
  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) return { error: "Latitude tidak valid." };
  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) return { error: "Longitude tidak valid." };

  return {
    data: {
      categoryId, name, slug: slugify(body.slug || name),
      description: String(body.description || "").trim(),
      address: String(body.address || "").trim(),
      district: String(body.district || "").trim(),
      latitude, longitude, priceMin, priceMax,
      openingHours: String(body.opening_hours || "").trim(),
      image: String(body.image || "").trim(),
      isPublished: body.is_published === true || body.is_published === 1 || body.is_published === "1"
    }
  };
}

export async function index(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
    const minPrice = req.query.min_price === undefined ? null : Number(req.query.min_price);
    const maxPrice = req.query.max_price === undefined ? null : Number(req.query.max_price);
    if ((minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) ||
        (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))) {
      return res.status(400).json({ success: false, message: "Rentang harga tidak valid." });
    }

    const result = await listDestinations({
      search: String(req.query.search || "").trim().slice(0, 100),
      categoryId: req.query.category_id ? Number(req.query.category_id) : null,
      district: String(req.query.district || "").trim().slice(0, 100),
      minPrice, maxPrice,
      sort: String(req.query.sort || "newest"),
      limit, offset: (page - 1) * limit
    });

    return res.json({
      success: true,
      data: result.destinations,
      pagination: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) }
    });
  } catch (error) { return next(error); }
}

export async function show(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    const destination = await getDestinationById(id);
    if (!destination) return res.status(404).json({ success: false, message: "Destinasi tidak ditemukan." });
    return res.json({ success: true, data: destination });
  } catch (error) { return next(error); }
}

export async function store(req, res, next) {
  try {
    const parsed = parseDestination(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });
    const destination = await createDestination(parsed.data);
    return res.status(201).json({ success: true, message: "Destinasi berhasil dibuat.", data: destination });
  } catch (error) { return next(error); }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    const parsed = parseDestination(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });
    const existing = await getDestinationById(id, { includeUnpublished: true });
    if (!existing) return res.status(404).json({ success: false, message: "Destinasi tidak ditemukan." });
    const destination = await updateDestination(id, parsed.data);
    return res.json({ success: true, message: "Destinasi berhasil diperbarui.", data: destination });
  } catch (error) { return next(error); }
}

export async function destroy(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID destinasi tidak valid." });
    const removed = await deleteDestination(id);
    if (!removed) return res.status(404).json({ success: false, message: "Destinasi tidak ditemukan." });
    return res.json({ success: true, message: "Destinasi berhasil dihapus." });
  } catch (error) { return next(error); }
}
