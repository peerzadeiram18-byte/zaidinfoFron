// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useNavigate, useParams } from "react-router-dom";

// import {
//   ArrowLeft,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   FileText,
//   Loader2,
//   Package,
//   Phone,
//   Mail,
//   MapPin,
//   User,
//   Building2,
//   IndianRupee,
//   RefreshCw,
//   ShieldCheck,
//   AlertCircle,
//   ExternalLink,
//   Download,
//   Eye,
//   FileCheck2,
//   XCircle,
// } from "lucide-react";

// import {
//   getRentalById,
//   getRentalDocuments,
//   markRentalDepositReceived,
//   allocateRental,
//   markRentalReturned,
// } from "../../services/rentalApi";

// import "./WalkInRentalDetails.css";

// // ============================================================
// // HELPERS
// // ============================================================

// const getId = (value) => {
//   if (!value) return "";

//   if (typeof value === "string") {
//     return value;
//   }

//   return (
//     value?._id ||
//     value?.id ||
//     value?.$oid ||
//     ""
//   );
// };

// const getName = (value) => {
//   if (!value) return "";

//   if (typeof value === "string") {
//     return value;
//   }

//   return (
//     value?.name ||
//     value?.title ||
//     value?.productName ||
//     value?.label ||
//     ""
//   );
// };

// const getNumber = (...values) => {
//   for (const value of values) {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return 0;
// };

// const formatMoney = (value) => {
//   const number = Number(value || 0);

