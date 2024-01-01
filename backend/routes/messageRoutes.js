const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageControllers");

router.use(checkAuth);
router.post("/", sendMessage);
router.get("/:chatId", getMessages);

module.exports = router;
