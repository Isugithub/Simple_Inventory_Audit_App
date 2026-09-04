
const AuditRecord = require("../models/AuditRecord");

const getAuditReport = async () => {
  const audits = await AuditRecord.find()
    .populate("inventoryItem")
    .sort({ createdAt: -1 });

  const totalItems = audits.length;

  const matchedItems = audits.filter(
    (audit) => audit.status === "MATCHED"
  ).length;

  const shortItems = audits.filter(
    (audit) => audit.status === "SHORT"
  ).length;

  const overItems = audits.filter(
    (audit) => audit.status === "OVER"
  ).length;

  const totalExpected = audits.reduce(
    (total, audit) =>
      total + audit.expectedQuantity,
    0
  );

  const totalActual = audits.reduce(
    (total, audit) =>
      total + audit.actualQuantity,
    0
  );

  const totalVariance =
    totalActual - totalExpected;

  return {
    totalItems,
    auditedItems: totalItems,

    matchedItems,
    shortItems,
    overItems,

    totalExpectedQuantity: totalExpected,
    totalActualQuantity: totalActual,
    totalVariance,

    items: audits,
  };
};

module.exports = {
  getAuditReport,
};
