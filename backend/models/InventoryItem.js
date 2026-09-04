
const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    expectedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "units",
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InventoryItem",
  inventoryItemSchema
);

