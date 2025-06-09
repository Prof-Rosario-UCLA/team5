export default function registerCommentSockets(io) {
    io.on("connection", (socket) => {
        console.log("👤", socket.id, "joined");
        socket.on("comment:send", (data) => {
            io.emit("comment:new", data);
        });
    });
}
