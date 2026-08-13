import React, {
  useEffect,
  useState,
} from "react";

import {
  getEmployeeSalary,
  configSalaryDetails,
  updateSalaryPayment,
} from "../../../services/salary.api";

import "./SalaryModal.css";

import { toast } from "react-toastify";

const SalaryModal = ({
  employeeId,
  onClose,
}) => {

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("overview");

  const [salaryData, setSalaryData] =
    useState(null);

  // ==========================================
  // SALARY CONFIG FORM
  // ==========================================

  const [configForm, setConfigForm] =
    useState({
      salaryType: "MONTHLY",
      amount: "",
      joiningDate: "",
    });

  // ==========================================
  // PAYMENT FORM
  // ==========================================

  const [payForm, setPayForm] =
    useState({
      month: new Date().toLocaleString(
        "default",
        {
          month: "long",
          year: "numeric",
        }
      ),

      amount: "",

      paymentDate:
        new Date()
          .toISOString()
          .split("T")[0],

      paymentMode: "BANK",

      status: "PAID",

      remark: "",
    });

  // ==========================================
  // FETCH SALARY
  // ==========================================

  const fetchSalary = async () => {
    if (!employeeId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res =
        await getEmployeeSalary(
          employeeId
        );

      console.log(
        "Employee Salary:",
        res
      );

      if (!res?.success) {
        throw new Error(
          res?.message ||
            "Unable to load salary"
        );
      }

      const data = res?.data || {};

      setSalaryData(data);

      // ======================================
      // CONFIG FORM
      // ======================================

      setConfigForm({
        salaryType:
          data?.salaryDetails
            ?.salaryType ||
          "MONTHLY",

        amount:
          data?.salaryDetails
            ?.amount ?? "",

        joiningDate:
          data?.salaryDetails
            ?.joiningDate
            ? new Date(
                data.salaryDetails
                  .joiningDate
              )
                .toISOString()
                .split("T")[0]
            : "",
      });

      // ======================================
      // PAYMENT FORM
      // ======================================

      setPayForm((prev) => ({
        ...prev,

        amount:
          data?.salaryDetails
            ?.amount ?? "",
      }));

    } catch (err) {

      console.error(
        "Fetch salary error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to load salary.";

      setError(message);

      toast.error(message);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // EFFECT
  // ==========================================

  useEffect(() => {
    if (employeeId) {
      fetchSalary();
    }
  }, [employeeId]);

  // ==========================================
  // SALARY CONFIG
  // ==========================================

  const handleSalaryConfig = async (
    event
  ) => {

    event.preventDefault();

    try {

      const amount = Number(
        configForm.amount || 0
      );

      if (amount <= 0) {
        toast.error(
          "Please enter valid salary amount"
        );

        return;
      }

      await configSalaryDetails(
        employeeId,
        {
          salaryType:
            configForm.salaryType,

          amount,

          joiningDate:
            configForm.joiningDate,
        }
      );

      toast.success(
        "Salary Updated Successfully"
      );

      await fetchSalary();

      setActiveTab("overview");

    } catch (err) {

      console.error(
        "Salary config error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Update Failed"
      );

    }
  };

  // ==========================================
  // SALARY PAYMENT
  // ==========================================

  const handleSalaryPayment = async (
    event
  ) => {

    event.preventDefault();

    try {

      const amount = Number(
        payForm.amount || 0
      );

      if (amount <= 0) {

        toast.error(
          "Please enter valid salary amount"
        );

        return;
      }

      if (!payForm.month?.trim()) {

        toast.error(
          "Please enter salary month"
        );

        return;
      }

      if (!payForm.paymentDate) {

        toast.error(
          "Please select payment date"
        );

        return;
      }

      await updateSalaryPayment(
        employeeId,
        {
          month:
            payForm.month.trim(),

          amount,

          paymentDate:
            payForm.paymentDate,

          paymentMode:
            payForm.paymentMode,

          status:
            payForm.status,

          remark:
            payForm.remark?.trim() || "",
        }
      );

      toast.success(
        "Salary Paid Successfully"
      );

      await fetchSalary();

      setActiveTab("overview");

    } catch (err) {

      console.error(
        "Salary payment error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Payment Failed"
      );

    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="salary-modal-overlay">

        <div className="salary-modal">

          <div className="salary-loading">
            Loading Salary...
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // EMPLOYEE DATA
  // ==========================================

  const employeeName =
    salaryData?.name ||
    salaryData?.employeeName ||
    salaryData?.employee?.name ||
    "N/A";

  const email =
    salaryData?.email ||
    salaryData?.employee?.email ||
    "N/A";

  const salaryType =
    salaryData?.salaryDetails
      ?.salaryType ||
    "MONTHLY";

  const amount =
    Number(
      salaryData?.salaryDetails
        ?.amount || 0
    );

  const joiningDate =
    salaryData?.salaryDetails
      ?.joiningDate
      ? new Date(
          salaryData.salaryDetails
            .joiningDate
        ).toLocaleDateString(
          "en-IN"
        )
      : "-";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="salary-modal-overlay">

      <div className="salary-modal">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="salary-header">

          <h2>
            Employee Salary Management
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>

        </div>

        {/* ====================================
            EMPLOYEE CARD
        ==================================== */}

        <div className="employee-card">

          <h3>
            {employeeName}
          </h3>

          <p>
            {email}
          </p>

          <p>
            Joining: {joiningDate}
          </p>

          <p>
            Salary: ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </p>

          <p>
            Type: {salaryType}
          </p>

        </div>

        {/* ====================================
            TABS
        ==================================== */}

        <div className="salary-tabs">

          <button
            type="button"
            className={
              activeTab === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "overview"
              )
            }
          >
            Overview
          </button>

          <button
            type="button"
            className={
              activeTab === "payment"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "payment"
              )
            }
          >
            Add Payment
          </button>

          <button
            type="button"
            className={
              activeTab === "config"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "config"
              )
            }
          >
            Salary Structure
          </button>

        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (

          <div className="salary-error">

            {error}

          </div>

        )}

        {/* ====================================
            OVERVIEW
        ==================================== */}

        {activeTab === "overview" && (

          <div className="overview-section">

            <div className="summary-grid">

              <div className="summary-card">

                <h4>
                  Salary Type
                </h4>

                <h2>
                  {salaryType}
                </h2>

              </div>

              <div className="summary-card">

                <h4>
                  Base Salary
                </h4>

                <h2>
                  ₹
                  {amount.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>

              <div className="summary-card">

                <h4>
                  Total Paid
                </h4>

                <h2 className="green">

                  ₹
                  {Number(
                    salaryData?.totalPaidAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </h2>

              </div>

            </div>

            {/* ================================
                PAYMENT HISTORY
            ================================= */}

            <div className="history-title">
              Payment History
            </div>

            <div className="salary-history-wrapper">

              <table className="salary-history-table">

                <thead>

                  <tr>

                    <th>
                      Month
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Mode
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Comment
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {Array.isArray(
                    salaryData?.salaryHistory
                  ) &&
                  salaryData
                    .salaryHistory
                    .length > 0 ? (

                    salaryData.salaryHistory.map(
                      (item) => (

                        <tr
                          key={
                            item?._id ||
                            `${item?.month}-${item?.paymentDate}`
                          }
                        >

                          <td>
                            {item?.month ||
                              "-"}
                          </td>

                          <td>
                            ₹
                            {Number(
                              item?.amount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            {item?.paymentMode ||
                              "-"}
                          </td>

                          <td>
                            {item?.paymentDate
                              ? new Date(
                                  item.paymentDate
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}
                          </td>

                          <td>

                            <span
                              className={
                                item?.status ===
                                "PAID"
                                  ? "paid-badge"
                                  : "pending-badge"
                              }
                            >
                              {item?.status ||
                                "-"}
                            </span>

                          </td>

                          <td>

                            {item?.remark
                              ?.trim()
                              ? item.remark
                              : "-"}

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "30px",
                        }}
                      >
                        No Salary History Available
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ====================================
            PAYMENT
        ==================================== */}

        {activeTab === "payment" && (

          <form
            className="salary-form"
            onSubmit={
              handleSalaryPayment
            }
          >

            <div className="form-row">

              <div className="form-group">

                <label>
                  Month
                </label>

                <input
                  type="text"
                  value={
                    payForm.month
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      month:
                        event.target.value,
                    })
                  }
                  placeholder="August 2026"
                />

              </div>

              <div className="form-group">

                <label>
                  Salary Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    payForm.amount
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      amount:
                        event.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Payment Date
                </label>

                <input
                  type="date"
                  value={
                    payForm.paymentDate
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      paymentDate:
                        event.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Payment Mode
                </label>

                <select
                  value={
                    payForm.paymentMode
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      paymentMode:
                        event.target.value,
                    })
                  }
                >

                  <option value="BANK">
                    Bank
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CASH">
                    Cash
                  </option>

                </select>

              </div>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={
                    payForm.status
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      status:
                        event.target.value,
                    })
                  }
                >

                  <option value="PAID">
                    PAID
                  </option>

                  <option value="PENDING">
                    PENDING
                  </option>

                </select>

              </div>

            </div>

            <div className="form-group">

              <label>
                Comment
              </label>

              <textarea
                rows="3"
                value={
                  payForm.remark
                }
                onChange={(event) =>
                  setPayForm({
                    ...payForm,
                    remark:
                      event.target.value,
                  })
                }
                placeholder="Enter comment..."
              />

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Record Salary Payment
            </button>

          </form>

        )}

        {/* ====================================
            SALARY CONFIG
        ==================================== */}

        {activeTab === "config" && (

          <form
            className="salary-form"
            onSubmit={
              handleSalaryConfig
            }
          >

            <div className="form-group">

              <label>
                Salary Type
              </label>

              <select
                value={
                  configForm.salaryType
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    salaryType:
                      event.target.value,
                  })
                }
              >

                <option value="MONTHLY">
                  MONTHLY
                </option>

                <option value="DAILY">
                  DAILY
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Salary Amount
              </label>

              <input
                type="number"
                min="0"
                value={
                  configForm.amount
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    amount:
                      event.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>
                Joining Date
              </label>

              <input
                type="date"
                value={
                  configForm.joiningDate
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    joiningDate:
                      event.target.value,
                  })
                }
              />

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Update Salary Structure
            </button>

          </form>

        )}

      </div>

    </div>
  );
};

export default SalaryModal;