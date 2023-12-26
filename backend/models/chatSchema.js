const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
