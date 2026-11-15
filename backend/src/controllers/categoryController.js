import * as categories from "../models/categoryModel.js";
import { listDestinationsByCategory } from "../models/destinationModel.js";
import { isPositiveInteger, slugify } from "../utils/validation.js";

export async function index(_req, res, next) {
  try {
    return res.json({ success: true, data: await categories.listCategories() });
  } catch (error) { return next(error); }
}

export async function destinations(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID kategori tidak valid." });
    const category = await categories.getCategoryById(id);
    if (!category) return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
    const minPrice = req.query.min_price === undefined ? null : Number(req.query.min_price);
    const maxPrice = req.query.max_price === undefined ? null : Number(req.query.max_price);
    if ((minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) ||
        (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
        (minPrice !== null && maxPrice !== null && minPrice > maxPrice)) {
      return res.status(400).json({ success: false, message: "Rentang harga tidak valid." });
    }

    const result = await listDestinationsByCategory(id, {
      search: String(req.query.search || "").trim().slice(0, 100),
      district: String(req.query.district || "").trim().slice(0, 100),
      minPrice,
      maxPrice,
      sort: String(req.query.sort || "newest"),
      limit,
      offset: (page - 1) * limit
    });
    return res.json({
      success: true,
      category,
      data: result.destinations,
      pagination: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) }
    });
  } catch (error) { return next(error); }
}

export async function store(req, res, next) {
  try {
    const categoryName = String(req.body.category_name || "").trim();
    if (categoryName.length < 2 || categoryName.length > 80) {
      return res.status(400).json({ success: false, message: "Nama kategori wajib diisi (2–80 karakter)." });
    }
    const slug = slugify(req.body.slug || categoryName);
    if (!slug) return res.status(400).json({ success: false, message: "Slug kategori tidak valid." });
    const data = await categories.createCategory({
      categoryName,
      slug,
      description: String(req.body.description || "").trim()
    });
    return res.status(201).json({ success: true, data });
  } catch (error) { return next(error); }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const categoryName = String(req.body.category_name || "").trim();
    if (!isPositiveInteger(id) || categoryName.length < 2 || categoryName.length > 80) {
      return res.status(400).json({ success: false, message: "ID atau nama kategori tidak valid." });
    }
    const existing = await categories.getCategoryById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    const slug = slugify(req.body.slug || categoryName);
    if (!slug) return res.status(400).json({ success: false, message: "Slug kategori tidak valid." });
    const data = await categories.updateCategory(id, {
      categoryName,
      slug,
      description: String(req.body.description || "").trim()
    });
    return res.json({ success: true, data });
  } catch (error) { return next(error); }
}

export async function destroy(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) return res.status(400).json({ success: false, message: "ID kategori tidak valid." });
    const removed = await categories.deleteCategory(id);
    if (!removed) return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    return res.json({ success: true, message: "Kategori berhasil dihapus." });
  } catch (error) { return next(error); }
}
