import { Router } from "express";
import { destinations, reviews, stats } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { destroy as destroyReview } from "../controllers/reviewController.js";

const router = Router();
router.use(authenticate, authorize("admin"));
router.get("/stats", stats);
router.get("/destinations", destinations);
router.get("/reviews", reviews);
router.delete("/reviews/:id", destroyReview);
export default router;
