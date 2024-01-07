exports.connectToSocket = (server) => {
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: { origin: "https://free-talk-cha.onrender.com" },
  });

  io.on("connection", (socket) => {
    let currentUser;
    socket.on("error", (err) => {
      console.error("Socket.IO Error:", err);
    });
    socket.on("setup", (userData) => {
      if (!userData) return;
      currentUser = userData;
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing", currentUser._id);
    });

    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing", currentUser._id);
    });

    socket.on("new message", (newMessage) => {
      let chat = newMessage.chatId;
      if (!chat.users) return console.log("users not found");
      chat.users.forEach((user) => {
        if (user._id == newMessage.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessage);
      });
    });

    socket.on("disconnect", () => {
      if (currentUser) {
        socket.leave(currentUser._id);
      }
    });
  });
};
