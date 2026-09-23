// import React, { useEffect, useState } from "react";
// import { FaChartLine, FaMoneyBillWave, FaSyncAlt } from "react-icons/fa";
// import { financialReportApi, getApiError } from "../../services/accountingService";

// const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// export default function FinancialReports() {
//   const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
//   const [to, setTo] = useState(new Date().toISOString().slice(0,10));
//   const [data, setData] = useState(null);
//   const [methods, setMethods] = useState(null);
//   const [pending, setPending] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const load = async () => {
//     setLoading(true); setError("");
//     try {
//       const [summary, paymentMethods, pendingPayments] = await Promise.all([
//         financialReportApi.summary(from, to),
//         financialReportApi.paymentMethods(from, to),
//         financialReportApi.pendingPayments(),
//       ]);
//       setData(summary); setMethods(paymentMethods); setPending(pendingPayments);
//     } catch (e) { setError(getApiError(e)); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   return <div className="reports-page">
//     <style>{css}</style>
//     <div className="head"><div><h1>Financial Reports</h1><p>Sales, repair, rental collections, vendor payments, salary and net result.</p></div><button className="btn" onClick={load} disabled={loading}><FaSyncAlt/> {loading ? "Loading..." : "Refresh"}</button></div>
//     <div className="filters"><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label><button className="btn primary" onClick={load}>Apply</button></div>
//     {error && <div className="alert">{error}</div>}
//     {!data ? <div className="empty">Loading report...</div> : <>
//       <div className="cards">
//         <Card title="Sales Collection" value={data.collection?.sales} />
//         <Card title="Repair Collection" value={data.collection?.repair} />
//         <Card title="Rental Collection" value={data.collection?.rental} />
//         <Card title="Total Collection" value={data.collection?.total} />
//         <Card title="Vendor Payments" value={data.expenses?.vendorPayments} />
//         <Card title="Salary Paid" value={data.expenses?.salary} />
//         <Card title="Total Expenses" value={data.expenses?.total} />
//         <Card title="Net Result" value={data.result?.net} />
//       </div>
//       <div className="grid2">
//         <section className="panel"><h2><FaChartLine/> Sales Orders</h2><Row k="Total Orders" v={data.salesOrders?.totalOrders}/><Row k="Total Sales" v={money(data.salesOrders?.totalSales)}/><Row k="Online Sales" v={money(data.salesOrders?.onlineSales)}/><Row k="Walk-in Sales" v={money(data.salesOrders?.walkInSales)}/><Row k="Paid Amount" v={money(data.salesOrders?.paidAmount)}/><Row k="Pending Amount" v={money(data.salesOrders?.pendingAmount)}/></section>
//         <section className="panel"><h2><FaMoneyBillWave/> Payment Methods</h2><Row k="Cash" v={money(methods?.CASH)}/><Row k="Bank" v={money(methods?.BANK)}/><Row k="UPI" v={money(methods?.UPI)}/><Row k="Other" v={money(methods?.OTHER)}/></section>
//       </div>
//       <section className="panel"><h2>Pending Vendor Payments</h2><div className="pending-top"><strong>{money(pending?.totalPending)}</strong><span>{pending?.count || 0} purchase(s)</span></div>{pending?.purchases?.length ? <div className="table-wrap"><table><thead><tr><th>Purchase</th><th>Vendor</th><th>Total</th><th>Paid</th><th>Pending</th><th>Status</th></tr></thead><tbody>{pending.purchases.map(p=><tr key={p._id}><td>{p.purchaseNumber}</td><td>{p.vendorName}</td><td>{money(p.totalAmount)}</td><td>{money(p.paidAmount)}</td><td>{money(p.pendingAmount)}</td><td>{p.paymentStatus}</td></tr>)}</tbody></table></div>:<div className="empty">No pending vendor payments.</div>}</section>
//     </>}
//   </div>;
// }
// function Card({title,value}){return <div className="card"><span>{title}</span><strong>{money(value)}</strong></div>}
// function Row({k,v}){return <div className="row"><span>{k}</span><b>{v}</b></div>}
// const css=`
// .reports-page{padding:24px;background:#f7f9fc;min-height:100vh;font-family:Poppins,Arial,sans-serif;color:#172033}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.head h1{margin:0;font-size:28px}.head p{color:#718096;margin:6px 0}.filters{background:#fff;border:1px solid #e6eaf0;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:end;margin-bottom:18px}.filters label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600}.filters input{padding:9px;border:1px solid #d9dee7;border-radius:8px}.btn{border:0;border-radius:9px;padding:10px 15px;cursor:pointer;font-weight:700;display:inline-flex;gap:8px;align-items:center}.primary{background:#167c5a;color:#fff}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.card{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:17px}.card span{font-size:12px;color:#718096;display:block}.card strong{font-size:21px;display:block;margin-top:7px}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}.panel{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:18px;margin-bottom:18px}.panel h2{font-size:17px;margin:0 0 13px;display:flex;gap:8px;align-items:center}.row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #edf0f4;font-size:13px}.row:last-child{border:0}.pending-top{display:flex;gap:15px;align-items:baseline;margin-bottom:12px}.pending-top strong{font-size:24px}.pending-top span{color:#718096}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:700px}th,td{padding:11px;border-bottom:1px solid #edf0f4;text-align:left;font-size:13px}th{background:#fafbfc}.alert{background:#fff0f0;color:#b42318;padding:11px;border-radius:8px;margin-bottom:15px}.empty{text-align:center;padding:30px;color:#778294}@media(max-width:950px){.cards{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}}@media(max-width:600px){.head,.filters{flex-direction:column;align-items:stretch}.cards{grid-template-columns:1fr}}
// `;


