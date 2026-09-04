const express = require("express");

const {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const requireInventoryAdmin = require("../middleware/requireInventoryAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", getInventory);
router.post("/", requireAuth, requireInventoryAdmin, createInventoryItem);
router.put("/:id", requireAuth, requireInventoryAdmin, updateInventoryItem);
router.delete("/:id", requireAuth, requireInventoryAdmin, deleteInventoryItem);

module.exports = router;