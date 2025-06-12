import { Server } from "socket.io";

export default function registerCommentSockets(io: Server) {
  io.on("connection", (socket) => {
    socket.on("comment:send", (data) => {
      io.emit("comment:new", data);
    });
  });
}
