import { getAdminStats, listAdminDestinations, listAdminReviews } from "../models/adminModel.js";

export async function stats(_req, res, next) {
  try {
    return res.json({ success: true, data: await getAdminStats() });
  } catch (error) { return next(error); }
}

export async function destinations(_req, res, next) {
  try {
    return res.json({ success: true, data: await listAdminDestinations() });
  } catch (error) { return next(error); }
}

export async function reviews(_req, res, next) {
  try {
    return res.json({ success: true, data: await listAdminReviews() });
  } catch (error) { return next(error); }
}
