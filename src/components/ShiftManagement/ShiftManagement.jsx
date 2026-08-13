import React, { useState, useEffect } from "react";
import { getShifts, createShift } from "../../services/shiftService.js"; 
import "./ShiftManagement.css";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 60,
    lateAllowedMinutes: 10,
    overtimeAllowed: true,
    description: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchShifts = async () => {
    try {
      const responseData = await getShifts();
      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.data?.records || responseData?.data || [];
      setShifts(data);
      console.log(shifts)
    } catch (err) {
      console.error("Error fetching shifts:", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Wrap shift data inside 'shift' object to match backend schema
//     const payload = {
//   name: formData.name.trim(),
//   startTime: formData.startTime,
//   endTime: formData.endTime,
//   breakDuration: Number(formData.breakDuration),
//   lateAllowedMinutes: Number(formData.lateAllowedMinutes),
//   overtimeAllowed: Boolean(formData.overtimeAllowed),
//   description: formData.description ? formData.description.trim() : "",
//   status: formData.status,
// };

//     try {
//       await createShift(payload);

//       // Reset form on success
//       setFormData({
//         name: "",
//         startTime: "09:00",
//         endTime: "18:00",
//         breakDuration: 60,
//         lateAllowedMinutes: 10,
//         overtimeAllowed: true,
//         description: "",
//         status: "ACTIVE",
//       });

//       fetchShifts(); // Refresh shift list table
//     } catch (err) {
//   console.error("Backend Error Detail:", err.response?.data || err);
//   const serverMessage =
//     err.response?.data?.message || "Failed to create shift. Check console.";
//   setError(serverMessage);
// }
//   };


const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  const payload = {
    name: formData.name.trim(),
    startTime: formData.startTime,
    endTime: formData.endTime,
    breakDuration: Number(formData.breakDuration),
    lateAllowedMinutes: Number(formData.lateAllowedMinutes),
    overtimeAllowed: Boolean(formData.overtimeAllowed),
    description: formData.description
      ? formData.description.trim()
      : "",
    status: formData.status,
  };

  try {
    await createShift(payload);

    // Reset form
    setFormData({
      name: "",
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      lateAllowedMinutes: 10,
      overtimeAllowed: true,
      description: "",
      status: "ACTIVE",
    });

    // Refresh list
    await fetchShifts();

  } catch (err) {
    console.error(
      "Backend Error Detail:",
      err.response?.data || err
    );

    const serverMessage =
      err.response?.data?.message ||
      "Failed to create shift. Check console.";

    setError(serverMessage);

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="shift-container">
      {/* FORM SECTION */}
      <div className="shift-card">
        <div className="shift-header">
          <h2 className="shift-heading">Create New Shift</h2>
          <span className="shift-subheading">Set timing and policy details</span>
        </div>

        {error && <div className="shift-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="shift-form-grid">
          {/* Shift Name */}
          <div className="shift-field-group">
            <label className="shift-label">Shift Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Morning Shift"
              value={formData.name}
              onChange={handleChange}
              required
              className="shift-input"
            />
          </div>

          {/* Start Time */}
          <div className="shift-field-group">
            <label className="shift-label">Start Time *</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="shift-input"
            />
          </div>

          {/* End Time */}
          <div className="shift-field-group">
            <label className="shift-label">End Time *</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="shift-input"
            />
          </div>

          {/* Break Duration */}
          <div className="shift-field-group">
            <label className="shift-label">Break Duration (Mins)</label>
            <input
              type="number"
              name="breakDuration"
              value={formData.breakDuration}
              onChange={handleChange}
              className="shift-input"
            />
          </div>

          {/* Late Allowed Minutes */}
          <div className="shift-field-group">
            <label className="shift-label">Late Grace Period (Mins)</label>
            <input
              type="number"
              name="lateAllowedMinutes"
              value={formData.lateAllowedMinutes}
              onChange={handleChange}
              className="shift-input"
            />
          </div>

          {/* Status */}
          <div className="shift-field-group">
            <label className="shift-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shift-select"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Description */}
          <div className="shift-field-group span-two">
            <label className="shift-label">Description</label>
            <input
              type="text"
              name="description"
              placeholder="e.g., Standard morning operational shift"
              value={formData.description}
              onChange={handleChange}
              className="shift-input"
            />
          </div>

          {/* Overtime Allowed Checkbox */}
          <div className="shift-checkbox-group">
            <input
              type="checkbox"
              name="overtimeAllowed"
              id="overtimeAllowed"
              checked={formData.overtimeAllowed}
              onChange={handleChange}
              className="shift-checkbox"
            />
            <label htmlFor="overtimeAllowed" className="shift-checkbox-label">
              Overtime Allowed
            </label>
          </div>

          {/* Submit Button */}
          <div className="shift-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="shift-submit-btn"
            >
              {loading ? "Saving..." : "Create Shift"}
            </button>
          </div>
        </form>
      </div>

      {/* SHIFT LIST TABLE */}
      <div className="shift-card">
        <div className="shift-header">
          <h2 className="shift-heading">Shift List</h2>
          <span className="shift-subheading">All existing company shifts</span>
        </div>

        <div className="shift-table-wrapper">
          <table className="shift-table">
            <thead>
              <tr>
                <th className="shift-th">Shift Name</th>
                <th className="shift-th">Timings</th>
                <th className="shift-th">Break</th>
                <th className="shift-th">Late Grace</th>
                <th className="shift-th">Overtime</th>
                <th className="shift-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="shift-empty-cell">
                    No shifts created yet.
                  </td>
                </tr>
              ) : (
                shifts.map((shift, idx) => (
                  <tr
                    key={shift._id || idx}
                    className={idx % 2 === 0 ? "shift-tr-even" : "shift-tr-odd"}
                  >
                    <td className="shift-td-name">{shift.name}</td>
                    <td className="shift-td-time">
                      {shift.startTime} – {shift.endTime}
                    </td>
                    <td className="shift-td">{shift.breakDuration} mins</td>
                    <td className="shift-td">{shift.lateAllowedMinutes} mins</td>
                    <td className="shift-td">
                      {shift.overtimeAllowed ? (
                        <span className="badge-success">Yes</span>
                      ) : (
                        <span className="badge-neutral">No</span>
                      )}
                    </td>
                    <td className="shift-td">
                      <span
                        className={
                          shift.status === "ACTIVE"
                            ? "badge-active"
                            : "badge-inactive"
                        }
                      >
                        {shift.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;