const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");

router.post(
  "/signup",
  check("email").isEmail().withMessage("please enter valid email").trim(),
  userControllers.signup
);
router.post("/login", check("email").isEmail().trim(), userControllers.login);

router.get("/", checkAuth, userControllers.getUsers);

router.put("/", checkAuth, userControllers.editPic);

router.delete("/", checkAuth, userControllers.deletePic);

module.exports = router;
