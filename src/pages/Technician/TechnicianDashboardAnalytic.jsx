import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiTool,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiRefreshCw,
  FiActivity,
} from "react-icons/fi";
import "./TechnicianDashboardAnalytic.css";

const BASE_URL = "http://localhost:5000/api/newRepair";

const PIE_COLORS = ["#2563eb", "#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export default function TechnicianDashboardAnalytic() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  const token = localStorage.getItem("token");

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const techId = loggedInUser._id || loggedInUser.id || "";
  const techName = (
    loggedInUser.name ||
    loggedInUser.fullName ||
    `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
  ).trim().toLowerCase();

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await axios.get(`${BASE_URL}/my-assigned-repairs`, getAuthConfig());
      } catch {
        res = await axios.get(`${BASE_URL}/`, getAuthConfig());
      }
      const raw = res.data?.repairs || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setRepairs(raw);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter strictly for this technician
  const myRepairs = useMemo(() => {
    return repairs.filter((r) => {
      const assigned = r.assignedTechnician;
      const assignedId = typeof assigned === "object" ? assigned?._id || assigned?.id : assigned;

      if (techId && assignedId && String(assignedId) === String(techId)) return true;

      const recordName = (r.technicianName || "").trim().toLowerCase();
      if (techName && recordName) {
        if (recordName === techName || recordName.includes(techName) || techName.includes(recordName)) {
          return true;
        }
      }
      return false;
    });
  }, [repairs, techId, techName]);

  // KPI Calculations
  const totalAssigned = myRepairs.length;
  const inProgress = myRepairs.filter((r) =>
    ["assigned", "in progress", "received", "waiting for parts"].includes(String(r.status || "received").toLowerCase())
  ).length;
  const completed = myRepairs.filter((r) =>
    ["completed", "delivered", "ready for delivery"].includes(String(r.status || "").toLowerCase())
  ).length;

  const totalRevenue = myRepairs.reduce((acc, r) => acc + (Number(r.repairCost) || 0), 0);

  // Overdue SLA calculation
  const overdueCount = myRepairs.filter((r) => {
    if (!r.estimatedCompletionDate || ["completed", "delivered"].includes(String(r.status).toLowerCase())) {
      return false;
    }
    return new Date(r.estimatedCompletionDate) < new Date();
  }).length;

  const resolutionRate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

  // Chart Data 1: Status Distribution
  const statusDistribution = useMemo(() => {
    const counts = {};
    myRepairs.forEach((r) => {
      const st = r.status || "Received";
      counts[st] = (counts[st] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [myRepairs]);

  // Chart Data 2: Revenue & Workload by Month/Day
  const workloadTimeline = useMemo(() => {
    const map = {};
    myRepairs.forEach((r) => {
      const d = new Date(r.createdAt || Date.now());
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!map[key]) {
        map[key] = { date: key, jobs: 0, revenue: 0 };
      }
      map[key].jobs += 1;
      map[key].revenue += Number(r.repairCost) || 0;
    });
    return Object.values(map).slice(-7); // Last 7 active data points
  }, [myRepairs]);

  // Chart Data 3: Top Devices Diagnosed
  const topDevices = useMemo(() => {
    const map = {};
    myRepairs.forEach((r) => {
      const model = r.deviceModel || r.laptopModel || "Other";
      const shortModel = model.split(" ").slice(0, 2).join(" ");
      map[shortModel] = (map[shortModel] || 0) + 1;
    });
    return Object.keys(map)
      .map((k) => ({ name: k, count: map[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [myRepairs]);

  return (
    <div className="tkpi-container">
      {/* Top Header */}
      <header className="tkpi-header">
        <div>
          <span className="tkpi-eyebrow">ANALYTICS ENGINE</span>
          <h1>Technician Performance Dashboard</h1>
          <p>
            Welcome, <strong>{loggedInUser.name || "Technician"}</strong> • Real-time SLA tracking, throughput & repair volume.
          </p>
        </div>

        <button type="button" className="tkpi-sync-btn" onClick={fetchData} disabled={loading}>
          <FiRefreshCw className={loading ? "tkpi-spin" : ""} />
          <span>Sync Realtime</span>
        </button>
      </header>

      {/* 4 Core KPI Stat Cards */}
      <section className="tkpi-grid-4">
        <div className="tkpi-card">
          <div className="tkpi-card-top">
            <span className="tkpi-title">Active Workload</span>
            <div className="tkpi-icon icon-blue"><FiTool /></div>
          </div>
          <div className="tkpi-val-wrap">
            <strong className="tkpi-metric">{inProgress}</strong>
            <span className="tkpi-tag tag-blue">{totalAssigned} Total Queue</span>
          </div>
        </div>

        <div className="tkpi-card">
          <div className="tkpi-card-top">
            <span className="tkpi-title">Resolution Rate</span>
            <div className="tkpi-icon icon-green"><FiCheckCircle /></div>
          </div>
          <div className="tkpi-val-wrap">
            <strong className="tkpi-metric">{resolutionRate}%</strong>
            <span className="tkpi-tag tag-green">{completed} Fixed Units</span>
          </div>
        </div>

        <div className="tkpi-card">
          <div className="tkpi-card-top">
            <span className="tkpi-title">SLA Overdue Risk</span>
            <div className="tkpi-icon icon-red"><FiAlertTriangle /></div>
          </div>
          <div className="tkpi-val-wrap">
            <strong className="tkpi-metric">{overdueCount}</strong>
            <span className={`tkpi-tag ${overdueCount > 0 ? "tag-red" : "tag-green"}`}>
              {overdueCount > 0 ? "Action Required" : "On Track"}
            </span>
          </div>
        </div>

        <div className="tkpi-card">
          <div className="tkpi-card-top">
            <span className="tkpi-title">Generated Labor Value</span>
            <div className="tkpi-icon icon-purple"><FiDollarSign /></div>
          </div>
          <div className="tkpi-val-wrap">
            <strong className="tkpi-metric">₹{totalRevenue.toLocaleString()}</strong>
            <span className="tkpi-tag tag-purple">Billed Intake</span>
          </div>
        </div>
      </section>

      {/* Analytics Chart Row 1 */}
      <section className="tkpi-charts-row">
        {/* Workload Volume Area Chart */}
        <div className="tkpi-chart-card tkpi-col-8">
          <div className="tkpi-chart-header">
            <div>
              <h3>Repair Intake & Velocity</h3>
              <p>Daily breakdown of assigned job tasks</p>
            </div>
            <span className="tkpi-live-pill"><FiActivity /> Live Activity</span>
          </div>

          <div className="tkpi-chart-body">
            {workloadTimeline.length === 0 ? (
              <div className="tkpi-empty-chart">No job volume data recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={workloadTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }}
                    itemStyle={{ color: "#93c5fd" }}
                  />
                  <Area type="monotone" dataKey="jobs" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="tkpi-chart-card tkpi-col-4">
          <div className="tkpi-chart-header">
            <div>
              <h3>Status Ratio</h3>
              <p>Queue allocation breakdown</p>
            </div>
          </div>

          <div className="tkpi-chart-body">
            {statusDistribution.length === 0 ? (
              <div className="tkpi-empty-chart">No status distribution records.</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            <div className="tkpi-legend-list">
              {statusDistribution.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="tkpi-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="legend-lbl">{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Chart Row 2 */}
      <section className="tkpi-charts-row">
        {/* Frequent Hardware Issues */}
        <div className="tkpi-chart-card tkpi-col-6">
          <div className="tkpi-chart-header">
            <div>
              <h3>Frequent Hardware Intake</h3>
              <p>Most common models on your workstation</p>
            </div>
          </div>
          <div className="tkpi-chart-body">
            {topDevices.length === 0 ? (
              <div className="tkpi-empty-chart">No device history available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topDevices} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#334155", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Urgent High-Priority Action List */}
        <div className="tkpi-chart-card tkpi-col-6">
          <div className="tkpi-chart-header">
            <div>
              <h3>Priority Attention Queue</h3>
              <p>Tickets requiring immediate diagnosis or parts</p>
            </div>
          </div>

          <div className="tkpi-priority-list">
            {myRepairs
              .filter((r) => ["received", "assigned", "waiting for parts"].includes(String(r.status || "").toLowerCase()))
              .slice(0, 4)
              .map((task) => (
                <div key={task._id} className="tkpi-priority-item">
                  <div className="p-item-left">
                    <span className="p-ticket">{task.repairNumber || task._id.slice(-6).toUpperCase()}</span>
                    <div>
                      <strong>{task.customerName}</strong>
                      <span className="p-model">{task.deviceModel || task.laptopModel}</span>
                    </div>
                  </div>
                  <div className="p-item-right">
                    <span className="p-date">
                      <FiCalendar /> {task.estimatedCompletionDate ? new Date(task.estimatedCompletionDate).toLocaleDateString() : "No Date"}
                    </span>
                    <span className={`p-status-tag ${String(task.status).toLowerCase().replaceAll(" ", "-")}`}>
                      {task.status || "Received"}
                    </span>
                  </div>
                </div>
              ))}
            {myRepairs.filter((r) => ["received", "assigned", "waiting for parts"].includes(String(r.status || "").toLowerCase())).length === 0 && (
              <div className="tkpi-empty-chart">All assigned work is on track or completed!</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}