import { Router } from "express";
import { destroy, index, store, update } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.get("/:destinationId", index);
router.post("/", authenticate, store);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, destroy);
export default router;
