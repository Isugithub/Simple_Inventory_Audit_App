const InventoryTable = ({ items = [] }) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Table Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Inventory Items
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your inventory items
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Item
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                SKU
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Expected Qty
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Unit
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item._id}
                  className="transition hover:bg-gray-50"
                >
                  {/* Item Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                        📦
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Inventory Item
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {item.category}
                    </span>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.sku || "—"}
                  </td>

                  {/* Expected Quantity */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {item.expectedQuantity}
                    </span>
                  </td>

                  {/* Unit */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit || "units"}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;