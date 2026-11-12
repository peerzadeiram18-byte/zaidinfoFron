import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaReceipt, FaSearch, FaTrash, FaTimes } from "react-icons/fa";
import { expenseApi, getApiError } from "../../services/accountingService";
import './ExpenseManagement.css'

const CATEGORIES = [
  ["OFFICE_RENT", "Office Rent"],
  ["ELECTRICITY", "Electricity"],
  ["INTERNET", "Internet"],
  ["TRAVEL", "Travel"],
  ["OFFICE_SUPPLIES", "Office Supplies"],
  ["MAINTENANCE", "Maintenance"],
  ["PURCHASE", "Purchase"],
  ["SALARY", "Salary"],
  ["MARKETING", "Marketing"],
  ["OTHER", "Other"],
];

const label = (v) => CATEGORIES.find(([k]) => k === v)?.[1] || v;

const initial = {
  category: "OFFICE_SUPPLIES",
  title: "",
  description: "",
  amount: "",
  paymentMethod: "CASH",
  expenseDate: new Date().toISOString().slice(0, 10),
  receiptNumber: "",
  vendorName: "",
  status: "PAID",
  remark: "",
};

export default function ExpenseManagement() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await expenseApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((x) =>
      [x.expenseNumber, x.title, x.vendorName, x.receiptNumber, x.category]
        .some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [rows, search]);

  const total = filtered.reduce((s, x) => s + Number(x.amount || 0), 0);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await expenseApi.update(editingId, { ...form, amount: Number(form.amount) });
      else await expenseApi.create({ ...form, amount: Number(form.amount) });
      setForm(initial);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const edit = (x) => {
    setEditingId(x._id);
    setForm({
      category: x.category || "OTHER",
      title: x.title || "",
      description: x.description || "",
      amount: x.amount ?? "",
      paymentMethod: x.paymentMethod || "CASH",
      expenseDate: x.expenseDate ? new Date(x.expenseDate).toISOString().slice(0, 10) : "",
      receiptNumber: x.receiptNumber || "",
      vendorName: x.vendorName || "",
      status: x.status || "PAID",
      remark: x.remark || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseApi.remove(id);
      await load();
    } catch (e) { setError(getApiError(e)); }
  };

  return (
    <div className="accounting-page">
      {/* <style>{css}</style> */}
      <div className="page-head">
        <div>
          <h1>Expense Management</h1>
          <p>Create, edit and track business expenses.</p>
        </div>
        <div className="summary-card"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
      </div>

      {error && <div className="alert">{error}</div>}

      <form className="panel form-grid" onSubmit={submit}>
        <div className="panel-title">{editingId ? "Edit Expense" : "Create Expense"}</div>
        <label>Category<select name="category" value={form.category} onChange={change}>{CATEGORIES.map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Title<input name="title" value={form.title} onChange={change} required /></label>
        <label>Amount<input type="number" min="0.01" step="0.01" name="amount" value={form.amount} onChange={change} required /></label>
        <label>Payment Method<select name="paymentMethod" value={form.paymentMethod} onChange={change}><option>CASH</option><option>BANK</option><option>UPI</option></select></label>
        <label>Expense Date<input type="date" name="expenseDate" value={form.expenseDate} onChange={change} required /></label>
        <label>Vendor Name<input name="vendorName" value={form.vendorName} onChange={change} /></label>
        <label>Receipt Number<input name="receiptNumber" value={form.receiptNumber} onChange={change} /></label>
        <label>Status<select name="status" value={form.status} onChange={change}><option>PAID</option><option>PENDING</option><option>CANCELLED</option></select></label>
        <label className="wide">Description<textarea name="description" value={form.description} onChange={change} /></label>
        <label className="wide">Remark<textarea name="remark" value={form.remark} onChange={change} /></label>
        <div className="wide actions">
          <button className="btn primary" disabled={saving}><FaPlus /> {saving ? "Saving..." : editingId ? "Update Expense" : "Create Expense"}</button>
          {editingId && <button type="button" className="btn ghost" onClick={() => { setEditingId(null); setForm(initial); }}><FaTimes /> Cancel</button>}
        </div>
      </form>

      <div className="panel">
        <div className="toolbar"><h2>Expenses</h2><div className="search"><FaSearch /><input placeholder="Search expense..." value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        {loading ? <div className="empty">Loading...</div> : filtered.length === 0 ? <div className="empty">No expenses found.</div> : (
          <div className="table-wrap"><table><thead><tr><th>Expense No.</th><th>Date</th><th>Category</th><th>Title</th><th>Vendor</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(x => <tr key={x._id}><td>{x.expenseNumber}</td><td>{new Date(x.expenseDate).toLocaleDateString("en-IN")}</td><td>{label(x.category)}</td><td>{x.title}</td><td>{x.vendorName || "-"}</td><td>₹{Number(x.amount || 0).toLocaleString("en-IN")}</td><td>{x.paymentMethod}</td><td><span className={`badge ${String(x.status).toLowerCase()}`}>{x.status}</span></td><td><button className="icon-btn" onClick={() => edit(x)}><FaEdit /></button><button className="icon-btn danger" onClick={() => remove(x._id)}><FaTrash /></button></td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}
