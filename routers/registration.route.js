const express = require("express");
const router = express.Router();

const {
  createRegistration,
  midtransWebHook,
} = require("../controllers/registration.controller");

router.post("/registration", createRegistration);
router.post("/registration/status", midtransWebHook);

module.exports = router;
