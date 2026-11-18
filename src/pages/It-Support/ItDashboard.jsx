import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUser,
  FiTool,
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiArrowRight,
  FiInbox,
} from "react-icons/fi";
import { calcRepairAmounts } from "../../components/repair/repairHelpers";
import "./ItDashboard.css";

// =====================================================
// API (same endpoints as the Repair Service Registry)
// =====================================================

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/newRepair`;
const TECHNICIAN_URL = `${API_URL}/newRepair/technicians`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  return { headers: { Authorization: `Bearer ${token}` } };
};

const extractList = (data, key) =>
  data?.[key] || data?.data || (Array.isArray(data) ? data : []);

// =====================================================
// HELPERS
// =====================================================

const CLOSED_STATUSES = ["delivered", "completed", "cancelled"];

const normalizeStatus = (status) =>
  String(status || "received")
    .toLowerCase()
    .replaceAll("_", " ")
    .trim();

const getStatusLabel = (status) =>
  normalizeStatus(status).replace(/\b\w/g, (l) => l.toUpperCase());

const statusClass = (status) =>
  `st-${normalizeStatus(status).replaceAll(" ", "-")}`;

const STATUS_COLORS = {
  received: "#f5b942",
  assigned: "#8b5cf6",
  "in progress": "#3b82f6",
  "waiting for parts": "#f97316",
  "ready for delivery": "#14b8a6",
  completed: "#4c9a1f",
  delivered: "#22a35a",
  cancelled: "#9ca3af",
};

// yyyy-mm-dd in the user's local time zone
const dateKey = (value) => {
  if (!value) return "";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

const getProblemCategory = (repair = {}) => {
  if (repair.problemCategory) return repair.problemCategory;

  const line = String(repair.issueDescription || "")
    .split(/\r?\n/)
    .find((part) => part.startsWith("Problem Category: "));

  return line ? line.slice("Problem Category: ".length).trim() : "";
};

const getProblemText = (repair = {}) => {
  if (repair.specificProblem) return repair.specificProblem;

  const line = String(repair.issueDescription || "")
    .split(/\r?\n/)
    .find((part) => part.startsWith("Specific Problem: "));

  if (line) return line.slice("Specific Problem: ".length).trim();

  return String(repair.issueDescription || "").split(/\r?\n/)[0] || "-";
};

const countBy = (list, getKey) => {
  const map = new Map();

  list.forEach((item) => {
    const key = getKey(item);

    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const getUserFirstName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const name = user?.firstName || user?.name || user?.fullName || "";

    return String(name).split(" ")[0];
  } catch {
    return "";
  }
};

// =====================================================
// SMALL REUSABLE PIECES
// =====================================================

const StatCard = ({ label, value, icon, tone }) => (
  <div className="dash-stat-card">
    <div className={`dash-stat-icon tone-${tone}`}>{icon}</div>

    <div>
      <span className="dash-stat-label">{label}</span>
      <strong className="dash-stat-value">{value}</strong>
    </div>
  </div>
);

const BarList = ({ items, empty = "No data yet." }) => {
  const max = Math.max(...items.map((i) => i.value), 1);

  if (items.length === 0) {
    return <p className="dash-empty-text">{empty}</p>;
  }

  return (
    <div className="dash-tech-list">
      {items.map((item) => (
        <div className="dash-tech" key={item.label}>
          <div className="dash-tech-top">
            <span>{item.label}</span>
            <b>{item.value}</b>
          </div>

          <div className="dash-progress">
            <div
              className="dash-progress-fill"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// COMPONENT
// =====================================================

const ItDashboard = () => {
  const navigate = useNavigate();

  const [repairs, setRepairs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = getUserFirstName();

  // ---------------------------------------------------
  // FETCH
  // ---------------------------------------------------

  const fetchRepairs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/`, getAuthConfig());

      setRepairs(extractList(res.data, "repairs"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(TECHNICIAN_URL, getAuthConfig());

      setTechnicians(extractList(res.data, "technicians"));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load technicians"
      );
    }
  };

  useEffect(() => {
    fetchRepairs();
    fetchTechnicians();
  }, []);

  // ---------------------------------------------------
  // TECHNICIAN NAME (same logic as the ticket page)
  // ---------------------------------------------------

  const resolveTechName = (techOrId) => {
    if (!techOrId) return "Unassigned";

    if (
      typeof techOrId === "string" &&
      !techOrId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return techOrId;
    }

    const techObj =
      typeof techOrId === "object"
        ? techOrId
        : technicians.find((t) => t._id === techOrId);

    if (!techObj) return "Unassigned";

    const full = `${techObj.firstName || ""} ${techObj.lastName || ""}`.trim();

    return (
      full ||
      techObj.name ||
      techObj.fullName ||
      techObj.username ||
      "Technician"
    );
  };

  const getTechnicianName = (repair) =>
    resolveTechName(repair?.assignedTechnician || repair?.technicianName);

  // ---------------------------------------------------
  // CALCULATED DASHBOARD DATA
  // ---------------------------------------------------

  const data = useMemo(() => {
    const todayKey = dateKey(new Date());
    const statusOf = (r) => normalizeStatus(r.status);
    const isClosed = (r) => CLOSED_STATUSES.includes(statusOf(r));

    // ----- stat cards -----
    const customerCount = new Set(
      repairs.map((r) => r.customerPhone).filter(Boolean)
    ).size;

    const countStatus = (...names) =>
      repairs.filter((r) => names.includes(statusOf(r))).length;

    const stats = {
      customers: customerCount,
      repairs: repairs.length,
      pending: countStatus("received"),
      delivered: countStatus("delivered", "completed"),
      inProgress: countStatus("in progress"),
      ready: countStatus("ready for delivery"),
      overdue: repairs.filter((r) => {
        const est = dateKey(r.estimatedCompletionDate);

        return est && est < todayKey && !isClosed(r);
      }).length,
      newToday: repairs.filter(
        (r) => dateKey(r.jobDate || r.createdAt) === todayKey
      ).length,
    };

    // ----- last 7 days -----
    const weekly = [];

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();

      d.setDate(d.getDate() - i);

      const key = dateKey(d);

      weekly.push({
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        count: repairs.filter(
          (r) => dateKey(r.jobDate || r.createdAt) === key
        ).length,
      });
    }

    // ----- status breakdown -----
    const statusBreakdown = countBy(repairs, (r) => statusOf(r)).map(
      (item) => ({
        label: getStatusLabel(item.label),
        value: item.value,
        color: STATUS_COLORS[item.label] || "#94a3b8",
      })
    );

    // ----- recent tickets -----
    const recent = [...repairs]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.jobDate || 0) -
          new Date(a.createdAt || a.jobDate || 0)
      )
      .slice(0, 5);

    // ----- technician workload (active jobs only) -----
    const workload = countBy(
      repairs.filter((r) => !isClosed(r)),
      (r) => getTechnicianName(r)
    );

    // ----- payments -----
    let billed = 0;
    let collected = 0;
    let outstanding = 0;

    const paymentCounts = { PAID: 0, PARTIAL: 0, PENDING: 0 };

    repairs
      .filter((r) => statusOf(r) !== "cancelled")
      .forEach((r) => {
        const total = Number(calcRepairAmounts(r)?.total || 0);
        const paid = Number(r.paidAmount || 0);

        billed += total;
        collected += paid;
        outstanding += Math.max(total - paid, 0);

        const ps = String(
          r.paymentStatus ||
            (total > 0 && paid >= total
              ? "PAID"
              : paid > 0
              ? "PARTIAL"
              : "PENDING")
        ).toUpperCase();

        if (paymentCounts[ps] !== undefined) paymentCounts[ps] += 1;
      });

    // ----- insights -----
    const problems = countBy(
      repairs.filter((r) => getProblemCategory(r)),
      (r) => getProblemCategory(r)
    ).slice(0, 5);

    const warranty = countBy(repairs, (r) => r.warrantyStatus || "Not set");

    const invoiceTypes = countBy(repairs, (r) =>
      r.invoiceType === "GST"
        ? "GST"
        : r.invoiceType === "NON_GST"
        ? "Non-GST"
        : "Not set"
    );

    return {
      stats,
      weekly,
      statusBreakdown,
      recent,
      workload,
      money: { billed, collected, outstanding, paymentCounts },
      problems,
      warranty,
      invoiceTypes,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repairs, technicians]);

  const { stats, weekly, statusBreakdown, recent, workload, money } = data;

  // ---------------------------------------------------
  // CHART MATH
  // ---------------------------------------------------

  const maxWeekly = Math.max(...weekly.map((w) => w.count), 1);
  const totalStatus = statusBreakdown.reduce((sum, s) => sum + s.value, 0);

  // guard: avoids dividing by zero when there are no repairs
  const donutTotal = totalStatus || 1;

  let acc = 0;

  const donutStops = statusBreakdown
    .map((s) => {
      const start = (acc / donutTotal) * 100;

      acc += s.value;

      const end = (acc / donutTotal) * 100;

      return `${s.color} ${start}% ${end}%`;
    })
    .join(", ");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const quickActions = [
    { label: "New Repair Job", path: "/itsupport-dashboard/add-new-ticket" },
    { label: "View All Tickets", path: "/itsupport-dashboard/add-new-ticket" },
    { label: "Billing & Rates", path: "/itsupport-dashboard/charges" },
    { label: "Apply Leave", path: "/itsupport-dashboard/leave" },
  ];

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------

  return (
    <div className="dash-page">
      {/* Hero */}
      <section className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-eyebrow">IT SUPPORT OVERVIEW</span>

          <h1>{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</h1>

          <p>
            Here&apos;s what&apos;s happening across your repair desk today.
            Track intake, workshop assignments and delivery status at a glance.
          </p>

          <span className="dash-date">{today}</span>
        </div>

        <div className="dash-hero-actions">
          <button
            type="button"
            className="dash-btn-secondary"
            onClick={() => {
              fetchRepairs();
              fetchTechnicians();
            }}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "dash-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            className="dash-btn-primary"
            onClick={() => navigate("/itsupport-dashboard/add-new-ticket")}
          >
            <FiPlus /> New Repair Job
          </button>
        </div>
      </section>

      {/* Stat cards - row 1 */}
      <section className="dash-stats">
        <StatCard
          label="Total Customers"
          value={stats.customers}
          icon={<FiUser />}
          tone="green"
        />
        <StatCard
          label="Total Repairs"
          value={stats.repairs}
          icon={<FiTool />}
          tone="slate"
        />
        <StatCard
          label="Pending / Received"
          value={stats.pending}
          icon={<FiClock />}
          tone="amber"
        />
        <StatCard
          label="Delivered & Closed"
          value={stats.delivered}
          icon={<FiCheckCircle />}
          tone="mint"
        />
      </section>

      {/* Stat cards - row 2 */}
      <section className="dash-stats">
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<FiActivity />}
          tone="blue"
        />
        <StatCard
          label="Ready for Delivery"
          value={stats.ready}
          icon={<FiPackage />}
          tone="mint"
        />
        <StatCard
          label="Overdue Jobs"
          value={stats.overdue}
          icon={<FiAlertTriangle />}
          tone="red"
        />
        <StatCard
          label="New Today"
          value={stats.newToday}
          icon={<FiCalendar />}
          tone="green"
        />
      </section>

      {/* Charts */}
      <section className="dash-grid dash-grid-2">
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Repairs This Week</h2>
            <span className="dash-muted">New jobs per day</span>
          </div>

          <div className="dash-bars">
            {weekly.map((w, index) => (
              <div className="dash-bar-col" key={`${w.day}-${index}`}>
                {/* track holds the count + bar so the tallest bar always fits */}
                <div className="dash-bar-track">
                  <span className="dash-bar-count">{w.count}</span>

                  <div
                    className="dash-bar"
                    style={{ "--h": w.count / maxWeekly }}
                  />
                </div>

                <span className="dash-bar-day">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Status Breakdown</h2>
            <span className="dash-muted">All repairs</span>
          </div>

          {totalStatus === 0 ? (
            <p className="dash-empty-text">No repairs to chart yet.</p>
          ) : (
            <div className="dash-donut-wrap">
              <div
                className="dash-donut"
                style={{ background: `conic-gradient(${donutStops})` }}
              >
                <div className="dash-donut-hole">
                  <strong>{totalStatus}</strong>
                  <span>Total</span>
                </div>
              </div>

              <ul className="dash-legend">
                {statusBreakdown.map((s) => (
                  <li key={s.label}>
                    <span
                      className="dash-dot"
                      style={{ background: s.color }}
                    />
                    {s.label}
                    <b>{s.value}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Recent tickets + side panels */}
      <section className="dash-grid dash-grid-3">
        <div className="dash-card dash-span-2">
          <div className="dash-card-head">
            <h2>Recent Tickets</h2>

            <button
              type="button"
              className="dash-link"
              onClick={() => navigate("/itsupport-dashboard/add-new-ticket")}
            >
              View all <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <p className="dash-empty-text">Loading tickets...</p>
          ) : recent.length === 0 ? (
            <div className="dash-empty">
              <FiInbox />
              <p>No tickets yet. Create your first repair job.</p>
            </div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Customer</th>
                    <th>Device</th>
                    <th>Problem</th>
                    <th>Tech</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {/* data-label is shown as the row label on mobile (stacked cards) */}
                  {recent.map((t) => (
                    <tr key={t._id || t.repairNumber}>
                      <td className="dash-mono" data-label="Ticket">
                        {t.repairNumber || "-"}
                      </td>
                      <td className="dash-strong" data-label="Customer">
                        {t.customerName || "-"}
                      </td>
                      <td data-label="Device">
                        {t.deviceModel || t.deviceType || "-"}
                      </td>
                      <td data-label="Problem">{getProblemText(t)}</td>
                      <td data-label="Tech">
                        <span className="dash-chip">
                          {getTechnicianName(t)}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span
                          className={`dash-status ${statusClass(t.status)}`}
                        >
                          {getStatusLabel(t.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dash-side">
          <div className="dash-card">
            <div className="dash-card-head">
              <h2>Quick Actions</h2>
            </div>

            <div className="dash-actions">
              {quickActions.map((a) => (
                <button
                  type="button"
                  key={a.label}
                  className="dash-action"
                  onClick={() => navigate(a.path)}
                >
                  {a.label}
                  <FiArrowRight />
                </button>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-head">
              <h2>Technician Workload</h2>
              <span className="dash-muted">Active jobs</span>
            </div>

            <BarList
              items={workload.map((w) => ({
                label: w.label,
                value: w.value,
              }))}
              empty="No active jobs."
            />
          </div>
        </div>
      </section>

      {/* Payments + insights */}
      <section className="dash-grid dash-grid-3">
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Payments</h2>
            <span className="dash-muted">Excludes cancelled</span>
          </div>

          <div className="dash-money">
            <div className="dash-money-row">
              <span>Total billed</span>
              <b>{inr(money.billed)}</b>
            </div>

            <div className="dash-money-row">
              <span>Collected</span>
              <b className="dash-green">{inr(money.collected)}</b>
            </div>

            <div className="dash-money-row">
              <span>Outstanding</span>
              <b className="dash-red">{inr(money.outstanding)}</b>
            </div>
          </div>

          <div className="dash-pay-split">
            <span className="dash-status st-delivered">
              Paid {money.paymentCounts.PAID}
            </span>
            <span className="dash-status st-in-progress">
              Partial {money.paymentCounts.PARTIAL}
            </span>
            <span className="dash-status st-received">
              Pending {money.paymentCounts.PENDING}
            </span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Top Problem Categories</h2>
          </div>

          <BarList items={data.problems} empty="No category data yet." />
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Warranty and Invoice</h2>
          </div>

          <p className="dash-sub-title">Warranty</p>
          <BarList items={data.warranty} empty="No data yet." />

          <p className="dash-sub-title">Invoice type</p>
          <BarList items={data.invoiceTypes} empty="No data yet." />
        </div>
      </section>
    </div>
  );
};

export default ItDashboard;