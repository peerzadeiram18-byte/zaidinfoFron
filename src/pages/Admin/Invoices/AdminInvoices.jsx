
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

import {
  FiRefreshCw,
  FiEye,
  FiPrinter,
  FiX,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiTool,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import {
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../../../services/invoiceService";

import { getAllRentals } from "../../../services/rentalApi";
import { toast } from "react-toastify";

import WalkInInvoice from "../../Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice";
import WalkInRentalInvoice from "../../Receptionist/WalkInRentalInvoice";
import "./AdminInvoices.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const getArrayFromResponse = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.result,
    response?.data?.repairs,
    response?.data?.invoices,
    response?.data?.rentals,
    response?.repairs,
    response?.invoices,
    response?.rentals,
    response?.result,
  ];

  return candidates.find(Array.isArray) || [];
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return String(
    value?._id ||
      value?.id ||
      value?.branchId ||
      value?.value ||
      ""
  );
};

const getText = (value) => {
  if (value === undefined || value === null) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  return String(
    value?.name ||
      value?.fullName ||
      value?.title ||
      value?.label ||
      value?.value ||
      ""
  ).trim();
};

const getPersonName = (person) => {
  if (!person) return "Not Recorded";

  if (typeof person === "string") {
    return /^[0-9a-fA-F]{24}$/.test(person)
      ? "Not Recorded"
      : person;
  }

  const fullName = [
    person?.firstName,
    person?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    person?.name ||
    person?.fullName ||
    fullName ||
    person?.username ||
    person?.email ||
    "Not Recorded"
  );
};

const normalizeType = (value, fallback = "NON_GST") => {
  const normalized = String(value || fallback)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  return normalized === "GST" ? "GST" : "NON_GST";
};

