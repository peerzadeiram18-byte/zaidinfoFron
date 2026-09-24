import React, { useState } from "react";
import "./CorporateSupport.css";

const DUMMY_TICKETS = [
  {
    id: 1,
    subject: "Wrong laptop model delivered",
    category: "Order Issue",
    status: "Open",
    date: "2026-09-20",
  },
  {
    id: 2,
    subject: "Invoice GST number incorrect",
    category: "Billing",
    status: "Resolved",
    date: "2026-09-15",
  },
  {
    id: 3,
    subject: "Delivery delayed for PO#1042",
    category: "Delivery",
    status: "In Progress",
    date: "2026-09-22",
  },
];

const CATEGORY_OPTIONS = ["Order Issue", "Delivery", "Billing", "Other"];

const CorporateSupport = () => {
  const [tickets, setTickets] = useState(DUMMY_TICKETS);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = {
      id: tickets.length + 1,
      subject,
      category,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };

    // TODO: replace with POST /api/support/tickets once backend is ready
    setTickets([newTicket, ...tickets]);

    setSubject("");
    setCategory(CATEGORY_OPTIONS[0]);
    setDescription("");
  };

  return (
    <div className="support-page">
      <h2 className="support-title">Support</h2>

      <form className="support-form" onSubmit={handleSubmit}>
        <div className="support-form-row">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        <div className="support-form-row">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="support-form-row">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue in detail"
            rows={4}
            required
          />
        </div>

        <button type="submit" className="support-submit-btn">
          Submit Ticket
        </button>
      </form>

      <h3 className="support-subtitle">Your Tickets</h3>

      <div className="support-table-wrapper">
        <table className="support-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.subject}</td>
                <td>{t.category}</td>
                <td>
                  <span
                    className={`status-badge status-${t.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorporateSupport;
