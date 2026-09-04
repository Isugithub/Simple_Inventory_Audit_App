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
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Audit Report
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

        <div className="p-5 rounded-xl shadow bg-white">
          <p>Total Items</p>
          <h2 className="text-2xl font-bold">
            {report.totalItems}
          </h2>
        </div>

        <div className="p-5 rounded-xl shadow bg-white">
          <p>Matched</p>
          <h2 className="text-2xl font-bold">
            {report.matchedItems}
          </h2>
        </div>

        <div className="p-5 rounded-xl shadow bg-white">
          <p>Short</p>
          <h2 className="text-2xl font-bold">
            {report.shortItems}
          </h2>
        </div>

        <div className="p-5 rounded-xl shadow bg-white">
          <p>Over</p>
          <h2 className="text-2xl font-bold">
            {report.overItems}
          </h2>
        </div>

      </div>

      <div className="report-variance-section">
        <h2 className="text-xl font-semibold mb-4">
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