// // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // import axios from "axios";

// // import {
// //     FaChartLine,
// //     FaMoneyBillWave,
// //     FaSyncAlt,
// //     FaTools,
// //     FaLaptop,
// //     FaShoppingCart,
// //     FaStore,
// //     FaCheckCircle,
// //     FaClock,
// //     FaGlobe,
// //     FaBoxOpen,
// // } from "react-icons/fa";

// // import {
// //     financialReportApi,
// //     getApiError,
// // } from "../../services/accountingService";

// // import "./FinancialReports.css";

// // // ======================================================
// // // CONFIG
// // // Agar backend ke list endpoints alag hain to yahan badlo
// // // ======================================================

// // const API_URL = import.meta.env.VITE_API_URL;

// // const REPAIR_LIST_PATHS = ["/newRepair/", "/newRepair/all"];

// // const RENTAL_LIST_PATHS = [
// //     "/rental",
// //     "/rentals",
// //     "/rental/all",
// //     "/rental-orders",
// //     "/rentals/all",
// // ];

// // // ======================================================
// // // FORMATTERS
// // // ======================================================

// // const money = (value) => {
// //     const amount = Number(value || 0);
// //     return `₹${amount.toLocaleString("en-IN", {
// //         maximumFractionDigits: 2,
// //     })}`;
// // };

// // const number = (value) => Number(value || 0).toLocaleString("en-IN");

// // // ======================================================
// // // DATE (local date, UTC bug fixed)
// // // ======================================================

// // const formatLocalDate = (date) => {
// //     const y = date.getFullYear();
// //     const m = String(date.getMonth() + 1).padStart(2, "0");
// //     const d = String(date.getDate()).padStart(2, "0");
// //     return `${y}-${m}-${d}`;
// // };

// // const getCurrentMonthStart = () => {
// //     const now = new Date();
// //     return formatLocalDate(new Date(now.getFullYear(), now.getMonth(), 1));
// // };

// // const getToday = () => formatLocalDate(new Date());

// // // ======================================================
// // // EMPTY OBJECTS
// // // ======================================================

// // const emptySales = {
// //     totalOrders: 0,
// //     totalSales: 0,
// //     onlineSales: 0,
// //     walkInSales: 0,
// //     onlineOrders: 0,
// //     walkInOrders: 0,
// //     paidAmount: 0,
// //     pendingAmount: 0,
// // };

// // const emptyModule = {
// //     totalOrders: 0,
// //     totalAmount: 0,
// //     paidAmount: 0,
// //     pendingAmount: 0,
// // };

// // // ======================================================
// // // BASIC HELPERS
// // // ======================================================

// // const isObject = (value) =>
// //     value !== null && typeof value === "object" && !Array.isArray(value);

// // const toNumber = (value) => {
// //     if (value === undefined || value === null || value === "") return 0;
// //     const parsed = Number(value);
// //     return Number.isFinite(parsed) ? parsed : 0;
// // };

// // const getValue = (object, keys = [], fallback = 0) => {
// //     if (!isObject(object)) return fallback;

// //     for (const key of keys) {
// //         if (
// //             object[key] !== undefined &&
// //             object[key] !== null &&
// //             object[key] !== ""
// //         ) {
// //             return object[key];
// //         }
// //     }

// //     return fallback;
// // };

// // const pickNum = (object, keys) => toNumber(getValue(object, keys, 0));

// // // ======================================================
// // // RESPONSE UNWRAPPER
// // // ======================================================

// // const unwrap = (response) => {
// //     if (!response) return {};

// //     let current = response;

// //     for (let i = 0; i < 5; i++) {
// //         if (isObject(current) && current.data !== undefined) {
// //             current = current.data;
// //             continue;
// //         }
// //         break;
// //     }

// //     return current || {};
// // };

// // // ======================================================
// // // DEEP OBJECT FINDER
// // // ======================================================

// // const findObjectByKeys = (source, keyGroups = [], maxDepth = 6) => {
// //     if (!source || maxDepth < 0 || !isObject(source)) return null;

// //     const normalizedKeys = keyGroups.map((k) => String(k).toLowerCase());
// //     const sourceKeys = Object.keys(source).map((k) => String(k).toLowerCase());

// //     if (normalizedKeys.some((k) => sourceKeys.includes(k))) return source;

// //     for (const value of Object.values(source)) {
// //         if (!isObject(value)) continue;
// //         const found = findObjectByKeys(value, keyGroups, maxDepth - 1);
// //         if (found) return found;
// //     }

// //     return null;
// // };

// // // ======================================================
// // // FIND ARRAY INSIDE RESPONSE
// // // ======================================================

// // const LIST_KEYS = [
// //     "repairs",
// //     "rentals",
// //     "orders",
// //     "items",
// //     "records",
// //     "list",
// //     "rows",
// //     "results",
// //     "docs",
// // ];

// // const extractList = (root, depth = 0) => {
// //     if (Array.isArray(root)) return root;
// //     if (!isObject(root) || depth > 3) return null;

// //     for (const key of LIST_KEYS) {
// //         if (Array.isArray(root[key])) return root[key];
// //     }

// //     for (const value of Object.values(root)) {
// //         if (Array.isArray(value)) return value;
// //     }

// //     for (const value of Object.values(root)) {
// //         if (isObject(value)) {
// //             const found = extractList(value, depth + 1);
// //             if (found) return found;
// //         }
// //     }

// //     return null;
// // };

// // // ======================================================
// // // SALES NORMALIZER (unchanged logic)
// // // ======================================================

// // const normalizeSales = (response) => {
// //     const root = unwrap(response);

// //     const data =
// //         findObjectByKeys(root, [
// //             "totalOrders",
// //             "orderCount",
// //             "totalSales",
// //             "onlineSales",
// //             "walkInSales",
// //             "walkinSales",
// //             "paidAmount",
// //             "pendingAmount",
// //         ]) || root;

// //     const result = {
// //         totalOrders: pickNum(data, [
// //             "totalOrders",
// //             "orderCount",
// //             "totalOrderCount",
// //             "ordersCount",
// //             "count",
// //             "orders",
// //         ]),
// //         totalSales: pickNum(data, [
// //             "totalSales",
// //             "totalAmount",
// //             "grandTotal",
// //             "sales",
// //             "amount",
// //             "collection",
// //         ]),
// //         onlineSales: pickNum(data, [
// //             "onlineSales",
// //             "onlineAmount",
// //             "onlineTotal",
// //             "online",
// //             "onlineCollection",
// //         ]),
// //         walkInSales: pickNum(data, [
// //             "walkInSales",
// //             "walkinSales",
// //             "walkInAmount",
// //             "walkinAmount",
// //             "walkInTotal",
// //             "walkinTotal",
// //             "walkIn",
// //             "walkin",
// //         ]),
// //         onlineOrders: pickNum(data, [
// //             "onlineOrders",
// //             "onlineOrderCount",
// //             "onlineCount",
// //         ]),
// //         walkInOrders: pickNum(data, [
// //             "walkInOrders",
// //             "walkinOrders",
// //             "walkInOrderCount",
// //             "walkinOrderCount",
// //             "walkInCount",
// //             "walkinCount",
// //         ]),
// //         paidAmount: pickNum(data, [
// //             "paidAmount",
// //             "totalPaid",
// //             "paid",
// //             "collectedAmount",
// //             "collectionAmount",
// //         ]),
// //         pendingAmount: pickNum(data, [
// //             "pendingAmount",
// //             "totalPending",
// //             "pending",
// //             "dueAmount",
// //             "remainingAmount",
// //         ]),
// //     };

// //     if (
// //         result.totalSales === 0 &&
// //         (result.onlineSales > 0 || result.walkInSales > 0)
// //     ) {
// //         result.totalSales = result.onlineSales + result.walkInSales;
// //     }

// //     if (
// //         result.totalOrders === 0 &&
// //         (result.onlineOrders > 0 || result.walkInOrders > 0)
// //     ) {
// //         result.totalOrders = result.onlineOrders + result.walkInOrders;
// //     }

// //     return result;
// // };

// // const hasSalesData = (sales) =>
// //     !!sales &&
// //     [
// //         sales.totalOrders,
// //         sales.totalSales,
// //         sales.onlineSales,
// //         sales.walkInSales,
// //         sales.onlineOrders,
// //         sales.walkInOrders,
// //         sales.paidAmount,
// //         sales.pendingAmount,
// //     ].some((v) => Number(v || 0) > 0);

// // const mergeSales = (detailed, summary) => {
// //     const detailedHasData = hasSalesData(detailed);
// //     const summaryHasData = hasSalesData(summary);

// //     if (!detailedHasData && summaryHasData) {
// //         return { ...emptySales, ...summary };
// //     }

// //     if (detailedHasData && !summaryHasData) {
// //         return { ...emptySales, ...detailed };
// //     }

// //     if (detailedHasData && summaryHasData) {
// //         const pick = (key) =>
// //             detailed[key] > 0 ? detailed[key] : summary[key];

// //         return {
// //             totalOrders: pick("totalOrders"),
// //             totalSales: pick("totalSales"),
// //             onlineSales: pick("onlineSales"),
// //             walkInSales: pick("walkInSales"),
// //             onlineOrders: pick("onlineOrders"),
// //             walkInOrders: pick("walkInOrders"),
// //             paidAmount: pick("paidAmount"),
// //             pendingAmount: pick("pendingAmount"),
// //         };
// //     }

// //     return { ...emptySales };
// // };

// // // ======================================================
// // // REPAIR / RENTAL COMMON NORMALIZER
// // //
// // // Works with:
// // // 1) Object totals  -> { totalAmount, paidAmount, ... }
// // // 2) Array of orders -> [ {repairCost, paidAmount}, ... ]
// // // 3) { repairs: [...] } / { data: { rentals: [...] } }
// // // ======================================================

// // const MODULE_KEYS = {
// //     detect: [
// //         "totalOrders",
// //         "totalRepairs",
// //         "repairCount",
// //         "totalTickets",
// //         "totalJobs",
// //         "totalRentals",
// //         "rentalCount",
// //         "rentalOrders",
// //         "totalAmount",
// //         "totalRepairAmount",
// //         "totalRentalAmount",
// //         "repairCollection",
// //         "rentalCollection",
// //         "repairSales",
// //         "rentalSales",
// //         "totalCollection",
// //         "collection",
// //         "paidAmount",
// //         "pendingAmount",
// //     ],
// //     orders: [
// //         "totalOrders",
// //         "totalRepairs",
// //         "repairCount",
// //         "totalTickets",
// //         "totalJobs",
// //         "totalRentals",
// //         "rentalCount",
// //         "rentalOrders",
// //         "count",
// //         "orders",
// //     ],
// //     total: [
// //         "totalAmount",
// //         "totalRepairAmount",
// //         "totalRentalAmount",
// //         "repairSales",
// //         "rentalSales",
// //         "repairCollection",
// //         "rentalCollection",
// //         "totalCollection",
// //         "grandTotal",
// //         "collection",
// //         "sales",
// //         "amount",
// //         "total",
// //         "revenue",
// //     ],
// //     paid: [
// //         "paidAmount",
// //         "totalPaid",
// //         "paid",
// //         "collectedAmount",
// //         "amountPaid",
// //         "received",
// //     ],
// //     pending: [
// //         "pendingAmount",
// //         "totalPending",
// //         "pending",
// //         "dueAmount",
// //         "balanceAmount",
// //         "balance",
// //     ],
// // };

// // const ITEM_KEYS = {
// //     total: [
// //         "totalAmount",
// //         "grandTotal",
// //         "finalAmount",
// //         "total",
// //         "repairCost",
// //         "rentalAmount",
// //         "totalRent",
// //         "rentAmount",
// //         "amount",
// //     ],
// //     paid: [
// //         "paidAmount",
// //         "amountPaid",
// //         "advancePaid",
// //         "advanceAmount",
// //         "advance",
// //         "received",
// //     ],
// //     pending: ["pendingAmount", "dueAmount", "balanceAmount", "balance"],
// // };

// // const isPaidStatus = (item) => {
// //     const s = String(
// //         item.paymentStatus || item.paymentState || item.paid || ""
// //     ).toLowerCase();
// //     return s === "paid" || s === "completed" || s === "true";
// // };

// // const isCancelled = (item) =>
// //     String(item.status || "").toLowerCase() === "cancelled";

// // const computeFromList = (list) => {
// //     const rows = (list || []).filter(
// //         (item) => isObject(item) && !isCancelled(item)
// //     );

// //     let totalAmount = 0;
// //     let paidAmount = 0;
// //     let pendingAmount = 0;

// //     rows.forEach((item) => {
// //         const total = pickNum(item, ITEM_KEYS.total);
// //         let paid = pickNum(item, ITEM_KEYS.paid);

// //         if (paid === 0 && total > 0 && isPaidStatus(item)) {
// //             paid = total;
// //         }

// //         const explicitPending = getValue(item, ITEM_KEYS.pending, null);
// //         const pend =
// //             explicitPending !== null
// //                 ? toNumber(explicitPending)
// //                 : Math.max(total - paid, 0);

// //         totalAmount += total;
// //         paidAmount += paid;
// //         pendingAmount += pend;
// //     });

// //     return {
// //         totalOrders: rows.length,
// //         totalAmount,
// //         paidAmount,
// //         pendingAmount,
// //     };
// // };

// // const hasModuleData = (m) =>
// //     !!m &&
// //     [m.totalOrders, m.totalAmount, m.paidAmount, m.pendingAmount].some(
// //         (v) => Number(v || 0) > 0
// //     );

// // const normalizeModule = (response) => {
// //     const root = unwrap(response);

// //     // Pure array response
// //     if (Array.isArray(root)) {
// //         return computeFromList(root);
// //     }

// //     const data = findObjectByKeys(root, MODULE_KEYS.detect) || root;

// //     const result = {
// //         totalOrders: pickNum(data, MODULE_KEYS.orders),
// //         totalAmount: pickNum(data, MODULE_KEYS.total),
// //         paidAmount: pickNum(data, MODULE_KEYS.paid),
// //         pendingAmount: pickNum(data, MODULE_KEYS.pending),
// //     };

// //     // total missing but paid + pending available
// //     if (result.totalAmount === 0 && (result.paidAmount > 0 || result.pendingAmount > 0)) {
// //         result.totalAmount = result.paidAmount + result.pendingAmount;
// //     }

// //     // pending missing but can be calculated
// //     if (
// //         result.pendingAmount === 0 &&
// //         result.totalAmount > result.paidAmount &&
// //         result.paidAmount > 0
// //     ) {
// //         result.pendingAmount = result.totalAmount - result.paidAmount;
// //     }

// //     // Object has no totals, maybe it contains a list
// //     if (!hasModuleData(result)) {
// //         const list = extractList(root);
// //         if (list) return computeFromList(list);
// //     }

// //     return result;
// // };

// // // ======================================================
// // // MERGE MODULE (field by field: first value > 0 wins)
// // // ======================================================

// // const mergeModule = (candidates = []) => {
// //     const valid = candidates.filter(Boolean);

// //     const pick = (key) => {
// //         for (const c of valid) {
// //             if (Number(c[key] || 0) > 0) return Number(c[key]);
// //         }
// //         return 0;
// //     };

// //     return {
// //         totalOrders: pick("totalOrders"),
// //         totalAmount: pick("totalAmount"),
// //         paidAmount: pick("paidAmount"),
// //         pendingAmount: pick("pendingAmount"),
// //     };
// // };

// // // ======================================================
// // // DIRECT LIST FETCH (last fallback)
// // // ======================================================

// // const authConfig = () => ({
// //     headers: {
// //         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //     },
// // });

// // const getItemDate = (item) => {
// //     const raw =
// //         item.createdAt ||
// //         item.date ||
// //         item.rentalDate ||
// //         item.startDate ||
// //         item.updatedAt;

// //     if (!raw) return null;

// //     const d = new Date(raw);
// //     if (Number.isNaN(d.getTime())) return null;

// //     return formatLocalDate(d);
// // };

// // const fetchListFromPaths = async (paths, from, to) => {
// //     for (const path of paths) {
// //         try {
// //             const res = await axios.get(`${API_URL}${path}`, authConfig());
// //             const list = extractList(unwrap(res));

// //             if (Array.isArray(list)) {
// //                 return list.filter((item) => {
// //                     const d = getItemDate(item);
// //                     return !d || (d >= from && d <= to);
// //                 });
// //             }
// //         } catch {
// //             // try next path
// //         }
// //     }

// //     return null;
// // };

// // // ======================================================
// // // COLLECTION FALLBACK (summary.collection.repair / rental)
// // // This is the value already visible in top cards
// // // ======================================================

// // const fromCollection = (value) => {
// //     const amount = toNumber(value);

// //     return {
// //         totalOrders: 0,
// //         totalAmount: amount,
// //         paidAmount: amount,
// //         pendingAmount: 0,
// //     };
// // };

// // // ======================================================
// // // RESOLVE REPAIR / RENTAL
// // // ======================================================

// // const resolveModule = async ({
// //     label,
// //     detailedResult,
// //     summaryObject,
// //     collectionValue,
// //     listPaths,
// //     from,
// //     to,
// // }) => {
// //     let detailed = null;
// //     let warning = null;

// //     if (detailedResult && detailedResult.status === "fulfilled") {
// //         console.log(`${label} RAW:`, detailedResult.value);
// //         detailed = normalizeModule(detailedResult.value);
// //     } else {
// //         warning = `Detailed ${label.toLowerCase()} report unavailable. Fallback data is being used.`;
// //         console.warn(`${label} API FAILED:`, detailedResult?.reason);
// //     }

// //     const summary = normalizeModule(summaryObject || {});
// //     const collection = fromCollection(collectionValue);

// //     let merged = mergeModule([detailed, summary, collection]);

// //     // Order count / paid / pending still missing -> compute from list
// //     const needsList =
// //         !hasModuleData(detailed) ||
// //         merged.totalOrders === 0 ||
// //         merged.pendingAmount === 0;

// //     if (needsList) {
// //         const list = await fetchListFromPaths(listPaths, from, to);

// //         if (list && list.length > 0) {
// //             const computed = computeFromList(list);
// //             console.log(`${label} COMPUTED FROM LIST:`, computed);

// //             merged = mergeModule([detailed, summary, computed, collection]);
// //         }
// //     }

// //     return { value: merged, warning };
// // };

// // // ======================================================
// // // COMPONENT
// // // ======================================================

// // export default function FinancialReports() {
// //     const [from, setFrom] = useState(getCurrentMonthStart());
// //     const [to, setTo] = useState(getToday());

// //     const [data, setData] = useState(null);
// //     const [methods, setMethods] = useState({});
// //     const [pending, setPending] = useState(null);

// //     const [salesReport, setSalesReport] = useState(emptySales);
// //     const [repairReport, setRepairReport] = useState(emptyModule);
// //     const [rentalReport, setRentalReport] = useState(emptyModule);

// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState("");
// //     const [reportErrors, setReportErrors] = useState([]);

// //     // ==================================================
// //     // LOAD ALL REPORTS
// //     // ==================================================

// //     const load = useCallback(async () => {
// //         setLoading(true);
// //         setError("");
// //         setReportErrors([]);

// //         try {
// //             const callIfExists = (fn, ...args) =>
// //                 typeof fn === "function"
// //                     ? fn(...args)
// //                     : Promise.reject(new Error("API not available"));

