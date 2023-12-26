require("dotenv").config();
const mongoose = require("mongoose");
const app = require("express")();
const cors = require("cors");
const { chats } = require("./data/data");

app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});
app.get("/api/chats/:id", (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("connected to MONGOB");
    app.listen(process.env.PORT || 3000);
    console.log("server is running on 5000");
  })
  .catch((err) => {
    console.log(err.message);
  });
