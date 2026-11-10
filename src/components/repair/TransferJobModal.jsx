import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import {
  getTechnicianList,
  transferRepairJob,
} from "../../services/repairJobService";

import {
  TRANSFER_REASONS,
  getPersonLabel,
} from "./repairHelpers";

import "./repairJobShared.css";

export default function TransferJobModal({
  repair,
  onClose,
  onDone,
}) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toTechnicianId, setToTechnicianId] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const currentId = String(
    repair?.assignedTechnician?._id ||
      repair?.assignedTechnician ||
      ""
  );

  const currentName =
    getPersonLabel(repair?.assignedTechnician) ||
    repair?.technicianName ||
    "Unassigned";

  const jobLabel =
    repair?.repairNumber ||
    String(repair?._id || "").slice(-6).toUpperCase();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const list = await getTechnicianList();

        if (active) setTechnicians(list);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load technicians"
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const options = useMemo(
    () =>
      technicians.filter(
        (tech) => String(tech._id) !== currentId
      ),
    [technicians, currentId]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!toTechnicianId) {
      return toast.error("Please select a technician.");
    }

    if (!reason) {
      return toast.error("Please select a transfer reason.");
    }

    if (note.trim().length < 3) {
      return toast.error(
        "Please write a transfer note (at least 3 characters)."
      );
    }

    try {
      setSaving(true);

      const response = await transferRepairJob(repair._id, {
        toTechnicianId,
        reason,
        note: note.trim(),
      });

      toast.success(
        response?.message || "Job transferred successfully."
      );

      if (onDone) onDone(response?.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Transfer failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rjx-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <form className="rjx-modal" onSubmit={handleSubmit}>
        <div className="rjx-modal-head">
          <div>
            <h3>Transfer / Reassign Job</h3>

            <p>
              Job: <strong>{jobLabel}</strong> •{" "}
              {repair?.deviceModel || "Device"}
            </p>
          </div>

          <button
            type="button"
            className="rjx-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="rjx-modal-stack">
          <div className="rjx-current">
            Current Technician: <strong>{currentName}</strong>
          </div>

          <div className="rjx-field">
            <label htmlFor="rjxToTechnician">
              Transfer To <span className="rjx-req">*</span>
            </label>

            <select
              id="rjxToTechnician"
              value={toTechnicianId}
              onChange={(e) => setToTechnicianId(e.target.value)}
              disabled={loading || saving}
              required
            >
              <option value="">
                {loading
                  ? "Loading technicians..."
                  : options.length === 0
                    ? "No other technician available"
                    : "-- Select Technician --"}
              </option>

              {options.map((tech) => (
                <option
                  key={tech._id}
                  value={tech._id}
                  disabled={tech.isOnLeave === true}
                >
                  {getPersonLabel(tech) || "Technician"}
                  {tech.isOnLeave ? " (On Leave)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="rjx-field">
            <label htmlFor="rjxReason">
              Reason <span className="rjx-req">*</span>
            </label>

            <select
              id="rjxReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={saving}
              required
            >
              <option value="">-- Select Reason --</option>

              {TRANSFER_REASONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rjx-field">
            <label htmlFor="rjxNote">
              Transfer Note <span className="rjx-req">*</span>
            </label>

            <textarea
              id="rjxNote"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={saving}
              maxLength={500}
              placeholder="Job ka status, ab tak kya kaam hua, aage kya karna hai..."
              required
            />

            <span className="rjx-hint">{note.length}/500</span>
          </div>
        </div>

        <div className="rjx-modal-actions">
          <button
            type="button"
            className="rjx-btn rjx-btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rjx-btn rjx-btn-primary"
            disabled={saving || loading}
          >
            {saving ? "Transferring..." : "Transfer Job"}
          </button>
        </div>
      </form>
    </div>
  );
}