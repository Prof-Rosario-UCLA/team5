import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import registerCommentSockets from "./sockets/comments";

await mongoose.connect(process.env.MONGO_URI!);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csrf({
  cookie: { httpOnly: true, sameSite: "strict", secure: true }
});
app.use("/api", csrf({cookie: { httpOnly: true, sameSite: "strict", secure: true }}));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: process.env.CLIENT_URL } });
registerCommentSockets(io);

httpServer.listen(process.env.PORT || 8080, () =>
  console.log("Server live")
);