// //             const [
// //                 summaryResult,
// //                 methodsResult,
// //                 pendingResult,
// //                 salesResult,
// //                 repairResult,
// //                 rentalResult,
// //             ] = await Promise.allSettled([
// //                 financialReportApi.summary(from, to),
// //                 financialReportApi.paymentMethods(from, to),
// //                 financialReportApi.pendingPayments(),
// //                 callIfExists(financialReportApi.sales, from, to),
// //                 callIfExists(financialReportApi.repair, from, to),
// //                 callIfExists(financialReportApi.rental, from, to),
// //             ]);

// //             // ---------------- SUMMARY ----------------

// //             if (summaryResult.status !== "fulfilled") {
// //                 throw summaryResult.reason;
// //             }

// //             const summaryData = unwrap(summaryResult.value);
// //             console.log("SUMMARY RAW:", summaryData);
// //             setData(summaryData);

// //             // ---------------- METHODS ----------------

// //             setMethods(
// //                 methodsResult.status === "fulfilled"
// //                     ? unwrap(methodsResult.value)
// //                     : {}
// //             );

// //             // ---------------- PENDING ----------------

// //             setPending(
// //                 pendingResult.status === "fulfilled"
// //                     ? unwrap(pendingResult.value)
// //                     : null
// //             );

// //             const warnings = [];

// //             // ---------------- SALES ----------------

// //             const summarySales =
// //                 summaryData?.salesOrders ||
// //                 summaryData?.sales ||
// //                 summaryData?.orders ||
// //                 {};

// //             const normalizedSummarySales = normalizeSales(summarySales);

// //             if (salesResult.status === "fulfilled") {
// //                 setSalesReport(
// //                     mergeSales(
// //                         normalizeSales(salesResult.value),
// //                         normalizedSummarySales
// //                     )
// //                 );
// //             } else {
// //                 setSalesReport(normalizedSummarySales);
// //                 warnings.push(
// //                     "Detailed sales report unavailable. Existing sales summary data is being used."
// //                 );
// //             }

// //             // ---------------- REPAIR + RENTAL ----------------

// //             const [repairFinal, rentalFinal] = await Promise.all([
// //                 resolveModule({
// //                     label: "REPAIR",
// //                     detailedResult: repairResult,
// //                     summaryObject:
// //                         summaryData?.repair ||
// //                         summaryData?.repairs ||
// //                         summaryData?.repairSummary ||
// //                         {},
// //                     collectionValue: summaryData?.collection?.repair,
// //                     listPaths: REPAIR_LIST_PATHS,
// //                     from,
// //                     to,
// //                 }),
// //                 resolveModule({
// //                     label: "RENTAL",
// //                     detailedResult: rentalResult,
// //                     summaryObject:
// //                         summaryData?.rental ||
// //                         summaryData?.rentals ||
// //                         summaryData?.rentalSummary ||
// //                         {},
// //                     collectionValue: summaryData?.collection?.rental,
// //                     listPaths: RENTAL_LIST_PATHS,
// //                     from,
// //                     to,
// //                 }),
// //             ]);

// //             setRepairReport(repairFinal.value);
// //             setRentalReport(rentalFinal.value);

// //             // Warning sirf tab dikhao jab final value bhi 0 ho
// //             if (repairFinal.warning && !hasModuleData(repairFinal.value)) {
// //                 warnings.push(repairFinal.warning);
// //             }

// //             if (rentalFinal.warning && !hasModuleData(rentalFinal.value)) {
// //                 warnings.push(rentalFinal.warning);
// //             }

// //             setReportErrors(warnings);
// //         } catch (err) {
// //             console.error("FINANCIAL REPORT ERROR:", err);
// //             setError(getApiError(err));
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [from, to]);

// //     useEffect(() => {
// //         load();
// //     }, [load]);

// //     // ==================================================
// //     // FINAL REPORTS
// //     // ==================================================

// //     const sales = salesReport || emptySales;
// //     const repair = repairReport || emptyModule;
// //     const rental = rentalReport || emptyModule;

// //     // ==================================================
// //     // COMBINED BUSINESS TOTAL
// //     // ==================================================

// //     const combined = useMemo(
// //         () => ({
// //             totalOrders:
// //                 Number(sales.totalOrders || 0) +
// //                 Number(repair.totalOrders || 0) +
// //                 Number(rental.totalOrders || 0),

// //             totalAmount:
// //                 Number(sales.totalSales || 0) +
// //                 Number(repair.totalAmount || 0) +
// //                 Number(rental.totalAmount || 0),

// //             paidAmount:
// //                 Number(sales.paidAmount || 0) +
// //                 Number(repair.paidAmount || 0) +
// //                 Number(rental.paidAmount || 0),

// //             pendingAmount:
// //                 Number(sales.pendingAmount || 0) +
// //                 Number(repair.pendingAmount || 0) +
// //                 Number(rental.pendingAmount || 0),
// //         }),
// //         [sales, repair, rental]
// //     );

// //     // ==================================================
// //     // UI
// //     // ==================================================

// //     return (
// //         <div className="reports-page">
// //             {/* HEADER */}
// //             <div className="reports-header">
// //                 <div>
// //                     <h1>Financial Reports</h1>
// //                     <p>
// //                         Product sales, walk-in sales, repair, rental and
// //                         collections.
// //                     </p>
// //                 </div>

// //                 <button
// //                     className="report-btn"
// //                     onClick={load}
// //                     disabled={loading}
// //                 >
// //                     <FaSyncAlt className={loading ? "spin" : ""} />
// //                     {loading ? "Loading..." : "Refresh"}
// //                 </button>
// //             </div>

// //             {/* FILTERS */}
// //             <div className="report-filters">
// //                 <label>
// //                     <span>From</span>
// //                     <input
// //                         type="date"
// //                         value={from}
// //                         onChange={(e) => setFrom(e.target.value)}
// //                     />
// //                 </label>

// //                 <label>
// //                     <span>To</span>
// //                     <input
// //                         type="date"
// //                         value={to}
// //                         onChange={(e) => setTo(e.target.value)}
// //                     />
// //                 </label>

// //                 <button
// //                     className="report-btn primary"
// //                     onClick={load}
// //                     disabled={loading}
// //                 >
// //                     Apply
// //                 </button>
// //             </div>

// //             {/* ERROR */}
// //             {error && <div className="report-alert">{error}</div>}

// //             {/* WARNING */}
// //             {reportErrors.length > 0 && (
// //                 <div className="report-warning">
// //                     <strong>Report Warning</strong>
// //                     <ul>
// //                         {reportErrors.map((message, index) => (
// //                             <li key={index}>{message}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}

// //             {!data ? (
// //                 <div className="report-loading">
// //                     Loading financial report...
// //                 </div>
// //             ) : (
// //                 <>
// //                     {/* COLLECTION CARDS */}
// //                     <div className="report-cards">
// //                         <FinancialCard
// //                             title="Sales Collection"
// //                             value={data.collection?.sales}
// //                             icon={<FaShoppingCart />}
// //                         />

// //                         <FinancialCard
// //                             title="Repair Collection"
// //                             value={data.collection?.repair}
// //                             icon={<FaTools />}
// //                         />

// //                         <FinancialCard
// //                             title="Rental Collection"
// //                             value={data.collection?.rental}
// //                             icon={<FaLaptop />}
// //                         />

// //                         <FinancialCard
// //                             title="Total Collection"
// //                             value={data.collection?.total}
// //                             icon={<FaMoneyBillWave />}
// //                         />

// //                         <FinancialCard
// //                             title="Vendor Payments"
// //                             value={data.expenses?.vendorPayments}
// //                         />

// //                         <FinancialCard
// //                             title="Salary Paid"
// //                             value={data.expenses?.salary}
// //                         />

// //                         <FinancialCard
// //                             title="Total Expenses"
// //                             value={data.expenses?.total}
// //                         />

// //                         <FinancialCard
// //                             title="Net Result"
// //                             value={data.result?.net}
// //                         />
// //                     </div>

// //                     {/* BUSINESS TOTAL */}
// //                     <section className="report-panel business-total">
// //                         <div className="panel-title">
// //                             <div className="title-icon">
// //                                 <FaChartLine />
// //                             </div>

// //                             <div>
// //                                 <h2>All Business Transactions</h2>
// //                                 <p>Product + Walk-in + Repair + Rental</p>
// //                             </div>
// //                         </div>

// //                         <div className="business-grid">
// //                             <MiniCard
// //                                 title="Total Orders / Jobs"
// //                                 value={number(combined.totalOrders)}
// //                                 icon={<FaChartLine />}
// //                             />

// //                             <MiniCard
// //                                 title="Total Business Amount"
// //                                 value={money(combined.totalAmount)}
// //                                 icon={<FaMoneyBillWave />}
// //                             />

// //                             <MiniCard
// //                                 title="Paid Amount"
// //                                 value={money(combined.paidAmount)}
// //                                 icon={<FaCheckCircle />}
// //                             />

// //                             <MiniCard
// //                                 title="Pending Amount"
// //                                 value={money(combined.pendingAmount)}
// //                                 icon={<FaClock />}
// //                             />
// //                         </div>
// //                     </section>

// //                     {/* PRODUCT SALES */}
// //                     <section className="report-panel">
// //                         <div className="panel-title">
// //                             <div className="title-icon sales-icon">
// //                                 <FaShoppingCart />
// //                             </div>

// //                             <div>
// //                                 <h2>Product Sales</h2>
// //                                 <p>Online Orders + Walk-in Orders</p>
// //                             </div>
// //                         </div>

// //                         <div className="sales-source-grid">
// //                             <div className="source-card online-card">
// //                                 <div className="source-icon">
// //                                     <FaGlobe />
// //                                 </div>
// //                                 <div className="source-content">
// //                                     <span>Online Sales</span>
// //                                     <strong>{money(sales.onlineSales)}</strong>
// //                                     <small>
// //                                         {number(sales.onlineOrders)} orders
// //                                     </small>
// //                                 </div>
// //                             </div>

// //                             <div className="source-card walkin-card">
// //                                 <div className="source-icon">
// //                                     <FaStore />
// //                                 </div>
// //                                 <div className="source-content">
// //                                     <span>Walk-in Sales</span>
// //                                     <strong>{money(sales.walkInSales)}</strong>
// //                                     <small>
// //                                         {number(sales.walkInOrders)} orders
// //                                     </small>
// //                                 </div>
// //                             </div>

// //                             <div className="source-card total-sales-card">
// //                                 <div className="source-icon">
// //                                     <FaBoxOpen />
// //                                 </div>
// //                                 <div className="source-content">
// //                                     <span>Total Product Sales</span>
// //                                     <strong>{money(sales.totalSales)}</strong>
// //                                     <small>
// //                                         {number(sales.totalOrders)} total
// //                                         orders
// //                                     </small>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="detail-rows">
// //                             <ReportRow
// //                                 label="Total Orders"
// //                                 value={number(sales.totalOrders)}
// //                             />
// //                             <ReportRow
// //                                 label="Online Orders"
// //                                 value={number(sales.onlineOrders)}
// //                             />
// //                             <ReportRow
// //                                 label="Walk-in Orders"
// //                                 value={number(sales.walkInOrders)}
// //                             />
// //                             <ReportRow
// //                                 label="Online Sales"
// //                                 value={money(sales.onlineSales)}
// //                             />
// //                             <ReportRow
// //                                 label="Walk-in Sales"
// //                                 value={money(sales.walkInSales)}
// //                             />
// //                             <ReportRow
// //                                 label="Total Sales"
// //                                 value={money(sales.totalSales)}
// //                             />
// //                             <ReportRow
// //                                 label="Paid Amount"
// //                                 value={money(sales.paidAmount)}
// //                             />
// //                             <ReportRow
// //                                 label="Pending Amount"
// //                                 value={money(sales.pendingAmount)}
// //                             />
// //                         </div>
// //                     </section>

// //                     {/* REPAIR + RENTAL */}
// //                     <div className="two-column">
// //                         {/* REPAIR */}
// //                         <section className="report-panel repair-panel">
// //                             <div className="panel-title">
// //                                 <div className="title-icon repair-icon">
// //                                     <FaTools />
// //                                 </div>

// //                                 <div>
// //                                     <h2>Repair</h2>
// //                                     <p>Repair jobs and collections</p>
// //                                 </div>
// //                             </div>

// //                             <div className="module-big-value">
// //                                 <span>Repair Collection</span>
// //                                 <strong>{money(repair.totalAmount)}</strong>
// //                             </div>

// //                             <ReportRow
// //                                 label="Total Repair Jobs"
// //                                 value={number(repair.totalOrders)}
// //                             />
// //                             <ReportRow
// //                                 label="Paid Amount"
// //                                 value={money(repair.paidAmount)}
// //                             />
// //                             <ReportRow
// //                                 label="Pending Amount"
// //                                 value={money(repair.pendingAmount)}
// //                             />
// //                         </section>

// //                         {/* RENTAL */}
// //                         <section className="report-panel rental-panel">
// //                             <div className="panel-title">
// //                                 <div className="title-icon rental-icon">
// //                                     <FaLaptop />
// //                                 </div>

// //                                 <div>
// //                                     <h2>Rental</h2>
// //                                     <p>Rental orders and collections</p>
// //                                 </div>
// //                             </div>

// //                             <div className="module-big-value">
// //                                 <span>Rental Collection</span>
// //                                 <strong>{money(rental.totalAmount)}</strong>
// //                             </div>

// //                             <ReportRow
// //                                 label="Total Rental Orders"
// //                                 value={number(rental.totalOrders)}
// //                             />
// //                             <ReportRow
// //                                 label="Paid Amount"
// //                                 value={money(rental.paidAmount)}
// //                             />
// //                             <ReportRow
// //                                 label="Pending Amount"
// //                                 value={money(rental.pendingAmount)}
// //                             />
// //                         </section>
// //                     </div>

// //                     {/* BUSINESS BREAKDOWN */}
// //                     <section className="report-panel">
// //                         <div className="panel-title">
// //                             <div className="title-icon">
// //                                 <FaChartLine />
// //                             </div>

// //                             <div>
// //                                 <h2>Business Breakdown</h2>
// //                                 <p>Online, Walk-in, Repair and Rental</p>
// //                             </div>
// //                         </div>

// //                         <div className="table-container">
// //                             <table className="business-table">
// //                                 <thead>
// //                                     <tr>
// //                                         <th>Business Type</th>
// //                                         <th>Orders / Jobs</th>
// //                                         <th>Collection</th>
// //                                         <th>Paid</th>
// //                                         <th>Pending</th>
// //                                     </tr>
// //                                 </thead>

// //                                 <tbody>
// //                                     <tr>
// //                                         <td>
// //                                             <span className="business-name online">
// //                                                 <FaGlobe />
// //                                                 Online Sales
// //                                             </span>
// //                                         </td>
// //                                         <td>{number(sales.onlineOrders)}</td>
// //                                         <td>{money(sales.onlineSales)}</td>
// //                                         <td>-</td>
// //                                         <td>-</td>
// //                                     </tr>

// //                                     <tr>
// //                                         <td>
// //                                             <span className="business-name walkin">
// //                                                 <FaStore />
// //                                                 Walk-in Sales
// //                                             </span>
// //                                         </td>
// //                                         <td>{number(sales.walkInOrders)}</td>
// //                                         <td>{money(sales.walkInSales)}</td>
// //                                         <td>-</td>
// //                                         <td>-</td>
// //                                     </tr>

// //                                     <tr>
// //                                         <td>
// //                                             <span className="business-name repair">
// //                                                 <FaTools />
// //                                                 Repair
// //                                             </span>
// //                                         </td>
// //                                         <td>{number(repair.totalOrders)}</td>
// //                                         <td>{money(repair.totalAmount)}</td>
// //                                         <td>{money(repair.paidAmount)}</td>
// //                                         <td>{money(repair.pendingAmount)}</td>
// //                                     </tr>

// //                                     <tr>
// //                                         <td>
// //                                             <span className="business-name rental">
// //                                                 <FaLaptop />
// //                                                 Rental
// //                                             </span>
// //                                         </td>
// //                                         <td>{number(rental.totalOrders)}</td>
// //                                         <td>{money(rental.totalAmount)}</td>
// //                                         <td>{money(rental.paidAmount)}</td>
// //                                         <td>{money(rental.pendingAmount)}</td>
// //                                     </tr>

// //                                     <tr className="grand-total">
// //                                         <td>Grand Total</td>
// //                                         <td>{number(combined.totalOrders)}</td>
// //                                         <td>{money(combined.totalAmount)}</td>
// //                                         <td>{money(combined.paidAmount)}</td>
// //                                         <td>{money(combined.pendingAmount)}</td>
// //                                     </tr>
// //                                 </tbody>
// //                             </table>
// //                         </div>
// //                     </section>

// //                     {/* PAYMENT METHODS */}
// //                     <section className="report-panel">
// //                         <div className="panel-title">
// //                             <div className="title-icon">
// //                                 <FaMoneyBillWave />
// //                             </div>

// //                             <div>
// //                                 <h2>Payment Methods</h2>
// //                                 <p>Collection by payment method</p>
// //                             </div>
// //                         </div>

// //                         <div className="payment-grid">
// //                             <PaymentCard title="Cash" value={methods?.CASH} />
// //                             <PaymentCard title="Bank" value={methods?.BANK} />
// //                             <PaymentCard title="UPI" value={methods?.UPI} />
// //                             <PaymentCard title="Other" value={methods?.OTHER} />
// //                         </div>
// //                     </section>

// //                     {/* PENDING VENDOR PAYMENTS */}
// //                     <section className="report-panel">
// //                         <div className="panel-title">
// //                             <div className="title-icon">
// //                                 <FaClock />
// //                             </div>

// //                             <div>
// //                                 <h2>Pending Vendor Payments</h2>
// //                                 <p>Outstanding purchase payments</p>
// //                             </div>
// //                         </div>

// //                         <div className="pending-summary">
// //                             <strong>{money(pending?.totalPending)}</strong>
// //                             <span>{pending?.count || 0} purchase(s)</span>
// //                         </div>

// //                         {pending?.purchases?.length ? (
// //                             <div className="table-container">
// //                                 <table className="business-table">
// //                                     <thead>
// //                                         <tr>
// //                                             <th>Purchase</th>
// //                                             <th>Vendor</th>
// //                                             <th>Total</th>
// //                                             <th>Paid</th>
// //                                             <th>Pending</th>
// //                                             <th>Status</th>
// //                                         </tr>
// //                                     </thead>

// //                                     <tbody>
// //                                         {pending.purchases.map((purchase) => (
// //                                             <tr key={purchase._id}>
// //                                                 <td>{purchase.purchaseNumber}</td>
// //                                                 <td>{purchase.vendorName}</td>
// //                                                 <td>{money(purchase.totalAmount)}</td>
// //                                                 <td>{money(purchase.paidAmount)}</td>
// //                                                 <td>{money(purchase.pendingAmount)}</td>
// //                                                 <td>
// //                                                     <span className="status-badge">
// //                                                         {purchase.paymentStatus}
// //                                                     </span>
// //                                                 </td>
// //                                             </tr>
// //                                         ))}
// //                                     </tbody>
// //                                 </table>
// //                             </div>
// //                         ) : (
// //                             <div className="no-data">
// //                                 No pending vendor payments.
// //                             </div>
// //                         )}
// //                     </section>
// //                 </>
// //             )}
// //         </div>
// //     );
// // }

