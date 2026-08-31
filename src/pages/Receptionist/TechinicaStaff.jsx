 import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TechinicaStaff.css";

const TECHNICIAN_STAFF =
  "http://localhost:5000/api/newRepair/technicians";

const TechinicaStaff = () => {
  const [technicians, setTechnicians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(TECHNICIAN_STAFF);

      console.log("Technician Response:", res.data.technicians);

      setTechnicians(res.data.technicians || []);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Failed to load technicians."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const filteredStaff = technicians.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const fullName =
      `${item.firstName || ""} ${item.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(search) ||
      (item.email || "").toLowerCase().includes(search) ||
      (item.role || "").toLowerCase().includes(search) ||
      (item.designation || "").toLowerCase().includes(search) ||
      (item.department || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="technician-page">

      {/* Page Heading */}
      <div className="technician-page-header">
        <div>
          <h1>Technician Staff</h1>
          <p>
            Manage and view your service technician information.
          </p>
        </div>

        <div className="technician-count">
          <span>{technicians.length}</span>
          <small>Technicians</small>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="technician-card">

        {/* Card Header */}
        <div className="technician-card-header">

          <div className="technician-card-title">
            <div className="technician-icon">
              <span>👨‍🔧</span>
            </div>

            <div>
              <h2>Technicians</h2>
              <p>
                {filteredStaff.length} technician
                {filteredStaff.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="technician-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search technicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="technician-error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="technician-table-wrapper">

          {loading ? (
            <div className="technician-loading">
              <div className="loading-spinner"></div>
              <span>Loading technicians...</span>
            </div>
          ) : (
            <table className="technician-table">

              <thead>
                <tr>
                  <th className="sr-column">#</th>
                  <th>Technician</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Designation</th>
                  <th>Department</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((tech, index) => (
                    <tr key={tech._id}>

                      <td className="sr-column">
                        <span className="serial-number">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="technician-name">

                          <div className="technician-avatar">
                            {tech.firstName?.charAt(0)?.toUpperCase() ||
                              "T"}
                          </div>

                          <div className="name-info">
                            <strong>
                              {tech.firstName} {tech.lastName}
                            </strong>

                            <span>
                              Technician
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="email-text">
                          {tech.email || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="role-badge">
                          {tech.role || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="designation-text">
                          {tech.designation || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="department-text">
                          {tech.department || "-"}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-cell"
                    >
                      <div className="empty-state">

                        <div className="empty-icon">
                          👨‍🔧
                        </div>

                        <h3>
                          {searchTerm
                            ? "No technicians found"
                            : "No technicians available"}
                        </h3>

                        <p>
                          {searchTerm
                            ? `No technician matches "${searchTerm}".`
                            : "Technician records will appear here."}
                        </p>

                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                          >
                            Clear Search
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          )}

        </div>

        {/* Footer */}
        {!loading && filteredStaff.length > 0 && (
          <div className="technician-card-footer">
            <span>
              Showing{" "}
              <strong>{filteredStaff.length}</strong> of{" "}
              <strong>{technicians.length}</strong> technicians
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default TechinicaStaff;