import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaChartLine,
    FaMoneyBillWave,
    FaSyncAlt,
    FaTools,
    FaLaptop,
    FaShoppingCart,
    FaStore,
    FaCheckCircle,
    FaClock,
    FaGlobe,
    FaBoxOpen,
} from "react-icons/fa";

import {
    financialReportApi,
    getApiError,
} from "../../services/accountingService";

import "./FinancialReports.css";


// ======================================================
// MONEY
// ======================================================

const money = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
};


// ======================================================
// NUMBER
// ======================================================

const number = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
};


// ======================================================
// DATE
// ======================================================

const getCurrentMonthStart = () => {
    const date = new Date();

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    )
        .toISOString()
        .slice(0, 10);
};


const getToday = () => {
    return new Date()
        .toISOString()
        .slice(0, 10);
};


// ======================================================
// EMPTY OBJECTS
// ======================================================

const emptySales = {
    totalOrders: 0,
    totalSales: 0,
    onlineSales: 0,
    walkInSales: 0,
    onlineOrders: 0,
    walkInOrders: 0,
    paidAmount: 0,
    pendingAmount: 0,
};


const emptyRepair = {
    totalOrders: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
};


const emptyRental = {
    totalOrders: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
};


// ======================================================
// BASIC OBJECT CHECK
// ======================================================

const isObject = (value) => {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
};


// ======================================================
// NUMBER VALUE
// ======================================================

const toNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : 0;
};


// ======================================================
// GENERIC VALUE FINDER
// ======================================================

const getValue = (
    object,
    keys = [],
    fallback = 0
) => {
    if (!isObject(object)) {
        return fallback;
    }

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return fallback;
};


// ======================================================
// RESPONSE UNWRAPPER
//
// Supports:
// data
// data.data
// data.data.data
// response.data
// etc.
// ======================================================

const unwrap = (response) => {
    if (!response) {
        return {};
    }

    let current = response;

    for (let i = 0; i < 5; i++) {
        if (
            isObject(current) &&
            current.data !== undefined
        ) {
            current = current.data;
            continue;
        }

        break;
    }

    return current || {};
};


// ======================================================
// DEEP OBJECT FINDER
//
// This is important because different backend reports
// may return:
// {
//   salesOrders: {...}
// }
//
// or:
// {
//   sales: {...}
// }
//
// or:
// {
//   data: {
//      salesOrders: {...}
//   }
// }
// ======================================================

const findObjectByKeys = (
    source,
    keyGroups = [],
    maxDepth = 6
) => {
    if (!source || maxDepth < 0) {
        return null;
    }

    if (!isObject(source)) {
        return null;
    }

    const normalizedKeys = keyGroups.map((key) =>
        String(key).toLowerCase()
    );

    const sourceKeys = Object.keys(source).map((key) =>
        String(key).toLowerCase()
    );

    const hasAnyKey = normalizedKeys.some((key) =>
        sourceKeys.includes(key)
    );

    if (hasAnyKey) {
        return source;
    }

    for (const value of Object.values(source)) {
        if (!isObject(value)) {
            continue;
        }

        const found = findObjectByKeys(
            value,
            keyGroups,
            maxDepth - 1
        );

        if (found) {
            return found;
        }
    }

    return null;
};


// ======================================================
// SALES NORMALIZER
// ======================================================

