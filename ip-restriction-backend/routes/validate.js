import express from "express";
import { validateController } from "../controllers/validate.js";
const router = express.Router();

router.get("/validate",validateController)

export default router;