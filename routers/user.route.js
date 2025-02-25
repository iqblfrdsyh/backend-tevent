const {
  getUser,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller");
const express = require("express");
const { verifyToken } = require("../middleware/verify");
const { refreshToken } = require("../helper/refreshToken");
const router = express.Router();

router.get("/users", getUser);
router.post("/user/signup", registerUser);
router.post("/user/signin", loginUser);
router.delete("/user/logout", logoutUser);
router.get("/refreshToken", refreshToken);

module.exports = router;
