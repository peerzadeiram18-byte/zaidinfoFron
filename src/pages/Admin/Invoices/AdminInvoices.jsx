import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  FiRefreshCw,
  FiEye,
  FiPrinter,
  FiX,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

import {
  getInvoices,
} from "../../../services/invoiceService";

import {
  toast,
} from "react-toastify";

import WalkInInvoice
  from "../../Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice";

import WalkInRentalInvoice
  from "../../Receptionist/WalkInRentalInvoice";
import "./AdminInvoices.css";


// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL;


// =====================================================
// ADMIN INVOICES
// =====================================================

function AdminInvoices() {

  // ===================================================
  // NORMAL ORDER INVOICES
  // ===================================================

  const [
    invoices,
    setInvoices,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);


  // ===================================================
  // TECHNICIAN / REPAIR
  // ===================================================

  const [
    technicianRepairs,
    setTechnicianRepairs,
  ] = useState([]);

  const [
    selectedTechnicianReceipt,
    setSelectedTechnicianReceipt,
  ] = useState(null);

  const [
    technicianLoading,
    setTechnicianLoading,
  ] = useState(false);


  // ===================================================
  // RENTAL INVOICES
  // ===================================================

  const [
    rentalInvoices,
    setRentalInvoices,
  ] = useState([]);

  const [
    selectedRentalInvoice,
    setSelectedRentalInvoice,
  ] = useState(null);

  const [
    rentalLoading,
    setRentalLoading,
  ] = useState(false);


  // ===================================================
  // FILTER
  // ===================================================

  const [
    invoiceFilter,
    setInvoiceFilter,
  ] = useState("ALL");

  const [
    searchText,
    setSearchText,
  ] = useState("");


  // ===================================================
  // LOAD ALL
  // ===================================================

  useEffect(() => {

    loadAllInvoiceData();

  }, []);


  // ===================================================
  // AUTH CONFIG
  // ===================================================

  const getAuthConfig = () => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

    return {

      headers: {

        Authorization:
          `Bearer ${token}`,

      },

    };

  };


  // ===================================================
  // LOAD EVERYTHING
  // ===================================================

  const loadAllInvoiceData = async () => {

    await Promise.allSettled([

      loadInvoices(),

      loadTechnicianReceipts(),

      loadRentalInvoices(),

    ]);

  };


  // ===================================================
  // NORMAL ORDER INVOICES
  // ===================================================

  const loadInvoices = async () => {

    try {

      setLoading(true);

      const response =
        await getInvoices();

      console.log(
        "================================"
      );

      console.log(
        "ADMIN ORDER INVOICES RESPONSE"
      );

      console.log(
        response
      );

      console.log(
        "================================"
      );


      const invoiceList =

        response?.invoices ||

        response?.data?.invoices ||

        response?.data ||

        [];


      console.log(
        "FINAL ORDER INVOICE LIST:",
        invoiceList
      );


      setInvoices(

        Array.isArray(invoiceList)
          ? invoiceList
          : []

      );

    } catch (error) {

      console.error(
        "LOAD ADMIN INVOICES ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error?.response?.data
      );


      toast.error(

        error?.response?.data?.message ||

        "Unable to load order invoices"

      );


      setInvoices([]);

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // TECHNICIAN / REPAIR RECEIPTS
  // ===================================================

  const loadTechnicianReceipts =
    async () => {

      try {

        setTechnicianLoading(true);


        const response =
          await axios.get(

            `${API_URL}/newRepair/`,

            getAuthConfig()

          );


        console.log(
          "================================"
        );

        console.log(
          "ADMIN TECHNICIAN RECEIPTS"
        );

        console.log(
          response
        );

        console.log(
          "================================"
        );


        const repairList =

          response?.data?.repairs ||

          response?.data?.data ||

          (
            Array.isArray(
              response?.data
            )
              ? response.data
              : []
          );


        setTechnicianRepairs(

          Array.isArray(repairList)
            ? repairList
            : []

        );

      } catch (error) {

        console.error(
          "LOAD TECHNICIAN RECEIPTS ERROR:",
          error
        );

        console.error(
          "TECHNICIAN BACKEND ERROR:",
          error?.response?.data
        );


        setTechnicianRepairs([]);

      } finally {

        setTechnicianLoading(false);

      }

    };


  // ===================================================
  // RENTAL INVOICES
  // ===================================================

  const loadRentalInvoices =
    async () => {

      try {

        setRentalLoading(true);


        const response =
          await axios.get(

            `${API_URL}/rentals`,

            getAuthConfig()

          );


        console.log(
          "================================"
        );

        console.log(
          "ADMIN RENTAL INVOICES"
        );

        console.log(
          response
        );

        console.log(
          "================================"
        );


        const rentalList =

          response?.data?.rentals ||

          response?.data?.data?.rentals ||

          response?.data?.data ||

          response?.rentals ||

          (
            Array.isArray(
              response?.data
            )
              ? response.data
              : []
          );


        console.log(
          "FINAL RENTAL LIST:",
          rentalList
        );


        setRentalInvoices(

          Array.isArray(rentalList)
            ? rentalList
            : []

        );

      } catch (error) {

        console.error(
          "LOAD RENTAL INVOICES ERROR:",
          error
        );

        console.error(
          "RENTAL BACKEND ERROR:",
          error?.response?.data
        );


        setRentalInvoices([]);

      } finally {

        setRentalLoading(false);

      }

    };


  // ===================================================
  // CUSTOMER NAME
  // ===================================================

  const getCustomerName =
    (invoice) => {

      return (

        invoice?.billingAddress?.fullName ||

        invoice?.billingAddress?.name ||

        invoice?.shippingAddress?.fullName ||

        invoice?.shippingAddress?.name ||

        invoice?.order?.shippingAddress?.fullName ||

        invoice?.order?.shippingAddress?.name ||

        invoice?.user?.fullName ||

        invoice?.user?.name ||

        invoice?.customerName ||

        "Walk-In Customer"

      );

    };


  // ===================================================
  // ORDER SOURCE
  // ===================================================

  const getOrderSource =
    (invoice) => {

      const source =

        invoice?.orderSource ||

        invoice?.order?.orderSource ||

        invoice?.orderSourceType ||

        invoice?.order?.orderSourceType ||

        "WALK_IN";


      return String(
        source
      ).trim().toUpperCase();

    };


  // ===================================================
  // ORDER TYPE
  // ===================================================

  const getOrderType =
    (invoice) => {

      const source =
        getOrderSource(
          invoice
        );


      if (
        source === "ONLINE"
      ) {

        return "ONLINE_ORDER";

      }


      return "WALK_IN_ORDER";

    };


  // ===================================================
  // ORDER TYPE LABEL
  // ===================================================

  const getOrderTypeLabel =
    (invoice) => {

      const type =
        getOrderType(
          invoice
        );


      if (
        type === "ONLINE_ORDER"
      ) {

        return "ONLINE ORDER";

      }


      return "WALK-IN ORDER";

    };


  // ===================================================
  // NORMAL INVOICE AMOUNT
  // ===================================================

  const getAmount =
    (invoice) => {

      return Number(

        invoice?.totalAmount ??

        invoice?.grandTotal ??

        invoice?.order?.totalAmount ??

        0

      );

    };


  // ===================================================
  // ORDER DATE
  // ===================================================

  const getInvoiceDate =
    (invoice) => {

      return (

        invoice?.invoiceDate ||

        invoice?.createdAt ||

        invoice?.updatedAt ||

        invoice?.order?.createdAt ||

        null

      );

    };


  // ===================================================
  // TECHNICIAN CUSTOMER
  // ===================================================

  const getTechnicianCustomerName =
    (repair) => {

      return (

        repair?.customerName ||

        repair?.customer?.fullName ||

        repair?.customer?.name ||

        repair?.user?.fullName ||

        repair?.user?.name ||

        "Customer"

      );

    };


  // ===================================================
  // TECHNICIAN NAME
  // ===================================================

  const getTechnicianName =
    (repair) => {

      const technician =

        repair?.assignedTechnician ||

        repair?.technicianName;


      if (!technician) {

        return "Assigned Specialist";

      }


      if (
        typeof technician === "string"
      ) {

        if (
          !technician.match(
            /^[0-9a-fA-F]{24}$/
          )
        ) {

          return technician;

        }


        return "Assigned Specialist";

      }


      if (
        typeof technician === "object"
      ) {

        const fullName =

          `${technician?.firstName || ""} ${
            technician?.lastName || ""
          }`.trim();


        return (

          fullName ||

          technician?.name ||

          technician?.fullName ||

          technician?.username ||

          "Assigned Specialist"

        );

      }


      return "Assigned Specialist";

    };


  // ===================================================
  // TECHNICIAN AMOUNT
  // ===================================================

  const getTechnicianAmount =
    (repair) => {

      const repairCost =
        Number(
          repair?.repairCost || 0
        );


      if (
        repairCost > 0
      ) {

        return repairCost;

      }


      if (
        Array.isArray(
          repair?.services
        )
      ) {

        return repair.services.reduce(

          (
            sum,
            service
          ) => {

            const part =
              Number(
                service?.partCost || 0
              );


            const labor =
              Number(
                service?.laborCost || 0
              );


            const total =
              Number(

                service?.totalCost ??

                part + labor

              );


            return sum + total;

          },

          0

        );

      }


      return 0;

    };


  // ===================================================
  // TECHNICIAN STATUS
  // ===================================================

  const getTechnicianStatus =
    (repair) => {

      return (

        repair?.status ||

        "Completed"

      );

    };


  // ===================================================
  // TECHNICIAN TICKET
  // ===================================================

  const getTechnicianTicket =
    (repair) => {

      return (

        repair?.repairNumber ||

        repair?.ticketNumber ||

        (
          repair?._id

            ? `TECH-${repair._id
                .slice(-6)
                .toUpperCase()}`

            : "TECH-RECEIPT"
        )

      );

    };


  // ===================================================
  // TECHNICIAN DATE
  // ===================================================

  const getTechnicianDate =
    (repair) => {

      return (

        repair?.updatedAt ||

        repair?.createdAt ||

        null

      );

    };


  // ===================================================
  // RENTAL CUSTOMER TYPE
  // ===================================================

  const getRentalCustomerType =
    (rental) => {

      return String(

        rental?.customerType ||

        "INDIVIDUAL"

      ).toUpperCase();

    };


  // ===================================================
  // RENTAL SOURCE
  // ===================================================

  const getRentalSource =
    (rental) => {

      const source =

        rental?.rentalSource ||

        rental?.source ||

        rental?.orderSource ||

        rental?.sourceType ||

        rental?.rentalType ||

        "";


      return String(
        source
      ).trim().toUpperCase();

    };


  // ===================================================
  // RENTAL TYPE
  // ===================================================

  const getRentalType =
    (rental) => {

      const source =
        getRentalSource(
          rental
        );


      if (
        source === "WALK_IN" ||
        source === "WALKIN" ||
        source === "WALK-IN"
      ) {

        return "WALK_IN_RENTAL";

      }


      return "ONLINE_RENTAL";

    };


  // ===================================================
  // RENTAL TYPE LABEL
  // ===================================================

  const getRentalTypeLabel =
    (rental) => {

      const type =
        getRentalType(
          rental
        );


      if (
        type === "WALK_IN_RENTAL"
      ) {

        return "WALK-IN RENTAL";

      }


      return "ONLINE RENTAL";

    };


  // ===================================================
  // RENTAL CUSTOMER
  // ===================================================

  const getRentalCustomerName =
    (rental) => {

      const type =
        getRentalCustomerType(
          rental
        );


      if (
        type === "COMPANY"
      ) {

        return (

          rental?.companyDetails
            ?.contactPerson ||

          rental?.companyDetails
            ?.companyName ||

          rental?.customer?.name ||

          "Company Customer"

        );

      }


      return (

        rental?.individualDetails
          ?.fullName ||

        rental?.customer?.name ||

        rental?.customer?.fullName ||

        rental?.customerName ||

        "Walk-In Customer"

      );

    };


  // ===================================================
  // RENTAL COMPANY
  // ===================================================

  const getRentalCompanyName =
    (rental) => {

      return (

        rental?.companyDetails
          ?.companyName ||

        ""

      );

    };


  // ===================================================
  // RENTAL PRODUCT
  // ===================================================

  const getRentalProduct =
    (rental) => {

      return (

        rental?.product ||

        rental?.rentalProduct?.product ||

        rental?.rentalProduct ||

        null

      );

    };


  // ===================================================
  // RENTAL PRODUCT NAME
  // ===================================================

  const getRentalProductName =
    (rental) => {

      const product =
        getRentalProduct(
          rental
        );


      if (
        typeof product === "string"
      ) {

        return product;

      }


      return (

        product?.name ||

        product?.title ||

        rental?.productName ||

        "Rental Laptop"

      );

    };


  // ===================================================
  // RENTAL MONTHLY RENT
  // ===================================================

  const getRentalMonthlyRent =
    (rental) => {

      return Number(

        rental?.monthlyRent ??

        rental?.rentalProduct?.monthlyRent ??

        rental?.rentPerMonth ??

        rental?.pricing?.monthlyRent ??

        0

      );

    };


  // ===================================================
  // RENTAL MONTHS
  // ===================================================

  const getRentalMonths =
    (rental) => {

      return Number(

        rental?.rentalMonths ??

        rental?.durationMonths ??

        rental?.months ??

        1

      );

    };


  // ===================================================
  // RENTAL GST
  // ===================================================

  const getRentalGST =
    (rental) => {

      return Number(

        rental?.gstPercentage ??

        rental?.gst ??

        rental?.taxPercentage ??

        rental?.pricing?.gstPercentage ??

        0

      );

    };


  // ===================================================
  // RENTAL DEPOSIT
  // ===================================================

  const getRentalDeposit =
    (rental) => {

      return Number(

        rental?.securityDeposit ??

        rental?.depositAmount ??

        rental?.securityDepositAmount ??

        0

      );

    };


  // ===================================================
  // RENTAL TOTAL
  // ===================================================

  const getRentalAmount =
    (rental) => {

      return (

        getRentalMonthlyRent(
          rental
        ) *

        getRentalMonths(
          rental
        )

      );

    };


  // ===================================================
  // RENTAL GST AMOUNT
  // ===================================================

  const getRentalGSTAmount =
    (rental) => {

      return (

        getRentalAmount(
          rental
        ) *

        getRentalGST(
          rental
        )

      ) / 100;

    };


  // ===================================================
  // RENTAL GRAND TOTAL
  // ===================================================

  const getRentalGrandTotal =
    (rental) => {

      return (

        getRentalAmount(
          rental
        ) +

        getRentalGSTAmount(
          rental
        )

      );

    };


  // ===================================================
  // RENTAL STATUS
  // ===================================================

  const getRentalStatus =
    (rental) => {

      return String(

        rental?.status ||

        "PENDING"

      ).toUpperCase();

    };


  // ===================================================
  // RENTAL PAYMENT
  // ===================================================

  const getRentalPaymentMethod =
    (rental) => {

      return (

        rental?.paymentMethod ||

        rental?.depositPaymentMethod ||

        rental?.payment?.method ||

        rental?.payment?.paymentMethod ||

        "-"

      );

    };


  // ===================================================
  // RENTAL INVOICE NUMBER
  // ===================================================

  const getRentalInvoiceNumber =
    (rental) => {

      const existing =

        rental?.invoiceNumber ||

        rental?.invoiceNo ||

        rental?.invoice
          ?.invoiceNumber;


      if (existing) {

        return String(existing);

      }


      const id = String(

        rental?._id ||

        rental?.rentalId ||

        ""

      );


      return (

        `RENT-${
          id
            .slice(-8)
            .toUpperCase()
        }`

      );

    };


  // ===================================================
  // RENTAL DATE
  // ===================================================

  const getRentalDate =
    (rental) => {

      return (

        rental?.createdAt ||

        rental?.createdDate ||

        rental?.date ||

        rental?.startDate ||

        null

      );

    };


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate =
    (date) => {

      if (!date) {

        return "-";

      }


      const parsed =
        new Date(date);


      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {

        return "-";

      }


      return parsed.toLocaleDateString(
        "en-IN"
      );

    };


  // ===================================================
  // NORMAL INVOICE -> ORDER
  // ===================================================

  const invoiceToOrder =
    (invoice) => {

      if (!invoice) {

        return null;

      }


      const originalOrder =

        invoice?.order &&

        typeof invoice.order === "object"

          ? invoice.order

          : {};


      const invoiceItems =

        Array.isArray(
          invoice?.items
        )

          ? invoice.items

          : [];


      const originalOrderItems =

        Array.isArray(
          originalOrder?.orderItems
        )

          ? originalOrder.orderItems

          : [];


      const sourceItems =

        originalOrderItems.length > 0

          ? originalOrderItems

          : invoiceItems;


      const orderItems =
        sourceItems.map(
          (item) => {

            const product =

              item?.product &&

              typeof item.product === "object"

                ? item.product

                : null;


            return {

              product:
                item?.product?._id ||
                item?.product ||
                null,


              productData:
                product,


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


              quantity:
                Number(
                  item?.quantity || 1
                ),


              originalPrice:
                Number(
                  item?.originalPrice ??
                  item?.price ??
                  0
                ),


              discountAmount:
                Number(
                  item?.discountAmount || 0
                ),


              price:
                Number(
                  item?.price ??
                  item?.originalPrice ??
                  0
                ),


              total:
                Number(

                  item?.total ??

                  (
                    Number(
                      item?.price ??
                      item?.originalPrice ??
                      0
                    ) *

                    Number(
                      item?.quantity || 1
                    )
                  )

                ),


              imageUrl:
                item?.imageUrl ||
                product?.imageUrl ||
                product?.images?.[0] ||
                "",

            };

          }
        );


      const shippingAddress =

        originalOrder?.shippingAddress ||

        invoice?.billingAddress ||

        invoice?.shippingAddress ||

        {};


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


        user:
          originalOrder?.user ||
          invoice?.user ||
          null,


        orderItems,


        items:
          invoiceItems,


        subtotal:
          Number(
            originalOrder?.subtotal ??
            invoice?.subtotal ??
            0
          ),


        discount:
          Number(
            originalOrder?.discount ??
            invoice?.discount ??
            0
          ),


        totalAmount:
          Number(
            originalOrder?.totalAmount ??
            invoice?.totalAmount ??
            0
          ),


        paidAmount:
          Number(
            originalOrder?.paidAmount ??
            invoice?.paidAmount ??
            invoice?.totalAmount ??
            0
          ),


        balanceAmount:
          Number(
            originalOrder?.balanceAmount ??
            invoice?.balanceAmount ??
            0
          ),


        paymentStatus:
          originalOrder?.paymentStatus ||
          invoice?.paymentStatus ||
          "PAID",


        orderStatus:
          originalOrder?.orderStatus ||
          "DELIVERED",


        paymentMethod:
          originalOrder?.paymentMethod ||
          invoice?.paymentMethod ||
          invoice?.payment?.paymentMethod ||
          "UPI",


        payment:
          originalOrder?.payment ||
          invoice?.payment ||
          null,


        orderSource:
          originalOrder?.orderSource ||
          invoice?.orderSource ||
          "WALK_IN",


        shippingAddress,


        billingAddress:
          invoice?.billingAddress ||
          originalOrder?.billingAddress ||
          shippingAddress,


        invoiceNumber:
          invoice?.invoiceNumber,


        invoiceId:
          invoice?._id,


        invoiceDate:
          invoice?.invoiceDate,


        invoiceFor:
          invoice?.invoiceFor ||
          "ORDER",

      };

    };


  // ===================================================
  // OPEN NORMAL
  // ===================================================

  const openInvoice =
    (invoice) => {

      console.log(
        "SELECTED ORDER INVOICE:",
        invoice
      );


      setSelectedInvoice(
        invoiceToOrder(
          invoice
        )
      );

    };


  // ===================================================
  // OPEN TECHNICIAN
  // ===================================================

  const openTechnicianReceipt =
    (repair) => {

      if (!repair) {

        return;

      }


      setSelectedTechnicianReceipt(
        repair
      );

    };


  // ===================================================
  // OPEN RENTAL
  // ===================================================

  const openRentalInvoice =
    (rental) => {

      if (!rental) {

        return;

      }


      console.log(
        "SELECTED RENTAL:",
        rental
      );


      setSelectedRentalInvoice(
        rental
      );

    };


  // ===================================================
  // CLOSE
  // ===================================================

  const closeInvoice =
    () => {

      setSelectedInvoice(null);

    };


  const closeTechnicianReceipt =
    () => {

      setSelectedTechnicianReceipt(
        null
      );

    };


  const closeRentalInvoice =
    () => {

      setSelectedRentalInvoice(
        null
      );

    };


  // ===================================================
  // PRINT TECHNICIAN
  // ===================================================

  const handleTechnicianPrint =
    () => {

      window.print();

    };


  // ===================================================
  // UNIFIED RECORDS
  // ===================================================

  const unifiedRecords =
    useMemo(() => {

      const orderRecords =
        invoices.map(
          (invoice) => {

            return {

              id:
                `invoice-${invoice?._id}`,

              type:
                getOrderType(
                  invoice
                ),

              typeLabel:
                getOrderTypeLabel(
                  invoice
                ),

              source:
                getOrderSource(
                  invoice
                ),

              data:
                invoice,

              customer:
                getCustomerName(
                  invoice
                ),

              amount:
                getAmount(
                  invoice
                ),

              date:
                getInvoiceDate(
                  invoice
                ),

              status:
                String(
                  invoice?.paymentStatus ||
                  "PAID"
                ).toUpperCase(),

            };

          }
        );


      const rentalRecords =
        rentalInvoices.map(
          (rental) => {

            return {

              id:
                `rental-${rental?._id}`,

              type:
                getRentalType(
                  rental
                ),

              typeLabel:
                getRentalTypeLabel(
                  rental
                ),

              source:
                getRentalSource(
                  rental
                ),

              data:
                rental,

              customer:
                getRentalCustomerName(
                  rental
                ),

              amount:
                getRentalGrandTotal(
                  rental
                ),

              date:
                getRentalDate(
                  rental
                ),

              status:
                getRentalStatus(
                  rental
                ),

            };

          }
        );


      const repairRecords =
        technicianRepairs.map(
          (repair) => {

            return {

              id:
                `technician-${repair?._id}`,

              type:
                "REPAIR",

              typeLabel:
                "TECHNICIAN / REPAIR",

              source:
                "TECHNICIAN",

              data:
                repair,

              customer:
                getTechnicianCustomerName(
                  repair
                ),

              amount:
                getTechnicianAmount(
                  repair
                ),

              date:
                getTechnicianDate(
                  repair
                ),

              status:
                String(
                  getTechnicianStatus(
                    repair
                  )
                ).toUpperCase(),

            };

          }
        );


      return [

        ...orderRecords,

        ...rentalRecords,

        ...repairRecords,

      ];

    }, [
      invoices,
      rentalInvoices,
      technicianRepairs,
    ]);


  // ===================================================
  // FILTERED RECORDS
  // ===================================================

  const filteredRecords =
    useMemo(() => {

      const search =
        searchText
          .trim()
          .toLowerCase();


      let records =
        [...unifiedRecords];


      // -----------------------------------------------
      // TYPE FILTER
      // -----------------------------------------------

      if (
        invoiceFilter !== "ALL"
      ) {

        records =
          records.filter(
            (record) => {

              return (
                record.type ===
                invoiceFilter
              );

            }
          );

      }


      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      if (search) {

        records =
          records.filter(
            (record) => {

              const data =
                record.data;


              const invoiceNumber =

                data?.invoiceNumber ||

                data?.invoiceNo ||

                data?.invoice?.invoiceNumber ||

                "";


              const ticket =

                data?.repairNumber ||

                data?.ticketNumber ||

                "";


              const product =

                getRentalProductName(
                  data
                );


              const text = [

                record.typeLabel,

                record.customer,

                invoiceNumber,

                ticket,

                product,

                record.status,

                data?.paymentMethod,

                data?.customerPhone,

                data?.companyDetails?.companyName,

              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


              return text.includes(
                search
              );

            }
          );

      }


      // -----------------------------------------------
      // SORT NEWEST FIRST
      // -----------------------------------------------

      records.sort(
        (a, b) => {

          const dateA =
            a.date
              ? new Date(a.date).getTime()
              : 0;


          const dateB =
            b.date
              ? new Date(b.date).getTime()
              : 0;


          return dateB - dateA;

        }
      );


      return records;

    }, [
      unifiedRecords,
      invoiceFilter,
      searchText,
    ]);


  // ===================================================
  // FILTER COUNTS
  // ===================================================

  const filterCounts =
    useMemo(() => {

      return {

        ALL:
          unifiedRecords.length,

        ONLINE_ORDER:
          unifiedRecords.filter(
            (item) =>
              item.type ===
              "ONLINE_ORDER"
          ).length,

        WALK_IN_ORDER:
          unifiedRecords.filter(
            (item) =>
              item.type ===
              "WALK_IN_ORDER"
          ).length,

        ONLINE_RENTAL:
          unifiedRecords.filter(
            (item) =>
              item.type ===
              "ONLINE_RENTAL"
          ).length,

        WALK_IN_RENTAL:
          unifiedRecords.filter(
            (item) =>
              item.type ===
              "WALK_IN_RENTAL"
          ).length,

        REPAIR:
          unifiedRecords.filter(
            (item) =>
              item.type ===
              "REPAIR"
          ).length,

      };

    }, [
      unifiedRecords,
    ]);


  // ===================================================
  // TOTAL
  // ===================================================

  const totalRecords =
    unifiedRecords.length;


  const isLoading =
    loading ||
    technicianLoading ||
    rentalLoading;


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="admin-invoices-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-invoices-header">

        <div>

          <h1>
            Invoices & Receipts
          </h1>

          <p>
            Online Orders, Walk-In Orders,
            Rentals & Technician Repairs
          </p>

        </div>


        <button
          type="button"
          onClick={
            loadAllInvoiceData
          }
          disabled={
            isLoading
          }
        >

          <FiRefreshCw
            style={{
              marginRight: 6,
            }}
          />

          {isLoading
            ? "Loading..."
            : "Refresh"
          }

        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

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

        <button
          type="button"
          onClick={() =>
            setInvoiceFilter("ALL")
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter === "ALL"
                ? "2px solid #111827"
                : "1px solid #e5e7eb",
            background: "#ffffff",
            textAlign: "left",
          }}
        >

          <strong>
            ALL
          </strong>

          <div>
            {filterCounts.ALL}
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setInvoiceFilter(
              "ONLINE_ORDER"
            )
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter ===
              "ONLINE_ORDER"
                ? "2px solid #2563eb"
                : "1px solid #e5e7eb",
            background: "#eff6ff",
            textAlign: "left",
          }}
        >

          <strong>
            ONLINE ORDER
          </strong>

          <div>
            {filterCounts.ONLINE_ORDER}
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setInvoiceFilter(
              "WALK_IN_ORDER"
            )
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter ===
              "WALK_IN_ORDER"
                ? "2px solid #ea580c"
                : "1px solid #e5e7eb",
            background: "#fff7ed",
            textAlign: "left",
          }}
        >

          <strong>
            WALK-IN ORDER
          </strong>

          <div>
            {filterCounts.WALK_IN_ORDER}
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setInvoiceFilter(
              "ONLINE_RENTAL"
            )
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter ===
              "ONLINE_RENTAL"
                ? "2px solid #0891b2"
                : "1px solid #e5e7eb",
            background: "#ecfeff",
            textAlign: "left",
          }}
        >

          <strong>
            ONLINE RENTAL
          </strong>

          <div>
            {filterCounts.ONLINE_RENTAL}
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setInvoiceFilter(
              "WALK_IN_RENTAL"
            )
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter ===
              "WALK_IN_RENTAL"
                ? "2px solid #0f766e"
                : "1px solid #e5e7eb",
            background: "#f0fdfa",
            textAlign: "left",
          }}
        >

          <strong>
            WALK-IN RENTAL
          </strong>

          <div>
            {filterCounts.WALK_IN_RENTAL}
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setInvoiceFilter(
              "REPAIR"
            )
          }
          style={{
            cursor: "pointer",
            padding: "14px",
            borderRadius: "10px",
            border:
              invoiceFilter ===
              "REPAIR"
                ? "2px solid #7c3aed"
                : "1px solid #e5e7eb",
            background: "#faf5ff",
            textAlign: "left",
          }}
        >

          <strong>
            REPAIR
          </strong>

          <div>
            {filterCounts.REPAIR}
          </div>

        </button>

      </div>


      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

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
              transform:
                "translateY(-50%)",
              color: "#6b7280",
            }}
          />

          <input
            type="text"
            value={
              searchText
            }
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            placeholder={
              "Search invoice, customer, product, ticket..."
            }
            style={{
              width: "100%",
              padding:
                "11px 12px 11px 38px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />

        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >

          <FiFilter />

          <select
            value={
              invoiceFilter
            }
            onChange={(e) =>
              setInvoiceFilter(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              background:
                "#ffffff",
            }}
          >

            <option value="ALL">
              All
            </option>

            <option value="ONLINE_ORDER">
              Online Orders
            </option>

            <option value="WALK_IN_ORDER">
              Walk-In Orders
            </option>

            <option value="ONLINE_RENTAL">
              Online Rentals
            </option>

            <option value="WALK_IN_RENTAL">
              Walk-In Rentals
            </option>

            <option value="REPAIR">
              Technician / Repair
            </option>

          </select>

        </div>

      </div>


      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div
        style={{
          marginBottom: "14px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >

        Showing{" "}
        <strong>
          {filteredRecords.length}
        </strong>{" "}
        of{" "}
        <strong>
          {totalRecords}
        </strong>{" "}
        records

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {isLoading && totalRecords === 0 ? (

        <div className="empty-invoices">

          <p>
            Loading invoices & receipts...
          </p>

        </div>

      ) : filteredRecords.length === 0 ? (

        <div className="empty-invoices">

          <h3>
            No invoices or receipts found
          </h3>

          <p>
            Try changing the filter or
            search text.
          </p>

        </div>

      ) : (

        <div className="invoice-list">

          {/* =================================================
              UNIFIED RECORDS
          ================================================= */}

          {filteredRecords.map(
            (record) => {

              const data =
                record.data;


              // =============================================
              // ONLINE / WALK-IN ORDER
              // =============================================

              if (
                record.type ===
                  "ONLINE_ORDER" ||

                record.type ===
                  "WALK_IN_ORDER"
              ) {

                const source =
                  getOrderSource(
                    data
                  );


                const customer =
                  getCustomerName(
                    data
                  );


                const amount =
                  getAmount(
                    data
                  );


                const invoiceNumber =

                  data?.invoiceNumber ||

                  data?._id ||

                  "Invoice";


                return (

                  <div
                    className="invoice-card"
                    key={
                      record.id
                    }
                  >

                    <div
                      className="invoice-card-info"
                    >

                      <h3>

                        {
                          invoiceNumber
                        }

                      </h3>


                      <p>

                        <strong>
                          Type:
                        </strong>{" "}

                        <span
                          className="invoice-source"
                          style={{
                            background:
                              source ===
                              "ONLINE"
                                ? "#dbeafe"
                                : "#ffedd5",

                            color:
                              source ===
                              "ONLINE"
                                ? "#1d4ed8"
                                : "#c2410c",

                            border:
                              source ===
                              "ONLINE"
                                ? "1px solid #93c5fd"
                                : "1px solid #fdba74",
                          }}
                        >

                          {
                            getOrderTypeLabel(
                              data
                            )
                          }

                        </span>

                      </p>


                      <p>

                        <strong>
                          Customer:
                        </strong>{" "}

                        {
                          customer
                        }

                      </p>


                      <p>

                        <strong>
                          Amount:
                        </strong>{" "}

                        ₹{" "}

                        {
                          amount.toLocaleString(
                            "en-IN"
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Payment:
                        </strong>{" "}

                        {
                          data?.paymentMethod ||

                          data?.payment
                            ?.paymentMethod ||

                          "UPI"
                        }

                      </p>


                      <p>

                        <strong>
                          Status:
                        </strong>{" "}

                        {
                          data?.paymentStatus ||

                          "PAID"
                        }

                      </p>


                      <p>

                        <strong>
                          Date:
                        </strong>{" "}

                        {
                          formatDate(
                            getInvoiceDate(
                              data
                            )
                          )
                        }

                      </p>

                    </div>


                    <button
                      type="button"
                      className="view-invoice-btn"
                      onClick={() =>
                        openInvoice(
                          data
                        )
                      }
                    >

                      <FiEye
                        style={{
                          marginRight: 6,
                        }}
                      />

                      View Invoice

                    </button>

                  </div>

                );

              }


              // =============================================
              // RENTAL
              // =============================================

              if (
                record.type ===
                  "ONLINE_RENTAL" ||

                record.type ===
                  "WALK_IN_RENTAL"
              ) {

                const customer =
                  getRentalCustomerName(
                    data
                  );


                const company =
                  getRentalCompanyName(
                    data
                  );


                const product =
                  getRentalProductName(
                    data
                  );


                const amount =
                  getRentalGrandTotal(
                    data
                  );


                const deposit =
                  getRentalDeposit(
                    data
                  );


                const status =
                  getRentalStatus(
                    data
                  );


                const rentalType =
                  getRentalTypeLabel(
                    data
                  );


                const isWalkInRental =
                  record.type ===
                  "WALK_IN_RENTAL";


                return (

                  <div
                    className="invoice-card rental-invoice-card"
                    key={
                      record.id
                    }
                    style={{
                      borderLeft:
                        isWalkInRental
                          ? "4px solid #0f766e"
                          : "4px solid #0891b2",
                    }}
                  >

                    <div
                      className="invoice-card-info"
                    >

                      <h3>

                        {
                          getRentalInvoiceNumber(
                            data
                          )
                        }

                      </h3>


                      <p>

                        <strong>
                          Type:
                        </strong>{" "}

                        <span
                          className="invoice-source"
                          style={{
                            background:
                              isWalkInRental
                                ? "#ccfbf1"
                                : "#cffafe",

                            color:
                              isWalkInRental
                                ? "#0f766e"
                                : "#0e7490",

                            border:
                              isWalkInRental
                                ? "1px solid #99f6e4"
                                : "1px solid #a5f3fc",
                          }}
                        >

                          {
                            rentalType
                          }

                        </span>

                      </p>


                      <p>

                        <strong>
                          Customer:
                        </strong>{" "}

                        {
                          customer
                        }

                      </p>


                      {
                        company && (

                          <p>

                            <strong>
                              Company:
                            </strong>{" "}

                            {
                              company
                            }

                          </p>

                        )
                      }


                      <p>

                        <strong>
                          Product:
                        </strong>{" "}

                        {
                          product
                        }

                      </p>


                      <p>

                        <strong>
                          Duration:
                        </strong>{" "}

                        {
                          getRentalMonths(
                            data
                          )
                        }{" "}

                        {
                          getRentalMonths(
                            data
                          ) === 1
                            ? "Month"
                            : "Months"
                        }

                      </p>


                      <p>

                        <strong>
                          Rent:
                        </strong>{" "}

                        ₹{" "}

                        {
                          getRentalAmount(
                            data
                          ).toLocaleString(
                            "en-IN"
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Deposit:
                        </strong>{" "}

                        ₹{" "}

                        {
                          deposit.toLocaleString(
                            "en-IN"
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Total:
                        </strong>{" "}

                        ₹{" "}

                        {
                          amount.toLocaleString(
                            "en-IN"
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Payment:
                        </strong>{" "}

                        {
                          getRentalPaymentMethod(
                            data
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Status:
                        </strong>{" "}

                        {
                          status
                        }

                      </p>


                      <p>

                        <strong>
                          Date:
                        </strong>{" "}

                        {
                          formatDate(
                            getRentalDate(
                              data
                            )
                          )
                        }

                      </p>

                    </div>


                    <button
                      type="button"
                      className="view-invoice-btn"
                      style={{
                        background:
                          isWalkInRental
                            ? "#0f766e"
                            : "#0891b2",

                        color:
                          "#ffffff",
                      }}
                      onClick={() =>
                        openRentalInvoice(
                          data
                        )
                      }
                    >

                      <FiEye
                        style={{
                          marginRight: 6,
                        }}
                      />

                      View Rental Invoice

                    </button>

                  </div>

                );

              }


              // =============================================
              // TECHNICIAN / REPAIR
              // =============================================

              if (
                record.type ===
                "REPAIR"
              ) {

                const customer =
                  getTechnicianCustomerName(
                    data
                  );


                const technician =
                  getTechnicianName(
                    data
                  );


                const amount =
                  getTechnicianAmount(
                    data
                  );


                const status =
                  getTechnicianStatus(
                    data
                  );


                const ticket =
                  getTechnicianTicket(
                    data
                  );


                return (

                  <div
                    className="invoice-card technician-receipt-card"
                    key={
                      record.id
                    }
                    style={{
                      borderLeft:
                        "4px solid #7c3aed",
                    }}
                  >

                    <div
                      className="invoice-card-info"
                    >

                      <h3>

                        {
                          ticket
                        }

                      </h3>


                      <p>

                        <strong>
                          Type:
                        </strong>{" "}

                        <span
                          className="invoice-source"
                          style={{
                            background:
                              "#f3e8ff",

                            color:
                              "#7c3aed",

                            border:
                              "1px solid #ddd6fe",
                          }}
                        >

                          TECHNICIAN / REPAIR

                        </span>

                      </p>


                      <p>

                        <strong>
                          Customer:
                        </strong>{" "}

                        {
                          customer
                        }

                      </p>


                      <p>

                        <strong>
                          Device:
                        </strong>{" "}

                        {
                          data?.deviceModel ||

                          data?.laptopModel ||

                          "Standard Device"
                        }

                      </p>


                      <p>

                        <strong>
                          Technician:
                        </strong>{" "}

                        {
                          technician
                        }

                      </p>


                      <p>

                        <strong>
                          Amount:
                        </strong>{" "}

                        ₹{" "}

                        {
                          amount.toLocaleString(
                            "en-IN"
                          )
                        }

                      </p>


                      <p>

                        <strong>
                          Status:
                        </strong>{" "}

                        {
                          status
                        }

                      </p>


                      <p>

                        <strong>
                          Date:
                        </strong>{" "}

                        {
                          formatDate(
                            getTechnicianDate(
                              data
                            )
                          )
                        }

                      </p>

                    </div>


                    <button
                      type="button"
                      className="view-invoice-btn"
                      style={{
                        background:
                          "#7c3aed",

                        color:
                          "#ffffff",
                      }}
                      onClick={() =>
                        openTechnicianReceipt(
                          data
                        )
                      }
                    >

                      <FiPrinter
                        style={{
                          marginRight: 6,
                        }}
                      />

                      View Receipt

                    </button>

                  </div>

                );

              }


              return null;

            }
          )}

        </div>

      )}


      {/* =================================================
          NORMAL ORDER INVOICE MODAL
      ================================================= */}

      {selectedInvoice && (

        <WalkInInvoice

          order={
            selectedInvoice
          }

          onClose={
            closeInvoice
          }

        />

      )}


      {/* =================================================
          RENTAL INVOICE MODAL
      ================================================= */}

      {selectedRentalInvoice && (

        <div
          className="admin-rental-invoice-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeRentalInvoice();

            }

          }}
        >

          <div
            className="admin-rental-invoice-modal"
          >

            <div
              className="admin-rental-invoice-header"
            >

              <div>

                <span>
                  Rental Management
                </span>

                <h2>
                  Rental Invoice
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeRentalInvoice
                }
              >

                <FiX />

              </button>

            </div>


            <div
              className="admin-rental-invoice-content"
            >

              <WalkInRentalInvoice

                rentalData={
                  selectedRentalInvoice
                }

                isAdminPreview={
                  true
                }

                onAdminClose={
                  closeRentalInvoice
                }

              />

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          TECHNICIAN RECEIPT MODAL
      ================================================= */}

      {selectedTechnicianReceipt && (

        <div
          className="tech-receipt-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeTechnicianReceipt();

            }

          }}
        >

          <div
            className="tech-receipt-modal"
          >

            <div
              className="tech-receipt-top no-print"
            >

              <div>

                <span
                  className="tech-receipt-eyebrow"
                >
                  Billing & Deliveries
                </span>

                <h2>
                  Technician Service Receipt
                </h2>

                <p>
                  Official workshop repair
                  service receipt
                </p>

              </div>


              <button
                type="button"
                className="tech-receipt-close"
                onClick={
                  closeTechnicianReceipt
                }
              >

                <FiX />

              </button>

            </div>


            <div
              className="tech-receipt-sheet"
              id="technician-printable-receipt"
            >

              <div
                className="tech-receipt-header"
              >

                <div>

                  <h1>
                    ZAID INFOTECH
                  </h1>

                  <p>
                    Premium Hardware Repairs,
                    Micro-Soldering & IT Solutions
                  </p>

                </div>


                <div
                  className="tech-receipt-badge"
                >

                  <h3>
                    SERVICE RECEIPT
                  </h3>


                  <div>

                    Ticket:{" "}

                    <strong>

                      {
                        getTechnicianTicket(
                          selectedTechnicianReceipt
                        )
                      }

                    </strong>

                  </div>


                  <div>

                    Date:{" "}

                    {
                      formatDate(

                        selectedTechnicianReceipt?.updatedAt ||

                        selectedTechnicianReceipt?.createdAt ||

                        Date.now()

                      )
                    }

                  </div>

                </div>

              </div>


              <div
                className="tech-receipt-party-grid"
              >

                <div
                  className="tech-party-card"
                >

                  <span>
                    CUSTOMER DETAILS
                  </span>


                  <strong>

                    {
                      getTechnicianCustomerName(
                        selectedTechnicianReceipt
                      )
                    }

                  </strong>


                  <div>

                    Phone:{" "}

                    {
                      selectedTechnicianReceipt?.customerPhone ||
                      "N/A"
                    }

                  </div>


                  {
                    selectedTechnicianReceipt?.customerEmail && (

                      <div>

                        Email:{" "}

                        {
                          selectedTechnicianReceipt.customerEmail
                        }

                      </div>

                    )
                  }

                </div>


                <div
                  className="tech-party-card"
                >

                  <span>
                    HARDWARE REPAIRED
                  </span>


                  <strong>

                    {
                      selectedTechnicianReceipt?.deviceModel ||

                      selectedTechnicianReceipt?.laptopModel ||

                      "Standard Device"
                    }

                  </strong>


                  <div>

                    Technician:{" "}

                    {
                      getTechnicianName(
                        selectedTechnicianReceipt
                      )
                    }

                  </div>


                  <div>

                    Status:{" "}

                    <strong>

                      {
                        getTechnicianStatus(
                          selectedTechnicianReceipt
                        )
                      }

                    </strong>

                  </div>

                </div>

              </div>


              <div
                className="tech-receipt-table-wrapper"
              >

                <table
                  className="tech-receipt-table"
                >

                  <thead>

                    <tr>

                      <th>
                        Service / Problem Breakdown
                      </th>

                      <th>
                        Part (₹)
                      </th>

                      <th>
                        Labor (₹)
                      </th>

                      <th>
                        Total (₹)
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      Array.isArray(
                        selectedTechnicianReceipt?.services
                      ) &&

                      selectedTechnicianReceipt
                        .services
                        .length > 0

                        ? (

                          selectedTechnicianReceipt
                            .services
                            .map(
                              (
                                service,
                                index
                              ) => {

                                const part =
                                  Number(
                                    service?.partCost || 0
                                  );


                                const labor =
                                  Number(
                                    service?.laborCost || 0
                                  );


                                const total =
                                  Number(

                                    service?.totalCost ??

                                    part + labor

                                  );


                                return (

                                  <tr
                                    key={
                                      index
                                    }
                                  >

                                    <td>

                                      <strong>

                                        {
                                          service?.serviceName ||

                                          service?.name ||

                                          "Repair Service"
                                        }

                                      </strong>


                                      {
                                        service?.category && (

                                          <small>

                                            {
                                              service.category
                                            }

                                          </small>

                                        )
                                      }


                                      {
                                        index === 0 &&

                                        selectedTechnicianReceipt?.issueDescription && (

                                          <p>

                                            Issue:{" "}

                                            {
                                              selectedTechnicianReceipt.issueDescription
                                            }

                                          </p>

                                        )
                                      }

                                    </td>


                                    <td>

                                      ₹
                                      {part.toFixed(2)}

                                    </td>


                                    <td>

                                      ₹
                                      {labor.toFixed(2)}

                                    </td>


                                    <td>

                                      ₹
                                      {total.toFixed(2)}

                                    </td>

                                  </tr>

                                );

                              }
                            )

                        )

                        : (

                          <tr>

                            <td>

                              <strong>
                                Repair Diagnostics &
                                Technician Service
                              </strong>


                              <p>

                                {
                                  selectedTechnicianReceipt?.issueDescription ||

                                  "General Hardware Issue"
                                }

                              </p>

                            </td>


                            <td>

                              ₹
                              {Number(
                                selectedTechnicianReceipt?.partCost ||
                                0
                              ).toFixed(2)}

                            </td>


                            <td>

                              ₹
                              {Number(

                                selectedTechnicianReceipt?.laborCost ??

                                (
                                  Number(
                                    selectedTechnicianReceipt?.repairCost ||
                                    0
                                  ) -

                                  Number(
                                    selectedTechnicianReceipt?.partCost ||
                                    0
                                  )
                                )

                              ).toFixed(2)}

                            </td>


                            <td>

                              ₹
                              {Number(
                                selectedTechnicianReceipt?.repairCost ||
                                0
                              ).toFixed(2)}

                            </td>

                          </tr>

                        )
                    }


                    {
                      selectedTechnicianReceipt?.remarks && (

                        <tr>

                          <td colSpan={3}>

                            <em>

                              Remarks:{" "}

                              {
                                selectedTechnicianReceipt.remarks
                              }

                            </em>

                          </td>


                          <td>
                            —
                          </td>

                        </tr>

                      )
                    }

                  </tbody>


                  <tfoot>

                    <tr>

                      <th colSpan={3}>

                        Total Amount Due / Paid:

                      </th>


                      <th>

                        ₹

                        {
                          Number(

                            selectedTechnicianReceipt?.repairCost ||

                            getTechnicianAmount(
                              selectedTechnicianReceipt
                            )

                          ).toFixed(2)
                        }

                      </th>

                    </tr>

                  </tfoot>

                </table>

              </div>


              <div
                className="tech-receipt-footer"
              >

                <p>
                  Thank you for choosing
                  Zaid Infotech.
                </p>

                <p>
                  30 Days service warranty
                  applies on replaced components
                  and verified service repairs.
                </p>

              </div>

            </div>


            <div
              className="tech-receipt-actions no-print"
            >

              <button
                type="button"
                onClick={
                  closeTechnicianReceipt
                }
              >

                Close

              </button>


              <button
                type="button"
                onClick={
                  handleTechnicianPrint
                }
              >

                <FiPrinter />

                Print Receipt

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminInvoices;