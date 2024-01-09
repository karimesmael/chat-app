const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  sendMessage,
  getMessages,
  sendImage,
} = require("../controllers/messageControllers");

router.use(checkAuth);
router.post("/", sendMessage);
router.post("/image", sendImage);
router.get("/:chatId", getMessages);

module.exports = router;