const normalizeSales = (response) => {
    const root = unwrap(response);

    const data =
        findObjectByKeys(
            root,
            [
                "totalOrders",
                "orderCount",
                "totalSales",
                "onlineSales",
                "walkInSales",
                "walkinSales",
                "paidAmount",
                "pendingAmount",
            ]
        ) || root;


    const result = {
        totalOrders: toNumber(
            getValue(
                data,
                [
                    "totalOrders",
                    "orderCount",
                    "totalOrderCount",
                    "ordersCount",
                    "count",
                    "orders",
                ],
                0
            )
        ),

        totalSales: toNumber(
            getValue(
                data,
                [
                    "totalSales",
                    "totalAmount",
                    "grandTotal",
                    "sales",
                    "amount",
                    "collection",
                ],
                0
            )
        ),

        onlineSales: toNumber(
            getValue(
                data,
                [
                    "onlineSales",
                    "onlineAmount",
                    "onlineTotal",
                    "online",
                    "onlineCollection",
                ],
                0
            )
        ),

        walkInSales: toNumber(
            getValue(
                data,
                [
                    "walkInSales",
                    "walkinSales",
                    "walkInAmount",
                    "walkinAmount",
                    "walkInTotal",
                    "walkinTotal",
                    "walkIn",
                    "walkin",
                ],
                0
            )
        ),

        onlineOrders: toNumber(
            getValue(
                data,
                [
                    "onlineOrders",
                    "onlineOrderCount",
                    "onlineCount",
                ],
                0
            )
        ),

        walkInOrders: toNumber(
            getValue(
                data,
                [
                    "walkInOrders",
                    "walkinOrders",
                    "walkInOrderCount",
                    "walkinOrderCount",
                    "walkInCount",
                    "walkinCount",
                ],
                0
            )
        ),

        paidAmount: toNumber(
            getValue(
                data,
                [
                    "paidAmount",
                    "totalPaid",
                    "paid",
                    "collectedAmount",
                    "collectionAmount",
                ],
                0
            )
        ),

        pendingAmount: toNumber(
            getValue(
                data,
                [
                    "pendingAmount",
                    "totalPending",
                    "pending",
                    "dueAmount",
                    "remainingAmount",
                ],
                0
            )
        ),
    };


    // ==================================================
    // IF ORDER SOURCE TOTALS ARE MISSING
    // TRY CALCULATING TOTAL SALES
    // ==================================================

    if (
        result.totalSales === 0 &&
        (
            result.onlineSales > 0 ||
            result.walkInSales > 0
        )
    ) {
        result.totalSales =
            result.onlineSales +
            result.walkInSales;
    }


    // ==================================================
    // IF ORDER COUNT IS MISSING
    // TRY CALCULATING
    // ==================================================

    if (
        result.totalOrders === 0 &&
        (
            result.onlineOrders > 0 ||
            result.walkInOrders > 0
        )
    ) {
        result.totalOrders =
            result.onlineOrders +
            result.walkInOrders;
    }


    return result;
};


// ======================================================
// CHECK WHETHER SALES REPORT HAS REAL DATA
// ======================================================

const hasSalesData = (sales) => {
    if (!sales) {
        return false;
    }

    return (
        Number(sales.totalOrders || 0) > 0 ||
        Number(sales.totalSales || 0) > 0 ||
        Number(sales.onlineSales || 0) > 0 ||
        Number(sales.walkInSales || 0) > 0 ||
        Number(sales.onlineOrders || 0) > 0 ||
        Number(sales.walkInOrders || 0) > 0 ||
        Number(sales.paidAmount || 0) > 0 ||
        Number(sales.pendingAmount || 0) > 0
    );
};


// ======================================================
// MERGE SALES
//
// Detailed API first.
// Summary API fallback.
//
// This prevents working old values from becoming 0.
// ======================================================

const mergeSales = (
    detailed,
    summary
) => {

    const detailedHasData =
        hasSalesData(detailed);

    const summaryHasData =
        hasSalesData(summary);


    if (
        !detailedHasData &&
        summaryHasData
    ) {
        return {
            ...emptySales,
            ...summary,
        };
    }


    if (
        detailedHasData &&
        !summaryHasData
    ) {
        return {
            ...emptySales,
            ...detailed,
        };
    }


    if (
        detailedHasData &&
        summaryHasData
    ) {
        return {
            totalOrders:
                detailed.totalOrders > 0
                    ? detailed.totalOrders
                    : summary.totalOrders,

            totalSales:
                detailed.totalSales > 0
                    ? detailed.totalSales
                    : summary.totalSales,

            onlineSales:
                detailed.onlineSales > 0
                    ? detailed.onlineSales
                    : summary.onlineSales,

            walkInSales:
                detailed.walkInSales > 0
                    ? detailed.walkInSales
                    : summary.walkInSales,

            onlineOrders:
                detailed.onlineOrders > 0
                    ? detailed.onlineOrders
                    : summary.onlineOrders,

            walkInOrders:
                detailed.walkInOrders > 0
                    ? detailed.walkInOrders
                    : summary.walkInOrders,

            paidAmount:
                detailed.paidAmount > 0
                    ? detailed.paidAmount
                    : summary.paidAmount,

            pendingAmount:
                detailed.pendingAmount > 0
                    ? detailed.pendingAmount
                    : summary.pendingAmount,
        };
    }


    return {
        ...emptySales,
    };
};


// ======================================================
// REPAIR NORMALIZER
// ======================================================

const normalizeRepair = (response) => {

    const root = unwrap(response);

    const data =
        findObjectByKeys(
            root,
            [
                "totalOrders",
                "totalRepairs",
                "repairCount",
                "totalTickets",
                "totalJobs",
                "totalAmount",
                "totalRepairAmount",
                "repairCollection",
                "paidAmount",
                "pendingAmount",
            ]
        ) || root;


    return {

        totalOrders: toNumber(
            getValue(
                data,
                [
                    "totalOrders",
                    "totalRepairs",
                    "repairCount",
                    "totalTickets",
                    "totalJobs",
                    "count",
                ],
                0
            )
        ),

        totalAmount: toNumber(
            getValue(
                data,
                [
                    "totalAmount",
                    "totalRepairAmount",
                    "repairSales",
                    "repairCollection",
                    "totalCollection",
                    "collection",
                    "sales",
                    "amount",
                ],
                0
            )
        ),

        paidAmount: toNumber(
            getValue(
                data,
                [
                    "paidAmount",
                    "totalPaid",
                    "paid",
                    "collectedAmount",
                ],
                0
            )
        ),

        pendingAmount: toNumber(
            getValue(
                data,
                [
                    "pendingAmount",
                    "totalPending",
                    "pending",
                    "dueAmount",
                ],
                0
            )
        ),
    };
};


