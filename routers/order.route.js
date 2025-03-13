const express = require("express");
const router = express.Router();

const {
  createOrder,
  midtransWebHook,
} = require("../controllers/order.controller");

router.post("/order", createOrder);
router.post("/order/status", midtransWebHook);

module.exports = router;