//   return `₹${number.toLocaleString("en-IN", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   })}`;
// };

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatDateTime = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return date.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getStatusClass = (status) => {
//   const value = String(status || "").toUpperCase();

//   if (
//     value === "ACTIVE" ||
//     value === "ALLOCATED" ||
//     value === "APPROVED" ||
//     value === "COMPLETED"
//   ) {
//     return "success";
//   }

//   if (
//     value === "PENDING" ||
//     value === "REQUESTED" ||
//     value === "DEPOSIT_PENDING"
//   ) {
//     return "warning";
//   }

//   if (
//     value === "REJECTED" ||
//     value === "CANCELLED"
//   ) {
//     return "danger";
//   }

//   if (
//     value === "RETURNED" ||
//     value === "CLOSED"
//   ) {
//     return "info";
//   }

//   return "neutral";
// };

// // ============================================================
// // EXTRACT RENTAL
// // ============================================================

// const extractRental = (response) => {
//   if (!response) return null;

//   const data = response?.data;

//   if (data?.rental) {
//     return data.rental;
//   }

//   if (data?.data?.rental) {
//     return data.data.rental;
//   }

//   if (data?.data) {
//     return data.data;
//   }

//   if (response?.rental) {
//     return response.rental;
//   }

//   return data || response;
// };

// // ============================================================
// // EXTRACT DOCUMENTS
// // ============================================================

// const extractDocuments = (response) => {
//   if (!response) {
//     return [];
//   }

//   const data = response?.data;

//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data?.documents)) {
//     return data.documents;
//   }

//   if (Array.isArray(data?.data)) {
//     return data.data;
//   }

//   if (Array.isArray(data?.data?.documents)) {
//     return data.data.documents;
//   }

//   if (Array.isArray(response?.documents)) {
//     return response.documents;
//   }

//   return [];
// };

// // ============================================================
// // SERVER URL
// // ============================================================

// const getServerUrl = () => {
//   const apiUrl =
//     import.meta.env.VITE_API_URL || "";

//   return apiUrl.replace(/\/api\/?$/, "");
// };

// // ============================================================
// // NORMALIZE FILE URL
// // ============================================================

// const normalizeFileUrl = (file) => {
//   if (!file) {
//     return "";
//   }

//   if (typeof file === "object") {
//     file =
//       file?.url ||
//       file?.fileUrl ||
//       file?.imageUrl ||
//       file?.path ||
//       file?.src ||
//       file?.secure_url ||
//       "";

//     if (!file) {
//       return "";
//     }
//   }

//   file = String(file).trim();

//   if (!file) {
//     return "";
//   }

//   // Already complete URL
//   if (
//     file.startsWith("http://") ||
//     file.startsWith("https://") ||
//     file.startsWith("data:")
//   ) {
//     return file;
//   }

//   const serverUrl = getServerUrl();

//   // /uploads/rental-documents/file.jpg
//   if (file.startsWith("/")) {
//     return `${serverUrl}${file}`;
//   }

//   // uploads/rental-documents/file.jpg
//   return `${serverUrl}/${file}`;
// };

// // ============================================================
// // IMAGE HELPERS
// // ============================================================

// const normalizeImageUrl = (image) => {
//   return normalizeFileUrl(image);
// };

// // ============================================================
// // GET ALL PRODUCT IMAGES
// // ============================================================

// const getProductImages = (
//   product = {},
//   rentalProduct = {}
// ) => {
//   const images = [];

//   const addImage = (value) => {
//     if (!value) return;

//     // Array
//     if (Array.isArray(value)) {
//       value.forEach(addImage);
//       return;
//     }

//     // Object
//     if (typeof value === "object") {
//       const objectImage =
//         value?.url ||
//         value?.imageUrl ||
//         value?.fileUrl ||
//         value?.path ||
//         value?.src ||
//         value?.secure_url ||
//         "";

//       if (objectImage) {
//         addImage(objectImage);
//       }

//       return;
//     }

//     const normalized =
//       normalizeImageUrl(value);

//     if (
//       normalized &&
//       !images.includes(normalized)
//     ) {
//       images.push(normalized);
//     }
//   };

//   // ----------------------------------------------------------
//   // PRODUCT PRIMARY IMAGE
//   // ----------------------------------------------------------

//   addImage(product?.primaryImage);
//   addImage(product?.image);
//   addImage(product?.thumbnail);
//   addImage(product?.imageUrl);
//   addImage(product?.mainImage);

//   // ----------------------------------------------------------
//   // PRODUCT IMAGES ARRAY
//   // ----------------------------------------------------------

//   addImage(product?.images);
//   addImage(product?.productImages);
//   addImage(product?.gallery);

//   // ----------------------------------------------------------
//   // RENTAL PRODUCT IMAGES
//   // ----------------------------------------------------------

//   addImage(rentalProduct?.primaryImage);
//   addImage(rentalProduct?.image);
//   addImage(rentalProduct?.thumbnail);
//   addImage(rentalProduct?.imageUrl);
//   addImage(rentalProduct?.mainImage);
//   addImage(rentalProduct?.images);
//   addImage(rentalProduct?.productImages);
//   addImage(rentalProduct?.gallery);

//   return images;
// };

// // ============================================================
// // DOCUMENT LABEL
// // ============================================================

// const getDocumentLabel = (documentType) => {
//   const labels = {
//     PASSPORT_PHOTO:
//       "Passport Size Photograph",

//     PAN_CARD:
//       "PAN Card",

//     AADHAAR_CARD:
//       "Aadhaar Card",

//     HOUSE_RENTAL_AGREEMENT:
//       "House Rental Agreement",

//     COLLEGE_ID:
//       "College ID",

//     OFFICE_ID:
//       "Office ID",

//     GST_REGISTRATION:
//       "GST Registration",

//     AUTHORIZATION_LETTER:
//       "Authorization Letter",
//   };

//   const value = String(
//     documentType || ""
//   ).toUpperCase();

//   return (
//     labels[value] ||
//     value
//       .replaceAll("_", " ")
//       .replace(/\b\w/g, (char) =>
//         char.toUpperCase()
//       ) ||
//     "Document"
//   );
// };

// // ============================================================
// // DOCUMENT FILE TYPE
// // ============================================================

// const getFileExtension = (
//   fileUrl = "",
//   fileName = ""
// ) => {
//   const source =
//     fileName || fileUrl || "";

//   const cleanSource = String(source)
//     .split("?")[0]
//     .split("#")[0];

//   const parts =
//     cleanSource.split(".");

//   if (parts.length < 2) {
//     return "";
//   }

//   return parts[
//     parts.length - 1
//   ].toLowerCase();
// };

// const isPdfDocument = (document) => {
//   const extension =
//     getFileExtension(
//       document?.fileUrl,
//       document?.fileName
//     );

//   const mimeType = String(
//     document?.mimeType ||
//       document?.mimetype ||
//       document?.fileType ||
//       ""
//   ).toLowerCase();

//   return (
//     extension === "pdf" ||
//     mimeType === "application/pdf"
//   );
// };

// const isImageDocument = (document) => {
//   const extension =
//     getFileExtension(
//       document?.fileUrl,
//       document?.fileName
//     );

//   const mimeType = String(
//     document?.mimeType ||
//       document?.mimetype ||
//       document?.fileType ||
//       ""
//   ).toLowerCase();

//   return (
//     mimeType.startsWith("image/") ||
//     [
//       "jpg",
//       "jpeg",
//       "png",
//       "webp",
//       "gif",
//     ].includes(extension)
//   );
// };

// // ============================================================
// // DOCUMENT STATUS CLASS
// // ============================================================

// const getDocumentStatusClass = (
//   status
// ) => {
//   const value = String(
//     status || "PENDING"
//   ).toUpperCase();

//   if (value === "APPROVED") {
//     return "approved";
//   }

//   if (value === "REJECTED") {
//     return "rejected";
//   }

//   return "pending";
// };

// // ============================================================
// // COMPONENT
// // ============================================================

// function WalkInRentalDetails() {
//   const navigate = useNavigate();
//   const { rentalId } = useParams();

//   // ==========================================================
//   // RENTAL STATE
//   // ==========================================================

//   const [rental, setRental] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [actionLoading, setActionLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [actionError, setActionError] =
//     useState("");

//   const [actionSuccess, setActionSuccess] =
//     useState("");

//   // ==========================================================
//   // DOCUMENT STATE
//   // ==========================================================

//   const [documents, setDocuments] =
//     useState([]);

//   const [documentsLoading, setDocumentsLoading] =
//     useState(false);

//   const [documentsError, setDocumentsError] =
//     useState("");

//   const [documentImageErrors, setDocumentImageErrors] =
//     useState({});

//   // ==========================================================
//   // PRODUCT IMAGE STATE
//   // ==========================================================

//   const [selectedImage, setSelectedImage] =
//     useState("");

//   const [imageErrors, setImageErrors] =
//     useState({});

//   // ==========================================================
//   // LOAD RENTAL
//   // ==========================================================

//   const loadRental = useCallback(async () => {
//     if (!rentalId) {
//       setError("Rental ID is missing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       console.log(
//         "========== WALK-IN RENTAL DETAILS =========="
//       );

//       console.log(
//         "Rental ID:",
//         rentalId
//       );

//       const response =
//         await getRentalById(rentalId);

//       console.log(
//         "Rental Details Response:",
//         response
//       );

//       const rentalData =
//         extractRental(response);

//       console.log(
//         "Normalized Rental:",
//         rentalData
//       );

//       if (!rentalData) {
//         throw new Error(
//           "Rental details not found."
//         );
//       }

//       setRental(rentalData);
//     } catch (err) {
//       console.error(
//         "GET WALK-IN RENTAL DETAILS ERROR:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to load rental details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [rentalId]);

//   // ==========================================================
//   // LOAD CUSTOMER DOCUMENTS
//   // ==========================================================

//   const loadDocuments = useCallback(
//     async () => {
//       if (!rentalId) {
//         setDocuments([]);
//         return;
//       }

//       try {
//         setDocumentsLoading(true);
//         setDocumentsError("");

//         console.log(
//           "========== RENTAL DOCUMENTS =========="
//         );

//         console.log(
//           "Loading documents for rental:",
//           rentalId
//         );

//         const response =
//           await getRentalDocuments(
//             rentalId
//           );

//         console.log(
//           "Rental Documents Response:",
//           response
//         );

//         const documentList =
//           extractDocuments(response);

//         console.log(
//           "Normalized Documents:",
//           documentList
//         );

//         setDocuments(
//           Array.isArray(documentList)
//             ? documentList
//             : []
//         );
//       } catch (err) {
//         console.error(
//           "GET RENTAL DOCUMENTS ERROR:",
//           err
//         );

//         setDocumentsError(
//           err?.response?.data?.message ||
//             err?.message ||
//             "Failed to load customer documents."
//         );

//         setDocuments([]);
//       } finally {
//         setDocumentsLoading(false);
//       }
//     },
//     [rentalId]
//   );

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     loadRental();
//   }, [loadRental]);

//   useEffect(() => {
//     loadDocuments();
//   }, [loadDocuments]);

//   // ==========================================================
//   // NORMALIZED DATA
//   // ==========================================================

//   const details = useMemo(() => {
//     if (!rental) return null;

//     const individual =
//       rental?.individualDetails || {};

//     const company =
//       rental?.companyDetails || {};

//     const customerType =
//       String(
//         rental?.customerType ||
//           "INDIVIDUAL"
//       ).toUpperCase();

//     // --------------------------------------------------------
//     // CUSTOMER
//     // --------------------------------------------------------

//     const customer =
//       customerType === "COMPANY"
//         ? {
//             name:
//               company?.companyName ||
//               company?.contactPerson ||
//               "Company Customer",

//             contactPerson:
//               company?.contactPerson ||
//               "",

//             phone:
//               company?.phone ||
//               "",

//             email:
//               company?.email ||
//               "",

//             address:
//               company?.officeAddress ||
//               "",

//             gstNumber:
//               company?.gstNumber ||
//               "",
//           }
//         : {
//             name:
//               individual?.fullName ||
//               rental?.customer?.name ||
//               rental?.customerId?.name ||
//               "Individual Customer",

//             contactPerson: "",

//             phone:
//               individual?.phone ||
//               rental?.customer?.phone ||
//               "",

//             email:
//               individual?.email ||
//               rental?.customer?.email ||
//               "",

//             address:
//               individual?.address ||
//               "",

//             gstNumber: "",
//           };

//     // --------------------------------------------------------
//     // PRODUCT
//     // --------------------------------------------------------

//     const product =
//       rental?.productId || {};

//     const rentalProduct =
//       rental?.rentalProductId || {};

//     // --------------------------------------------------------
//     // RENTAL DURATION TYPE
//     // --------------------------------------------------------

//     const rentalDurationType =
//       String(
//         rental?.rentalDurationType ||
//           rental?.durationType ||
//           (
//             rental?.rentalMonths
//               ? "MONTHS"
//               : "DAYS"
//           )
//       ).toUpperCase();

//     // --------------------------------------------------------
//     // RENTAL DURATION
//     // --------------------------------------------------------

//     const rentalDuration =
//       getNumber(
//         rental?.rentalDuration,
//         rental?.duration,
//         rental?.rentalMonths,
//         rental?.durationMonths,
//         rental?.months,
//         1
//       );

//     // --------------------------------------------------------
//     // MONTHLY RENT
//     // --------------------------------------------------------

//     const monthlyRent =
//       getNumber(
//         rental?.monthlyRent,
//         rental?.pricing?.monthlyRent,
//         rentalProduct?.monthlyRent,
//         rentalProduct?.pricing?.monthlyRent
//       );

//     // --------------------------------------------------------
//     // DAILY RENT
//     // --------------------------------------------------------

//     const dailyRent =
//       getNumber(
//         rental?.dailyRent,
//         rental?.pricing?.dailyRent,
//         rentalProduct?.dailyRent,
//         rentalProduct?.pricing?.dailyRent,
//         monthlyRent / 30
//       );

//     // --------------------------------------------------------
//     // SECURITY DEPOSIT
//     // --------------------------------------------------------

//     const securityDeposit =
//       getNumber(
//         rental?.securityDeposit,
//         rental?.pricing?.securityDeposit,
//         rentalProduct?.securityDeposit,
//         rentalProduct?.pricing?.securityDeposit
//       );

//     // --------------------------------------------------------
//     // GST
//     // --------------------------------------------------------

//     const gstPercentage =
//       getNumber(
//         rental?.gstPercentage,
//         rental?.pricing?.gstPercentage,
//         rentalProduct?.gstPercentage,
//         rentalProduct?.pricing?.gstPercentage
//       );

//     // --------------------------------------------------------
//     // RENT SUBTOTAL
//     // --------------------------------------------------------

//     let rentSubtotal = 0;

//     if (
//       rentalDurationType === "DAYS"
//     ) {
//       rentSubtotal =
//         dailyRent *
//         rentalDuration;
//     } else {
//       rentSubtotal =
//         monthlyRent *
//         rentalDuration;
//     }

//     // --------------------------------------------------------
//     // GST AMOUNT
//     // --------------------------------------------------------

//     const gstAmount =
//       rentSubtotal *
//       (gstPercentage / 100);

//     // --------------------------------------------------------
//     // RENT TOTAL
//     //
//     // IMPORTANT:
//     // Security deposit is NOT included here.
//     // It is shown separately as refundable deposit.
//     // --------------------------------------------------------

//     const totalRent =
//       rentSubtotal +
//       gstAmount;

//     // --------------------------------------------------------
//     // DEPOSIT STATUS
//     // --------------------------------------------------------

//     const depositStatus =
//       String(
//         rental?.depositStatus ||
//           rental?.securityDepositStatus ||
//           ""
//       ).toUpperCase();

//     const depositReceived =
//       rental?.depositReceived === true ||
//       rental?.isDepositReceived === true ||
//       rental?.securityDepositPaid === true ||
//       rental?.securityDepositReceived === true ||
//       depositStatus === "PAID" ||
//       depositStatus === "RECEIVED";

//     // --------------------------------------------------------
//     // DEPOSIT PAYMENT DATE
//     // --------------------------------------------------------

//     const depositReceivedAt =
//       rental?.depositReceivedAt ||
//       rental?.securityDepositPaidAt ||
//       rental?.securityDepositReceivedAt ||
//       rental?.depositPaymentDate ||
//       null;

//     // --------------------------------------------------------
//     // PRODUCT IMAGES
//     // --------------------------------------------------------

//     const images =
//       getProductImages(
//         product,
//         rentalProduct
//       );

//     return {
//       customerType,

//       customer,

//       product,

//       rentalProduct,

//       productName:
//         getName(product) ||
//         getName(rentalProduct) ||
//         "Rental Product",

//       productBrand:
//         product?.brand?.name ||
//         product?.brand ||
//         rentalProduct?.brand?.name ||
//         rentalProduct?.brand ||
//         "",

//       productModel:
//         product?.model ||
//         product?.modelNumber ||
//         rentalProduct?.model ||
//         rentalProduct?.modelNumber ||
//         "",

//       image:
//         images?.[0] || "",

//       images,

//       monthlyRent,

//       dailyRent,

//       securityDeposit,

//       gstPercentage,

//       gstAmount,

//       rentalDuration,

//       rentalDurationType,

//       rentSubtotal,

//       totalRent,

//       startDate:
//         rental?.startDate,

//       expectedEndDate:
//         rental?.expectedEndDate,

//       nextPaymentDate:
//         rental?.nextPaymentDate,

//       lastPaymentDate:
//         rental?.lastPaymentDate,

//       status:
//         rental?.status || "—",

//       rentalSource:
//         rental?.rentalSource ||
//         "WALK_IN",

//       depositReceived,

//       depositReceivedAt,

//       allocatedAt:
//         rental?.allocatedAt,

//       returnedAt:
//         rental?.returnedAt,

//       notes:
//         rental?.notes ||
//         rental?.handoverDescription ||
//         rental?.handoverNotes ||
//         "",

//       createdAt:
//         rental?.createdAt,

//       updatedAt:
//         rental?.updatedAt,
//     };
//   }, [rental]);

//   // ==========================================================
//   // SET FIRST PRODUCT IMAGE
//   // ==========================================================

//   useEffect(() => {
//     if (
//       details?.images?.length &&
//       !selectedImage
//     ) {
//       setSelectedImage(
//         details.images[0]
//       );
//     }
//   }, [
//     details?.images,
//     selectedImage,
//   ]);

//   // ==========================================================
//   // RESET PRODUCT IMAGE WHEN RENTAL CHANGES
//   // ==========================================================

//   useEffect(() => {
//     if (!details?.images?.length) {
//       setSelectedImage("");
//       return;
//     }

//     if (
//       selectedImage &&
//       details.images.includes(
//         selectedImage
//       )
//     ) {
//       return;
//     }

//     setSelectedImage(
//       details.images[0]
//     );
//   }, [
//     rentalId,
//     details?.images,
//     selectedImage,
//   ]);

//   // ==========================================================
//   // IMAGE ERROR HANDLER
//   // ==========================================================

//   const handleImageError = (
//     imageUrl
//   ) => {
//     setImageErrors((previous) => ({
//       ...previous,
//       [imageUrl]: true,
//     }));

//     if (
//       selectedImage === imageUrl &&
//       details?.images?.length
//     ) {
//       const nextImage =
//         details.images.find(
//           (image) =>
//             image !== imageUrl &&
//             !imageErrors[image]
//         );

//       if (nextImage) {
//         setSelectedImage(
//           nextImage
//         );
//       }
//     }
//   };

//   // ==========================================================
//   // DOCUMENT IMAGE ERROR
//   // ==========================================================

//   const handleDocumentImageError = (
//     documentId
//   ) => {
//     setDocumentImageErrors(
//       (previous) => ({
//         ...previous,
//         [documentId]: true,
//       })
//     );
//   };

//   // ==========================================================
//   // ACTION HANDLER
//   // ==========================================================

//   const runAction = async (
//     action,
//     successMessage
//   ) => {
//     if (!rentalId) return;

//     try {
//       setActionLoading(true);
//       setActionError("");
//       setActionSuccess("");

//       console.log(
//         "Rental Action:",
//         action,
//         rentalId
//       );

//       let response;

//       // ------------------------------------------------------
//       // SECURITY DEPOSIT
//       // ------------------------------------------------------

//    if (action === "deposit") {

//     const paymentMethod =
//         window.prompt(
//             "Enter payment method: CASH / UPI / CARD / BANK_TRANSFER"
//         );

//     if (!paymentMethod) {
//         return;
//     }

//     await markRentalDepositReceived(
//         rentalId,
//         {
//             paymentMethod:
//                 paymentMethod.trim().toUpperCase()
//         }
//     );

//     toast.success(
//         "Security deposit received successfully"
//     );

//     // Reload rental
//     await loadRentalDetails();

//     return;
// }

//       // ------------------------------------------------------
//       // ALLOCATE
//       // ------------------------------------------------------

//       if (action === "allocate") {
//         response =
//           await allocateRental(
//             rentalId
//           );
//       }

//       // ------------------------------------------------------
//       // RETURN
//       // ------------------------------------------------------

//       if (action === "return") {
//         response =
//           await markRentalReturned(
//             rentalId
//           );
//       }

//       console.log(
//         "Rental Action Response:",
//         response
//       );

//       setActionSuccess(
//         successMessage ||
//           "Rental updated successfully."
//       );

//       // ------------------------------------------------------
//       // IMPORTANT:
//       // Reload rental after action so the latest
//       // depositReceived/status comes from backend.
//       // ------------------------------------------------------

//       await loadRental();
//     } catch (err) {
//       console.error(
//         "RENTAL ACTION ERROR:",
//         err
//       );

//       setActionError(
//         err?.response?.data?.message ||
//           err?.data?.message ||
//           err?.message ||
//           "Unable to update rental."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ==========================================================
//   // BUTTON ACTIONS
//   // ==========================================================

//   const handleDeposit = () => {
//     if (
//       !window.confirm(
//         "Mark security deposit as received?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "deposit",
//       "Security deposit marked as paid / received."
//     );
//   };

//   const handleAllocate = () => {
//     if (
//       !window.confirm(
//         "Allocate this rental?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "allocate",
//       "Rental allocated successfully."
//     );
//   };

//   const handleReturn = () => {
//     if (
//       !window.confirm(
//         "Mark this rental as returned?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "return",
//       "Rental marked as returned."
//     );
//   };

//   // ==========================================================
//   // LOADING
//   // ==========================================================

//   if (loading) {
//     return (
//       <div className="wir-details-page">
//         <div className="wir-details-loading">
//           <Loader2
//             size={40}
//             className="wir-spin"
//           />

//           <h3>
//             Loading rental details...
//           </h3>

//           <p>
//             Please wait while we fetch the
//             rental information.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================================
//   // ERROR
//   // ==========================================================

//   if (
//     error ||
//     !rental ||
//     !details
//   ) {
//     return (
//       <div className="wir-details-page">
//         <div className="wir-details-error">
//           <div className="wir-error-icon">
//             <AlertCircle size={34} />
//           </div>

//           <h2>
//             Unable to load rental
//           </h2>

//           <p>
//             {error ||
//               "Rental details were not found."}
//           </p>

//           <div className="wir-error-actions">
//             <button
//               className="wir-btn wir-btn-secondary"
//               onClick={() =>
//                 navigate(-1)
//               }
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>

//             <button
//               className="wir-btn wir-btn-primary"
//               onClick={loadRental}
//             >
//               <RefreshCw size={18} />
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <div className="wir-details-page">

//       {/* ======================================================
//           HEADER
//       ====================================================== */}

//       <div className="wir-details-header">

//         <div className="wir-header-left">

//           <button
//             className="wir-back-btn"
//             onClick={() =>
//               navigate(-1)
//             }
//             title="Go Back"
//           >
//             <ArrowLeft size={20} />
//           </button>

//           <div>

//             <div className="wir-breadcrumb">
//               Receptionist
//               <span>/</span>
//               Rental
//               <span>/</span>
//               Rental Details
//             </div>

//             <h1>
//               Walk-In Rental Details
//             </h1>

//             <p>
//               Rental ID:{" "}
//               <strong>
//                 {getId(rental)}
//               </strong>
//             </p>

//           </div>

//         </div>

//         <div className="wir-header-actions">

//           <button
//             className="wir-btn wir-btn-secondary"
//             onClick={() => {
//               loadRental();
//               loadDocuments();
//             }}
//             disabled={
//               actionLoading ||
//               documentsLoading
//             }
//           >
//             <RefreshCw
//               size={17}
//               className={
//                 documentsLoading
//                   ? "wir-spin"
//                   : ""
//               }
//             />

//             Refresh
//           </button>

//           <button
//             className="wir-btn wir-btn-secondary"
//             onClick={() =>
//               navigate(
//                 "/receptionist-dashboard/rental/new-orders"
//               )
//             }
//           >
//             <FileText size={17} />
//             All Rentals
//           </button>

//         </div>

//       </div>

//       {/* ======================================================
//           ALERTS
//       ====================================================== */}

//       {actionSuccess && (
//         <div className="wir-alert wir-alert-success">
//           <CheckCircle2 size={20} />

//           <span>
//             {actionSuccess}
//           </span>
//         </div>
//       )}

//       {actionError && (
//         <div className="wir-alert wir-alert-danger">
//           <AlertCircle size={20} />

//           <span>
//             {actionError}
//           </span>
//         </div>
//       )}

//       {/* ======================================================
//           STATUS BAR
//       ====================================================== */}

//       <div className="wir-status-card">

//         <div className="wir-status-main">

//           <div className="wir-status-icon">
//             <Package size={24} />
//           </div>

//           <div>

//             <span className="wir-label">
//               Rental Status
//             </span>

//             <div className="wir-status-row">

//               <span
//                 className={`wir-status-badge ${getStatusClass(
//                   details.status
//                 )}`}
//               >
//                 {String(
//                   details.status ||
//                     "UNKNOWN"
//                 ).replaceAll(
//                   "_",
//                   " "
//                 )}
//               </span>

//               <span className="wir-source-badge">
//                 WALK-IN
//               </span>

//             </div>

//           </div>

//         </div>

//         <div className="wir-status-meta">

//           <div>
//             <span className="wir-label">
//               Created
//             </span>

//             <strong>
//               {formatDateTime(
//                 details.createdAt
//               )}
//             </strong>
//           </div>

//           <div>
//             <span className="wir-label">
//               Rental Period
//             </span>

//             <strong>
//               {details.rentalDuration}{" "}
//               {details.rentalDurationType ===
//               "DAYS"
//                 ? details.rentalDuration === 1
//                   ? "Day"
//                   : "Days"
//                 : details.rentalDuration === 1
//                 ? "Month"
//                 : "Months"}
//             </strong>
//           </div>

//           <div>
//             <span className="wir-label">
//               Security Deposit
//             </span>

//             <strong
//               className={
//                 details.depositReceived
//                   ? "wir-deposit-paid"
//                   : "wir-deposit-pending"
//               }
//             >
//               {details.depositReceived
//                 ? "Paid / Received"
//                 : "Pending"}
//             </strong>
//           </div>

//         </div>

//       </div>

//       {/* ======================================================
//           ACTION BUTTONS
//       ====================================================== */}

//       <div className="wir-action-card">

//         <div>

//           <h3>
//             Rental Actions
//           </h3>

//           <p>
//             Manage deposit, allocation and
//             return status from here.
//           </p>

//         </div>

//         <div className="wir-action-buttons">

//           {/* ==================================================
//               SECURITY DEPOSIT BUTTON
//           ================================================== */}

//           {!details.depositReceived &&
//             String(
//               details.status
//             ).toUpperCase() !==
//               "RETURNED" &&
//             String(
//               details.status
//             ).toUpperCase() !==
//               "COMPLETED" && (

//               <button
//                 className="wir-btn wir-btn-warning"
//                 onClick={handleDeposit}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? (
//                   <Loader2
//                     size={17}
//                     className="wir-spin"
//                   />
//                 ) : (
//                   <ShieldCheck size={17} />
//                 )}

//                 Mark Security Deposit Paid
//               </button>
//             )}

//           {/* ==================================================
//               ALLOCATE
//           ================================================== */}

//           {!details.allocatedAt &&
//             String(
//               details.status
//             ).toUpperCase() !==
//               "RETURNED" &&
//             String(
//               details.status
//             ).toUpperCase() !==
//               "COMPLETED" && (

//               <button
//                 className="wir-btn wir-btn-primary"
//                 onClick={handleAllocate}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? (
//                   <Loader2
//                     size={17}
//                     className="wir-spin"
//                   />
//                 ) : (
//                   <CheckCircle2 size={17} />
//                 )}

//                 Allocate Rental
//               </button>
//             )}

//           {/* ==================================================
//               RETURN
//           ================================================== */}

//           {String(
//             details.status
//           ).toUpperCase() ===
//             "ACTIVE" && (

//             <button
//               className="wir-btn wir-btn-danger"
//               onClick={handleReturn}
//               disabled={actionLoading}
//             >
//               {actionLoading ? (
//                 <Loader2
//                   size={17}
//                   className="wir-spin"
//                 />
//               ) : (
//                 <RefreshCw size={17} />
//               )}

//               Mark Returned
//             </button>
//           )}

//         </div>

//       </div>

//       {/* ======================================================
//           MAIN GRID
//       ====================================================== */}

//       <div className="wir-details-grid">

//         {/* ====================================================
//             CUSTOMER
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">

//               {details.customerType ===
//               "COMPANY" ? (
//                 <Building2 size={20} />
//               ) : (
//                 <User size={20} />
//               )}

//             </div>

//             <div>

//               <h2>
//                 Customer Information
//               </h2>

//               <p>
//                 {details.customerType ===
//                 "COMPANY"
//                   ? "Company customer"
//                   : "Individual customer"}
//               </p>

//             </div>

//           </div>

//           <div className="wir-info-list">

//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 {details.customerType ===
//                 "COMPANY" ? (
//                   <Building2 size={18} />
//                 ) : (
//                   <User size={18} />
//                 )}
//               </span>

//               <div>

//                 <span>
//                   {details.customerType ===
//                   "COMPANY"
//                     ? "Company Name"
//                     : "Full Name"}
//                 </span>

//                 <strong>
//                   {details.customer.name ||
//                     "—"}
//                 </strong>

//               </div>

//             </div>

//             {details.customer
//               .contactPerson && (

//               <div className="wir-info-item">

//                 <span className="wir-info-icon">
//                   <User size={18} />
//                 </span>

//                 <div>

//                   <span>
//                     Contact Person
//                   </span>

//                   <strong>
//                     {
//                       details.customer
//                         .contactPerson
//                     }
//                   </strong>

//                 </div>

//               </div>
//             )}

//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <Phone size={18} />
//               </span>

//               <div>

//                 <span>
//                   Phone
//                 </span>

//                 <strong>
//                   {details.customer.phone ||
//                     "—"}
//                 </strong>

//               </div>

//             </div>

//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <Mail size={18} />
//               </span>

//               <div>

//                 <span>
//                   Email
//                 </span>

//                 <strong>
//                   {details.customer.email ||
//                     "—"}
//                 </strong>

//               </div>

//             </div>

//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <MapPin size={18} />
//               </span>

//               <div>

//                 <span>
//                   Address
//                 </span>

//                 <strong>
//                   {details.customer.address ||
//                     "—"}
//                 </strong>

//               </div>

//             </div>

//             {details.customer
//               .gstNumber && (

//               <div className="wir-info-item">

//                 <span className="wir-info-icon">
//                   <FileText size={18} />
//                 </span>

//                 <div>

//                   <span>
//                     GST Number
//                   </span>

//                   <strong>
//                     {
//                       details.customer
//                         .gstNumber
//                     }
//                   </strong>

//                 </div>

//               </div>
//             )}

//           </div>

//         </section>

//         {/* ====================================================
//             PRODUCT
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <Package size={20} />
//             </div>

//             <div>

//               <h2>
//                 Product Information
//               </h2>

//               <p>
//                 Rented product details
//               </p>

//             </div>

//           </div>

//           {/* ==================================================
//               PRODUCT IMAGE GALLERY
//           ================================================== */}

//           <div className="wir-product-gallery">

//             <div className="wir-product-main-image">

//               {selectedImage &&
//               !imageErrors[
//                 selectedImage
//               ] ? (

//                 <img
//                   src={selectedImage}
//                   alt={
//                     details.productName
//                   }
//                   className="wir-product-image"
//                   onError={() =>
//                     handleImageError(
//                       selectedImage
//                     )
//                   }
//                 />

//               ) : (

//                 <div className="wir-product-placeholder">

//                   <Package size={38} />

//                   <span>
//                     Product image
//                     unavailable
//                   </span>

//                 </div>
//               )}

//             </div>

//             {details.images?.length > 0 && (

//               <div className="wir-product-thumbnails">

//                 {details.images.map(
//                   (image, index) => {

//                     const broken =
//                       imageErrors[
//                         image
//                       ];

//                     if (broken) {
//                       return null;
//                     }

//                     return (

//                       <button
//                         type="button"
//                         key={`${image}-${index}`}
//                         className={`wir-product-thumbnail ${
//                           selectedImage ===
//                           image
//                             ? "active"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           setSelectedImage(
//                             image
//                           )
//                         }
//                         title={`View image ${
//                           index + 1
//                         }`}
//                       >

//                         <img
//                           src={image}
//                           alt={`${details.productName} ${
//                             index + 1
//                           }`}
//                           onError={() =>
//                             handleImageError(
//                               image
//                             )
//                           }
//                         />

//                       </button>
//                     );
//                   }
//                 )}

//               </div>
//             )}

//           </div>

//           {/* ==================================================
//               PRODUCT DETAILS
//           ================================================== */}

//           <div className="wir-product">

//             <div className="wir-product-info">

//               <h3>
//                 {details.productName}
//               </h3>

//               {details.productBrand && (
//                 <p>
//                   Brand:{" "}
//                   <strong>
//                     {
//                       details.productBrand
//                     }
//                   </strong>
//                 </p>
//               )}

//               {details.productModel && (
//                 <p>
//                   Model:{" "}
//                   <strong>
//                     {
//                       details.productModel
//                     }
//                   </strong>
//                 </p>
//               )}

//               {getId(
//                 details.rentalProduct
//               ) && (

//                 <p className="wir-small-id">
//                   Rental Product ID:{" "}
//                   {getId(
//                     details.rentalProduct
//                   )}
//                 </p>
//               )}

//               {getId(
//                 details.product
//               ) && (

//                 <p className="wir-small-id">
//                   Product ID:{" "}
//                   {getId(
//                     details.product
//                   )}
//                 </p>
//               )}

//             </div>

//           </div>

//         </section>

//         {/* ====================================================
//             RENTAL PERIOD
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <CalendarDays size={20} />
//             </div>

//             <div>

//               <h2>
//                 Rental Period
//               </h2>

//               <p>
//                 Start and expected return
//               </p>

//             </div>

//           </div>

//           <div className="wir-date-grid">

//             <div className="wir-date-box">

//               <span>
//                 <CalendarDays size={17} />
//                 Start Date
//               </span>

//               <strong>
//                 {formatDate(
//                   details.startDate
//                 )}
//               </strong>

//             </div>

//             <div className="wir-date-box">

//               <span>
//                 <Clock3 size={17} />
//                 Expected End Date
//               </span>

//               <strong>
//                 {formatDate(
//                   details.expectedEndDate
//                 )}
//               </strong>

//             </div>

//             <div className="wir-date-box">

//               <span>
//                 <IndianRupee size={17} />
//                 Next Payment
//               </span>

//               <strong>
//                 {formatDate(
//                   details.nextPaymentDate
//                 )}
//               </strong>

//             </div>

//             <div className="wir-date-box">

//               <span>
//                 <RefreshCw size={17} />
//                 Returned At
//               </span>

//               <strong>
//                 {formatDateTime(
//                   details.returnedAt
//                 )}
//               </strong>

//             </div>

//           </div>

//         </section>

//         {/* ====================================================
//             PRICING
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <IndianRupee size={20} />
//             </div>

//             <div>

//               <h2>
//                 Rental Pricing
//               </h2>

//               <p>
//                 Complete rental calculation
//               </p>

//             </div>

//           </div>

//           <div className="wir-pricing">

//             {/* MONTHLY RENT */}

//             <div className="wir-price-row">

//               <span>
//                 Monthly Rent
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.monthlyRent
//                 )}
//               </strong>

//             </div>

//             {/* DAILY RENT */}

//             {details.rentalDurationType ===
//               "DAYS" && (

//               <div className="wir-price-row">

//                 <span>
//                   Daily Rent
//                 </span>

//                 <strong>
//                   {formatMoney(
//                     details.dailyRent
//                   )}
//                 </strong>

//               </div>
//             )}

//             {/* RENTAL DURATION */}

//             <div className="wir-price-row">

//               <span>
//                 Rental Duration
//               </span>

//               <strong>
//                 {details.rentalDuration}{" "}
//                 {details.rentalDurationType ===
//                 "DAYS"
//                   ? details.rentalDuration === 1
//                     ? "Day"
//                     : "Days"
//                   : details.rentalDuration === 1
//                   ? "Month"
//                   : "Months"}
//               </strong>

//             </div>

//             {/* RENT SUBTOTAL */}

//             <div className="wir-price-row">

//               <span>
//                 Rent Subtotal
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.rentSubtotal
//                 )}
//               </strong>

//             </div>

//             {/* GST */}

//             <div className="wir-price-row">

//               <span>
//                 GST (
//                 {details.gstPercentage}
//                 %)
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.gstAmount
//                 )}
//               </strong>

//             </div>

//             {/* RENT TOTAL */}

//             <div className="wir-price-total">

//               <span>
//                 Total Rental Amount
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.totalRent
//                 )}
//               </strong>

//             </div>

//             {/* SECURITY DEPOSIT */}

//             <div className="wir-price-row">

//               <span>
//                 Security Deposit
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.securityDeposit
//                 )}
//               </strong>

//             </div>

//             {/* DEPOSIT STATUS */}

//             <div className="wir-price-row">

//               <span>
//                 Security Deposit Status
//               </span>

//               <strong
//                 className={
//                   details.depositReceived
//                     ? "wir-deposit-paid"
//                     : "wir-deposit-pending"
//                 }
//               >
//                 {details.depositReceived
//                   ? "PAID / RECEIVED"
//                   : "PENDING"}
//               </strong>

//             </div>

//             {/* DEPOSIT RECEIVED DATE */}

//             {details.depositReceived &&
//               details.depositReceivedAt && (

//                 <div className="wir-price-row">

//                   <span>
//                     Deposit Received At
//                   </span>

//                   <strong>
//                     {formatDateTime(
//                       details.depositReceivedAt
//                     )}
//                   </strong>

//                 </div>
//               )}

//             {/* GRAND TOTAL */}

//             <div className="wir-price-total">

//               <span>
//                 Rent + GST
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.totalRent
//                 )}
//               </strong>

//             </div>

//             <div className="wir-price-row">

//               <span>
//                 Refundable Security Deposit
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.securityDeposit
//                 )}
//               </strong>

//             </div>

//             <div className="wir-price-total">

//               <span>
//                 Total Collected / Payable
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.totalRent +
//                     details.securityDeposit
//                 )}
//               </strong>

//             </div>

//           </div>

//         </section>

//       </div>

//       {/* ======================================================
//           CUSTOMER DOCUMENTS
//       ====================================================== */}

//       <section className="wir-card wir-documents-card">

//         <div className="wir-card-header">

//           <div className="wir-card-title-icon">
//             <FileCheck2 size={20} />
//           </div>

//           <div>

//             <h2>
//               Customer Documents
//             </h2>

//             <p>
//               Documents uploaded during rental
//               creation
//             </p>

//           </div>

//           <div className="wir-documents-count">

//             {documents.length}{" "}

//             {documents.length === 1
//               ? "Document"
//               : "Documents"}

//           </div>

//         </div>

//         {/* DOCUMENT LOADING */}

//         {documentsLoading && (

//           <div className="wir-documents-loading">

//             <Loader2
//               size={26}
//               className="wir-spin"
//             />

//             <span>
//               Loading customer documents...
//             </span>

//           </div>
//         )}

//         {/* DOCUMENT ERROR */}

//         {!documentsLoading &&
//           documentsError && (

//             <div className="wir-documents-error">

//               <AlertCircle size={20} />

//               <div>

//                 <strong>
//                   Unable to load documents
//                 </strong>

//                 <p>
//                   {documentsError}
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 className="wir-btn wir-btn-secondary"
//                 onClick={loadDocuments}
//               >
//                 <RefreshCw size={16} />
//                 Retry
//               </button>

//             </div>
//           )}

//         {/* NO DOCUMENTS */}

//         {!documentsLoading &&
//           !documentsError &&
//           documents.length === 0 && (

//             <div className="wir-documents-empty">

//               <div className="wir-documents-empty-icon">
//                 <FileText size={34} />
//               </div>

//               <h3>
//                 No documents uploaded
//               </h3>

//               <p>
//                 Customer documents uploaded during
//                 rental creation will appear here.
//               </p>

//             </div>
//           )}

//         {/* DOCUMENT GRID */}

//         {!documentsLoading &&
//           !documentsError &&
//           documents.length > 0 && (

//             <div className="wir-documents-grid">

//               {documents.map(
//                 (document, index) => {

//                   const documentId =
//                     getId(document) ||
//                     `${document?.documentType}-${index}`;

//                   const documentUrl =
//                     normalizeFileUrl(
//                       document?.fileUrl ||
//                         document?.url ||
//                         document?.path
//                     );

//                   const pdf =
//                     isPdfDocument(
//                       document
//                     );

//                   const image =
//                     isImageDocument(
//                       document
//                     );

//                   const imageBroken =
//                     documentImageErrors[
//                       documentId
//                     ];

//                   const status =
//                     String(
//                       document?.verificationStatus ||
//                         "PENDING"
//                     ).toUpperCase();

//                   return (

//                     <article
//                       className="wir-document-card"
//                       key={documentId}
//                     >

//                       {/* DOCUMENT PREVIEW */}

//                       <div className="wir-document-preview">

//                         {image &&
//                         documentUrl &&
//                         !imageBroken ? (

//                           <img
//                             src={documentUrl}
//                             alt={getDocumentLabel(
//                               document?.documentType
//                             )}
//                             className="wir-document-image"
//                             onError={() =>
//                               handleDocumentImageError(
//                                 documentId
//                               )
//                             }
//                           />

//                         ) : pdf &&
//                           documentUrl ? (

//                           <iframe
//                             src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
//                             title={getDocumentLabel(
//                               document?.documentType
//                             )}
//                             className="wir-document-pdf"
//                           />

//                         ) : (

//                           <div className="wir-document-file-placeholder">

//                             <FileText
//                               size={48}
//                             />

//                             <span>
//                               {pdf
//                                 ? "PDF Document"
//                                 : "Document File"}
//                             </span>

//                           </div>
//                         )}

//                         {/* FILE TYPE BADGE */}

//                         <span className="wir-document-file-type">

//                           {pdf
//                             ? "PDF"
//                             : image
//                             ? "IMAGE"
//                             : "FILE"}

//                         </span>

//                       </div>

//                       {/* DOCUMENT INFORMATION */}

//                       <div className="wir-document-content">

//                         <div className="wir-document-title-row">

//                           <div>

//                             <h3>
//                               {getDocumentLabel(
//                                 document?.documentType
//                               )}
//                             </h3>

//                             <p>
//                               {document?.fileName ||
//                                 "Uploaded document"}
//                             </p>

//                           </div>

//                           <span
//                             className={`wir-document-status ${getDocumentStatusClass(
//                               status
//                             )}`}
//                           >

//                             {status ===
//                             "APPROVED" ? (

//                               <CheckCircle2
//                                 size={14}
//                               />

//                             ) : status ===
//                               "REJECTED" ? (

//                               <XCircle
//                                 size={14}
//                               />

//                             ) : (

//                               <Clock3
//                                 size={14}
//                               />
//                             )}

//                             {status}

//                           </span>

//                         </div>

//                         {/* UPLOADED DATE */}

//                         {document?.createdAt && (

//                           <div className="wir-document-meta">

//                             <span>
//                               Uploaded
//                             </span>

//                             <strong>
//                               {formatDateTime(
//                                 document.createdAt
//                               )}
//                             </strong>

//                           </div>
//                         )}

//                         {/* VERIFIED DATE */}

//                         {document?.verifiedAt && (

//                           <div className="wir-document-meta">

//                             <span>
//                               Verified
//                             </span>

//                             <strong>
//                               {formatDateTime(
//                                 document.verifiedAt
//                               )}
//                             </strong>

//                           </div>
//                         )}

//                         {/* REJECTION REASON */}

//                         {status ===
//                           "REJECTED" &&
//                           document?.rejectionReason && (

//                             <div className="wir-document-rejection">

//                               <XCircle
//                                 size={16}
//                               />

//                               <div>

//                                 <strong>
//                                   Rejection Reason
//                                 </strong>

//                                 <p>
//                                   {
//                                     document.rejectionReason
//                                   }
//                                 </p>

//                               </div>

//                             </div>
//                           )}

//                         {/* DOCUMENT ACTIONS */}

//                         <div className="wir-document-actions">

//                           {documentUrl && (
//                             <>
//                               <a
//                                 href={
//                                   documentUrl
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="wir-document-action-btn primary"
//                               >
//                                 <Eye
//                                   size={16}
//                                 />
//                                 View
//                               </a>

//                               <a
//                                 href={
//                                   documentUrl
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 download={
//                                   document?.fileName ||
//                                   true
//                                 }
//                                 className="wir-document-action-btn secondary"
//                               >
//                                 <Download
//                                   size={16}
//                                 />
//                                 Download
//                               </a>

//                               <a
//                                 href={
//                                   documentUrl
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="wir-document-action-btn secondary"
//                               >
//                                 <ExternalLink
//                                   size={16}
//                                 />
//                                 Open
//                               </a>
//                             </>
//                           )}

//                         </div>

//                       </div>

//                     </article>
//                   );
//                 }
//               )}

//             </div>
//           )}

//       </section>

//       {/* ======================================================
//           NOTES
//       ====================================================== */}

//       {details.notes && (

//         <section className="wir-card wir-notes-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <FileText size={20} />
//             </div>

//             <div>

//               <h2>
//                 Handover / Rental Notes
//               </h2>

//               <p>
//                 Notes saved during rental creation
//               </p>

//             </div>

//           </div>

//           <div className="wir-notes">
//             {details.notes}
//           </div>

//         </section>
//       )}

//       {/* ======================================================
//           TIMELINE
//       ====================================================== */}

//       <section className="wir-card">

//         <div className="wir-card-header">

//           <div className="wir-card-title-icon">
//             <Clock3 size={20} />
//           </div>

//           <div>

//             <h2>
//               Rental Timeline
//             </h2>

//             <p>
//               Important rental events
//             </p>

//           </div>

//         </div>

//         <div className="wir-timeline">

//           {/* CREATED */}

//           <div className="wir-timeline-item completed">

//             <div className="wir-timeline-dot">
//               <CheckCircle2 size={16} />
//             </div>

//             <div>

//               <strong>
//                 Rental Created
//               </strong>

//               <span>
//                 {formatDateTime(
//                   details.createdAt
//                 )}
//               </span>

//             </div>

//           </div>

//           {/* DEPOSIT */}

//           <div
//             className={`wir-timeline-item ${
//               details.depositReceived
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <ShieldCheck size={16} />
//             </div>

//             <div>

//               <strong>
//                 Security Deposit
//               </strong>

//               <span>

//                 {details.depositReceived
//                   ? details.depositReceivedAt
//                     ? `Paid / Received on ${formatDateTime(
//                         details.depositReceivedAt
//                       )}`
//                     : "Paid / Received"
//                   : "Security deposit pending"}

//               </span>

//             </div>

//           </div>

//           {/* ALLOCATED */}

//           <div
//             className={`wir-timeline-item ${
//               details.allocatedAt
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <Package size={16} />
//             </div>

//             <div>

//               <strong>
//                 Rental Allocated
//               </strong>

//               <span>

//                 {details.allocatedAt
//                   ? formatDateTime(
//                       details.allocatedAt
//                     )
//                   : "Not allocated yet"}

//               </span>

//             </div>

//           </div>

//           {/* RETURNED */}

//           <div
//             className={`wir-timeline-item ${
//               details.returnedAt
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <RefreshCw size={16} />
//             </div>

//             <div>

//               <strong>
//                 Rental Returned
//               </strong>

//               <span>

//                 {details.returnedAt
//                   ? formatDateTime(
//                       details.returnedAt
//                     )
//                   : "Not returned yet"}

//               </span>

//             </div>

//           </div>

//         </div>

//       </section>

//       {/* ======================================================
//           FOOTER ACTIONS
//       ====================================================== */}

//       <div className="wir-footer-actions">

//         <button
//           className="wir-btn wir-btn-secondary"
//           onClick={() =>
//             navigate(-1)
//           }
//         >
//           <ArrowLeft size={18} />
//           Back to Rentals
//         </button>

//         <button
//           className="wir-btn wir-btn-primary"
//           onClick={() =>
//             navigate(
//               "/receptionist-dashboard/rental/new"
//             )
//           }
//         >
//           <Package size={18} />
//           Create New Walk-In Rental
//         </button>

//       </div>

//     </div>
//   );
// }

// export default WalkInRentalDetails;




import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Package,
  Phone,
  Mail,
  MapPin,
  User,
  Building2,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Download,
  Eye,
  FileCheck2,
  XCircle,
  Pencil,
  Save,
  BadgePercent,
  Receipt,
  Wallet,
  Info,
} from "lucide-react";

import {
  getRentalById,
  getRentalDocuments,
  markRentalDepositReceived,
  allocateRental,
  markRentalReturned,
  updateRentalPricing,
} from "../../services/rentalApi";

import "./WalkInRentalDetails.css";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_GST = 18;

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value._id || value.id || value.$oid || "";
};

