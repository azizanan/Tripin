import { Router } from "express";
import { listPlaces, showPlace } from "../controllers/placeController.js";

const router = Router();

router.get("/", listPlaces);
router.get("/:id", showPlace);

export default router;
