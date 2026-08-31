import { useEffect, useState } from "react";
import axios from "axios";
import { FiUserCheck, FiClock, FiCalendar, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import "./TechnicianWorkOrders.css";

const BASE_URL = "http://localhost:5000/api/newRepair";
const TECHNICIAN_URL = "http://localhost:5000/api/newRepair/technicians";

const TechnicianWorkOrders = () => {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [assignedRepairs, setAssignedRepairs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch Technicians list for the dropdown
  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await axios.get(TECHNICIAN_URL, getAuthConfig());
        const list = res.data?.technicians || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setTechnicians(list);
        if (list.length > 0) {
          setSelectedTechId(list[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load technicians");
      }
    };
    fetchTechs();
  }, []);

  // Fetch repairs whenever selected technician changes
  useEffect(() => {
    if (!selectedTechId) return;

    const fetchTechnicianRepairs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/technician/${selectedTechId}`, getAuthConfig());
        setAssignedRepairs(res.data?.data || res.data?.repairs || []);
        console.log(res, "All data")
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load technician repairs");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianRepairs();
  }, [selectedTechId]);

  const getStatusClass = (status) =>
    status ? `rc-status-${String(status).toLowerCase().replaceAll(" ", "-")}` : "rc-status-default";

  return (
    <div className="rc-dashboard">
      <header className="rc-header">
        <div>
          <span className="rc-eyebrow">Work Allocation</span>
          <h1>Technician Job Assignments</h1>
          <p>Review repair workloads and active work orders per technician.</p>
        </div>

        {/* Technician Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <label style={{ fontWeight: 600, fontSize: "0.875rem" }}>Select Technician:</label>
          <select
            value={selectedTechId}
            onChange={(e) => setSelectedTechId(e.target.value)}
            className="rc-select"
          >
            {technicians.map((tech) => (
              <option key={tech._id} value={tech._id}>
                {tech.firstName ? `${tech.firstName} ${tech.lastName || ""}` : tech.name || tech.email}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="rc-main-card">
        {loading ? (
          <div className="rc-state-box">
            <div className="rc-spinner"></div>
            <p>Loading assigned repair tasks...</p>
          </div>
        ) : assignedRepairs.length === 0 ? (
          <div className="rc-state-box">
            <p>No active repair tasks assigned to this technician.</p>
          </div>
        ) : (
          <div className="rc-table-scroll">
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer</th>
                  <th>Device Model</th>
                  <th>Reported Issue</th>
                  <th>Est. Completion</th>
                  <th>Repair Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedRepairs.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="rc-ticket-id">{item.repairNumber || item._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td>
                      <strong>{item.customerName}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--rc-text-muted)" }}>{item.customerPhone}</div>
                    </td>
                    <td>
                      <strong>{item.deviceModel}</strong>
                    </td>
                    <td style={{ maxWidth: "260px" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", whiteSpace: "normal" }}>{item.issueDescription}</p>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem" }}>
                        <FiCalendar /> {item.estimatedCompletionDate ? new Date(item.estimatedCompletionDate).toLocaleDateString() : "Not Set"}
                      </span>
                    </td>
                    <td>
                      <strong>₹{item.repairCost || 0}</strong>
                    </td>
                    <td>
                      <span className={`rc-status-pill ${getStatusClass(item.status)}`}>
                        {item.status || "Assigned"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default TechnicianWorkOrders;