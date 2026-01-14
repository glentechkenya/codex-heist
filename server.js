const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  let username = "Anonymous";

  socket.on("join", (name) => {
    username = name;
    socket.broadcast.emit("message", `🟢 ${username} joined Codex Heist`);
  });

  socket.on("message", (msg) => {
    io.emit("message", `${username}: ${msg}`);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("message", `🔴 ${username} left Codex Heist`);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Codex Heist running");
});
