const express = require("express");
const router = express.Router();

const {
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
} = require("../controllers/ticket.controller");

router.get("/tickets", getTicket);
router.post("/ticket", createTicket);
router.put("/ticket/:id", updateTicket);
router.delete("/ticket/:id", deleteTicket);

module.exports = router;
