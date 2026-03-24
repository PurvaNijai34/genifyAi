import express from "express";
import { handleClerkWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/clerk", handleClerkWebhook);

export default router;