
import React, { useMemo } from "react";
import "./WalkInInvoice.css";
import zaidInfotechLogo from "../../../../assets/images/zaidinfotechlogo.png";

const COMPANY_STATE = "Tamil Nadu";

// ============================================================
// COMMON HELPERS
// ============================================================

const safeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const round2 = (value) =>
    Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

const formatCurrency = (value) =>
    `₹ ${safeNumber(value).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const firstValue = (...values) =>
    values.find(
        (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
    );

const getFullName = (person) => {
    if (!person) return "";

    if (typeof person === "string") return person;

    const combinedName = [
        person.firstName,
        person.lastName,
    ].filter(Boolean).join(" ");

    return firstValue(
        person.fullName,
        person.name,
        person.username,
        person.displayName,
        combinedName,
        person.email
    ) || "";
};

const normalizeSource = (value) =>
    String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

const getAddressText = (address = {}) => {
    if (!address || typeof address !== "object") return "-";

    const parts = [
        address.addressLine,
        address.address,
        address.address1,
        address.address2,
        address.street,
        address.locality,
        address.area,
        address.landmark,
        address.city,
        address.district,
        address.state,
        address.pincode,
        address.postalCode,
        address.zipCode,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "-";
};

// ============================================================
// AMOUNT IN WORDS
// ============================================================

const numberToWordsBelow100 = (number) => {
    const ones = [
        "", "One", "Two", "Three", "Four", "Five",
        "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen",
        "Nineteen",
    ];

    const tens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    if (number < 20) return ones[number] || "";

    const ten = Math.floor(number / 10);
    const one = number % 10;

    return `${tens[ten]}${one ? ` ${ones[one]}` : ""}`;
};

const numberToIndianWords = (number) => {
    const value = Math.floor(Math.abs(safeNumber(number)));

    if (value === 0) return "Zero";

    const parts = [];

    const crore = Math.floor(value / 10000000);
    const lakh = Math.floor((value % 10000000) / 100000);
    const thousand = Math.floor((value % 100000) / 1000);
    const hundred = Math.floor((value % 1000) / 100);
    const remainder = value % 100;

    if (crore) parts.push(`${numberToIndianWords(crore)} Crore`);
    if (lakh) parts.push(`${numberToIndianWords(lakh)} Lakh`);
    if (thousand) parts.push(`${numberToIndianWords(thousand)} Thousand`);
    if (hundred) parts.push(`${numberToIndianWords(hundred)} Hundred`);
    if (remainder) parts.push(numberToWordsBelow100(remainder));

    return parts.join(" ");
};

const amountInWords = (amount) => {
    const value = round2(amount);
    const rupees = Math.floor(value);
    const paise = Math.round((value - rupees) * 100);

    if (paise > 0) {
        return `${numberToIndianWords(rupees)} Rupees and ${numberToIndianWords(paise)} Paise Only`;
    }

    return `${numberToIndianWords(rupees)} Rupees Only`;
};

// ============================================================
// COMPANY DETAILS
// ============================================================

const COMPANY = {
    name: "ZAID INFOTECH",
    address:
        "No 232, 1st Floor, M.K.N. Road, Alandur, Chennai, Tamil Nadu, 600016",
    gstin: "33AIOPFB710C1ZL",
    pan: "AIOPFB710C",
    mobile: "9092590725",
    email: "info@zaidinfotech.in",
    website: "www.zaidinfotech.in",
    tagline: "Affordable Tech for Everyone",
};

const BANK = {
    name: "ZAID INFOTECH",
    ifsc: "KVBL0001104",
    account: "1104011000000054",
    bank: "Karur Vysya Bank, CHENNAI ALANDUR",
};

// ============================================================
// COMPONENT
// ============================================================

function WalkInInvoice({ order, onClose }) {
    // IMPORTANT:
    // Do not return before hooks. This prevents React hook-order errors.

    const data = useMemo(() => {
        const nestedOrder =
            order?.order && typeof order.order === "object"
                ? order.order
                : {};

        return {
            ...nestedOrder,
            ...(order || {}),
        };
    }, [order]);

    // ========================================================
    // SOURCE / WALK-IN DETECTION
    // ========================================================

    const rawSource = firstValue(
        order?.orderSource,
        data.orderSource,
        order?.source,
        data.source,
        order?.saleSource,
        data.saleSource,
        order?.transactionType,
        data.transactionType,
        order?.orderType,
        data.orderType,
        "WALK_IN"
    );

    const orderSource = normalizeSource(rawSource);

    const isWalkIn = [
        "WALK_IN",
        "WALKIN",
        "WALK_IN_SALE",
        "IN_STORE",
        "STORE",
        "OFFLINE",
        "COUNTER",
    ].includes(orderSource);

    // ========================================================
    // SALESPERSON / EMPLOYEE DETAILS
    // ========================================================

    const employee = firstValue(
        data.soldBy,
        data.salesPerson,
        data.salesperson,
        data.salesExecutive,
        data.createdBy,
        data.employee,
        data.user,
        data.staff,
        data.processedBy,
        data.cashier,
        data.createdByUser,
        data.order?.soldBy,
        data.order?.salesPerson,
        data.order?.createdBy,
        order?.soldBy,
        order?.salesPerson,
        order?.salesperson,
        order?.createdBy,
        order?.employee
    );

    const employeeName =
        typeof employee === "string"
            ? employee
            : getFullName(employee) ||
              firstValue(
                  data.soldByName,
                  data.salesPersonName,
                  data.salespersonName,
                  data.employeeName,
                  data.createdByName,
                  data.cashierName
              ) ||
              "";

    const employeeRole =
        typeof employee === "object" && employee
            ? firstValue(
                  employee.role,
                  employee.roleName,
                  employee.designation,
                  employee.dashboard,
                  employee.userRole,
                  employee.department
              )
            : firstValue(
                  data.salesPersonRole,
                  data.employeeRole,
                  data.createdByRole,
                  data.soldByRole
              );

    const employeeEmail =
        typeof employee === "object" && employee
            ? firstValue(employee.email, employee.emailAddress)
            : firstValue(data.salesPersonEmail, data.employeeEmail);

    const displayEmployeeRole = employeeRole
        ? String(employeeRole).replace(/[_-]+/g, " ")
        : "";

    // ========================================================
    // INVOICE TYPE
    // ========================================================

    const isNonGst =
        normalizeSource(data.invoiceType || "GST") === "NON_GST";

    // ========================================================
    // CUSTOMER DETAILS
    // ========================================================

    const customer =
        data.billingAddress ||
        data.shippingAddress ||
        data.customer ||
        data.user ||
        {};

    const shippingAddress =
        data.shippingAddress ||
        data.billingAddress ||
        data.customer ||
        data.user ||
        {};

    const customerName =
        firstValue(
            customer.fullName,
            customer.name,
            getFullName(data.customer),
            getFullName(data.user),
            data.customerName,
            data.userName
        ) || "Walk-In Customer";

    const customerPhone =
        firstValue(
            customer.phone,
            customer.mobile,
            customer.phoneNumber,
            data.customerPhone,
            data.phone,
            data.mobile
        ) || "-";

    const customerEmail =
        firstValue(customer.email, data.customerEmail, data.email) || "";

    // ========================================================
    // INVOICE DETAILS
    // ========================================================

    const invoiceNumber =
        firstValue(
            data.invoiceNumber,
            data.invoiceNo,
            data.invoice_id,
            data.orderNumber,
            data.orderNo,
            data._id
        ) || "N/A";

    const invoiceDate =
        data.invoiceDate || data.createdAt || new Date();

    const dueDate =
        data.dueDate ||
        data.paymentDueDate ||
        invoiceDate;

    const paymentMethod =
        firstValue(
            data.paymentMethod,
            data.payment_mode,
            data.paymentMode,
            "CASH"
        );

    const paymentStatus =
        firstValue(
            data.paymentStatus,
            data.payment_status,
            "PAID"
        );

    // ========================================================
    // ITEMS
    // ========================================================

    const items = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.orderItems)
        ? data.orderItems
        : [];

    const getItemName = (item) =>
        firstValue(
            item.title,
            item.name,
            item.productName,
            item.product?.title,
            item.product?.name,
            item.product?.productName
        ) || "Product";

    const getItemDescription = (item) =>
        firstValue(
            item.description,
            item.product?.description
        ) || "";

    const getItemHsn = (item) =>
        firstValue(
            item.hsnSac,
            item.hsn,
            item.sac,
            item.hsnCode,
            item.product?.hsnSac,
            item.product?.hsn,
            item.product?.sac
        ) || "-";

    const getItemQuantity = (item) =>
        safeNumber(item.quantity ?? item.qty ?? 1, 1);

    const getItemPrice = (item) =>
        safeNumber(
            item.finalPrice ??
            item.sellingPrice ??
            item.price ??
            item.unitPrice ??
            item.rate ??
            item.originalPrice ??
            item.product?.finalPrice ??
            item.product?.sellingPrice ??
            item.product?.price ??
            0
        );

    const getItemTotal = (item) => {
        const quantity = getItemQuantity(item);
        const price = getItemPrice(item);

        return round2(
            safeNumber(
                item.total ??
                item.itemTotal ??
                item.amount ??
                item.lineTotal,
                price * quantity
            )
        );
    };

    const calculatedItemsSubtotal = useMemo(
        () =>
            round2(
                items.reduce(
                    (sum, item) => sum + getItemTotal(item),
                    0
                )
            ),
        [items]
    );

    // ========================================================
    // SAVED PRICING
    // ========================================================

    const hasSavedPricing =
        data.gstAmount !== undefined ||
        data.finalAmount !== undefined ||
        data.taxableAmount !== undefined ||
        data.shippingCharge !== undefined ||
        data.couponDiscount !== undefined ||
        data.offerDiscount !== undefined;

    const subtotal = round2(
        firstValue(
            data.subtotal,
            data.subTotal,
            data.totalBeforeDiscount,
            calculatedItemsSubtotal,
            data.totalAmount
        ) || 0
    );

    const offerDiscount = round2(
        data.offerDiscount ??
        data.offerDiscountAmount ??
        data.discountFromOffer ??
        0
    );

    const discount = round2(
        data.discount ??
        data.discountAmount ??
        0
    );

    const couponDiscount = round2(
        data.couponDiscount ??
        data.couponDiscountAmount ??
        0
    );

    const couponCode =
        data.couponCode ||
        data.appliedCoupon ||
        data.coupon ||
        "";

    const totalDiscount = round2(
        offerDiscount + couponDiscount + discount
    );

    const calculatedTaxableAmount = Math.max(
        round2(
            subtotal -
            offerDiscount -
            discount -
            couponDiscount
        ),
        0
    );

    const taxableAmount = round2(
        data.taxableAmount != null
            ? data.taxableAmount
            : data.taxableValue != null
            ? data.taxableValue
            : calculatedTaxableAmount
    );

    const gstPercentage = safeNumber(
        data.gstPercentage ?? data.gstRate ?? 18,
        18
    );

    const calculatedGstAmount = round2(
        (taxableAmount * gstPercentage) / 100
    );

    const gstAmount = isNonGst
        ? 0
        : round2(
              data.gstAmount != null
                  ? data.gstAmount
                  : data.taxAmount != null
                  ? data.taxAmount
                  : data.tax != null
                  ? data.tax
                  : calculatedGstAmount
          );

    const shippingCharge = round2(
        data.shippingCharge ??
        data.shipping ??
        data.deliveryCharge ??
        0
    );

    const otherCharges = round2(
        data.otherCharges ??
        data.additionalCharges ??
        0
    );

    // ========================================================
    // CUSTOMER STATE / GST SPLIT
    // ========================================================

    const customerState = String(
        firstValue(
            shippingAddress.state,
            customer.state,
            data.customerState
        ) || ""
    ).trim().toLowerCase();

    const isIntraState =
        !customerState ||
        customerState.includes(COMPANY_STATE.toLowerCase());

    const cgst = isIntraState ? round2(gstAmount / 2) : 0;
    const sgst = isIntraState ? round2(gstAmount - cgst) : 0;
    const igst = isIntraState ? 0 : gstAmount;

    const showIgstColumns = !isIntraState;

    // ========================================================
    // FINAL AMOUNT
    // ========================================================

    const calculatedFinalAmount = round2(
        taxableAmount +
        gstAmount +
        shippingCharge +
        otherCharges
    );

    const totalAmount = round2(
        data.finalAmount != null
            ? data.finalAmount
            : data.grandTotal != null
            ? data.grandTotal
            : data.totalAmount != null
            ? data.totalAmount
            : calculatedFinalAmount
    );

    // ========================================================
    // PAYMENT
    // ========================================================

    const normalizedPaymentStatus =
        normalizeSource(paymentStatus);

    const isPaid = [
        "PAID",
        "SUCCESS",
        "COMPLETED",
        "CAPTURED",
    ].includes(normalizedPaymentStatus);

    const paidAmount = round2(
        data.paidAmount != null
            ? data.paidAmount
            : isPaid
            ? totalAmount
            : 0
    );

    const balanceAmount = round2(
        data.balanceAmount != null
            ? data.balanceAmount
            : Math.max(totalAmount - paidAmount, 0)
    );

    const totalQuantity = items.reduce(
        (sum, item) => sum + getItemQuantity(item),
        0
    );

    // ========================================================
    // TAX ROWS
    // ========================================================

    const taxRows = useMemo(() => {
        if (!items.length || isNonGst) return [];

        if (!hasSavedPricing) {
            return items.map((item) => {
                const itemTotal = getItemTotal(item);

                const itemCgst = safeNumber(
                    item.cgst ?? item.cgstAmount ?? 0
                );

                const itemSgst = safeNumber(
                    item.sgst ?? item.sgstAmount ?? 0
                );

                const itemIgst = safeNumber(
                    item.igst ?? item.igstAmount ?? 0
                );

                const itemTax = safeNumber(
                    item.totalTax ??
                    item.taxAmount ??
                    itemCgst + itemSgst + itemIgst
                );

                return {
                    hsn: getItemHsn(item),
                    taxable: round2(
                        item.taxableValue ??
                        item.taxableAmount ??
                        itemTotal
                    ),
                    cgstRate:
                        item.cgstRate ??
                        item.taxDetails?.cgstRate ??
                        "",
                    cgst: round2(itemCgst),
                    sgstRate:
                        item.sgstRate ??
                        item.taxDetails?.sgstRate ??
                        "",
                    sgst: round2(itemSgst),
                    igstRate:
                        item.igstRate ??
                        item.taxDetails?.igstRate ??
                        "",
                    igst: round2(itemIgst),
                    totalTax: round2(itemTax),
                };
            });
        }

        const lineAmounts = items.map(getItemTotal);

        const lineTotal = lineAmounts.reduce(
            (sum, value) => sum + value,
            0
        );

        let rows = items.map((item, index) => {
            const line = lineAmounts[index];

            const couponShare =
                lineTotal > 0
                    ? round2((couponDiscount * line) / lineTotal)
                    : 0;

            const taxable = Math.max(
                round2(line - couponShare),
                0
            );

            const gst = isNonGst
                ? 0
                : round2((taxable * gstPercentage) / 100);

            return {
                hsn: getItemHsn(item),
                taxable,
                gst,
            };
        });

        if (rows.length > 0) {
            const rowTaxable = rows.reduce(
                (sum, row) => sum + row.taxable,
                0
            );

            const rowGst = rows.reduce(
                (sum, row) => sum + row.gst,
                0
            );

            const lastIndex = rows.length - 1;

            rows[lastIndex] = {
                ...rows[lastIndex],
                taxable: Math.max(
                    round2(
                        rows[lastIndex].taxable +
                        (taxableAmount - rowTaxable)
                    ),
                    0
                ),
                gst: Math.max(
                    round2(
                        rows[lastIndex].gst +
                        (gstAmount - rowGst)
                    ),
                    0
                ),
            };
        }

        return rows.map((row) => {
            if (isIntraState) {
                const rowCgst = round2(row.gst / 2);
                const rowSgst = round2(row.gst - rowCgst);

                return {
                    hsn: row.hsn,
                    taxable: row.taxable,
                    cgstRate: gstPercentage / 2,
                    cgst: rowCgst,
                    sgstRate: gstPercentage / 2,
                    sgst: rowSgst,
                    igstRate: "",
                    igst: 0,
                    totalTax: row.gst,
                };
            }

            return {
                hsn: row.hsn,
                taxable: row.taxable,
                cgstRate: "",
                cgst: 0,
                sgstRate: "",
                sgst: 0,
                igstRate: gstPercentage,
                igst: row.gst,
                totalTax: row.gst,
            };
        });
    }, [
        items,
        isNonGst,
        hasSavedPricing,
        couponDiscount,
        gstPercentage,
        taxableAmount,
        gstAmount,
        isIntraState,
    ]);

    // ========================================================
    // PRINT INVOICE
    // ========================================================

    const printInvoice = () => {
        try {
            const invoiceElement =
                document.querySelector(".wkinv-container");

            if (!invoiceElement) {
                alert("Invoice not found. Please try again.");
                return;
            }

            const printFrame = document.createElement("iframe");

            printFrame.setAttribute(
                "title",
                "Walk-In Invoice Print"
            );

            Object.assign(printFrame.style, {
                position: "fixed",
                right: "0",
                bottom: "0",
                width: "0",
                height: "0",
                border: "0",
                opacity: "0",
                pointerEvents: "none",
            });

            document.body.appendChild(printFrame);

            const printDocument =
                printFrame.contentDocument ||
                printFrame.contentWindow.document;

            printDocument.open();

            printDocument.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Invoice - ${invoiceNumber}</title>
                    <style>
                        @page {
                            size: A4 portrait;
                            margin: 7mm;
                        }

                        html, body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            background: #fff !important;
                            color: #111 !important;
                            font-family: Arial, Helvetica, sans-serif !important;
                        }

                        #print-root {
                            width: 100% !important;
                            margin: 0 auto !important;
                        }

                        .wkinv-container {
                            display: block !important;
                            width: 100% !important;
                            max-width: 190mm !important;
                            min-width: 0 !important;
                            margin: 0 auto !important;
                            padding: 5mm !important;
                            box-sizing: border-box !important;
                            background: #fff !important;
                            color: #111 !important;
                            border: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            overflow: visible !important;
                        }

                        .wkinv-container * {
                            visibility: visible !important;
                            opacity: 1 !important;
                            color: #111 !important;
                        }

                        .wkinv-buttons {
                            display: none !important;
                        }

                        .wkinv-company-logo,
                        .wkinv-sign-logo {
                            display: block !important;
                            max-width: 100% !important;
                            object-fit: contain !important;
                        }

                        .wkinv-table-wrap,
                        .wkinv-tax-summary {
                            width: 100% !important;
                            overflow: visible !important;
                        }

                        .wkinv-items-table,
                        .wkinv-tax-table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                        }

                        .wkinv-items-table thead,
                        .wkinv-tax-table thead {
                            display: table-header-group !important;
                        }

                        tr,
                        .wkinv-document-top,
                        .wkinv-company-header,
                        .wkinv-address-grid,
                        .wkinv-table-wrap,
                        .wkinv-tax-summary,
                        .wkinv-summary-grid,
                        .wkinv-bottom-grid,
                        .wkinv-footer {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }
                    </style>
                </head>
                <body>
                    <div id="print-root"></div>
                </body>
                </html>
            `);

            printDocument.close();

            document
                .querySelectorAll('style, link[rel="stylesheet"]')
                .forEach((styleNode) => {
                    try {
                        printDocument.head.appendChild(
                            styleNode.cloneNode(true)
                        );
                    } catch (error) {
                        console.warn("Stylesheet copy error:", error);
                    }
                });

            const invoiceClone = invoiceElement.cloneNode(true);

            invoiceClone
                .querySelectorAll(".wkinv-buttons")
                .forEach((element) => element.remove());

            invoiceClone
                .querySelectorAll("*")
                .forEach((element) => {
                    element.style.visibility = "visible";
                    element.style.opacity = "1";
                });

            printDocument
                .getElementById("print-root")
                .appendChild(invoiceClone);

            const images = Array.from(printDocument.images);

            const waitForImages = images.map(
                (image) =>
                    new Promise((resolve) => {
                        if (image.complete) {
                            resolve();
                        } else {
                            image.onload = resolve;
                            image.onerror = resolve;
                        }
                    })
            );

            const waitForFonts =
                printDocument.fonts?.ready || Promise.resolve();

            Promise.all([
                ...waitForImages,
                waitForFonts,
            ]).then(() => {
                setTimeout(() => {
                    try {
                        printFrame.contentWindow.focus();
                        printFrame.contentWindow.print();
                    } catch (error) {
                        console.error("Print error:", error);
                        alert("Unable to print invoice.");
                    }

                    setTimeout(() => {
                        printFrame.remove();
                    }, 2000);
                }, 500);
            });
        } catch (error) {
            console.error("WALK-IN INVOICE PRINT ERROR:", error);
            alert("Unable to print invoice. Please try again.");
        }
    };

    // All hooks are above this return.
    if (!order) return null;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="wkinv-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Walk-in invoice"
        >
            <div className="wkinv-container">

                {/* TOP */}
                <div className="wkinv-document-top">
                    <span className="wkinv-document-title">
                        {isNonGst ? "NON-GST INVOICE" : "TAX INVOICE"}
                    </span>

                    <span className="wkinv-recipient-label">
                        ORIGINAL FOR RECIPIENT
                    </span>

                    <span className="wkinv-tagline">
                        “{COMPANY.tagline}”
                    </span>
                </div>

                {/* COMPANY HEADER */}
                <div className="wkinv-company-header">
                    <div className="wkinv-company-left">
                        <div className="wkinv-logo-wrap">
                            <img
                                src={zaidInfotechLogo}
                                alt="Zaid Infotech Logo"
                                className="wkinv-company-logo"
                            />
                        </div>

                        <div className="wkinv-company-details">
                            <h1 className="wkinv-company-name">
                                {COMPANY.name}
                            </h1>

                            <p className="wkinv-company-address">
                                {COMPANY.address}
                            </p>

                            <div className="wkinv-company-meta-grid">
                                {!isNonGst && (
                                    <p>
                                        <strong>GSTIN:</strong> {COMPANY.gstin}
                                    </p>
                                )}

                                <p>
                                    <strong>Mobile:</strong> {COMPANY.mobile}
                                </p>

                                <p>
                                    <strong>PAN:</strong> {COMPANY.pan}
                                </p>

                                <p>
                                    <strong>Email:</strong> {COMPANY.email}
                                </p>

                                <p className="wkinv-company-website">
                                    <strong>Website:</strong> {COMPANY.website}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="wkinv-invoice-meta">
                        <div className="wkinv-meta-row">
                            <span>Invoice No.</span>
                            <strong>{invoiceNumber}</strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Invoice Date</span>
                            <strong>{formatDate(invoiceDate)}</strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Due Date</span>
                            <strong>{formatDate(dueDate)}</strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Invoice Type</span>
                            <strong>
                                {orderSource.replace(/_/g, " ")}
                            </strong>
                        </div>

                        {/* WALK-IN EMPLOYEE DETAILS */}
                        {isWalkIn && (
                            <>
                                <div className="wkinv-meta-row wkinv-employee-row">
                                    <span>Sold By</span>
                                    <strong>
                                        {employeeName || "Employee details unavailable"}
                                    </strong>
                                </div>

                                {displayEmployeeRole && (
                                    <div className="wkinv-meta-row">
                                        <span>Employee Role</span>
                                        <strong>{displayEmployeeRole}</strong>
                                    </div>
                                )}

                                {employeeEmail && (
                                    <div className="wkinv-meta-row">
                                        <span>Employee Email</span>
                                        <strong>{employeeEmail}</strong>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* BILL TO / SHIP TO */}
                <div className="wkinv-address-grid">
                    <div className="wkinv-address-box">
                        <div className="wkinv-box-title">BILL TO</div>

                        <h3 className="wkinv-customer-name">
                            {customerName}
                        </h3>

                        <p>
                            <strong>Address:</strong>{" "}
                            {getAddressText(customer)}
                        </p>

                        <p>
                            <strong>Mobile:</strong> {customerPhone}
                        </p>

                        {customerEmail && (
                            <p>
                                <strong>Email:</strong> {customerEmail}
                            </p>
                        )}

                        {customer.gstin && (
                            <p>
                                <strong>GSTIN:</strong> {customer.gstin}
                            </p>
                        )}
                    </div>

                    <div className="wkinv-address-box">
                        <div className="wkinv-box-title">SHIP TO</div>

                        <h3 className="wkinv-customer-name">
                            {firstValue(
                                shippingAddress.fullName,
                                shippingAddress.name,
                                customerName
                            )}
                        </h3>

                        <p>
                            <strong>Address:</strong>{" "}
                            {getAddressText(shippingAddress)}
                        </p>

                        <p>
                            <strong>Mobile:</strong>{" "}
                            {firstValue(
                                shippingAddress.phone,
                                shippingAddress.mobile,
                                customerPhone
                            )}
                        </p>

                        {shippingAddress.gstin && (
                            <p>
                                <strong>GSTIN:</strong> {shippingAddress.gstin}
                            </p>
                        )}
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="wkinv-table-wrap">
                    <table className="wkinv-items-table">
                        <thead>
                            <tr>
                                <th className="wkinv-col-sno">S.NO.</th>
                                <th className="wkinv-col-product">
                                    PRODUCT / DESCRIPTION
                                </th>
                                <th className="wkinv-col-hsn">HSN/SAC</th>
                                <th className="wkinv-col-qty">QTY.</th>
                                <th className="wkinv-col-rate">RATE</th>
                                <th className="wkinv-col-amount">AMOUNT</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="wkinv-empty-cell">
                                        No items found
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr
                                        key={
                                            item._id ||
                                            item.product ||
                                            item.productId ||
                                            index
                                        }
                                    >
                                        <td className="wkinv-center">
                                            {index + 1}
                                        </td>

                                        <td className="wkinv-product-cell">
                                            <strong>{getItemName(item)}</strong>

                                            {getItemDescription(item) && (
                                                <span className="wkinv-item-description">
                                                    {getItemDescription(item)}
                                                </span>
                                            )}
                                        </td>

                                        <td className="wkinv-center">
                                            {getItemHsn(item)}
                                        </td>

                                        <td className="wkinv-center">
                                            {getItemQuantity(item)}
                                        </td>

                                        <td className="wkinv-right">
                                            {formatCurrency(getItemPrice(item))}
                                        </td>

                                        <td className="wkinv-right">
                                            {formatCurrency(getItemTotal(item))}
                                        </td>
                                    </tr>
                                ))
                            )}

                            {items.length > 0 && items.length < 5 && (
                                <tr className="wkinv-space-row">
                                    <td colSpan="6">&nbsp;</td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan="3" className="wkinv-total-label">
                                    TOTAL
                                </td>

                                <td className="wkinv-center">
                                    {totalQuantity}
                                </td>

                                <td></td>

                                <td className="wkinv-right wkinv-total-value">
                                    {formatCurrency(calculatedItemsSubtotal)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* TAX SUMMARY */}
                {!isNonGst && (
                    <div className="wkinv-tax-summary">
                        <table className="wkinv-tax-table">
                            <thead>
                                <tr>
                                    <th rowSpan="2">HSN/SAC</th>
                                    <th rowSpan="2">Taxable Value</th>

                                    {showIgstColumns ? (
                                        <th colSpan="2">IGST</th>
                                    ) : (
                                        <>
                                            <th colSpan="2">CGST</th>
                                            <th colSpan="2">SGST</th>
                                        </>
                                    )}

                                    <th rowSpan="2">Total Tax</th>
                                </tr>

                                <tr>
                                    {showIgstColumns ? (
                                        <>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {taxRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={showIgstColumns ? 5 : 7}>
                                            -
                                        </td>
                                    </tr>
                                ) : (
                                    taxRows.map((row, index) => (
                                        <tr key={`tax-${index}`}>
                                            <td>{row.hsn}</td>
                                            <td>{formatCurrency(row.taxable)}</td>

                                            {showIgstColumns ? (
                                                <>
                                                    <td>
                                                        {row.igstRate !== ""
                                                            ? `${row.igstRate}%`
                                                            : "-"}
                                                    </td>
                                                    <td>{formatCurrency(row.igst)}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>
                                                        {row.cgstRate !== ""
                                                            ? `${row.cgstRate}%`
                                                            : "-"}
                                                    </td>
                                                    <td>{formatCurrency(row.cgst)}</td>
                                                    <td>
                                                        {row.sgstRate !== ""
                                                            ? `${row.sgstRate}%`
                                                            : "-"}
                                                    </td>
                                                    <td>{formatCurrency(row.sgst)}</td>
                                                </>
                                            )}

                                            <td>{formatCurrency(row.totalTax)}</td>
                                        </tr>
                                    ))
                                )}

                                <tr className="wkinv-tax-total-row">
                                    <td><strong>Total</strong></td>
                                    <td><strong>{formatCurrency(taxableAmount)}</strong></td>

                                    {showIgstColumns ? (
                                        <>
                                            <td>-</td>
                                            <td><strong>{formatCurrency(igst)}</strong></td>
                                        </>
                                    ) : (
                                        <>
                                            <td>-</td>
                                            <td><strong>{formatCurrency(cgst)}</strong></td>
                                            <td>-</td>
                                            <td><strong>{formatCurrency(sgst)}</strong></td>
                                        </>
                                    )}

                                    <td><strong>{formatCurrency(gstAmount)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TOTAL SUMMARY */}
                <div className="wkinv-summary-grid">
                    <div className="wkinv-summary-left">
                        <div className="wkinv-payment-card">
                            <div className="wkinv-box-title">
                                PAYMENT DETAILS
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Payment Method</span>
                                <strong>
                                    {String(paymentMethod).replace(/_/g, " ")}
                                </strong>
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Payment Status</span>
                                <strong>
                                    {String(paymentStatus).replace(/_/g, " ")}
                                </strong>
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Order Source</span>
                                <strong>
                                    {orderSource.replace(/_/g, " ")}
                                </strong>
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Invoice Type</span>
                                <strong>{isNonGst ? "NON GST" : "GST"}</strong>
                            </div>

                            {couponCode && (
                                <div className="wkinv-payment-row">
                                    <span>Coupon</span>
                                    <strong>{couponCode}</strong>
                                </div>
                            )}

                            {/* WALK-IN EMPLOYEE DETAILS */}
                            {isWalkIn && (
                                <>
                                    <div className="wkinv-payment-row">
                                        <span>Sold By</span>
                                        <strong>
                                            {employeeName || "Not Available"}
                                        </strong>
                                    </div>

                                    {displayEmployeeRole && (
                                        <div className="wkinv-payment-row">
                                            <span>Employee Role</span>
                                            <strong>{displayEmployeeRole}</strong>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="wkinv-amount-words">
                            <strong>Total Amount (in words)</strong>
                            <span>{amountInWords(totalAmount)}</span>
                        </div>
                    </div>

                    {/* GRAND TOTAL */}
                    <div className="wkinv-grand-total-card">
                        <div className="wkinv-grand-row">
                            <span>Subtotal</span>
                            <strong>{formatCurrency(subtotal)}</strong>
                        </div>

                        {offerDiscount > 0 && (
                            <div className="wkinv-grand-row">
                                <span>Offer Discount</span>
                                <strong>- {formatCurrency(offerDiscount)}</strong>
                            </div>
                        )}

                        {discount > 0 && (
                            <div className="wkinv-grand-row">
                                <span>Discount</span>
                                <strong>- {formatCurrency(discount)}</strong>
                            </div>
                        )}

                        {couponDiscount > 0 && (
                            <div className="wkinv-grand-row">
                                <span>
                                    Coupon Discount
                                    {couponCode ? ` (${couponCode})` : ""}
                                </span>
                                <strong>- {formatCurrency(couponDiscount)}</strong>
                            </div>
                        )}

                        {totalDiscount > 0 && (
                            <div className="wkinv-grand-row">
                                <span>Total Discount</span>
                                <strong>- {formatCurrency(totalDiscount)}</strong>
                            </div>
                        )}

                        {!isNonGst && (
                            <>
                                <div className="wkinv-grand-row">
                                    <span>Taxable Value</span>
                                    <strong>{formatCurrency(taxableAmount)}</strong>
                                </div>

                                {showIgstColumns ? (
                                    <div className="wkinv-grand-row">
                                        <span>IGST ({gstPercentage}%)</span>
                                        <strong>{formatCurrency(igst)}</strong>
                                    </div>
                                ) : (
                                    <>
                                        <div className="wkinv-grand-row">
                                            <span>
                                                CGST ({gstPercentage / 2}%)
                                            </span>
                                            <strong>{formatCurrency(cgst)}</strong>
                                        </div>

                                        <div className="wkinv-grand-row">
                                            <span>
                                                SGST ({gstPercentage / 2}%)
                                            </span>
                                            <strong>{formatCurrency(sgst)}</strong>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="wkinv-grand-row">
                            <span>Shipping</span>
                            <strong>
                                {shippingCharge > 0
                                    ? formatCurrency(shippingCharge)
                                    : "Free"}
                            </strong>
                        </div>

                        {otherCharges > 0 && (
                            <div className="wkinv-grand-row">
                                <span>Other Charges</span>
                                <strong>{formatCurrency(otherCharges)}</strong>
                            </div>
                        )}

                        <div className="wkinv-grand-divider"></div>

                        <div className="wkinv-grand-row wkinv-final-row">
                            <span>Grand Total</span>
                            <strong>{formatCurrency(totalAmount)}</strong>
                        </div>

                        <div className="wkinv-grand-row">
                            <span>Paid</span>
                            <strong>{formatCurrency(paidAmount)}</strong>
                        </div>

                        <div className="wkinv-grand-row">
                            <span>Balance</span>
                            <strong>{formatCurrency(balanceAmount)}</strong>
                        </div>
                    </div>
                </div>

                {/* BANK + SIGNATURE */}
                <div className="wkinv-bottom-grid">
                    <div className="wkinv-bank-details">
                        <div className="wkinv-bottom-title">
                            Bank Details
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Name:</span>
                            <strong>{BANK.name}</strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>IFSC Code:</span>
                            <strong>{BANK.ifsc}</strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Account No:</span>
                            <strong>{BANK.account}</strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Bank:</span>
                            <strong>{BANK.bank}</strong>
                        </div>
                    </div>

                    <div className="wkinv-authorized-sign">
                        <div className="wkinv-sign-logo-box"></div>

                        <div className="wkinv-sign-line">
                            ______________________________
                        </div>

                        <strong>Authorised Signatory For</strong>
                        <span>{COMPANY.name}</span>
                    </div>

                    <div className="wkinv-receiver-sign">
                        <div className="wkinv-sign-line">
                            ______________________________
                        </div>
                        <strong>Receiver's Signature</strong>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="wkinv-footer">
                    <div>
                        <strong>Thank You For Shopping With Us</strong>
                        <span>{COMPANY.name}</span>
                    </div>

                    <div className="wkinv-footer-right">
                        <span>This is a computer-generated invoice.</span>
                        <span>{COMPANY.website}</span>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="wkinv-buttons">
                    <button
                        type="button"
                        className="wkinv-print-btn"
                        onClick={printInvoice}
                    >
                        PRINT INVOICE
                    </button>

                    <button
                        type="button"
                        className="wkinv-close-btn"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WalkInInvoice;