// // // ======================================================
// // // SMALL COMPONENTS
// // // ======================================================

// // function FinancialCard({ title, value, icon }) {
// //     return (
// //         <div className="financial-card">
// //             <div className="financial-card-top">
// //                 <span>{title}</span>
// //                 {icon && <div className="financial-card-icon">{icon}</div>}
// //             </div>

// //             <strong>{money(value)}</strong>
// //         </div>
// //     );
// // }

// // function MiniCard({ title, value, icon }) {
// //     return (
// //         <div className="mini-card">
// //             <div className="mini-card-icon">{icon}</div>

// //             <div>
// //                 <span>{title}</span>
// //                 <strong>{value}</strong>
// //             </div>
// //         </div>
// //     );
// // }

// // function ReportRow({ label, value }) {
// //     return (
// //         <div className="report-row">
// //             <span>{label}</span>
// //             <strong>{value}</strong>
// //         </div>
// //     );
// // }

// // function PaymentCard({ title, value }) {
// //     return (
// //         <div className="payment-card">
// //             <span>{title}</span>
// //             <strong>{money(value)}</strong>
// //         </div>
// //     );
// // }


// import React, {
//     useCallback,
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

// import axios from "axios";

// import {
//     FaChartLine,
//     FaMoneyBillWave,
//     FaSyncAlt,
//     FaTools,
//     FaLaptop,
//     FaShoppingCart,
//     FaStore,
//     FaCheckCircle,
//     FaClock,
//     FaGlobe,
//     FaBoxOpen,
// } from "react-icons/fa";

// import {
//     financialReportApi,
//     getApiError,
// } from "../../services/accountingService";

// import "./FinancialReports.css";

// // ======================================================
// // CONFIG
// // ======================================================

// const API_URL = import.meta.env.VITE_API_URL;

// const REPAIR_LIST_PATHS = [
//     "/newRepair/",
//     "/newRepair/all",
// ];

// const RENTAL_LIST_PATHS = [
//     "/rental",
//     "/rentals",
//     "/rental/all",
//     "/rental-orders",
//     "/rentals/all",
// ];

// // ======================================================
// // EMPTY DATA
// // ======================================================

// const emptySales = {
//     totalOrders: 0,
//     totalSales: 0,
//     onlineSales: 0,
//     walkInSales: 0,
//     onlineOrders: 0,
//     walkInOrders: 0,
//     paidAmount: 0,
//     pendingAmount: 0,
// };

// const emptyModule = {
//     totalOrders: 0,
//     totalAmount: 0,
//     paidAmount: 0,
//     pendingAmount: 0,
// };

// const emptyExpenses = {
//     vendorPayments: 0,
//     salary: 0,
//     other: 0,
//     total: 0,
// };

// // ======================================================
// // FORMATTERS
// // ======================================================

// const money = (value) => {
//     const amount = Number(value || 0);

//     return `₹${amount.toLocaleString("en-IN", {
//         maximumFractionDigits: 2,
//     })}`;
// };

// const number = (value) => {
//     return Number(value || 0).toLocaleString("en-IN");
// };

// // ======================================================
// // DATE HELPERS
// // ======================================================

// const formatLocalDate = (date) => {
//     const y = date.getFullYear();

//     const m = String(
//         date.getMonth() + 1
//     ).padStart(2, "0");

//     const d = String(
//         date.getDate()
//     ).padStart(2, "0");

//     return `${y}-${m}-${d}`;
// };

// const getCurrentMonthStart = () => {
//     const now = new Date();

//     return formatLocalDate(
//         new Date(
//             now.getFullYear(),
//             now.getMonth(),
//             1
//         )
//     );
// };

// const getToday = () => {
//     return formatLocalDate(new Date());
// };

// // ======================================================
// // BASIC HELPERS
// // ======================================================

// const isObject = (value) =>
//     value !== null &&
//     typeof value === "object" &&
//     !Array.isArray(value);

// const toNumber = (value) => {
//     if (
//         value === undefined ||
//         value === null ||
//         value === ""
//     ) {
//         return 0;
//     }

//     if (typeof value === "string") {
//         const cleaned = value
//             .replace(/₹/g, "")
//             .replace(/,/g, "")
//             .trim();

//         const parsed = Number(cleaned);

//         return Number.isFinite(parsed)
//             ? parsed
//             : 0;
//     }

//     const parsed = Number(value);

//     return Number.isFinite(parsed)
//         ? parsed
//         : 0;
// };

// const getValue = (
//     object,
//     keys = [],
//     fallback = 0
// ) => {
//     if (!isObject(object)) {
//         return fallback;
//     }

//     for (const key of keys) {
//         if (
//             object[key] !== undefined &&
//             object[key] !== null &&
//             object[key] !== ""
//         ) {
//             return object[key];
//         }
//     }

//     return fallback;
// };

// const pickNum = (
//     object,
//     keys = []
// ) => {
//     return toNumber(
//         getValue(
//             object,
//             keys,
//             0
//         )
//     );
// };

// const firstPositive = (
//     values = []
// ) => {
//     for (const value of values) {
//         const num = toNumber(value);

//         if (num > 0) {
//             return num;
//         }
//     }

//     return 0;
// };

// // ======================================================
// // RESPONSE UNWRAPPER
// // ======================================================

// const unwrap = (response) => {
//     if (!response) {
//         return {};
//     }

//     let current = response;

//     for (let i = 0; i < 6; i++) {
//         if (
//             isObject(current) &&
//             current.data !== undefined
//         ) {
//             current = current.data;
//             continue;
//         }

//         break;
//     }

//     return current || {};
// };

// // ======================================================
// // DEEP FIND OBJECT
// // ======================================================

// const findObjectByKeys = (
//     source,
//     keyGroups = [],
//     maxDepth = 7
// ) => {
//     if (
//         !source ||
//         maxDepth < 0 ||
//         !isObject(source)
//     ) {
//         return null;
//     }

//     const normalizedKeys =
//         keyGroups.map((key) =>
//             String(key).toLowerCase()
//         );

//     const sourceKeys =
//         Object.keys(source).map((key) =>
//             String(key).toLowerCase()
//         );

//     if (
//         normalizedKeys.some((key) =>
//             sourceKeys.includes(key)
//         )
//     ) {
//         return source;
//     }

//     for (const value of Object.values(source)) {
//         if (!isObject(value)) {
//             continue;
//         }

//         const found =
//             findObjectByKeys(
//                 value,
//                 keyGroups,
//                 maxDepth - 1
//             );

//         if (found) {
//             return found;
//         }
//     }

//     return null;
// };

// // ======================================================
// // ARRAY EXTRACTION
// // ======================================================

// const LIST_KEYS = [
//     "repairs",
//     "repair",
//     "rentals",
//     "rental",
//     "orders",
//     "items",
//     "records",
//     "list",
//     "rows",
//     "results",
//     "docs",
//     "data",
// ];

// const extractList = (
//     root,
//     depth = 0
// ) => {
//     if (Array.isArray(root)) {
//         return root;
//     }

//     if (
//         !isObject(root) ||
//         depth > 5
//     ) {
//         return null;
//     }

//     for (const key of LIST_KEYS) {
//         if (Array.isArray(root[key])) {
//             return root[key];
//         }
//     }

//     for (const value of Object.values(root)) {
//         if (Array.isArray(value)) {
//             return value;
//         }
//     }

//     for (const value of Object.values(root)) {
//         if (isObject(value)) {
//             const found =
//                 extractList(
//                     value,
//                     depth + 1
//                 );

//             if (found) {
//                 return found;
//             }
//         }
//     }

//     return null;
// };

// // ======================================================
// // SALES NORMALIZER
// // ======================================================

// const normalizeSales = (
//     response
// ) => {
//     const root = unwrap(response);

//     const data =
//         findObjectByKeys(
//             root,
//             [
//                 "totalOrders",
//                 "orderCount",
//                 "totalSales",
//                 "onlineSales",
//                 "walkInSales",
//                 "walkinSales",
//                 "paidAmount",
//                 "pendingAmount",
//             ]
//         ) || root;

//     const result = {
//         totalOrders: pickNum(
//             data,
//             [
//                 "totalOrders",
//                 "orderCount",
//                 "totalOrderCount",
//                 "ordersCount",
//                 "count",
//             ]
//         ),

//         totalSales: pickNum(
//             data,
//             [
//                 "totalSales",
//                 "totalAmount",
//                 "grandTotal",
//                 "sales",
//                 "amount",
//                 "collection",
//             ]
//         ),

//         onlineSales: pickNum(
//             data,
//             [
//                 "onlineSales",
//                 "onlineAmount",
//                 "onlineTotal",
//                 "online",
//                 "onlineCollection",
//             ]
//         ),

//         walkInSales: pickNum(
//             data,
//             [
//                 "walkInSales",
//                 "walkinSales",
//                 "walkInAmount",
//                 "walkinAmount",
//                 "walkInTotal",
//                 "walkinTotal",
//                 "walkIn",
//                 "walkin",
//             ]
//         ),

//         onlineOrders: pickNum(
//             data,
//             [
//                 "onlineOrders",
//                 "onlineOrderCount",
//                 "onlineCount",
//             ]
//         ),

//         walkInOrders: pickNum(
//             data,
//             [
//                 "walkInOrders",
//                 "walkinOrders",
//                 "walkInOrderCount",
//                 "walkinOrderCount",
//                 "walkInCount",
//                 "walkinCount",
//             ]
//         ),

//         paidAmount: pickNum(
//             data,
//             [
//                 "paidAmount",
//                 "totalPaid",
//                 "paid",
//                 "collectedAmount",
//                 "collectionAmount",
//             ]
//         ),

//         pendingAmount: pickNum(
//             data,
//             [
//                 "pendingAmount",
//                 "totalPending",
//                 "pending",
//                 "dueAmount",
//                 "remainingAmount",
//             ]
//         ),
//     };

//     if (
//         result.totalSales === 0 &&
//         (
//             result.onlineSales > 0 ||
//             result.walkInSales > 0
//         )
//     ) {
//         result.totalSales =
//             result.onlineSales +
//             result.walkInSales;
//     }

//     if (
//         result.totalOrders === 0 &&
//         (
//             result.onlineOrders > 0 ||
//             result.walkInOrders > 0
//         )
//     ) {
//         result.totalOrders =
//             result.onlineOrders +
//             result.walkInOrders;
//     }

//     return result;
// };

// const hasSalesData = (
//     sales
// ) => {
//     if (!sales) {
//         return false;
//     }

//     return [
//         sales.totalOrders,
//         sales.totalSales,
//         sales.onlineSales,
//         sales.walkInSales,
//         sales.onlineOrders,
//         sales.walkInOrders,
//         sales.paidAmount,
//         sales.pendingAmount,
//     ].some(
//         (value) =>
//             Number(value || 0) > 0
//     );
// };

// const mergeSales = (
//     detailed,
//     summary
// ) => {
//     const detailedHasData =
//         hasSalesData(detailed);

//     const summaryHasData =
//         hasSalesData(summary);

//     if (
//         !detailedHasData &&
//         summaryHasData
//     ) {
//         return {
//             ...emptySales,
//             ...summary,
//         };
//     }

//     if (
//         detailedHasData &&
//         !summaryHasData
//     ) {
//         return {
//             ...emptySales,
//             ...detailed,
//         };
//     }

//     if (
//         detailedHasData &&
//         summaryHasData
//     ) {
//         const pick = (key) =>
//             Number(detailed[key] || 0) > 0
//                 ? detailed[key]
//                 : summary[key];

//         return {
//             totalOrders:
//                 pick("totalOrders"),

//             totalSales:
//                 pick("totalSales"),

//             onlineSales:
//                 pick("onlineSales"),

//             walkInSales:
//                 pick("walkInSales"),

//             onlineOrders:
//                 pick("onlineOrders"),

//             walkInOrders:
//                 pick("walkInOrders"),

//             paidAmount:
//                 pick("paidAmount"),

//             pendingAmount:
//                 pick("pendingAmount"),
//         };
//     }

//     return {
//         ...emptySales,
//     };
// };

// // ======================================================
// // REPAIR / RENTAL
// // ======================================================

// const MODULE_KEYS = {
//     detect: [
//         "totalOrders",
//         "totalRepairs",
//         "repairCount",
//         "totalTickets",
//         "totalJobs",
//         "totalRentals",
//         "rentalCount",
//         "rentalOrders",
//         "totalAmount",
//         "totalRepairAmount",
//         "totalRentalAmount",
//         "repairCollection",
//         "rentalCollection",
//         "repairSales",
//         "rentalSales",
//         "totalCollection",
//         "collection",
//         "paidAmount",
//         "pendingAmount",
//     ],

//     orders: [
//         "totalOrders",
//         "totalRepairs",
//         "repairCount",
//         "totalTickets",
//         "totalJobs",
//         "totalRentals",
//         "rentalCount",
//         "rentalOrders",
//         "count",
//     ],

//     total: [
//         "totalAmount",
//         "totalRepairAmount",
//         "totalRentalAmount",
//         "repairCollection",
//         "rentalCollection",
//         "repairSales",
//         "rentalSales",
//         "totalCollection",
//         "grandTotal",
//         "collection",
//         "sales",
//         "amount",
//         "total",
//         "revenue",
//     ],

//     paid: [
//         "paidAmount",
//         "totalPaid",
//         "paid",
//         "collectedAmount",
//         "amountPaid",
//         "received",
//         "advancePaid",
//         "advanceAmount",
//     ],

//     pending: [
//         "pendingAmount",
//         "totalPending",
//         "pending",
//         "dueAmount",
//         "balanceAmount",
//         "balance",
//         "remainingAmount",
//     ],
// };

// // ======================================================
// // ITEM TOTAL
// // ======================================================

// const getRepairItemTotal = (
//     item
// ) => {
//     // First use final/total amount
//     const explicitTotal =
//         firstPositive([
//             item?.finalAmount,
//             item?.grandTotal,
//             item?.totalAmount,
//             item?.total,
//         ]);

//     if (explicitTotal > 0) {
//         return explicitTotal;
//     }

//     // Repair cost
//     const repairCost =
//         toNumber(
//             item?.repairCost
//         );

//     if (repairCost > 0) {
//         return repairCost;
//     }

//     // Part + Labour
//     const partCost =
//         toNumber(
//             item?.partCost
//         );

//     const laborCost =
//         toNumber(
//             item?.laborCost
//         );

//     const serviceCost =
//         toNumber(
//             item?.serviceCost
//         );

//     const base =
//         partCost +
//         laborCost +
//         serviceCost;

//     const gstAmount =
//         toNumber(
//             item?.gstAmount
//         );

//     return (
//         base +
//         gstAmount
//     );
// };

// const ITEM_KEYS = {
//     total: [
//         "finalAmount",
//         "grandTotal",
//         "totalAmount",
//         "total",
//         "repairCost",
//         "rentalAmount",
//         "totalRent",
//         "rentAmount",
//         "amount",
//     ],

//     paid: [
//         "paidAmount",
//         "amountPaid",
//         "advancePaid",
//         "advanceAmount",
//         "advance",
//         "received",
//     ],

//     pending: [
//         "pendingAmount",
//         "dueAmount",
//         "balanceAmount",
//         "balance",
//     ],
// };

// const isPaidStatus = (
//     item
// ) => {
//     const status =
//         String(
//             item?.paymentStatus ||
//             item?.paymentState ||
//             item?.paid ||
//             ""
//         ).toLowerCase();

//     return (
//         status === "paid" ||
//         status === "completed" ||
//         status === "true"
//     );
// };

// const isCancelled = (
//     item
// ) =>
//     String(
//         item?.status || ""
//     ).toLowerCase() ===
//     "cancelled";

// // ======================================================
// // COMPUTE FROM LIST
// // ======================================================

// const computeFromList = (
//     list,
//     type = "GENERAL"
// ) => {
//     const rows =
//         (list || []).filter(
//             (item) =>
//                 isObject(item) &&
//                 !isCancelled(item)
//         );

//     let totalAmount = 0;
//     let paidAmount = 0;
//     let pendingAmount = 0;

//     rows.forEach(
//         (item) => {
//             let total = 0;

//             if (
//                 type === "REPAIR"
//             ) {
//                 total =
//                     getRepairItemTotal(
//                         item
//                     );
//             } else {
//                 total =
//                     pickNum(
//                         item,
//                         ITEM_KEYS.total
//                     );
//             }

//             let paid =
//                 pickNum(
//                     item,
//                     ITEM_KEYS.paid
//                 );

//             if (
//                 paid === 0 &&
//                 total > 0 &&
//                 isPaidStatus(item)
//             ) {
//                 paid = total;
//             }

//             const explicitPending =
//                 getValue(
//                     item,
//                     ITEM_KEYS.pending,
//                     null
//                 );

//             let pendingValue;

//             if (
//                 explicitPending !== null
//             ) {
//                 pendingValue =
//                     toNumber(
//                         explicitPending
//                     );
//             } else {
//                 pendingValue =
//                     Math.max(
//                         total - paid,
//                         0
//                     );
//             }

//             totalAmount += total;
//             paidAmount += paid;
//             pendingAmount +=
//                 pendingValue;
//         }
//     );

//     return {
//         totalOrders:
//             rows.length,

//         totalAmount,

//         paidAmount,

//         pendingAmount,
//     };
// };

// const hasModuleData = (
//     module
// ) => {
//     if (!module) {
//         return false;
//     }

//     return [
//         module.totalOrders,
//         module.totalAmount,
//         module.paidAmount,
//         module.pendingAmount,
//     ].some(
//         (value) =>
//             Number(value || 0) > 0
//     );
// };

// const normalizeModule = (
//     response,
//     type = "GENERAL"
// ) => {
//     const root =
//         unwrap(response);

//     if (
//         Array.isArray(root)
//     ) {
//         return computeFromList(
//             root,
//             type
//         );
//     }

//     const data =
//         findObjectByKeys(
//             root,
//             MODULE_KEYS.detect
//         ) || root;

//     const result = {
//         totalOrders:
//             pickNum(
//                 data,
//                 MODULE_KEYS.orders
//             ),

//         totalAmount:
//             pickNum(
//                 data,
//                 MODULE_KEYS.total
//             ),

//         paidAmount:
//             pickNum(
//                 data,
//                 MODULE_KEYS.paid
//             ),

//         pendingAmount:
//             pickNum(
//                 data,
//                 MODULE_KEYS.pending
//             ),
//     };

//     if (
//         result.totalAmount === 0 &&
//         (
//             result.paidAmount > 0 ||
//             result.pendingAmount > 0
//         )
//     ) {
//         result.totalAmount =
//             result.paidAmount +
//             result.pendingAmount;
//     }

//     if (
//         result.pendingAmount === 0 &&
//         result.totalAmount >
//             result.paidAmount
//     ) {
//         result.pendingAmount =
//             Math.max(
//                 result.totalAmount -
//                     result.paidAmount,
//                 0
//             );
//     }

//     if (
//         !hasModuleData(result)
//     ) {
//         const list =
//             extractList(root);

//         if (list) {
//             return computeFromList(
//                 list,
//                 type
//             );
//         }
//     }

//     return result;
// };

// // ======================================================
// // MERGE MODULE
// // ======================================================

// const mergeModule = (
//     candidates = []
// ) => {
//     const valid =
//         candidates.filter(Boolean);

