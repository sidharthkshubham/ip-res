import express from "express";
import { banipcontroller, unbanipcontroller } from "../controllers/ip-banned.js";
const router = express.Router();

router.post("/ban",banipcontroller);
router.post("/unban",unbanipcontroller);

export default router;