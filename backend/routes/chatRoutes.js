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
router.put("/group/rename", renameGroup);
router.put("/group/add", addToGroup);
router.put("/group/remove", removeFromGroup);

module.exports = router;