//     const pick = (
//         key
//     ) => {
//         for (
//             const candidate of valid
//         ) {
//             const value =
//                 Number(
//                     candidate[key] || 0
//                 );

//             if (value > 0) {
//                 return value;
//             }
//         }

//         return 0;
//     };

//     return {
//         totalOrders:
//             pick("totalOrders"),

//         totalAmount:
//             pick("totalAmount"),

//         paidAmount:
//             pick("paidAmount"),

//         pendingAmount:
//             pick("pendingAmount"),
//     };
// };

// // ======================================================
// // AUTH
// // ======================================================

// const authConfig = () => {
//     const token =
//         localStorage.getItem(
//             "token"
//         ) ||
//         localStorage.getItem(
//             "accessToken"
//         );

//     return {
//         headers: {
//             Authorization:
//                 token
//                     ? `Bearer ${token}`
//                     : "",
//         },
//     };
// };

// // ======================================================
// // DATE FROM ITEM
// // ======================================================

// const getItemDate = (
//     item
// ) => {
//     const raw =
//         item?.createdAt ||
//         item?.date ||
//         item?.repairDate ||
//         item?.rentalDate ||
//         item?.startDate ||
//         item?.completedAt ||
//         item?.updatedAt;

//     if (!raw) {
//         return null;
//     }

//     const date =
//         new Date(raw);

//     if (
//         Number.isNaN(
//             date.getTime()
//         )
//     ) {
//         return null;
//     }

//     return formatLocalDate(
//         date
//     );
// };

// // ======================================================
// // DIRECT LIST FETCH
// // ======================================================

// const fetchListFromPaths =
//     async (
//         paths,
//         from,
//         to
//     ) => {
//         for (
//             const path of paths
//         ) {
//             try {
//                 const response =
//                     await axios.get(
//                         `${API_URL}${path}`,
//                         authConfig()
//                     );

//                 const root =
//                     unwrap(response);

//                 const list =
//                     extractList(root);

//                 if (
//                     Array.isArray(list)
//                 ) {
//                     return list.filter(
//                         (item) => {
//                             const date =
//                                 getItemDate(
//                                     item
//                                 );

//                             return (
//                                 !date ||
//                                 (
//                                     date >= from &&
//                                     date <= to
//                                 )
//                             );
//                         }
//                     );
//                 }
//             } catch (
//                 error
//             ) {
//                 console.warn(
//                     `LIST API FAILED: ${path}`,
//                     error?.response?.data ||
//                         error?.message
//                 );
//             }
//         }

//         return null;
//     };

// // ======================================================
// // COLLECTION VALUE
// // ======================================================

// const resolveCollectionValue =
//     (
//         root,
//         type,
//         normalizedValue
//     ) => {
//         const collection =
//             root?.collection ||
//             {};

//         if (
//             type === "REPAIR"
//         ) {
//             return firstPositive([
//                 collection?.repair,
//                 collection?.repairs,
//                 collection?.repairCollection,
//                 collection?.repairSales,

//                 root?.repairCollection,
//                 root?.totalRepairAmount,
//                 root?.repairSales,

//                 root?.repair?.totalAmount,
//                 root?.repairs?.totalAmount,

//                 normalizedValue?.totalAmount,
//             ]);
//         }

//         if (
//             type === "RENTAL"
//         ) {
//             return firstPositive([
//                 collection?.rental,
//                 collection?.rentals,
//                 collection?.rentalCollection,
//                 collection?.rentalSales,

//                 root?.rentalCollection,
//                 root?.totalRentalAmount,
//                 root?.rentalSales,

//                 root?.rental?.totalAmount,
//                 root?.rentals?.totalAmount,

//                 normalizedValue?.totalAmount,
//             ]);
//         }

//         return 0;
//     };

// // ======================================================
// // RESOLVE MODULE
// // ======================================================

// const resolveModule =
//     async ({
//         label,
//         type,
//         detailedResult,
//         summaryObject,
//         summaryRoot,
//         listPaths,
//         from,
//         to,
//     }) => {
//         let detailed =
//             null;

//         let warning =
//             null;

//         if (
//             detailedResult?.status ===
//             "fulfilled"
//         ) {
//             console.log(
//                 `${label} RAW:`,
//                 detailedResult.value
//             );

//             detailed =
//                 normalizeModule(
//                     detailedResult.value,
//                     type
//                 );
//         } else {
//             warning =
//                 `Detailed ${label.toLowerCase()} report unavailable. Fallback data is being used.`;

//             console.warn(
//                 `${label} API FAILED:`,
//                 detailedResult?.reason
//             );
//         }

//         const summary =
//             normalizeModule(
//                 summaryObject ||
//                     {},
//                 type
//             );

//         const collectionValue =
//             resolveCollectionValue(
//                 summaryRoot,
//                 type,
//                 summary
//             );

//         const collection = {
//             totalOrders: 0,

//             totalAmount:
//                 collectionValue,

//             paidAmount:
//                 collectionValue,

//             pendingAmount: 0,
//         };

//         let merged =
//             mergeModule([
//                 detailed,
//                 summary,
//                 collection,
//             ]);

//         /*
//          * IMPORTANT:
//          * Repair list se actual amount calculate karenge.
//          */
//         const needsList =
//             type === "REPAIR"
//                 ? (
//                     !hasModuleData(
//                         detailed
//                     ) ||
//                     merged.totalOrders ===
//                         0 ||
//                     merged.totalAmount ===
//                         0
//                 )
//                 : (
//                     !hasModuleData(
//                         detailed
//                     ) ||
//                     merged.totalOrders ===
//                         0 ||
//                     merged.pendingAmount ===
//                         0
//                 );

//         if (needsList) {
//             const list =
//                 await fetchListFromPaths(
//                     listPaths,
//                     from,
//                     to
//                 );

//             if (
//                 Array.isArray(list) &&
//                 list.length > 0
//             ) {
//                 const computed =
//                     computeFromList(
//                         list,
//                         type
//                     );

//                 console.log(
//                     `${label} COMPUTED FROM LIST:`,
//                     computed
//                 );

//                 merged =
//                     mergeModule([
//                         detailed,
//                         summary,
//                         computed,
//                         collection,
//                     ]);
//             }
//         }

//         return {
//             value: merged,
//             warning,
//         };
//     };

// // ======================================================
// // EXPENSE NORMALIZER
// // ======================================================

// const normalizeExpenses = (
//     root
// ) => {
//     const expenses =
//         root?.expenses ||
//         root?.expense ||
//         root?.costs ||
//         {};

//     const vendorPayments =
//         firstPositive([
//             expenses?.vendorPayments,
//             expenses?.vendorPayment,
//             expenses?.vendor,
//             expenses?.vendors,
//             expenses?.purchasePayments,
//             expenses?.purchasePayment,
//             expenses?.totalVendorPayments,

//             root?.vendorPayments,
//             root?.vendorPayment,
//             root?.totalVendorPayments,
//         ]);

//     const salary =
//         firstPositive([
//             expenses?.salary,
//             expenses?.salaryPaid,
//             expenses?.salaryPayments,
//             expenses?.employeeSalary,
//             expenses?.employeeSalaries,
//             expenses?.salaries,

//             root?.salaryPaid,
//             root?.salary,
//             root?.salaryPayments,
//         ]);

//     const other =
//         firstPositive([
//             expenses?.other,
//             expenses?.otherExpenses,
//             expenses?.miscellaneous,
//             expenses?.operational,
//             expenses?.operationalExpenses,
//             expenses?.rent,
//             expenses?.utilities,
//             expenses?.misc,

//             root?.otherExpenses,
//             root?.miscellaneousExpenses,
//         ]);

//     let total =
//         firstPositive([
//             expenses?.total,
//             expenses?.totalExpenses,
//             expenses?.totalExpense,
//             expenses?.expenseTotal,
//             expenses?.grandTotal,

//             root?.totalExpenses,
//             root?.totalExpense,
//             root?.expenseTotal,
//         ]);

//     /*
//      * Agar backend total nahi bhejta,
//      * vendor + salary + other se calculate hoga.
//      */
//     if (total === 0) {
//         total =
//             vendorPayments +
//             salary +
//             other;
//     }

//     return {
//         vendorPayments,
//         salary,
//         other,
//         total,
//     };
// };

// // ======================================================
// // COMPONENT
// // ======================================================

// export default function FinancialReports() {
//     const [from, setFrom] =
//         useState(
//             getCurrentMonthStart()
//         );

//     const [to, setTo] =
//         useState(
//             getToday()
//         );

//     const [data, setData] =
//         useState(null);

//     const [methods, setMethods] =
//         useState({});

//     const [pending, setPending] =
//         useState(null);

//     const [salesReport, setSalesReport] =
//         useState(emptySales);

//     const [repairReport, setRepairReport] =
//         useState(emptyModule);

//     const [rentalReport, setRentalReport] =
//         useState(emptyModule);

//     const [expensesReport, setExpensesReport] =
//         useState(emptyExpenses);

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState("");

//     const [reportErrors, setReportErrors] =
//         useState([]);

//     // ==================================================
//     // LOAD
//     // ==================================================

//     const load = useCallback(
//         async () => {
//             setLoading(true);
//             setError("");
//             setReportErrors([]);

//             try {
//                 const callIfExists =
//                     (
//                         fn,
//                         ...args
//                     ) =>
//                         typeof fn ===
//                         "function"
//                             ? fn(...args)
//                             : Promise.reject(
//                                 new Error(
//                                     "API not available"
//                                 )
//                             );

//                 const [
//                     summaryResult,
//                     methodsResult,
//                     pendingResult,
//                     salesResult,
//                     repairResult,
//                     rentalResult,
//                 ] =
//                     await Promise.allSettled([
//                         financialReportApi.summary(
//                             from,
//                             to
//                         ),

//                         financialReportApi.paymentMethods(
//                             from,
//                             to
//                         ),

//                         financialReportApi.pendingPayments(),

//                         callIfExists(
//                             financialReportApi.sales,
//                             from,
//                             to
//                         ),

//                         callIfExists(
//                             financialReportApi.repair,
//                             from,
//                             to
//                         ),

//                         callIfExists(
//                             financialReportApi.rental,
//                             from,
//                             to
//                         ),
//                     ]);

//                 // ======================================
//                 // SUMMARY
//                 // ======================================

//                 if (
//                     summaryResult.status !==
//                     "fulfilled"
//                 ) {
//                     throw summaryResult.reason;
//                 }

//                 const summaryData =
//                     unwrap(
//                         summaryResult.value
//                     );

//                 console.log(
//                     "================================"
//                 );

//                 console.log(
//                     "FINANCIAL SUMMARY RAW:",
//                     summaryData
//                 );

//                 console.log(
//                     "================================"
//                 );

//                 setData(
//                     summaryData
//                 );

//                 // ======================================
//                 // PAYMENT METHODS
//                 // ======================================

//                 setMethods(
//                     methodsResult.status ===
//                         "fulfilled"
//                         ? unwrap(
//                             methodsResult.value
//                         )
//                         : {}
//                 );

//                 // ======================================
//                 // PENDING
//                 // ======================================

//                 setPending(
//                     pendingResult.status ===
//                         "fulfilled"
//                         ? unwrap(
//                             pendingResult.value
//                         )
//                         : null
//                 );

//                 const warnings = [];

//                 // ======================================
//                 // SALES
//                 // ======================================

//                 const summarySales =
//                     summaryData?.salesOrders ||
//                     summaryData?.sales ||
//                     summaryData?.orders ||
//                     {};

//                 const normalizedSummarySales =
//                     normalizeSales(
//                         summarySales
//                     );

//                 if (
//                     salesResult.status ===
//                     "fulfilled"
//                 ) {
//                     setSalesReport(
//                         mergeSales(
//                             normalizeSales(
//                                 salesResult.value
//                             ),
//                             normalizedSummarySales
//                         )
//                     );
//                 } else {
//                     setSalesReport(
//                         normalizedSummarySales
//                     );

//                     warnings.push(
//                         "Detailed sales report unavailable. Existing sales summary data is being used."
//                     );
//                 }

//                 // ======================================
//                 // REPAIR
//                 // ======================================

//                 const repairFinal =
//                     await resolveModule({
//                         label: "REPAIR",

//                         type: "REPAIR",

//                         detailedResult:
//                             repairResult,

//                         summaryObject:
//                             summaryData?.repair ||
//                             summaryData?.repairs ||
//                             summaryData?.repairSummary ||
//                             {},

//                         summaryRoot:
//                             summaryData,

//                         listPaths:
//                             REPAIR_LIST_PATHS,

//                         from,
//                         to,
//                     });

//                 // ======================================
//                 // RENTAL
//                 // ======================================

//                 const rentalFinal =
//                     await resolveModule({
//                         label: "RENTAL",

//                         type: "RENTAL",

//                         detailedResult:
//                             rentalResult,

//                         summaryObject:
//                             summaryData?.rental ||
//                             summaryData?.rentals ||
//                             summaryData?.rentalSummary ||
//                             {},

//                         summaryRoot:
//                             summaryData,

//                         listPaths:
//                             RENTAL_LIST_PATHS,

//                         from,
//                         to,
//                     });

//                 console.log(
//                     "FINAL REPAIR REPORT:",
//                     repairFinal.value
//                 );

//                 console.log(
//                     "FINAL RENTAL REPORT:",
//                     rentalFinal.value
//                 );

//                 setRepairReport(
//                     repairFinal.value
//                 );

//                 setRentalReport(
//                     rentalFinal.value
//                 );

//                 // ======================================
//                 // EXPENSES
//                 // ======================================

//                 const expenses =
//                     normalizeExpenses(
//                         summaryData
//                     );

//                 console.log(
//                     "FINAL EXPENSE REPORT:",
//                     expenses
//                 );

//                 setExpensesReport(
//                     expenses
//                 );

//                 // ======================================
//                 // WARNINGS
//                 // ======================================

//                 if (
//                     repairFinal.warning &&
//                     !hasModuleData(
//                         repairFinal.value
//                     )
//                 ) {
//                     warnings.push(
//                         repairFinal.warning
//                     );
//                 }

//                 if (
//                     rentalFinal.warning &&
//                     !hasModuleData(
//                         rentalFinal.value
//                     )
//                 ) {
//                     warnings.push(
//                         rentalFinal.warning
//                     );
//                 }

//                 setReportErrors(
//                     warnings
//                 );
//             } catch (err) {
//                 console.error(
//                     "FINANCIAL REPORT ERROR:",
//                     err
//                 );

//                 setError(
//                     getApiError(err)
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [from, to]
//     );

//     useEffect(() => {
//         load();
//     }, [load]);

//     // ==================================================
//     // FINAL DATA
//     // ==================================================

//     const sales =
//         salesReport ||
//         emptySales;

//     const repair =
//         repairReport ||
//         emptyModule;

//     const rental =
//         rentalReport ||
//         emptyModule;

//     const expenses =
//         expensesReport ||
//         emptyExpenses;

//     // ==================================================
//     // TOP COLLECTION VALUES
//     // ==================================================

//     const repairCollection =
//         useMemo(() => {
//             return firstPositive([
//                 repair.totalAmount,

//                 data?.collection?.repair,

//                 data?.collection?.repairs,

//                 data?.collection?.repairCollection,

//                 data?.repairCollection,

//                 data?.totalRepairAmount,

//                 data?.repair?.totalAmount,

//                 data?.repairs?.totalAmount,
//             ]);
//         }, [
//             repair,
//             data,
//         ]);

//     const rentalCollection =
//         useMemo(() => {
//             return firstPositive([
//                 rental.totalAmount,

//                 data?.collection?.rental,

//                 data?.collection?.rentals,

//                 data?.collection?.rentalCollection,

//                 data?.rentalCollection,

//                 data?.totalRentalAmount,

//                 data?.rental?.totalAmount,

//                 data?.rentals?.totalAmount,
//             ]);
//         }, [
//             rental,
//             data,
//         ]);

//     const salesCollection =
//         useMemo(() => {
//             return firstPositive([
//                 data?.collection?.sales,

//                 data?.collection?.sale,

//                 data?.salesCollection,

//                 data?.sales?.totalAmount,

//                 sales.totalSales,
//             ]);
//         }, [
//             data,
//             sales,
//         ]);

//     const totalCollection =
//         useMemo(() => {
//             const backendTotal =
//                 firstPositive([
//                     data?.collection?.total,

//                     data?.collection?.totalCollection,

//                     data?.totalCollection,
//                 ]);

//             if (
//                 backendTotal > 0
//             ) {
//                 return backendTotal;
//             }

//             return (
//                 salesCollection +
//                 repairCollection +
//                 rentalCollection
//             );
//         }, [
//             data,
//             salesCollection,
//             repairCollection,
//             rentalCollection,
//         ]);

//     // ==================================================
//     // EXPENSE VALUES
//     // ==================================================

//     const vendorPayments =
//         firstPositive([
//             expenses.vendorPayments,

//             data?.expenses?.vendorPayments,

//             data?.expenses?.vendorPayment,

//             data?.vendorPayments,

//             data?.totalVendorPayments,
//         ]);

//     const salaryPaid =
//         firstPositive([
//             expenses.salary,

//             data?.expenses?.salary,

//             data?.expenses?.salaryPaid,

//             data?.salaryPaid,

//             data?.salary,
//         ]);

//     const otherExpenses =
//         firstPositive([
//             expenses.other,

//             data?.expenses?.other,

//             data?.expenses?.otherExpenses,

//             data?.otherExpenses,
//         ]);

//     const totalExpenses =
//         useMemo(() => {
//             const backendTotal =
//                 firstPositive([
//                     data?.expenses?.total,

//                     data?.expenses?.totalExpenses,

//                     data?.expenses?.totalExpense,

//                     data?.expenses?.expenseTotal,

//                     data?.totalExpenses,

//                     data?.totalExpense,
//                 ]);

//             if (
//                 backendTotal > 0
//             ) {
//                 return backendTotal;
//             }

//             return (
//                 vendorPayments +
//                 salaryPaid +
//                 otherExpenses
//             );
//         }, [
//             data,
//             vendorPayments,
//             salaryPaid,
//             otherExpenses,
//         ]);

//     // ==================================================
//     // NET RESULT
//     // ==================================================

//     const netResult =
//         useMemo(() => {
//             const backendNet =
//                 Number(
//                     data?.result?.net
//                 );

//             if (
//                 Number.isFinite(
//                     backendNet
//                 ) &&
//                 backendNet !== 0
//             ) {
//                 return backendNet;
//             }

//             return (
//                 totalCollection -
//                 totalExpenses
//             );
//         }, [
//             data,
//             totalCollection,
//             totalExpenses,
//         ]);

//     // ==================================================
//     // COMBINED BUSINESS
//     // ==================================================

//     const combined =
//         useMemo(
//             () => ({
//                 totalOrders:
//                     Number(
//                         sales.totalOrders ||
//                             0
//                     ) +
//                     Number(
//                         repair.totalOrders ||
//                             0
//                     ) +
//                     Number(
//                         rental.totalOrders ||
//                             0
//                     ),

//                 totalAmount:
//                     Number(
//                         sales.totalSales ||
//                             0
//                     ) +
//                     Number(
//                         repairCollection ||
//                             0
//                     ) +
//                     Number(
//                         rentalCollection ||
//                             0
//                     ),

