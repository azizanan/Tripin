import { Router } from "express";
import { destroy, index, store } from "../controllers/favoriteController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.use(authenticate);
router.get("/", index);
router.post("/", store);
router.delete("/:destinationId", destroy);
export default router;
