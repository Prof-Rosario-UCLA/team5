import { Router} from "express";
import type { Response, Request } from "express";
import Post from "../models/Post.ts";
import { getTrending } from "../middleware/trendingCache.ts";
import { z } from "zod";

const router = Router();

const createSchema = z.object({
  title: z.string().min(5),
  markdown: z.string().min(20),
});
const updateSchema = createSchema.partial(); 

function markdownToHtml(md: string) {
  return md.replace(/^# (.*$)/gm, "<h1>$1</h1>").replace(/\n/g, "<br>");
}

router.post("/", async (req: Request, res: Response) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const { title, markdown } = parse.data;
  const html = markdownToHtml(markdown);

  const post = await Post.create({
    author: res.locals.userId,
    title,
    markdown,
    html,
  });

  res.status(201).json(post);
});

router.get('/:id([0-9a-fA-F]{24})', async (req, res) => {
  const dbPost = await Post.findById(req.params.id)
    .populate("author", "email")
    .lean();

  if (!dbPost) return res.status(404).json({ error: "not_found" });
  const post = {
    ...dbPost,
    email: (dbPost.author as any).email
  };
  Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).catch(console.error);
  res.json(post);
});

router.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const PAGE_SIZE = 10;

  const dbPosts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .populate("author", "email")
    .select("-markdown")
    .lean();

  const posts = dbPosts.map(p => ({
    ...p,
    email: (p.author as any).email
  }));

  res.json(posts);
});

router.get("/trending/ids", async (_req, res) => {
    const ids = await getTrending(10); 
    res.json(ids);                        
  });

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

router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  if (post.author.toString() !== res.locals.userId)
    return res.status(403).json({ error: "forbidden" });

  await post.deleteOne();
  res.status(204).end();
});

export default router;