//                 paidAmount:
//                     Number(
//                         sales.paidAmount ||
//                             0
//                     ) +
//                     Number(
//                         repair.paidAmount ||
//                             0
//                     ) +
//                     Number(
//                         rental.paidAmount ||
//                             0
//                     ),

//                 pendingAmount:
//                     Number(
//                         sales.pendingAmount ||
//                             0
//                     ) +
//                     Number(
//                         repair.pendingAmount ||
//                             0
//                     ) +
//                     Number(
//                         rental.pendingAmount ||
//                             0
//                     ),
//             }),
//             [
//                 sales,
//                 repair,
//                 rental,
//                 repairCollection,
//                 rentalCollection,
//             ]
//         );

//     // ==================================================
//     // UI
//     // ==================================================

//     return (
//         <div className="reports-page">

//             {/* ========================================
//                 HEADER
//             ======================================== */}

//             <div className="reports-header">

//                 <div>
//                     <h1>
//                         Financial Reports
//                     </h1>

//                     <p>
//                         Product sales,
//                         walk-in sales,
//                         repair, rental
//                         and collections.
//                     </p>
//                 </div>

//                 <button
//                     className="report-btn"
//                     onClick={load}
//                     disabled={loading}
//                 >
//                     <FaSyncAlt
//                         className={
//                             loading
//                                 ? "spin"
//                                 : ""
//                         }
//                     />

//                     {loading
//                         ? "Loading..."
//                         : "Refresh"}
//                 </button>

//             </div>

//             {/* ========================================
//                 FILTERS
//             ======================================== */}

//             <div className="report-filters">

//                 <label>
//                     <span>
//                         From
//                     </span>

//                     <input
//                         type="date"
//                         value={from}
//                         onChange={(event) =>
//                             setFrom(
//                                 event.target.value
//                             )
//                         }
//                     />
//                 </label>

//                 <label>
//                     <span>
//                         To
//                     </span>

//                     <input
//                         type="date"
//                         value={to}
//                         onChange={(event) =>
//                             setTo(
//                                 event.target.value
//                             )
//                         }
//                     />
//                 </label>

//                 <button
//                     className="report-btn primary"
//                     onClick={load}
//                     disabled={loading}
//                 >
//                     Apply
//                 </button>

//             </div>

//             {/* ========================================
//                 ERROR
//             ======================================== */}

//             {error && (
//                 <div className="report-alert">
//                     {error}
//                 </div>
//             )}

//             {/* ========================================
//                 WARNING
//             ======================================== */}

//             {reportErrors.length > 0 && (
//                 <div className="report-warning">

//                     <strong>
//                         Report Warning
//                     </strong>

//                     <ul>
//                         {reportErrors.map(
//                             (
//                                 message,
//                                 index
//                             ) => (
//                                 <li
//                                     key={index}
//                                 >
//                                     {message}
//                                 </li>
//                             )
//                         )}
//                     </ul>

//                 </div>
//             )}

//             {!data ? (
//                 <div className="report-loading">
//                     Loading financial report...
//                 </div>
//             ) : (
//                 <>

//                     {/* ==================================
//                         COLLECTION CARDS
//                     ================================== */}

//                     <div className="report-cards">

//                         <FinancialCard
//                             title="Sales Collection"
//                             value={
//                                 salesCollection
//                             }
//                             icon={
//                                 <FaShoppingCart />
//                             }
//                         />

//                         <FinancialCard
//                             title="Repair Collection"
//                             value={
//                                 repairCollection
//                             }
//                             icon={
//                                 <FaTools />
//                             }
//                         />

//                         <FinancialCard
//                             title="Rental Collection"
//                             value={
//                                 rentalCollection
//                             }
//                             icon={
//                                 <FaLaptop />
//                             }
//                         />

//                         <FinancialCard
//                             title="Total Collection"
//                             value={
//                                 totalCollection
//                             }
//                             icon={
//                                 <FaMoneyBillWave />
//                             }
//                         />

//                         <FinancialCard
//                             title="Vendor Payments"
//                             value={
//                                 vendorPayments
//                             }
//                         />

//                         <FinancialCard
//                             title="Salary Paid"
//                             value={
//                                 salaryPaid
//                             }
//                         />

//                         <FinancialCard
//                             title="Total Expenses"
//                             value={
//                                 totalExpenses
//                             }
//                         />

//                         <FinancialCard
//                             title="Net Result"
//                             value={
//                                 netResult
//                             }
//                         />

//                     </div>

//                     {/* ==================================
//                         BUSINESS TOTAL
//                     ================================== */}

//                     <section className="report-panel business-total">

//                         <div className="panel-title">

//                             <div className="title-icon">
//                                 <FaChartLine />
//                             </div>

//                             <div>
//                                 <h2>
//                                     All Business Transactions
//                                 </h2>

//                                 <p>
//                                     Product + Walk-in
//                                     + Repair + Rental
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="business-grid">

//                             <MiniCard
//                                 title="Total Orders / Jobs"
//                                 value={number(
//                                     combined.totalOrders
//                                 )}
//                                 icon={
//                                     <FaChartLine />
//                                 }
//                             />

//                             <MiniCard
//                                 title="Total Business Amount"
//                                 value={money(
//                                     combined.totalAmount
//                                 )}
//                                 icon={
//                                     <FaMoneyBillWave />
//                                 }
//                             />

//                             <MiniCard
//                                 title="Paid Amount"
//                                 value={money(
//                                     combined.paidAmount
//                                 )}
//                                 icon={
//                                     <FaCheckCircle />
//                                 }
//                             />

//                             <MiniCard
//                                 title="Pending Amount"
//                                 value={money(
//                                     combined.pendingAmount
//                                 )}
//                                 icon={
//                                     <FaClock />
//                                 }
//                             />

//                         </div>

//                     </section>

//                     {/* ==================================
//                         PRODUCT SALES
//                     ================================== */}

//                     <section className="report-panel">

//                         <div className="panel-title">

//                             <div className="title-icon sales-icon">
//                                 <FaShoppingCart />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Product Sales
//                                 </h2>

//                                 <p>
//                                     Online Orders +
//                                     Walk-in Orders
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="sales-source-grid">

//                             <div className="source-card online-card">

//                                 <div className="source-icon">
//                                     <FaGlobe />
//                                 </div>

//                                 <div className="source-content">

//                                     <span>
//                                         Online Sales
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             sales.onlineSales
//                                         )}
//                                     </strong>

//                                     <small>
//                                         {number(
//                                             sales.onlineOrders
//                                         )}{" "}
//                                         orders
//                                     </small>

//                                 </div>

//                             </div>

//                             <div className="source-card walkin-card">

//                                 <div className="source-icon">
//                                     <FaStore />
//                                 </div>

//                                 <div className="source-content">

//                                     <span>
//                                         Walk-in Sales
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             sales.walkInSales
//                                         )}
//                                     </strong>

//                                     <small>
//                                         {number(
//                                             sales.walkInOrders
//                                         )}{" "}
//                                         orders
//                                     </small>

//                                 </div>

//                             </div>

//                             <div className="source-card total-sales-card">

//                                 <div className="source-icon">
//                                     <FaBoxOpen />
//                                 </div>

//                                 <div className="source-content">

//                                     <span>
//                                         Total Product Sales
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             sales.totalSales
//                                         )}
//                                     </strong>

//                                     <small>
//                                         {number(
//                                             sales.totalOrders
//                                         )}{" "}
//                                         total orders
//                                     </small>

//                                 </div>

//                             </div>

//                         </div>

//                         <div className="detail-rows">

//                             <ReportRow
//                                 label="Total Orders"
//                                 value={number(
//                                     sales.totalOrders
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Online Orders"
//                                 value={number(
//                                     sales.onlineOrders
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Walk-in Orders"
//                                 value={number(
//                                     sales.walkInOrders
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Online Sales"
//                                 value={money(
//                                     sales.onlineSales
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Walk-in Sales"
//                                 value={money(
//                                     sales.walkInSales
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Total Sales"
//                                 value={money(
//                                     sales.totalSales
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Paid Amount"
//                                 value={money(
//                                     sales.paidAmount
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Pending Amount"
//                                 value={money(
//                                     sales.pendingAmount
//                                 )}
//                             />

//                         </div>

//                     </section>

//                     {/* ==================================
//                         REPAIR + RENTAL
//                     ================================== */}

//                     <div className="two-column">

//                         {/* REPAIR */}

//                         <section className="report-panel repair-panel">

//                             <div className="panel-title">

//                                 <div className="title-icon repair-icon">
//                                     <FaTools />
//                                 </div>

//                                 <div>
//                                     <h2>
//                                         Repair
//                                     </h2>

//                                     <p>
//                                         Repair jobs
//                                         and collections
//                                     </p>
//                                 </div>

//                             </div>

//                             <div className="module-big-value">

//                                 <span>
//                                     Repair Collection
//                                 </span>

//                                 <strong>
//                                     {money(
//                                         repairCollection
//                                     )}
//                                 </strong>

//                             </div>

//                             <ReportRow
//                                 label="Total Repair Jobs"
//                                 value={number(
//                                     repair.totalOrders
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Paid Amount"
//                                 value={money(
//                                     repair.paidAmount
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Pending Amount"
//                                 value={money(
//                                     repair.pendingAmount
//                                 )}
//                             />

//                         </section>

//                         {/* RENTAL */}

//                         <section className="report-panel rental-panel">

//                             <div className="panel-title">

//                                 <div className="title-icon rental-icon">
//                                     <FaLaptop />
//                                 </div>

//                                 <div>
//                                     <h2>
//                                         Rental
//                                     </h2>

//                                     <p>
//                                         Rental orders
//                                         and collections
//                                     </p>
//                                 </div>

//                             </div>

//                             <div className="module-big-value">

//                                 <span>
//                                     Rental Collection
//                                 </span>

//                                 <strong>
//                                     {money(
//                                         rentalCollection
//                                     )}
//                                 </strong>

//                             </div>

//                             <ReportRow
//                                 label="Total Rental Orders"
//                                 value={number(
//                                     rental.totalOrders
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Paid Amount"
//                                 value={money(
//                                     rental.paidAmount
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Pending Amount"
//                                 value={money(
//                                     rental.pendingAmount
//                                 )}
//                             />

//                         </section>

//                     </div>

//                     {/* ==================================
//                         BUSINESS BREAKDOWN
//                     ================================== */}

//                     <section className="report-panel">

//                         <div className="panel-title">

//                             <div className="title-icon">
//                                 <FaChartLine />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Business Breakdown
//                                 </h2>

//                                 <p>
//                                     Online, Walk-in,
//                                     Repair and Rental
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="table-container">

//                             <table className="business-table">

//                                 <thead>

//                                     <tr>
//                                         <th>
//                                             Business Type
//                                         </th>

//                                         <th>
//                                             Orders / Jobs
//                                         </th>

//                                         <th>
//                                             Collection
//                                         </th>

//                                         <th>
//                                             Paid
//                                         </th>

//                                         <th>
//                                             Pending
//                                         </th>
//                                     </tr>

//                                 </thead>

//                                 <tbody>

//                                     <tr>

//                                         <td>
//                                             <span className="business-name online">
//                                                 <FaGlobe />
//                                                 Online Sales
//                                             </span>
//                                         </td>

//                                         <td>
//                                             {number(
//                                                 sales.onlineOrders
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 sales.onlineSales
//                                             )}
//                                         </td>

//                                         <td>
//                                             -
//                                         </td>

//                                         <td>
//                                             -
//                                         </td>

//                                     </tr>

//                                     <tr>

//                                         <td>
//                                             <span className="business-name walkin">
//                                                 <FaStore />
//                                                 Walk-in Sales
//                                             </span>
//                                         </td>

//                                         <td>
//                                             {number(
//                                                 sales.walkInOrders
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 sales.walkInSales
//                                             )}
//                                         </td>

//                                         <td>
//                                             -
//                                         </td>

//                                         <td>
//                                             -
//                                         </td>

//                                     </tr>

//                                     <tr>

//                                         <td>
//                                             <span className="business-name repair">
//                                                 <FaTools />
//                                                 Repair
//                                             </span>
//                                         </td>

//                                         <td>
//                                             {number(
//                                                 repair.totalOrders
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 repairCollection
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 repair.paidAmount
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 repair.pendingAmount
//                                             )}
//                                         </td>

//                                     </tr>

//                                     <tr>

//                                         <td>
//                                             <span className="business-name rental">
//                                                 <FaLaptop />
//                                                 Rental
//                                             </span>
//                                         </td>

//                                         <td>
//                                             {number(
//                                                 rental.totalOrders
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 rentalCollection
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 rental.paidAmount
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 rental.pendingAmount
//                                             )}
//                                         </td>

//                                     </tr>

//                                     <tr className="grand-total">

//                                         <td>
//                                             Grand Total
//                                         </td>

//                                         <td>
//                                             {number(
//                                                 combined.totalOrders
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 combined.totalAmount
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 combined.paidAmount
//                                             )}
//                                         </td>

//                                         <td>
//                                             {money(
//                                                 combined.pendingAmount
//                                             )}
//                                         </td>

//                                     </tr>

//                                 </tbody>

//                             </table>

//                         </div>

//                     </section>

//                     {/* ==================================
//                         EXPENSE BREAKDOWN
//                     ================================== */}

//                     <section className="report-panel">

//                         <div className="panel-title">

//                             <div className="title-icon">
//                                 <FaMoneyBillWave />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Expense Breakdown
//                                 </h2>

//                                 <p>
//                                     Vendor payments,
//                                     salary and other
//                                     business expenses
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="detail-rows">

//                             <ReportRow
//                                 label="Vendor Payments"
//                                 value={money(
//                                     vendorPayments
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Salary Paid"
//                                 value={money(
//                                     salaryPaid
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Other Expenses"
//                                 value={money(
//                                     otherExpenses
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Total Expenses"
//                                 value={money(
//                                     totalExpenses
//                                 )}
//                             />

//                             <ReportRow
//                                 label="Net Result"
//                                 value={money(
//                                     netResult
//                                 )}
//                             />

//                         </div>

//                     </section>

//                     {/* ==================================
//                         PAYMENT METHODS
//                     ================================== */}

//                     <section className="report-panel">

//                         <div className="panel-title">

//                             <div className="title-icon">
//                                 <FaMoneyBillWave />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Payment Methods
//                                 </h2>

//                                 <p>
//                                     Collection by
//                                     payment method
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="payment-grid">

//                             <PaymentCard
//                                 title="Cash"
//                                 value={
//                                     methods?.CASH
//                                 }
//                             />

//                             <PaymentCard
//                                 title="Bank"
//                                 value={
//                                     methods?.BANK
//                                 }
//                             />

//                             <PaymentCard
//                                 title="UPI"
//                                 value={
//                                     methods?.UPI
//                                 }
//                             />

//                             <PaymentCard
//                                 title="Other"
//                                 value={
//                                     methods?.OTHER
//                                 }
//                             />

//                         </div>

//                     </section>

//                     {/* ==================================
//                         PENDING VENDOR PAYMENTS
//                     ================================== */}

//                     <section className="report-panel">

//                         <div className="panel-title">

//                             <div className="title-icon">
//                                 <FaClock />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Pending Vendor Payments
//                                 </h2>

//                                 <p>
//                                     Outstanding purchase
//                                     payments
//                                 </p>
//                             </div>

//                         </div>

//                         <div className="pending-summary">

//                             <strong>
//                                 {money(
//                                     pending?.totalPending
//                                 )}
//                             </strong>

//                             <span>
//                                 {pending?.count || 0}{" "}
//                                 purchase(s)
//                             </span>

//                         </div>

//                         {pending?.purchases?.length ? (

//                             <div className="table-container">

//                                 <table className="business-table">

//                                     <thead>

//                                         <tr>

//                                             <th>
//                                                 Purchase
//                                             </th>

//                                             <th>
//                                                 Vendor
//                                             </th>

//                                             <th>
//                                                 Total
//                                             </th>

//                                             <th>
//                                                 Paid
//                                             </th>

//                                             <th>
//                                                 Pending
//                                             </th>

//                                             <th>
//                                                 Status
//                                             </th>

//                                         </tr>

//                                     </thead>

//                                     <tbody>

//                                         {pending.purchases.map(
//                                             (
//                                                 purchase
//                                             ) => (

//                                                 <tr
//                                                     key={
//                                                         purchase._id
//                                                     }
//                                                 >

//                                                     <td>
//                                                         {
//                                                             purchase.purchaseNumber
//                                                         }
//                                                     </td>

//                                                     <td>
//                                                         {
//                                                             purchase.vendorName
//                                                         }
//                                                     </td>

//                                                     <td>
//                                                         {money(
//                                                             purchase.totalAmount
//                                                         )}
//                                                     </td>

//                                                     <td>
//                                                         {money(
//                                                             purchase.paidAmount
//                                                         )}
//                                                     </td>

//                                                     <td>
//                                                         {money(
//                                                             purchase.pendingAmount
//                                                         )}
//                                                     </td>

//                                                     <td>

//                                                         <span className="status-badge">
//                                                             {
//                                                                 purchase.paymentStatus
//                                                             }
//                                                         </span>

//                                                     </td>

//                                                 </tr>

//                                             )
//                                         )}

//                                     </tbody>

//                                 </table>

//                             </div>

//                         ) : (

//                             <div className="no-data">
//                                 No pending vendor payments.
//                             </div>

//                         )}

//                     </section>

//                 </>
//             )}

//         </div>
//     );
// }

// // ======================================================
// // FINANCIAL CARD
// // ======================================================

// function FinancialCard({
//     title,
//     value,
//     icon,
// }) {
//     return (
//         <div className="financial-card">

//             <div className="financial-card-top">

//                 <span>
//                     {title}
//                 </span>

//                 {icon && (
//                     <div className="financial-card-icon">
//                         {icon}
//                     </div>
//                 )}

//             </div>

//             <strong>
//                 {money(value)}
//             </strong>

//         </div>
//     );
// }

// // ======================================================
// // MINI CARD
// // ======================================================

// function MiniCard({
//     title,
//     value,
//     icon,
// }) {
//     return (
//         <div className="mini-card">

//             <div className="mini-card-icon">
//                 {icon}
//             </div>

//             <div>

//                 <span>
//                     {title}
//                 </span>

//                 <strong>
//                     {value}
//                 </strong>

//             </div>

//         </div>
//     );
// }

// // ======================================================
// // REPORT ROW
// // ======================================================

// function ReportRow({
//     label,
//     value,
// }) {
//     return (
//         <div className="report-row">

//             <span>
//                 {label}
//             </span>

//             <strong>
//                 {value}
//             </strong>

//         </div>
//     );
// }

// // ======================================================
// // PAYMENT CARD
// // ======================================================

// function PaymentCard({
//     title,
//     value,
// }) {
//     return (
//         <div className="payment-card">

//             <span>
//                 {title}
//             </span>

//             <strong>
//                 {money(value)}
//             </strong>

//         </div>
//     );
// }


import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

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

import {
    getAllSalaryData,
} from "../../services/salary.api";

import "./FinancialReports.css";

// ======================================================
// CONFIG
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;

const REPAIR_LIST_PATHS = [
    "/newRepair/",
    "/newRepair/all",
];

const RENTAL_LIST_PATHS = [
    "/rental",
    "/rentals",
    "/rental/all",
    "/rental-orders",
    "/rentals/all",
];

// ======================================================
// EMPTY DATA
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

