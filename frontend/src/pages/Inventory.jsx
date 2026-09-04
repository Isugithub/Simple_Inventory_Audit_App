import { useEffect, useState } from "react";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventory,
  updateInventoryItem,
} from "../services/api";

const emptyForm = {
  name: "",
  sku: "",
  expectedQuantity: "",
  category: "",
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [notice, setNotice] = useState("");
  const role = (JSON.parse(localStorage.getItem("inventory_auth_session") || "{}").role || "viewer")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const canManageInventory = role === "admin" || role === "super_admin";

  const loadInventory = async () => {
    try {
      const response = await getInventory();
      setItems(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canManageInventory) {
      setNotice("Warning: only an admin or super admin can change inventory data.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        expectedQuantity: Number(form.expectedQuantity),
      };
      if (editingItem) {
        await updateInventoryItem(editingItem._id || editingItem.id, payload);
      } else {
        await createInventoryItem(payload);
      }
      setForm(emptyForm);
      setEditingItem(null);
      setNotice(editingItem ? "Inventory item updated successfully." : "");
      await loadInventory();
    } catch (error) {
      console.error("Failed to save inventory item:", error);
      setError(error.response?.data?.message || "Unable to save inventory item.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (item) => {
    if (!canManageInventory) {
      setNotice("Warning: only an admin or super admin can edit inventory data.");
      return;
    }
    setNotice("Warning: changes to inventory data are restricted and will be recorded.");
    setEditingItem(item);
    setForm({
      name: item.name || "",
      sku: item.sku || "",
      expectedQuantity: String(item.expectedQuantity ?? ""),
      category: item.category || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!canManageInventory) {
      setNotice("Warning: only an admin or super admin can delete inventory data.");
      return;
    }
    setDeleteCandidate(item);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setError("");
      await deleteInventoryItem(deleteCandidate._id || deleteCandidate.id);
      setNotice("Inventory item deleted successfully.");
      setDeleteCandidate(null);
      await loadInventory();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete inventory item.");
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setNotice("");
  };

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <p className="eyebrow">Stock control</p>
          <h1>Inventory</h1>
          <p className="inventory-subtitle">Add and manage the items your team audits.</p>
        </div>
        <div className="inventory-count">
          <strong>{items.length}</strong>
          <span>items tracked</span>
        </div>
      </div>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="inventory-name">Item name</label>
        <input
          id="inventory-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Chocolate Biscuit"
          required
        />
        </div>
        <div className="form-field">
          <label htmlFor="inventory-sku">SKU</label>
        <input
          id="inventory-sku"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="e.g. CHOC-001"
          required
        />
        </div>
        <div className="form-field">
          <label htmlFor="inventory-quantity">Expected quantity</label>
        <input
          id="inventory-quantity"
          name="expectedQuantity"
          type="number"
          value={form.expectedQuantity}
          onChange={handleChange}
          placeholder="0"
          required
        />
        </div>
        <div className="form-field">
          <label htmlFor="inventory-category">Category</label>
        <input
          id="inventory-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Grocery"
          required
        />
        </div>

        <div className="form-submit">
          <button
            type="submit"
            disabled={saving}
          >
            <span className="add-icon">+</span>
            {saving ? "Saving item..." : editingItem ? "Save changes" : "Add item"}
          </button>
          {editingItem && (
            <button type="button" className="form-cancel" onClick={cancelEditing}>
              Cancel
            </button>
          )}
          {error && <p className="form-error">{error}</p>}
        </div>
      </form>
      {notice && <p className="inventory-notice" role="status">{notice}</p>}

      <div className="inventory-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Expected</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-inventory">
                  No inventory items yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{item.name}</td>
                  <td><span className="sku-badge">{item.sku}</span></td>
                  <td><strong>{item.expectedQuantity}</strong></td>
                  <td><span className="category-badge">{item.category}</span></td>
                  <td className="inventory-actions">
                    <button type="button" className="edit-button" onClick={() => startEditing(item)}>
                      Edit
                    </button>
                    <button type="button" className="delete-button" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deleteCandidate && (
        <div className="delete-modal-backdrop" role="presentation">
          <div className="delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <h2 id="delete-title">Delete inventory item?</h2>
            <p>
              You are about to permanently delete <strong>{deleteCandidate.name}</strong>.
              This action is restricted to admins and super admins and cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button type="button" className="form-cancel" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </button>
              <button type="button" className="delete-confirm-button" onClick={confirmDelete}>
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
