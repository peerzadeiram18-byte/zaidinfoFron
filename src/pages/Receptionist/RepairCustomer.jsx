import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPlus,
  FiUser,
  FiPhone,
  FiTool,
  FiClock,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiEye,
  FiMonitor,
  FiMessageSquare,
  FiUserCheck,
  FiInbox,
  FiDollarSign,
  FiCalendar,
  FiPrinter,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./RepairCustomer.css";

// const BASE_URL = "http://localhost:5000/api/newRepair";
// const TECHNICIAN_URL = "http://localhost:5000/api/newRepair/technicians";


const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = `${API_URL}/newRepair`;
const TECHNICIAN_URL = `${API_URL}/newRepair/technicians`;




const initialForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  deviceModel: "",
  issueDescription: "",
  estimatedCompletionDate: "",
  repairCost: "",
  technicianName: "",
  assignedTechnician: "",
  remarks: "",
};

const RepairCustomer = () => {
  const [repairs, setRepairs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState(initialForm);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const resolveTechName = (techOrId) => {
    if (!techOrId) return "Unassigned";
    if (typeof techOrId === "string" && !techOrId.match(/^[0-9a-fA-F]{24}$/)) {
      return techOrId;
    }
    const techObj =
      typeof techOrId === "object"
        ? techOrId
        : technicians.find((t) => t._id === techOrId);

    if (!techObj) return "Unassigned";
    const full = `${techObj.firstName || ""} ${techObj.lastName || ""}`.trim();
    return full || techObj.name || techObj.fullName || techObj.username || "Technician";
  };

  const getTechnicianName = (repair) =>
    resolveTechName(repair?.assignedTechnician || repair?.technicianName);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/`, getAuthConfig());
      setRepairs(res.data?.repairs || res.data?.data || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(TECHNICIAN_URL, getAuthConfig());
      const data =
        res.data?.technicians ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      setTechnicians(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load technicians");
    }
  };

  useEffect(() => {
    fetchRepairs();
    fetchTechnicians();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleTechnicianChange = (e) => {
    const id = e.target.value;
    setForm((p) => ({
      ...p,
      assignedTechnician: id,
      technicianName: id ? resolveTechName(id) : "",
    }));
  };

  const handleCreateRepair = async (e) => {
    e.preventDefault();

    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.customerEmail.trim() ||
      !form.deviceModel.trim() ||
      !form.issueDescription.trim()
    ) {
      return toast.error("Please fill in all mandatory fields.");
    }

    try {
      setSubmitting(true);

      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim(),
        deviceModel: form.deviceModel.trim(),
        issueDescription: form.issueDescription.trim(),
        estimatedCompletionDate: form.estimatedCompletionDate || undefined,
        repairCost: form.repairCost ? Number(form.repairCost) : 0,
        technicianName: form.technicianName.trim(),
        assignedTechnician: form.assignedTechnician || null,
        remarks: form.remarks.trim(),
      };

      const res = await axios.post(`${BASE_URL}/request`, payload, getAuthConfig());
      toast.success(res.data?.message || "Repair created successfully");
      setShowAddForm(false);
      setForm(initialForm);
      await fetchRepairs();
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to create repair ticket";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const customers = useMemo(() => {
    const map = new Map();
    repairs.forEach((r) => {
      if (!r.customerPhone) return;
      if (!map.has(r.customerPhone)) {
        map.set(r.customerPhone, {
          customerName: r.customerName || "Unknown Customer",
          customerPhone: r.customerPhone,
          customerEmail: r.customerEmail || "",
          repairs: [],
        });
      }
      map.get(r.customerPhone).repairs.push(r);
    });
    return Array.from(map.values());
  }, [repairs]);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter((c) => {
      const matchSearch =
        !q ||
        c.customerName.toLowerCase().includes(q) ||
        c.customerPhone.toLowerCase().includes(q) ||
        (c.customerEmail && c.customerEmail.toLowerCase().includes(q)) ||
        c.repairs.some((r) =>
          [r.repairNumber, r.deviceModel, getTechnicianName(r)].some((val) =>
            val?.toLowerCase().includes(q)
          )
        );

      const matchStatus =
        statusFilter === "ALL" ||
        c.repairs.some(
          (r) => String(r.status || "").toLowerCase() === statusFilter.toLowerCase()
        );

      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter, technicians]);

  const getLatestRepair = (c) =>
    c.repairs.length
      ? [...c.repairs].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )[0]
      : null;

  const getStatusClass = (status) =>
    status ? `rc-status-${String(status).toLowerCase().replaceAll(" ", "-")}` : "rc-status-default";

  const getStatusLabel = (status) =>
    status ? String(status).replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Received";

  const openReceipt = (repairItem, fallbackCustomer = {}) => {
    if (!repairItem) return;
    setSelectedInvoice({
      ...repairItem,
      customerName: repairItem.customerName || fallbackCustomer.customerName || "Customer",
      customerPhone: repairItem.customerPhone || fallbackCustomer.customerPhone || "N/A",
      customerEmail: repairItem.customerEmail || fallbackCustomer.customerEmail || "",
      technicianName: getTechnicianName(repairItem),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rc-dashboard">
      <header className="rc-header no-print">
        <div className="rc-header-titles">
          <span className="rc-eyebrow">Repair Operations</span>
          <h1>Repair Service Registry</h1>
          <p>Monitor customer equipment intake, workshop assignments, and job tickets.</p>
        </div>
        <button
          type="button"
          className="rc-btn rc-btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <FiPlus /> <span>New Repair Job</span>
        </button>
      </header>

      {/* STATS SECTION */}
      <section className="rc-stats-grid no-print">
        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-blue"><FiUser /></div>
          <div className="rc-stat-info">
            <span className="rc-stat-label">Total Customers</span>
            <strong className="rc-stat-val">{customers.length}</strong>
          </div>
        </div>
        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-purple"><FiTool /></div>
          <div className="rc-stat-info">
            <span className="rc-stat-label">Total Repairs</span>
            <strong className="rc-stat-val">{repairs.length}</strong>
          </div>
        </div>
        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-amber"><FiClock /></div>
          <div className="rc-stat-info">
            <span className="rc-stat-label">Pending / Received</span>
            <strong className="rc-stat-val">
              {repairs.filter((r) => !r.status || String(r.status).toLowerCase() === "received").length}
            </strong>
          </div>
        </div>
        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-emerald"><FiCheckCircle /></div>
          <div className="rc-stat-info">
            <span className="rc-stat-label">Delivered & Closed</span>
            <strong className="rc-stat-val">
              {repairs.filter((r) => ["delivered", "completed"].includes(String(r.status).toLowerCase())).length}
            </strong>
          </div>
        </div>
      </section>

      {/* DIRECTORY SECTION */}
      <section className="rc-main-card no-print">
        <div className="rc-card-toolbar">
          <div className="rc-search-wrap">
            <FiSearch className="rc-search-ico" />
            <input
              type="text"
              placeholder="Search customer, phone, device, ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="rc-btn-clear"
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="rc-toolbar-actions">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rc-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              className="rc-btn rc-btn-secondary"
              onClick={fetchRepairs}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? "rc-spin" : ""} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rc-state-box">
            <div className="rc-spinner"></div>
            <p>Loading database records...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="rc-state-box">
            <div className="rc-empty-ico"><FiInbox /></div>
            <h3>No Customer Records Found</h3>
            <p>Adjust your search filters or register a new repair ticket.</p>
            <button
              type="button"
              className="rc-btn rc-btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <FiPlus /> New Ticket
            </button>
          </div>
        ) : (
          <div className="rc-table-scroll">
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact Info</th>
                  <th>Workloads</th>
                  <th>Latest Ticket</th>
                  <th>Assigned Tech</th>
                  <th>Status</th>
                  <th className="rc-th-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const latestRepair = getLatestRepair(customer);
                  return (
                    <tr key={customer.customerPhone}>
                      <td>
                        <div className="rc-cell-user">
                          <div className="rc-avatar">
                            {customer.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{customer.customerName}</strong>
                            <span>Client ID: {customer.customerPhone.slice(-4)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="rc-contact-block">
                          <span className="rc-phone-chip"><FiPhone /> {customer.customerPhone}</span>
                          {customer.customerEmail && (
                            <span className="rc-email-sub">{customer.customerEmail}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="rc-badge-count">
                          {customer.repairs.length} {customer.repairs.length === 1 ? "Job" : "Jobs"}
                        </span>
                      </td>
                      <td>
                        <div className="rc-ticket-col">
                          <span className="rc-ticket-id">{latestRepair?.repairNumber || "TICKET-NEW"}</span>
                          <span className="rc-device-tag">{latestRepair?.deviceModel || latestRepair?.laptopModel || "Standard Device"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="rc-tech-tag">
                          <FiUserCheck /> {getTechnicianName(latestRepair)}
                        </span>
                      </td>
                      <td>
                        <span className={`rc-status-pill ${getStatusClass(latestRepair?.status)}`}>
                          {getStatusLabel(latestRepair?.status)}
                        </span>
                      </td>
                      <td className="rc-td-right">
                        <div className="rc-table-actions-group">
                          <button
                            type="button"
                            className="rc-btn-action"
                            onClick={() => setSelectedCustomer(customer)}
                            title="View customer timeline & history"
                          >
                            <FiEye /> <span>View</span>
                          </button>

                          <button
                            type="button"
                            className="rc-btn-action rc-btn-receipt"
                            onClick={() => openReceipt(latestRepair, customer)}
                            title="View and print invoice receipt"
                          >
                            <FiPrinter /> <span>Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* NEW REPAIR INTAKE MODAL */}
      {showAddForm && (
        <div
          className="rc-modal-overlay no-print"
          onMouseDown={(e) => e.target === e.currentTarget && setShowAddForm(false)}
        >
          <div className="rc-modal-box">
            <div className="rc-modal-top">
              <div>
                <span className="rc-eyebrow">Intake Form</span>
                <h2>New Repair Intake</h2>
                <p>Register client details, hardware model, and issue diagnosis.</p>
              </div>
              <button
                type="button"
                className="rc-btn-close"
                onClick={() => setShowAddForm(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateRepair} className="rc-form-stack">
              <div className="rc-field-group">
                <span className="rc-group-title">Client Details</span>
                <div className="rc-grid-2">
                  <div className="rc-input-field">
                    <label>Customer Full Name <span>*</span></label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      required
                    />
                  </div>
                  <div className="rc-input-field">
                    <label>Phone Number <span>*</span></label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="rc-grid-2" style={{ marginTop: "1rem" }}>
                  <div className="rc-input-field">
                    <label>Customer Email <span>*</span></label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={form.customerEmail}
                      onChange={handleChange}
                      placeholder="e.g. aarav@example.com"
                      required
                    />
                  </div>
                  <div className="rc-input-field">
                    <label>Estimated Completion Date</label>
                    <input
                      type="date"
                      name="estimatedCompletionDate"
                      value={form.estimatedCompletionDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="rc-field-group">
                <span className="rc-group-title">Device & Service Details</span>
                <div className="rc-grid-3">
                  <div className="rc-input-field">
                    <label>Device / Hardware Model <span>*</span></label>
                    <input
                      type="text"
                      name="deviceModel"
                      value={form.deviceModel}
                      onChange={handleChange}
                      placeholder="e.g. ThinkPad E14 Gen 4"
                      required
                    />
                  </div>

                  <div className="rc-input-field">
                    <label>Estimated Cost (₹)</label>
                    <input
                      type="number"
                      name="repairCost"
                      value={form.repairCost}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>

                  <div className="rc-input-field">
                    <label>Assign Workshop Tech</label>
                    <select
                      name="assignedTechnician"
                      value={form.assignedTechnician}
                      onChange={handleTechnicianChange}
                      className="rc-select"
                    >
                      <option value="">-- Unassigned --</option>
                      {technicians.map((tech) => (
                        <option key={tech._id} value={tech._id}>
                          {resolveTechName(tech)} {tech.email ? `(${tech.email})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rc-input-field" style={{ marginTop: "1rem" }}>
                  <label>Reported Issue Description <span>*</span></label>
                  <textarea
                    name="issueDescription"
                    rows="3"
                    value={form.issueDescription}
                    onChange={handleChange}
                    placeholder="Describe failure symptoms, errors, liquid contact, etc."
                    required
                  />
                </div>

                <div className="rc-input-field" style={{ marginTop: "1rem" }}>
                  <label>Front-Desk / Physical Remarks</label>
                  <textarea
                    name="remarks"
                    rows="2"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Physical scratches, original power adapter included, password received..."
                  />
                </div>
              </div>

              <div className="rc-modal-footer">
                <button
                  type="button"
                  className="rc-btn rc-btn-secondary"
                  onClick={() => setShowAddForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rc-btn rc-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Registering Job..." : "Register Repair Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER TIMELINE MODAL */}
      {selectedCustomer && (
        <div
          className="rc-modal-overlay no-print"
          onMouseDown={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}
        >
          <div className="rc-modal-box rc-modal-large">
            <div className="rc-modal-top">
              <div>
                <span className="rc-eyebrow">Customer History</span>
                <h2>{selectedCustomer.customerName}</h2>
                <p>
                  <FiPhone style={{ verticalAlign: "middle" }} /> {selectedCustomer.customerPhone}
                  {selectedCustomer.customerEmail && ` • ${selectedCustomer.customerEmail}`}
                </p>
              </div>
              <button
                type="button"
                className="rc-btn-close"
                onClick={() => setSelectedCustomer(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="rc-history-content">
              <div className="rc-profile-badge">
                <div className="rc-avatar rc-avatar-lg">
                  {selectedCustomer.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedCustomer.customerName}</h3>
                  <span>Total Repair History: {selectedCustomer.repairs.length} Job(s)</span>
                </div>
              </div>

              <h4 className="rc-timeline-heading"><FiClock /> Workshop History Timeline</h4>

              <div className="rc-timeline-list">
                {selectedCustomer.repairs.map((repair) => (
                  <div className="rc-timeline-card" key={repair._id || Math.random()}>
                    <div className="rc-card-head">
                      <strong className="rc-badge-ref">{repair.repairNumber || "Ticket"}</strong>
                      <span className={`rc-status-pill ${getStatusClass(repair.status)}`}>
                        {getStatusLabel(repair.status)}
                      </span>
                    </div>

                    <div className="rc-grid-3 rc-meta-row">
                      <div>
                        <span className="rc-meta-lbl"><FiMonitor /> Hardware</span>
                        <strong className="rc-meta-txt">{repair.deviceModel || repair.laptopModel || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="rc-meta-lbl"><FiUserCheck /> Technician</span>
                        <strong className="rc-meta-txt">{getTechnicianName(repair)}</strong>
                      </div>
                      <div>
                        <span className="rc-meta-lbl"><FiDollarSign /> Repair Cost</span>
                        <strong className="rc-meta-txt">₹{Number(repair.repairCost || 0).toFixed(2)}</strong>
                      </div>
                    </div>

                    {repair.estimatedCompletionDate && (
                      <div className="rc-date-row">
                        <FiCalendar /> Estimated Completion: {new Date(repair.estimatedCompletionDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="rc-note-card">
                      <FiMessageSquare className="rc-note-ico" />
                      <div>
                        <strong>Problem Reported:</strong>
                        <p>{repair.issueDescription || "No issue details registered."}</p>
                      </div>
                    </div>

                    {repair.remarks && (
                      <div className="rc-note-card rc-note-muted">
                        <div>
                          <strong>Intake Remarks:</strong>
                          <p>{repair.remarks}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE DELIVERY INVOICE MODAL */}
      {selectedInvoice && (
        <div
          className="rc-modal-overlay"
          style={{ zIndex: 1250 }}
          onMouseDown={(e) =>
            e.target === e.currentTarget && setSelectedInvoice(null)
          }
        >
          <div className="rc-modal-box rc-receipt-modal-box">
            <div className="rc-modal-top no-print">
              <div>
                <span className="rc-eyebrow">Billing & Deliveries</span>
                <h2>Service Delivery Voucher</h2>
                <p>Official workshop repair diagnosis and bill summary</p>
              </div>
              <button
                type="button"
                className="rc-btn-close"
                onClick={() => setSelectedInvoice(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="trh-invoice-sheet" id="printable-receipt">
              <div className="invoice-header">
                <div>
                  <h1 className="brand-title">ZAID INFOTECH</h1>
                  <p className="brand-tagline">
                    Premium Hardware Repairs, Micro-Soldering & IT Solutions
                  </p>
                </div>
                <div className="invoice-badge-block">
                  <h3>SERVICE RECEIPT</h3>
                  <div>
                    Ticket:{" "}
                    <strong>
                      {selectedInvoice.repairNumber ||
                        selectedInvoice._id?.slice(-6).toUpperCase()}
                    </strong>
                  </div>
                  <div>
                    Date:{" "}
                    {new Date(
                      selectedInvoice.updatedAt ||
                        selectedInvoice.createdAt ||
                        Date.now()
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="invoice-parties-grid">
                <div className="party-card">
                  <span className="party-title">CUSTOMER DETAILS</span>
                  <strong className="party-name">{selectedInvoice.customerName}</strong>
                  <div className="party-sub">Phone: {selectedInvoice.customerPhone}</div>
                  {selectedInvoice.customerEmail && (
                    <div className="party-sub">Email: {selectedInvoice.customerEmail}</div>
                  )}
                </div>

                <div className="party-card">
                  <span className="party-title">HARDWARE REPAIRED</span>
                  <strong className="party-name">
                    {selectedInvoice.deviceModel ||
                      selectedInvoice.laptopModel ||
                      "Standard Device"}
                  </strong>
                  <div className="party-sub">
                    Technician: {selectedInvoice.technicianName || "Assigned Specialist"}
                  </div>
                  <div className="party-sub">
                    Status:{" "}
                    <span className="status-highlight">
                      {selectedInvoice.status || "Delivered"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="invoice-table-wrapper">
                <table className="invoice-data-table">
                  <thead>
                    <tr>
                      <th>Service / Problem Breakdown</th>
                      <th className="cell-right">Part (₹)</th>
                      <th className="cell-right">Labor (₹)</th>
                      <th className="cell-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedInvoice.services) &&
                    selectedInvoice.services.length > 0 ? (
                      selectedInvoice.services.map((srv, idx) => {
                        const part = Number(srv.partCost || 0);
                        const labor = Number(srv.laborCost || 0);
                        const itemTotal = Number(srv.totalCost ?? part + labor);
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{srv.serviceName || srv.name}</strong>
                              {srv.category && (
                                <span className="service-category-tag">
                                  {srv.category}
                                </span>
                              )}
                              {idx === 0 && selectedInvoice.issueDescription && (
                                <p className="invoice-service-note">
                                  Intake Issue: {selectedInvoice.issueDescription}
                                </p>
                              )}
                            </td>
                            <td className="cell-right">{part.toFixed(2)}</td>
                            <td className="cell-right">{labor.toFixed(2)}</td>
                            <td className="cell-right">{itemTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>
                          <strong>Repair Diagnostics & Technician Service</strong>
                          <p className="invoice-service-note">
                            {selectedInvoice.issueDescription || "General Hardware Issue"}
                          </p>
                        </td>
                        {/* Fallback to root item costs or 0.00 if part wasn't required */}
                        <td className="cell-right">
                          {Number(selectedInvoice.partCost || 0).toFixed(2)}
                        </td>
                        <td className="cell-right">
                          {Number(
                            selectedInvoice.laborCost ??
                              (Number(selectedInvoice.repairCost || 0) - Number(selectedInvoice.partCost || 0))
                          ).toFixed(2)}
                        </td>
                        <td className="cell-right">
                          {Number(selectedInvoice.repairCost || 0).toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {selectedInvoice.remarks && (
                      <tr className="remarks-row">
                        <td colSpan={3}>
                          <em>Intake Remarks: {selectedInvoice.remarks}</em>
                        </td>
                        <td className="cell-right">—</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th colSpan={3} className="cell-right grand-total-label">
                        Total Amount Due / Paid:
                      </th>
                      <th className="cell-right grand-total-val">
                        ₹{Number(selectedInvoice.repairCost || 0).toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="invoice-footer-clause">
                <p>Thank you for choosing Zaid Infotech.</p>
                <p>30 Days service warranty applies on replaced components and verified service repairs.</p>
              </div>
            </div>

            <div className="rc-modal-footer no-print">
              <button
                type="button"
                className="rc-btn rc-btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="rc-btn rc-btn-primary"
                onClick={handlePrint}
              >
                <FiPrinter /> Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairCustomer;