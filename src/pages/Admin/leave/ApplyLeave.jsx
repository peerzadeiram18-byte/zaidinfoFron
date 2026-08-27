import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applyLeave, getLeavePolicies } from "../../../services/leaveService";
import "./ApplyLeave.css";

const ApplyLeave = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);

      const response = await getLeavePolicies();

      const list = Array.isArray(response?.policies)
        ? response.policies
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const activePolicies = list.filter(
        (policy) => policy.isActive !== false
      );

      setPolicies(activePolicies);

      if (activePolicies.length > 0) {
        setFormData((prev) => ({
          ...prev,
          leaveType: activePolicies[0].leaveType,
        }));
      }
    } catch (error) {
      console.error("LOAD LEAVE POLICIES ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load leave policies."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) {
      return 0;
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    if (to < from) {
      return 0;
    }

    const difference =
      to.getTime() - from.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!formData.leaveType) {
      toast.warning("Please select leave type.");
      return;
    }

    if (!formData.fromDate) {
      toast.warning("Please select start date.");
      return;
    }

    if (!formData.toDate) {
      toast.warning("Please select end date.");
      return;
    }

    if (formData.toDate < formData.fromDate) {
      toast.warning(
        "End date cannot be before start date."
      );
      return;
    }

    if (!formData.reason.trim()) {
      toast.warning("Please enter leave reason.");
      return;
    }

    const totalDays = calculateDays();

    if (totalDays <= 0) {
      toast.warning("Invalid leave dates.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason.trim(),
      };

      console.log(
        "================================="
      );
      console.log("APPLY LEAVE");
      console.log("PAYLOAD:", payload);
      console.log("TOTAL DAYS:", totalDays);
      console.log(
        "================================="
      );

      const response = await applyLeave(payload);

      console.log(
        "APPLY LEAVE RESPONSE:",
        response
      );

      toast.success(
        response?.message ||
          "Leave request submitted successfully."
      );

      setFormData({
        leaveType:
          policies.length > 0
            ? policies[0].leaveType
            : "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } catch (error) {
      console.error(
        "APPLY LEAVE ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="apply-leave-page">
        <div className="apply-leave-loading">
          Loading leave policies...
        </div>
      </div>
    );
  }

  return (
    <div className="apply-leave-page">

      <div className="apply-leave-header">
        <div>
          <h1>Apply Leave</h1>

          <p>
            Submit a leave request for admin approval.
          </p>
        </div>
      </div>

      <div className="apply-leave-card">

        {policies.length === 0 ? (
          <div className="apply-leave-empty">
            <div className="apply-leave-empty-icon">
              📋
            </div>

            <h3>
              No Leave Policies Available
            </h3>

            <p>
              Leave policies have not been configured
              by the admin yet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* LEAVE TYPE */}

            <div className="apply-leave-form-group">

              <label>
                Leave Type
                <span>*</span>
              </label>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                disabled={saving}
                required
              >
                <option value="">
                  Select Leave Type
                </option>

                {policies.map((policy) => (
                  <option
                    key={policy._id}
                    value={policy.leaveType}
                  >
                    {policy.leaveType}
                    {" "}
                    (
                    {policy.yearlyLimit}
                    {" "}
                    days/year
                    )
                  </option>
                ))}
              </select>

            </div>

            {/* FROM DATE */}

            <div className="apply-leave-date-row">

              <div className="apply-leave-form-group">

                <label>
                  From Date
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

              </div>

              {/* TO DATE */}

              <div className="apply-leave-form-group">

                <label>
                  To Date
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || undefined}
                  disabled={saving}
                  required
                />

              </div>

            </div>

            {/* DAYS */}

            {calculateDays() > 0 && (
              <div className="apply-leave-days">

                <span>
                  Requested Days
                </span>

                <strong>
                  {calculateDays()} Days
                </strong>

              </div>
            )}

            {/* REASON */}

            <div className="apply-leave-form-group">

              <label>
                Reason
                <span>*</span>
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for leave..."
                rows="5"
                disabled={saving}
                required
              />

            </div>

            {/* ACTION */}

            <div className="apply-leave-actions">

              <button
                type="submit"
                className="apply-leave-submit-btn"
                disabled={saving}
              >
                {saving
                  ? "Submitting..."
                  : "Submit Leave Request"}
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default ApplyLeave;