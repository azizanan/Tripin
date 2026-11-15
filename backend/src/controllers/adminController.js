import { getAdminStats } from "../models/adminModel.js";

export async function stats(_req, res, next) {
  try {
    return res.json({ success: true, data: await getAdminStats() });
  } catch (error) { return next(error); }
}
