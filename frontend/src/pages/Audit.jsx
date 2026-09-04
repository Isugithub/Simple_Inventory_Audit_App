import { useEffect, useState } from "react";
import { createAudit, getAudits, getInventory } from "../services/api";

const Audit = () => {
  const [items, setItems] = useState([]);
  const [audits, setAudits] = useState([]);
  const [form, setForm] = useState({
    inventoryItem: "",
    actualQuantity: "",
  });

  const loadData = async () => {
    const [inventoryResult, auditsResult] = await Promise.allSettled([
      getInventory(),
      getAudits(),
    ]);

    if (inventoryResult.status === "fulfilled") {
      const inventoryResponse = inventoryResult.value;
      setItems(inventoryResponse.data?.data || inventoryResponse.data || []);
    } else {
      console.error("Failed to load inventory items:", inventoryResult.reason);
    }

    if (auditsResult.status === "fulfilled") {
      const auditsResponse = auditsResult.value;
      setAudits(auditsResponse.data?.data || auditsResponse.data || []);
    } else {
      console.error("Failed to load audit records:", auditsResult.reason);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createAudit({
        ...form,
        actualQuantity: Number(form.actualQuantity),
      });
      setForm({ inventoryItem: "", actualQuantity: "" });
      await loadData();
    } catch (error) {
      console.error("Failed to create audit record:", error);
    }
  };

  return (
    <div className="audit-page">
      <div className="audit-heading">
        <div>
          <p className="eyebrow">Stock verification</p>
          <h1>Audit inventory</h1>
          <p>Record actual quantities and track variance.</p>
        </div>
        <div className="audit-count">
          <strong>{audits.length}</strong>
          <span>recent audits</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="audit-form">
        <div className="form-field">
          <label htmlFor="audit-item">Inventory item</label>
        <select
          id="audit-item"
          name="inventoryItem"
          value={form.inventoryItem}
          onChange={handleChange}
          required
        >
          <option value="">Select inventory item</option>
          {items.map((item) => (
            <option key={item._id || item.id} value={item._id || item.id}>
              {item.name}
            </option>
          ))}
        </select>
        </div>

        <div className="form-field">
          <label htmlFor="audit-quantity">Actual quantity</label>
        <input
          id="audit-quantity"
          name="actualQuantity"
          type="number"
          value={form.actualQuantity}
          onChange={handleChange}
          placeholder="Enter counted quantity"
          required
        />
        </div>

        <div className="audit-submit">
          <button type="submit">
            <span>✓</span> Submit audit
          </button>
        </div>
      </form>

      <div className="audit-records">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Activity</p>
            <h2>Recent audit records</h2>
          </div>
          <span>Latest checks</span>
        </div>
        <div className="audit-list">
          {audits.length === 0 ? (
            <p className="empty-audits">No audits recorded yet.</p>
          ) : (
            audits.map((audit) => (
              <div key={audit._id || audit.id} className="audit-record">
                <div className="audit-record-title">
                  <strong>{audit.inventoryItem?.name || "Unknown item"}</strong>
                  <span className={`audit-status status-${audit.status?.toLowerCase()}`}>
                    {audit.status}
                  </span>
                </div>
                <div className="audit-metrics">
                  <span>Expected <strong>{audit.expectedQuantity}</strong></span>
                  <span>Actual <strong>{audit.actualQuantity}</strong></span>
                  <span>Variance <strong>{audit.variance > 0 ? `+${audit.variance}` : audit.variance}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