const getName = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return (
    value.name ||
    value.title ||
    value.productName ||
    value.label ||
    ""
  );
};

const firstDefined = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "";

const getNumber = (...values) => {
  for (const value of values) {
    if (
      hasValue(value) &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
};

const roundMoney = (value) =>
  Math.round(
    (Number(value || 0) + Number.EPSILON) * 100
  ) / 100;

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  "Something went wrong.";

const normalizeBillingType = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (
    [
      "NON_GST",
      "NONGST",
      "WITHOUT_GST",
      "NO_GST",
      "NON_TAXABLE",
    ].includes(normalized)
  ) {
    return "NON_GST";
  }

  if (
    [
      "GST",
      "WITH_GST",
      "TAXABLE",
    ].includes(normalized)
  ) {
    return "GST";
  }

  return "";
};

const getStatusClass = (status) => {
  const value = String(status || "").toUpperCase();

  if (
    [
      "ACTIVE",
      "ALLOCATED",
      "APPROVED",
      "COMPLETED",
    ].includes(value)
  ) {
    return "success";
  }

  if (
    [
      "PENDING",
      "REQUESTED",
      "DEPOSIT_PENDING",
    ].includes(value)
  ) {
    return "warning";
  }

  if (
    ["REJECTED", "CANCELLED"].includes(value)
  ) {
    return "danger";
  }

  if (
    ["RETURNED", "CLOSED"].includes(value)
  ) {
    return "info";
  }

  return "neutral";
};

const extractRental = (response) => {
  if (!response) return null;

  const data = response.data;

  return (
    data?.data?.rental ||
    data?.rental ||
    data?.data ||
    response.rental ||
    data ||
    response
  );
};

const extractDocuments = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.documents)) {
    return data.documents;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.documents)) {
    return data.data.documents;
  }

  if (Array.isArray(response?.documents)) {
    return response.documents;
  }

  return [];
};

