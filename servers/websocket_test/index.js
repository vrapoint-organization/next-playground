const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const throttle = require("lodash/throttle");

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server and configure CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
  },
});

// 유저와 마우스좌표
// {
//  name:string;
//  data:UInt8Array
//}
const users = [];

// Handle Socket.IO connections
io.on("connection", (socket) => {
  const userName = socket.request._query.userName;
  if (!userName) {
    socket.emit("error", "userName is required");
    socket.disconnect();
    return;
  }
  console.log("Client connected", userName);

  // if user not exists
  if (!users.find((user) => user.name === userName)) {
    users.push({ name: userName, x: undefined, y: undefined });
  }

  // 유저가 연결되면 다 default-room에 때려넣는다
  const defaultRoom = "default-room";
  socket.join(defaultRoom);

  socket.on("message", (message) => {
    console.log("Received : ", message);
    socket.emit("reply", `You said: ${message}`);
  });

  socket.on("disconnect", () => {
    users.splice(
      users.findIndex((user) => user.name === userName),
      1
    );
    console.log("Client disconnected");
  });

  // 유저 마우스이벤트 받아서 0.1초마다 갱신
  const throttledMousePosition = throttle((info) => {
    // const {user}
    socket.to(defaultRoom).emit(users);
  }, 100);

  // Listen for mouse position from the client
  socket.on("mousePosition", (data) => {
    console.log(userName, data);
    users.find((user) => user.name === userName).data = data;
    const filteredUsers = users.filter((user) => user.data);
    socket.to(defaultRoom).emit("mousePositions", filteredUsers);
    // throttle(()=>{
    //     console.log(data);
    // },100);
    // throttledMousePosition(data.x, data.y);
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
