
const AuditRecord = require("../models/AuditRecord");
const InventoryItem = require("../models/InventoryItem");

const calculateVariance = require("../utils/calculateVariance");
const auditService = require("../services/auditService");


// ==========================================
// CREATE AUDIT
// ==========================================

const createAudit = async (req, res) => {
  try {
    const {
      inventoryItem,
      actualQuantity,
    } = req.body;

    // Validate input
    if (
      !inventoryItem ||
      actualQuantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Inventory item and actual quantity are required.",
      });
    }

    // Find inventory item
    const item =
      await InventoryItem.findById(
        inventoryItem
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory item not found.",
      });
    }

    // Calculate variance
    const {
      variance,
      status,
    } = calculateVariance(
      item.expectedQuantity,
      actualQuantity
    );

    // Create audit record
    const audit =
      await AuditRecord.create({
        inventoryItem,
        expectedQuantity:
          item.expectedQuantity,
        actualQuantity,
        variance,
        status,
      });

    // Return response
    res.status(201).json({
      success: true,
      message:
        "Audit record created successfully.",
      data: audit,
    });

  } catch (error) {

    console.error(
      "Create Audit Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAudits = async (req, res) => {
  try {
    const audits = await AuditRecord.find()
      .populate("inventoryItem", "name sku")
      .sort({ auditedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: audits,
    });
  } catch (error) {
    console.error("Get Audits Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET AUDIT REPORT
// ==========================================

const getAuditReport = async (
  req,
  res
) => {
  try {
    const report = await auditService.getAuditReport();
    res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {

    console.error(
      "Get Audit Report Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createAudit,
  getAudits,
  getAuditReport,
};
