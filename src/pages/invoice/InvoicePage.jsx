import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { getInvoiceById } from "../../services/invoiceService.js";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoiceRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD INVOICE
  // ==========================================

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInvoiceById(id);

        setInvoice(
          response?.data || response?.invoice || response
        );
      } catch (err) {
        console.error("Invoice loading error:", err);

        setError(
          err?.response?.data?.message ||
          "Unable to load invoice."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadInvoice();
    }
  }, [id]);


  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {
    window.print();
  };


  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const element = invoiceRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL(
        "image/png"
      );

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pdfWidth = 210;

      const pdfHeight =
        (canvas.height * pdfWidth) /
        canvas.width;

      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `${invoice?.invoiceNumber || "invoice"}.pdf`
      );
    } catch (err) {
      console.error(
        "PDF generation error:",
        err
      );

      toast.error(
        "Unable to generate PDF."
      );
    }
  };


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(Number(value || 0));
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading invoice...</span>
        </div>
      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <FileText size={50} />

        <h2 className="text-xl font-semibold mt-4">
          Invoice not found
        </h2>

        <p className="text-gray-500 mt-2">
          {error || "Unable to find this invoice."}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
        >
          Go Back
        </button>
      </div>
    );
  }


  const customer =
    invoice.user || {};

  const order =
    invoice.order || {};

  const payment =
    invoice.payment || {};


  const billing =
    invoice.billingAddress || {};


  return (
    <>
      {/* ==========================================
          ACTION BAR
      ========================================== */}

      <div className="invoice-actions bg-gray-100 border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>


          <div className="flex flex-wrap gap-2">

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
            >
              <Printer size={18} />
              Print
            </button>


            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download size={18} />
              Download PDF
            </button>

          </div>
        </div>
      </div>


      {/* ==========================================
          INVOICE
      ========================================== */}

      <div className="bg-gray-200 min-h-screen py-8 px-4">

        <div
          ref={invoiceRef}
          className="invoice-document max-w-4xl mx-auto bg-white shadow-lg"
        >

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="p-8 border-b">

            <div className="flex flex-col sm:flex-row justify-between gap-6">

              <div>

                <h1 className="text-3xl font-bold tracking-wide">
                  FIXFLOW
                </h1>

                <p className="text-gray-500 mt-1">
                  ZAID INFOTECH
                </p>

              </div>


              <div className="text-left sm:text-right">

                <h2 className="text-2xl font-bold">
                  TAX INVOICE
                </h2>

                <p className="text-gray-500 mt-1">
                  INVOICE
                </p>

              </div>

            </div>

          </div>


          {/* ======================================
              INVOICE INFORMATION
          ====================================== */}

          <div className="p-8 border-b">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>

                <p className="text-sm text-gray-500">
                  Invoice No
                </p>

                <p className="font-semibold">
                  {invoice.invoiceNumber || "-"}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Order No
                </p>

                <p className="font-semibold">
                  {order._id
                    ? `#${order._id}`
                    : invoice.referenceId
                      ? `#${invoice.referenceId}`
                      : "-"
                  }
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Invoice Date
                </p>

                <p className="font-semibold">
                  {formatDate(invoice.invoiceDate)}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Order Type
                </p>

                <p className="font-semibold">
                  {invoice.orderSource === "WALK_IN"
                    ? "WALK-IN ORDER"
                    : "ONLINE ORDER"
                  }
                </p>

              </div>

            </div>

          </div>


          {/* ======================================
              BILL TO
          ====================================== */}

          <div className="p-8 border-b">

            <h3 className="font-bold text-lg mb-4">
              BILL TO / SHIP TO
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>

                <p className="font-semibold">
                  {billing.fullName ||
                    customer.firstName
                      ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                      : "Customer"
                  }
                </p>

                <p className="text-gray-600 mt-1">
                  Phone:{" "}
                  {billing.phone ||
                    customer.phone ||
                    "-"
                  }
                </p>

                <p className="text-gray-600">
                  Email:{" "}
                  {customer.email || "-"}
                </p>

              </div>


              <div>

                <p className="text-gray-600">
                  {billing.addressLine || ""}
                </p>

                <p className="text-gray-600">
                  {billing.city || ""}
                  {billing.city && billing.state
                    ? ", "
                    : ""}
                  {billing.state || ""}
                </p>

                <p className="text-gray-600">
                  {billing.pincode || ""}
                </p>

                <p className="text-gray-600">
                  {billing.country || "India"}
                </p>

              </div>

            </div>

          </div>


          {/* ======================================
              ITEMS
          ====================================== */}

          <div className="p-8 border-b">

            <h3 className="font-bold text-lg mb-4">
              ITEMS
            </h3>


            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-gray-100 border">

                    <th className="text-left p-3 border">
                      Item
                    </th>

                    <th className="text-center p-3 border">
                      Qty
                    </th>

                    <th className="text-right p-3 border">
                      Price
                    </th>

                    <th className="text-right p-3 border">
                      Discount
                    </th>

                    <th className="text-right p-3 border">
                      Total
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {invoice.items?.map(
                    (item, index) => (

                      <tr
                        key={
                          item._id ||
                          index
                        }
                        className="border"
                      >

                        <td className="p-3 border">

                          <div className="font-medium">
                            {item.title ||
                              item.description ||
                              "Item"
                            }
                          </div>

                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          )}

                        </td>


                        <td className="p-3 border text-center">
                          {item.quantity}
                        </td>


                        <td className="p-3 border text-right">
                          {formatCurrency(
                            item.price
                          )}
                        </td>


                        <td className="p-3 border text-right">
                          {formatCurrency(
                            item.discountAmount
                          )}
                        </td>


                        <td className="p-3 border text-right font-medium">
                          {formatCurrency(
                            item.total
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ======================================
              TOTALS
          ====================================== */}

          <div className="p-8 border-b">

            <div className="ml-auto max-w-sm space-y-3">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(
                    invoice.subtotal
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Discount
                </span>

                <span className="font-medium">
                  -{" "}
                  {formatCurrency(
                    invoice.discount
                  )}
                </span>

              </div>


              <div className="border-t pt-3 flex justify-between text-lg font-bold">

                <span>
                  Total
                </span>

                <span>
                  {formatCurrency(
                    invoice.totalAmount
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Amount Paid
                </span>

                <span>
                  {formatCurrency(
                    invoice.paidAmount
                  )}
                </span>

              </div>


              <div className="flex justify-between font-semibold">

                <span>
                  Amount Due
                </span>

                <span>
                  {formatCurrency(
                    invoice.balanceAmount
                  )}
                </span>

              </div>

            </div>

          </div>


          {/* ======================================
              PAYMENT
          ====================================== */}

          <div className="p-8 border-b">

            <h3 className="font-bold text-lg mb-4">
              PAYMENT INFORMATION
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <p className="font-semibold">
                  {invoice.paymentStatus || "-"}
                </p>
              </div>


              <div>
                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <p className="font-semibold">
                  {invoice.paymentMethod || "-"}
                </p>
              </div>


              {payment.transactionId && (
                <div>
                  <p className="text-sm text-gray-500">
                    Transaction ID
                  </p>

                  <p className="font-semibold break-all">
                    {payment.transactionId}
                  </p>
                </div>
              )}


              {payment.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">
                    Payment Date
                  </p>

                  <p className="font-semibold">
                    {formatDate(
                      payment.createdAt
                    )}
                  </p>
                </div>
              )}

            </div>

          </div>


          {/* ======================================
              DELIVERY
          ====================================== */}

          {order && (
            <div className="p-8 border-b">

              <h3 className="font-bold text-lg mb-4">
                DELIVERY INFORMATION
              </h3>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Delivery Status
                  </p>

                  <p className="font-semibold">
                    {order.orderStatus ||
                      order.status ||
                      "PROCESSING"
                    }
                  </p>

                </div>


                <div>

                  <p className="text-sm text-gray-500">
                    Expected Delivery
                  </p>

                  <p className="font-semibold">
                    {formatDate(
                      order.expectedDeliveryDate
                    )}
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* ======================================
              FOOTER
          ====================================== */}

          <div className="p-8 text-center">

            <p className="font-semibold">
              Thank you for shopping with FixFlow!
            </p>

            <p className="text-sm text-gray-500 mt-2">
              This is a computer-generated invoice.
            </p>

          </div>

        </div>

      </div>


      {/* ==========================================
          PRINT CSS
      ========================================== */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            .invoice-actions {
              display: none !important;
            }

            .invoice-document {
              box-shadow: none !important;
              max-width: none !important;
              width: 100% !important;
            }

            .bg-gray-200 {
              background: white !important;
              padding: 0 !important;
            }

            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `}
      </style>
    </>
  );
};

export default InvoicePage;

