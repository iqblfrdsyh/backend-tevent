const express = require("express");
const router = express.Router();

const {
  getCategory,
  createCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.get("/categories", getCategory);
router.post("/category", createCategory);
router.delete("/category/:id", deleteCategory);

module.exports = router;