// ============================================================
// FILE HELPERS
// ============================================================

const getServerUrl = () =>
  String(import.meta.env.VITE_API_URL || "")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

const normalizeFileUrl = (file) => {
  if (!file) return "";

  if (typeof file === "object") {
    file =
      file.url ||
      file.fileUrl ||
      file.imageUrl ||
      file.path ||
      file.src ||
      file.secure_url ||
      "";
  }

  const value = String(file || "").trim();

  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const server = getServerUrl();

  return `${server}/${value.replace(/^\/+/, "")}`;
};

const getProductImages = (
  product = {},
  rentalProduct = {}
) => {
  const images = [];

  const addImage = (value) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(addImage);
      return;
    }

    if (typeof value === "object") {
      addImage(
        value.url ||
          value.imageUrl ||
          value.fileUrl ||
          value.path ||
          value.src ||
          value.secure_url
      );

      return;
    }

    const url = normalizeFileUrl(value);

    if (url && !images.includes(url)) {
      images.push(url);
    }
  };

  [
    product?.primaryImage,
    product?.image,
    product?.thumbnail,
    product?.imageUrl,
    product?.mainImage,
    product?.images,
    product?.productImages,
    product?.gallery,
    rentalProduct?.primaryImage,
    rentalProduct?.image,
    rentalProduct?.thumbnail,
    rentalProduct?.imageUrl,
    rentalProduct?.mainImage,
    rentalProduct?.images,
    rentalProduct?.productImages,
    rentalProduct?.gallery,
  ].forEach(addImage);

  return images;
};

