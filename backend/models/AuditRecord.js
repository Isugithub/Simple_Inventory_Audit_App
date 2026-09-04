
const mongoose = require("mongoose");

const auditRecordSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },

    expectedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    actualQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    variance: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["MATCHED", "SHORT", "OVER"],
      required: true,
    },

    auditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AuditRecord",
  auditRecordSchema
);