function AdminInvoices() {
  // =====================================================
  // STATES
  // =====================================================

  const [invoices, setInvoices] = useState([]);
  const [technicianRepairs, setTechnicianRepairs] = useState([]);
  const [rentalInvoices, setRentalInvoices] = useState([]);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [technicianLoading, setTechnicianLoading] = useState(false);
  const [rentalLoading, setRentalLoading] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedRentalInvoice, setSelectedRentalInvoice] = useState(null);
  const [selectedTechnicianReceipt, setSelectedTechnicianReceipt] =
    useState(null);

  const [invoiceFilter, setInvoiceFilter] = useState("ALL");
  const [gstFilter, setGstFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const [expandedCards, setExpandedCards] = useState({});

  const [editInvoice, setEditInvoice] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [editForm, setEditForm] = useState({
    invoiceType: "GST",
    gstPercentage: 18,
    shippingCharge: 0,
    otherCharges: 0,
    notes: "",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =====================================================
  // AUTH
  // =====================================================

  const getAuthConfig = useCallback(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // =====================================================
  // COMMON HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleDateString("en-IN");
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getObjectValue = (...values) =>
    values.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadAllInvoiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllInvoiceData = async () => {
    await Promise.allSettled([
      loadInvoices(),
      loadTechnicianReceipts(),
      loadRentalInvoices(),
      loadBranches(),
    ]);
  };

  // =====================================================
  // LOAD BRANCHES
  // =====================================================

  const loadBranches = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/branches`,
        getAuthConfig()
      );

      setBranches(getArrayFromResponse(response));
    } catch (error) {
      console.error("LOAD BRANCHES ERROR:", error);
      setBranches([]);
    }
  };

  // =====================================================
  // LOAD ORDER INVOICES
  // =====================================================

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const response = await getInvoices();
      const invoiceList = getArrayFromResponse(response);

      setInvoices(invoiceList);
    } catch (error) {
      console.error("LOAD INVOICES ERROR:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to load order invoices"
      );
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD REPAIR RECEIPTS
  // =====================================================

  const loadTechnicianReceipts = async () => {
    try {
      setTechnicianLoading(true);

      const response = await axios.get(
        `${API_URL}/newRepair/`,
        getAuthConfig()
      );

      setTechnicianRepairs(getArrayFromResponse(response));
    } catch (error) {
      console.error("LOAD REPAIR RECEIPTS ERROR:", error);
      setTechnicianRepairs([]);
    } finally {
      setTechnicianLoading(false);
    }
  };

  // =====================================================
  // LOAD WALK-IN RENTALS ONLY
  // =====================================================

  const loadRentalInvoices = async () => {
    try {
      setRentalLoading(true);

      let response;

      try {
        response = await getAllRentals();
      } catch (error) {
        console.error("getAllRentals failed:", error);

        response = await axios.get(
          `${API_URL}/rentals`,
          getAuthConfig()
        );
      }

      const rentalList = getArrayFromResponse(response);

      // Backend field: rentalSource = ONLINE / WALK_IN
      // Admin invoice screen should show WALK_IN only.
      const walkInRentals = rentalList.filter((rental) => {
        const source = String(rental?.rentalSource || "")
          .trim()
          .toUpperCase()
          .replace(/[\s-]+/g, "_");

        return source === "WALK_IN";
      });

      setRentalInvoices(walkInRentals);
    } catch (error) {
      console.error("LOAD RENTAL INVOICES ERROR:", error);
      setRentalInvoices([]);
    } finally {
      setRentalLoading(false);
    }
  };

  // =====================================================
  // ORDER HELPERS
  // =====================================================

  const getCustomerName = (invoice) =>
    invoice?.billingAddress?.fullName ||
    invoice?.billingAddress?.name ||
    invoice?.shippingAddress?.fullName ||
    invoice?.shippingAddress?.name ||
    invoice?.order?.shippingAddress?.fullName ||
    invoice?.order?.shippingAddress?.name ||
    invoice?.user?.fullName ||
    invoice?.user?.name ||
    invoice?.customerName ||
    "Walk-In Customer";

  const getOrderSource = (invoice) =>
    String(
      invoice?.orderSource ||
        invoice?.order?.orderSource ||
        invoice?.orderSourceType ||
        invoice?.order?.orderSourceType ||
        "WALK_IN"
    )
      .trim()
      .toUpperCase();

  const getOrderType = (invoice) =>
    getOrderSource(invoice) === "ONLINE"
      ? "ONLINE_ORDER"
      : "WALK_IN_ORDER";

  const getOrderTypeLabel = (invoice) =>
    getOrderType(invoice) === "ONLINE_ORDER"
      ? "ONLINE ORDER"
      : "WALK-IN ORDER";

  const getAmount = (invoice) =>
    Number(
      invoice?.finalAmount ??
        invoice?.totalAmount ??
        invoice?.grandTotal ??
        invoice?.order?.totalAmount ??
        0
    );

  const getInvoiceDate = (invoice) =>
    invoice?.invoiceDate ||
    invoice?.createdAt ||
    invoice?.updatedAt ||
    invoice?.order?.createdAt ||
    null;

  const getInvoiceType = (invoice) =>
    normalizeType(invoice?.invoiceType, "GST");

  const getOrderSalesperson = (invoice) =>
    getPersonName(
      invoice?.soldBy ||
        invoice?.order?.soldBy ||
        invoice?.salesperson ||
        invoice?.order?.salesperson
    );

  // =====================================================
  // REPAIR HELPERS
  // =====================================================

  const getTechnicianCustomerName = (repair) =>
    repair?.customerName ||
    repair?.customer?.fullName ||
    repair?.customer?.name ||
    repair?.user?.fullName ||
    repair?.user?.name ||
    "Customer";

  const getTechnicianName = (repair) => {
    const technician =
      repair?.assignedTechnician ||
      repair?.technicianName ||
      repair?.technician;

    return getPersonName(technician) === "Not Recorded"
      ? "Assigned Specialist"
      : getPersonName(technician);
  };

  const getTechnicianAmount = (repair) => {
    const repairCost = Number(repair?.repairCost || 0);

    if (repairCost > 0) return repairCost;

    if (Array.isArray(repair?.services)) {
      return repair.services.reduce((sum, service) => {
        const part = Number(service?.partCost || 0);
        const labor = Number(service?.laborCost || 0);
        const total = Number(service?.totalCost ?? part + labor);

        return sum + total;
      }, 0);
    }

    return 0;
  };

  const getTechnicianStatus = (repair) =>
    repair?.status || "Received";

  const getTechnicianTicket = (repair) =>
    repair?.repairNumber ||
    repair?.ticketNumber ||
    (repair?._id
      ? `TECH-${repair._id.slice(-6).toUpperCase()}`
      : "TECH-RECEIPT");

  const getTechnicianDate = (repair) =>
    repair?.updatedAt || repair?.createdAt || null;

  const getProblemCategory = (repair) =>
    getText(
      getObjectValue(
        repair?.problemCategory,
        repair?.category,
        repair?.issueCategory,
        repair?.repairCategory,
        repair?.problem?.category,
        repair?.issue?.category,
        repair?.deviceProblemCategory
      )
    ) || "Not Specified";

  const getSpecificProblem = (repair) =>
    getText(
      getObjectValue(
        repair?.specificProblem,
        repair?.problemName,
        repair?.problemTitle,
        repair?.issueTitle,
        repair?.selectedProblem,
        repair?.problem?.specificProblem,
        repair?.problem?.name,
        repair?.issue?.specificProblem,
        repair?.issue?.name,
        repair?.reportedProblem,
        repair?.problemDescription,
        repair?.issueDescription
      )
    ) || "Not Specified";

  const getRepairSalesperson = (repair) =>
    getText(repair?.salespersonName) || "Not Recorded";

  const getRepairCompletedBy = (repair) =>
    getPersonName(repair?.completedBy);

  const getRepairInvoiceType = (repair) =>
    normalizeType(repair?.invoiceType, "NON_GST");

  // =====================================================
  // BRANCH HELPERS
  // =====================================================

  const getBranchDetails = (repair) => {
    const branchValue =
      repair?.branchId ||
      repair?.branch ||
      repair?.branchDetails ||
      repair?.branchInfo ||
      repair?.assignedBranch ||
      repair?.serviceBranch ||
      repair?.repairBranch ||
      repair?.branch_id ||
      null;

    const branchId = getId(branchValue);

    const directBranch =
      branchValue && typeof branchValue === "object"
        ? branchValue
        : {};

    const matchedBranch = branches.find((branch) => {
      const currentId = getId(branch);

      if (branchId && currentId && branchId === currentId) {
        return true;
      }

      const branchText = getText(branchValue).toLowerCase();

      return (
        branchText &&
        [
          branch?.name,
          branch?.branchName,
          branch?.branchCode,
          branch?.code,
        ]
          .filter(Boolean)
          .some(
            (value) =>
              String(value).toLowerCase() === branchText
          )
      );
    });

    const branch = {
      ...(matchedBranch || {}),
      ...directBranch,
    };

    return {
      name:
        getObjectValue(
          repair?.branchName,
          repair?.branch?.branchName,
          repair?.branch?.name,
          repair?.branchDetails?.branchName,
          repair?.branchDetails?.name,
          repair?.branchInfo?.name,
          branch?.branchName,
          branch?.name,
          branch?.title
        ) || "Branch Not Available",

      code:
        getObjectValue(
          repair?.branchCode,
          repair?.branch?.branchCode,
          repair?.branchDetails?.branchCode,
          repair?.branchInfo?.branchCode,
          branch?.branchCode,
          branch?.code
        ) || "-",

      address:
        getObjectValue(
          repair?.branchAddress,
          repair?.branch?.address,
          repair?.branch?.branchAddress,
          repair?.branchDetails?.address,
          repair?.branchInfo?.address,
          branch?.address,
          branch?.branchAddress,
          branch?.fullAddress
        ) || "-",

      phone:
        getObjectValue(
          repair?.branchPhone,
          repair?.branch?.phone,
          repair?.branch?.contactNumber,
          repair?.branchDetails?.phone,
          repair?.branchInfo?.phone,
          branch?.phone,
          branch?.contactNumber,
          branch?.mobile
        ) || "-",

      email:
        getObjectValue(
          repair?.branchEmail,
          repair?.branch?.email,
          repair?.branchDetails?.email,
          repair?.branchInfo?.email,
          branch?.email
        ) || "-",

      city:
        getObjectValue(
          repair?.branchCity,
          repair?.branch?.city,
          repair?.branchDetails?.city,
          branch?.city
        ) || "",

      state:
        getObjectValue(
          repair?.branchState,
          repair?.branch?.state,
          repair?.branchDetails?.state,
          branch?.state
        ) || "",
    };
  };

  // =====================================================
  // RENTAL HELPERS
  // =====================================================

  const getRentalCustomerType = (rental) =>
    String(rental?.customerType || "INDIVIDUAL").toUpperCase();

  const getRentalCustomerName = (rental) => {
    if (getRentalCustomerType(rental) === "COMPANY") {
      return (
        rental?.companyDetails?.contactPerson ||
        rental?.companyDetails?.companyName ||
        rental?.customer?.name ||
        "Company Customer"
      );
    }

    return (
      rental?.individualDetails?.fullName ||
      rental?.customer?.name ||
      rental?.customer?.fullName ||
      rental?.customerName ||
      "Walk-In Customer"
    );
  };

  const getRentalCompanyName = (rental) =>
    rental?.companyDetails?.companyName || "";

  const getRentalSalesperson = (rental) =>
    getPersonName(rental?.allocatedBy);

  const getRentalInvoiceType = (rental) =>
    normalizeType(rental?.billingType, "GST");

  const getRentalProduct = (rental) =>
    rental?.product ||
    rental?.rentalProduct?.product ||
    rental?.rentalProduct ||
    null;

  const getRentalProductName = (rental) => {
    const product = getRentalProduct(rental);

    if (typeof product === "string") return product;

    return (
      product?.name ||
      product?.title ||
      rental?.productName ||
      "Rental Laptop"
    );
  };

  const getRentalMonthlyRent = (rental) =>
    Number(
      rental?.monthlyRent ??
        rental?.rentalProduct?.monthlyRent ??
        rental?.rentPerMonth ??
        rental?.pricing?.monthlyRent ??
        0
    );

  const getRentalDurationType = (rental) =>
    String(rental?.rentalDurationType || "MONTHS").toUpperCase();

  const getRentalMonths = (rental) =>
    Number(
      rental?.rentalDuration ??
        rental?.rentalMonths ??
        rental?.durationMonths ??
        rental?.months ??
        1
    );

  const getRentalDurationLabel = (rental) => {
    const value = getRentalMonths(rental);
    const isDays = getRentalDurationType(rental) === "DAYS";

    if (isDays) {
      return `${value} ${value === 1 ? "Day" : "Days"}`;
    }

    return `${value} ${value === 1 ? "Month" : "Months"}`;
  };

  const getRentalGST = (rental) => {
    if (getRentalInvoiceType(rental) === "NON_GST") return 0;

    return Number(
      rental?.gstPercentage ??
        rental?.gst ??
        rental?.taxPercentage ??
        rental?.pricing?.gstPercentage ??
        0
    );
  };

  const getRentalDeposit = (rental) =>
    Number(
      rental?.securityDeposit ??
        rental?.depositAmount ??
        rental?.securityDepositAmount ??
        0
    );

  const getRentalAmount = (rental) => {
    const monthlyRent = getRentalMonthlyRent(rental);
    const duration = getRentalMonths(rental);

    if (getRentalDurationType(rental) === "DAYS") {
      return (monthlyRent / 30) * duration;
    }

    return monthlyRent * duration;
  };

  const getRentalGSTAmount = (rental) =>
    (getRentalAmount(rental) * getRentalGST(rental)) / 100;

  const getRentalGrandTotal = (rental) =>
    Number(
      rental?.finalAmount ??
        rental?.grandTotal ??
        rental?.totalAmount ??
        getRentalAmount(rental) + getRentalGSTAmount(rental)
    );

  const getRentalStatus = (rental) =>
    String(rental?.status || "PENDING").toUpperCase();

  const getRentalPaymentMethod = (rental) =>
    rental?.paymentMethod ||
    rental?.depositPaymentMethod ||
    rental?.payment?.method ||
    rental?.payment?.paymentMethod ||
    "-";

  const getRentalInvoiceNumber = (rental) => {
    const existing =
      rental?.invoiceNumber ||
      rental?.invoiceNo ||
      rental?.invoice?.invoiceNumber;

    if (existing) return String(existing);

    const id = String(rental?._id || rental?.rentalId || "");

    return `RENT-${id.slice(-8).toUpperCase()}`;
  };

  const getRentalDate = (rental) =>
    rental?.createdAt ||
    rental?.createdDate ||
    rental?.date ||
    rental?.startDate ||
    null;

  // =====================================================
  // INVOICE -> ORDER FOR EXISTING INVOICE MODAL
  // =====================================================

  const invoiceToOrder = (invoice) => {
    if (!invoice) return null;

    const originalOrder =
      invoice?.order && typeof invoice.order === "object"
        ? invoice.order
        : {};

    const invoiceItems = Array.isArray(invoice?.items)
      ? invoice.items
      : [];

    const originalOrderItems = Array.isArray(
      originalOrder?.orderItems
    )
      ? originalOrder.orderItems
      : [];

    const sourceItems =
      originalOrderItems.length > 0
        ? originalOrderItems
        : invoiceItems;

    const orderItems = sourceItems.map((item) => {
      const product =
        item?.product && typeof item.product === "object"
          ? item.product
          : null;

      return {
        product: item?.product?._id || item?.product || null,
        productData: product,
        title:
          item?.title ||
          product?.name ||
          product?.title ||
          "Product",
        name:
          item?.name ||
          item?.title ||
          product?.name ||
          product?.title ||
          "Product",
        quantity: Number(item?.quantity || 1),
        originalPrice: Number(
          item?.originalPrice ?? item?.price ?? 0
        ),
        discountAmount: Number(item?.discountAmount || 0),
        price: Number(
          item?.price ?? item?.originalPrice ?? 0
        ),
        total: Number(
          item?.total ??
            Number(item?.price ?? item?.originalPrice ?? 0) *
              Number(item?.quantity || 1)
        ),
        imageUrl:
          item?.imageUrl ||
          product?.imageUrl ||
          product?.images?.[0] ||
          "",
      };
    });

    const shippingAddress =
      originalOrder?.shippingAddress ||
      invoice?.billingAddress ||
      invoice?.shippingAddress ||
      {};

    const invoiceType = getInvoiceType(invoice);

    return {
      ...originalOrder,
      _id:
        originalOrder?._id ||
        invoice?.order?._id ||
        invoice?.order ||
        invoice?._id,
      orderId:
        originalOrder?._id ||
        invoice?.order?._id ||
        invoice?.order ||
        invoice?._id,
      user: originalOrder?.user || invoice?.user || null,
      soldBy: invoice?.soldBy || originalOrder?.soldBy || null,
      orderItems,
      items: invoiceItems,
      subtotal: Number(
        originalOrder?.subtotal ?? invoice?.subtotal ?? 0
      ),
      discount: Number(
        originalOrder?.discount ?? invoice?.discount ?? 0
      ),
      totalAmount: Number(
        originalOrder?.totalAmount ?? invoice?.totalAmount ?? 0
      ),
      paidAmount: Number(
        originalOrder?.paidAmount ??
          invoice?.paidAmount ??
          invoice?.totalAmount ??
          0
      ),
      balanceAmount: Number(
        originalOrder?.balanceAmount ??
          invoice?.balanceAmount ??
          0
      ),
      paymentStatus:
        originalOrder?.paymentStatus ||
        invoice?.paymentStatus ||
        "PAID",
      orderStatus: originalOrder?.orderStatus || "DELIVERED",
      paymentMethod:
        originalOrder?.paymentMethod ||
        invoice?.paymentMethod ||
        invoice?.payment?.paymentMethod ||
        "UPI",
      payment: originalOrder?.payment || invoice?.payment || null,
      orderSource:
        originalOrder?.orderSource ||
        invoice?.orderSource ||
        "WALK_IN",
      shippingAddress,
      billingAddress:
        invoice?.billingAddress ||
        originalOrder?.billingAddress ||
        shippingAddress,
      invoiceNumber: invoice?.invoiceNumber,
      invoiceId: invoice?._id,
      invoiceDate: invoice?.invoiceDate,
      invoiceFor: invoice?.invoiceFor || "ORDER",
      invoiceType,
      notes: invoice?.notes || originalOrder?.notes || "",
      ...(Number(invoice?.finalAmount) > 0
        ? {
            taxableAmount: Number(invoice?.taxableAmount || 0),
            gstPercentage: Number(invoice?.gstPercentage || 0),
            gstAmount: Number(invoice?.gstAmount || 0),
            shippingCharge: Number(invoice?.shippingCharge || 0),
            otherCharges: Number(invoice?.otherCharges || 0),
            couponDiscount: Number(invoice?.couponDiscount || 0),
            finalAmount: Number(invoice?.finalAmount),
            paidAmount: Number(invoice?.paidAmount || 0),
            balanceAmount: Number(invoice?.balanceAmount || 0),
          }
        : {}),
      ...(invoiceType === "NON_GST"
        ? { gstPercentage: 0, gstAmount: 0 }
        : {}),
    };
  };

  // =====================================================
  // OPEN / CLOSE MODALS
  // =====================================================

  const openInvoice = (invoice) =>
    setSelectedInvoice(invoiceToOrder(invoice));

  const openTechnicianReceipt = (repair) =>
    setSelectedTechnicianReceipt(repair);

  const openRentalInvoice = (rental) =>
    setSelectedRentalInvoice(rental);

  const closeInvoice = () => setSelectedInvoice(null);
  const closeTechnicianReceipt = () =>
    setSelectedTechnicianReceipt(null);
  const closeRentalInvoice = () =>
    setSelectedRentalInvoice(null);

  // =====================================================
  // EXPAND / COLLAPSE CARD
  // =====================================================

  const toggleCardDetails = (recordId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  // =====================================================
  // EDIT INVOICE
  // =====================================================

  const setEditField = (name, value) => {
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditInvoice = (invoice) => {
    if (!invoice?._id) return;

    const billing = invoice?.billingAddress || {};

    setEditForm({
      invoiceType: getInvoiceType(invoice),
      gstPercentage:
        Number(invoice?.gstPercentage) > 0
          ? Number(invoice.gstPercentage)
          : 18,
      shippingCharge: Number(invoice?.shippingCharge || 0),
      otherCharges: Number(invoice?.otherCharges || 0),
      notes: invoice?.notes || "",
      fullName: billing.fullName || "",
      phone: billing.phone || "",
      addressLine: billing.addressLine || "",
      city: billing.city || "",
      state: billing.state || "",
      pincode: billing.pincode || "",
    });

    setEditInvoice(invoice);
  };

  const saveEditInvoice = async () => {
    if (!editInvoice?._id) return;

    const original = editInvoice;

    const payload = {
      notes: editForm.notes,
      billingAddress: {
        fullName: editForm.fullName,
        phone: editForm.phone,
        addressLine: editForm.addressLine,
        city: editForm.city,
        state: editForm.state,
        pincode: editForm.pincode,
      },
    };

    if (editForm.invoiceType !== getInvoiceType(original)) {
      payload.invoiceType = editForm.invoiceType;
    }

    if (
      editForm.invoiceType === "GST" &&
      Number(editForm.gstPercentage) !==
        Number(original?.gstPercentage || 0)
    ) {
      payload.gstPercentage = Number(
        editForm.gstPercentage || 0
      );
    }

    if (
      Number(editForm.shippingCharge || 0) !==
      Number(original?.shippingCharge || 0)
    ) {
      payload.shippingCharge = Number(
        editForm.shippingCharge || 0
      );
    }

    if (
      Number(editForm.otherCharges || 0) !==
      Number(original?.otherCharges || 0)
    ) {
      payload.otherCharges = Number(
        editForm.otherCharges || 0
      );
    }

    try {
      setSavingEdit(true);

      await updateInvoice(original._id, payload);

      toast.success("Invoice updated successfully");
      setEditInvoice(null);

      await loadInvoices();
    } catch (error) {
      console.error("UPDATE INVOICE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update invoice"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // =====================================================
  // DELETE INVOICE
  // =====================================================

  const handleDeleteInvoice = async (invoice) => {
    if (!invoice?._id) return;

    const confirmed = window.confirm(
      `Delete invoice ${invoice?.invoiceNumber || ""}?\n\nThis invoice will be removed from the invoice list.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(invoice._id);

      await deleteInvoice(invoice._id);

      toast.success("Invoice deleted successfully");
      await loadInvoices();
    } catch (error) {
      console.error("DELETE INVOICE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete invoice"
      );
    } finally {
      setDeletingId("");
    }
  };

  // =====================================================
  // TECHNICIAN RECEIPT PRINT
  // =====================================================

  const handleTechnicianPrint = () => {
    const receipt = document.getElementById(
      "technician-printable-receipt"
    );

    if (!receipt) {
      toast.error("Technician receipt not found!");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      toast.error("Please allow pop-ups to print the receipt.");
      return;
    }

    const styles = Array.from(
      document.querySelectorAll(
        'link[rel="stylesheet"], style'
      )
    )
      .map((style) => style.outerHTML)
      .join("\n");

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <base href="${window.location.origin}/" />
          <title>Technician Service Receipt</title>
          ${styles}

          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }

            html, body {
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              background: #fff;
              overflow: visible;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #technician-printable-receipt {
              display: block !important;
              position: static !important;
              width: 100% !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              box-shadow: none !important;
              border: none !important;
              background: #fff !important;
              color: #111827 !important;
            }

            .no-print,
            .tech-receipt-actions,
            .tech-receipt-top {
              display: none !important;
            }

            .tech-receipt-sheet {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              padding: 0 !important;
            }

            .tech-receipt-table-wrapper {
              width: 100% !important;
              overflow: visible !important;
            }

            .tech-receipt-table {
              width: 100% !important;
              min-width: 0 !important;
              table-layout: fixed !important;
              border-collapse: collapse !important;
            }

            .tech-receipt-table thead {
              display: table-header-group !important;
            }

            .tech-receipt-table tr,
            .tech-receipt-party-grid,
            .tech-party-card,
            .tech-receipt-branch,
            .tech-receipt-problem {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>

        <body>
          ${receipt.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  // =====================================================
  // UNIFIED RECORDS
  // =====================================================

  const unifiedRecords = useMemo(() => {
    const orderRecords = invoices.map((invoice) => ({
      id: `invoice-${invoice?._id}`,
      type: getOrderType(invoice),
      typeLabel: getOrderTypeLabel(invoice),
      data: invoice,
      customer: getCustomerName(invoice),
      amount: getAmount(invoice),
      date: getInvoiceDate(invoice),
      status: String(
        invoice?.paymentStatus || "PAID"
      ).toUpperCase(),
      invoiceType: getInvoiceType(invoice),
      salesperson: getOrderSalesperson(invoice),
      completedBy: "",
    }));

    // Only WALK-IN RENTAL records are included.
    const rentalRecords = rentalInvoices.map((rental) => ({
      id: `rental-${rental?._id}`,
      type: "WALK_IN_RENTAL",
      typeLabel: "WALK-IN RENTAL",
      data: rental,
      customer: getRentalCustomerName(rental),
      amount: getRentalGrandTotal(rental),
      date: getRentalDate(rental),
      status: getRentalStatus(rental),
      invoiceType: getRentalInvoiceType(rental),
      salesperson: getRentalSalesperson(rental),
      completedBy: "",
    }));

    const repairRecords = technicianRepairs.map((repair) => ({
      id: `technician-${repair?._id}`,
      type: "REPAIR",
      typeLabel: "TECHNICIAN / REPAIR",
      data: repair,
      customer: getTechnicianCustomerName(repair),
      amount: getTechnicianAmount(repair),
      date: getTechnicianDate(repair),
      status: String(
        getTechnicianStatus(repair)
      ).toUpperCase(),
      invoiceType: getRepairInvoiceType(repair),
      salesperson: getRepairSalesperson(repair),
      completedBy: getRepairCompletedBy(repair),
    }));

    return [
      ...orderRecords,
      ...rentalRecords,
      ...repairRecords,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, rentalInvoices, technicianRepairs]);

  // =====================================================
  // FILTER RECORDS
  // =====================================================

  const filteredRecords = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    let records = [...unifiedRecords];

    if (invoiceFilter !== "ALL") {
      records = records.filter(
        (record) => record.type === invoiceFilter
      );
    }

    if (gstFilter !== "ALL") {
      records = records.filter(
        (record) => record.invoiceType === gstFilter
      );
    }

    if (search) {
      records = records.filter((record) => {
        const data = record.data;

        const isRental =
          record.type === "WALK_IN_RENTAL";

        const invoiceNumber = isRental
          ? getRentalInvoiceNumber(data)
          : data?.invoiceNumber ||
            data?.invoiceNo ||
            data?.invoice?.invoiceNumber ||
            "";

        const ticket =
          data?.repairNumber ||
          data?.ticketNumber ||
          "";

        const product = isRental
          ? getRentalProductName(data)
          : "";

        const branch =
          record.type === "REPAIR"
            ? getBranchDetails(data)
            : {};

        const searchFields = [
          record.typeLabel,
          record.customer,
          invoiceNumber,
          ticket,
          product,
          record.status,
          record.salesperson,
          record.completedBy,
          record.invoiceType,
          data?.paymentMethod,
          data?.customerPhone,
          data?.individualDetails?.phone,
          data?.companyDetails?.phone,
          data?.companyDetails?.companyName,
          data?.customerEmail,
          record.type === "REPAIR"
            ? getProblemCategory(data)
            : "",
          record.type === "REPAIR"
            ? getSpecificProblem(data)
            : "",
          branch?.name,
          branch?.code,
          branch?.address,
        ];

        return searchFields
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);
      });
    }

    records.sort((a, b) => {
      const dateA = a.date
        ? new Date(a.date).getTime()
        : 0;

      const dateB = b.date
        ? new Date(b.date).getTime()
        : 0;

      return dateB - dateA;
    });

    return records;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    unifiedRecords,
    invoiceFilter,
    gstFilter,
    searchText,
    branches,
  ]);

  // =====================================================
  // FILTER COUNTS
  // =====================================================

  const filterCounts = useMemo(() => {
    const count = (type) =>
      unifiedRecords.filter(
        (item) => item.type === type
      ).length;

    return {
      ALL: unifiedRecords.length,
      ONLINE_ORDER: count("ONLINE_ORDER"),
      WALK_IN_ORDER: count("WALK_IN_ORDER"),
      WALK_IN_RENTAL: count("WALK_IN_RENTAL"),
      REPAIR: count("REPAIR"),
    };
  }, [unifiedRecords]);

  const totalRecords = unifiedRecords.length;

  const isLoading =
    loading || technicianLoading || rentalLoading;

  // =====================================================
  // SUMMARY BUTTONS
  // =====================================================

  const summaryButtons = [
    {
      key: "ALL",
      label: "ALL",
      border: "#111827",
      bg: "#ffffff",
    },
    {
      key: "ONLINE_ORDER",
      label: "ONLINE ORDER",
      border: "#2563eb",
      bg: "#eff6ff",
    },
    {
      key: "WALK_IN_ORDER",
      label: "WALK-IN ORDER",
      border: "#ea580c",
      bg: "#fff7ed",
    },
    {
      key: "WALK_IN_RENTAL",
      label: "WALK-IN RENTAL",
      border: "#0f766e",
      bg: "#f0fdfa",
    },
    {
      key: "REPAIR",
      label: "REPAIR",
      border: "#7c3aed",
      bg: "#faf5ff",
    },
  ];

  // =====================================================
  // EDIT INPUT STYLE
  // =====================================================

  const editInputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
    marginTop: "4px",
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-invoices-page">
      {/* HEADER */}

      <div className="admin-invoices-header">
        <div>
          <h1>Invoices & Receipts</h1>
          <p>
            Online Orders, Walk-In Orders, Walk-In Rentals
            & Technician Repairs
          </p>
        </div>

        <button
          type="button"
          onClick={loadAllInvoiceData}
          disabled={isLoading}
        >
          <FiRefreshCw
            style={{ marginRight: 6 }}
          />
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}

      <div
        className="admin-invoice-summary"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {summaryButtons.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setInvoiceFilter(item.key)}
            style={{
              cursor: "pointer",
              padding: "14px",
              borderRadius: "10px",
              border:
                invoiceFilter === item.key
                  ? `2px solid ${item.border}`
                  : "1px solid #e5e7eb",
              background: item.bg,
              textAlign: "left",
            }}
          >
            <strong>{item.label}</strong>
            <div>{filterCounts[item.key]}</div>
          </button>
        ))}
      </div>

      {/* SEARCH AND FILTERS */}

      <div
        className="admin-invoice-filter-bar"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1 1 300px",
          }}
        >
          <FiSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
            }}
          />

          <input
            type="text"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            placeholder="Search invoice, customer, salesperson, ticket, branch..."
            style={{
              width: "100%",
              padding: "11px 12px 11px 38px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <FiFilter />

          <select
            value={invoiceFilter}
            onChange={(e) =>
              setInvoiceFilter(e.target.value)
            }
            style={{
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
            <option value="ALL">All Records</option>
            <option value="ONLINE_ORDER">
              Online Orders
            </option>
            <option value="WALK_IN_ORDER">
              Walk-In Orders
            </option>
            <option value="WALK_IN_RENTAL">
              Walk-In Rentals
            </option>
            <option value="REPAIR">
              Technician / Repair
            </option>
          </select>

          <select
            value={gstFilter}
            onChange={(e) =>
              setGstFilter(e.target.value)
            }
            style={{
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
            <option value="ALL">GST + Non-GST</option>
            <option value="GST">GST Only</option>
            <option value="NON_GST">
              Non-GST Only
            </option>
          </select>
        </div>
      </div>

      {/* RESULT COUNT */}

      <div
        style={{
          marginBottom: "14px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Showing <strong>{filteredRecords.length}</strong>{" "}
        of <strong>{totalRecords}</strong> records
      </div>

      {/* RECORD LIST */}

      {isLoading && totalRecords === 0 ? (
        <div className="empty-invoices">
          <p>Loading invoices & receipts...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-invoices">
          <h3>No invoices or receipts found</h3>
          <p>
            Try changing the filter or search text.
          </p>
        </div>
      ) : (
        <div className="invoice-list">
          {filteredRecords.map((record) => {
            const data = record.data;
            const expanded = Boolean(
              expandedCards[record.id]
            );

            // =================================================
            // ORDER CARD
            // =================================================

            if (
              record.type === "ONLINE_ORDER" ||
              record.type === "WALK_IN_ORDER"
            ) {
              const source = getOrderSource(data);
              const customer = getCustomerName(data);
              const amount = getAmount(data);

              const invoiceNumber =
                data?.invoiceNumber ||
                data?._id ||
                "Invoice";

              const invoiceType = getInvoiceType(data);

              return (
                <div
                  className="invoice-card"
                  key={record.id}
                >
                  <div
                    className={`invoice-card-info ${
                      expanded ? "expanded" : "collapsed"
                    }`}
                  >
                    <h3>{invoiceNumber}</h3>

                    <p>
                      <strong>Invoice Type:</strong>{" "}
                      <span
                        className="invoice-source"
                        style={{
                          background:
                            invoiceType === "NON_GST"
                              ? "#fee2e2"
                              : "#dcfce7",
                          color:
                            invoiceType === "NON_GST"
                              ? "#b91c1c"
                              : "#166534",
                          border:
                            invoiceType === "NON_GST"
                              ? "1px solid #fecaca"
                              : "1px solid #bbf7d0",
                        }}
                      >
                        {invoiceType === "NON_GST"
                          ? "NON-GST"
                          : "GST"}
                      </span>
                    </p>

                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className="invoice-source"
                        style={{
                          background:
                            source === "ONLINE"
                              ? "#dbeafe"
                              : "#ffedd5",
                          color:
                            source === "ONLINE"
                              ? "#1d4ed8"
                              : "#c2410c",
                          border:
                            source === "ONLINE"
                              ? "1px solid #93c5fd"
                              : "1px solid #fdba74",
                        }}
                      >
                        {getOrderTypeLabel(data)}
                      </span>
                    </p>

                    <p>
                      <strong>Customer:</strong>{" "}
                      {customer}
                    </p>

                    <p>
                      <strong>Salesperson:</strong>{" "}
                      {getOrderSalesperson(data)}
                    </p>

                    <p>
                      <strong>Amount:</strong> ₹{" "}
                      {formatAmount(amount)}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {data?.paymentMethod ||
                        data?.payment?.paymentMethod ||
                        "UPI"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {data?.paymentStatus || "PAID"}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(getInvoiceDate(data))}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="invoice-more-btn"
                    onClick={() =>
                      toggleCardDetails(record.id)
                    }
                  >
                    {expanded ? "Less" : "More"}
                  </button>

                  <button
                    type="button"
                    className="view-invoice-btn"
                    onClick={() => openInvoice(data)}
                  >
                    <FiEye
                      style={{ marginRight: 6 }}
                    />
                    View Invoice
                  </button>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openEditInvoice(data)
                      }
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        border: "1px solid #2563eb",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <FiEdit2
                        style={{ marginRight: 6 }}
                      />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === data?._id}
                      onClick={() =>
                        handleDeleteInvoice(data)
                      }
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        border: "1px solid #dc2626",
                        background: "#fef2f2",
                        color: "#b91c1c",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <FiTrash2
                        style={{ marginRight: 6 }}
                      />
                      {deletingId === data?._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            }

            // =================================================
            // WALK-IN RENTAL CARD ONLY
            // =================================================

            if (record.type === "WALK_IN_RENTAL") {
              const customer = getRentalCustomerName(data);
              const company = getRentalCompanyName(data);
              const product = getRentalProductName(data);
              const amount = getRentalGrandTotal(data);
              const deposit = getRentalDeposit(data);
              const status = getRentalStatus(data);
              const invoiceType = getRentalInvoiceType(data);

              return (
                <div
                  className="invoice-card rental-invoice-card"
                  key={record.id}
                  style={{
                    borderLeft: "4px solid #0f766e",
                  }}
                >
                  <div
                    className={`invoice-card-info ${
                      expanded ? "expanded" : "collapsed"
                    }`}
                  >
                    <h3>{getRentalInvoiceNumber(data)}</h3>

                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className="invoice-source"
                        style={{
                          background: "#ccfbf1",
                          color: "#0f766e",
                          border: "1px solid #99f6e4",
                        }}
                      >
                        WALK-IN RENTAL
                      </span>
                    </p>

                    <p>
                      <strong>Invoice Type:</strong>{" "}
                      <span
                        className="invoice-source"
                        style={{
                          background:
                            invoiceType === "NON_GST"
                              ? "#fee2e2"
                              : "#dcfce7",
                          color:
                            invoiceType === "NON_GST"
                              ? "#b91c1c"
                              : "#166534",
                        }}
                      >
                        {invoiceType === "NON_GST"
                          ? "NON-GST"
                          : "GST"}
                      </span>
                    </p>

                    <p>
                      <strong>Customer:</strong>{" "}
                      {customer}
                    </p>

                    {company && (
                      <p>
                        <strong>Company:</strong>{" "}
                        {company}
                      </p>
                    )}

                    <p>
                      <strong>Salesperson:</strong>{" "}
                      {getRentalSalesperson(data)}
                    </p>

                    <p>
                      <strong>Product:</strong>{" "}
                      {product}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {getRentalDurationLabel(data)}
                    </p>

                    <p>
                      <strong>Rent:</strong> ₹{" "}
                      {formatAmount(getRentalAmount(data))}
                    </p>

                    <p>
                      <strong>Deposit:</strong> ₹{" "}
                      {formatAmount(deposit)}
                    </p>

                    <p>
                      <strong>GST:</strong>{" "}
                      {getRentalGST(data)}%
                    </p>

                    <p>
                      <strong>Total:</strong> ₹{" "}
                      {formatAmount(amount)}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {getRentalPaymentMethod(data)}
                    </p>

                    <p>
                      <strong>Status:</strong> {status}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(getRentalDate(data))}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="invoice-more-btn"
                    onClick={() =>
                      toggleCardDetails(record.id)
                    }
                  >
                    {expanded ? "Less" : "More"}
                  </button>

                  <button
                    type="button"
                    className="view-invoice-btn"
                    style={{
                      background: "#0f766e",
                      color: "#ffffff",
                    }}
                    onClick={() =>
                      openRentalInvoice(data)
                    }
                  >
                    <FiEye
                      style={{ marginRight: 6 }}
                    />
                    View Rental Invoice
                  </button>
                </div>
              );
            }

            // =================================================
            // REPAIR CARD
            // =================================================

            if (record.type === "REPAIR") {
              const customer =
                getTechnicianCustomerName(data);

              const technician =
                getTechnicianName(data);

              const amount =
                getTechnicianAmount(data);

              const status =
                getTechnicianStatus(data);

              const ticket =
                getTechnicianTicket(data);

              const branch =
                getBranchDetails(data);

              const problemCategory =
                getProblemCategory(data);

              const specificProblem =
                getSpecificProblem(data);

              const salesperson =
                getRepairSalesperson(data);

              const completedBy =
                getRepairCompletedBy(data);

              const repairInvoiceType =
                getRepairInvoiceType(data);

              return (
                <div
                  className="invoice-card technician-receipt-card"
                  key={record.id}
                  style={{
                    borderLeft: "4px solid #7c3aed",
                  }}
                >
                  <div
                    className={`invoice-card-info ${
                      expanded ? "expanded" : "collapsed"
                    }`}
                  >
                    <h3>{ticket}</h3>

                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className="invoice-source"
                        style={{
                          background: "#f3e8ff",
                          color: "#7c3aed",
                          border: "1px solid #ddd6fe",
                        }}
                      >
                        TECHNICIAN / REPAIR
                      </span>
                    </p>

                    <p>
                      <strong>Invoice Type:</strong>{" "}
                      {repairInvoiceType === "GST"
                        ? "GST"
                        : "NON-GST"}
                    </p>

                    <p>
                      <strong>Customer:</strong>{" "}
                      {customer}
                    </p>

                    <p>
                      <strong>Device:</strong>{" "}
                      {data?.deviceModel ||
                        data?.laptopModel ||
                        "Standard Device"}
                    </p>

                    <p>
                      <strong>Technician:</strong>{" "}
                      {technician}
                    </p>

                    <p>
                      <strong>Salesperson:</strong>{" "}
                      {salesperson}
                    </p>

                    <p>
                      <strong>Marked Completed By:</strong>{" "}
                      {completedBy}
                    </p>

                    <p>
                      <strong>Completed Date:</strong>{" "}
                      {formatDate(data?.completedAt)}
                    </p>

                    <p>
                      <strong>Problem Category:</strong>{" "}
                      {problemCategory}
                    </p>

                    <p>
                      <strong>Specific Problem:</strong>{" "}
                      {specificProblem}
                    </p>

                    <div className="admin-repair-branch-info">
                      <p>
                        <strong>
                          <FiMapPin
                            style={{ marginRight: 5 }}
                          />
                          Branch:
                        </strong>{" "}
                        {branch.name}
                      </p>

                      {branch.code !== "-" && (
                        <p>
                          <strong>Branch Code:</strong>{" "}
                          {branch.code}
                        </p>
                      )}

                      {branch.address !== "-" && (
                        <p>
                          <strong>Address:</strong>{" "}
                          {branch.address}
                        </p>
                      )}

                      {branch.phone !== "-" && (
                        <p>
                          <strong>Branch Phone:</strong>{" "}
                          {branch.phone}
                        </p>
                      )}
                    </div>

                    <p>
                      <strong>Amount:</strong> ₹{" "}
                      {formatAmount(amount)}
                    </p>

                    <p>
                      <strong>Status:</strong> {status}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(getTechnicianDate(data))}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="invoice-more-btn"
                    onClick={() =>
                      toggleCardDetails(record.id)
                    }
                  >
                    {expanded ? "Less" : "More"}
                  </button>

                  <button
                    type="button"
                    className="view-invoice-btn"
                    style={{
                      background: "#7c3aed",
                      color: "#ffffff",
                    }}
                    onClick={() =>
                      openTechnicianReceipt(data)
                    }
                  >
                    <FiPrinter
                      style={{ marginRight: 6 }}
                    />
                    View Receipt
                  </button>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =====================================================
          EDIT INVOICE MODAL
      ===================================================== */}

      {editInvoice && (
        <div
          className="admin-edit-invoice-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "16px",
          }}
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !savingEdit
            ) {
              setEditInvoice(null);
            }
          }}
        >
          <div
            className="admin-edit-invoice-modal"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                Edit Invoice
              </h2>

              <button
                type="button"
                onClick={() => setEditInvoice(null)}
                disabled={savingEdit}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                <FiX />
              </button>
            </div>

            <p
              style={{
                color: "#6b7280",
                marginTop: "4px",
              }}
            >
              {editInvoice?.invoiceNumber}
            </p>

            <label style={{ display: "block" }}>
              Invoice Type
              <select
                value={editForm.invoiceType}
                onChange={(e) =>
                  setEditField(
                    "invoiceType",
                    e.target.value
                  )
                }
                style={editInputStyle}
              >
                <option value="GST">GST Invoice</option>
                <option value="NON_GST">
                  Non-GST Invoice
                </option>
              </select>
            </label>

            {editForm.invoiceType === "GST" && (
              <label
                style={{
                  display: "block",
                  marginTop: "12px",
                }}
              >
                GST Percentage (%)
                <input
                  type="number"
                  min="0"
                  value={editForm.gstPercentage}
                  onChange={(e) =>
                    setEditField(
                      "gstPercentage",
                      e.target.value
                    )
                  }
                  style={editInputStyle}
                />
              </label>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <label>
                Shipping Charge
                <input
                  type="number"
                  min="0"
                  value={editForm.shippingCharge}
                  onChange={(e) =>
                    setEditField(
                      "shippingCharge",
                      e.target.value
                    )
                  }
                  style={editInputStyle}
                />
              </label>

              <label>
                Other Charges
                <input
                  type="number"
                  min="0"
                  value={editForm.otherCharges}
                  onChange={(e) =>
                    setEditField(
                      "otherCharges",
                      e.target.value
                    )
                  }
                  style={editInputStyle}
                />
              </label>
            </div>

            <h4 style={{ margin: "16px 0 4px" }}>
              Billing Details
            </h4>

            <input
              type="text"
              placeholder="Customer Name"
              value={editForm.fullName}
              onChange={(e) =>
                setEditField("fullName", e.target.value)
              }
              style={editInputStyle}
            />

            <input
              type="text"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditField("phone", e.target.value)
              }
              style={editInputStyle}
            />

            <input
              type="text"
              placeholder="Address"
              value={editForm.addressLine}
              onChange={(e) =>
                setEditField(
                  "addressLine",
                  e.target.value
                )
              }
              style={editInputStyle}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="City"
                value={editForm.city}
                onChange={(e) =>
                  setEditField("city", e.target.value)
                }
                style={editInputStyle}
              />

              <input
                type="text"
                placeholder="State"
                value={editForm.state}
                onChange={(e) =>
                  setEditField("state", e.target.value)
                }
                style={editInputStyle}
              />

              <input
                type="text"
                placeholder="Pincode"
                value={editForm.pincode}
                onChange={(e) =>
                  setEditField("pincode", e.target.value)
                }
                style={editInputStyle}
              />
            </div>

            <label
              style={{
                display: "block",
                marginTop: "12px",
              }}
            >
              Notes
              <textarea
                rows={3}
                value={editForm.notes}
                onChange={(e) =>
                  setEditField("notes", e.target.value)
                }
                style={editInputStyle}
              />
            </label>

            <p
              style={{
                fontSize: "12px",
                color: "#b45309",
                marginTop: "12px",
              }}
            >
              Note: GST ya charges badalne se invoice ka
              total update ho sakta hai. Order aur payment
              amount automatically change nahi hota.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                disabled={savingEdit}
                onClick={() => setEditInvoice(null)}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingEdit}
                onClick={saveEditInvoice}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {savingEdit
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NORMAL ORDER INVOICE MODAL
      ===================================================== */}

      {selectedInvoice && (
        <WalkInInvoice
          order={selectedInvoice}
          onClose={closeInvoice}
        />
      )}

      {/* =====================================================
          RENTAL INVOICE MODAL
      ===================================================== */}

      {selectedRentalInvoice && (
        <div
          className="admin-rental-invoice-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeRentalInvoice();
            }
          }}
        >
          <div className="admin-rental-invoice-modal">
            <div className="admin-rental-invoice-header">
              <div>
                <span>Rental Management</span>
                <h2>Rental Invoice</h2>
              </div>

              <button
                type="button"
                onClick={closeRentalInvoice}
              >
                <FiX />
              </button>
            </div>

            <div className="admin-rental-invoice-content">
              <WalkInRentalInvoice
                rentalData={selectedRentalInvoice}
                isAdminPreview={true}
                onAdminClose={closeRentalInvoice}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TECHNICIAN RECEIPT MODAL
      ===================================================== */}

      {selectedTechnicianReceipt &&
        (() => {
          const repair = selectedTechnicianReceipt;
          const branch = getBranchDetails(repair);

          return (
            <div
              className="tech-receipt-overlay"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  closeTechnicianReceipt();
                }
              }}
            >
              <div className="tech-receipt-modal">
                <div className="tech-receipt-top no-print">
                  <div>
                    <span className="tech-receipt-eyebrow">
                      Billing & Deliveries
                    </span>

                    <h2>Technician Service Receipt</h2>
                    <p>
                      Official workshop repair service receipt
                    </p>
                  </div>

                  <button
                    type="button"
                    className="tech-receipt-close"
                    onClick={closeTechnicianReceipt}
                  >
                    <FiX />
                  </button>
                </div>

                <div
                  className="tech-receipt-sheet"
                  id="technician-printable-receipt"
                >
                  {/* RECEIPT HEADER */}

                  <div className="tech-receipt-header">
                    <div>
                      <h1>ZAID INFOTECH</h1>
                      <p>
                        Premium Hardware Repairs,
                        Micro-Soldering & IT Solutions
                      </p>
                    </div>

                    <div className="tech-receipt-badge">
                      <h3>SERVICE RECEIPT</h3>

                      <div>
                        Ticket:{" "}
                        <strong>
                          {getTechnicianTicket(repair)}
                        </strong>
                      </div>

                      <div>
                        Date:{" "}
                        {formatDate(
                          repair?.updatedAt ||
                            repair?.createdAt ||
                            Date.now()
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER AND DEVICE */}

                  <div className="tech-receipt-party-grid">
                    <div className="tech-party-card">
                      <span>CUSTOMER DETAILS</span>

                      <strong>
                        {getTechnicianCustomerName(repair)}
                      </strong>

                      <div>
                        Phone:{" "}
                        {repair?.customerPhone || "N/A"}
                      </div>

                      {repair?.customerEmail && (
                        <div>
                          Email: {repair.customerEmail}
                        </div>
                      )}
                    </div>

                    <div className="tech-party-card">
                      <span>HARDWARE REPAIRED</span>

                      <strong>
                        {repair?.deviceModel ||
                          repair?.laptopModel ||
                          "Standard Device"}
                      </strong>

                      <div>
                        Technician:{" "}
                        {getTechnicianName(repair)}
                      </div>

                      <div>
                        Status:{" "}
                        <strong>
                          {getTechnicianStatus(repair)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* SALES AND COMPLETION DETAILS */}

                  <div className="tech-receipt-branch">
                    <div className="tech-receipt-section-heading">
                      <FiTool />
                      <strong>
                        SALES & COMPLETION DETAILS
                      </strong>
                    </div>

                    <div className="tech-receipt-branch-grid">
                      <div>
                        <small>Salesperson</small>
                        <strong>
                          {getRepairSalesperson(repair)}
                        </strong>
                      </div>

                      <div>
                        <small>Invoice Type</small>
                        <strong>
                          {getRepairInvoiceType(repair)}
                        </strong>
                      </div>

                      <div>
                        <small>Marked Completed By</small>
                        <strong>
                          {getRepairCompletedBy(repair)}
                        </strong>
                      </div>

                      <div>
                        <small>Completed At</small>
                        <strong>
                          {formatDate(repair?.completedAt)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* BRANCH DETAILS */}

                  <div className="tech-receipt-branch">
                    <div className="tech-receipt-section-heading">
                      <FiMapPin />
                      <strong>BRANCH DETAILS</strong>
                    </div>

                    <div className="tech-receipt-branch-grid">
                      <div>
                        <small>Branch Name</small>
                        <strong>{branch.name}</strong>
                      </div>

                      <div>
                        <small>Branch Code</small>
                        <strong>{branch.code}</strong>
                      </div>

                      <div>
                        <small>Branch Phone</small>
                        <strong>{branch.phone}</strong>
                      </div>

                      <div>
                        <small>Branch Email</small>
                        <strong>{branch.email}</strong>
                      </div>

                      <div className="tech-branch-address">
                        <small>Branch Address</small>
                        <strong>{branch.address}</strong>
                      </div>

                      {(branch.city || branch.state) && (
                        <div>
                          <small>City / State</small>
                          <strong>
                            {[branch.city, branch.state]
                              .filter(Boolean)
                              .join(", ")}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PROBLEM DETAILS */}

                  <div className="tech-receipt-problem">
                    <div className="tech-receipt-section-heading">
                      <FiTool />
                      <strong>
                        REPORTED PROBLEM DETAILS
                      </strong>
                    </div>

                    <div className="tech-receipt-problem-grid">
                      <div>
                        <small>Problem Category</small>
                        <strong>
                          {getProblemCategory(repair)}
                        </strong>
                      </div>

                      <div>
                        <small>Specific Problem</small>
                        <strong>
                          {getSpecificProblem(repair)}
                        </strong>
                      </div>
                    </div>

                    {repair?.issueDescription && (
                      <div className="tech-receipt-issue-description">
                        <small>
                          Additional Issue Description
                        </small>
                        <p>{repair.issueDescription}</p>
                      </div>
                    )}
                  </div>

                  {/* SERVICE TABLE */}

                  <div className="tech-receipt-table-wrapper">
                    <table className="tech-receipt-table">
                      <thead>
                        <tr>
                          <th>
                            Service / Problem Breakdown
                          </th>
                          <th>Part (₹)</th>
                          <th>Labor (₹)</th>
                          <th>Total (₹)</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.isArray(repair?.services) &&
                        repair.services.length > 0 ? (
                          repair.services.map(
                            (service, index) => {
                              const part = Number(
                                service?.partCost || 0
                              );

                              const labor = Number(
                                service?.laborCost || 0
                              );

                              const total = Number(
                                service?.totalCost ??
                                  part + labor
                              );

                              return (
                                <tr key={index}>
                                  <td>
                                    <strong>
                                      {service?.serviceName ||
                                        service?.name ||
                                        "Repair Service"}
                                    </strong>

                                    {service?.category && (
                                      <small>
                                        {service.category}
                                      </small>
                                    )}

                                    {index === 0 &&
                                      repair?.issueDescription && (
                                        <p>
                                          Issue:{" "}
                                          {repair.issueDescription}
                                        </p>
                                      )}
                                  </td>

                                  <td>
                                    ₹{part.toFixed(2)}
                                  </td>

                                  <td>
                                    ₹{labor.toFixed(2)}
                                  </td>

                                  <td>
                                    ₹{total.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td>
                              <strong>
                                Repair Diagnostics &
                                Technician Service
                              </strong>

                              <p>
                                {repair?.issueDescription ||
                                  getSpecificProblem(repair)}
                              </p>
                            </td>

                            <td>
                              ₹
                              {Number(
                                repair?.partCost || 0
                              ).toFixed(2)}
                            </td>

                            <td>
                              ₹
                              {Number(
                                repair?.laborCost ??
                                  Number(
                                    repair?.repairCost || 0
                                  ) -
                                    Number(
                                      repair?.partCost || 0
                                    )
                              ).toFixed(2)}
                            </td>

                            <td>
                              ₹
                              {Number(
                                repair?.repairCost || 0
                              ).toFixed(2)}
                            </td>
                          </tr>
                        )}

                        {repair?.remarks && (
                          <tr>
                            <td colSpan={3}>
                              <em>
                                Remarks: {repair.remarks}
                              </em>
                            </td>
                            <td>—</td>
                          </tr>
                        )}
                      </tbody>

                      <tfoot>
                        <tr>
                          <th colSpan={3}>
                            Total Amount Due / Paid:
                          </th>

                          <th>
                            ₹
                            {Number(
                              repair?.repairCost ||
                                getTechnicianAmount(repair)
                            ).toFixed(2)}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* FOOTER */}

                  <div className="tech-receipt-footer">
                    <p>
                      Thank you for choosing Zaid Infotech.
                    </p>

                    <p>
                      30 Days service warranty applies on
                      replaced components and verified
                      service repairs.
                    </p>
                  </div>
                </div>

                {/* RECEIPT ACTIONS */}

                <div className="tech-receipt-actions no-print">
                  <button
                    type="button"
                    onClick={closeTechnicianReceipt}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleTechnicianPrint}
                  >
                    <FiPrinter />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

export default AdminInvoices;
