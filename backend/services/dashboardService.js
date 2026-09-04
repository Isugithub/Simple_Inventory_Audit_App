const InventoryItem = require("../models/InventoryItem");
const AuditRecord = require("../models/AuditRecord");

const getDashboard = async () => {

  const inventory = await InventoryItem.find();

  const audits = await AuditRecord.find()
    .populate("inventoryItem")
    .sort({ createdAt: -1 });

  const totalItems = inventory.length;

  const totalExpectedQuantity = inventory.reduce(
    (total, item) => total + item.expectedQuantity,
    0
  );

  const auditedItemIds = new Set(
    audits
      .map((audit) => audit.inventoryItem?._id?.toString())
      .filter(Boolean)
  );
  const auditedItems = auditedItemIds.size;

  const matchedItems = audits.filter(
    (audit) => audit.status === "MATCHED"
  ).length;

  const shortItems = audits.filter(
    (audit) => audit.status === "SHORT"
  ).length;

  const overItems = audits.filter(
    (audit) => audit.status === "OVER"
  ).length;

  const totalActualQuantity = audits.reduce(
    (total, audit) => total + audit.actualQuantity,
    0
  );

  const auditedExpectedQuantity = audits.reduce(
    (total, audit) => total + audit.expectedQuantity,
    0
  );

  const totalVariance =
    totalActualQuantity - auditedExpectedQuantity;

  const auditProgress =
    totalItems > 0
      ? Math.round((auditedItems / totalItems) * 100)
      : 0;

  const recentAudits = audits.slice(0, 5);

  return {
    totalItems,
    totalExpectedQuantity,
    auditedItems,
    matchedItems,
    shortItems,
    overItems,
    totalActualQuantity,
    totalVariance,
    auditProgress,
    recentAudits,
  };
};

module.exports = {
  getDashboard,
};