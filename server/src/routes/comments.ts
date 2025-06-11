import { Router, Request, Response, NextFunction } from "express";
import Comment from "../models/Comment.ts";
import requireAuth from "../middleware/requireAuth.ts";

const router = Router({ mergeParams: true });

// GET  /api/posts/:postId/comments
router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ postId })
        .sort({ createdAt: 1 })
        .lean();
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/posts/:postId/comments
router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { body } = req.body as { body: string };
      if (!body?.trim()) {
        return res.status(400).json({ error: "body_required" });
      }

      const comment = await Comment.create({
        postId,
        author: req.cookies["_jwt"] ? req.app.get("userEmail") : "anon",
        body: body.trim(),
      });

      // broadcast via Socket.io
      const io = req.app.get("io") as import("socket.io").Server;
      io.to(postId).emit("comment:new", comment);

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
