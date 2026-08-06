import axios from "axios";

// const API = "http://localhost:5000/api/salary";

const API = `${import.meta.env.VITE_API_URL}/salary`;


const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// ==============================
// Get All Employees Salary
// ==============================

export const getAllSalaryData = async () => {

    const { data } = await axios.get(

        `${API}/all-summary`,

        authHeader()

    );

    return data;

};

// ==============================
// Single Employee
// ==============================

export const getEmployeeSalary = async (employeeId) => {

    const { data } = await axios.get(

        `${API}/${employeeId}`,

        authHeader()

    );

    return data;

};

// ==============================
// Configure Salary
// ==============================

export const configSalaryDetails = async (

    employeeId,

    payload

) => {

    const { data } = await axios.post(

        `${API}/config/${employeeId}`,

        payload,

        authHeader()

    );

    return data;

};

// ==============================
// Salary Payment
// ==============================

export const updateSalaryPayment = async (

    employeeId,

    payload

) => {

    const { data } = await axios.put(

        `${API}/pay/${employeeId}`,

        payload,

        authHeader()

    );

    return data;

};

// ==============================
// Summary
// ==============================

export const getSalarySummary = async (

    employeeId

) => {

    const { data } = await axios.get(

        `${API}/summary/${employeeId}`,

        authHeader()

    );

    return data;

};

// ==============================
// Export Excel
// ==============================

export const exportSalaryExcel = async () => {

    const response = await axios.get(

        `${API}/export`,

        {

            ...authHeader(),

            responseType: "blob"

        }

    );

    const url = window.URL.createObjectURL(

        new Blob([response.data])

    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "Employee_Salary_List.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

};

// ==============================
// Print Salary Report
// ==============================

export const printSalaryReport = async () => {

    const { data } = await axios.get(

        `${API}/all-summary`,

        authHeader()

    );

    return data;

};


// ==============================
// Download PDF (Future Ready)
// ==============================

export const exportSalaryPDF = async () => {

    const response = await axios.get(

        `${API}/export-pdf`,

        {

            ...authHeader(),

            responseType: "blob"

        }

    );

    const url = window.URL.createObjectURL(

        new Blob([response.data])

    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "Employee_Salary_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

};