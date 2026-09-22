import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaReceipt, FaSearch, FaTrash, FaTimes } from "react-icons/fa";
import { expenseApi, getApiError } from "../../services/accountingService";

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
      <style>{css}</style>
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

const css = `
.accounting-page{padding:24px;font-family:Poppins,Arial,sans-serif;color:#172033;background:#f7f9fc;min-height:100vh}
.page-head{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}.page-head h1{margin:0;font-size:28px}.page-head p{margin:6px 0;color:#718096}
.summary-card{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:14px 20px;min-width:150px}.summary-card span{display:block;color:#718096;font-size:12px}.summary-card strong{font-size:22px}
.panel{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:20px;margin-bottom:20px;box-shadow:0 3px 15px rgba(0,0,0,.03)}.panel-title{grid-column:1/-1;font-weight:700;font-size:18px}
.form-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}label{font-size:13px;font-weight:600;color:#445;display:flex;flex-direction:column;gap:7px}input,select,textarea{border:1px solid #d9dee7;border-radius:9px;padding:10px 11px;font:inherit;background:#fff}textarea{min-height:70px;resize:vertical}.wide{grid-column:1/-1}.actions{display:flex;gap:10px}
.btn{border:0;border-radius:9px;padding:10px 16px;display:inline-flex;gap:8px;align-items:center;cursor:pointer;font-weight:600}.primary{background:#167c5a;color:#fff}.ghost{background:#edf1f5;color:#273444}.btn:disabled{opacity:.6}
.alert{background:#fff0f0;color:#b42318;border:1px solid #ffd2d2;padding:11px 14px;border-radius:9px;margin-bottom:15px}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:14px}.toolbar h2{margin:0;font-size:19px}.search{display:flex;align-items:center;gap:8px;border:1px solid #d9dee7;border-radius:9px;padding:0 10px}.search input{border:0;outline:0}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:950px}th,td{padding:12px;border-bottom:1px solid #edf0f4;text-align:left;font-size:13px}th{background:#fafbfc;color:#5b6575}.badge{padding:5px 8px;border-radius:999px;font-size:11px;font-weight:700}.paid{background:#e7f7ee;color:#157347}.pending{background:#fff4db;color:#946200}.cancelled{background:#ffe8e8;color:#b42318}.icon-btn{border:0;background:#eef3f7;padding:8px;border-radius:7px;margin-right:5px;cursor:pointer}.icon-btn.danger{color:#b42318}.empty{text-align:center;padding:35px;color:#778294}
@media(max-width:900px){.form-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.page-head{flex-direction:column;align-items:stretch}.form-grid{grid-template-columns:1fr}.wide{grid-column:auto}}
`;
