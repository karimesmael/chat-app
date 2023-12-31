const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    messageType: {
      type: String,
      default: "text",
      enum: ["text", "image"],
    },
    content: { type: String, trim: true },
    url: { type: String, trim: true },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