// ============================================================
// DOCUMENT HELPERS
// ============================================================

const getDocumentLabel = (documentType) => {
  const labels = {
    PASSPORT_PHOTO: "Passport Size Photograph",
    PAN_CARD: "PAN Card",
    AADHAAR_CARD: "Aadhaar Card",
    HOUSE_RENTAL_AGREEMENT: "House Rental Agreement",
    COLLEGE_ID: "College ID",
    OFFICE_ID: "Office ID",
    GST_REGISTRATION: "GST Registration",
    AUTHORIZATION_LETTER: "Authorization Letter",
  };

  const value = String(documentType || "")
    .toUpperCase();

  return (
    labels[value] ||
    value.replaceAll("_", " ") ||
    "Document"
  );
};

const getFileExtension = (
  fileUrl = "",
  fileName = ""
) => {
  const source = String(fileName || fileUrl)
    .split("?")[0]
    .split("#")[0];

  return source.includes(".")
    ? source.split(".").pop().toLowerCase()
    : "";
};

const isPdfDocument = (document) => {
  const extension = getFileExtension(
    document?.fileUrl,
    document?.fileName
  );

  const mimeType = String(
    document?.mimeType ||
      document?.mimetype ||
      document?.fileType ||
      ""
  ).toLowerCase();

  return (
    extension === "pdf" ||
    mimeType === "application/pdf"
  );
};

const isImageDocument = (document) => {
  const extension = getFileExtension(
    document?.fileUrl,
    document?.fileName
  );

  const mimeType = String(
    document?.mimeType ||
      document?.mimetype ||
      document?.fileType ||
      ""
  ).toLowerCase();

  return (
    mimeType.startsWith("image/") ||
    [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ].includes(extension)
  );
};

const getDocumentStatusClass = (status) => {
  const value = String(
    status || "PENDING"
  ).toUpperCase();

  if (value === "APPROVED") return "approved";

  if (value === "REJECTED") return "rejected";

  return "pending";
};

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="wir-info-item">
      <span className="wir-info-icon">
        <Icon size={18} />
      </span>

      <div>
        <span>{label}</span>

        <strong>
          {value !== undefined &&
          value !== null &&
          value !== ""
            ? value
            : "—"}
        </strong>
      </div>
    </div>
  );
}

// ============================================================
// PRICING ROW
// ============================================================

