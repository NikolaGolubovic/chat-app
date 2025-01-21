import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User is connected.");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
