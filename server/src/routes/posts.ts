import { Router } from "express";
const router = Router();

router.get("/recent", (_req, res) => res.json([]));

export default router;
