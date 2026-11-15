import { Router } from "express";
import { login, profile, register, updateProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, updateProfile);
export default router;
