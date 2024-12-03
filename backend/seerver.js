const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Track active games
const activeGames = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining game room
  socket.on("joinGame", (userData) => {
    // Logic for matching players
    // For testing, create/join a single game room
    const gameRoom = "testGame";
    socket.join(gameRoom);

    const playersInRoom = io.sockets.adapter.rooms.get(gameRoom).size;

    if (playersInRoom === 2) {
      io.to(gameRoom).emit("gameStart", { message: "Game is starting!" });
    }
  });

  // Handle dice roll
  socket.on("rollDice", (gameData) => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    io.to(gameData.gameRoom).emit("diceResult", {
      player: socket.id,
      value: diceValue,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