// ======================================================
// RENTAL NORMALIZER
// ======================================================

const normalizeRental = (response) => {

    const root = unwrap(response);

    const data =
        findObjectByKeys(
            root,
            [
                "totalOrders",
                "totalRentals",
                "rentalCount",
                "rentalOrders",
                "totalAmount",
                "totalRentalAmount",
                "rentalCollection",
                "paidAmount",
                "pendingAmount",
            ]
        ) || root;


    return {

        totalOrders: toNumber(
            getValue(
                data,
                [
                    "totalOrders",
                    "totalRentals",
                    "rentalCount",
                    "rentalOrders",
                    "count",
                ],
                0
            )
        ),

        totalAmount: toNumber(
            getValue(
                data,
                [
                    "totalAmount",
                    "totalRentalAmount",
                    "rentalSales",
                    "rentalCollection",
                    "totalCollection",
                    "collection",
                    "sales",
                    "amount",
                ],
                0
            )
        ),

        paidAmount: toNumber(
            getValue(
                data,
                [
                    "paidAmount",
                    "totalPaid",
                    "paid",
                    "collectedAmount",
                ],
                0
            )
        ),

        pendingAmount: toNumber(
            getValue(
                data,
                [
                    "pendingAmount",
                    "totalPending",
                    "pending",
                    "dueAmount",
                ],
                0
            )
        ),
    };
};


// ======================================================
// COMPONENT
// ======================================================