const emptyModule = {
    totalOrders: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
};

const emptyExpenses = {
    vendorPayments: 0,
    salary: 0,
    other: 0,
    total: 0,
};

// ======================================================
// FORMATTERS
// ======================================================

const money = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
};

const number = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
};

// ======================================================
// DATE HELPERS
// ======================================================

const formatLocalDate = (date) => {
    const y = date.getFullYear();

    const m = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
        date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

const getCurrentMonthStart = () => {
    const now = new Date();

    return formatLocalDate(
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )
    );
};

const getToday = () => {
    return formatLocalDate(new Date());
};

// ======================================================
// BASIC HELPERS
// ======================================================

const isObject = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

const toNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return 0;
    }

    if (typeof value === "string") {
        const cleaned = value
            .replace(/₹/g, "")
            .replace(/,/g, "")
            .trim();

        const parsed = Number(cleaned);

        return Number.isFinite(parsed)
            ? parsed
            : 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : 0;
};

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

const pickNum = (
    object,
    keys = []
) => {
    return toNumber(
        getValue(
            object,
            keys,
            0
        )
    );
};

const firstPositive = (
    values = []
) => {
    for (const value of values) {
        const num = toNumber(value);

        if (num > 0) {
            return num;
        }
    }

    return 0;
};

// ======================================================
// RESPONSE UNWRAPPER
// ======================================================

const unwrap = (response) => {
    if (!response) {
        return {};
    }

    let current = response;

    for (let i = 0; i < 6; i++) {
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
// DEEP FIND OBJECT
// ======================================================

const findObjectByKeys = (
    source,
    keyGroups = [],
    maxDepth = 7
) => {
    if (
        !source ||
        maxDepth < 0 ||
        !isObject(source)
    ) {
        return null;
    }

    const normalizedKeys =
        keyGroups.map((key) =>
            String(key).toLowerCase()
        );

    const sourceKeys =
        Object.keys(source).map((key) =>
            String(key).toLowerCase()
        );

    if (
        normalizedKeys.some((key) =>
            sourceKeys.includes(key)
        )
    ) {
        return source;
    }

    for (const value of Object.values(source)) {
        if (!isObject(value)) {
            continue;
        }

        const found =
            findObjectByKeys(
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
// ARRAY EXTRACTION
// ======================================================

const LIST_KEYS = [
    "repairs",
    "repair",
    "rentals",
    "rental",
    "orders",
    "items",
    "records",
    "list",
    "rows",
    "results",
    "docs",
    "data",
];

const extractList = (
    root,
    depth = 0
) => {
    if (Array.isArray(root)) {
        return root;
    }

    if (
        !isObject(root) ||
        depth > 5
    ) {
        return null;
    }

    for (const key of LIST_KEYS) {
        if (Array.isArray(root[key])) {
            return root[key];
        }
    }

    for (const value of Object.values(root)) {
        if (Array.isArray(value)) {
            return value;
        }
    }

    for (const value of Object.values(root)) {
        if (isObject(value)) {
            const found =
                extractList(
                    value,
                    depth + 1
                );

            if (found) {
                return found;
            }
        }
    }

    return null;
};

// ======================================================
// SALES NORMALIZER
// ======================================================

const normalizeSales = (
    response
) => {
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
        totalOrders: pickNum(
            data,
            [
                "totalOrders",
                "orderCount",
                "totalOrderCount",
                "ordersCount",
                "count",
            ]
        ),

        totalSales: pickNum(
            data,
            [
                "totalSales",
                "totalAmount",
                "grandTotal",
                "sales",
                "amount",
                "collection",
            ]
        ),

        onlineSales: pickNum(
            data,
            [
                "onlineSales",
                "onlineAmount",
                "onlineTotal",
                "online",
                "onlineCollection",
            ]
        ),

        walkInSales: pickNum(
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
            ]
        ),

        onlineOrders: pickNum(
            data,
            [
                "onlineOrders",
                "onlineOrderCount",
                "onlineCount",
            ]
        ),

        walkInOrders: pickNum(
            data,
            [
                "walkInOrders",
                "walkinOrders",
                "walkInOrderCount",
                "walkinOrderCount",
                "walkInCount",
                "walkinCount",
            ]
        ),

        paidAmount: pickNum(
            data,
            [
                "paidAmount",
                "totalPaid",
                "paid",
                "collectedAmount",
                "collectionAmount",
            ]
        ),

        pendingAmount: pickNum(
            data,
            [
                "pendingAmount",
                "totalPending",
                "pending",
                "dueAmount",
                "remainingAmount",
            ]
        ),
    };

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

const hasSalesData = (
    sales
) => {
    if (!sales) {
        return false;
    }

    return [
        sales.totalOrders,
        sales.totalSales,
        sales.onlineSales,
        sales.walkInSales,
        sales.onlineOrders,
        sales.walkInOrders,
        sales.paidAmount,
        sales.pendingAmount,
    ].some(
        (value) =>
            Number(value || 0) > 0
    );
};

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
        const pick = (key) =>
            Number(detailed[key] || 0) > 0
                ? detailed[key]
                : summary[key];

        return {
            totalOrders:
                pick("totalOrders"),

            totalSales:
                pick("totalSales"),

            onlineSales:
                pick("onlineSales"),

            walkInSales:
                pick("walkInSales"),

            onlineOrders:
                pick("onlineOrders"),

            walkInOrders:
                pick("walkInOrders"),

            paidAmount:
                pick("paidAmount"),

            pendingAmount:
                pick("pendingAmount"),
        };
    }

    return {
        ...emptySales,
    };
};

// ======================================================
// REPAIR / RENTAL
// ======================================================

const MODULE_KEYS = {
    detect: [
        "totalOrders",
        "totalRepairs",
        "repairCount",
        "totalTickets",
        "totalJobs",
        "totalRentals",
        "rentalCount",
        "rentalOrders",
        "totalAmount",
        "totalRepairAmount",
        "totalRentalAmount",
        "repairCollection",
        "rentalCollection",
        "repairSales",
        "rentalSales",
        "totalCollection",
        "collection",
        "paidAmount",
        "pendingAmount",
    ],

    orders: [
        "totalOrders",
        "totalRepairs",
        "repairCount",
        "totalTickets",
        "totalJobs",
        "totalRentals",
        "rentalCount",
        "rentalOrders",
        "count",
    ],

    total: [
        "totalAmount",
        "totalRepairAmount",
        "totalRentalAmount",
        "repairCollection",
        "rentalCollection",
        "repairSales",
        "rentalSales",
        "totalCollection",
        "grandTotal",
        "collection",
        "sales",
        "amount",
        "total",
        "revenue",
    ],

    paid: [
        "paidAmount",
        "totalPaid",
        "paid",
        "collectedAmount",
        "amountPaid",
        "received",
        "advancePaid",
        "advanceAmount",
    ],

    pending: [
        "pendingAmount",
        "totalPending",
        "pending",
        "dueAmount",
        "balanceAmount",
        "balance",
        "remainingAmount",
    ],
};

// ======================================================
// ITEM TOTAL
// ======================================================

const getRepairItemTotal = (
    item
) => {
    const explicitTotal =
        firstPositive([
            item?.finalAmount,
            item?.grandTotal,
            item?.totalAmount,
            item?.total,
        ]);

    if (explicitTotal > 0) {
        return explicitTotal;
    }

    const repairCost =
        toNumber(
            item?.repairCost
        );

    if (repairCost > 0) {
        return repairCost;
    }

    const partCost =
        toNumber(
            item?.partCost
        );

    const laborCost =
        toNumber(
            item?.laborCost
        );

    const serviceCost =
        toNumber(
            item?.serviceCost
        );

    const base =
        partCost +
        laborCost +
        serviceCost;

    const gstAmount =
        toNumber(
            item?.gstAmount
        );

    return (
        base +
        gstAmount
    );
};

const ITEM_KEYS = {
    total: [
        "finalAmount",
        "grandTotal",
        "totalAmount",
        "total",
        "repairCost",
        "rentalAmount",
        "totalRent",
        "rentAmount",
        "amount",
    ],

    paid: [
        "paidAmount",
        "amountPaid",
        "advancePaid",
        "advanceAmount",
        "advance",
        "received",
    ],

    pending: [
        "pendingAmount",
        "dueAmount",
        "balanceAmount",
        "balance",
    ],
};

// ======================================================
// SALARY HELPERS
// ======================================================

// Same salary data source used by SalaryManagement.jsx.
// FinancialReports now uses getAllSalaryData() directly.
const SALARY_LIST_KEYS = [
    "employees",
    "employee",
    "salaryHistory",
    "salaryHistories",
    "salaryRecords",
    "salaryPayments",
    "payments",
    "salaries",
    "salary",
    "records",
    "history",
    "data",
    "results",
    "rows",
    "docs",
];

// ======================================================
// CLEAN STRING
// ======================================================

const cleanString = (value) => {
    return String(
        value ?? ""
    )
        .trim()
        .toUpperCase();
};

// ======================================================
// SALARY EMPLOYEE NAME
// ======================================================

const getSalaryEmployeeName = (
    employee
) => {
    if (
        employee?.employeeName
    ) {
        return employee.employeeName;
    }

    if (
        employee?.name
    ) {
        return employee.name;
    }

    const firstName =
        employee?.firstName ||
        employee?.user?.firstName ||
        "";

    const lastName =
        employee?.lastName ||
        employee?.user?.lastName ||
        "";

    return (
        `${firstName} ${lastName}`.trim() ||
        "Employee"
    );
};

// ======================================================
// CUSTOMER DETECTION FOR SALARY
// ======================================================

const isSalaryCustomerRecord = (
    record
) => {
    if (
        !record ||
        typeof record !== "object"
    ) {
        return false;
    }

    const department =
        cleanString(
            record?.department ||
            record?.departmentName ||
            record?.employeeDepartment ||
            record?.user?.department ||
            record?.user?.departmentName
        );

    const role =
        cleanString(
            record?.role ||
            record?.roleName ||
            record?.user?.role ||
            record?.user?.roleName
        );

    const type =
        cleanString(
            record?.type ||
            record?.userType ||
            record?.accountType ||
            record?.customerType ||
            record?.user?.type ||
            record?.user?.userType ||
            record?.user?.accountType ||
            record?.user?.customerType
        );

    if (
        record?.isCustomer === true ||
        record?.user?.isCustomer === true
    ) {
        return true;
    }

    if (
        [
            "CUSTOMER",
            "CLIENT",
            "USER",
            "CUSTOMERS",
            "CLIENTS",
            "USERS",
        ].includes(department)
    ) {
        return true;
    }

    if (
        [
            "CUSTOMER",
            "CLIENT",
            "USER",
        ].includes(role)
    ) {
        return true;
    }

    if (
        [
            "CUSTOMER",
            "CLIENT",
            "USER",
        ].includes(type)
    ) {
        return true;
    }

    return false;
};

// ======================================================
// EMPLOYEE DETECTION FOR SALARY
// ======================================================

const isSalaryEmployeeRecord = (
    record
) => {
    if (
        !record ||
        typeof record !== "object"
    ) {
        return false;
    }

    if (
        isSalaryCustomerRecord(
            record
        )
    ) {
        return false;
    }

    const employeeId =
        record?.employeeId ||
        record?.employeeCode ||
        record?.staffId ||
        record?.staffCode ||
        record?.user?.employeeId ||
        record?.user?.employeeCode ||
        record?.user?.staffId ||
        record?.user?.staffCode;

    const explicitEmployee =
        record?.isEmployee === true ||
        record?.user?.isEmployee === true;

    const employeeType =
        cleanString(
            record?.employeeType ||
            record?.employmentType ||
            record?.staffType ||
            record?.user?.employeeType ||
            record?.user?.employmentType ||
            record?.user?.staffType
        );

    if (
        explicitEmployee ||
        employeeType === "EMPLOYEE" ||
        employeeType === "STAFF"
    ) {
        return true;
    }

    if (
        employeeId &&
        String(
            employeeId
        ).trim() &&
        String(
            employeeId
        ).trim() !== "-"
    ) {
        return true;
    }

    const designation =
        cleanString(
            record?.designation ||
            record?.jobTitle ||
            record?.position ||
            record?.roleName ||
            record?.user?.designation ||
            record?.user?.roleName
        );

    const department =
        cleanString(
            record?.department ||
            record?.departmentName ||
            record?.employeeDepartment ||
            record?.user?.department ||
            record?.user?.departmentName
        );

    if (
        department &&
        department !== "-" &&
        designation &&
        designation !== "-" &&
        designation !== "CUSTOMER" &&
        designation !== "CLIENT" &&
        designation !== "USER"
    ) {
        return true;
    }

    const hasSalaryField =
        record?.baseSalary !== undefined ||
        record?.monthlySalary !== undefined ||
        record?.grossSalary !== undefined ||
        record?.salary !== undefined;

    const hasEmployeeField =
        record?.department !== undefined ||
        record?.departmentName !== undefined ||
        record?.designation !== undefined ||
        record?.jobTitle !== undefined ||
        record?.position !== undefined ||
        record?.employmentStatus !== undefined ||
        record?.employeeStatus !== undefined;

    if (
        hasSalaryField &&
        hasEmployeeField
    ) {
        return true;
    }

    return false;
};

// ======================================================
// EXTRACT SALARY LIST
// ======================================================

const extractSalaryList = (
    root,
    depth = 0
) => {
    if (Array.isArray(root)) {
        return root;
    }

    if (
        !isObject(root) ||
        depth > 10
    ) {
        return [];
    }

    // --------------------------------------------------
    // FIRST: known salary/employee arrays
    // --------------------------------------------------

    for (
        const key of SALARY_LIST_KEYS
    ) {
        const value =
            root?.[key];

        if (
            Array.isArray(value) &&
            value.length > 0
        ) {
            const employeeRows =
                value.filter(
                    (item) =>
                        isObject(item) &&
                        (
                            isSalaryEmployeeRecord(
                                item
                            ) ||
                            item?.totalPaidAmount !== undefined ||
                            item?.paidAmount !== undefined ||
                            item?.salaryPaid !== undefined ||
                            item?.baseSalary !== undefined ||
                            item?.monthlySalary !== undefined
                        )
                );

            if (
                employeeRows.length > 0
            ) {
                return employeeRows;
            }

            // Salary/payment history arrays can have different
            // structure, so allow them as fallback.
            const salaryRows =
                value.filter(
                    (item) =>
                        isObject(item) &&
                        (
                            item?.paymentDate !== undefined ||
                            item?.paidDate !== undefined ||
                            item?.salaryDate !== undefined ||
                            item?.salaryMonth !== undefined ||
                            item?.amount !== undefined ||
                            item?.salaryAmount !== undefined ||
                            item?.netSalary !== undefined ||
                            item?.netAmount !== undefined ||
                            item?.paymentStatus !== undefined
                        )
                );

            if (
                salaryRows.length > 0
            ) {
                return salaryRows;
            }
        }
    }

    // --------------------------------------------------
    // SECOND: inspect every array
    // --------------------------------------------------

    for (
        const value of Object.values(root)
    ) {
        if (
            !Array.isArray(value) ||
            value.length === 0
        ) {
            continue;
        }

        const salaryRows =
            value.filter(
                (item) =>
                    isObject(item) &&
                    (
                        isSalaryEmployeeRecord(
                            item
                        ) ||
                        item?.totalPaidAmount !== undefined ||
                        item?.paidAmount !== undefined ||
                        item?.salaryPaid !== undefined ||
                        item?.baseSalary !== undefined ||
                        item?.monthlySalary !== undefined ||
                        item?.paymentDate !== undefined ||
                        item?.paidDate !== undefined ||
                        item?.salaryDate !== undefined ||
                        item?.salaryAmount !== undefined ||
                        item?.netSalary !== undefined ||
                        item?.netAmount !== undefined
                    )
            );

        if (
            salaryRows.length > 0
        ) {
            return salaryRows;
        }
    }

    // --------------------------------------------------
    // THIRD: recursive search
    // --------------------------------------------------

    for (
        const value of Object.values(root)
    ) {
        if (!isObject(value)) {
            continue;
        }

        const found =
            extractSalaryList(
                value,
                depth + 1
            );

        if (
            Array.isArray(found) &&
            found.length > 0
        ) {
            return found;
        }
    }

    return [];
};

// ======================================================
// SALARY DATE
// ======================================================

const getSalaryDate = (
    salary
) => {
    if (!salary) {
        return null;
    }

    const raw =
        salary?.paymentDate ||
        salary?.paidDate ||
        salary?.salaryDate ||
        salary?.date ||
        salary?.createdAt ||
        salary?.updatedAt;

    if (raw) {
        const rawString =
            String(raw).trim();

        // ----------------------------------------------
        // Avoid timezone shifting for YYYY-MM-DD
        // ----------------------------------------------

        const directMatch =
            rawString.match(
                /^(\d{4}-\d{2}-\d{2})/
            );

        if (
            directMatch?.[1]
        ) {
            return directMatch[1];
        }

        const date =
            new Date(raw);

        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {
            return formatLocalDate(
                date
            );
        }
    }

    // --------------------------------------------------
    // Month based salary
    // --------------------------------------------------

    const monthRaw =
        salary?.month ||
        salary?.salaryMonth ||
        salary?.monthYear ||
        salary?.payrollMonth ||
        salary?.period;

    if (monthRaw) {
        const monthValue =
            String(
                monthRaw
            ).trim();

        if (
            /^\d{4}-\d{2}$/.test(
                monthValue
            )
        ) {
            return `${monthValue}-01`;
        }

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                monthValue
            )
        ) {
            return monthValue;
        }

        if (
            /^\d{4}\/\d{2}$/.test(
                monthValue
            )
        ) {
            return `${monthValue
                .replace("/", "-")}-01`;
        }
    }

    return null;
};

// ======================================================
// SALARY PAID AMOUNT
// ======================================================
//
// IMPORTANT:
// This follows SalaryManagement.jsx:
//
// totalPaidAmount
// paidAmount
// salaryPaid
//
// ======================================================

const getSalaryPaidAmount = (
    salary
) => {
    if (!salary) {
        return 0;
    }

    return firstPositive([
        salary?.totalPaidAmount,
        salary?.paidAmount,
        salary?.salaryPaid,
        salary?.amountPaid,
        salary?.paid,
        salary?.totalPaid,
    ]);
};

// ======================================================
// SALARY BASE AMOUNT
// ======================================================

const getSalaryBaseAmount = (
    salary
) => {
    if (!salary) {
        return 0;
    }

    return firstPositive([
        salary?.baseSalary,
        salary?.monthlySalary,
        salary?.salary,
        salary?.grossSalary,
        salary?.basicSalary,
        salary?.totalSalary,
    ]);
};

// ======================================================
// SALARY PAYMENT AMOUNT
// ======================================================
//
// For payment-history style APIs.
//
// ======================================================

const getSalaryPaymentAmount = (
    salary
) => {
    if (!salary) {
        return 0;
    }

    return firstPositive([
        salary?.amount,
        salary?.salaryAmount,
        salary?.paidAmount,
        salary?.totalPaidAmount,
        salary?.salaryPaid,
        salary?.netSalary,
        salary?.netAmount,
        salary?.finalAmount,
        salary?.totalAmount,
        salary?.payableAmount,
        salary?.grossSalary,
        salary?.basicSalary,
    ]);
};

// ======================================================
// SALARY PAID STATUS
// ======================================================

