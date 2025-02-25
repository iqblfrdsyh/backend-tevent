const express = require("express");
const router = express.Router();

const {
  getEvent,
  createEvent,
  deleteEvent,
  searchEventByCategory,
  getEventById,
} = require("../controllers/event.controller");
const { upload, handleMulterError } = require("../middleware/upload");

router.get("/events", getEvent);
router.get("/event/:id", getEventById);
router.get("/events/search", searchEventByCategory);
router.post(
  "/event",
  upload.single("thumbnail"),
  handleMulterError,
  createEvent
);
router.delete("/event/:id", deleteEvent);

module.exports = router;