export default function FinancialReports() {

    const [from, setFrom] = useState(
        getCurrentMonthStart()
    );

    const [to, setTo] = useState(
        getToday()
    );

    const [data, setData] = useState(null);

    const [methods, setMethods] = useState({});

    const [pending, setPending] = useState(null);

    const [salesReport, setSalesReport] =
        useState(emptySales);

    const [repairReport, setRepairReport] =
        useState(emptyRepair);

    const [rentalReport, setRentalReport] =
        useState(emptyRental);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [reportErrors, setReportErrors] =
        useState([]);


    // ==================================================
    // LOAD ALL REPORTS
    // ==================================================

    const load = useCallback(async () => {

        setLoading(true);
        setError("");
        setReportErrors([]);


        try {

            const [
                summaryResult,
                methodsResult,
                pendingResult,
                salesResult,
                repairResult,
                rentalResult,
            ] = await Promise.allSettled([

                // ------------------------------------------
                // SUMMARY
                // ------------------------------------------

                financialReportApi.summary(
                    from,
                    to
                ),


                // ------------------------------------------
                // PAYMENT METHODS
                // ------------------------------------------

                financialReportApi.paymentMethods(
                    from,
                    to
                ),


                // ------------------------------------------
                // PENDING VENDOR PAYMENTS
                // ------------------------------------------

                financialReportApi.pendingPayments(),


                // ------------------------------------------
                // DETAILED SALES
                // ------------------------------------------

                typeof financialReportApi.sales === "function"
                    ? financialReportApi.sales(
                        from,
                        to
                    )
                    : Promise.reject(
                        new Error(
                            "Sales report API is not available"
                        )
                    ),


                // ------------------------------------------
                // DETAILED REPAIR
                // ------------------------------------------

                typeof financialReportApi.repair === "function"
                    ? financialReportApi.repair(
                        from,
                        to
                    )
                    : Promise.reject(
                        new Error(
                            "Repair report API is not available"
                        )
                    ),


                // ------------------------------------------
                // DETAILED RENTAL
                // ------------------------------------------

                typeof financialReportApi.rental === "function"
                    ? financialReportApi.rental(
                        from,
                        to
                    )
                    : Promise.reject(
                        new Error(
                            "Rental report API is not available"
                        )
                    ),
            ]);


            // ==================================================
            // SUMMARY
            // ==================================================

            let summaryData = {};


            if (
                summaryResult.status === "fulfilled"
            ) {

                summaryData =
                    unwrap(
                        summaryResult.value
                    );


                setData(
                    summaryData
                );

            } else {

                throw summaryResult.reason;
            }


            // ==================================================
            // IMPORTANT:
            // OLD WORKING SALES DATA
            //
            // Your old component was using:
            //
            // data.salesOrders
            //
            // So keep this as primary fallback.
            // ==================================================

            const summarySales =
                summaryData?.salesOrders ||
                summaryData?.sales ||
                summaryData?.orders ||
                {};


            const normalizedSummarySales =
                normalizeSales(
                    summarySales
                );


            // ==================================================
            // PAYMENT METHODS
            // ==================================================

            if (
                methodsResult.status === "fulfilled"
            ) {

                setMethods(
                    unwrap(
                        methodsResult.value
                    )
                );

            } else {

                setMethods({});
            }


            // ==================================================
            // PENDING
            // ==================================================

            if (
                pendingResult.status === "fulfilled"
            ) {

                setPending(
                    unwrap(
                        pendingResult.value
                    )
                );

            } else {

                setPending(null);
            }


            // ==================================================
            // SALES
            // ==================================================

            if (
                salesResult.status === "fulfilled"
            ) {

                const detailedSales =
                    normalizeSales(
                        salesResult.value
                    );


                const finalSales =
                    mergeSales(
                        detailedSales,
                        normalizedSummarySales
                    );


                setSalesReport(
                    finalSales
                );


            } else {

                // ------------------------------------------
                // DETAILED API FAILED
                // OLD SUMMARY DATA WILL STILL WORK
                // ------------------------------------------

                setSalesReport(
                    normalizedSummarySales
                );


                setReportErrors(
                    (old) => [
                        ...old,
                        "Detailed sales report unavailable. Existing sales summary data is being used.",
                    ]
                );
            }


            // ==================================================
            // REPAIR
            // ==================================================

            if (
                repairResult.status === "fulfilled"
            ) {

                const detailedRepair =
                    normalizeRepair(
                        repairResult.value
                    );


                const summaryRepair =
                    normalizeRepair(
                        summaryData?.repair ||
                        summaryData?.repairs ||
                        {}
                    );


                const finalRepair =
                    detailedRepair.totalOrders > 0 ||
                    detailedRepair.totalAmount > 0 ||
                    detailedRepair.paidAmount > 0 ||
                    detailedRepair.pendingAmount > 0
                        ? detailedRepair
                        : summaryRepair;


                setRepairReport(
                    finalRepair
                );

            } else {

                const summaryRepair =
                    normalizeRepair(
                        summaryData?.repair ||
                        summaryData?.repairs ||
                        {}
                    );


                setRepairReport(
                    summaryRepair
                );


                setReportErrors(
                    (old) => [
                        ...old,
                        "Detailed repair report unavailable. Existing repair summary data is being used.",
                    ]
                );
            }


            // ==================================================
            // RENTAL
            // ==================================================

            if (
                rentalResult.status === "fulfilled"
            ) {

                const detailedRental =
                    normalizeRental(
                        rentalResult.value
                    );


                const summaryRental =
                    normalizeRental(
                        summaryData?.rental ||
                        summaryData?.rentals ||
                        {}
                    );


                const finalRental =
                    detailedRental.totalOrders > 0 ||
                    detailedRental.totalAmount > 0 ||
                    detailedRental.paidAmount > 0 ||
                    detailedRental.pendingAmount > 0
                        ? detailedRental
                        : summaryRental;


                setRentalReport(
                    finalRental
                );

            } else {

                const summaryRental =
                    normalizeRental(
                        summaryData?.rental ||
                        summaryData?.rentals ||
                        {}
                    );


                setRentalReport(
                    summaryRental
                );


                setReportErrors(
                    (old) => [
                        ...old,
                        "Detailed rental report unavailable. Existing rental summary data is being used.",
                    ]
                );
            }


        } catch (err) {

            console.error(
                "FINANCIAL REPORT ERROR:",
                err
            );


            setError(
                getApiError(err)
            );

        } finally {

            setLoading(false);
        }

    }, [from, to]);


    // ==================================================
    // FIRST LOAD
    // ==================================================

    useEffect(() => {

        load();

    }, [load]);


    // ==================================================
    // FINAL REPORTS
    // ==================================================

    const sales =
        salesReport || emptySales;

    const repair =
        repairReport || emptyRepair;

    const rental =
        rentalReport || emptyRental;


    // ==================================================
    // COMBINED BUSINESS TOTAL
    // ==================================================

    const combined = useMemo(() => {

        return {

            totalOrders:
                Number(
                    sales.totalOrders || 0
                ) +
                Number(
                    repair.totalOrders || 0
                ) +
                Number(
                    rental.totalOrders || 0
                ),


            totalAmount:
                Number(
                    sales.totalSales || 0
                ) +
                Number(
                    repair.totalAmount || 0
                ) +
                Number(
                    rental.totalAmount || 0
                ),


            paidAmount:
                Number(
                    sales.paidAmount || 0
                ) +
                Number(
                    repair.paidAmount || 0
                ) +
                Number(
                    rental.paidAmount || 0
                ),


            pendingAmount:
                Number(
                    sales.pendingAmount || 0
                ) +
                Number(
                    repair.pendingAmount || 0
                ) +
                Number(
                    rental.pendingAmount || 0
                ),
        };

    }, [
        sales,
        repair,
        rental,
    ]);


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="reports-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="reports-header">

                <div>

                    <h1>
                        Financial Reports
                    </h1>

                    <p>
                        Product sales, walk-in sales,
                        repair, rental and collections.
                    </p>

                </div>


                <button
                    className="report-btn"
                    onClick={load}
                    disabled={loading}
                >

                    <FaSyncAlt
                        className={
                            loading
                                ? "spin"
                                : ""
                        }
                    />

                    {
                        loading
                            ? "Loading..."
                            : "Refresh"
                    }

                </button>

            </div>


            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="report-filters">

                <label>

                    <span>
                        From
                    </span>

                    <input
                        type="date"
                        value={from}
                        onChange={(e) =>
                            setFrom(
                                e.target.value
                            )
                        }
                    />

                </label>


                <label>

                    <span>
                        To
                    </span>

                    <input
                        type="date"
                        value={to}
                        onChange={(e) =>
                            setTo(
                                e.target.value
                            )
                        }
                    />

                </label>


                <button
                    className="report-btn primary"
                    onClick={load}
                    disabled={loading}
                >
                    Apply
                </button>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="report-alert">
                    {error}
                </div>

            )}


            {/* ==========================================
                WARNING
            ========================================== */}

            {reportErrors.length > 0 && (

                <div className="report-warning">

                    <strong>
                        Report Warning
                    </strong>

                    <ul>

                        {reportErrors.map(
                            (message, index) => (

                                <li key={index}>
                                    {message}
                                </li>

                            )
                        )}

                    </ul>

                </div>

            )}


            {!data ? (

                <div className="report-loading">
                    Loading financial report...
                </div>

            ) : (

                <>


                    {/* =====================================
                        COLLECTION CARDS
                    ===================================== */}

                    <div className="report-cards">

                        <FinancialCard
                            title="Sales Collection"
                            value={
                                data.collection?.sales
                            }
                            icon={
                                <FaShoppingCart />
                            }
                        />


                        <FinancialCard
                            title="Repair Collection"
                            value={
                                data.collection?.repair
                            }
                            icon={
                                <FaTools />
                            }
                        />


                        <FinancialCard
                            title="Rental Collection"
                            value={
                                data.collection?.rental
                            }
                            icon={
                                <FaLaptop />
                            }
                        />


                        <FinancialCard
                            title="Total Collection"
                            value={
                                data.collection?.total
                            }
                            icon={
                                <FaMoneyBillWave />
                            }
                        />


                        <FinancialCard
                            title="Vendor Payments"
                            value={
                                data.expenses?.vendorPayments
                            }
                        />


                        <FinancialCard
                            title="Salary Paid"
                            value={
                                data.expenses?.salary
                            }
                        />


                        <FinancialCard
                            title="Total Expenses"
                            value={
                                data.expenses?.total
                            }
                        />


                        <FinancialCard
                            title="Net Result"
                            value={
                                data.result?.net
                            }
                        />

                    </div>


                    {/* =====================================
                        BUSINESS TOTAL
                    ===================================== */}

                    <section className="report-panel business-total">

                        <div className="panel-title">

                            <div className="title-icon">
                                <FaChartLine />
                            </div>

                            <div>

                                <h2>
                                    All Business Transactions
                                </h2>

                                <p>
                                    Product + Walk-in + Repair + Rental
                                </p>

                            </div>

                        </div>


                        <div className="business-grid">

                            <MiniCard
                                title="Total Orders / Jobs"
                                value={
                                    number(
                                        combined.totalOrders
                                    )
                                }
                                icon={
                                    <FaChartLine />
                                }
                            />


                            <MiniCard
                                title="Total Business Amount"
                                value={
                                    money(
                                        combined.totalAmount
                                    )
                                }
                                icon={
                                    <FaMoneyBillWave />
                                }
                            />


                            <MiniCard
                                title="Paid Amount"
                                value={
                                    money(
                                        combined.paidAmount
                                    )
                                }
                                icon={
                                    <FaCheckCircle />
                                }
                            />


                            <MiniCard
                                title="Pending Amount"
                                value={
                                    money(
                                        combined.pendingAmount
                                    )
                                }
                                icon={
                                    <FaClock />
                                }
                            />

                        </div>

                    </section>


                    {/* =====================================
                        PRODUCT SALES
                    ===================================== */}

                    <section className="report-panel">

                        <div className="panel-title">

                            <div className="title-icon sales-icon">
                                <FaShoppingCart />
                            </div>

                            <div>

                                <h2>
                                    Product Sales
                                </h2>

                                <p>
                                    Online Orders + Walk-in Orders
                                </p>

                            </div>

                        </div>


                        <div className="sales-source-grid">


                            {/* ONLINE */}

                            <div className="source-card online-card">

                                <div className="source-icon">
                                    <FaGlobe />
                                </div>


                                <div className="source-content">

                                    <span>
                                        Online Sales
                                    </span>

                                    <strong>
                                        {money(
                                            sales.onlineSales
                                        )}
                                    </strong>

                                    <small>
                                        {number(
                                            sales.onlineOrders
                                        )} orders
                                    </small>

                                </div>

                            </div>


                            {/* WALK-IN */}

                            <div className="source-card walkin-card">

                                <div className="source-icon">
                                    <FaStore />
                                </div>


                                <div className="source-content">

                                    <span>
                                        Walk-in Sales
                                    </span>

                                    <strong>
                                        {money(
                                            sales.walkInSales
                                        )}
                                    </strong>

                                    <small>
                                        {number(
                                            sales.walkInOrders
                                        )} orders
                                    </small>

                                </div>

                            </div>


                            {/* TOTAL */}

                            <div className="source-card total-sales-card">

                                <div className="source-icon">
                                    <FaBoxOpen />
                                </div>


                                <div className="source-content">

                                    <span>
                                        Total Product Sales
                                    </span>

                                    <strong>
                                        {money(
                                            sales.totalSales
                                        )}
                                    </strong>

                                    <small>
                                        {number(
                                            sales.totalOrders
                                        )} total orders
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* DETAIL ROWS */}

                        <div className="detail-rows">

                            <ReportRow
                                label="Total Orders"
                                value={
                                    number(
                                        sales.totalOrders
                                    )
                                }
                            />


                            <ReportRow
                                label="Online Orders"
                                value={
                                    number(
                                        sales.onlineOrders
                                    )
                                }
                            />


                            <ReportRow
                                label="Walk-in Orders"
                                value={
                                    number(
                                        sales.walkInOrders
                                    )
                                }
                            />


                            <ReportRow
                                label="Online Sales"
                                value={
                                    money(
                                        sales.onlineSales
                                    )
                                }
                            />


                            <ReportRow
                                label="Walk-in Sales"
                                value={
                                    money(
                                        sales.walkInSales
                                    )
                                }
                            />


                            <ReportRow
                                label="Total Sales"
                                value={
                                    money(
                                        sales.totalSales
                                    )
                                }
                            />


                            <ReportRow
                                label="Paid Amount"
                                value={
                                    money(
                                        sales.paidAmount
                                    )
                                }
                            />


                            <ReportRow
                                label="Pending Amount"
                                value={
                                    money(
                                        sales.pendingAmount
                                    )
                                }
                            />

                        </div>

                    </section>


                    {/* =====================================
                        REPAIR + RENTAL
                    ===================================== */}

                    <div className="two-column">


                        {/* REPAIR */}

                        <section className="report-panel repair-panel">

                            <div className="panel-title">

                                <div className="title-icon repair-icon">
                                    <FaTools />
                                </div>

                                <div>

                                    <h2>
                                        Repair
                                    </h2>

                                    <p>
                                        Repair jobs and collections
                                    </p>

                                </div>

                            </div>


                            <div className="module-big-value">

                                <span>
                                    Repair Collection
                                </span>

                                <strong>
                                    {money(
                                        repair.totalAmount
                                    )}
                                </strong>

                            </div>


                            <ReportRow
                                label="Total Repair Jobs"
                                value={
                                    number(
                                        repair.totalOrders
                                    )
                                }
                            />


                            <ReportRow
                                label="Paid Amount"
                                value={
                                    money(
                                        repair.paidAmount
                                    )
                                }
                            />


                            <ReportRow
                                label="Pending Amount"
                                value={
                                    money(
                                        repair.pendingAmount
                                    )
                                }
                            />

                        </section>


                        {/* RENTAL */}

                        <section className="report-panel rental-panel">

                            <div className="panel-title">

                                <div className="title-icon rental-icon">
                                    <FaLaptop />
                                </div>

                                <div>

                                    <h2>
                                        Rental
                                    </h2>

                                    <p>
                                        Rental orders and collections
                                    </p>

                                </div>

                            </div>


                            <div className="module-big-value">

                                <span>
                                    Rental Collection
                                </span>

                                <strong>
                                    {money(
                                        rental.totalAmount
                                    )}
                                </strong>

                            </div>


                            <ReportRow
                                label="Total Rental Orders"
                                value={
                                    number(
                                        rental.totalOrders
                                    )
                                }
                            />


                            <ReportRow
                                label="Paid Amount"
                                value={
                                    money(
                                        rental.paidAmount
                                    )
                                }
                            />


                            <ReportRow
                                label="Pending Amount"
                                value={
                                    money(
                                        rental.pendingAmount
                                    )
                                }
                            />

                        </section>

                    </div>


                    {/* =====================================
                        BUSINESS BREAKDOWN
                    ===================================== */}

                    <section className="report-panel">

                        <div className="panel-title">

                            <div className="title-icon">
                                <FaChartLine />
                            </div>

                            <div>

                                <h2>
                                    Business Breakdown
                                </h2>

                                <p>
                                    Online, Walk-in, Repair and Rental
                                </p>

                            </div>

                        </div>


                        <div className="table-container">

                            <table className="business-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Business Type
                                        </th>

                                        <th>
                                            Orders / Jobs
                                        </th>

                                        <th>
                                            Collection
                                        </th>

                                        <th>
                                            Paid
                                        </th>

                                        <th>
                                            Pending
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {/* ONLINE */}

                                    <tr>

                                        <td>

                                            <span className="business-name online">

                                                <FaGlobe />

                                                Online Sales

                                            </span>

                                        </td>


                                        <td>
                                            {number(
                                                sales.onlineOrders
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                sales.onlineSales
                                            )}
                                        </td>


                                        <td>
                                            -
                                        </td>


                                        <td>
                                            -
                                        </td>

                                    </tr>


                                    {/* WALK-IN */}

                                    <tr>

                                        <td>

                                            <span className="business-name walkin">

                                                <FaStore />

                                                Walk-in Sales

                                            </span>

                                        </td>


                                        <td>
                                            {number(
                                                sales.walkInOrders
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                sales.walkInSales
                                            )}
                                        </td>


                                        <td>
                                            -
                                        </td>


                                        <td>
                                            -
                                        </td>

                                    </tr>


                                    {/* REPAIR */}

                                    <tr>

                                        <td>

                                            <span className="business-name repair">

                                                <FaTools />

                                                Repair

                                            </span>

                                        </td>


                                        <td>
                                            {number(
                                                repair.totalOrders
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                repair.totalAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                repair.paidAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                repair.pendingAmount
                                            )}
                                        </td>

                                    </tr>


                                    {/* RENTAL */}

                                    <tr>

                                        <td>

                                            <span className="business-name rental">

                                                <FaLaptop />

                                                Rental

                                            </span>

                                        </td>


                                        <td>
                                            {number(
                                                rental.totalOrders
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                rental.totalAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                rental.paidAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                rental.pendingAmount
                                            )}
                                        </td>

                                    </tr>


                                    {/* GRAND TOTAL */}

                                    <tr className="grand-total">

                                        <td>
                                            Grand Total
                                        </td>


                                        <td>
                                            {number(
                                                combined.totalOrders
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                combined.totalAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                combined.paidAmount
                                            )}
                                        </td>


                                        <td>
                                            {money(
                                                combined.pendingAmount
                                            )}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </section>


                    {/* =====================================
                        PAYMENT METHODS
                    ===================================== */}

                    <section className="report-panel">

                        <div className="panel-title">

                            <div className="title-icon">
                                <FaMoneyBillWave />
                            </div>

                            <div>

                                <h2>
                                    Payment Methods
                                </h2>

                                <p>
                                    Collection by payment method
                                </p>

                            </div>

                        </div>


                        <div className="payment-grid">

                            <PaymentCard
                                title="Cash"
                                value={
                                    methods?.CASH
                                }
                            />


                            <PaymentCard
                                title="Bank"
                                value={
                                    methods?.BANK
                                }
                            />


                            <PaymentCard
                                title="UPI"
                                value={
                                    methods?.UPI
                                }
                            />


                            <PaymentCard
                                title="Other"
                                value={
                                    methods?.OTHER
                                }
                            />

                        </div>

                    </section>


                    {/* =====================================
                        PENDING VENDOR PAYMENTS
                    ===================================== */}

                    <section className="report-panel">

                        <div className="panel-title">

                            <div className="title-icon">
                                <FaClock />
                            </div>

                            <div>

                                <h2>
                                    Pending Vendor Payments
                                </h2>

                                <p>
                                    Outstanding purchase payments
                                </p>

                            </div>

                        </div>


                        <div className="pending-summary">

                            <strong>
                                {money(
                                    pending?.totalPending
                                )}
                            </strong>


                            <span>
                                {pending?.count || 0}
                                {" "}
                                purchase(s)
                            </span>

                        </div>


                        {
                            pending?.purchases?.length
                                ? (

                                    <div className="table-container">

                                        <table className="business-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Purchase
                                                    </th>

                                                    <th>
                                                        Vendor
                                                    </th>

                                                    <th>
                                                        Total
                                                    </th>

                                                    <th>
                                                        Paid
                                                    </th>

                                                    <th>
                                                        Pending
                                                    </th>

                                                    <th>
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {
                                                    pending.purchases.map(
                                                        (purchase) => (

                                                            <tr
                                                                key={
                                                                    purchase._id
                                                                }
                                                            >

                                                                <td>
                                                                    {
                                                                        purchase.purchaseNumber
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        purchase.vendorName
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        money(
                                                                            purchase.totalAmount
                                                                        )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        money(
                                                                            purchase.paidAmount
                                                                        )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        money(
                                                                            purchase.pendingAmount
                                                                        )
                                                                    }
                                                                </td>

                                                                <td>

                                                                    <span className="status-badge">

                                                                        {
                                                                            purchase.paymentStatus
                                                                        }

                                                                    </span>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )
                                                }

                                            </tbody>

                                        </table>

                                    </div>

                                )
                                : (

                                    <div className="no-data">

                                        No pending vendor payments.

                                    </div>

                                )
                        }

                    </section>

                </>

            )}

        </div>
    );
}


// ======================================================
// FINANCIAL CARD
// ======================================================

function FinancialCard({
    title,
    value,
    icon,
}) {

    return (

        <div className="financial-card">

            <div className="financial-card-top">

                <span>
                    {title}
                </span>


                {
                    icon && (

                        <div className="financial-card-icon">

                            {icon}

                        </div>

                    )
                }

            </div>


            <strong>
                {money(value)}
            </strong>

        </div>
    );
}


// ======================================================
// MINI CARD
// ======================================================

function MiniCard({
    title,
    value,
    icon,
}) {

    return (

        <div className="mini-card">

            <div className="mini-card-icon">
                {icon}
            </div>


            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
}


// ======================================================
// REPORT ROW
// ======================================================

function ReportRow({
    label,
    value,
}) {

    return (

        <div className="report-row">

            <span>
                {label}
            </span>


            <strong>
                {value}
            </strong>

        </div>
    );
}


// ======================================================
// PAYMENT CARD
// ======================================================

function PaymentCard({
    title,
    value,
}) {

    return (

        <div className="payment-card">

            <span>
                {title}
            </span>


            <strong>
                {money(value)}
            </strong>

        </div>
    );
}