const isSalaryPaid = (
    salary
) => {
    if (!salary) {
        return false;
    }

    const status =
        cleanString(
            salary?.status ||
            salary?.paymentStatus ||
            salary?.paymentState ||
            salary?.salaryStatus ||
            salary?.payStatus ||
            salary?.transactionStatus
        );

    if (
        [
            "PAID",
            "COMPLETED",
            "PAYMENT_COMPLETED",
            "SETTLED",
            "SUCCESS",
            "SUCCESSFUL",
            "PROCESSED",
            "RECEIVED",
            "DONE",
        ].includes(status)
    ) {
        return true;
    }

    if (
        salary?.paid === true ||
        salary?.isPaid === true ||
        salary?.paymentCompleted === true ||
        salary?.isPaymentCompleted === true
    ) {
        return true;
    }

    if (
        String(
            salary?.paid
        ).toLowerCase() === "true"
    ) {
        return true;
    }

    if (
        String(
            salary?.isPaid
        ).toLowerCase() === "true"
    ) {
        return true;
    }

    return false;
};

// ======================================================
// CALCULATE SALARY REPORT
// ======================================================
//
// This function supports BOTH:
//
// 1. SalaryManagement employee summary:
//    totalPaidAmount / paidAmount / salaryPaid
//
// 2. Salary payment history:
//    amount / salaryAmount / netSalary etc.
//
// ======================================================

const calculateSalaryReport = (
    response,
    from,
    to
) => {
    const root =
        unwrap(response);

    const rows =
        extractSalaryList(root);

    console.log(
        "================================"
    );

    console.log(
        "FINANCIAL SALARY RAW RESPONSE:",
        root
    );

    console.log(
        "FINANCIAL SALARY ROWS:",
        rows
    );

    console.log(
        "FINANCIAL SALARY DATE:",
        from,
        "TO",
        to
    );

    console.log(
        "================================"
    );

    let paidAmount = 0;
    let pendingAmount = 0;

    let paidCount = 0;
    let pendingCount = 0;

    let matchedRows = 0;

    rows.forEach(
        (salary) => {
            if (
                !isObject(salary)
            ) {
                return;
            }

            // --------------------------------------------------
            // Customer records NEVER participate in salary
            // --------------------------------------------------

            if (
                isSalaryCustomerRecord(
                    salary
                )
            ) {
                return;
            }

            // --------------------------------------------------
            // Date filter
            // --------------------------------------------------

            const salaryDate =
                getSalaryDate(
                    salary
                );

            if (
                salaryDate &&
                (
                    salaryDate < from ||
                    salaryDate > to
                )
            ) {
                return;
            }

            matchedRows += 1;

            // --------------------------------------------------
            // Detect SalaryManagement employee-summary record
            // --------------------------------------------------

            const employeeStyleRecord =
                isSalaryEmployeeRecord(
                    salary
                ) ||
                salary?.totalPaidAmount !== undefined ||
                salary?.salaryPaid !== undefined ||
                salary?.monthlySalary !== undefined ||
                salary?.baseSalary !== undefined;

            if (
                employeeStyleRecord
            ) {
                const paid =
                    getSalaryPaidAmount(
                        salary
                    );

                const base =
                    getSalaryBaseAmount(
                        salary
                    );

                if (
                    paid > 0
                ) {
                    paidAmount += paid;
                    paidCount += 1;
                }

                // ------------------------------------------------
                // Pending from SalaryManagement:
                // base salary - paid salary
                // ------------------------------------------------

                const pending =
                    Math.max(
                        base - paid,
                        0
                    );

                if (
                    pending > 0
                ) {
                    pendingAmount += pending;
                    pendingCount += 1;
                }

                return;
            }

            // --------------------------------------------------
            // Payment-history record
            // --------------------------------------------------

            const amount =
                getSalaryPaymentAmount(
                    salary
                );

            if (
                amount <= 0
            ) {
                return;
            }

            if (
                isSalaryPaid(
                    salary
                )
            ) {
                paidAmount += amount;
                paidCount += 1;
            } else {
                pendingAmount += amount;
                pendingCount += 1;
            }
        }
    );

    return {
        salary:
            paidAmount,

        paidAmount,

        pendingAmount,

        paidCount,

        pendingCount,

        total:
            paidAmount +
            pendingAmount,

        // IMPORTANT:
        // tells FinancialReports that real salary
        // data was found and should be trusted.
        historyFound:
            rows.length > 0,

        matchedRows,
    };
};

// ======================================================
// PAID STATUS
// ======================================================

const isPaidStatus = (
    item
) => {
    const status =
        String(
            item?.paymentStatus ||
            item?.paymentState ||
            item?.paid ||
            item?.status ||
            ""
        ).toLowerCase();

    return (
        status === "paid" ||
        status === "completed" ||
        status === "true" ||
        status === "success" ||
        status === "successful"
    );
};

const isCancelled = (
    item
) =>
    [
        "cancelled",
        "canceled",
    ].includes(
        String(
            item?.status || ""
        ).toLowerCase()
    );

// ======================================================
// COMPUTE FROM LIST
// ======================================================

const computeFromList = (
    list,
    type = "GENERAL"
) => {
    const rows =
        (list || []).filter(
            (item) =>
                isObject(item) &&
                !isCancelled(item)
        );

    let totalAmount = 0;
    let paidAmount = 0;
    let pendingAmount = 0;

    rows.forEach(
        (item) => {
            let total = 0;

            if (
                type === "REPAIR"
            ) {
                total =
                    getRepairItemTotal(
                        item
                    );
            } else {
                total =
                    pickNum(
                        item,
                        ITEM_KEYS.total
                    );
            }

            let paid =
                pickNum(
                    item,
                    ITEM_KEYS.paid
                );

            if (
                paid === 0 &&
                total > 0 &&
                isPaidStatus(item)
            ) {
                paid = total;
            }

            const explicitPending =
                getValue(
                    item,
                    ITEM_KEYS.pending,
                    null
                );

            let pendingValue;

            if (
                explicitPending !== null
            ) {
                pendingValue =
                    toNumber(
                        explicitPending
                    );
            } else {
                pendingValue =
                    Math.max(
                        total - paid,
                        0
                    );
            }

            totalAmount += total;
            paidAmount += paid;
            pendingAmount +=
                pendingValue;
        }
    );

    return {
        totalOrders:
            rows.length,

        totalAmount,

        paidAmount,

        pendingAmount,
    };
};

const hasModuleData = (
    module
) => {
    if (!module) {
        return false;
    }

    return [
        module.totalOrders,
        module.totalAmount,
        module.paidAmount,
        module.pendingAmount,
    ].some(
        (value) =>
            Number(value || 0) > 0
    );
};

const normalizeModule = (
    response,
    type = "GENERAL"
) => {
    const root =
        unwrap(response);

    if (
        Array.isArray(root)
    ) {
        return computeFromList(
            root,
            type
        );
    }

    const data =
        findObjectByKeys(
            root,
            MODULE_KEYS.detect
        ) || root;

    const result = {
        totalOrders:
            pickNum(
                data,
                MODULE_KEYS.orders
            ),

        totalAmount:
            pickNum(
                data,
                MODULE_KEYS.total
            ),

        paidAmount:
            pickNum(
                data,
                MODULE_KEYS.paid
            ),

        pendingAmount:
            pickNum(
                data,
                MODULE_KEYS.pending
            ),
    };

    if (
        result.totalAmount === 0 &&
        (
            result.paidAmount > 0 ||
            result.pendingAmount > 0
        )
    ) {
        result.totalAmount =
            result.paidAmount +
            result.pendingAmount;
    }

    if (
        result.pendingAmount === 0 &&
        result.totalAmount >
            result.paidAmount
    ) {
        result.pendingAmount =
            Math.max(
                result.totalAmount -
                    result.paidAmount,
                0
            );
    }

    if (
        !hasModuleData(result)
    ) {
        const list =
            extractList(root);

        if (list) {
            return computeFromList(
                list,
                type
            );
        }
    }

    return result;
};

// ======================================================
// MERGE MODULE
// ======================================================

const mergeModule = (
    candidates = []
) => {
    const valid =
        candidates.filter(Boolean);

    const pick = (
        key
    ) => {
        for (
            const candidate of valid
        ) {
            const value =
                Number(
                    candidate[key] || 0
                );

            if (value > 0) {
                return value;
            }
        }

        return 0;
    };

    return {
        totalOrders:
            pick("totalOrders"),

        totalAmount:
            pick("totalAmount"),

        paidAmount:
            pick("paidAmount"),

        pendingAmount:
            pick("pendingAmount"),
    };
};

// ======================================================
// AUTH
// ======================================================

const authConfig = () => {
    const token =
        localStorage.getItem(
            "token"
        ) ||
        localStorage.getItem(
            "accessToken"
        );

    return {
        headers: {
            Authorization:
                token
                    ? `Bearer ${token}`
                    : "",
        },
    };
};

// ======================================================
// DATE FROM ITEM
// ======================================================

const getItemDate = (
    item
) => {
    const raw =
        item?.createdAt ||
        item?.date ||
        item?.repairDate ||
        item?.rentalDate ||
        item?.startDate ||
        item?.completedAt ||
        item?.updatedAt;

    if (!raw) {
        return null;
    }

    const rawString =
        String(raw).trim();

    const directMatch =
        rawString.match(
            /^(\d{4}-\d{2}-\d{2})/
        );

    if (
        directMatch?.[1]
    ) {
        return directMatch[1];
    }

    const date =
        new Date(raw);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return formatLocalDate(
        date
    );
};

// ======================================================
// DIRECT LIST FETCH
// ======================================================

const fetchListFromPaths =
    async (
        paths,
        from,
        to
    ) => {
        for (
            const path of paths
        ) {
            try {
                const response =
                    await axios.get(
                        `${API_URL}${path}`,
                        authConfig()
                    );

                const root =
                    unwrap(response);

                const list =
                    extractList(root);

                if (
                    Array.isArray(list)
                ) {
                    return list.filter(
                        (item) => {
                            const date =
                                getItemDate(
                                    item
                                );

                            return (
                                !date ||
                                (
                                    date >= from &&
                                    date <= to
                                )
                            );
                        }
                    );
                }
            } catch (
                error
            ) {
                console.warn(
                    `LIST API FAILED: ${path}`,
                    error?.response?.data ||
                        error?.message
                );
            }
        }

        return null;
    };

// ======================================================
// COLLECTION VALUE
// ======================================================

const resolveCollectionValue =
    (
        root,
        type,
        normalizedValue
    ) => {
        const collection =
            root?.collection ||
            {};

        if (
            type === "REPAIR"
        ) {
            return firstPositive([
                collection?.repair,
                collection?.repairs,
                collection?.repairCollection,
                collection?.repairSales,

                root?.repairCollection,
                root?.totalRepairAmount,
                root?.repairSales,

                root?.repair?.totalAmount,
                root?.repairs?.totalAmount,

                normalizedValue?.totalAmount,
            ]);
        }

        if (
            type === "RENTAL"
        ) {
            return firstPositive([
                collection?.rental,
                collection?.rentals,
                collection?.rentalCollection,
                collection?.rentalSales,

                root?.rentalCollection,
                root?.totalRentalAmount,
                root?.rentalSales,

                root?.rental?.totalAmount,
                root?.rentals?.totalAmount,

                normalizedValue?.totalAmount,
            ]);
        }

        return 0;
    };

// ======================================================
// RESOLVE MODULE
// ======================================================

const resolveModule =
    async ({
        label,
        type,
        detailedResult,
        summaryObject,
        summaryRoot,
        listPaths,
        from,
        to,
    }) => {
        let detailed =
            null;

        let warning =
            null;

        if (
            detailedResult?.status ===
            "fulfilled"
        ) {
            console.log(
                `${label} RAW:`,
                detailedResult.value
            );

            detailed =
                normalizeModule(
                    detailedResult.value,
                    type
                );
        } else {
            warning =
                `Detailed ${label.toLowerCase()} report unavailable. Fallback data is being used.`;

            console.warn(
                `${label} API FAILED:`,
                detailedResult?.reason
            );
        }

        const summary =
            normalizeModule(
                summaryObject ||
                    {},
                type
            );

        const collectionValue =
            resolveCollectionValue(
                summaryRoot,
                type,
                summary
            );

        const collection = {
            totalOrders: 0,

            totalAmount:
                collectionValue,

            paidAmount:
                collectionValue,

            pendingAmount: 0,
        };

        let merged =
            mergeModule([
                detailed,
                summary,
                collection,
            ]);

        const needsList =
            type === "REPAIR"
                ? (
                    !hasModuleData(
                        detailed
                    ) ||
                    merged.totalOrders ===
                        0 ||
                    merged.totalAmount ===
                        0
                )
                : (
                    !hasModuleData(
                        detailed
                    ) ||
                    merged.totalOrders ===
                        0 ||
                    merged.pendingAmount ===
                        0
                );

        if (needsList) {
            const list =
                await fetchListFromPaths(
                    listPaths,
                    from,
                    to
                );

            if (
                Array.isArray(list) &&
                list.length > 0
            ) {
                const computed =
                    computeFromList(
                        list,
                        type
                    );

                console.log(
                    `${label} COMPUTED FROM LIST:`,
                    computed
                );

                merged =
                    mergeModule([
                        detailed,
                        summary,
                        computed,
                        collection,
                    ]);
            }
        }

        return {
            value: merged,
            warning,
        };
    };

// ======================================================
// EXPENSE NORMALIZER
// ======================================================

const normalizeExpenses = (
    root
) => {
    const expenses =
        root?.expenses ||
        root?.expense ||
        root?.costs ||
        {};

    const vendorPayments =
        firstPositive([
            expenses?.vendorPayments,
            expenses?.vendorPayment,
            expenses?.vendor,
            expenses?.vendors,
            expenses?.purchasePayments,
            expenses?.purchasePayment,
            expenses?.totalVendorPayments,

            root?.vendorPayments,
            root?.vendorPayment,
            root?.totalVendorPayments,
        ]);

    const salary =
        firstPositive([
            expenses?.salary,
            expenses?.salaryPaid,
            expenses?.salaryPayments,
            expenses?.employeeSalary,
            expenses?.employeeSalaries,
            expenses?.salaries,

            root?.salaryPaid,
            root?.salary,
            root?.salaryPayments,
        ]);

    const other =
        firstPositive([
            expenses?.other,
            expenses?.otherExpenses,
            expenses?.miscellaneous,
            expenses?.operational,
            expenses?.operationalExpenses,
            expenses?.rent,
            expenses?.utilities,
            expenses?.misc,

            root?.otherExpenses,
            root?.miscellaneousExpenses,
        ]);

    let total =
        firstPositive([
            expenses?.total,
            expenses?.totalExpenses,
            expenses?.totalExpense,
            expenses?.expenseTotal,
            expenses?.grandTotal,

            root?.totalExpenses,
            root?.totalExpense,
            root?.expenseTotal,
        ]);

    if (total === 0) {
        total =
            vendorPayments +
            salary +
            other;
    }

    return {
        vendorPayments,
        salary,
        other,
        total,
    };
};

// ======================================================
// COMPONENT
// ======================================================

