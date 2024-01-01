require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = require("express")();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res, next) => {
  const status = 404;
  res.status(status).json({ message: "URL not Found" });
});
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
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
