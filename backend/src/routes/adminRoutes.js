import { Router } from "express";
import { stats } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();
router.use(authenticate, authorize("admin"));
router.get("/stats", stats);
export default router;
