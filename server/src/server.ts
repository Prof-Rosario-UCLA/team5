import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
import express, {Request,Response, RequestHandler} from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import authRoutes from "./routes/auth.ts";
import commentsRoutes from "./routes/comments.ts";
import postRoutes from "./routes/posts.ts";
import registerCommentSockets from "./sockets/comments.ts";
import requireAuth from "./middleware/requireAuth.ts";
import requestLogger from "./middleware/requestLogger.ts";

mongoose.connection.on('connected', ()=> console.log("fr"));
try{
  await mongoose.connect(process.env.MONGO_URI!);
}
catch(err){
  console.log("connection failed", err);
}
const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const rawCsrf = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  }
});
const csrfProtection = (rawCsrf as unknown) as RequestHandler;
app.get("/api/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/"    
  });
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api", csrfProtection);
app.use("/api/posts", requireAuth, postRoutes);
app.use("/api/posts/:postId/comments",requireAuth, commentsRoutes);

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: process.env.CLIENT_URL } });
app.set("io",io);
registerCommentSockets(io);

httpServer.listen(process.env.PORT || 8080);
