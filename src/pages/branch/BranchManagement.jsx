
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./BranchManagement.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const BRANCH_API = `${API_URL}/branches`;

const EMPTY_FORM = {
  name: "",
  code: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gstin: "",
  status: "ACTIVE",
};

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const BranchManagement = () => {
  const user = getUser();
  const role = String(user?.role || "").toUpperCase();
  const canManage = ["SUPER_ADMIN", "ADMIN", "SALES"].includes(role);

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [deleteLoading, setDeleteLoading] = useState("");

  const getHeaders = useCallback(() => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  }), []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(BRANCH_API, {
        headers: getHeaders(),
      });

      const result = response?.data?.data;
      setBranches(Array.isArray(result) ? result : []);
    } catch (error) {
      showMessage("error", getErrorMessage(error));
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    if (canManage) fetchBranches();
    else setLoading(false);
  }, [canManage, fetchBranches]);

  const filteredBranches = useMemo(() => {
    const term = search.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesSearch =
        !term ||
        [
          branch.name,
          branch.code,
          branch.phone,
          branch.email,
          branch.city,
          branch.state,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === "ALL" || branch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [branches, search, statusFilter]);

  const openAddModal = () => {
    setEditingBranch(null);
    setForm({ ...EMPTY_FORM });
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name || "",
      code: branch.code || "",
      phone: branch.phone || "",
      email: branch.email || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      pincode: branch.pincode || "",
      gstin: branch.gstin || "",
      status: branch.status || "ACTIVE",
    });
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingBranch(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "code" || name === "gstin"
          ? value.toUpperCase()
          : value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter branch name.";
    if (form.name.trim().length < 2) {
      return "Branch name must contain at least 2 characters.";
    }

    if (!form.code.trim()) return "Please enter branch code.";

    if (!/^[A-Z0-9_-]+$/.test(form.code.trim().toUpperCase())) {
      return "Branch code can contain only letters, numbers, _ and -.";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showMessage("error", validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        gstin: form.gstin.trim().toUpperCase(),
      };

      if (editingBranch?._id) {
        await axios.put(
          `${BRANCH_API}/${editingBranch._id}`,
          payload,
          { headers: getHeaders() }
        );

        showMessage("success", "Branch updated successfully.");
      } else {
        await axios.post(BRANCH_API, payload, {
          headers: getHeaders(),
        });

        showMessage("success", "Branch created successfully.");
      }

      setModalOpen(false);
      setEditingBranch(null);
      setForm({ ...EMPTY_FORM });

      await fetchBranches();
    } catch (error) {
      showMessage("error", getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (branch) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${branch.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(branch._id);

      await axios.delete(`${BRANCH_API}/${branch._id}`, {
        headers: getHeaders(),
      });

      showMessage("success", "Branch deleted successfully.");
      await fetchBranches();
    } catch (error) {
      showMessage("error", getErrorMessage(error));
    } finally {
      setDeleteLoading("");
    }
  };

  if (!canManage) {
    return (
      <div className="branch-page">
        <div className="branch-access-denied">
          <h2>Access Denied</h2>
          <p>Only Admin and Sales users can manage branches.</p>
        </div>
      </div>
    );
  }

  const activeCount = branches.filter(
    (branch) => branch.status === "ACTIVE"
  ).length;

  const inactiveCount = branches.filter(
    (branch) => branch.status === "INACTIVE"
  ).length;

  return (
    <div className="branch-page">
      <div className="branch-page-header">
        <div>
          <span className="branch-eyebrow">ORGANIZATION SETTINGS</span>
          <h1>Branch Management</h1>
          <p>Manage your company branches and their contact details.</p>
        </div>

        <button
          type="button"
          className="branch-primary-btn"
          onClick={openAddModal}
        >
          <span>＋</span> Add New Branch
        </button>
      </div>

      {message.text && (
        <div className={`branch-alert ${message.type}`}>
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      <div className="branch-stats">
        <div className="branch-stat-card">
          <div className="branch-stat-icon total">🏢</div>
          <div>
            <span>Total Branches</span>
            <strong>{branches.length}</strong>
          </div>
        </div>

        <div className="branch-stat-card">
          <div className="branch-stat-icon active">✓</div>
          <div>
            <span>Active Branches</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="branch-stat-card">
          <div className="branch-stat-icon inactive">Ⅱ</div>
          <div>
            <span>Inactive Branches</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      <div className="branch-content-card">
        <div className="branch-toolbar">
          <div>
            <h2>All Branches</h2>
            <p>View and manage your registered branches.</p>
          </div>

          <div className="branch-filters">
            <div className="branch-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search name, code, city..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button
              type="button"
              className="branch-refresh-btn"
              onClick={fetchBranches}
              title="Refresh branches"
            >
              ↻
            </button>
          </div>
        </div>

        {loading ? (
          <div className="branch-loading">
            <div className="branch-spinner" />
            <p>Loading branches...</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="branch-empty">
            <div>🏢</div>
            <h3>No branches found</h3>
            <p>
              {search || statusFilter !== "ALL"
                ? "Try changing your search or filter."
                : "Add your first branch to get started."}
            </p>
            {!search && statusFilter === "ALL" && (
              <button
                type="button"
                className="branch-primary-btn"
                onClick={openAddModal}
              >
                ＋ Add Branch
              </button>
            )}
          </div>
        ) : (
          <div className="branch-table-wrapper">
            <table className="branch-table">
              <thead>
                <tr>
                  <th>BRANCH</th>
                  <th>BRANCH CODE</th>
                  <th>CONTACT</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredBranches.map((branch) => (
                  <tr key={branch._id}>
                    <td>
                      <div className="branch-name-cell">
                        <div className="branch-avatar">
                          {(branch.name || "B").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{branch.name}</strong>
                          <small>{branch.email || "No email added"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="branch-code">
                        {branch.code}
                      </span>
                    </td>

                    <td>
                      <div className="branch-contact">
                        <span>{branch.phone || "—"}</span>
                        <small>{branch.email || "—"}</small>
                      </div>
                    </td>

                    <td>
                      <div className="branch-location">
                        <span>{branch.city || "—"}</span>
                        <small>
                          {[branch.state, branch.pincode]
                            .filter(Boolean)
                            .join(" - ") || "—"}
                        </small>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`branch-status ${
                          branch.status === "ACTIVE" ? "is-active" : "is-inactive"
                        }`}
                      >
                        {branch.status || "ACTIVE"}
                      </span>
                    </td>

                    <td>
                      <div className="branch-actions">
                        <button
                          type="button"
                          className="branch-edit-btn"
                          onClick={() => openEditModal(branch)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="branch-delete-btn"
                          disabled={deleteLoading === branch._id}
                          onClick={() => handleDelete(branch)}
                        >
                          {deleteLoading === branch._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="branch-table-footer">
          Showing {filteredBranches.length} of {branches.length} branches
        </div>
      </div>

      {modalOpen && (
        <div
          className="branch-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="branch-modal">
            <div className="branch-modal-header">
              <div>
                <span className="branch-eyebrow">
                  BRANCH CONFIGURATION
                </span>
                <h2>
                  {editingBranch ? "Edit Branch" : "Add New Branch"}
                </h2>
                <p>
                  {editingBranch
                    ? "Update branch information."
                    : "Enter the details to register a new branch."}
                </p>
              </div>

              <button
                type="button"
                className="branch-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="branch-form-section">
                <h3>Basic Information</h3>

                <div className="branch-form-grid">
                  <label className="branch-field">
                    Branch Name <span>*</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Zaid Infotech Thane"
                      maxLength={100}
                      required
                    />
                  </label>

                  <label className="branch-field">
                    Branch Code <span>*</span>
                    <input
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="e.g. THN001"
                      maxLength={20}
                      required
                    />
                  </label>

                  <label className="branch-field">
                    Phone Number
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      maxLength={20}
                    />
                  </label>

                  <label className="branch-field">
                    Email Address
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="branch@example.com"
                    />
                  </label>
                </div>
              </div>

              <div className="branch-form-section">
                <h3>Address Details</h3>

                <div className="branch-form-grid">
                  <label className="branch-field branch-field-full">
                    Full Address
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter complete branch address"
                      rows={3}
                      maxLength={500}
                    />
                  </label>

                  <label className="branch-field">
                    City
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </label>

                  <label className="branch-field">
                    State
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </label>

                  <label className="branch-field">
                    Pincode
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      maxLength={12}
                    />
                  </label>

                  <label className="branch-field">
                    GSTIN
                    <input
                      name="gstin"
                      value={form.gstin}
                      onChange={handleChange}
                      placeholder="Enter GSTIN (optional)"
                      maxLength={20}
                    />
                  </label>
                </div>
              </div>

              <div className="branch-form-section">
                <h3>Branch Status</h3>

                <label className="branch-field">
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="branch-modal-footer">
                <button
                  type="button"
                  className="branch-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="branch-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingBranch
                    ? "Update Branch"
                    : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
