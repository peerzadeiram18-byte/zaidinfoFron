import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EmployeeShiftList.css";

const API_URL = import.meta.env.VITE_API_URL;

function EmployeeShiftList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==========================================
    // TOKEN
    // ==========================================

    const token = localStorage.getItem("token");

    // ==========================================
    // AUTH CONFIG
    // ==========================================

    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `${API_URL}/users/employees`,
                    getAuthConfig()
                );

                console.log(
                    "EMPLOYEE API RESPONSE:",
                    res.data
                );

                // ==========================================
                // HANDLE ALL POSSIBLE RESPONSE STRUCTURES
                // ==========================================

                const data =
                    res.data?.data?.records ||
                    res.data?.data ||
                    res.data?.employees ||
                    res.data ||
                    [];

                console.log(
                    "EMPLOYEE DATA:",
                    data
                );

                // ==========================================
                // DEBUG FIRST EMPLOYEE SHIFT
                // ==========================================

                if (Array.isArray(data) && data.length > 0) {
                    console.log(
                        "FIRST EMPLOYEE:",
                        data[0]
                    );

                    console.log(
                        "FIRST EMPLOYEE SHIFT:",
                        data[0]?.shift
                    );

                    console.log(
                        "FIRST EMPLOYEE SHIFT DETAILS:",
                        data[0]?.shiftDetails
                    );

                    console.log(
                        "FIRST EMPLOYEE ASSIGNED SHIFT:",
                        data[0]?.assignedShift
                    );
                }

                setEmployees(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {
                console.error(
                    "Employee fetch error:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to fetch employee shift assignments"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [token]);

    // ==========================================
    // EMPLOYEE NAME
    // ==========================================

    const getEmployeeName = (emp) => {
        const name = `${emp?.firstName || ""} ${
            emp?.lastName || ""
        }`.trim();

        return (
            name ||
            emp?.name ||
            "N/A"
        );
    };

    // ==========================================
    // GET SHIFT OBJECT
    // ==========================================
    /*
     * Your Shift schema contains:
     *
     * name
     * startTime
     * endTime
     *
     * Normally the employee should receive:
     *
     * shift: {
     *     _id,
     *     name,
     *     startTime,
     *     endTime
     * }
     *
     * This helper also keeps compatibility with
     * shiftDetails / assignedShift if another
     * existing API uses those names.
     */

    const getShiftObject = (employee) => {
        const shift =
            employee?.shiftDetails ||
            employee?.assignedShift ||
            employee?.shift ||
            null;

        return shift;
    };

    // ==========================================
    // CHECK WHETHER SHIFT IS ASSIGNED
    // ==========================================

    const hasShiftAssigned = (employee) => {
        const shift = getShiftObject(employee);

        if (!shift) {
            return false;
        }

        // Populated shift object
        if (typeof shift === "object") {
            return Boolean(
                shift?._id ||
                shift?.name ||
                shift?.shiftName ||
                shift?.title
            );
        }

        // ObjectId string
        if (typeof shift === "string") {
            return Boolean(shift);
        }

        return false;
    };

    // ==========================================
    // SHIFT NAME
    // ==========================================

    const getShiftName = (employee) => {
        const shift = getShiftObject(employee);

        if (!shift) {
            return "Not Assigned";
        }

        // ==========================================
        // POPULATED SHIFT
        // ==========================================

        if (
            typeof shift === "object" &&
            !Array.isArray(shift)
        ) {
            return (
                shift?.name ||
                shift?.shiftName ||
                shift?.title ||
                "Assigned"
            );
        }

        // ==========================================
        // ONLY OBJECT ID
        // ==========================================

        if (typeof shift === "string") {
            return "Assigned";
        }

        return "Not Assigned";
    };

    // ==========================================
    // GET SHIFT START TIME
    // ==========================================

    const getShiftStartTime = (employee) => {
        const shift = getShiftObject(employee);

        if (
            !shift ||
            typeof shift !== "object"
        ) {
            return null;
        }

        return (
            shift?.startTime ||
            shift?.start ||
            shift?.from ||
            shift?.timing?.startTime ||
            shift?.timing?.start ||
            null
        );
    };

    // ==========================================
    // GET SHIFT END TIME
    // ==========================================

    const getShiftEndTime = (employee) => {
        const shift = getShiftObject(employee);

        if (
            !shift ||
            typeof shift !== "object"
        ) {
            return null;
        }

        return (
            shift?.endTime ||
            shift?.end ||
            shift?.to ||
            shift?.timing?.endTime ||
            shift?.timing?.end ||
            null
        );
    };

    // ==========================================
    // FORMAT TIME
    // ==========================================
    /*
     * Keeps 09:00 / 18:00 exactly as backend sends.
     *
     * Also safely handles:
     * 09:00:00
     * 18:00:00
     */

    const formatTime = (time) => {
        if (!time) {
            return null;
        }

        const value = String(time).trim();

        if (!value) {
            return null;
        }

        // Keep HH:mm
        if (/^\d{2}:\d{2}$/.test(value)) {
            return value;
        }

        // Convert HH:mm:ss -> HH:mm
        if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
            return value.substring(0, 5);
        }

        return value;
    };

    // ==========================================
    // SHIFT TIMINGS
    // ==========================================

    const getShiftTimings = (employee) => {
        const shift = getShiftObject(employee);

        if (!shift) {
            return "Not Assigned";
        }

        // ==========================================
        // OBJECT ID ONLY
        // ==========================================

        if (typeof shift === "string") {
            return "Timing Not Available";
        }

        // ==========================================
        // POPULATED SHIFT OBJECT
        // ==========================================

        if (
            typeof shift === "object" &&
            !Array.isArray(shift)
        ) {
            const startTime =
                formatTime(
                    getShiftStartTime(employee)
                );

            const endTime =
                formatTime(
                    getShiftEndTime(employee)
                );

            // Both available
            if (
                startTime &&
                endTime
            ) {
                return `${startTime} - ${endTime}`;
            }

            // Only start
            if (startTime) {
                return `${startTime} - N/A`;
            }

            // Only end
            if (endTime) {
                return `N/A - ${endTime}`;
            }
        }

        return "Timing Not Available";
    };

    // ==========================================
    // CHECK WHETHER TIMING EXISTS
    // ==========================================

    const hasShiftTiming = (employee) => {
        const startTime =
            getShiftStartTime(employee);

        const endTime =
            getShiftEndTime(employee);

        return Boolean(
            startTime ||
            endTime
        );
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="employee-shift-page">

            <div className="employee-shift-card">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="shift-page-header">

                    <div>

                        <h2>
                            Employee Shift & Biometric Details
                        </h2>

                        <p>
                            View employee biometric information
                            and assigned shift timings
                        </p>

                    </div>

                    <div className="employee-count">
                        {employees.length} Employees
                    </div>

                </div>

                {/* ==========================================
                    LOADING
                ========================================== */}

                {loading ? (

                    <div className="shift-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading employees...
                        </p>

                    </div>

                ) : employees.length === 0 ? (

                    <div className="no-employees">

                        <h3>
                            No Employees Found
                        </h3>

                        <p>
                            There are no employees available
                            to display.
                        </p>

                    </div>

                ) : (

                    <div className="shift-table-wrapper">

                        <table className="shift-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Biometric ID
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Shift
                                    </th>

                                    <th>
                                        Shift Timings
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {employees.map(
                                    (emp, index) => {

                                        const shiftAssigned =
                                            hasShiftAssigned(emp);

                                        const timingAvailable =
                                            hasShiftTiming(emp);

                                        return (

                                            <tr
                                                key={
                                                    emp?._id ||
                                                    index
                                                }
                                            >

                                                {/* ==================================
                                                    SERIAL
                                                ================================== */}

                                                <td>

                                                    <span className="serial-number">
                                                        {index + 1}
                                                    </span>

                                                </td>

                                                {/* ==================================
                                                    EMPLOYEE
                                                ================================== */}

                                                <td>

                                                    <div className="employee-info">

                                                        <div className="employee-avatar">

                                                            {(
                                                                emp?.firstName?.[0] ||
                                                                emp?.name?.[0] ||
                                                                "E"
                                                            ).toUpperCase()}

                                                        </div>

                                                        <div className="employee-details">

                                                            <strong>
                                                                {getEmployeeName(
                                                                    emp
                                                                )}
                                                            </strong>

                                                            {emp?.email && (
                                                                <small>
                                                                    {emp.email}
                                                                </small>
                                                            )}

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* ==================================
                                                    BIOMETRIC
                                                ================================== */}

                                                <td>

                                                    {emp?.biometricId ? (

                                                        <span className="biometric-badge">
                                                            {emp.biometricId}
                                                        </span>

                                                    ) : (

                                                        <span className="not-available">
                                                            N/A
                                                        </span>

                                                    )}

                                                </td>

                                                {/* ==================================
                                                    DEPARTMENT
                                                ================================== */}

                                                <td>

                                                    <span className="department-text">

                                                        {emp?.department ||
                                                            "N/A"}

                                                    </span>

                                                </td>

                                                {/* ==================================
                                                    SHIFT
                                                ================================== */}

                                                <td>

                                                    <span
                                                        className={
                                                            shiftAssigned
                                                                ? "shift-badge"
                                                                : "shift-badge unassigned"
                                                        }
                                                    >

                                                        {getShiftName(
                                                            emp
                                                        )}

                                                    </span>

                                                </td>

                                                {/* ==================================
                                                    SHIFT TIMING
                                                ================================== */}

                                                <td>

                                                    <span
                                                        className={
                                                            timingAvailable
                                                                ? "timing-badge"
                                                                : "timing-badge unavailable"
                                                        }
                                                    >

                                                        {getShiftTimings(
                                                            emp
                                                        )}

                                                    </span>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default EmployeeShiftList;