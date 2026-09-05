const RecentAudits = ({ audits }) => {
  return (
    <div className="recent-audits-card rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
      <div className="recent-audits-header flex items-center justify-between border-b border-slate-100 p-5">
        <div className="recent-audits-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Activity</p>
          <h2 className="mt-1 font-semibold text-slate-900">Recent audit results</h2>
        </div>
        <span className="recent-audits-last text-xs font-medium text-slate-400">Last 5</span>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">

              <th className="p-4 text-center">
                Item
              </th>

              <th className="p-4 text-center">
                Expected
              </th>

              <th className="p-4 text-center">
                Actual
              </th>

              <th className="p-4 text-center">
                Variance
              </th>

              <th className="p-4 text-center">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {audits.map((audit) => (

              <tr
                key={audit._id}
                className="border-b border-slate-100 text-sm last:border-0 hover:bg-slate-50"
              >

                <td className="p-4 text-center">
                  {audit.inventoryItem?.name}
                </td>

                <td className="p-4 text-center">
                  {audit.expectedQuantity}
                </td>

                <td className="p-4 text-center">
                  {audit.actualQuantity}
                </td>

                <td className="p-4 text-center">
                  {audit.variance > 0
                    ? `+${audit.variance}`
                    : audit.variance}
                </td>

                <td className="p-4 text-center">
                  {audit.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentAudits;