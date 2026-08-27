
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AttendanceManagement.css";

// const BASE_URL = "http://localhost:5000/api";

// const AdminAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceList, setAttendanceList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);

//   const [manualData, setManualData] = useState({
//     user: "",
//     employeeId: "",
//     date: new Date().toISOString().split("T")[0],
//     status: "PRESENT",
//     remark: ""
//   });

//   const [bioPunchData, setBioPunchData] = useState({
//     employeeId: "",
//     biometricId: ""
//   });

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, []);

//   const getAuthHeader = () => ({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   });

//   const fetchEmployees = async () => {
//     setLoadingEmployees(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/users/employees`, getAuthHeader());
//       const list = res.data?.data?.records || res.data?.data || res.data || [];
//       setEmployees(list);
//     } catch (err) {
//       console.error("Failed to load employees", err);
//     } finally {
//       setLoadingEmployees(false);
//     }
//   };

//   const fetchAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/newAttendance`, getAuthHeader());
//       setAttendanceList(res.data?.data || []);
//     } catch (err) {
//       console.error("Failed to load attendance list", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEmployeeSelect = (e) => {
//     const selectedUserId = e.target.value;
//     const selectedEmp = employees.find((emp) => emp._id === selectedUserId);

//     setManualData({
//       ...manualData,
//       user: selectedUserId,
//       employeeId: selectedEmp ? selectedEmp.employeeId || "EMP001" : ""
//     });
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();

//     if (!manualData.user) {
//       alert("Please select an employee.");
//       return;
//     }

//     const selectedEmp = employees.find((emp) => emp._id === manualData.user);

//     const payload = {
//       user: manualData.user,
//       employeeId: selectedEmp?.employeeId || manualData.employeeId || "EMP001",
//       date: new Date(manualData.date).toISOString(),
//       status: manualData.status,
//       attendanceMode: "MANUAL",
//       remark: manualData.remark || ""
//     };

//     try {
//       await axios.post(
//         `${BASE_URL}/newAttendance/manual`,
//         payload,
//         getAuthHeader()
//       );
//       alert("Manual attendance marked successfully!");
//       fetchAttendance();

//       setManualData({
//         user: "",
//         employeeId: "",
//         date: new Date().toISOString().split("T")[0],
//         status: "PRESENT",
//         remark: ""
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || err.response?.data?.error || "Error submitting attendance");
//     }
//   };

//   const handleBiometricPunch = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${BASE_URL}/newAttendance/biometric`,
//         {
//           employeeId: bioPunchData.employeeId,
//           biometricId: bioPunchData.biometricId || bioPunchData.employeeId,
//           punchTime: new Date().toISOString()
//         },
//         getAuthHeader()
//       );
//       alert("Biometric punch successful!");
//       fetchAttendance();
//       setBioPunchData({ employeeId: "", biometricId: "" });
//     } catch (err) {
//       alert(err.response?.data?.message || "Error processing biometric punch");
//     }
//   };

//   // const handleCheckout = async (userId) => {
//   //   try {
//   //     await axios.put(
//   //       `${BASE_URL}/newAttendance/checkout`,
//   //       {
//   //         user: userId,
//   //         checkoutTime: new Date().toISOString()
//   //       },
//   //       getAuthHeader()
//   //     );
//   //     alert("Checkout successful!");
//   //     fetchAttendance();
//   //   } catch (err) {
//   //     alert(err.response?.data?.message || "Error marking checkout");
//   //   }
//   // };

//   const handleCheckout = async (attendance) => {
//   try {
//     const payload = {
//       user: attendance.user?._id || attendance.user,
//       employeeId: attendance.employeeId,
//       date: attendance.date,
//       checkoutTime: new Date().toISOString()
//     };

//     console.log("CHECKOUT PAYLOAD =", payload);

//     await axios.put(
//       `${BASE_URL}/newAttendance/checkout`,
//       payload,
//       getAuthHeader()
//     );

//     alert("Checkout successful!");

//     fetchAttendance();

//   } catch (err) {
//     console.error(
//       "CHECKOUT ERROR =",
//       err.response?.data || err
//     );

//     alert(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Error marking checkout"
//     );
//   }
// };

//   return (
//     <div className="attendance-container">
//       <h2 className="attendance-title">Admin Attendance Dashboard</h2>

//       <div className="attendance-forms-wrapper">
//         <div className="attendance-card">
//           <h3>Mark Manual Attendance</h3>
//           <form onSubmit={handleManualSubmit}>
//             <div className="form-group">
//               <label>Choose Employee:</label>
//               <select
//                 className="form-control"
//                 value={manualData.user}
//                 onChange={handleEmployeeSelect}
//                 required
//               >
//                 <option value="">
//                   {loadingEmployees ? "Loading employees..." : "-- Choose Employee --"}
//                 </option>
//                 {employees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.firstName} {emp.lastName} ({emp.employeeId || "No ID"})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Date:</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={manualData.date}
//                 onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Status:</label>
//               <select
//                 className="form-control"
//                 value={manualData.status}
//                 onChange={(e) => setManualData({ ...manualData, status: e.target.value })}
//               >
//                 <option value="PRESENT">PRESENT</option>
//                 <option value="ABSENT">ABSENT</option>
//                 <option value="HALF_DAY">HALF_DAY</option>
//                 <option value="LEAVE">LEAVE</option>
//                 <option value="LATE">LATE</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Remark:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Optional remark"
//                 value={manualData.remark}
//                 onChange={(e) => setManualData({ ...manualData, remark: e.target.value })}
//               />
//             </div>

//             <button type="submit" className="btn-primary-green">
//               Submit Manual Attendance
//             </button>
//           </form>
//         </div>

//         <div className="attendance-card">
//           <h3>Virtual Biometric Machine Punch</h3>
//           <p>Simulates machine scan without hardware.</p>
//           <form onSubmit={handleBiometricPunch}>
//             <div className="form-group">
//               <label>Employee ID:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="e.g. EMP001"
//                 value={bioPunchData.employeeId}
//                 onChange={(e) => setBioPunchData({ ...bioPunchData, employeeId: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Biometric ID / Key:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="e.g. BIO123"
//                 value={bioPunchData.biometricId}
//                 onChange={(e) => setBioPunchData({ ...bioPunchData, biometricId: e.target.value })}
//               />
//             </div>

//             <button type="submit" className="btn-accent-green">
//               Simulate Biometric Scan
//             </button>
//           </form>
//         </div>
//       </div>

//       <h3>Attendance Records List</h3>
//       <div className="table-wrapper">
//         {loading ? (
//           <p className="no-data">Loading attendance records...</p>
//         ) : (
//           <table className="attendance-table">
//             <thead>
//               <tr>
//                 <th>User / Name</th>
//                 <th>Employee ID</th>
//                 <th>Date</th>
//                 <th>Mode</th>
//                 <th>Status</th>
//                 <th>Check-In</th>
//                 <th>Check-Out</th>
//                 <th>Working Hours</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceList.length > 0 ? (
//                 attendanceList.map((item) => (
//                   <tr key={item._id}>
//                     <td>
//                       {item.user?.firstName
//                         ? `${item.user.firstName} ${item.user.lastName || ""}`
//                         : item.user?.name || "N/A"}
//                     </td>
//                     <td>{item.employeeId || "N/A"}</td>
//                     <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
//                     <td>
//                       <span className="badge-mode">{item.attendanceMode || "MANUAL"}</span>
//                     </td>
//                     <td>{item.status}</td>
//                     <td>
//                       {item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}
//                     </td>
//                     <td>
//                       {item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}
//                     </td>
//                     <td>{item.workingHours || 0} hrs</td>
//                     <td>
//                       {!item.checkOut && (
//                         <button
//                           className="btn-danger"
//                           // onClick={() => handleCheckout(item.user?._id || item.user)}
//                            onClick={() => handleCheckout(item)}
//                         >
//                           Check-Out
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="no-data">
//                     No attendance records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAttendance;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendanceManagement.css";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminAttendance = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // ==========================================
  // MANUAL ATTENDANCE FORM
  // ==========================================

  const [manualData, setManualData] = useState({
    user: "",
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "PRESENT",
    remark: "",
  });

  // ==========================================
  // BIOMETRIC FORM
  // ==========================================

  const [bioPunchData, setBioPunchData] = useState({
    employeeId: "",
    biometricId: "",
  });

  // ==========================================
  // AUTH HEADER
  // ==========================================

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async () => {
    setLoadingEmployees(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/users/employees`,
        getAuthHeader()
      );

      console.log("Employees Response:", res.data);

      const list =
        res.data?.data?.records ||
        res.data?.data ||
        res.data ||
        [];

      setEmployees(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load employees:", err);

      console.error(
        "Employee API Error:",
        err.response?.data || err.message
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================

  const fetchAttendance = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/newAttendance`,
        getAuthHeader()
      );

      console.log("Attendance Response:", res.data);

      const list =
        res.data?.data ||
        res.data ||
        [];

      setAttendanceList(
        Array.isArray(list) ? list : []
      );
    } catch (err) {
      console.error(
        "Failed to load attendance:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // ==========================================
  // EMPLOYEE SELECT
  // ==========================================

  const handleEmployeeSelect = (e) => {
    const selectedUserId = e.target.value;

    const selectedEmp = employees.find(
      (emp) => emp._id === selectedUserId
    );

    setManualData((prev) => ({
      ...prev,
      user: selectedUserId,
      employeeId:
        selectedEmp?.employeeId || "",
    }));
  };

  // ==========================================
  // MANUAL ATTENDANCE SUBMIT
  // ==========================================

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!manualData.user) {
      alert("Please select an employee.");
      return;
    }

    const selectedEmp = employees.find(
      (emp) => emp._id === manualData.user
    );

    const payload = {
      user: manualData.user,

      employeeId:
        selectedEmp?.employeeId ||
        manualData.employeeId ||
        "EMP001",

      date: new Date(
        manualData.date
      ).toISOString(),

      status: manualData.status,

      attendanceMode: "MANUAL",

      remark: manualData.remark || "",
    };

    console.log(
      "MANUAL ATTENDANCE PAYLOAD:",
      payload
    );

    try {
      await axios.post(
        `${BASE_URL}/newAttendance/manual`,
        payload,
        getAuthHeader()
      );

      alert(
        "Manual attendance marked successfully!"
      );

      await fetchAttendance();

      // Reset form
      setManualData({
        user: "",
        employeeId: "",
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: "PRESENT",
        remark: "",
      });
    } catch (err) {
      console.error(
        "Manual attendance error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error submitting attendance"
      );
    }
  };

  // ==========================================
  // BIOMETRIC PUNCH
  // ==========================================

  const handleBiometricPunch = async (e) => {
    e.preventDefault();

    if (!bioPunchData.employeeId) {
      alert("Please enter Employee ID.");
      return;
    }

    const payload = {
      employeeId:
        bioPunchData.employeeId,

      biometricId:
        bioPunchData.biometricId ||
        bioPunchData.employeeId,

      punchTime:
        new Date().toISOString(),
    };

    console.log(
      "BIOMETRIC PAYLOAD:",
      payload
    );

    try {
      await axios.post(
        `${BASE_URL}/newAttendance/biometric`,
        payload,
        getAuthHeader()
      );

      alert(
        "Biometric punch successful!"
      );

      await fetchAttendance();

      setBioPunchData({
        employeeId: "",
        biometricId: "",
      });
    } catch (err) {
      console.error(
        "Biometric error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error processing biometric punch"
      );
    }
  };

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = async (attendance) => {
    try {
      const payload = {
        user:
          attendance.user?._id ||
          attendance.user,

        employeeId:
          attendance.employeeId,

        date:
          attendance.date,

        checkoutTime:
          new Date().toISOString(),
      };

      console.log(
        "CHECKOUT PAYLOAD:",
        payload
      );

      await axios.put(
        `${BASE_URL}/newAttendance/checkout`,
        payload,
        getAuthHeader()
      );

      alert("Checkout successful!");

      await fetchAttendance();
    } catch (err) {
      console.error(
        "CHECKOUT ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error marking checkout"
      );
    }
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  // ==========================================
  // EMPLOYEE NAME
  // ==========================================

  const getEmployeeName = (user) => {
    if (!user) {
      return "N/A";
    }

    if (
      user.firstName ||
      user.lastName
    ) {
      return `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();
    }

    if (user.name) {
      return user.name;
    }

    return "N/A";
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="attendance-container">

      {/* ======================================
          PAGE TITLE
      ====================================== */}

      <h2 className="attendance-title">
        Admin Attendance Dashboard
      </h2>

      {/* ======================================
          FORMS
      ====================================== */}

      <div className="attendance-forms-wrapper">

        {/* ====================================
            MANUAL ATTENDANCE
        ==================================== */}

        <div className="attendance-card">

          <h3>
            Mark Manual Attendance
          </h3>

          <form
            onSubmit={
              handleManualSubmit
            }
          >

            {/* EMPLOYEE */}

            <div className="form-group">

              <label>
                Choose Employee:
              </label>

              <select
                className="form-control"
                value={
                  manualData.user
                }
                onChange={
                  handleEmployeeSelect
                }
                required
              >

                <option value="">
                  {loadingEmployees
                    ? "Loading employees..."
                    : "-- Choose Employee --"}
                </option>

                {employees.map(
                  (emp) => (
                    <option
                      key={emp._id}
                      value={emp._id}
                    >
                      {emp.firstName}{" "}
                      {emp.lastName}{" "}
                      (
                      {emp.employeeId ||
                        "No ID"}
                      )
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DATE */}

            <div className="form-group">

              <label>
                Date:
              </label>

              <input
                type="date"
                className="form-control"
                value={
                  manualData.date
                }
                onChange={(e) =>
                  setManualData(
                    (prev) => ({
                      ...prev,
                      date:
                        e.target.value,
                    })
                  )
                }
                required
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status:
              </label>

              <select
                className="form-control"
                value={
                  manualData.status
                }
                onChange={(e) =>
                  setManualData(
                    (prev) => ({
                      ...prev,
                      status:
                        e.target.value,
                    })
                  )
                }
              >

                <option value="PRESENT">
                  PRESENT
                </option>

                <option value="ABSENT">
                  ABSENT
                </option>

                <option value="HALF_DAY">
                  HALF_DAY
                </option>

                <option value="LEAVE">
                  LEAVE
                </option>

                <option value="LATE">
                  LATE
                </option>

              </select>

            </div>

            {/* REMARK */}

            <div className="form-group">

              <label>
                Remark:
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Optional remark"
                value={
                  manualData.remark
                }
                onChange={(e) =>
                  setManualData(
                    (prev) => ({
                      ...prev,
                      remark:
                        e.target.value,
                    })
                  )
                }
              />

            </div>

            <button
              type="submit"
              className="btn-primary-green"
            >
              Submit Manual Attendance
            </button>

          </form>

        </div>

        {/* ====================================
            BIOMETRIC
        ==================================== */}

        <div className="attendance-card">

          <h3>
            Virtual Biometric Machine Punch
          </h3>

          <p>
            Simulates machine scan
            without hardware.
          </p>

          <form
            onSubmit={
              handleBiometricPunch
            }
          >

            {/* EMPLOYEE ID */}

            <div className="form-group">

              <label>
                Employee ID:
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. EMP001"
                value={
                  bioPunchData.employeeId
                }
                onChange={(e) =>
                  setBioPunchData(
                    (prev) => ({
                      ...prev,
                      employeeId:
                        e.target.value,
                    })
                  )
                }
                required
              />

            </div>

            {/* BIOMETRIC ID */}

            <div className="form-group">

              <label>
                Biometric ID / Key:
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. BIO123"
                value={
                  bioPunchData.biometricId
                }
                onChange={(e) =>
                  setBioPunchData(
                    (prev) => ({
                      ...prev,
                      biometricId:
                        e.target.value,
                    })
                  )
                }
              />

            </div>

            <button
              type="submit"
              className="btn-accent-green"
            >
              Simulate Biometric Scan
            </button>

          </form>

        </div>

      </div>

      {/* ======================================
          ATTENDANCE RECORDS
      ====================================== */}

      <h3 className="records-title">
        Attendance Records List
      </h3>

      <div className="table-wrapper">

        {loading ? (

          <p className="no-data">
            Loading attendance records...
          </p>

        ) : (

          <table className="attendance-table">

            <thead>

              <tr>

                <th>
                  User / Name
                </th>

                <th>
                  Employee ID
                </th>

                <th>
                  Date
                </th>

                <th>
                  Mode
                </th>

                <th>
                  Status
                </th>

                <th>
                  Check-In
                </th>

                <th>
                  Check-Out
                </th>

                <th>
                  Working Hours
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {attendanceList.length >
              0 ? (

                attendanceList.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      {/* NAME */}

                      <td>
                        {getEmployeeName(
                          item.user
                        )}
                      </td>

                      {/* EMPLOYEE ID */}

                      <td>
                        {item.employeeId ||
                          "N/A"}
                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(
                          item.date
                        )}
                      </td>

                      {/* MODE */}

                      <td>

                        <span className="badge-mode">
                          {item.attendanceMode ||
                            "MANUAL"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>
                        {item.status ||
                          "N/A"}
                      </td>

                      {/* CHECK IN */}

                      <td>
                        {formatTime(
                          item.checkIn
                        )}
                      </td>

                      {/* CHECK OUT */}

                      <td>
                        {formatTime(
                          item.checkOut
                        )}
                      </td>

                      {/* WORKING HOURS */}

                      <td>
                        {item.workingHours ||
                          0}{" "}
                        hrs
                      </td>

                      {/* ACTION */}

                      <td>

                        {!item.checkOut && (
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() =>
                              handleCheckout(
                                item
                              )
                            }
                          >
                            Check-Out
                          </button>
                        )}

                        {item.checkOut && (
                          <span className="checkout-done">
                            Completed
                          </span>
                        )}

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="no-data"
                  >
                    No attendance
                    records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default AdminAttendance;