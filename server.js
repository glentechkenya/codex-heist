const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    socket.room = room;
    socket.username = username;

    socket.to(room).emit("message", `🟢 ${username} joined the room`);
  });

  socket.on("message", (msg) => {
    io.to(socket.room).emit("message", `${socket.username}: ${msg}`);
  });

  socket.on("disconnect", () => {
    if(socket.room){
      socket.to(socket.room).emit("message", `🔴 ${socket.username} left`);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT);
