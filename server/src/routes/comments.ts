import { Router} from "express";
import Comment from "../models/Comment.ts";
import requireAuth from "../middleware/requireAuth.ts";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const raw = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate("author", "email")
      .lean();

    const comments = raw.map(c => ({
      ...c,
      email: (c.author as any).email
    }));
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { body } = req.body as { body: string };
    if (!body?.trim()) return res.status(400).json({ error: "body_required" });

    let comment = await Comment.create({
      postId,
      author: res.locals.userId,
      body: body.trim()
    });

    comment = await comment.populate("author", "email");
    const out = { ...comment, email: (comment.author as any).email };
    req.app.get("io").to(postId).emit("comment:new", out);
    res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

export default router;