export default function FinancialReports() {
    const [from, setFrom] =
        useState(
            getCurrentMonthStart()
        );

    const [to, setTo] =
        useState(
            getToday()
        );

    const [data, setData] =
        useState(null);

    const [methods, setMethods] =
        useState({});

    const [pending, setPending] =
        useState(null);

    const [salesReport, setSalesReport] =
        useState(emptySales);

    const [repairReport, setRepairReport] =
        useState(emptyModule);

    const [rentalReport, setRentalReport] =
        useState(emptyModule);

    const [expensesReport, setExpensesReport] =
        useState(emptyExpenses);

    // ==================================================
    // SALARY REPORT
    // ==================================================

    const [salaryReport, setSalaryReport] =
        useState({
            salary: 0,
            paidAmount: 0,
            pendingAmount: 0,
            paidCount: 0,
            pendingCount: 0,
            total: 0,
            historyFound: false,
            matchedRows: 0,
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [reportErrors, setReportErrors] =
        useState([]);

    // ==================================================
    // LOAD
    // ==================================================

    const load = useCallback(
        async () => {
            setLoading(true);
            setError("");
            setReportErrors([]);

            try {
                const callIfExists =
                    (
                        fn,
                        ...args
                    ) =>
                        typeof fn ===
                        "function"
                            ? fn(...args)
                            : Promise.reject(
                                new Error(
                                    "API not available"
                                )
                            );

                // ======================================
                // ALL API CALLS
                // ======================================

                const [
                    summaryResult,
                    methodsResult,
                    pendingResult,
                    salesResult,
                    repairResult,
                    rentalResult,
                    salaryResult,
                ] =
                    await Promise.allSettled([
                        financialReportApi.summary(
                            from,
                            to
                        ),

                        financialReportApi.paymentMethods(
                            from,
                            to
                        ),

                        financialReportApi.pendingPayments(),

                        callIfExists(
                            financialReportApi.sales,
                            from,
                            to
                        ),

                        callIfExists(
                            financialReportApi.repair,
                            from,
                            to
                        ),

                        callIfExists(
                            financialReportApi.rental,
                            from,
                            to
                        ),

                        // ==================================
                        // IMPORTANT SALARY SOURCE
                        // ==================================
                        //
                        // SAME API USED BY:
                        // SalaryManagement.jsx
                        //
                        // getAllSalaryData()
                        //
                        getAllSalaryData(),
                    ]);

                // ======================================
                // SUMMARY
                // ======================================

                if (
                    summaryResult.status !==
                    "fulfilled"
                ) {
                    throw summaryResult.reason;
                }

                const summaryData =
                    unwrap(
                        summaryResult.value
                    );

                console.log(
                    "================================"
                );

                console.log(
                    "FINANCIAL SUMMARY RAW:",
                    summaryData
                );

                console.log(
                    "================================"
                );

                setData(
                    summaryData
                );

                // ======================================
                // PAYMENT METHODS
                // ======================================

                setMethods(
                    methodsResult.status ===
                        "fulfilled"
                        ? unwrap(
                            methodsResult.value
                        )
                        : {}
                );

                // ======================================
                // PENDING
                // ======================================

                setPending(
                    pendingResult.status ===
                        "fulfilled"
                        ? unwrap(
                            pendingResult.value
                        )
                        : null
                );

                const warnings = [];

                // ======================================
                // SALES
                // ======================================

                const summarySales =
                    summaryData?.salesOrders ||
                    summaryData?.sales ||
                    summaryData?.orders ||
                    {};

                const normalizedSummarySales =
                    normalizeSales(
                        summarySales
                    );

                if (
                    salesResult.status ===
                    "fulfilled"
                ) {
                    setSalesReport(
                        mergeSales(
                            normalizeSales(
                                salesResult.value
                            ),
                            normalizedSummarySales
                        )
                    );
                } else {
                    setSalesReport(
                        normalizedSummarySales
                    );

                    warnings.push(
                        "Detailed sales report unavailable. Existing sales summary data is being used."
                    );
                }

                // ======================================
                // REPAIR
                // ======================================

                const repairFinal =
                    await resolveModule({
                        label: "REPAIR",

                        type: "REPAIR",

                        detailedResult:
                            repairResult,

                        summaryObject:
                            summaryData?.repair ||
                            summaryData?.repairs ||
                            summaryData?.repairSummary ||
                            {},

                        summaryRoot:
                            summaryData,

                        listPaths:
                            REPAIR_LIST_PATHS,

                        from,
                        to,
                    });

                // ======================================
                // RENTAL
                // ======================================

                const rentalFinal =
                    await resolveModule({
                        label: "RENTAL",

                        type: "RENTAL",

                        detailedResult:
                            rentalResult,

                        summaryObject:
                            summaryData?.rental ||
                            summaryData?.rentals ||
                            summaryData?.rentalSummary ||
                            {},

                        summaryRoot:
                            summaryData,

                        listPaths:
                            RENTAL_LIST_PATHS,

                        from,
                        to,
                    });

                console.log(
                    "FINAL REPAIR REPORT:",
                    repairFinal.value
                );

                console.log(
                    "FINAL RENTAL REPORT:",
                    rentalFinal.value
                );

                setRepairReport(
                    repairFinal.value
                );

                setRentalReport(
                    rentalFinal.value
                );

                // ======================================
                // SALARY
                // ======================================

                let calculatedSalary = {
                    salary: 0,
                    paidAmount: 0,
                    pendingAmount: 0,
                    paidCount: 0,
                    pendingCount: 0,
                    total: 0,
                    historyFound: false,
                    matchedRows: 0,
                };

                if (
                    salaryResult.status ===
                    "fulfilled"
                ) {
                    calculatedSalary =
                        calculateSalaryReport(
                            salaryResult.value,
                            from,
                            to
                        );

                    console.log(
                        "================================"
                    );

                    console.log(
                        "FINAL SALARY REPORT:",
                        calculatedSalary
                    );

                    console.log(
                        "================================"
                    );

                    // ----------------------------------
                    // If getAllSalaryData() returned
                    // employee salary records but
                    // no payment value, we still trust
                    // that API for the selected report.
                    // ----------------------------------

                    if (
                        calculatedSalary.historyFound
                    ) {
                        console.log(
                            "SALARY SOURCE: getAllSalaryData()"
                        );
                    } else {
                        // --------------------------------
                        // Summary fallback
                        // --------------------------------

                        const fallbackSalary =
                            firstPositive([
                                summaryData?.expenses?.salary,
                                summaryData?.expenses?.salaryPaid,
                                summaryData?.expenses?.salaryPayments,
                                summaryData?.salaryPaid,
                                summaryData?.salary,
                                summaryData?.salaryPayments,
                            ]);

                        if (
                            fallbackSalary > 0
                        ) {
                            calculatedSalary = {
                                salary:
                                    fallbackSalary,

                                paidAmount:
                                    fallbackSalary,

                                pendingAmount: 0,

                                paidCount: 0,

                                pendingCount: 0,

                                total:
                                    fallbackSalary,

                                historyFound:
                                    false,

                                matchedRows:
                                    0,
                            };

                            warnings.push(
                                "Salary employee records were found but no paid salary amount was available. Existing salary summary data is being used."
                            );
                        }
                    }
                } else {
                    console.warn(
                        "SALARY API FAILED:",
                        salaryResult.reason
                    );

                    const fallbackSalary =
                        firstPositive([
                            summaryData?.expenses?.salary,
                            summaryData?.expenses?.salaryPaid,
                            summaryData?.expenses?.salaryPayments,
                            summaryData?.salaryPaid,
                            summaryData?.salary,
                            summaryData?.salaryPayments,
                        ]);

                    calculatedSalary = {
                        salary:
                            fallbackSalary,

                        paidAmount:
                            fallbackSalary,

                        pendingAmount: 0,

                        paidCount: 0,

                        pendingCount: 0,

                        total:
                            fallbackSalary,

                        historyFound:
                            false,

                        matchedRows:
                            0,
                    };

                    warnings.push(
                        "Salary API unavailable. Existing salary summary data is being used."
                    );
                }

                setSalaryReport(
                    calculatedSalary
                );

                // ======================================
                // EXPENSES
                // ======================================

                const expenses =
                    normalizeExpenses(
                        summaryData
                    );

                console.log(
                    "FINAL EXPENSE REPORT:",
                    expenses
                );

                setExpensesReport(
                    expenses
                );

                // ======================================
                // WARNINGS
                // ======================================

                if (
                    repairFinal.warning &&
                    !hasModuleData(
                        repairFinal.value
                    )
                ) {
                    warnings.push(
                        repairFinal.warning
                    );
                }

                if (
                    rentalFinal.warning &&
                    !hasModuleData(
                        rentalFinal.value
                    )
                ) {
                    warnings.push(
                        rentalFinal.warning
                    );
                }

                setReportErrors(
                    warnings
                );
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
        },
        [from, to]
    );

    useEffect(() => {
        load();
    }, [load]);

    // ==================================================
    // FINAL DATA
    // ==================================================

    const sales =
        salesReport ||
        emptySales;

    const repair =
        repairReport ||
        emptyModule;

    const rental =
        rentalReport ||
        emptyModule;

    const expenses =
        expensesReport ||
        emptyExpenses;

    // ==================================================
    // TOP COLLECTION VALUES
    // ==================================================

    const repairCollection =
        useMemo(() => {
            return firstPositive([
                repair.totalAmount,

                data?.collection?.repair,

                data?.collection?.repairs,

                data?.collection?.repairCollection,

                data?.repairCollection,

                data?.totalRepairAmount,

                data?.repair?.totalAmount,

                data?.repairs?.totalAmount,
            ]);
        }, [
            repair,
            data,
        ]);

    const rentalCollection =
        useMemo(() => {
            return firstPositive([
                rental.totalAmount,

                data?.collection?.rental,

                data?.collection?.rentals,

                data?.collection?.rentalCollection,

                data?.rentalCollection,

                data?.totalRentalAmount,

                data?.rental?.totalAmount,

                data?.rentals?.totalAmount,
            ]);
        }, [
            rental,
            data,
        ]);

    const salesCollection =
        useMemo(() => {
            return firstPositive([
                data?.collection?.sales,

                data?.collection?.sale,

                data?.salesCollection,

                data?.sales?.totalAmount,

                sales.totalSales,
            ]);
        }, [
            data,
            sales,
        ]);

    const totalCollection =
        useMemo(() => {
            const backendTotal =
                firstPositive([
                    data?.collection?.total,

                    data?.collection?.totalCollection,

                    data?.totalCollection,
                ]);

            if (
                backendTotal > 0
            ) {
                return backendTotal;
            }

            return (
                salesCollection +
                repairCollection +
                rentalCollection
            );
        }, [
            data,
            salesCollection,
            repairCollection,
            rentalCollection,
        ]);

    // ==================================================
    // EXPENSE VALUES
    // ==================================================

    const vendorPayments =
        firstPositive([
            expenses.vendorPayments,

            data?.expenses?.vendorPayments,

            data?.expenses?.vendorPayment,

            data?.vendorPayments,

            data?.totalVendorPayments,
        ]);

    // ==================================================
    // SALARY PAID
    // ==================================================
    //
    // IMPORTANT:
    //
    // If getAllSalaryData() successfully found salary
    // employee records, its result has FIRST priority.
    //
    // We do NOT use firstPositive here because a valid
    // salary result can legitimately be ₹0.
    //
    // ==================================================

    const salaryPaid =
        salaryReport?.historyFound === true
            ? Number(
                salaryReport?.paidAmount || 0
            )
            : firstPositive([
                salaryReport?.paidAmount,

                salaryReport?.salary,

                expenses.salary,

                data?.expenses?.salary,

                data?.expenses?.salaryPaid,

                data?.expenses?.salaryPayments,

                data?.salaryPaid,

                data?.salary,

                data?.salaryPayments,
            ]);

    const otherExpenses =
        firstPositive([
            expenses.other,

            data?.expenses?.other,

            data?.expenses?.otherExpenses,

            data?.otherExpenses,
        ]);

    // ==================================================
    // TOTAL EXPENSES
    // ==================================================

    const totalExpenses =
        useMemo(() => {
            /*
             * When real salary data is available,
             * calculate expenses using the same salary
             * amount displayed above.
             *
             * This prevents old backend salary totals
             * from overriding the corrected salary.
             */

            if (
                salaryReport?.historyFound === true
            ) {
                return (
                    Number(
                        vendorPayments || 0
                    ) +
                    Number(
                        salaryPaid || 0
                    ) +
                    Number(
                        otherExpenses || 0
                    )
                );
            }

            /*
             * If salary API was unavailable, preserve
             * existing backend expense total when it exists.
             */

            const backendExpenseTotal =
                firstPositive([
                    data?.expenses?.total,

                    data?.expenses?.totalExpenses,

                    data?.expenses?.totalExpense,

                    data?.expenses?.expenseTotal,

                    data?.totalExpenses,

                    data?.totalExpense,

                    data?.expenseTotal,
                ]);

            if (
                backendExpenseTotal > 0
            ) {
                return backendExpenseTotal;
            }

            return (
                Number(
                    vendorPayments || 0
                ) +
                Number(
                    salaryPaid || 0
                ) +
                Number(
                    otherExpenses || 0
                )
            );
        }, [
            vendorPayments,
            salaryPaid,
            otherExpenses,
            data,
            salaryReport,
        ]);

    // ==================================================
    // NET RESULT
    // ==================================================

    const netResult =
        useMemo(() => {
            /*
             * When salary history is available,
             * calculate using corrected expenses.
             */

            if (
                salaryReport?.historyFound === true
            ) {
                return (
                    Number(
                        totalCollection || 0
                    ) -
                    Number(
                        totalExpenses || 0
                    )
                );
            }

            /*
             * Preserve existing calculation when
             * salary history is unavailable.
             */

            const backendNet =
                firstPositive([
                    data?.result?.net,

                    data?.netResult,

                    data?.net,

                    data?.profit,

                    data?.netProfit,
                ]);

            if (
                backendNet > 0
            ) {
                return backendNet;
            }

            return (
                Number(
                    totalCollection || 0
                ) -
                Number(
                    totalExpenses || 0
                )
            );
        }, [
            totalCollection,
            totalExpenses,
            data,
            salaryReport,
        ]);

    // ==================================================
    // COMBINED BUSINESS
    // ==================================================

    const combined =
        useMemo(
            () => ({
                totalOrders:
                    Number(
                        sales.totalOrders ||
                            0
                    ) +
                    Number(
                        repair.totalOrders ||
                            0
                    ) +
                    Number(
                        rental.totalOrders ||
                            0
                    ),

                totalAmount:
                    Number(
                        sales.totalSales ||
                            0
                    ) +
                    Number(
                        repairCollection ||
                            0
                    ) +
                    Number(
                        rentalCollection ||
                            0
                    ),

                paidAmount:
                    Number(
                        sales.paidAmount ||
                            0
                    ) +
                    Number(
                        repair.paidAmount ||
                            0
                    ) +
                    Number(
                        rental.paidAmount ||
                            0
                    ),

                pendingAmount:
                    Number(
                        sales.pendingAmount ||
                            0
                    ) +
                    Number(
                        repair.pendingAmount ||
                            0
                    ) +
                    Number(
                        rental.pendingAmount ||
                            0
                    ),
            }),
            [
                sales,
                repair,
                rental,
                repairCollection,
                rentalCollection,
            ]
        );

    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="reports-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="reports-header">

                <div>
                    <h1>
                        Financial Reports
                    </h1>

                    <p>
                        Product sales,
                        walk-in sales,
                        repair, rental
                        and collections.
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

                    {loading
                        ? "Loading..."
                        : "Refresh"}
                </button>

            </div>

            {/* ========================================
                FILTERS
            ======================================== */}

            <div className="report-filters">

                <label>
                    <span>
                        From
                    </span>

                    <input
                        type="date"
                        value={from}
                        onChange={(event) =>
                            setFrom(
                                event.target.value
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
                        onChange={(event) =>
                            setTo(
                                event.target.value
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

            {/* ========================================
                ERROR
            ======================================== */}

            {error && (
                <div className="report-alert">
                    {error}
                </div>
            )}

            {/* ========================================
                WARNING
            ======================================== */}

            {reportErrors.length > 0 && (
                <div className="report-warning">

                    <strong>
                        Report Warning
                    </strong>

                    <ul>
                        {reportErrors.map(
                            (
                                message,
                                index
                            ) => (
                                <li
                                    key={index}
                                >
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

                    {/* ==================================
                        COLLECTION CARDS
                    ================================== */}

                    <div className="report-cards">

                        <FinancialCard
                            title="Sales Collection"
                            value={
                                salesCollection
                            }
                            icon={
                                <FaShoppingCart />
                            }
                        />

                        <FinancialCard
                            title="Repair Collection"
                            value={
                                repairCollection
                            }
                            icon={
                                <FaTools />
                            }
                        />

                        <FinancialCard
                            title="Rental Collection"
                            value={
                                rentalCollection
                            }
                            icon={
                                <FaLaptop />
                            }
                        />

                        <FinancialCard
                            title="Total Collection"
                            value={
                                totalCollection
                            }
                            icon={
                                <FaMoneyBillWave />
                            }
                        />

                        <FinancialCard
                            title="Vendor Payments"
                            value={
                                vendorPayments
                            }
                        />

                        <FinancialCard
                            title="Salary Paid"
                            value={
                                salaryPaid
                            }
                        />

                        <FinancialCard
                            title="Total Expenses"
                            value={
                                totalExpenses
                            }
                        />

                        <FinancialCard
                            title="Net Result"
                            value={
                                netResult
                            }
                        />

                    </div>

                    {/* ==================================
                        BUSINESS TOTAL
                    ================================== */}

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
                                    Product + Walk-in
                                    + Repair + Rental
                                </p>
                            </div>

                        </div>

                        <div className="business-grid">

                            <MiniCard
                                title="Total Orders / Jobs"
                                value={number(
                                    combined.totalOrders
                                )}
                                icon={
                                    <FaChartLine />
                                }
                            />

                            <MiniCard
                                title="Total Business Amount"
                                value={money(
                                    combined.totalAmount
                                )}
                                icon={
                                    <FaMoneyBillWave />
                                }
                            />

                            <MiniCard
                                title="Paid Amount"
                                value={money(
                                    combined.paidAmount
                                )}
                                icon={
                                    <FaCheckCircle />
                                }
                            />

                            <MiniCard
                                title="Pending Amount"
                                value={money(
                                    combined.pendingAmount
                                )}
                                icon={
                                    <FaClock />
                                }
                            />

                        </div>

                    </section>

                    {/* ==================================
                        PRODUCT SALES
                    ================================== */}

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
                                    Online Orders +
                                    Walk-in Orders
                                </p>
                            </div>

                        </div>

                        <div className="sales-source-grid">

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
                                        )}{" "}
                                        orders
                                    </small>

                                </div>

                            </div>

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
                                        )}{" "}
                                        orders
                                    </small>

                                </div>

                            </div>

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
                                        )}{" "}
                                        total orders
                                    </small>

                                </div>

                            </div>

                        </div>

                        <div className="detail-rows">

                            <ReportRow
                                label="Total Orders"
                                value={number(
                                    sales.totalOrders
                                )}
                            />

                            <ReportRow
                                label="Online Orders"
                                value={number(
                                    sales.onlineOrders
                                )}
                            />

                            <ReportRow
                                label="Walk-in Orders"
                                value={number(
                                    sales.walkInOrders
                                )}
                            />

                            <ReportRow
                                label="Online Sales"
                                value={money(
                                    sales.onlineSales
                                )}
                            />

                            <ReportRow
                                label="Walk-in Sales"
                                value={money(
                                    sales.walkInSales
                                )}
                            />

                            <ReportRow
                                label="Total Sales"
                                value={money(
                                    sales.totalSales
                                )}
                            />

                            <ReportRow
                                label="Paid Amount"
                                value={money(
                                    sales.paidAmount
                                )}
                            />

                            <ReportRow
                                label="Pending Amount"
                                value={money(
                                    sales.pendingAmount
                                )}
                            />

                        </div>

                    </section>

                    {/* ==================================
                        REPAIR + RENTAL
                    ================================== */}

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
                                        Repair jobs
                                        and collections
                                    </p>
                                </div>

                            </div>

                            <div className="module-big-value">

                                <span>
                                    Repair Collection
                                </span>

                                <strong>
                                    {money(
                                        repairCollection
                                    )}
                                </strong>

                            </div>

                            <ReportRow
                                label="Total Repair Jobs"
                                value={number(
                                    repair.totalOrders
                                )}
                            />

                            <ReportRow
                                label="Paid Amount"
                                value={money(
                                    repair.paidAmount
                                )}
                            />

                            <ReportRow
                                label="Pending Amount"
                                value={money(
                                    repair.pendingAmount
                                )}
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
                                        Rental orders
                                        and collections
                                    </p>
                                </div>

                            </div>

                            <div className="module-big-value">

                                <span>
                                    Rental Collection
                                </span>

                                <strong>
                                    {money(
                                        rentalCollection
                                    )}
                                </strong>

                            </div>

                            <ReportRow
                                label="Total Rental Orders"
                                value={number(
                                    rental.totalOrders
                                )}
                            />

                            <ReportRow
                                label="Paid Amount"
                                value={money(
                                    rental.paidAmount
                                )}
                            />

                            <ReportRow
                                label="Pending Amount"
                                value={money(
                                    rental.pendingAmount
                                )}
                            />

                        </section>

                    </div>

                    {/* ==================================
                        BUSINESS BREAKDOWN
                    ================================== */}

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
                                    Online, Walk-in,
                                    Repair and Rental
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
                                                repairCollection
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
                                                rentalCollection
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

                    {/* ==================================
                        EXPENSE BREAKDOWN
                    ================================== */}

                    <section className="report-panel">

                        <div className="panel-title">

                            <div className="title-icon">
                                <FaMoneyBillWave />
                            </div>

                            <div>
                                <h2>
                                    Expense Breakdown
                                </h2>

                                <p>
                                    Vendor payments,
                                    salary and other
                                    business expenses
                                </p>
                            </div>

                        </div>

                        <div className="detail-rows">

                            <ReportRow
                                label="Vendor Payments"
                                value={money(
                                    vendorPayments
                                )}
                            />

                            <ReportRow
                                label="Salary Paid"
                                value={money(
                                    salaryPaid
                                )}
                            />

                            <ReportRow
                                label="Other Expenses"
                                value={money(
                                    otherExpenses
                                )}
                            />

                            <ReportRow
                                label="Total Expenses"
                                value={money(
                                    totalExpenses
                                )}
                            />

                            <ReportRow
                                label="Net Result"
                                value={money(
                                    netResult
                                )}
                            />

                        </div>

                    </section>

                    {/* ==================================
                        PAYMENT METHODS
                    ================================== */}

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
                                    Collection by
                                    payment method
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

                    {/* ==================================
                        PENDING VENDOR PAYMENTS
                    ================================== */}

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
                                    Outstanding purchase
                                    payments
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
                                {pending?.count || 0}{" "}
                                purchase(s)
                            </span>

                        </div>

                        {pending?.purchases?.length ? (

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

                                        {pending.purchases.map(
                                            (
                                                purchase
                                            ) => (

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
                                                        {money(
                                                            purchase.totalAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {money(
                                                            purchase.paidAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {money(
                                                            purchase.pendingAmount
                                                        )}
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
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="no-data">
                                No pending vendor payments.
                            </div>

                        )}

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

                {icon && (
                    <div className="financial-card-icon">
                        {icon}
                    </div>
                )}

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