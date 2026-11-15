import { Router } from "express";
import { destinations, destroy, index, store, update } from "../controllers/categoryController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();
router.get("/", index);
router.get("/:id/destinations", destinations);
router.post("/", authenticate, authorize("admin"), store);
router.put("/:id", authenticate, authorize("admin"), update);
router.delete("/:id", authenticate, authorize("admin"), destroy);
export default router;
