import React, { useEffect, useState } from "react";
import { FaChartLine, FaMoneyBillWave, FaSyncAlt } from "react-icons/fa";
import { financialReportApi, getApiError } from "../../services/accountingService";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function FinancialReports() {
  const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [to, setTo] = useState(new Date().toISOString().slice(0,10));
  const [data, setData] = useState(null);
  const [methods, setMethods] = useState(null);
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [summary, paymentMethods, pendingPayments] = await Promise.all([
        financialReportApi.summary(from, to),
        financialReportApi.paymentMethods(from, to),
        financialReportApi.pendingPayments(),
      ]);
      setData(summary); setMethods(paymentMethods); setPending(pendingPayments);
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return <div className="reports-page">
    <style>{css}</style>
    <div className="head"><div><h1>Financial Reports</h1><p>Sales, repair, rental collections, vendor payments, salary and net result.</p></div><button className="btn" onClick={load} disabled={loading}><FaSyncAlt/> {loading ? "Loading..." : "Refresh"}</button></div>
    <div className="filters"><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label><button className="btn primary" onClick={load}>Apply</button></div>
    {error && <div className="alert">{error}</div>}
    {!data ? <div className="empty">Loading report...</div> : <>
      <div className="cards">
        <Card title="Sales Collection" value={data.collection?.sales} />
        <Card title="Repair Collection" value={data.collection?.repair} />
        <Card title="Rental Collection" value={data.collection?.rental} />
        <Card title="Total Collection" value={data.collection?.total} />
        <Card title="Vendor Payments" value={data.expenses?.vendorPayments} />
        <Card title="Salary Paid" value={data.expenses?.salary} />
        <Card title="Total Expenses" value={data.expenses?.total} />
        <Card title="Net Result" value={data.result?.net} />
      </div>
      <div className="grid2">
        <section className="panel"><h2><FaChartLine/> Sales Orders</h2><Row k="Total Orders" v={data.salesOrders?.totalOrders}/><Row k="Total Sales" v={money(data.salesOrders?.totalSales)}/><Row k="Online Sales" v={money(data.salesOrders?.onlineSales)}/><Row k="Walk-in Sales" v={money(data.salesOrders?.walkInSales)}/><Row k="Paid Amount" v={money(data.salesOrders?.paidAmount)}/><Row k="Pending Amount" v={money(data.salesOrders?.pendingAmount)}/></section>
        <section className="panel"><h2><FaMoneyBillWave/> Payment Methods</h2><Row k="Cash" v={money(methods?.CASH)}/><Row k="Bank" v={money(methods?.BANK)}/><Row k="UPI" v={money(methods?.UPI)}/><Row k="Other" v={money(methods?.OTHER)}/></section>
      </div>
      <section className="panel"><h2>Pending Vendor Payments</h2><div className="pending-top"><strong>{money(pending?.totalPending)}</strong><span>{pending?.count || 0} purchase(s)</span></div>{pending?.purchases?.length ? <div className="table-wrap"><table><thead><tr><th>Purchase</th><th>Vendor</th><th>Total</th><th>Paid</th><th>Pending</th><th>Status</th></tr></thead><tbody>{pending.purchases.map(p=><tr key={p._id}><td>{p.purchaseNumber}</td><td>{p.vendorName}</td><td>{money(p.totalAmount)}</td><td>{money(p.paidAmount)}</td><td>{money(p.pendingAmount)}</td><td>{p.paymentStatus}</td></tr>)}</tbody></table></div>:<div className="empty">No pending vendor payments.</div>}</section>
    </>}
  </div>;
}
function Card({title,value}){return <div className="card"><span>{title}</span><strong>{money(value)}</strong></div>}
function Row({k,v}){return <div className="row"><span>{k}</span><b>{v}</b></div>}
const css=`
.reports-page{padding:24px;background:#f7f9fc;min-height:100vh;font-family:Poppins,Arial,sans-serif;color:#172033}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.head h1{margin:0;font-size:28px}.head p{color:#718096;margin:6px 0}.filters{background:#fff;border:1px solid #e6eaf0;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:end;margin-bottom:18px}.filters label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600}.filters input{padding:9px;border:1px solid #d9dee7;border-radius:8px}.btn{border:0;border-radius:9px;padding:10px 15px;cursor:pointer;font-weight:700;display:inline-flex;gap:8px;align-items:center}.primary{background:#167c5a;color:#fff}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.card{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:17px}.card span{font-size:12px;color:#718096;display:block}.card strong{font-size:21px;display:block;margin-top:7px}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}.panel{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:18px;margin-bottom:18px}.panel h2{font-size:17px;margin:0 0 13px;display:flex;gap:8px;align-items:center}.row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #edf0f4;font-size:13px}.row:last-child{border:0}.pending-top{display:flex;gap:15px;align-items:baseline;margin-bottom:12px}.pending-top strong{font-size:24px}.pending-top span{color:#718096}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:700px}th,td{padding:11px;border-bottom:1px solid #edf0f4;text-align:left;font-size:13px}th{background:#fafbfc}.alert{background:#fff0f0;color:#b42318;padding:11px;border-radius:8px;margin-bottom:15px}.empty{text-align:center;padding:30px;color:#778294}@media(max-width:950px){.cards{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}}@media(max-width:600px){.head,.filters{flex-direction:column;align-items:stretch}.cards{grid-template-columns:1fr}}
`;
