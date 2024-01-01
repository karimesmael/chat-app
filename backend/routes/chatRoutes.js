const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  accessChat,
  getChats,
  createGroup,
  removeFromGroup,
  renameGroup,
  addToGroup,
} = require("../controllers/chatControllers");

router.use(checkAuth);
router.post("/", accessChat);
router.get("/", getChats);
router.post("/createGroup", createGroup);
router.put("/rename", renameGroup);
router.put("/add", addToGroup);
router.put("/remove", removeFromGroup);

module.exports = router;
