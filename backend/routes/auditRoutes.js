
const express = require("express");

const {
  createAudit,
  getAudits,
  getAuditReport,
} = require("../controllers/auditController");

const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireInventoryAdmin = require("../middleware/requireInventoryAdmin");


// Create audit record
router.post("/", requireAuth, requireInventoryAdmin, createAudit);

router.get("/", getAudits);


// Get audit report
router.get("/report", getAuditReport);


module.exports = router;
