import { useEffect, useState } from "react";
import { getAuditReport } from "../services/api";

const AuditReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await getAuditReport();
      setReport(response.data.data);
    } catch (error) {
      console.error("Failed to load audit report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading audit report...</p>;
  }

  if (!report) {
    return <p>No audit report available.</p>;
  }

  return (
    <div className="report-page">
      <div className="report-header">
        <p className="report-eyebrow">Inventory control</p>
        <h1 className="report-title">Audit Report</h1>
        <p className="report-subtitle">Review the latest inventory count and identify quantity differences.</p>
      </div>

      <div className="report-summary-grid">

        <div className="report-summary-card shadow bg-white">
          <p className="report-card-label">Total Items</p>
          <h2 className="report-card-value">{report.totalItems}</h2>
        </div>

        <div className="report-summary-card shadow bg-white">
          <p className="report-card-label">Matched</p>
          <h2 className="report-card-value">{report.matchedItems}</h2>
        </div>

        <div className="report-summary-card shadow bg-white">
          <p className="report-card-label">Short</p>
          <h2 className="report-card-value">{report.shortItems}</h2>
        </div>

        <div className="report-summary-card shadow bg-white">
          <p className="report-card-label">Over</p>
          <h2 className="report-card-value">{report.overItems}</h2>
        </div>

      </div>

      <div className="report-variance-section">
        <h2 className="report-variance-heading text-xl font-semibold">
          Inventory Variance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">

            <thead>
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3">Expected</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Variance</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {report.items.map((audit) => (
                <tr key={audit._id}>

                  <td className="p-3">
                    {audit.inventoryItem?.name}
                  </td>

                  <td className="p-3 text-center">
                    {audit.expectedQuantity}
                  </td>

                  <td className="p-3 text-center">
                    {audit.actualQuantity}
                  </td>

                  <td className="p-3 text-center">
                    {audit.variance > 0
                      ? `+${audit.variance}`
                      : audit.variance}
                  </td>

                  <td className="p-3 text-center">
                    {audit.status}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;