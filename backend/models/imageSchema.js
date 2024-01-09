const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagesSchema = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    url: { type: String, trim: true },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imagesSchema);