function PricingRow({
  label,
  value,
  highlight = false,
  className = "",
}) {
  return (
    <div
      className={`${
        highlight
          ? "wir-price-total"
          : "wir-price-row"
      } ${className}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function WalkInRentalDetails() {
  const navigate = useNavigate();

  const { rentalId } = useParams();

  const [rental, setRental] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  const [documents, setDocuments] = useState([]);

  const [
    documentsLoading,
    setDocumentsLoading,
  ] = useState(false);

  const [
    documentsError,
    setDocumentsError,
  ] = useState("");

  const [
    documentImageErrors,
    setDocumentImageErrors,
  ] = useState({});

  const [selectedImage, setSelectedImage] =
    useState("");

  const [imageErrors, setImageErrors] =
    useState({});

  // ==========================================================
  // PRICING EDIT STATE
  // ==========================================================

  const [pricingOpen, setPricingOpen] =
    useState(false);

  const [pricingForm, setPricingForm] =
    useState({
      monthlyRent: "",
      billingType: "GST",
      gstPercentage: DEFAULT_GST,
      negotiationReason: "",
    });

  // ==========================================================
  // DEPOSIT STATE
  // ==========================================================

  const [
    depositPaymentMethod,
    setDepositPaymentMethod,
  ] = useState("");

  const [
    depositModalOpen,
    setDepositModalOpen,
  ] = useState(false);

  // ==========================================================
  // LOAD RENTAL
  // ==========================================================

  const loadRental = useCallback(
    async ({ silent = false } = {}) => {
      if (!rentalId) {
        setError("Rental ID is missing.");
        setLoading(false);
        return;
      }

      try {
        if (!silent) setLoading(true);

        setError("");

        const response =
          await getRentalById(rentalId);

        const rentalData =
          extractRental(response);

        if (
          !rentalData ||
          !getId(rentalData)
        ) {
          throw new Error(
            "Rental details not found."
          );
        }

        setRental(rentalData);

        return rentalData;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [rentalId]
  );

  // ==========================================================
  // LOAD DOCUMENTS
  // ==========================================================

  const loadDocuments = useCallback(
    async () => {
      if (!rentalId) return;

      try {
        setDocumentsLoading(true);
        setDocumentsError("");

        const response =
          await getRentalDocuments(rentalId);

        setDocuments(
          extractDocuments(response)
        );
      } catch (err) {
        setDocumentsError(
          getErrorMessage(err)
        );

        setDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    },
    [rentalId]
  );

  useEffect(() => {
    loadRental().catch(() => {});
    loadDocuments();
  }, [loadRental, loadDocuments]);

  // ==========================================================
  // NORMALIZE RENTAL DATA
  // ==========================================================

  const details = useMemo(() => {
    if (!rental) return null;

    const individual =
      rental.individualDetails || {};

    const company =
      rental.companyDetails || {};

    const customerType = String(
      rental.customerType || "INDIVIDUAL"
    ).toUpperCase();

    const customer =
      customerType === "COMPANY"
        ? {
            name:
              company.companyName ||
              "Company Customer",

            contactPerson:
              company.contactPerson || "",

            phone: company.phone || "",
            email: company.email || "",

            address:
              company.officeAddress || "",

            gstNumber:
              company.gstNumber || "",
          }
        : {
            name:
              individual.fullName ||
              rental.customer?.name ||
              rental.customerId?.name ||
              "Individual Customer",

            contactPerson: "",

            phone:
              individual.phone ||
              rental.customer?.phone ||
              "",

            email:
              individual.email ||
              rental.customer?.email ||
              "",

            address:
              individual.address || "",

            gstNumber: "",
          };

    const product =
      rental.productId &&
      typeof rental.productId === "object"
        ? rental.productId
        : {};

    const rentalProduct =
      rental.rentalProductId &&
      typeof rental.rentalProductId === "object"
        ? rental.rentalProductId
        : {};

    // ========================================================
    // RENTAL DURATION
    // ========================================================

    const rentalDurationType = String(
      rental.rentalDurationType ||
        rental.durationType ||
        "MONTHS"
    ).toUpperCase();

    const isLegacyDays =
      rentalDurationType === "DAYS";

    const rentalDuration = getNumber(
      rental.rentalDuration,
      rental.duration,
      rental.rentalMonths,
      rental.durationMonths,
      rental.months,
      3
    );

    // ========================================================
    // ORIGINAL + NEGOTIATED MONTHLY RENT
    // ========================================================

    const originalMonthlyRent = getNumber(
      rental.originalMonthlyRent,
      rental.pricing?.originalMonthlyRent,
      rentalProduct.originalMonthlyRent,
      rentalProduct.monthlyRent,
      rentalProduct.pricing?.monthlyRent,
      product.monthlyRent,
      rental.monthlyRent
    );

    const negotiatedValue = firstDefined(
      rental.negotiatedMonthlyRent,
      rental.pricing?.negotiatedMonthlyRent
    );

    const savedMonthlyRent = firstDefined(
      rental.monthlyRent,
      rental.pricing?.monthlyRent
    );

    const isNegotiated =
      hasValue(negotiatedValue) ||
      String(
        rental.pricingType || ""
      ).toUpperCase() === "NEGOTIATED";

    const effectiveMonthlyRent = getNumber(
      negotiatedValue,
      savedMonthlyRent,
      originalMonthlyRent
    );

    const negotiatedMonthlyRent =
      isNegotiated
        ? effectiveMonthlyRent
        : null;

    const negotiationReason =
      rental.negotiationReason ||
      rental.pricing?.negotiationReason ||
      "";

    const monthlyDifference = roundMoney(
      originalMonthlyRent -
        effectiveMonthlyRent
    );

    const monthlySavings = Math.max(
      0,
      monthlyDifference
    );

    const totalSavings = roundMoney(
      monthlySavings *
        rentalDuration
    );

    const dailyRent = getNumber(
      rental.dailyRent,
      rental.pricing?.dailyRent,
      effectiveMonthlyRent / 30
    );

    // ========================================================
    // GST / NON-GST
    // ========================================================

    const explicitBillingType =
      normalizeBillingType(
        firstDefined(
          rental.billingType,
          rental.invoiceType,
          rental.taxType,
          rental.pricing?.billingType
        )
      );

    const savedGstRate = getNumber(
      rental.gstPercentage,
      rental.gst,
      rental.pricing?.gstPercentage,
      rentalProduct.gstPercentage,
      rentalProduct.gst,
      DEFAULT_GST
    );

    const billingType =
      explicitBillingType ||
      (savedGstRate > 0
        ? "GST"
        : "NON_GST");

    const isNonGst =
      billingType === "NON_GST";

    const gstPercentage =
      isNonGst
        ? 0
        : savedGstRate;

    // ========================================================
    // RENTAL TOTALS
    // ========================================================

    const calculatedSubtotal = roundMoney(
      isLegacyDays
        ? dailyRent * rentalDuration
        : effectiveMonthlyRent *
            rentalDuration
    );

    const savedSubtotal = firstDefined(
      rental.rentSubtotal,
      rental.pricing?.rentSubtotal
    );

    const rentSubtotal = getNumber(
      savedSubtotal,
      calculatedSubtotal
    );

    const calculatedGst = roundMoney(
      (rentSubtotal *
        gstPercentage) /
        100
    );

    const savedGstAmount = getNumber(
      rental.rentGstAmount,
      rental.gstAmount,
      rental.pricing?.gstAmount,
      calculatedGst
    );

    const gstAmount =
      isNonGst
        ? 0
        : savedGstAmount;

    const calculatedTotalRent = roundMoney(
      rentSubtotal + gstAmount
    );

    const savedTotalRent = firstDefined(
      rental.rentTotalAmount,
      rental.totalRent,
      rental.totalRentalAmount,
      rental.pricing?.totalRent
    );

    // For NON_GST, never display a GST-inclusive total.
    const totalRent =
      isNonGst
        ? rentSubtotal
        : getNumber(
            savedTotalRent,
            calculatedTotalRent
          );

    // Detect inconsistent backend records.
    const taxMismatch =
      isNonGst &&
      (
        getNumber(
          rental.rentGstAmount,
          rental.gstAmount,
          rental.pricing?.gstAmount
        ) > 0.009 ||
        (
          hasValue(savedTotalRent) &&
          getNumber(savedTotalRent) >
            rentSubtotal + 0.009
        )
      );

    // ========================================================
    // SECURITY DEPOSIT
    // ========================================================

    const securityDeposit = getNumber(
      rental.securityDeposit,
      rental.pricing?.securityDeposit,
      rentalProduct.securityDeposit
    );

    const depositAmountPaid = getNumber(
      rental.depositAmountPaid,
      rental.securityDepositAmountPaid,
      rental.depositPaidAmount,
      rental.depositPayment?.amount
    );

    const storedDepositStatus = String(
      rental.depositStatus ||
        rental.securityDepositStatus ||
        ""
    ).toUpperCase();

    const depositReceivedFlag =
      rental.depositReceived === true ||
      rental.isDepositReceived === true ||
      rental.securityDepositPaid === true ||
      rental.securityDepositReceived === true ||
      [
        "PAID",
        "RECEIVED",
      ].includes(storedDepositStatus);

    const depositReceived =
      depositReceivedFlag ||
      (
        securityDeposit > 0 &&
        depositAmountPaid >=
          securityDeposit
      );

    const depositStatus =
      securityDeposit <= 0 ||
      depositReceived
        ? "PAID"
        : depositAmountPaid > 0
        ? "PARTIAL"
        : "PENDING";

    const depositBalance =
      depositStatus === "PAID"
        ? 0
        : Math.max(
            0,
            roundMoney(
              securityDeposit -
                depositAmountPaid
            )
          );

    const images = getProductImages(
      product,
      rentalProduct
    );

    // ========================================================
    // RETURN NORMALIZED DETAILS
    // ========================================================

    return {
      customerType,
      customer,

      product,
      rentalProduct,

      productName:
        getName(product) ||
        getName(rentalProduct) ||
        "Rental Product",

      productBrand:
        getName(product.brand) ||
        getName(rentalProduct.brand),

      productModel:
        product.model ||
        product.modelNumber ||
        rentalProduct.model ||
        rentalProduct.modelNumber ||
        "",

      images,

      originalMonthlyRent,
      negotiatedMonthlyRent,
      effectiveMonthlyRent,
      isNegotiated,
      negotiationReason,
      monthlyDifference,
      monthlySavings,
      totalSavings,

      dailyRent,

      billingType,
      isNonGst,
      gstPercentage,
      gstAmount,

      rentalDuration,
      rentalDurationType,
      isLegacyDays,

      rentSubtotal,
      totalRent,
      taxMismatch,

      securityDeposit,
      depositAmountPaid,
      depositBalance,
      depositStatus,
      depositReceived,

      depositReceivedAt:
        rental.depositReceivedAt ||
        rental.securityDepositPaidAt ||
        rental.securityDepositReceivedAt ||
        rental.depositPaymentDate,

      startDate: rental.startDate,
      expectedEndDate:
        rental.expectedEndDate,

      nextPaymentDate:
        rental.nextPaymentDate,

      lastPaymentDate:
        rental.lastPaymentDate,

      status:
        rental.status || "—",

      rentalSource:
        rental.rentalSource ||
        "WALK_IN",

      allocatedAt:
        rental.allocatedAt,

      returnedAt:
        rental.returnedAt,

      notes:
        rental.notes ||
        rental.handoverDescription ||
        rental.handoverNotes ||
        "",

      createdAt:
        rental.createdAt,

      updatedAt:
        rental.updatedAt,
    };
  }, [rental]);

  // ==========================================================
  // PRODUCT IMAGE SELECTION
  // ==========================================================

  useEffect(() => {
    const images =
      details?.images || [];

    setSelectedImage((current) =>
      images.includes(current)
        ? current
        : images[0] || ""
    );
  }, [details?.images]);

  const handleImageError = (url) => {
    setImageErrors((previous) => ({
      ...previous,
      [url]: true,
    }));

    if (selectedImage === url) {
      const nextImage =
        details?.images?.find(
          (image) =>
            image !== url &&
            !imageErrors[image]
        );

      setSelectedImage(
        nextImage || ""
      );
    }
  };

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const runAction = async (
    action,
    payload = {}
  ) => {
    if (
      !rentalId ||
      actionLoading
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess("");

      if (action === "deposit") {
        await markRentalDepositReceived(
          rentalId,
          payload
        );

        setActionSuccess(
          "Security deposit updated successfully."
        );

        setDepositModalOpen(false);
        setDepositPaymentMethod("");
      }

      if (action === "allocate") {
        await allocateRental(
          rentalId
        );

        setActionSuccess(
          "Rental allocated successfully."
        );
      }

      if (action === "return") {
        await markRentalReturned(
          rentalId
        );

        setActionSuccess(
          "Rental marked as returned. Complete settlement to reconcile inventory."
        );
      }

      if (action === "pricing") {
        await updateRentalPricing(
          rentalId,
          payload
        );

        setActionSuccess(
          "Rental pricing update submitted successfully."
        );

        setPricingOpen(false);
      }

      const refreshed =
        await loadRental({
          silent: true,
        });

      if (
        action === "pricing" &&
        refreshed
      ) {
        const expectedBilling =
          payload.billingType;

        const actualBilling =
          normalizeBillingType(
            firstDefined(
              refreshed.billingType,
              refreshed.invoiceType,
              refreshed.taxType,
              refreshed.pricing?.billingType
            )
          );

        if (
          actualBilling &&
          actualBilling !==
            expectedBilling
        ) {
          setActionError(
            "Backend did not save the selected billing type. Please check the rental pricing update service."
          );

          setActionSuccess("");
        }
      }
    } catch (err) {
      setActionError(
        getErrorMessage(err)
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // PRICING EDIT
  // ==========================================================

  const handlePricingOpen = () => {
    if (!details) return;

    setPricingForm({
      monthlyRent: String(
        details.effectiveMonthlyRent
      ),

      billingType:
        details.billingType,

      gstPercentage:
        details.isNonGst
          ? DEFAULT_GST
          : details.gstPercentage,

      negotiationReason:
        details.negotiationReason || "",
    });

    setActionError("");
    setPricingOpen(true);
  };

  const handlePricingSave = () => {
    const monthlyRent = Number(
      pricingForm.monthlyRent
    );

    if (
      !Number.isFinite(monthlyRent) ||
      monthlyRent < 0 ||
      String(
        pricingForm.monthlyRent
      ).trim() === ""
    ) {
      setActionError(
        "Enter a valid monthly rental amount."
      );
      return;
    }

    if (
      ![
        "GST",
        "NON_GST",
      ].includes(
        pricingForm.billingType
      )
    ) {
      setActionError(
        "Select a valid billing type."
      );
      return;
    }

    const gstPercentage =
      pricingForm.billingType ===
      "NON_GST"
        ? 0
        : Number(
            pricingForm.gstPercentage
          );

    if (
      !Number.isFinite(
        gstPercentage
      ) ||
      gstPercentage < 0 ||
      gstPercentage > 100
    ) {
      setActionError(
        "Enter a valid GST percentage."
      );
      return;
    }

    const reason =
      pricingForm.negotiationReason.trim();

    if (!reason) {
      setActionError(
        "Negotiation reason is required."
      );
      return;
    }

    const duration =
      details.rentalDuration;

    const subtotal = roundMoney(
      details.isLegacyDays
        ? monthlyRent / 30 *
            duration
        : monthlyRent *
            duration
    );

    const gstAmount =
      pricingForm.billingType ===
      "NON_GST"
        ? 0
        : roundMoney(
            subtotal *
              gstPercentage /
              100
          );

    const totalRent = roundMoney(
      subtotal + gstAmount
    );

    runAction("pricing", {
      originalMonthlyRent:
        details.originalMonthlyRent,

      negotiatedMonthlyRent:
        monthlyRent,

      monthlyRent,

      pricingType:
        "NEGOTIATED",

      negotiationReason:
        reason,

      billingType:
        pricingForm.billingType,

      gstPercentage,

      rentSubtotal:
        subtotal,

      rentGstAmount:
        gstAmount,

      gstAmount,

      rentTotalAmount:
        totalRent,
    });
  };

  // ==========================================================
  // OTHER ACTIONS
  // ==========================================================

  const handleAllocate = () => {
    if (
      window.confirm(
        "Allocate this rental?"
      )
    ) {
      runAction("allocate");
    }
  };

  const handleReturn = () => {
    if (
      window.confirm(
        "Mark this rental as returned? Inventory will be reconciled during settlement."
      )
    ) {
      runAction("return");
    }
  };

  const status = String(
    details?.status || ""
  ).toUpperCase();

  const isClosed = [
    "RETURNED",
    "COMPLETED",
    "CLOSED",
    "CANCELLED",
  ].includes(status);

  // ==========================================================
  // LOADING / ERROR
  // ==========================================================

  if (loading && !rental) {
    return (
      <div className="wir-details-page">
        <div className="wir-details-loading">
          <Loader2
            size={40}
            className="wir-spin"
          />

          <h3>
            Loading rental details...
          </h3>

          <p>
            Please wait while we fetch
            the rental information.
          </p>
        </div>
      </div>
    );
  }

  if (
    error ||
    !rental ||
    !details
  ) {
    return (
      <div className="wir-details-page">
        <div className="wir-details-error">
          <AlertCircle size={34} />

          <h2>
            Unable to load rental
          </h2>

          <p>
            {error ||
              "Rental details were not found."}
          </p>

          <div className="wir-error-actions">
            <button
              type="button"
              className="wir-btn wir-btn-secondary"
              onClick={() =>
                navigate(-1)
              }
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              className="wir-btn wir-btn-primary"
              onClick={() =>
                loadRental().catch(
                  () => {}
                )
              }
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="wir-details-page">
      {/* HEADER */}

      <div className="wir-details-header">
        <div className="wir-header-left">
          <button
            type="button"
            className="wir-back-btn"
            onClick={() =>
              navigate(-1)
            }
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="wir-breadcrumb">
              <span>/</span>
              Rental
              <span>/</span>
              Rental Details
            </div>

            <h1>
              Walk-In Rental Details
            </h1>

            <p>
              Rental ID:{" "}
              <strong>
                {getId(rental)}
              </strong>
            </p>
          </div>
        </div>

        <div className="wir-header-actions">
          <button
            type="button"
            className="wir-btn wir-btn-secondary"
            onClick={() => {
              loadRental({
                silent: true,
              }).catch(() => {});

              loadDocuments();
            }}
            disabled={
              actionLoading
            }
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            type="button"
            className="wir-btn wir-btn-secondary"
            onClick={() =>
              navigate(
                "/receptionist-dashboard/rental/new-orders"
              )
            }
          >
            <FileText size={17} />
            All Rentals
          </button>
        </div>
      </div>

      {/* ALERTS */}

      {actionSuccess && (
        <div className="wir-alert wir-alert-success">
          <CheckCircle2 size={20} />
          <span>
            {actionSuccess}
          </span>
        </div>
      )}

      {actionError && (
        <div className="wir-alert wir-alert-danger">
          <AlertCircle size={20} />
          <span>
            {actionError}
          </span>
        </div>
      )}

      {details.taxMismatch && (
        <div className="wir-alert wir-alert-danger">
          <AlertCircle size={20} />

          <span>
            This rental is marked NON-GST,
            but the backend has stored
            GST or an inconsistent total.
            The displayed NON-GST total
            excludes tax. Correct the
            backend record and unpaid
            installment schedule before
            collecting further payments.
          </span>
        </div>
      )}

      {/* STATUS */}

      <div className="wir-status-card">
        <div className="wir-status-main">
          <div className="wir-status-icon">
            <Package size={24} />
          </div>

          <div>
            <span className="wir-label">
              Rental Status
            </span>

            <div className="wir-status-row">
              <span
                className={`wir-status-badge ${getStatusClass(
                  details.status
                )}`}
              >
                {String(
                  details.status
                ).replaceAll(
                  "_",
                  " "
                )}
              </span>

              <span className="wir-source-badge">
                {String(
                  details.rentalSource
                ).replaceAll(
                  "_",
                  " "
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="wir-status-meta">
          <div>
            <span className="wir-label">
              Created
            </span>

            <strong>
              {formatDateTime(
                details.createdAt
              )}
            </strong>
          </div>

          <div>
            <span className="wir-label">
              Rental Period
            </span>

            <strong>
              {details.rentalDuration}{" "}
              {details.isLegacyDays
                ? "Days (Legacy)"
                : "Months"}
            </strong>
          </div>

          <div>
            <span className="wir-label">
              Security Deposit
            </span>

            <strong
              className={
                details.depositStatus ===
                "PAID"
                  ? "wir-deposit-paid"
                  : "wir-deposit-pending"
              }
            >
              {details.depositStatus}
            </strong>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="wir-action-card">
        <div>
          <h3>
            Rental Actions
          </h3>

          <p>
            Manage deposit,
            allocation, pricing and
            return status from here.
          </p>
        </div>

        <div className="wir-action-buttons">
          {details.depositBalance >
            0 &&
            !isClosed && (
              <button
                type="button"
                className="wir-btn wir-btn-warning"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setDepositModalOpen(
                    true
                  )
                }
              >
                <ShieldCheck size={17} />
                Receive Security Deposit
              </button>
            )}

          {!details.allocatedAt &&
            !isClosed && (
              <button
                type="button"
                className="wir-btn wir-btn-primary"
                disabled={
                  actionLoading
                }
                onClick={
                  handleAllocate
                }
              >
                <CheckCircle2 size={17} />
                Allocate Rental
              </button>
            )}

          {!isClosed && (
            <button
              type="button"
              className="wir-btn wir-btn-secondary"
              disabled={
                actionLoading
              }
              onClick={
                handlePricingOpen
              }
            >
              <Pencil size={17} />
              Edit Rental Pricing
            </button>
          )}

          {status ===
            "ACTIVE" && (
            <button
              type="button"
              className="wir-btn wir-btn-danger"
              disabled={
                actionLoading
              }
              onClick={
                handleReturn
              }
            >
              <RefreshCw size={17} />
              Mark Returned
            </button>
          )}
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="wir-details-grid">
        {/* CUSTOMER */}

        <section className="wir-card">
          <div className="wir-card-header">
            <div className="wir-card-title-icon">
              {details.customerType ===
              "COMPANY" ? (
                <Building2 size={20} />
              ) : (
                <User size={20} />
              )}
            </div>

            <div>
              <h2>
                Customer Information
              </h2>

              <p>
                {details.customerType ===
                "COMPANY"
                  ? "Company customer"
                  : "Individual customer"}
              </p>
            </div>
          </div>

          <div className="wir-info-list">
            <InfoItem
              icon={
                details.customerType ===
                "COMPANY"
                  ? Building2
                  : User
              }
              label={
                details.customerType ===
                "COMPANY"
                  ? "Company Name"
                  : "Full Name"
              }
              value={
                details.customer.name
              }
            />

            {details.customer
              .contactPerson && (
              <InfoItem
                icon={User}
                label="Contact Person"
                value={
                  details.customer
                    .contactPerson
                }
              />
            )}

            <InfoItem
              icon={Phone}
              label="Phone"
              value={
                details.customer.phone
              }
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={
                details.customer.email
              }
            />

            <InfoItem
              icon={MapPin}
              label="Address"
              value={
                details.customer.address
              }
            />

            {details.customer
              .gstNumber && (
              <InfoItem
                icon={FileText}
                label="GST Number"
                value={
                  details.customer
                    .gstNumber
                }
              />
            )}
          </div>
        </section>

        {/* PRODUCT */}

        <section className="wir-card">
          <div className="wir-card-header">
            <div className="wir-card-title-icon">
              <Package size={20} />
            </div>

            <div>
              <h2>
                Product Information
              </h2>

              <p>
                Rented product details
              </p>
            </div>
          </div>

          <div className="wir-product-gallery">
            <div className="wir-product-main-image">
              {selectedImage &&
              !imageErrors[
                selectedImage
              ] ? (
                <img
                  src={
                    selectedImage
                  }
                  alt={
                    details.productName
                  }
                  className="wir-product-image"
                  onError={() =>
                    handleImageError(
                      selectedImage
                    )
                  }
                />
              ) : (
                <div className="wir-product-placeholder">
                  <Package size={38} />
                  <span>
                    Product image unavailable
                  </span>
                </div>
              )}
            </div>

            {details.images.length >
              0 && (
              <div className="wir-product-thumbnails">
                {details.images.map(
                  (
                    image,
                    index
                  ) =>
                    imageErrors[
                      image
                    ] ? null : (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        className={`wir-product-thumbnail ${
                          selectedImage ===
                          image
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                      >
                        <img
                          src={
                            image
                          }
                          alt={`${details.productName} ${
                            index + 1
                          }`}
                          onError={() =>
                            handleImageError(
                              image
                            )
                          }
                        />
                      </button>
                    )
                )}
              </div>
            )}
          </div>

          <div className="wir-product">
            <div className="wir-product-info">
              <h3>
                {details.productName}
              </h3>

              {details.productBrand && (
                <p>
                  Brand:{" "}
                  <strong>
                    {
                      details.productBrand
                    }
                  </strong>
                </p>
              )}

              {details.productModel && (
                <p>
                  Model:{" "}
                  <strong>
                    {
                      details.productModel
                    }
                  </strong>
                </p>
              )}

              <p>
                Original Monthly Rent:{" "}
                <strong>
                  {formatMoney(
                    details.originalMonthlyRent
                  )}
                </strong>
              </p>

              <p>
                Applied Monthly Rent:{" "}
                <strong>
                  {formatMoney(
                    details.effectiveMonthlyRent
                  )}
                </strong>
              </p>

              {details.isNegotiated && (
                <p>
                  Pricing Type:{" "}
                  <strong>
                    NEGOTIATED
                  </strong>
                </p>
              )}

              {getId(
                details.rentalProduct
              ) && (
                <p className="wir-small-id">
                  Rental Product ID:{" "}
                  {getId(
                    details.rentalProduct
                  )}
                </p>
              )}

              {getId(
                details.product
              ) && (
                <p className="wir-small-id">
                  Product ID:{" "}
                  {getId(
                    details.product
                  )}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* RENTAL PERIOD */}

        <section className="wir-card">
          <div className="wir-card-header">
            <div className="wir-card-title-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2>
                Rental Period
              </h2>

              <p>
                Start and expected return
              </p>
            </div>
          </div>

          <div className="wir-date-grid">
            {[
              [
                CalendarDays,
                "Start Date",
                formatDate(
                  details.startDate
                ),
              ],
              [
                Clock3,
                "Expected End Date",
                formatDate(
                  details.expectedEndDate
                ),
              ],
              [
                IndianRupee,
                "Next Payment",
                formatDate(
                  details.nextPaymentDate
                ),
              ],
              [
                RefreshCw,
                "Returned At",
                formatDateTime(
                  details.returnedAt
                ),
              ],
            ].map(
              ([
                Icon,
                label,
                value,
              ]) => (
                <div
                  className="wir-date-box"
                  key={label}
                >
                  <span>
                    <Icon size={17} />
                    {label}
                  </span>

                  <strong>
                    {value}
                  </strong>
                </div>
              )
            )}
          </div>
        </section>

        {/* PRICING */}

        <section className="wir-card">
          <div className="wir-card-header">
            <div className="wir-card-title-icon">
              <Receipt size={20} />
            </div>

            <div>
              <h2>
                Rental Pricing
              </h2>

              <p>
                GST / NON-GST and
                negotiated monthly
                pricing
              </p>
            </div>
          </div>

          <div className="wir-pricing">
            <PricingRow
              label="Billing Type"
              value={
                details.isNonGst
                  ? "NON-GST"
                  : "GST"
              }
            />

            <PricingRow
              label="Pricing Type"
              value={
                details.isNegotiated
                  ? "NEGOTIATED"
                  : "STANDARD"
              }
            />

            <PricingRow
              label="Original Monthly Rent"
              value={formatMoney(
                details.originalMonthlyRent
              )}
            />

            {details.isNegotiated && (
              <PricingRow
                label="Negotiated Monthly Rent"
                value={formatMoney(
                  details.effectiveMonthlyRent
                )}
              />
            )}

            <PricingRow
              label="Final Applied Monthly Rent"
              value={formatMoney(
                details.effectiveMonthlyRent
              )}
            />

            {details.isNegotiated &&
              details.monthlySavings >
                0 && (
                <>
                  <PricingRow
                    label="Monthly Discount"
                    value={formatMoney(
                      details.monthlySavings
                    )}
                  />

                  <PricingRow
                    label="Total Rental Savings"
                    value={formatMoney(
                      details.totalSavings
                    )}
                  />
                </>
              )}

            {details.negotiationReason && (
              <div className="wir-price-row">
                <span>
                  Negotiation Reason
                </span>

                <strong>
                  {
                    details.negotiationReason
                  }
                </strong>
              </div>
            )}

            {details.isLegacyDays && (
              <PricingRow
                label="Legacy Daily Rental Price"
                value={formatMoney(
                  details.dailyRent
                )}
              />
            )}

            <PricingRow
              label="Rental Duration"
              value={`${
                details.rentalDuration
              } ${
                details.isLegacyDays
                  ? "Days"
                  : "Months"
              }`}
            />

            <PricingRow
              label="Rental Subtotal"
              value={formatMoney(
                details.rentSubtotal
              )}
            />

            <PricingRow
              label={
                details.isNonGst
                  ? "GST (Not Charged)"
                  : `GST (${details.gstPercentage}%)`
              }
              value={formatMoney(
                details.gstAmount
              )}
            />

            <PricingRow
              label={
                details.isNonGst
                  ? "Total Rent Without GST"
                  : "Total Rent Including GST"
              }
              value={formatMoney(
                details.totalRent
              )}
              highlight
            />

            <PricingRow
              label="Refundable Security Deposit"
              value={formatMoney(
                details.securityDeposit
              )}
            />

            <PricingRow
              label="Deposit Received"
              value={formatMoney(
                details.depositAmountPaid
              )}
            />

            <PricingRow
              label="Deposit Remaining"
              value={formatMoney(
                details.depositBalance
              )}
            />

            <PricingRow
              label="Deposit Status"
              value={
                details.depositStatus
              }
            />

            {details.depositReceivedAt && (
              <PricingRow
                label="Deposit Received At"
                value={formatDateTime(
                  details.depositReceivedAt
                )}
              />
            )}

            <PricingRow
              label="Total Contract Amount Including Deposit"
              value={formatMoney(
                details.totalRent +
                  details.securityDeposit
              )}
              highlight
            />

            <p className="wir-pricing-note">
              Security deposit is
              refundable and is not
              taxable rental revenue.
              Contract total is not
              the same as outstanding
              payment balance.
            </p>
          </div>
        </section>
      </div>

      {/* CUSTOMER DOCUMENTS */}

      <section className="wir-card wir-documents-card">
        <div className="wir-card-header">
          <div className="wir-card-title-icon">
            <FileCheck2 size={20} />
          </div>

          <div>
            <h2>
              Customer Documents
            </h2>

            <p>
              Documents uploaded
              during rental creation
            </p>
          </div>

          <div className="wir-documents-count">
            {documents.length}{" "}
            {documents.length === 1
              ? "Document"
              : "Documents"}
          </div>
        </div>

        {documentsLoading && (
          <div className="wir-documents-loading">
            <Loader2
              size={26}
              className="wir-spin"
            />

            <span>
              Loading customer
              documents...
            </span>
          </div>
        )}

        {!documentsLoading &&
          documentsError && (
            <div className="wir-documents-error">
              <AlertCircle size={20} />

              <div>
                <strong>
                  Unable to load
                  documents
                </strong>

                <p>
                  {documentsError}
                </p>
              </div>

              <button
                type="button"
                className="wir-btn wir-btn-secondary"
                onClick={
                  loadDocuments
                }
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

        {!documentsLoading &&
          !documentsError &&
          documents.length ===
            0 && (
            <div className="wir-documents-empty">
              <div className="wir-documents-empty-icon">
                <FileText size={34} />
              </div>

              <h3>
                No documents
                uploaded
              </h3>

              <p>
                Customer documents
                will appear here.
              </p>
            </div>
          )}

        {!documentsLoading &&
          !documentsError &&
          documents.length >
            0 && (
            <div className="wir-documents-grid">
              {documents.map(
                (
                  document,
                  index
                ) => {
                  const documentId =
                    getId(
                      document
                    ) ||
                    `${
                      document.documentType
                    }-${index}`;

                  const documentUrl =
                    normalizeFileUrl(
                      document.fileUrl ||
                        document.url ||
                        document.path
                    );

                  const pdf =
                    isPdfDocument(
                      document
                    );

                  const image =
                    isImageDocument(
                      document
                    );

                  const docStatus =
                    String(
                      document.verificationStatus ||
                        "PENDING"
                    ).toUpperCase();

                  return (
                    <article
                      className="wir-document-card"
                      key={
                        documentId
                      }
                    >
                      <div className="wir-document-preview">
                        {image &&
                        documentUrl &&
                        !documentImageErrors[
                          documentId
                        ] ? (
                          <img
                            src={
                              documentUrl
                            }
                            alt={getDocumentLabel(
                              document.documentType
                            )}
                            className="wir-document-image"
                            onError={() =>
                              setDocumentImageErrors(
                                (
                                  previous
                                ) => ({
                                  ...previous,
                                  [documentId]:
                                    true,
                                })
                              )
                            }
                          />
                        ) : pdf &&
                          documentUrl ? (
                          <iframe
                            src={`${documentUrl}#toolbar=0`}
                            title={getDocumentLabel(
                              document.documentType
                            )}
                            className="wir-document-pdf"
                          />
                        ) : (
                          <div className="wir-document-file-placeholder">
                            <FileText
                              size={48}
                            />

                            <span>
                              {pdf
                                ? "PDF Document"
                                : "Document File"}
                            </span>
                          </div>
                        )}

                        <span className="wir-document-file-type">
                          {pdf
                            ? "PDF"
                            : image
                            ? "IMAGE"
                            : "FILE"}
                        </span>
                      </div>

                      <div className="wir-document-content">
                        <div className="wir-document-title-row">
                          <div>
                            <h3>
                              {getDocumentLabel(
                                document.documentType
                              )}
                            </h3>

                            <p>
                              {document.fileName ||
                                "Uploaded document"}
                            </p>
                          </div>

                          <span
                            className={`wir-document-status ${getDocumentStatusClass(
                              docStatus
                            )}`}
                          >
                            {docStatus ===
                            "APPROVED" ? (
                              <CheckCircle2
                                size={14}
                              />
                            ) : docStatus ===
                              "REJECTED" ? (
                              <XCircle
                                size={14}
                              />
                            ) : (
                              <Clock3
                                size={14}
                              />
                            )}

                            {docStatus}
                          </span>
                        </div>

                        {document.createdAt && (
                          <div className="wir-document-meta">
                            <span>
                              Uploaded
                            </span>

                            <strong>
                              {formatDateTime(
                                document.createdAt
                              )}
                            </strong>
                          </div>
                        )}

                        {document.verifiedAt && (
                          <div className="wir-document-meta">
                            <span>
                              Verified
                            </span>

                            <strong>
                              {formatDateTime(
                                document.verifiedAt
                              )}
                            </strong>
                          </div>
                        )}

                        {docStatus ===
                          "REJECTED" &&
                          document.rejectionReason && (
                            <div className="wir-document-rejection">
                              <XCircle
                                size={16}
                              />

                              <div>
                                <strong>
                                  Rejection
                                  Reason
                                </strong>

                                <p>
                                  {
                                    document.rejectionReason
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                        <div className="wir-document-actions">
                          {documentUrl && (
                            <>
                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wir-document-action-btn primary"
                              >
                                <Eye
                                  size={16}
                                />
                                View
                              </a>

                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wir-document-action-btn secondary"
                                download={
                                  document.fileName ||
                                  true
                                }
                              >
                                <Download
                                  size={16}
                                />
                                Download
                              </a>

                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wir-document-action-btn secondary"
                              >
                                <ExternalLink
                                  size={16}
                                />
                                Open
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
      </section>

      {/* NOTES */}

      {details.notes && (
        <section className="wir-card wir-notes-card">
          <div className="wir-card-header">
            <div className="wir-card-title-icon">
              <FileText size={20} />
            </div>

            <div>
              <h2>
                Handover / Rental Notes
              </h2>

              <p>
                Notes saved during
                rental creation
              </p>
            </div>
          </div>

          <div className="wir-notes">
            {details.notes}
          </div>
        </section>
      )}

      {/* TIMELINE */}

      <section className="wir-card">
        <div className="wir-card-header">
          <div className="wir-card-title-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <h2>
              Rental Timeline
            </h2>

            <p>
              Important rental events
            </p>
          </div>
        </div>

        <div className="wir-timeline">
          <div className="wir-timeline-item completed">
            <div className="wir-timeline-dot">
              <CheckCircle2
                size={16}
              />
            </div>

            <div>
              <strong>
                Rental Created
              </strong>

              <span>
                {formatDateTime(
                  details.createdAt
                )}
              </span>
            </div>
          </div>

          <div
            className={`wir-timeline-item ${
              details.depositReceived
                ? "completed"
                : ""
            }`}
          >
            <div className="wir-timeline-dot">
              <ShieldCheck
                size={16}
              />
            </div>

            <div>
              <strong>
                Security Deposit
              </strong>

              <span>
                {details.depositStatus}
                {details.depositReceivedAt
                  ? ` — ${formatDateTime(
                      details.depositReceivedAt
                    )}`
                  : ""}
              </span>
            </div>
          </div>

          <div
            className={`wir-timeline-item ${
              details.allocatedAt
                ? "completed"
                : ""
            }`}
          >
            <div className="wir-timeline-dot">
              <Package
                size={16}
              />
            </div>

            <div>
              <strong>
                Rental Allocated
              </strong>

              <span>
                {details.allocatedAt
                  ? formatDateTime(
                      details.allocatedAt
                    )
                  : "Not allocated yet"}
              </span>
            </div>
          </div>

          <div
            className={`wir-timeline-item ${
              details.returnedAt
                ? "completed"
                : ""
            }`}
          >
            <div className="wir-timeline-dot">
              <RefreshCw
                size={16}
              />
            </div>

            <div>
              <strong>
                Rental Returned
              </strong>

              <span>
                {details.returnedAt
                  ? formatDateTime(
                      details.returnedAt
                    )
                  : "Not returned yet"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <div className="wir-footer-actions">
        <button
          type="button"
          className="wir-btn wir-btn-secondary"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={18} />
          Back to Rentals
        </button>

        <button
          type="button"
          className="wir-btn wir-btn-primary"
          onClick={() =>
            navigate(
              "/receptionist-dashboard/rental/new"
            )
          }
        >
          <Package size={18} />
          Create New Walk-In Rental
        </button>
      </div>

      {/* DEPOSIT MODAL */}

      {depositModalOpen && (
        <div className="wir-modal-overlay">
          <div
            className="wir-modal"
            role="dialog"
            aria-modal="true"
          >
            <h2>
              Receive Security Deposit
            </h2>

            <p>
              Remaining Deposit:{" "}
              <strong>
                {formatMoney(
                  details.depositBalance
                )}
              </strong>
            </p>

            <label htmlFor="wir-deposit-method">
              Payment Method
            </label>

            <select
              id="wir-deposit-method"
              value={
                depositPaymentMethod
              }
              onChange={(event) =>
                setDepositPaymentMethod(
                  event.target.value
                )
              }
            >
              <option value="">
                Select Payment Method
              </option>

              {PAYMENT_METHODS.map(
                (method) => (
                  <option
                    key={
                      method.value
                    }
                    value={
                      method.value
                    }
                  >
                    {
                      method.label
                    }
                  </option>
                )
              )}
            </select>

            <div className="wir-modal-actions">
              <button
                type="button"
                className="wir-btn wir-btn-secondary"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setDepositModalOpen(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="wir-btn wir-btn-primary"
                disabled={
                  actionLoading ||
                  !depositPaymentMethod
                }
                onClick={() =>
                  runAction(
                    "deposit",
                    {
                      paymentMethod:
                        depositPaymentMethod,
                    }
                  )
                }
              >
                {actionLoading ? (
                  <Loader2
                    size={17}
                    className="wir-spin"
                  />
                ) : (
                  <ShieldCheck
                    size={17}
                  />
                )}

                Confirm Received
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRICING MODAL */}

      {pricingOpen && (
        <div className="wir-modal-overlay">
          <div
            className="wir-modal"
            role="dialog"
            aria-modal="true"
          >
            <h2>
              Edit Rental Pricing
            </h2>

            <p>
              Update negotiated
              monthly rent and
              billing type. Paid
              installments must
              remain unchanged in
              the backend.
            </p>

            <label htmlFor="wir-original-rent">
              Original Monthly Rent
            </label>

            <input
              id="wir-original-rent"
              type="text"
              readOnly
              value={formatMoney(
                details.originalMonthlyRent
              )}
            />

            <label htmlFor="wir-monthly-rent">
              Negotiated Monthly
              Rent (₹)
            </label>

            <input
              id="wir-monthly-rent"
              type="number"
              min="0"
              step="0.01"
              value={
                pricingForm.monthlyRent
              }
              onChange={(event) =>
                setPricingForm(
                  (previous) => ({
                    ...previous,
                    monthlyRent:
                      event.target.value,
                  })
                )
              }
            />

            <label htmlFor="wir-billing-type">
              Billing Type
            </label>

            <select
              id="wir-billing-type"
              value={
                pricingForm.billingType
              }
              onChange={(event) =>
                setPricingForm(
                  (previous) => ({
                    ...previous,
                    billingType:
                      event.target.value,
                  })
                )
              }
            >
              <option value="GST">
                GST
              </option>

              <option value="NON_GST">
                Non-GST
              </option>
            </select>

            {pricingForm.billingType ===
              "GST" && (
              <>
                <label htmlFor="wir-gst-percentage">
                  GST Percentage (%)
                </label>

                <input
                  id="wir-gst-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={
                    pricingForm.gstPercentage
                  }
                  onChange={(event) =>
                    setPricingForm(
                      (previous) => ({
                        ...previous,
                        gstPercentage:
                          event.target.value,
                      })
                    )
                  }
                />
              </>
            )}

            <label htmlFor="wir-negotiation-reason">
              Negotiation / Change
              Reason
            </label>

            <textarea
              id="wir-negotiation-reason"
              rows={3}
              placeholder="Enter approved reason for price or billing change"
              value={
                pricingForm.negotiationReason
              }
              onChange={(event) =>
                setPricingForm(
                  (previous) => ({
                    ...previous,
                    negotiationReason:
                      event.target.value,
                  })
                )
              }
            />

            <div className="wir-modal-actions">
              <button
                type="button"
                className="wir-btn wir-btn-secondary"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setPricingOpen(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="wir-btn wir-btn-primary"
                disabled={
                  actionLoading
                }
                onClick={
                  handlePricingSave
                }
              >
                {actionLoading ? (
                  <Loader2
                    size={17}
                    className="wir-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                Save Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalkInRentalDetails;
