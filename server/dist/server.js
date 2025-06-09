import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import Fastify from "fastify";
import fastifyExpress from "fastify-express";
import csrfProtection from "@fastify/csrf-protection";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import registerCommentSockets from "./sockets/comments";
await mongoose.connect(process.env.MONGO_URI);
const f = Fastify();
await f.register(fastifyExpress); // exposes f.use like Express
await f.register(csrfProtection, {
    cookieOpts: { httpOnly: true, sameSite: "strict", secure: true },
});
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: process.env.CLIENT_URL } });
registerCommentSockets(io);
httpServer.listen(process.env.PORT || 8080, () => console.log("Server live"));
