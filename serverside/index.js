const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

function generateHashValue(length) {
  const availableChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hashValue = "";
  for (let i = 0; i < length; i++) {
    hashValue +=
      availableChars[Math.floor(Math.random() * availableChars.length)];
  }
  return hashValue;
}

function generateRandomNumber() {
  const e = 2 ** 32;
  const h = crypto.getRandomValues(new Uint32Array(1))[0];
  return Math.floor((100 * e - h) / (e - h)) / 100;
}

let currentImagePosition = { x: 25, y: 280 }; // Initial position of the image

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
//CANVAS SECTION
  socket.on("update3", (data) => {
    console.log(`Received update3: ${data}`);

    // Emit the received update to all connected clients, including the sender
    socket.broadcast.emit("message3", data);
  });
  socket.on("update4", (data) => {
    // console.log(`Received update1: ${data}`);

    // Emit the received update to all connected clients, including the sender
    socket.broadcast.emit("message4", data);
  });

  socket.emit("imagePosition", currentImagePosition);

  socket.on("updatePosition", (position) => {
    currentImagePosition = position; // Update the current position

    io.emit("imagePosition", position);
  });
  socket.on("update5", (data) => {

    socket.broadcast.emit("message5", data);
  });
  socket.on("update6", (data) => {

    socket.broadcast.emit("message6", data);
  });
  socket.on("update7", (data) => {

    socket.broadcast.emit("message7", data);
  });
  socket.on("update8", (data) => {

    socket.broadcast.emit("message8", data);
  });
  socket.on("update9", (data) => {

    socket.broadcast.emit("message9", data);
  });
  socket.on("update10", (data) => {

    socket.broadcast.emit("message10", data);
  });
  socket.on("update11", (data) => {

    socket.broadcast.emit("message11", data);
  });
  socket.on("update12", (data) => {

    socket.broadcast.emit("message12", data);
  });

  socket.on("generateHashValue", (length) => {
    const hashValue = generateHashValue(length);
    console.log("Generated hash value:", hashValue);
    io.emit("hashValue", hashValue);
  });

  socket.on("generateRandomNumber", () => {
    const randomNumber = generateRandomNumber();
    console.log("Generated random number:", randomNumber);
    io.emit("randomNumber", randomNumber);
  });

  socket.on("timerValue", (value) => {
    console.log("Received timer value:", value);

    io.emit("timerValue", value);
  });

  socket.on("load", (value) => {
    console.log("Received timer value:", value);

    io.emit("load", value);
  });

  socket.on("load2", (value) => {
    console.log("Received timer value:", value);

    io.emit("load2", value);
  });

  socket.on("timer", (timeLeft) => {
    // Emit the current time left value to all connected clients
    io.emit("timer", timeLeft);
  });
  //END OF CANVAS SECTION
  //STARTOF CONTROL SECTION
  socket.on("timerValue1", (value) => {
    console.log(`Received timer value from user ${socket.id}: ${value}`);
    io.emit("timerValue1", value);
  });
  socket.on("timerValue2", (value) => {
    console.log(`Received timer value from user ${socket.id}: ${value}`);
    io.emit("timerValue2", value);
  });
  //END OF CONTROL SECTION

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

});

server.listen(3005, () => {
  console.log("SERVER IS RUNNING");
 });