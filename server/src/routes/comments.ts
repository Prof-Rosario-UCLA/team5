import { Router, Request, Response, NextFunction } from "express";
import Comments from "../models/Comments.ts";
import requireAuth from "../middleware/requireAuth.ts";

const router = Router({ mergeParams: true });
router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const comments = await Comments.find({ postId })
        .sort({ createdAt: 1 })
        .lean();
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);


router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { body } = req.body as { body: string };
      if (typeof body !== "string" || body.trim().length === 0) {
        return res.status(400).json({ error: "body_required" });
      }
      const comment = await Comments.create({
        postId,
        author: res.locals.userEmail || res.locals.userId,
        body: body.trim()
      });
      req.app.get("io").to(postId).emit("comment:new", comment);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
