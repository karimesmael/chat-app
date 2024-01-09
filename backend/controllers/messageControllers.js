const asyncHandler = require("express-async-handler");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");
const { json } = require("body-parser");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    throw new Error("invalid data");
  }
  const chat = await Chat.findOne({
    _id: chatId,
    users: { $in: [req.userId] },
  });

  if (!chat) return res.status(403).send("you are not allowed to send message");
  const newMessage = {
    sender: req.userId,
    content,
    chatId,
  };
  let message = await Message.create(newMessage);
  message = await message.populate("sender", "name pic");
  message = await message.populate("chatId");
  message = await User.populate(message, {
    path: "chatId.users",
    select: "name pic email",
  });
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  return res.json(message);
});

exports.getMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const messages = await Message.find({ chatId })
    .populate("sender", "name pic")
    .populate("chatId");
  return res.json(messages);
});
