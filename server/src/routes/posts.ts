import { Router, Request, Response } from "express";
import Post from "../models/Post";
import { bumpTrending, getTrending } from "../middleware/trendingCache";
import { z } from "zod";

const router = Router();

// ---------- validators ----------
const createSchema = z.object({
  title: z.string().min(5),
  markdown: z.string().min(20),
});
const updateSchema = createSchema.partial(); // any subset of fields

// ---------- helpers ----------
function markdownToHtml(md: string) {
  // TODO: swap this for your Wasm markdown engine
  return md.replace(/^# (.*$)/gm, "<h1>$1</h1>").replace(/\n/g, "<br>");
}

// ---------- routes ----------

// POST /api/posts
router.post("/", async (req: Request, res: Response) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const { title, markdown } = parse.data;
  const html = markdownToHtml(markdown);

  const post = await Post.create({
    author: res.locals.userId, // assume auth middleware set this
    title,
    markdown,
    html,
  });

  res.status(201).json(post);
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });

  post.views++;
  await post.save();
  bumpTrending(post.id).catch(console.error);

  res.json(post);
});

// GET /api/posts (paged list)
router.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const PAGE_SIZE = 10;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select("-markdown"); // send excerpt only

  res.json(posts);
});

// GET /api/posts/trending
router.get("/trending/ids", async (_req, res) => {
  res.json(await getTrending(10));
});

// PUT /api/posts/:id
router.put("/:id", async (req, res) => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  if (post.author.toString() !== res.locals.userId)
    return res.status(403).json({ error: "forbidden" });

  if (parse.data.title) post.title = parse.data.title;
  if (parse.data.markdown) {
    post.markdown = parse.data.markdown;
    post.html = markdownToHtml(parse.data.markdown);
  }
  await post.save();
  res.json(post);
});

// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  if (post.author.toString() !== res.locals.userId)
    return res.status(403).json({ error: "forbidden" });

  await post.deleteOne();
  res.status(204).end();
});

export default router;
