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
    <div className="report-page min-h-screen px-5 py-6 sm:px-8 lg:px-10" style={{ marginTop: "30px" }}>
      <h1 
  style={{ marginLeft: "50px" }} 
  className="text-3xl font-bold tracking-tight text-slate-900"
>Audit Report
</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-5 text-center shadow-sm shadow-slate-200/50">
          <p className="text-sm font-medium text-slate-500">Total Items</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {report.totalItems}
          </h2>
        </div>

        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-5 text-center shadow-sm shadow-slate-200/50">
          <p className="text-sm font-medium text-slate-500">Matched</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {report.matchedItems}
          </h2>
        </div>

        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-5 text-center shadow-sm shadow-slate-200/50">
          <p className="text-sm font-medium text-slate-500">Short</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {report.shortItems}
          </h2>
        </div>

        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-5 text-center shadow-sm shadow-slate-200/50">
          <p className="text-sm font-medium text-slate-500">Over</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {report.overItems}
          </h2>
        </div>

      </div>

      <div className="report-variance-section">
        <h2 className="report-variance-heading ml-[40px] text-xl font-semibold" style={{ marginLeft: "50px" }}>
          Inventory Variance
        </h2>

        <div className="overflow-x-auto">
          <table className="report-table w-full rounded-xl bg-white text-center shadow">

            <thead>
              <tr>
                <th className="p-3">Item</th>
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