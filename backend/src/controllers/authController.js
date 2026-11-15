import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, updateUserProfile } from "../models/userModel.js";
import { isValidEmail } from "../utils/validation.js";

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET harus diisi dengan secret minimal 32 karakter.");
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

function safeUser(user) {
  const { password, ...data } = user;
  return data;
}

export async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2 || name.length > 100 || !isValidEmail(email) || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Nama 2–100 karakter, email valid, dan password minimal 8 karakter wajib diisi."
      });
    }
    if (await findUserByEmail(email)) {
      return res.status(409).json({ success: false, message: "Email sudah terdaftar." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, passwordHash });
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: { user, token: createToken(user) }
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
    }

    const user = await findUserByEmail(email);
    const validPassword = user && await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    return res.json({
      success: true,
      message: "Login berhasil.",
      data: { user: safeUser(user), token: createToken(user) }
    });
  } catch (error) {
    return next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const profileImage = req.body.profile_image ? String(req.body.profile_image).trim() : null;
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ success: false, message: "Nama harus terdiri dari 2–100 karakter." });
    }
    const user = await updateUserProfile(req.user.id, { name, profileImage });
    return res.json({ success: true, message: "Profil berhasil diperbarui.", data: user });
  } catch (error) {
    return next(error);
  }
}
