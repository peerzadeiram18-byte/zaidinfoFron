// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import {
//     FaArrowLeft,
//     FaBuilding,
//     FaCalendarAlt,
//     FaCheckCircle,
//     FaEnvelope,
//     FaLaptop,
//     FaMapMarkerAlt,
//     FaMinus,
//     FaPhone,
//     FaPlus,
//     FaRupeeSign,
//     FaSearch,
//     FaShieldAlt,
//     FaSpinner,
//     FaUser,
//     FaTimes,
//     FaRedo,
//     FaMoneyBillWave,
//     FaCreditCard,
//     FaUniversity,
//     FaTrashAlt,
//     FaShoppingCart,
// } from "react-icons/fa";

// import {
//     getRentalProducts,
//     createWalkInRentalRequest,
//     uploadRentalDocument,
//     uploadRentalConditionPhoto

// } from "../../../services/rentalApi";

// import { createPayment } from "../../../services/paymentService";

// import "./WalkInRental.css";

// /* ========================================================= 
//    BUSINESS RULES (backend rental.constants.js ke same rakhna)
// ========================================================= */

// const MAX_UNITS_INDIVIDUAL = 1;
// const MAX_UNITS_COMPANY = 10;
// const COMPANY_MIN_MONTHS = 3;

// /* ========================================================= 
//    API 
// ========================================================= */

// const API = import.meta.env.VITE_API_URL || "";

// /* ========================================================= 
//    EMPTY CUSTOMER 
// ========================================================= */

// const EMPTY_INDIVIDUAL = {
//     fullName: "",
//     phone: "",
//     email: "",
//     address: "",
// };

// const EMPTY_COMPANY = {
//     companyName: "",
//     contactPerson: "",
//     phone: "",
//     email: "",
//     officeAddress: "",
//     gstNumber: "",
// };

// /* ========================================================= 
//    ARRAY HELPER 
// ========================================================= */

// const getFirstArray = (response) => {
//     const candidates = [
//         response,
//         response?.data,
//         response?.products,
//         response?.data?.products,
//         response?.data?.data,
//         response?.data?.data?.products,
//     ];

//     for (const item of candidates) {
//         if (Array.isArray(item)) {
//             return item;
//         }
//     }

//     return [];
// };

// /* ========================================================= 
//    CREATED ORDER (backend: data = { orderId, rentals, warnings })
// ========================================================= */

// const looksLikeRental = (value) =>
//     value &&
//     typeof value === "object" &&
//     !Array.isArray(value) &&
//     Boolean(value.rentalNumber || (value._id && (value.rentalProductId || value.customerType)));

// // Response kisi bhi shape me aaye (axios response, {success,data}, naya
// // {orderId,rentals} ya purana single rental) — rentals dhoondh nikalta hai.
// const extractCreatedOrder = (response) => {
//     let level = [response];

//     for (let depth = 0; depth < 5 && level.length > 0; depth++) {
//         const next = [];

//         for (const node of level) {
//             if (!node || typeof node !== "object") continue;

//             if (Array.isArray(node.rentals) && node.rentals.length > 0) {
//                 return {
//                     orderId: node.orderId || "",
//                     rentals: node.rentals,
//                     warnings: Array.isArray(node.warnings) ? node.warnings : [],
//                 };
//             }

//             if (looksLikeRental(node.rental)) {
//                 return { orderId: node.rental.orderId || "", rentals: [node.rental], warnings: [] };
//             }

//             if (looksLikeRental(node)) {
//                 return { orderId: node.orderId || "", rentals: [node], warnings: [] };
//             }

//             next.push(node.data, node.result);
//         }

//         level = next;
//     }

//     return { orderId: "", rentals: [], warnings: [] };
// };

// /* ========================================================= 
//    PRODUCT OBJECT 
// ========================================================= */

// const getProductObject = (item) => {
//     if (!item) return {};

//     if (item?.productId && typeof item.productId === "object") {
//         return item.productId;
//     }

//     if (item?.product && typeof item.product === "object") {
//         return item.product;
//     }

//     return item;
// };

// /* ========================================================= 
//    PRODUCT ID 
// ========================================================= */

// const getProductId = (item) => {
//     if (!item) return "";

//     const product = getProductObject(item);

//     return String(
//         product?._id ||
//         product?.id ||
//         (typeof item?.productId === "string" ? item.productId : "") ||
//         item?._id ||
//         item?.id ||
//         ""
//     );
// };

// /* ========================================================= 
//    RENTAL PRODUCT ID 
// ========================================================= */

// const getRentalProductId = (item) => {
//     if (!item) return "";

//     if (item?.rentalProductId && typeof item.rentalProductId === "object") {
//         return String(item.rentalProductId?._id || item.rentalProductId?.id || "");
//     }

//     if (item?.rentalProductId) {
//         return String(item.rentalProductId);
//     }

//     if (item?.rentalProduct && typeof item.rentalProduct === "object") {
//         return String(item.rentalProduct?._id || item.rentalProduct?.id || "");
//     }

//     return String(item?._id || item?.id || "");
// };

// /* ========================================================= 
//    PRODUCT NAME 
// ========================================================= */

// const getProductName = (item) => {
//     const product = getProductObject(item);

//     return (
//         product?.name ||
//         product?.title ||
//         item?.name ||
//         item?.title ||
//         item?.productName ||
//         "Rental Laptop"
//     );
// };

// /* ========================================================= 
//    BRAND 
// ========================================================= */

// const getBrand = (item) => {
//     const product = getProductObject(item);

//     if (product?.brand && typeof product.brand === "object") {
//         return product.brand?.name || product.brand?.title || "";
//     }

//     if (item?.brand && typeof item.brand === "object") {
//         return item.brand?.name || item.brand?.title || "";
//     }

//     return product?.brand || item?.brand || "";
// };

// /* ========================================================= 
//    SKU 
// ========================================================= */

// const getSku = (item) => {
//     const product = getProductObject(item);

//     return product?.sku || product?.productCode || item?.sku || item?.productCode || "N/A";
// };

// /* ========================================================= 
//    MONTHLY RENT 
// ========================================================= */

// const getMonthlyRent = (item) => {
//     const product = getProductObject(item);

//     return Number(
//         item?.monthlyRent ??
//         item?.rental?.monthlyRent ??
//         item?.rentalDetails?.monthlyRent ??
//         item?.pricing?.monthlyRent ??
//         product?.monthlyRent ??
//         product?.rental?.monthlyRent ??
//         product?.rentalDetails?.monthlyRent ??
//         product?.pricing?.monthlyRent ??
//         0
//     );
// };

// /* ========================================================= 
//    SECURITY DEPOSIT 
// ========================================================= */

// const getSecurityDeposit = (item) => {
//     const product = getProductObject(item);

//     return Number(
//         item?.securityDeposit ??
//         item?.rental?.securityDeposit ??
//         item?.rentalDetails?.securityDeposit ??
//         item?.pricing?.securityDeposit ??
//         product?.securityDeposit ??
//         product?.rental?.securityDeposit ??
//         product?.rentalDetails?.securityDeposit ??
//         product?.pricing?.securityDeposit ??
//         0
//     );
// };

// /* ========================================================= 
//    MINIMUM MONTHS 
// ========================================================= */

// const getMinimumMonths = (item) => {
//     const product = getProductObject(item);

//     const value =
//         item?.minimumRentalMonths ??
//         item?.minRentalMonths ??
//         item?.rental?.minimumRentalMonths ??
//         item?.rentalDetails?.minimumRentalMonths ??
//         product?.minimumRentalMonths ??
//         product?.minRentalMonths ??
//         product?.rental?.minimumRentalMonths ??
//         product?.rentalDetails?.minimumRentalMonths ??
//         3;

//     const months = Number(value);

//     return months >= 1 ? months : 3;
// };

// /* ========================================================= 
//    GST 
// ========================================================= */

// const getGST = (item) => {
//     const product = getProductObject(item);

//     return Number(
//         item?.gstPercentage ??
//         item?.gst ??
//         item?.rental?.gstPercentage ??
//         item?.rental?.gst ??
//         item?.rentalDetails?.gstPercentage ??
//         item?.rentalDetails?.gst ??
//         product?.gstPercentage ??
//         product?.gst ??
//         product?.rental?.gstPercentage ??
//         product?.rental?.gst ??
//         0
//     );
// };

// /* ========================================================= 
//    AVAILABLE QUANTITY 
// ========================================================= */

// const getAvailableQuantity = (item) => {
//     const product = getProductObject(item);

//     return Number(
//         item?.availableQuantity ??
//         item?.availableQty ??
//         item?.availableStock ??
//         item?.rental?.availableQuantity ??
//         item?.rentalDetails?.availableQuantity ??
//         product?.availableQuantity ??
//         product?.rental?.availableQuantity ??
//         product?.rentalDetails?.availableQuantity ??
//         item?.quantity ??
//         0
//     );
// };

// /* ========================================================= 
//    RENTAL PRODUCT CHECK 
// ========================================================= */

// const isRentalProduct = (item) => {
//     if (!item) return false;

//     const product = getProductObject(item);

//     const productType = String(item?.productType ?? product?.productType ?? "")
//         .trim()
//         .toUpperCase();

//     if (productType === "RENTAL") return true;
//     if (item?.rentalProductId) return true;

//     if (
//         item?.monthlyRent !== undefined ||
//         item?.securityDeposit !== undefined ||
//         item?.minimumRentalMonths !== undefined ||
//         item?.isAvailableForRent !== undefined
//     ) {
//         return true;
//     }

//     if (item?.rental || item?.rentalDetails) return true;

//     return false;
// };

// /* ========================================================= 
//    IMAGE 
// ========================================================= */

// const getImageUrl = (item) => {
//     const product = getProductObject(item);

//     let image =
//         item?.primaryImage ||
//         item?.image ||
//         item?.imageUrl ||
//         item?.thumbnail ||
//         product?.primaryImage ||
//         product?.image ||
//         product?.imageUrl ||
//         product?.thumbnail ||
//         "";

//     if (Array.isArray(product?.images) && product.images.length > 0) {
//         image = product.images[0];
//     }

//     if (Array.isArray(item?.images) && item.images.length > 0) {
//         image = item.images[0];
//     }

//     if (typeof image === "object" && image !== null) {
//         image = image?.url || image?.path || image?.fileUrl || image?.src || "";
//     }

//     if (!image) return "";

//     const imageString = String(image).trim();

//     if (imageString.startsWith("http://") || imageString.startsWith("https://")) {
//         return imageString;
//     }

//     const serverUrl = String(API).replace(/\/api\/?$/, "").replace(/\/$/, "");
//     const cleanPath = imageString.replace(/^\/+/, "");

//     if (!serverUrl) return `/${cleanPath}`;

//     return `${serverUrl}/${cleanPath}`;
// };

// /* ========================================================= 
//    MONEY 
// ========================================================= */

// const money = (value) => {
//     return `₹${Number(value || 0).toLocaleString("en-IN", {
//         maximumFractionDigits: 2,
//     })}`;
// };

// /* ========================================================= 
//    COMPONENT 
// ========================================================= */

// function WalkInRental() {
//     const navigate = useNavigate();

//     /* BASIC STATE */
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [products, setProducts] = useState([]);
//     const [search, setSearch] = useState("");

//     /* CART — array of { rentalProductId, productId, product, quantity } 
//        INDIVIDUAL: sirf 1 laptop (1 unit). 
//        COMPANY: maximum 10 units total (alag alag laptops mila kar). */
//     const [cart, setCart] = useState([]);

//     /* CUSTOMER TYPE */
//     const [customerType, setCustomerType] = useState("INDIVIDUAL");

//     /* CUSTOMER DETAILS */
//     const [individualDetails, setIndividualDetails] = useState({ ...EMPTY_INDIVIDUAL });
//     const [companyDetails, setCompanyDetails] = useState({ ...EMPTY_COMPANY });

//     /* RENTAL DURATION — shared across the whole order */
// const [rentalDurationType, setRentalDurationType] =
//   useState("MONTHS");

// const [rentalDuration, setRentalDuration] =
//   useState(3);

//     /* HANDOVER NOTES */
//     const [handoverDescription, setHandoverDescription] = useState("");

//     /* DEPOSIT PAYMENT */
//     const [depositPaid, setDepositPaid] = useState(false);
//     const [depositAmountPaid, setDepositAmountPaid] = useState(0);
//     const [depositPaymentMethod, setDepositPaymentMethod] = useState("CASH");
//     const [depositPaymentReference, setDepositPaymentReference] = useState("");

//     /* FIRST RENT INSTALLMENT PAYMENT (pehle month ka rent abhi liya ya nahi) */
//     const [rentPaidNow, setRentPaidNow] = useState(false);
//     const [rentPaymentMethod, setRentPaymentMethod] = useState("CASH");
//     const [rentPaymentReference, setRentPaymentReference] = useState("");

//     const maxUnits = customerType === "COMPANY" ? MAX_UNITS_COMPANY : MAX_UNITS_INDIVIDUAL;

//     const cartTotalUnits = useMemo(
//         () => cart.reduce((sum, c) => sum + c.quantity, 0),
//         [cart]
//     );

//     /* DOCUMENT CONFIG — Office ID / College ID share ONE upload field in the UI, 
//        but the backend only recognizes the exact types "OFFICE_ID" / "COLLEGE_ID" — 
//        so this entry carries a toggle (officeOrCollegeType) that decides which of 
//        those two valid types gets sent when the file is actually uploaded. */
//     const DOCUMENT_CONFIG = {
//         INDIVIDUAL: [
//             { key: "PASSPORT_PHOTO", label: "Passport Size Photograph", accept: "image/*" },
//             { key: "PAN_CARD", label: "PAN Card", accept: "image/*,.pdf" },
//             { key: "AADHAAR_CARD", label: "Aadhaar Card", accept: "image/*,.pdf" },
//             { key: "HOUSE_RENTAL_AGREEMENT", label: "House Rental Agreement", accept: "image/*,.pdf" },
//             {
//                 key: "OFFICE_OR_COLLEGE_ID",
//                 label: "Office ID / College ID (any one)",
//                 accept: "image/*,.pdf",
//                 isOfficeOrCollege: true,
//             },
//         ],
//         COMPANY: [
//             { key: "PAN_CARD", label: "PAN Card", accept: "image/*,.pdf" },
//             { key: "AADHAAR_CARD", label: "Authorized Person Aadhaar Card", accept: "image/*,.pdf" },
//             { key: "GST_REGISTRATION", label: "GST Registration", accept: "image/*,.pdf" },
//             { key: "OFFICE_ID", label: "Office ID", accept: "image/*,.pdf" },
//             { key: "AUTHORIZATION_LETTER", label: "Authorization Letter", accept: "image/*,.pdf" },
//         ],
//     };

//     const [documents, setDocuments] = useState({});

//     // Which real backend type the merged Office/College ID slot currently represents.
//     const [officeOrCollegeType, setOfficeOrCollegeType] = useState("OFFICE_ID");

//     const currentDocuments = DOCUMENT_CONFIG[customerType] || DOCUMENT_CONFIG.INDIVIDUAL;

//     // The document key actually sent to the backend for a given config entry —
//     // every entry uses its own key, except the merged Office/College slot, which
//     // resolves to whichever of the two valid backend types the user picked.
//     const resolveBackendDocType = (documentConfig) =>
//         documentConfig.isOfficeOrCollege ? officeOrCollegeType : documentConfig.key;

//     /* DOCUMENT CHANGE */
//     const handleDocumentChange = (documentType, event) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         const maxSize = 10 * 1024 * 1024;

//         const allowedTypes = [
//             "image/jpeg",
//             "image/jpg",
//             "image/png",
//             "image/webp",
//             "application/pdf",
//         ];

//         if (!allowedTypes.includes(file.type)) {
//             toast.error("Only JPG, PNG, WEBP or PDF files are allowed.");
//             event.target.value = "";
//             return;
//         }

//         if (file.size > maxSize) {
//             toast.error("Document size must be less than 10 MB.");
//             event.target.value = "";
//             return;
//         }

//         setDocuments((previous) => ({
//             ...previous,
//             [documentType]: file,
//         }));
//     };

//     /* VALIDATE DOCUMENTS */
//     const validateDocuments = () => {
//         for (const documentConfig of currentDocuments) {
//             if (!documents[documentConfig.key]) {
//                 toast.error(`Please upload ${documentConfig.label}.`);
//                 return false;
//             }
//         }

//         return true;
//     };

//     /* UPLOAD DOCUMENTS — sirf pehle rental par upload hota hai,
//        backend same order ke baaki laptops par khud copy kar deta hai. */

// const uploadAllDocuments = async (rentalId) => {
//     if (!rentalId) {
//         throw new Error("Rental ID is missing");
//     }

//     const uploadResults = [];

//     for (const documentConfig of currentDocuments) {
//         const file = documents[documentConfig.key];

//         if (!file) {
//             throw new Error(
//                 `Please upload ${documentConfig.label}.`
//             );
//         }

//         // Office/College ID ke liye actual backend type use karein.
//         const documentType = resolveBackendDocType(documentConfig);

//         console.log("Uploading rental document:", {
//             rentalId,
//             documentType,
//             fileName: file.name,
//             fileSize: file.size,
//         });

//         const response = await uploadRentalDocument(
//             rentalId,
//             documentType,
//             file
//         );

//         if (response?.success === false) {
//             throw new Error(
//                 response.message || `Failed to upload ${documentConfig.label}.`
//             );
//         }

//         uploadResults.push({
//             type: documentType,
//             fileName: file.name,
//             response,
//         });
//     }

//     console.log("ALL DOCUMENT UPLOAD RESULTS:", uploadResults);

//     return uploadResults;
// };
// const PHOTO_SIDES = [
//   { key: "FRONT", label: "Front Image" },
//   { key: "BACK", label: "Back Image" },
//   { key: "FULL", label: "Full Image" }
// ];

// const [conditionPhotos, setConditionPhotos] = useState({
//   FRONT: null,
//   BACK: null,
//   FULL: null
// });

// const handleConditionPhotoChange = (side, event) => {
//   const file = event.target.files?.[0];

//   if (!file) return;

//   const allowed = [
//     "image/jpeg",
//     "image/png",
//     "image/webp"
//   ];

//   if (!allowed.includes(file.type)) {
//     toast.error("Only JPG, PNG or WEBP images allowed");
//     event.target.value = "";
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     toast.error("Image size must be 5 MB or less");
//     event.target.value = "";
//     return;
//   }

//   setConditionPhotos((previous) => ({
//     ...previous,
//     [side]: file
//   }));
// };

// const validateConditionPhotos = () => {
//   for (const { key, label } of PHOTO_SIDES) {
//     if (!conditionPhotos[key]) {
//       toast.error(`Please upload ${label}`);
//       return false;
//     }
//   }

//   return true;
// };

// const uploadConditionPhotos = async (rentalId) => {
//   for (const { key } of PHOTO_SIDES) {
//     const file = conditionPhotos[key];

//     if (!file) {
//       throw new Error(`${key} image is missing`);
//     }

//     const result = await uploadRentalConditionPhoto(
//       rentalId,
//       key,
//       file
//     );

//     if (result?.success === false) {
//       throw new Error(
//         result.message || `${key} upload failed`
//       );
//     }
//   }
// };

//     /* LOAD PRODUCTS */
//     const loadProducts = async (showRefresh = false) => {
//         try {
//             if (showRefresh) {
//                 setRefreshing(true);
//             } else {
//                 setLoading(true);
//             }

//             const response = await getRentalProducts();

//             const list = getFirstArray(response);
//             const rentalOnly = list.filter(isRentalProduct);

//             setProducts(rentalOnly);

//             // Drop cart items whose product no longer exists / is no longer rentable,
//             // and clamp quantities to the latest available stock.
//             setCart((previousCart) =>
//                 previousCart
//                     .map((cartItem) => {
//                         const fresh = rentalOnly.find(
//                             (p) => getRentalProductId(p) === cartItem.rentalProductId
//                         );

//                         if (!fresh) return null;

//                         const available = getAvailableQuantity(fresh);

//                         if (available <= 0) return null;

//                         return {
//                             ...cartItem,
//                             product: fresh,
//                             quantity: Math.min(cartItem.quantity, available),
//                         };
//                     })
//                     .filter(Boolean)
//             );
//         } catch (error) {
//             console.error("LOAD RENTAL PRODUCTS ERROR:", error);

//             if (!showRefresh) {
//                 setProducts([]);
//             }

//             toast.error(
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.message ||
//                 "Failed to load rental products"
//             );
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     /* Reset deposit / rent payment fields whenever the cart changes — never auto-mark as paid */
//     useEffect(() => {
//         setDepositPaid(false);
//         setDepositAmountPaid(0);
//         setDepositPaymentMethod("CASH");
//         setDepositPaymentReference("");

//         setRentPaidNow(false);
//         setRentPaymentMethod("CASH");
//         setRentPaymentReference("");
//     }, [cartTotalUnits]);

//     /* SEARCH FILTER */
//     const filteredProducts = useMemo(() => {
//         const keyword = search.trim().toLowerCase();

//         if (!keyword) return products;

//         return products.filter((item) => {
//             const name = String(getProductName(item)).toLowerCase();
//             const brand = String(getBrand(item)).toLowerCase();
//             const sku = String(getSku(item)).toLowerCase();

//             return name.includes(keyword) || brand.includes(keyword) || sku.includes(keyword);
//         });
//     }, [products, search]);

//     /* CART HELPERS */
//     const getCartQuantity = (rentalProductId) => {
//         const found = cart.find((c) => c.rentalProductId === rentalProductId);
//         return found ? found.quantity : 0;
//     };

//     const limitMessage =
//         customerType === "COMPANY"
//             ? `Company can rent a maximum of ${MAX_UNITS_COMPANY} laptops in one order.`
//             : "Individual customer can rent only 1 laptop at a time.";

//     const addToCart = (item) => {
//         if (!isRentalProduct(item)) {
//             toast.error("Only rental products can be selected.");
//             return;
//         }

//         const available = getAvailableQuantity(item);

//         if (available <= 0) {
//             toast.error("This rental laptop is out of stock.");
//             return;
//         }

//         if (cartTotalUnits >= maxUnits) {
//             toast.error(limitMessage);
//             return;
//         }

//         const rentalProductId = getRentalProductId(item);
//         const productId = getProductId(item);

//         setCart((previous) => {
//             const existingIndex = previous.findIndex(
//                 (c) => c.rentalProductId === rentalProductId
//             );

//             if (existingIndex >= 0) {
//                 const next = [...previous];
//                 const current = next[existingIndex];

//                 if (current.quantity >= available) {
//                     toast.error(`Only ${available} unit(s) available in stock.`);
//                     return previous;
//                 }

//                 next[existingIndex] = { ...current, quantity: current.quantity + 1 };
//                 return next;
//             }

//             return [
//                 ...previous,
//                 {
//                     rentalProductId,
//                     productId,
//                     product: item,
//                     quantity: 1,
//                 },
//             ];
//         });

//         // First laptop added to a fresh order — set sensible default duration.
//         if (cart.length === 0) {
//             const minimum = getMinimumMonths(item);

//             if (customerType === "INDIVIDUAL") {
//                 setRentalDurationType("DAYS");
//                 setRentalDuration(1);
//             } else {
//                 setRentalDurationType("MONTHS");
//                 setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimum));
//             }
//         }
//     };

//     const increaseCartQuantity = (rentalProductId) => {
//         if (cartTotalUnits >= maxUnits) {
//             toast.error(limitMessage);
//             return;
//         }

//         setCart((previous) =>
//             previous.map((c) => {
//                 if (c.rentalProductId !== rentalProductId) return c;

//                 const available = getAvailableQuantity(c.product);

//                 if (c.quantity >= available) {
//                     toast.error(`Only ${available} unit(s) available in stock.`);
//                     return c;
//                 }

//                 return { ...c, quantity: c.quantity + 1 };
//             })
//         );
//     };

//     const decreaseCartQuantity = (rentalProductId) => {
//         setCart((previous) =>
//             previous
//                 .map((c) =>
//                     c.rentalProductId === rentalProductId
//                         ? { ...c, quantity: c.quantity - 1 }
//                         : c
//                 )
//                 .filter((c) => c.quantity > 0)
//         );
//     };

//     const removeFromCart = (rentalProductId) => {
//         setCart((previous) => previous.filter((c) => c.rentalProductId !== rentalProductId));
//     };

//     const clearCart = () => {
//         setCart([]);
//         setRentalDurationType(customerType === "INDIVIDUAL" ? "DAYS" : "MONTHS");
//         setRentalDuration(customerType === "INDIVIDUAL" ? 1 : COMPANY_MIN_MONTHS);
//         setHandoverDescription("");
//         setDocuments({});
//         setDepositPaid(false);
//         setDepositAmountPaid(0);
//         setDepositPaymentMethod("CASH");
//         setDepositPaymentReference("");
//         setRentPaidNow(false);
//         setRentPaymentMethod("CASH");
//         setRentPaymentReference("");

//         setConditionPhotos({
//   FRONT: null,
//   BACK: null,
//   FULL: null
// });
//     };

//     const handleIndividualChange = (event) => {
//         const { name, value } = event.target;
//         setIndividualDetails((previous) => ({ ...previous, [name]: value }));
//     };

//     const handleCompanyChange = (event) => {
//         const { name, value } = event.target;
//         setCompanyDetails((previous) => ({ ...previous, [name]: value }));
//     };

//     const handleCustomerTypeChange = (type) => {
//         setCustomerType(type);
//         setDocuments({});

//         const minimum =
//             cart.length > 0
//                 ? Math.max(...cart.map((c) => getMinimumMonths(c.product)))
//                 : COMPANY_MIN_MONTHS;

//         if (type === "COMPANY") {
//             setRentalDurationType("MONTHS");
//             setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimum));
//         } else {
//             setRentalDurationType("DAYS");
//             setRentalDuration(1);

//             // Individual = sirf 1 laptop. Pehla laptop rakho, baaki hata do.
//             if (cartTotalUnits > MAX_UNITS_INDIVIDUAL) {
//                 setCart((previous) =>
//                     previous.slice(0, 1).map((c) => ({ ...c, quantity: 1 }))
//                 );

//                 toast.info("Individual customer can rent only 1 laptop. Extra laptops were removed.");
//             }
//         }
//     };

//     /* Highest minimum-months across every laptop currently in the cart */
//     const minimumMonths = useMemo(() => {
//         if (cart.length === 0) return COMPANY_MIN_MONTHS;
//         return Math.max(...cart.map((c) => getMinimumMonths(c.product)));
//     }, [cart]);

//     const decreaseDuration = () => {
//         setRentalDuration((previous) => {
//             const minimum =
//                 rentalDurationType === "MONTHS"
//                     ? Math.max(COMPANY_MIN_MONTHS, minimumMonths)
//                     : 1;
//             return Math.max(minimum, Number(previous) - 1);
//         });
//     };

//     const increaseDuration = () => {
//         setRentalDuration((previous) => Number(previous) + 1);
//     };

//     const handleDurationTypeChange = (event) => {
//         const type = event.target.value;

//         if (customerType === "COMPANY" && type === "DAYS") {
//             toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
//             return;
//         }

//         setRentalDurationType(type);

//         if (type === "DAYS") {
//             setRentalDuration(1);
//         } else {
//             setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimumMonths));
//         }
//     };

//     /* PRICING — computed per cart line, then totalled */
//     const pricing = useMemo(() => {
//         if (cart.length === 0) {
//             return {
//                 items: [],
//                 duration: rentalDuration,
//                 durationType: rentalDurationType,
//                 rentSubtotal: 0,
//                 gstAmount: 0,
//                 securityDeposit: 0,
//                 totalAmount: 0,
//                 installmentCount: 0,
//                 firstInstallmentTotal: 0,
//             };
//         }

//         const duration = Number(rentalDuration) || 1;

//         const items = cart.map((cartItem) => {
//             const monthlyRent = getMonthlyRent(cartItem.product);
//             const dailyRent = monthlyRent / 30;
//             const unitDeposit = getSecurityDeposit(cartItem.product);
//             const gstPercentage = getGST(cartItem.product);
//             const quantity = cartItem.quantity;

//             let lineRent =
//                 rentalDurationType === "DAYS"
//                     ? dailyRent * duration * quantity
//                     : monthlyRent * duration * quantity;

//             lineRent = Number(lineRent.toFixed(2));

//             const lineDeposit = Number((unitDeposit * quantity).toFixed(2));
//             const lineGst = Number(((lineRent * gstPercentage) / 100).toFixed(2));
//             const lineTotal = Number((lineRent + lineGst + lineDeposit).toFixed(2));

//             // Pehli installment: MONTHS = 1 mahine ka rent, DAYS = poora rent
//             const firstRent =
//                 rentalDurationType === "DAYS"
//                     ? lineRent
//                     : Number((monthlyRent * quantity).toFixed(2));

//             const firstGst = Number(((firstRent * gstPercentage) / 100).toFixed(2));

//             return {
//                 rentalProductId: cartItem.rentalProductId,
//                 productId: cartItem.productId,
//                 name: getProductName(cartItem.product),
//                 quantity,
//                 monthlyRent,
//                 dailyRent: Number(dailyRent.toFixed(2)),
//                 unitDeposit,
//                 gstPercentage,
//                 lineRent,
//                 lineGst,
//                 lineDeposit,
//                 lineTotal,
//                 firstInstallment: Number((firstRent + firstGst).toFixed(2)),
//             };
//         });

//         const rentSubtotal = Number(items.reduce((sum, i) => sum + i.lineRent, 0).toFixed(2));
//         const gstAmount = Number(items.reduce((sum, i) => sum + i.lineGst, 0).toFixed(2));
//         const securityDeposit = Number(
//             items.reduce((sum, i) => sum + i.lineDeposit, 0).toFixed(2)
//         );
//         const totalAmount = Number((rentSubtotal + gstAmount + securityDeposit).toFixed(2));
//         const firstInstallmentTotal = Number(
//             items.reduce((sum, i) => sum + i.firstInstallment, 0).toFixed(2)
//         );

//         return {
//             items,
//             duration,
//             durationType: rentalDurationType,
//             rentSubtotal,
//             gstAmount,
//             securityDeposit,
//             totalAmount,
//             installmentCount: rentalDurationType === "MONTHS" ? duration : 1,
//             firstInstallmentTotal,
//         };
//     }, [cart, rentalDuration, rentalDurationType]);

//     const depositStatus = useMemo(() => {
//         const expected = Number(pricing.securityDeposit || 0);
//         const paid = Number(depositAmountPaid || 0);

//         if (expected <= 0) return "PAID";
//         if (!depositPaid || paid <= 0) return "UNPAID";
//         if (paid >= expected) return "PAID";

//         return "PARTIAL";
//     }, [pricing.securityDeposit, depositAmountPaid, depositPaid]);

//     const depositBalance = useMemo(() => {
//         const expected = Number(pricing.securityDeposit || 0);
//         const paid = Number(depositAmountPaid || 0);

//         return Math.max(expected - paid, 0);
//     }, [pricing.securityDeposit, depositAmountPaid]);

//     const handleDepositPaidChange = (event) => {
//         const checked = event.target.checked;

//         setDepositPaid(checked);

//         if (checked) {
//             setDepositAmountPaid(Number(pricing.securityDeposit || 0));
//             setDepositPaymentMethod("CASH");
//         } else {
//             setDepositAmountPaid(0);
//             setDepositPaymentMethod("NONE");
//             setDepositPaymentReference("");
//         }
//     };

//     const handleDepositAmountChange = (event) => {
//         const value = event.target.value;

//         if (value === "") {
//             setDepositAmountPaid("");
//             return;
//         }

//         const amount = Number(value);

//         if (Number.isNaN(amount) || amount < 0) return;

//         setDepositAmountPaid(amount);
//     };

//     const handleRentPaidChange = (event) => {
//         const checked = event.target.checked;

//         setRentPaidNow(checked);

//         if (checked) {
//             setRentPaymentMethod("CASH");
//         } else {
//             setRentPaymentReference("");
//         }
//     };

//     /* VALIDATE FORM */
//     const validateForm = () => {
//         if (cart.length === 0) {
//             toast.error("Please select at least one rental laptop.");
//             return false;
//         }

//         if (cartTotalUnits > maxUnits) {
//             toast.error(limitMessage);
//             return false;
//         }

//         for (const cartItem of cart) {
//             const freshProduct =
//                 products.find((p) => getRentalProductId(p) === cartItem.rentalProductId) ||
//                 cartItem.product;

//             const availableStock = getAvailableQuantity(freshProduct);

//             if (availableStock <= 0) {
//                 toast.error(`${getProductName(freshProduct)} is out of stock.`);
//                 return false;
//             }

//             if (cartItem.quantity > availableStock) {
//                 toast.error(
//                     `Only ${availableStock} unit(s) of ${getProductName(freshProduct)} available.`
//                 );
//                 return false;
//             }
//         }

//         if (!["DAYS", "MONTHS"].includes(rentalDurationType)) {
//             toast.error("Please select a valid rental duration type.");
//             return false;
//         }

//         if (Number(rentalDuration) < 1) {
//             toast.error("Rental duration must be at least 1.");
//             return false;
//         }

//         if (customerType === "COMPANY") {
//             if (rentalDurationType !== "MONTHS") {
//                 toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
//                 return false;
//             }

//             if (Number(rentalDuration) < COMPANY_MIN_MONTHS) {
//                 toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
//                 return false;
//             }

//             if (Number(rentalDuration) < minimumMonths) {
//                 toast.error(`Minimum rental period is ${minimumMonths} months.`);
//                 return false;
//             }
//         }

//         if (customerType === "INDIVIDUAL") {
//             if (rentalDurationType === "MONTHS" && Number(rentalDuration) < minimumMonths) {
//                 toast.error(`Minimum rental period is ${minimumMonths} months.`);
//                 return false;
//             }

//             if (!individualDetails.fullName.trim()) {
//                 toast.error("Please enter customer name.");
//                 return false;
//             }

//             if (!individualDetails.phone.trim()) {
//                 toast.error("Please enter customer phone.");
//                 return false;
//             }
//         }

//         if (customerType === "COMPANY") {
//             if (!companyDetails.companyName.trim()) {
//                 toast.error("Please enter company name.");
//                 return false;
//             }

//             if (!companyDetails.contactPerson.trim()) {
//                 toast.error("Please enter contact person.");
//                 return false;
//             }

//             if (!companyDetails.phone.trim()) {
//                 toast.error("Please enter company phone.");
//                 return false;
//             }
//         }

//         const expectedDeposit = Number(pricing.securityDeposit || 0);
//         const paidDeposit = Number(depositAmountPaid || 0);

//         if (expectedDeposit > 0) {
//             if (depositPaid) {
//                 if (paidDeposit <= 0) {
//                     toast.error("Please enter the deposit amount paid.");
//                     return false;
//                 }

//                 if (paidDeposit > expectedDeposit) {
//                     toast.error(`Deposit paid cannot be more than ${money(expectedDeposit)}.`);
//                     return false;
//                 }

//                 if (
//                     !["CASH", "UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(
//                         depositPaymentMethod
//                     )
//                 ) {
//                     toast.error("Please select a valid deposit payment method.");
//                     return false;
//                 }

//                 if (
//                     ["UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(depositPaymentMethod) &&
//                     !depositPaymentReference.trim()
//                 ) {
//                     toast.error("Please enter payment reference / transaction number.");
//                     return false;
//                 }
//             } else {
//                 if (paidDeposit > 0) {
//                     toast.error("Please mark Deposit Paid if you are entering a paid amount.");
//                     return false;
//                 }
//             }
//         }

//         if (rentPaidNow) {
//             if (
//                 !["CASH", "UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(rentPaymentMethod)
//             ) {
//                 toast.error("Please select a valid rent payment method.");
//                 return false;
//             }

//             if (rentPaymentMethod !== "CASH" && !rentPaymentReference.trim()) {
//                 toast.error("Please enter rent payment reference / transaction number.");
//                 return false;
//             }
//         }

//         return true;
//     };

//     /* RESET */
//     const resetForm = () => {
//         setCart([]);
//         setSearch("");
//         setCustomerType("INDIVIDUAL");

//         setIndividualDetails({ ...EMPTY_INDIVIDUAL });
//         setCompanyDetails({ ...EMPTY_COMPANY });

//         setRentalDurationType("DAYS");
//         setRentalDuration(1);

//         setHandoverDescription("");
//         setDocuments({});

//         setDepositPaid(false);
//         setDepositAmountPaid(0);
//         setDepositPaymentMethod("CASH");
//         setDepositPaymentReference("");

//         setRentPaidNow(false);
//         setRentPaymentMethod("CASH");
//         setRentPaymentReference("");
//         setConditionPhotos({
//   FRONT: null,
//   BACK: null,
//   FULL: null
// });
//     };

//     /* SUBMIT — ek hi API call me poora order. 
//        Backend har laptop ka alag rental + month-wise rent schedule banata hai. */
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (submitting) return;
//         if (!validateForm()) return;
//         if (!validateDocuments()) return;
//         if (!validateConditionPhotos()) return;

//         try {
//             setSubmitting(true);

//             const totalDeposit = Number(pricing.securityDeposit || 0);
//             const paidDeposit = depositPaid ? Number(depositAmountPaid || 0) : 0;

//             const payload = {
//                 rentalSource: "WALK_IN",
//                 customerType,

//                 items: cart.map((c) => ({
//                     rentalProductId: c.rentalProductId,
//                     quantity: c.quantity,
//                 })),

//                 individualDetails:
//                     customerType === "INDIVIDUAL"
//                         ? {
//                             fullName: individualDetails.fullName.trim(),
//                             phone: individualDetails.phone.trim(),
//                             email: individualDetails.email.trim().toLowerCase(),
//                             address: individualDetails.address.trim(),
//                         }
//                         : undefined,

//                 companyDetails:
//                     customerType === "COMPANY"
//                         ? {
//                             companyName: companyDetails.companyName.trim(),
//                             contactPerson: companyDetails.contactPerson.trim(),
//                             phone: companyDetails.phone.trim(),
//                             email: companyDetails.email.trim().toLowerCase(),
//                             officeAddress: companyDetails.officeAddress.trim(),
//                             gstNumber: companyDetails.gstNumber.trim().toUpperCase(),
//                         }
//                         : undefined,

//                 rentalDurationType,
//                 rentalDuration: Number(pricing.duration),

//                 // Deposit (poore order ka total — backend laptops me baant deta hai)
//                 depositAmountPaid: paidDeposit,
//                 depositPaymentMethod: paidDeposit > 0 ? depositPaymentMethod : "NONE",
//                 depositPaymentReference: paidDeposit > 0 ? depositPaymentReference.trim() : "",

//                 // Pehli rent installment abhi li ya nahi
//                 rentPaidNow,
//                 rentPaymentMethod: rentPaidNow ? rentPaymentMethod : "",
//                 rentPaymentReference: rentPaidNow ? rentPaymentReference.trim() : "",

//                 notes: handoverDescription.trim(),
//                 handoverNotes: handoverDescription.trim(),
//             };

//             const response = await createWalkInRentalRequest(payload);

//             console.log("WALK-IN CREATE RESPONSE (full):", response);

//             // const { rentals: createdRentals, warnings } = extractCreatedOrder(response);

//             // if (createdRentals.length === 0) {
//             //     console.warn("WALK-IN CREATE: rentals not found in response:", response);

//             //     toast.warning(
//             //         "Rental was created, but its details could not be read from the server response. " +
//             //         "Documents were NOT uploaded - open the rental and upload them from there."
//             //     );

//             //     await loadProducts(true);
//             //     navigate("/receptionist-dashboard/rental/orders");
//             //     return;
//             // }

           
// console.log(
//     "WALK-IN CREATE RESPONSE (JSON):",
//     JSON.stringify(response, null, 2)
// );

// // const extractCreatedOrderSafe = (res) => {
// //     const candidates = [
// //         res?.data,
// //         res?.data?.data,
// //         res?.data?.rental,
// //         res?.data?.data?.rental,
// //         res?.data?.rentals,
// //         res?.data?.data?.rentals,
// //         res?.rental,
// //         res?.rentals,
// //         res,
// //     ];

// //     for (const candidate of candidates) {
// //         if (Array.isArray(candidate)) {
// //             const validRentals = candidate.filter(
// //                 (item) => item && (item._id || item.id)
// //             );

// //             if (validRentals.length) {
// //                 return validRentals;
// //             }
// //         }

// //         if (candidate && typeof candidate === "object") {
// //             if (candidate._id || candidate.id) {
// //                 return [candidate];
// //             }

// //             if (Array.isArray(candidate.rentals)) {
// //                 const validRentals = candidate.rentals.filter(
// //                     (item) => item && (item._id || item.id)
// //                 );

// //                 if (validRentals.length) {
// //                     return validRentals;
// //                 }
// //             }
// //         }
// //     }

// //     return [];
// // };



// const extractCreatedOrderSafe = (response) => {
//   const queue = [response];
//   const visited = new Set();

//   for (let depth = 0; depth < 8 && queue.length; depth++) {
//     const next = [];

//     for (const node of queue) {
//       if (!node || typeof node !== "object" || visited.has(node)) {
//         continue;
//       }

//       visited.add(node);

//       // Backend: { orderId, rentals: [...] }
//       if (Array.isArray(node.rentals)) {
//         const validRentals = node.rentals.filter(
//           (rental) =>
//             rental &&
//             typeof rental === "object" &&
//             (rental._id || rental.id)
//         );

//         if (validRentals.length > 0) {
//           return validRentals;
//         }
//       }

//       // Backend: { rental: {...} }
//       if (
//         node.rental &&
//         typeof node.rental === "object" &&
//         (node.rental._id || node.rental.id)
//       ) {
//         return [node.rental];
//       }

//       // Direct rental object
//       if (
//         (node._id || node.id) &&
//         (node.rentalNumber ||
//           node.rentalProductId ||
//           node.customerType ||
//           node.orderId)
//       ) {
//         return [node];
//       }

//       // Search common response wrappers
//       for (const key of [
//         "data",
//         "result",
//         "payload",
//         "response",
//         "body",
//       ]) {
//         if (node[key] && typeof node[key] === "object") {
//           next.push(node[key]);
//         }
//       }
//     }

//     queue.push(...next);
//   }

//   return [];
// };

// const createdRentals = extractCreatedOrderSafe(response);


// const warnings =
//   response?.data?.warnings ||
//   response?.data?.data?.warnings ||
//   response?.warnings ||
//   [];

// console.log("EXTRACTED CREATED RENTALS:", createdRentals);
// console.log(
//   "EXTRACTED RENTAL IDS:",
//   createdRentals.map((rental) => rental._id || rental.id)
// );

// if (createdRentals.length === 0) {
//   console.error(
//     "Rental response does not contain a recognizable rental ID:",
//     response
//   );

//   toast.error(
//     "Rental ID response mein nahi mili. Backend response aur database insert check karein."
//   );

//   await loadProducts(true);
//   return;
// }
// // const warnings = response?.warnings || response?.data?.warnings || [];

// // console.log("EXTRACTED CREATED RENTALS:", createdRentals);

// // if (createdRentals.length === 0) {
// //     console.error(
// //         "Rental response does not contain a recognizable rental ID:",
// //         response
// //     );

// //     toast.error(
// //         "Rental create response mein rental ID nahi mili. Console mein response check karein."
// //     );

// //     await loadProducts(true);
// //     return;
// // }



//             /* SECURITY DEPOSIT PAYMENT RECORD for each rental unit */
//             let anyDepositPaymentFailed = false;

//             for (const rental of createdRentals) {
//                 const allocated = Number(rental?.depositAmountPaid || 0);

//                 if (allocated <= 0) continue;

//                 try {
//                     const databasePaymentMethod =
//                         depositPaymentMethod === "BANK_TRANSFER"
//                             ? "NET_BANKING"
//                             : depositPaymentMethod === "ONLINE"
//                                 ? "UPI"
//                                 : depositPaymentMethod;

//                     const paymentResponse = await createPayment({
//                         paymentFor: "RENTAL",
//                         paymentType: "SECURITY_DEPOSIT",
//                         referenceId: rental._id,
//                         amount: allocated,
//                         paymentMethod: databasePaymentMethod,
//                         paymentStatus: "SUCCESS",
//                         paymentDate: new Date().toISOString(),
//                         paidAt: new Date().toISOString(),
//                         gateway: "",
//                         transactionId: depositPaymentReference.trim(),
//                         gatewayPaymentId: "",
//                     });

//                     if (!paymentResponse?.success || !paymentResponse?.payment) {
//                         throw new Error(
//                             paymentResponse?.message ||
//                             "Security deposit payment record could not be created."
//                         );
//                     }
//                 } catch (paymentError) {
//                     console.error("DEPOSIT PAYMENT RECORD ERROR:", paymentError);
//                     anyDepositPaymentFailed = true;
//                 }
//             }

//             /* DOCUMENTS — sirf pehle rental par; backend baaki laptops par copy karta hai */
//             let documentsFailed = false;

//             try {
//                 // await uploadAllDocuments(createdRentals[0]._id || createdRentals[0].id);

//              const firstRentalId =
//   createdRentals[0]?._id || createdRentals[0]?.id;

// if (!firstRentalId) {
//   throw new Error("Created rental ka database ID nahi mila.");
// }

// await uploadAllDocuments(String(firstRentalId));

// // One rental unit: upload three condition photos.
// if (createdRentals.length === 1) {
//   await uploadConditionPhotos(String(firstRentalId));
// }

//             } catch (documentError) {
//                 console.error("UPLOAD RENTAL DOCUMENTS ERROR:", documentError);
//                 documentsFailed = true;
//             }

//             if (anyDepositPaymentFailed) {
//                 toast.warning(
//                     "Rentals created, but some deposit payment records could not be saved."
//                 );
//             }

//             if (documentsFailed) {
//                 toast.warning(
//                     "Rentals created, but documents could not be uploaded. Please upload them again from rental details."
//                 );
//             }

//             warnings.forEach((warning) => toast.warning(warning));

//             let successMessage =
//                 createdRentals.length > 1
//                     ? `${createdRentals.length} rentals created successfully.`
//                     : "Rental created successfully.";

//             if (totalDeposit > 0) {
//                 if (paidDeposit >= totalDeposit) {
//                     successMessage += ` Deposit ${money(paidDeposit)} received.`;
//                 } else if (paidDeposit > 0) {
//                     successMessage += ` Partial deposit ${money(paidDeposit)} received.`;
//                 } else {
//                     successMessage += " Deposit is unpaid.";
//                 }
//             }

//             if (rentPaidNow) {
//                 successMessage += ` First rent ${money(pricing.firstInstallmentTotal)} received.`;
//             }

//             toast.success(successMessage);

//             await loadProducts(true);

//             navigate("/receptionist-dashboard/rental/orders", {
//                 state: {
//                     rentals: createdRentals,
//                 },
//             });
//         } catch (error) {
//             console.error("CREATE WALK-IN RENTAL ERROR:", error);

//             const message =
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.message ||
//                 "Failed to create walk-in rental.";

//             toast.error(message);

//             // Stock badal gaya ho sakta hai — taaza stock dikhao
//             loadProducts(true);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleBack = () => {
//         navigate("/receptionist-dashboard");
//     };

//     if (loading) {
//         return (
//             <div className="wir-loading-page">
//                 <FaSpinner className="wir-spin" />
//                 <h2>Loading rental laptops...</h2>
//                 <p>Please wait while rental inventory is loaded.</p>
//             </div>
//         );
//     }

//     const limitReached = cartTotalUnits >= maxUnits;

//     return (
//         <div className="wir-page">
//             <header className="wir-header">
//                 <div className="wir-header-left">
//                     <button type="button" className="wir-back-btn" onClick={handleBack}>
//                         <FaArrowLeft />
//                         Back
//                     </button>

//                     <div>
//                         <h1 className="wir-header-title">Walk-In Rental</h1>
//                         <p className="wir-header-subtitle">Create rental for walk-in customer</p>
//                     </div>
//                 </div>

//                 <div className="wir-source-badge">
//                     <FaLaptop />
//                     WALK-IN RENTAL
//                 </div>
//             </header>

//             <form className="wir-form" onSubmit={handleSubmit}>
//                 {/* CUSTOMER TYPE */}
//                 <section className="wir-card wir-customer-type-section">
//                     <div className="wir-section-title">
//                         <FaUser />
//                         <div>
//                             <h2>Customer Type</h2>
//                             <p>Select individual or company customer</p>
//                         </div>
//                     </div>

//                     <div className="wir-customer-type-grid">
//                         <button
//                             type="button"
//                             className={
//                                 customerType === "INDIVIDUAL"
//                                     ? "wir-type-card wir-type-card-active"
//                                     : "wir-type-card"
//                             }
//                             onClick={() => handleCustomerTypeChange("INDIVIDUAL")}
//                         >
//                             <FaUser size={26} />
//                             <strong>Individual</strong>
//                             <span>1 laptop only</span>
//                         </button>

//                         <button
//                             type="button"
//                             className={
//                                 customerType === "COMPANY"
//                                     ? "wir-type-card wir-type-card-active"
//                                     : "wir-type-card"
//                             }
//                             onClick={() => handleCustomerTypeChange("COMPANY")}
//                         >
//                             <FaBuilding size={26} />
//                             <strong>Company</strong>
//                             <span>
//                                 Up to {MAX_UNITS_COMPANY} laptops • min {COMPANY_MIN_MONTHS} months
//                             </span>
//                         </button>
//                     </div>
//                 </section>

//                 {/* RENTAL PRODUCT — multi-select with per-card quantity */}
//                 <section className="wir-card">
//                     <div className="wir-section-title">
//                         <FaLaptop />
//                         <div>
//                             <h2>Select Rental Laptops</h2>
//                             <p>
//                                 {customerType === "COMPANY"
//                                     ? `Add up to ${MAX_UNITS_COMPANY} laptops in total — selected ${cartTotalUnits}/${MAX_UNITS_COMPANY}`
//                                     : "Individual customer can rent only 1 laptop"}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="wir-search-box">
//                         <FaSearch />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(event) => setSearch(event.target.value)}
//                             placeholder="Search laptop, brand or SKU..."
//                         />

//                         {search && (
//                             <button type="button" onClick={() => setSearch("")}>
//                                 <FaTimes />
//                             </button>
//                         )}
//                     </div>

//                     <div className="wir-refresh-row">
//                         <button
//                             type="button"
//                             className="wir-cancel-btn"
//                             onClick={() => loadProducts(true)}
//                             disabled={refreshing}
//                         >
//                             <FaRedo className={refreshing ? "wir-spin" : ""} />
//                             {refreshing ? "Refreshing..." : "Refresh Stock"}
//                         </button>
//                     </div>

//                     {filteredProducts.length === 0 ? (
//                         <div className="wir-empty-products">
//                             <FaLaptop size={42} />
//                             <h3>{search ? "No rental laptop found" : "No rental laptops available"}</h3>
//                             <p>
//                                 {search
//                                     ? "Try another laptop name, brand or SKU."
//                                     : "Please add rental products from admin panel."}
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="wir-product-grid">
//                             {filteredProducts.map((item) => {
//                                 const rentalId = getRentalProductId(item);
//                                 const image = getImageUrl(item);
//                                 const name = getProductName(item);
//                                 const brand = getBrand(item);
//                                 const sku = getSku(item);
//                                 const rent = getMonthlyRent(item);
//                                 const deposit = getSecurityDeposit(item);
//                                 const available = getAvailableQuantity(item);
//                                 const minimum = getMinimumMonths(item);
//                                 const inCartQuantity = getCartQuantity(rentalId);

//                                 return (
//                                     <article
//                                         key={rentalId}
//                                         className={
//                                             inCartQuantity > 0
//                                                 ? "wir-product-card wir-product-card-selected"
//                                                 : "wir-product-card"
//                                         }
//                                     >
//                                         <div className="wir-product-image">
//                                             {image ? (
//                                                 <img
//                                                     src={image}
//                                                     alt={name}
//                                                     onError={(event) => {
//                                                         event.currentTarget.style.display = "none";
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <FaLaptop size={30} />
//                                             )}
//                                         </div>

//                                         <div className="wir-product-info">
//                                             <span className="wir-product-brand">{brand || "Laptop"}</span>
//                                             <h3>{name}</h3>
//                                             <span className="wir-product-sku">SKU: {sku}</span>

//                                             <div className="wir-product-prices">
//                                                 <span>Rent: {money(rent)} / month</span>
//                                                 <span>Deposit: {money(deposit)}</span>
//                                                 <span>Minimum: {minimum} months</span>
//                                             </div>

//                                             <span
//                                                 className={
//                                                     available > 0
//                                                         ? "wir-stock wir-stock-available"
//                                                         : "wir-stock wir-stock-unavailable"
//                                                 }
//                                             >
//                                                 {available > 0 ? `${available} Available` : "Out of Stock"}
//                                             </span>

//                                             {inCartQuantity > 0 ? (
//                                                 <div className="wir-stepper wir-product-stepper">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => decreaseCartQuantity(rentalId)}
//                                                     >
//                                                         <FaMinus />
//                                                     </button>

//                                                     <div className="wir-stepper-value">
//                                                         <strong>{inCartQuantity}</strong>
//                                                         <span>unit{inCartQuantity > 1 ? "s" : ""}</span>
//                                                     </div>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() => increaseCartQuantity(rentalId)}
//                                                         disabled={inCartQuantity >= available || limitReached}
//                                                     >
//                                                         <FaPlus />
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <button
//                                                     type="button"
//                                                     className="wir-submit-btn wir-product-select-btn"
//                                                     onClick={() => addToCart(item)}
//                                                     disabled={available <= 0 || limitReached}
//                                                     title={limitReached ? limitMessage : ""}
//                                                 >
//                                                     <FaShoppingCart />
//                                                     Add to Order
//                                                 </button>
//                                             )}
//                                         </div>

//                                         {inCartQuantity > 0 && (
//                                             <FaCheckCircle className="wir-selected-check" />
//                                         )}
//                                     </article>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </section>

//                 {cart.length > 0 && (
//                     <>
//                         {/* SELECTED LAPTOPS */}
//                         <section className="wir-card">
//                             <div className="wir-section-title">
//                                 <FaCheckCircle />
//                                 <div>
//                                     <h2>Selected Laptops</h2>
//                                     <p>
//                                         {cart.length} laptop type(s) • {cartTotalUnits} of {maxUnits} unit(s)
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="wir-cart-list">
//                                 {cart.map((cartItem) => {
//                                     const available = getAvailableQuantity(cartItem.product);

//                                     return (
//                                         <div key={cartItem.rentalProductId} className="wir-cart-item">
//                                             <div className="wir-cart-item-info">
//                                                 <strong>{getProductName(cartItem.product)}</strong>
//                                                 <span>
//                                                     {getBrand(cartItem.product)} • SKU:{" "}
//                                                     {getSku(cartItem.product)}
//                                                 </span>
//                                             </div>

//                                             <div className="wir-cart-item-actions">
//                                                 <div className="wir-stepper">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             decreaseCartQuantity(cartItem.rentalProductId)
//                                                         }
//                                                     >
//                                                         <FaMinus />
//                                                     </button>

//                                                     <div className="wir-stepper-value">
//                                                         <strong>{cartItem.quantity}</strong>
//                                                         <span>unit{cartItem.quantity > 1 ? "s" : ""}</span>
//                                                     </div>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             increaseCartQuantity(cartItem.rentalProductId)
//                                                         }
//                                                         disabled={cartItem.quantity >= available || limitReached}
//                                                     >
//                                                         <FaPlus />
//                                                     </button>
//                                                 </div>

//                                                 <button
//                                                     type="button"
//                                                     className="wir-remove-cart-btn"
//                                                     onClick={() => removeFromCart(cartItem.rentalProductId)}
//                                                 >
//                                                     <FaTrashAlt />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             <button type="button" className="wir-cancel-btn" onClick={clearCart}>
//                                 <FaTimes />
//                                 Clear All
//                             </button>
//                         </section>

//                         {/* CUSTOMER DETAILS */}
//                         <section className="wir-card wir-customer-details-section">
//                             <div className="wir-section-title">
//                                 {customerType === "INDIVIDUAL" ? <FaUser /> : <FaBuilding />}
//                                 <div>
//                                     <h2>Customer Details</h2>
//                                     <p>Enter walk-in customer information</p>
//                                 </div>
//                             </div>

//                             {customerType === "INDIVIDUAL" && (
//                                 <div className="wir-form-grid wir-customer-form-grid">
//                                     <div className="wir-form-group">
//                                         <label>Full Name *</label>
//                                         <div className="wir-input-icon">
//                                             <FaUser />
//                                             <input
//                                                 type="text"
//                                                 name="fullName"
//                                                 value={individualDetails.fullName}
//                                                 onChange={handleIndividualChange}
//                                                 placeholder="Enter customer full name"
//                                                 autoComplete="name"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>Phone *</label>
//                                         <div className="wir-input-icon">
//                                             <FaPhone />
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={individualDetails.phone}
//                                                 onChange={handleIndividualChange}
//                                                 placeholder="Enter phone number"
//                                                 autoComplete="tel"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>Email</label>
//                                         <div className="wir-input-icon">
//                                             <FaEnvelope />
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={individualDetails.email}
//                                                 onChange={handleIndividualChange}
//                                                 placeholder="customer@email.com"
//                                                 autoComplete="email"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group wir-form-group-full">
//                                         <label>Address</label>
//                                         <div className="wir-input-icon wir-textarea-icon">
//                                             <FaMapMarkerAlt />
//                                             <textarea
//                                                 name="address"
//                                                 value={individualDetails.address}
//                                                 onChange={handleIndividualChange}
//                                                 placeholder="Enter customer address"
//                                                 rows={4}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {customerType === "COMPANY" && (
//                                 <div className="wir-form-grid wir-customer-form-grid">
//                                     <div className="wir-form-group">
//                                         <label>Company Name *</label>
//                                         <div className="wir-input-icon">
//                                             <FaBuilding />
//                                             <input
//                                                 type="text"
//                                                 name="companyName"
//                                                 value={companyDetails.companyName}
//                                                 onChange={handleCompanyChange}
//                                                 placeholder="Enter company name"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>Contact Person *</label>
//                                         <div className="wir-input-icon">
//                                             <FaUser />
//                                             <input
//                                                 type="text"
//                                                 name="contactPerson"
//                                                 value={companyDetails.contactPerson}
//                                                 onChange={handleCompanyChange}
//                                                 placeholder="Enter contact person"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>Phone *</label>
//                                         <div className="wir-input-icon">
//                                             <FaPhone />
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={companyDetails.phone}
//                                                 onChange={handleCompanyChange}
//                                                 placeholder="Enter company phone"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>Email</label>
//                                         <div className="wir-input-icon">
//                                             <FaEnvelope />
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={companyDetails.email}
//                                                 onChange={handleCompanyChange}
//                                                 placeholder="company@email.com"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="wir-form-group">
//                                         <label>GST Number</label>
//                                         <input
//                                             type="text"
//                                             name="gstNumber"
//                                             value={companyDetails.gstNumber}
//                                             onChange={handleCompanyChange}
//                                             placeholder="GST number"
//                                         />
//                                     </div>

//                                     <div className="wir-form-group wir-form-group-full">
//                                         <label>Office Address</label>
//                                         <div className="wir-input-icon wir-textarea-icon">
//                                             <FaMapMarkerAlt />
//                                             <textarea
//                                                 name="officeAddress"
//                                                 value={companyDetails.officeAddress}
//                                                 onChange={handleCompanyChange}
//                                                 placeholder="Enter office address"
//                                                 rows={4}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </section>

//                         {/* DOCUMENTS */}
//                         <section className="wir-card wir-documents-section">
//                             <div className="wir-section-title">
//                                 <FaShieldAlt />
//                                 <div>
//                                     <h2>Customer Documents</h2>
//                                     <p>Upload required documents for this rental</p>
//                                 </div>
//                             </div>

//                             <div className="wir-document-grid">
//                                 {currentDocuments.map((documentConfig) => {
//                                     const selectedFile = documents[documentConfig.key];

//                                     return (
//                                         <div key={documentConfig.key} className="wir-document-card">
//                                             <div className="wir-document-header">
//                                                 <strong>{documentConfig.label}</strong>
//                                                 <span>Required *</span>
//                                             </div>

//                                             {documentConfig.isOfficeOrCollege && (
//                                                 <div className="wir-doc-type-toggle">
//                                                     <button
//                                                         type="button"
//                                                         className={
//                                                             officeOrCollegeType === "OFFICE_ID"
//                                                                 ? "wir-doc-type-btn wir-doc-type-btn-active"
//                                                                 : "wir-doc-type-btn"
//                                                         }
//                                                         onClick={() => setOfficeOrCollegeType("OFFICE_ID")}
//                                                     >
//                                                         Office ID
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         className={
//                                                             officeOrCollegeType === "COLLEGE_ID"
//                                                                 ? "wir-doc-type-btn wir-doc-type-btn-active"
//                                                                 : "wir-doc-type-btn"
//                                                         }
//                                                         onClick={() => setOfficeOrCollegeType("COLLEGE_ID")}
//                                                     >
//                                                         College ID
//                                                     </button>
//                                                 </div>
//                                             )}

//                                             <label className="wir-document-file-label">
//                                                 <input
//                                                     type="file"
//                                                     accept={documentConfig.accept}
//                                                     onChange={(event) =>
//                                                         handleDocumentChange(documentConfig.key, event)
//                                                     }
//                                                 />
//                                                 <span>{selectedFile ? selectedFile.name : "Choose document"}</span>
//                                             </label>

//                                             {selectedFile && (
//                                                 <div className="wir-document-selected">
//                                                     <FaCheckCircle />
//                                                     <span>{selectedFile.name}</span>

//                                                     <button
//                                                         type="button"
//                                                         className="wir-document-remove-btn"
//                                                         onClick={() => {
//                                                             setDocuments((previous) => {
//                                                                 const next = { ...previous };
//                                                                 delete next[documentConfig.key];
//                                                                 return next;
//                                                             });
//                                                         }}
//                                                     >
//                                                         <FaTimes />
//                                                     </button>
//                                                 </div>
//                                             )}

//                                             <small>JPG, PNG, WEBP or PDF • Max 10 MB</small>
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             <div className="wir-document-note">
//                                 <FaShieldAlt />
//                                 <span>
//                                     These documents are uploaded once and are attached automatically to
//                                     every laptop rental in this order.
//                                 </span>
//                             </div>
//                         </section>


                        
// {/* ================================================
//     LAPTOP CONDITION PHOTOS
// ================================================ */}

// <section className="wir-card wir-condition-section">
//   <div className="wir-condition-heading">
//     <h3>Laptop Condition Photos</h3>
//     <p>
//       Upload Front, Back and Full Image of the
//       laptop before handover.
//     </p>
//   </div>

//   <div className="wir-condition-grid">
//     {PHOTO_SIDES.map(({ key, label }) => {
//       const file = conditionPhotos[key];

//       return (
//         <div
//           className="wir-condition-card"
//           key={key}
//         >
//           <div className="wir-condition-card-title">
//             <strong>{label}</strong>
//             <span>Required</span>
//           </div>

//           {file ? (
//             <img
//               src={URL.createObjectURL(file)}
//               alt={label}
//               className="wir-condition-preview"
//               onLoad={(event) => {
//                 URL.revokeObjectURL(
//                   event.currentTarget.src
//                 );
//               }}
//             />
//           ) : (
//             <div className="wir-condition-placeholder">
//               <span>📷</span>
//               <p>No image selected</p>
//             </div>
//           )}

//           <label className="wir-condition-upload">
//             {file ? "Change Image" : "Choose Image"}

//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={(event) =>
//                 handleConditionPhotoChange(key, event)
//               }
//               hidden
//             />
//           </label>

//           {file && (
//             <div className="wir-condition-file">
//               <span title={file.name}>
//                 {file.name}
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setConditionPhotos((previous) => ({
//                     ...previous,
//                     [key]: null
//                   }))
//                 }
//               >
//                 Remove
//               </button>
//             </div>
//           )}
//         </div>
//       );
//     })}
//   </div>

//   <p className="wir-condition-note">
//     JPG, PNG or WEBP only. Maximum 5 MB per image.
//     All three images are required.
//   </p>
// </section>


//                         {/* RENTAL PERIOD */}
//                         <section className="wir-card">
//                             <div className="wir-section-title">
//                                 <FaCalendarAlt />
//                                 <div>
//                                     <h2>Rental Period</h2>
//                                     <p>Applies to the whole order</p>
//                                 </div>
//                             </div>

                         
// <div className="wir-form-grid">

//     {/* ============================================
//         DURATION TYPE - MONTHS ONLY
//     ============================================ */}

//     <div className="wir-form-group">
//         <label>Duration Type</label>

//         <select
//             className="wir-duration-select"
//             value="MONTHS"
//             disabled
//         >
//             <option value="MONTHS">Months</option>
//         </select>

//         <small>
//             {customerType === "INDIVIDUAL"
//                 ? "Individual rental minimum is 3 months (compulsory)."
//                 : "Company rental minimum is 3 months (compulsory)."}
//         </small>
//     </div>

//     {/* ============================================
//         MINIMUM RENTAL
//     ============================================ */}

//     <div className="wir-form-group">
//         <label>Minimum Rental</label>

//         <input
//             type="text"
//             value={`${Math.max(3, minimumMonths || 3)} months`}
//             readOnly
//         />

//         <small>
//             Minimum rental period is 3 months.
//         </small>
//     </div>

//     {/* ============================================
//         RENTAL DURATION STEPPER
//     ============================================ */}

//     <div className="wir-form-group">
//         <label>Rental Duration</label>

//         <div className="wir-stepper">

//             <button
//                 type="button"
//                 onClick={decreaseDuration}
//                 disabled={
//                     rentalDuration <=
//                     Math.max(3, minimumMonths || 3)
//                 }
//             >
//                 <FaMinus />
//             </button>

//             <div className="wir-stepper-value">
//                 <strong>{rentalDuration}</strong>
//                 <span>months</span>
//             </div>

//             <button
//                 type="button"
//                 onClick={increaseDuration}
//             >
//                 <FaPlus />
//             </button>

//         </div>

//         <small>
//             Rental duration cannot be less than 3 months.
//         </small>
//     </div>

//     {/* ============================================
//         HANDOVER / RENTAL NOTES
//     ============================================ */}

//     <div className="wir-form-group wir-form-group-full">
//         <label>Handover / Notes</label>

//         <textarea
//             value={handoverDescription}
//             onChange={(event) =>
//                 setHandoverDescription(event.target.value)
//             }
//             placeholder="Enter laptop condition, accessories, charger, bag or other handover notes..."
//             rows={4}
//         />

//         <small>
//             These notes will be saved with every rental in this order.
//         </small>
//     </div>

// </div>

//                         </section>

//                         {/* DEPOSIT PAYMENT */}
//                         <section className="wir-card wir-deposit-section">
//                             <div className="wir-section-title">
//                                 <FaShieldAlt />
//                                 <div>
//                                     <h2>Security Deposit Payment</h2>
//                                     <p>Record whether the total security deposit was received</p>
//                                 </div>
//                             </div>

//                             <div className="wir-deposit-box">
//                                 <div className="wir-deposit-header">
//                                     <div>
//                                         <span className="wir-deposit-label">
//                                             Required Security Deposit (all units)
//                                         </span>
//                                         <strong>{money(pricing.securityDeposit)}</strong>
//                                     </div>

//                                     <div className={`wir-deposit-badge wir-deposit-badge-${depositStatus.toLowerCase()}`}>
//                                         {depositStatus}
//                                     </div>
//                                 </div>

//                                 <label className="wir-deposit-checkbox">
//                                     <input
//                                         type="checkbox"
//                                         checked={depositPaid}
//                                         onChange={handleDepositPaidChange}
//                                     />
//                                     <span className="wir-custom-checkbox">
//                                         {depositPaid && <FaCheckCircle />}
//                                     </span>
//                                     <div>
//                                         <strong>Deposit Paid</strong>
//                                         <small>Tick this only when customer has actually paid the deposit.</small>
//                                     </div>
//                                 </label>

//                                 {depositPaid && (
//                                     <div className="wir-form-grid wir-deposit-grid">
//                                         <div className="wir-form-group">
//                                             <label>Deposit Amount Paid *</label>
//                                             <div className="wir-input-icon">
//                                                 <FaRupeeSign />
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     step="0.01"
//                                                     value={depositAmountPaid}
//                                                     onChange={handleDepositAmountChange}
//                                                     placeholder="Enter amount"
//                                                 />
//                                             </div>
//                                             {depositBalance > 0 && (
//                                                 <small>Remaining deposit: {money(depositBalance)}</small>
//                                             )}
//                                         </div>

//                                         <div className="wir-form-group">
//                                             <label>Payment Method *</label>
//                                             <div className="wir-input-icon">
//                                                 {depositPaymentMethod === "CASH" && <FaMoneyBillWave />}
//                                                 {depositPaymentMethod === "UPI" && <FaCreditCard />}
//                                                 {depositPaymentMethod === "CARD" && <FaCreditCard />}
//                                                 {depositPaymentMethod === "BANK_TRANSFER" && <FaUniversity />}
//                                                 {depositPaymentMethod === "ONLINE" && <FaCreditCard />}

//                                                 <select
//                                                     value={depositPaymentMethod}
//                                                     onChange={(event) =>
//                                                         setDepositPaymentMethod(event.target.value)
//                                                     }
//                                                 >
//                                                     <option value="CASH">Cash</option>
//                                                     <option value="UPI">UPI</option>
//                                                     <option value="CARD">Card</option>
//                                                     <option value="BANK_TRANSFER">Bank Transfer</option>
//                                                     <option value="ONLINE">Online</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="wir-form-group wir-form-group-full">
//                                             <label>
//                                                 Transaction / Payment Reference
//                                                 {depositPaymentMethod !== "CASH" ? " *" : ""}
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={depositPaymentReference}
//                                                 onChange={(event) =>
//                                                     setDepositPaymentReference(event.target.value)
//                                                 }
//                                                 placeholder={
//                                                     depositPaymentMethod === "CASH"
//                                                         ? "Optional cash receipt/reference"
//                                                         : "Enter UPI / transaction / reference number"
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {!depositPaid && (
//                                     <div className="wir-deposit-unpaid-note">
//                                         <FaShieldAlt />
//                                         <div>
//                                             <strong>Deposit not received</strong>
//                                             <span>
//                                                 Rental can still be created. The deposit will be shown as unpaid and
//                                                 no refund will be calculated from an unpaid deposit.
//                                             </span>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {depositStatus === "PARTIAL" && (
//                                     <div className="wir-deposit-partial-note">
//                                         <FaShieldAlt />
//                                         <span>
//                                             Partial deposit received: <strong>{money(depositAmountPaid)}</strong> of{" "}
//                                             <strong>{money(pricing.securityDeposit)}</strong>
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* RENT PAYMENT (FIRST INSTALLMENT) */}
//                         <section className="wir-card wir-deposit-section">
//                             <div className="wir-section-title">
//                                 <FaRupeeSign />
//                                 <div>
//                                     <h2>Rent Payment</h2>
//                                     <p>
//                                         {rentalDurationType === "MONTHS"
//                                             ? `Rent is tracked month by month — ${pricing.installmentCount} installment(s)`
//                                             : "Rent for the whole period is one installment"}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="wir-deposit-box">
//                                 <div className="wir-deposit-header">
//                                     <div>
//                                         <span className="wir-deposit-label">
//                                             {rentalDurationType === "MONTHS"
//                                                 ? "First month rent (incl. GST, all units)"
//                                                 : "Total rent (incl. GST, all units)"}
//                                         </span>
//                                         <strong>{money(pricing.firstInstallmentTotal)}</strong>
//                                     </div>

//                                     <div
//                                         className={`wir-deposit-badge wir-deposit-badge-${
//                                             rentPaidNow ? "paid" : "unpaid"
//                                         }`}
//                                     >
//                                         {rentPaidNow ? "PAID" : "UNPAID"}
//                                     </div>
//                                 </div>

//                                 <label className="wir-deposit-checkbox">
//                                     <input
//                                         type="checkbox"
//                                         checked={rentPaidNow}
//                                         onChange={handleRentPaidChange}
//                                     />
//                                     <span className="wir-custom-checkbox">
//                                         {rentPaidNow && <FaCheckCircle />}
//                                     </span>
//                                     <div>
//                                         <strong>
//                                             {rentalDurationType === "MONTHS"
//                                                 ? "First Month Rent Paid"
//                                                 : "Rent Paid"}
//                                         </strong>
//                                         <small>
//                                             Tick only if the customer has paid it now. Next months can be
//                                             collected later from the rental's rent schedule.
//                                         </small>
//                                     </div>
//                                 </label>

//                                 {rentPaidNow && (
//                                     <div className="wir-form-grid wir-deposit-grid">
//                                         <div className="wir-form-group">
//                                             <label>Payment Method *</label>
//                                             <div className="wir-input-icon">
//                                                 <FaMoneyBillWave />
//                                                 <select
//                                                     value={rentPaymentMethod}
//                                                     onChange={(event) =>
//                                                         setRentPaymentMethod(event.target.value)
//                                                     }
//                                                 >
//                                                     <option value="CASH">Cash</option>
//                                                     <option value="UPI">UPI</option>
//                                                     <option value="CARD">Card</option>
//                                                     <option value="BANK_TRANSFER">Bank Transfer</option>
//                                                     <option value="ONLINE">Online</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="wir-form-group">
//                                             <label>
//                                                 Transaction / Payment Reference
//                                                 {rentPaymentMethod !== "CASH" ? " *" : ""}
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={rentPaymentReference}
//                                                 onChange={(event) =>
//                                                     setRentPaymentReference(event.target.value)
//                                                 }
//                                                 placeholder={
//                                                     rentPaymentMethod === "CASH"
//                                                         ? "Optional cash receipt/reference"
//                                                         : "Enter UPI / transaction / reference number"
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {!rentPaidNow && (
//                                     <div className="wir-deposit-unpaid-note">
//                                         <FaShieldAlt />
//                                         <div>
//                                             <strong>Rent not received yet</strong>
//                                             <span>
//                                                 The first installment will stay pending and show as due today in
//                                                 the rent schedule.
//                                             </span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* SUMMARY */}
//                         <section className="wir-card wir-summary-card">
//                             <div className="wir-section-title">
//                                 <FaRupeeSign />
//                                 <div>
//                                     <h2>Rental Summary</h2>
//                                     <p>Amount calculation</p>
//                                 </div>
//                             </div>

//                             <div className="wir-cart-summary-lines">
//                                 {pricing.items.map((item) => (
//                                     <div key={item.rentalProductId} className="wir-cart-summary-line">
//                                         <span>
//                                             {item.name} × {item.quantity}
//                                         </span>
//                                         <strong>{money(item.lineTotal)}</strong>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="wir-summary-lines">
//                                 <div>
//                                     <span>Rental Period</span>
//                                     <strong>
//                                         {pricing.duration} {rentalDurationType === "MONTHS" ? "months" : "days"}
//                                     </strong>
//                                 </div>

//                                 {rentalDurationType === "MONTHS" && (
//                                     <div>
//                                         <span>Monthly Installment (incl. GST)</span>
//                                         <strong>{money(pricing.firstInstallmentTotal)}</strong>
//                                     </div>
//                                 )}

//                                 <div>
//                                     <span>Rental Amount</span>
//                                     <strong>{money(pricing.rentSubtotal)}</strong>
//                                 </div>

//                                 <div>
//                                     <span>GST</span>
//                                     <strong>{money(pricing.gstAmount)}</strong>
//                                 </div>

//                                 <div>
//                                     <span>Security Deposit</span>
//                                     <strong>{money(pricing.securityDeposit)}</strong>
//                                 </div>

//                                 <div>
//                                     <span>Deposit Paid</span>
//                                     <strong
//                                         className={
//                                             depositStatus === "PAID"
//                                                 ? "wir-text-paid"
//                                                 : depositStatus === "PARTIAL"
//                                                     ? "wir-text-partial"
//                                                     : "wir-text-unpaid"
//                                         }
//                                     >
//                                         {money(depositAmountPaid)}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>Deposit Remaining</span>
//                                     <strong className={depositBalance > 0 ? "wir-text-partial" : "wir-text-paid"}>
//                                         {money(depositBalance)}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>Deposit Status</span>
//                                     <strong
//                                         className={
//                                             depositStatus === "PAID"
//                                                 ? "wir-text-paid"
//                                                 : depositStatus === "PARTIAL"
//                                                     ? "wir-text-partial"
//                                                     : "wir-text-unpaid"
//                                         }
//                                     >
//                                         {depositStatus}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>First Rent Installment</span>
//                                     <strong className={rentPaidNow ? "wir-text-paid" : "wir-text-unpaid"}>
//                                         {rentPaidNow ? "PAID" : "PENDING"}
//                                     </strong>
//                                 </div>

//                                 <div className="wir-summary-total">
//                                     <span>Total Payable</span>
//                                     <strong>{money(pricing.totalAmount)}</strong>
//                                 </div>
//                             </div>

//                             <div className="wir-submit-help">
//                                 <FaShieldAlt />
//                                 Security deposit is refundable according to rental return condition and actual
//                                 deposit received.
//                             </div>

//                             <div className="wir-submit-row">
//                                 <button
//                                     type="button"
//                                     className="wir-cancel-btn"
//                                     onClick={resetForm}
//                                     disabled={submitting}
//                                 >
//                                     <FaTimes />
//                                     Reset
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     className="wir-submit-btn"
//                                     disabled={submitting || cart.length === 0}
//                                 >
//                                     {submitting ? (
//                                         <>
//                                             <FaSpinner className="wir-spin" />
//                                             Creating Rental{cartTotalUnits > 1 ? "s" : ""}...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <FaCheckCircle />
//                                             Create Walk-In Rental
//                                             {cartTotalUnits > 1 ? ` (${cartTotalUnits} units)` : ""}
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </section>
//                     </>
//                 )}
//             </form>
//         </div>
//     );
// }

// export default WalkInRental;



import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaLaptop,
  FaMapMarkerAlt,
  FaMinus,
  FaPhone,
  FaPlus,
  FaRupeeSign,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaUser,
  FaTimes,
  FaRedo,
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaTrashAlt,
  FaShoppingCart,
} from "react-icons/fa";

import {
  getRentalProducts,
  createWalkInRentalRequest,
  uploadRentalDocument,
  uploadRentalConditionPhoto,
} from "../../../services/rentalApi";

import { createPayment } from "../../../services/paymentService";
import "./WalkInRental.css";

// ======================================================
// CONSTANTS
// ======================================================

const API = import.meta.env.VITE_API_URL || "";

const MIN_MONTHS = 3;
const MAX_UNITS_INDIVIDUAL = 1;
const MAX_UNITS_COMPANY = 10;
const DEFAULT_GST = 18;

const PHOTO_SIDES = [
  { key: "FRONT", label: "Front Image" },
  { key: "BACK", label: "Back Image" },
  { key: "FULL", label: "Full Image" },
];

const EMPTY_PHOTOS = () => ({
  FRONT: null,
  BACK: null,
  FULL: null,
});

const EMPTY_INDIVIDUAL = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
};

const EMPTY_COMPANY = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  officeAddress: "",
  gstNumber: "",
};

const DOCUMENT_CONFIG = {
  INDIVIDUAL: [
    {
      key: "PASSPORT_PHOTO",
      label: "Passport Size Photograph",
      accept: "image/*",
    },
    {
      key: "PAN_CARD",
      label: "PAN Card",
      accept: "image/*,.pdf",
    },
    {
      key: "AADHAAR_CARD",
      label: "Aadhaar Card",
      accept: "image/*,.pdf",
    },
    {
      key: "HOUSE_RENTAL_AGREEMENT",
      label: "House Rental Agreement",
      accept: "image/*,.pdf",
    },
    {
      key: "OFFICE_OR_COLLEGE_ID",
      label: "Office ID / College ID (any one)",
      accept: "image/*,.pdf",
      merged: true,
    },
  ],

  COMPANY: [
    {
      key: "PAN_CARD",
      label: "PAN Card",
      accept: "image/*,.pdf",
    },
    {
      key: "AADHAAR_CARD",
      label: "Authorized Person Aadhaar Card",
      accept: "image/*,.pdf",
    },
    {
      key: "GST_REGISTRATION",
      label: "GST Registration",
      accept: "image/*,.pdf",
    },
    {
      key: "OFFICE_ID",
      label: "Office ID",
      accept: "image/*,.pdf",
    },
    {
      key: "AUTHORIZATION_LETTER",
      label: "Authorization Letter",
      accept: "image/*,.pdf",
    },
  ],
};

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "ONLINE", label: "Online" },
];

// ======================================================
// HELPERS
// ======================================================

const round = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const firstArray = (response) =>
  [
    response,
    response?.data,
    response?.products,
    response?.data?.products,
    response?.data?.data,
    response?.data?.data?.products,
  ].find(Array.isArray) || [];

const productObject = (item) =>
  (item?.productId && typeof item.productId === "object"
    ? item.productId
    : null) ||
  (item?.product && typeof item.product === "object"
    ? item.product
    : null) ||
  item ||
  {};

const productId = (item) => {
  const product = productObject(item);

  return String(
    product?._id ||
      product?.id ||
      (typeof item?.productId === "string"
        ? item.productId
        : "") ||
      item?._id ||
      item?.id ||
      ""
  );
};

const rentalProductId = (item) =>
  String(
    (typeof item?.rentalProductId === "object"
      ? item?.rentalProductId?._id ||
        item?.rentalProductId?.id
      : item?.rentalProductId) ||
      item?.rentalProduct?._id ||
      item?.rentalProduct?.id ||
      item?._id ||
      item?.id ||
      ""
  );

const productName = (item) =>
  productObject(item)?.name ||
  productObject(item)?.title ||
  item?.name ||
  item?.productName ||
  "Rental Laptop";

const brandName = (item) => {
  const brand = productObject(item)?.brand || item?.brand;

  return typeof brand === "object"
    ? brand?.name || brand?.title || ""
    : brand || "";
};

const productSku = (item) =>
  productObject(item)?.sku ||
  productObject(item)?.productCode ||
  item?.sku ||
  "N/A";

const monthlyRent = (item) =>
  Number(
    item?.monthlyRent ??
      item?.rental?.monthlyRent ??
      item?.rentalDetails?.monthlyRent ??
      item?.pricing?.monthlyRent ??
      productObject(item)?.monthlyRent ??
      productObject(item)?.rental?.monthlyRent ??
      productObject(item)?.rentalDetails?.monthlyRent ??
      productObject(item)?.pricing?.monthlyRent ??
      0
  );

const depositAmount = (item) =>
  Number(
    item?.securityDeposit ??
      item?.rental?.securityDeposit ??
      item?.rentalDetails?.securityDeposit ??
      item?.pricing?.securityDeposit ??
      productObject(item)?.securityDeposit ??
      productObject(item)?.rental?.securityDeposit ??
      productObject(item)?.rentalDetails?.securityDeposit ??
      0
  );

const minimumMonths = (item) =>
  Math.max(
    MIN_MONTHS,
    Number(
      item?.minimumRentalMonths ??
        item?.minRentalMonths ??
        item?.rental?.minimumRentalMonths ??
        item?.rentalDetails?.minimumRentalMonths ??
        productObject(item)?.minimumRentalMonths ??
        productObject(item)?.minRentalMonths ??
        MIN_MONTHS
    ) || MIN_MONTHS
  );

const availableQuantity = (item) =>
  Number(
    item?.availableQuantity ??
      item?.availableQty ??
      item?.availableStock ??
      item?.rental?.availableQuantity ??
      item?.rentalDetails?.availableQuantity ??
      productObject(item)?.availableQuantity ??
      productObject(item)?.rental?.availableQuantity ??
      productObject(item)?.rentalDetails?.availableQuantity ??
      item?.quantity ??
      0
  );

const isRentalProduct = (item) => {
  if (!item) return false;

  const type = String(
    item?.productType ??
      productObject(item)?.productType ??
      ""
  ).toUpperCase();

  return (
    type === "RENTAL" ||
    Boolean(item?.rentalProductId) ||
    [
      item?.monthlyRent,
      item?.securityDeposit,
      item?.minimumRentalMonths,
      item?.isAvailableForRent,
      item?.rental,
      item?.rentalDetails,
    ].some((value) => value !== undefined && value !== null)
  );
};

const imageUrl = (item) => {
  const product = productObject(item);

  let image =
    item?.primaryImage ||
    item?.image ||
    item?.imageUrl ||
    item?.thumbnail ||
    product?.primaryImage ||
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    "";

  if (product?.images?.length) image = product.images[0];
  if (item?.images?.length) image = item.images[0];

  if (typeof image === "object") {
    image =
      image?.url ||
      image?.path ||
      image?.fileUrl ||
      image?.src ||
      "";
  }

  if (!image) return "";

  if (/^https?:\/\//i.test(image)) return image;

  const host = String(API)
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return `${host}/${String(image).replace(/^\/+/, "")}`;
};

const getCreatedRentals = (response) => {
  const queue = [response];
  const seen = new Set();

  while (queue.length) {
    const node = queue.shift();

    if (!node || typeof node !== "object" || seen.has(node)) {
      continue;
    }

    seen.add(node);

    if (Array.isArray(node.rentals)) {
      const rentals = node.rentals.filter(
        (r) => r && (r._id || r.id)
      );

      if (rentals.length) {
        return {
          rentals,
          warnings: node.warnings || [],
        };
      }
    }

    if (node.rental?._id || node.rental?.id) {
      return {
        rentals: [node.rental],
        warnings: node.warnings || [],
      };
    }

    if (
      (node._id || node.id) &&
      (node.rentalNumber ||
        node.rentalProductId ||
        node.customerType ||
        node.orderId)
    ) {
      return {
        rentals: [node],
        warnings: node.warnings || [],
      };
    }

    for (const key of [
      "data",
      "result",
      "payload",
      "response",
      "body",
    ]) {
      if (node[key] && typeof node[key] === "object") {
        queue.push(node[key]);
      }
    }
  }

  return {
    rentals: [],
    warnings: [],
  };
};

const validateFile = (file, isPhoto) => {
  if (!file) return "Please select a file.";

  const types = isPhoto
    ? ["image/jpeg", "image/png", "image/webp"]
    : [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

  if (!types.includes(file.type)) {
    return isPhoto
      ? "Only JPG, PNG or WEBP allowed."
      : "Only JPG, PNG, WEBP or PDF allowed.";
  }

  const maxMB = isPhoto ? 5 : 10;

  if (file.size > maxMB * 1024 * 1024) {
    return `Maximum file size is ${maxMB} MB.`;
  }

  return "";
};

// ======================================================
// CONDITION IMAGE PREVIEW
// ======================================================

function ConditionPreview({ file, label }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url ? (
    <img
      className="wir-condition-preview"
      src={url}
      alt={label}
    />
  ) : (
    <div className="wir-condition-placeholder">
      <span>📷</span>
      <p>No image selected</p>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function WalkInRental() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [customerType, setCustomerType] =
    useState("INDIVIDUAL");

  const [individualDetails, setIndividualDetails] =
    useState({ ...EMPTY_INDIVIDUAL });

  const [companyDetails, setCompanyDetails] =
    useState({ ...EMPTY_COMPANY });

  const [rentalDuration, setRentalDuration] =
    useState(MIN_MONTHS);

  const [handoverDescription, setHandoverDescription] =
    useState("");

  const [documents, setDocuments] = useState({});

  const [officeOrCollegeType, setOfficeOrCollegeType] =
    useState("OFFICE_ID");

  const [conditionPhotos, setConditionPhotos] = useState({});

  // GST / NON GST
  const [billingType, setBillingType] = useState("GST");

  const [gstPercentage, setGstPercentage] =
    useState(DEFAULT_GST);

  // Negotiation per rental product
  const [negotiations, setNegotiations] = useState({});

  // Deposit
  const [depositPaid, setDepositPaid] = useState(false);

  const [depositAmountPaid, setDepositAmountPaid] =
    useState(0);

  const [depositPaymentMethod, setDepositPaymentMethod] =
    useState("CASH");

  const [
    depositPaymentReference,
    setDepositPaymentReference,
  ] = useState("");

  // First rent installment
  const [rentPaidNow, setRentPaidNow] = useState(false);

  const [rentPaymentMethod, setRentPaymentMethod] =
    useState("CASH");

  const [rentPaymentReference, setRentPaymentReference] =
    useState("");

  // ====================================================
  // DERIVED VALUES
  // ====================================================

  const maxUnits =
    customerType === "COMPANY"
      ? MAX_UNITS_COMPANY
      : MAX_UNITS_INDIVIDUAL;

  const cartTotalUnits = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart]
  );

  const minDuration = useMemo(
    () =>
      Math.max(
        MIN_MONTHS,
        ...cart.map((c) => minimumMonths(c.product))
      ),
    [cart]
  );

  const currentDocuments = DOCUMENT_CONFIG[customerType];

  const unitEntries = useMemo(
    () =>
      cart.flatMap((c) =>
        Array.from({ length: c.quantity }, (_, index) => ({
          key: `${c.rentalProductId}:${index}`,
          rentalProductId: c.rentalProductId,
          name: productName(c.product),
          index: index + 1,
        }))
      ),
    [cart]
  );

  const isNonGst = billingType === "NON_GST";

  const effectiveGstPercentage = isNonGst
    ? 0
    : Number(gstPercentage);

  // ====================================================
  // LOAD PRODUCTS
  // ====================================================

  const loadProducts = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getRentalProducts();

      const list = firstArray(response).filter(isRentalProduct);

      setProducts(list);

      setCart((prev) =>
        prev
          .map((c) => {
            const fresh = list.find(
              (p) =>
                rentalProductId(p) === c.rentalProductId
            );

            if (!fresh || availableQuantity(fresh) <= 0) {
              return null;
            }

            return {
              ...c,
              product: fresh,
              quantity: Math.min(
                c.quantity,
                availableQuantity(fresh)
              ),
            };
          })
          .filter(Boolean)
      );
    } catch (error) {
      console.error("LOAD RENTAL PRODUCTS ERROR", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load rental products"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setRentalDuration((prev) =>
      Math.max(prev, minDuration)
    );
  }, [minDuration]);

  useEffect(() => {
    setDepositPaid(false);
    setDepositAmountPaid(0);
    setDepositPaymentMethod("CASH");
    setDepositPaymentReference("");

    setRentPaidNow(false);
    setRentPaymentMethod("CASH");
    setRentPaymentReference("");
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return products;

    return products.filter((p) =>
      [
        productName(p),
        brandName(p),
        productSku(p),
      ].some((value) =>
        String(value).toLowerCase().includes(q)
      )
    );
  }, [products, search]);

  const quantityInCart = (id) =>
    cart.find((c) => c.rentalProductId === id)?.quantity || 0;

  const limitMessage =
    customerType === "COMPANY"
      ? `Company can rent a maximum of ${MAX_UNITS_COMPANY} laptops.`
      : "Individual customer can rent only 1 laptop.";

  // ====================================================
  // CART ACTIONS
  // ====================================================

  const addToCart = (item) => {
    if (!isRentalProduct(item)) {
      return toast.error(
        "Only rental products can be selected."
      );
    }

    if (availableQuantity(item) <= 0) {
      return toast.error("This laptop is out of stock.");
    }

    if (cartTotalUnits >= maxUnits) {
      return toast.error(limitMessage);
    }

    const id = rentalProductId(item);

    setCart((prev) => {
      const found = prev.find(
        (c) => c.rentalProductId === id
      );

      if (found) {
        if (found.quantity >= availableQuantity(item)) {
          toast.error("Insufficient stock.");
          return prev;
        }

        return prev.map((c) =>
          c.rentalProductId === id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [
        ...prev,
        {
          rentalProductId: id,
          productId: productId(item),
          product: item,
          quantity: 1,
        },
      ];
    });
  };

  const changeQuantity = (id, delta) => {
    if (delta > 0 && cartTotalUnits >= maxUnits) {
      return toast.error(limitMessage);
    }

    setCart((prev) =>
      prev
        .map((c) => {
          if (c.rentalProductId !== id) return c;

          if (
            delta > 0 &&
            c.quantity >= availableQuantity(c.product)
          ) {
            toast.error("Insufficient stock.");
            return c;
          }

          return {
            ...c,
            quantity: c.quantity + delta,
          };
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((c) => c.rentalProductId !== id)
    );
  };

  const changeCustomerType = (type) => {
    setCustomerType(type);
    setDocuments({});

    if (type === "INDIVIDUAL" && cartTotalUnits > 1) {
      setCart((prev) =>
        prev
          .slice(0, 1)
          .map((c) => ({ ...c, quantity: 1 }))
      );

      toast.info(
        "Individual customer can rent only one laptop. Extra units removed."
      );
    }
  };

  const resetForm = () => {
    setCart([]);
    setSearch("");
    setCustomerType("INDIVIDUAL");

    setIndividualDetails({ ...EMPTY_INDIVIDUAL });
    setCompanyDetails({ ...EMPTY_COMPANY });

    setRentalDuration(MIN_MONTHS);
    setHandoverDescription("");
    setDocuments({});
    setOfficeOrCollegeType("OFFICE_ID");
    setConditionPhotos({});
    setNegotiations({});

    setBillingType("GST");
    setGstPercentage(DEFAULT_GST);

    setDepositPaid(false);
    setDepositAmountPaid(0);
    setDepositPaymentMethod("CASH");
    setDepositPaymentReference("");

    setRentPaidNow(false);
    setRentPaymentMethod("CASH");
    setRentPaymentReference("");
  };

  // ====================================================
  // DOCUMENTS AND PHOTOS
  // ====================================================

  const handleDocumentChange = (key, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = validateFile(file, false);

    if (error) {
      toast.error(error);
      event.target.value = "";
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handlePhotoChange = (unitKey, side, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = validateFile(file, true);

    if (error) {
      toast.error(error);
      event.target.value = "";
      return;
    }

    setConditionPhotos((prev) => ({
      ...prev,
      [unitKey]: {
        ...(prev[unitKey] || EMPTY_PHOTOS()),
        [side]: file,
      },
    }));
  };

  // ====================================================
  // GST / NON-GST / NEGOTIATED PRICING
  // ====================================================

  const pricing = useMemo(() => {
    const duration = Math.max(
      MIN_MONTHS,
      Number(rentalDuration) || MIN_MONTHS
    );

    // NON_GST always means zero GST.
    const gstRate =
      billingType === "NON_GST"
        ? 0
        : Number(gstPercentage) || 0;

    const items = cart.map((c) => {
      const originalMonthlyRent = monthlyRent(c.product);

      const negotiation = negotiations[c.rentalProductId] || {};

      const negotiated = Boolean(negotiation.enabled);

      const negotiatedMonthlyRent = negotiated
        ? Number(negotiation.rate ?? originalMonthlyRent)
        : originalMonthlyRent;

      const effectiveMonthlyRent = negotiatedMonthlyRent;

      const lineRent = round(
        effectiveMonthlyRent * duration * c.quantity
      );

      const lineGst =
        billingType === "NON_GST"
          ? 0
          : round((lineRent * gstRate) / 100);

      const lineDeposit = round(
        depositAmount(c.product) * c.quantity
      );

      const firstRent = round(
        effectiveMonthlyRent * c.quantity
      );

      const firstGst =
        billingType === "NON_GST"
          ? 0
          : round((firstRent * gstRate) / 100);

      const firstInstallment = round(
        firstRent + firstGst
      );

      return {
        rentalProductId: c.rentalProductId,
        productId: c.productId,
        name: productName(c.product),
        quantity: c.quantity,

        originalMonthlyRent,
        negotiatedMonthlyRent,
        monthlyRent: effectiveMonthlyRent,

        negotiated,
        pricingType: negotiated
          ? "NEGOTIATED"
          : "STANDARD",

        negotiationReason: negotiated
          ? String(negotiation.reason || "").trim()
          : "",

        billingType,
        gstPercentage: gstRate,

        lineRent,
        lineGst,
        lineDeposit,

        lineTotal: round(
          lineRent + lineGst + lineDeposit
        ),

        firstRent,
        firstGst,
        firstInstallment,
      };
    });

    const rentSubtotal = round(
      items.reduce((sum, item) => sum + item.lineRent, 0)
    );

    const gstAmount =
      billingType === "NON_GST"
        ? 0
        : round(
            items.reduce(
              (sum, item) => sum + item.lineGst,
              0
            )
          );

    const rentTotalAmount = round(
      rentSubtotal + gstAmount
    );

    const securityDeposit = round(
      items.reduce(
        (sum, item) => sum + item.lineDeposit,
        0
      )
    );

    const firstInstallmentTotal = round(
      items.reduce(
        (sum, item) => sum + item.firstInstallment,
        0
      )
    );

    return {
      items,
      duration,
      durationType: "MONTHS",
      billingType,
      gstPercentage: gstRate,

      rentSubtotal,
      gstAmount,
      rentTotalAmount,

      securityDeposit,

      totalAmount: round(
        rentTotalAmount + securityDeposit
      ),

      firstInstallmentTotal,
      installmentCount: duration,
    };
  }, [
    cart,
    rentalDuration,
    negotiations,
    billingType,
    gstPercentage,
  ]);

  // ====================================================
  // DEPOSIT SUMMARY
  // ====================================================

  const depositExpected = pricing.securityDeposit;

  const depositReceived = depositPaid
    ? Number(depositAmountPaid || 0)
    : 0;

  const depositBalance = Math.max(
    0,
    round(depositExpected - depositReceived)
  );

  const depositStatus =
    depositExpected <= 0 ||
    depositReceived >= depositExpected
      ? "PAID"
      : depositReceived > 0
      ? "PARTIAL"
      : "UNPAID";

  const changeDepositPaid = (checked) => {
    setDepositPaid(checked);

    setDepositAmountPaid(
      checked ? depositExpected : 0
    );

    setDepositPaymentMethod(
      checked ? "CASH" : "NONE"
    );

    setDepositPaymentReference("");
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {
    if (!cart.length) {
      toast.error("Please select a rental laptop.");
      return false;
    }

    if (cartTotalUnits > maxUnits) {
      toast.error(limitMessage);
      return false;
    }

    if (
      !Number.isInteger(Number(rentalDuration)) ||
      Number(rentalDuration) < minDuration
    ) {
      toast.error(
        `Minimum rental duration is ${minDuration} months.`
      );
      return false;
    }

    for (const c of cart) {
      const fresh =
        products.find(
          (p) =>
            rentalProductId(p) === c.rentalProductId
        ) || c.product;

      if (c.quantity > availableQuantity(fresh)) {
        toast.error(
          `Insufficient stock for ${productName(fresh)}.`
        );
        return false;
      }

      const item = pricing.items.find(
        (i) => i.rentalProductId === c.rentalProductId
      );

      if (
        !Number.isFinite(item.negotiatedMonthlyRent) ||
        item.negotiatedMonthlyRent < 0
      ) {
        toast.error(
          `Invalid negotiated rent for ${item.name}.`
        );
        return false;
      }

      if (item.negotiated && !item.negotiationReason) {
        toast.error(
          `Enter negotiation reason for ${item.name}.`
        );
        return false;
      }
    }

    if (
      billingType === "GST" &&
      (!Number.isFinite(Number(gstPercentage)) ||
        String(gstPercentage).trim() === "" ||
        Number(gstPercentage) < 0 ||
        Number(gstPercentage) > 100)
    ) {
      toast.error(
        "Enter a valid GST percentage (0–100)."
      );
      return false;
    }

    if (
      customerType === "INDIVIDUAL" &&
      (!individualDetails.fullName.trim() ||
        !individualDetails.phone.trim())
    ) {
      toast.error(
        "Customer name and phone are required."
      );
      return false;
    }

    if (
      customerType === "COMPANY" &&
      (!companyDetails.companyName.trim() ||
        !companyDetails.contactPerson.trim() ||
        !companyDetails.phone.trim())
    ) {
      toast.error(
        "Company name, contact person and phone are required."
      );
      return false;
    }

    if (
      depositPaid &&
      (!Number.isFinite(depositReceived) ||
        depositReceived <= 0 ||
        depositReceived > depositExpected)
    ) {
      toast.error(
        "Deposit paid must be greater than zero and no more than required deposit."
      );
      return false;
    }

    if (
      !depositPaid &&
      Number(depositAmountPaid) > 0
    ) {
      toast.error(
        "Tick Deposit Paid before entering received deposit."
      );
      return false;
    }

    if (
      depositPaid &&
      depositPaymentMethod !== "CASH" &&
      !depositPaymentReference.trim()
    ) {
      toast.error(
        "Enter deposit transaction reference."
      );
      return false;
    }

    if (
      rentPaidNow &&
      rentPaymentMethod !== "CASH" &&
      !rentPaymentReference.trim()
    ) {
      toast.error(
        "Enter rent transaction reference."
      );
      return false;
    }

    for (const doc of currentDocuments) {
      if (!documents[doc.key]) {
        toast.error(
          `Please upload ${doc.label}.`
        );
        return false;
      }
    }

    for (const unit of unitEntries) {
      for (const side of PHOTO_SIDES) {
        if (!conditionPhotos[unit.key]?.[side.key]) {
          toast.error(
            `Upload ${side.label} for ${unit.name} (Unit ${unit.index}).`
          );
          return false;
        }
      }
    }

    return true;
  };

  // ====================================================
  // UPLOAD DOCUMENTS
  // ====================================================

  const uploadAllDocuments = async (id) => {
    for (const doc of currentDocuments) {
      const type = doc.merged
        ? officeOrCollegeType
        : doc.key;

      const response = await uploadRentalDocument(
        id,
        type,
        documents[doc.key]
      );

      if (
        response?.success === false ||
        response?.data?.success === false
      ) {
        throw new Error(
          response?.message ||
            `Failed to upload ${doc.label}.`
        );
      }
    }
  };

  const uploadPhotosForRental = async (id, photos) => {
    for (const side of PHOTO_SIDES) {
      const response = await uploadRentalConditionPhoto(
        id,
        side.key,
        photos[side.key]
      );

      if (
        response?.success === false ||
        response?.data?.success === false
      ) {
        throw new Error(
          response?.message ||
            `Failed to upload ${side.label}.`
        );
      }
    }
  };

  // ====================================================
  // SUBMIT RENTAL
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !validateForm()) return;

    setSubmitting(true);

    let orderCreated = false;

    try {
      const payload = {
        rentalSource: "WALK_IN",
        customerType,

        items: cart.map((c) => {
          const p = pricing.items.find(
            (i) =>
              i.rentalProductId === c.rentalProductId
          );

          return {
            rentalProductId: c.rentalProductId,
            quantity: c.quantity,

            originalMonthlyRent: p.originalMonthlyRent,
            negotiatedMonthlyRent: p.negotiatedMonthlyRent,

            monthlyRent: p.monthlyRent,

            pricingType: p.pricingType,
            negotiationReason: p.negotiationReason,

            billingType,
            gstPercentage: effectiveGstPercentage,

            rentSubtotal: p.lineRent,
            rentGstAmount: p.lineGst,
            rentTotalAmount: round(
              p.lineRent + p.lineGst
            ),
          };
        }),

        individualDetails:
          customerType === "INDIVIDUAL"
            ? {
                ...individualDetails,
                fullName:
                  individualDetails.fullName.trim(),
                phone:
                  individualDetails.phone.trim(),
                email:
                  individualDetails.email
                    .trim()
                    .toLowerCase(),
                address:
                  individualDetails.address.trim(),
              }
            : undefined,

        companyDetails:
          customerType === "COMPANY"
            ? {
                ...companyDetails,
                companyName:
                  companyDetails.companyName.trim(),
                contactPerson:
                  companyDetails.contactPerson.trim(),
                phone:
                  companyDetails.phone.trim(),
                email:
                  companyDetails.email
                    .trim()
                    .toLowerCase(),
                officeAddress:
                  companyDetails.officeAddress.trim(),
                gstNumber:
                  companyDetails.gstNumber
                    .trim()
                    .toUpperCase(),
              }
            : undefined,

        rentalDurationType: "MONTHS",
        rentalDuration: pricing.duration,

        // Explicit tax treatment
        billingType,
        gstPercentage: effectiveGstPercentage,

        // Entire order rent (all units)
        rentSubtotal: pricing.rentSubtotal,
        gstAmount: pricing.gstAmount,
        rentGstAmount: pricing.gstAmount,
        rentTotalAmount: pricing.rentTotalAmount,

        // Deposit is separate from taxable rent
        securityDeposit: pricing.securityDeposit,

        depositAmountPaid: depositReceived,

        depositPaymentMethod:
          depositReceived > 0
            ? depositPaymentMethod
            : "NONE",

        depositPaymentReference:
          depositReceived > 0
            ? depositPaymentReference.trim()
            : "",

        rentPaidNow,

        rentPaymentMethod: rentPaidNow
          ? rentPaymentMethod
          : "",

        rentPaymentReference: rentPaidNow
          ? rentPaymentReference.trim()
          : "",

        notes: handoverDescription.trim(),
        handoverNotes: handoverDescription.trim(),
      };

      console.log("WALK-IN RENTAL PAYLOAD", payload);

      const response =
        await createWalkInRentalRequest(payload);

      if (
        response?.success === false ||
        response?.data?.success === false
      ) {
        throw new Error(
          response?.message ||
            response?.data?.message ||
            "Rental creation failed."
        );
      }

      orderCreated = true;

      const { rentals, warnings } =
        getCreatedRentals(response);

      if (!rentals.length) {
        toast.warning(
          "Rental may have been created, but rental IDs are missing. Check Orders before retrying to avoid duplicates."
        );

        navigate(
          "/receptionist-dashboard/rental/orders"
        );

        return;
      }

      // ================================================
      // VERIFY BACKEND TAX / PRICING
      // ================================================

      for (const rental of rentals) {
        const savedBillingType = String(
          rental.billingType || ""
        ).toUpperCase();

        if (
          savedBillingType &&
          savedBillingType !== billingType
        ) {
          toast.warning(
            `Rental ${rental.rentalNumber || ""}: backend billing type differs from selected ${billingType}. Please verify.`
          );
        }

        if (
          billingType === "NON_GST" &&
          (Number(rental.gstPercentage || 0) > 0 ||
            Number(rental.rentGstAmount || 0) > 0)
        ) {
          toast.error(
            `Rental ${rental.rentalNumber || ""}: backend saved GST despite NON_GST selection. Please correct backend before collecting payment.`
          );
        }
      }

      // ================================================
      // DEPOSIT PAYMENT RECORD
      // ================================================

      let paymentFailed = false;

      for (const rental of rentals) {
        const amount = Number(
          rental.depositAmountPaid || 0
        );

        // Do not create a second payment if backend
        // already returned its payment reference.
        if (
          amount <= 0 ||
          rental.securityDepositPaymentId
        ) {
          continue;
        }

        try {
          const paymentResponse = await createPayment({
            paymentFor: "RENTAL",
            paymentType: "SECURITY_DEPOSIT",

            referenceId: rental._id || rental.id,
            amount,

            paymentMethod:
              depositPaymentMethod === "BANK_TRANSFER"
                ? "NET_BANKING"
                : depositPaymentMethod === "ONLINE"
                ? "UPI"
                : depositPaymentMethod,

            paymentStatus: "SUCCESS",

            paymentDate: new Date().toISOString(),
            paidAt: new Date().toISOString(),

            gateway: "",
            transactionId:
              depositPaymentReference.trim(),
            gatewayPaymentId: "",
          });

          if (
            paymentResponse?.success === false ||
            paymentResponse?.data?.success === false
          ) {
            throw new Error(
              "Deposit payment record failed."
            );
          }
        } catch (error) {
          console.error(
            "DEPOSIT PAYMENT ERROR",
            error
          );

          paymentFailed = true;
        }
      }

      // ================================================
      // DOCUMENT UPLOAD
      // ================================================

      let documentsFailed = false;

      try {
        await uploadAllDocuments(
          String(rentals[0]._id || rentals[0].id)
        );
      } catch (error) {
        console.error(
          "DOCUMENT UPLOAD ERROR",
          error
        );

        documentsFailed = true;
      }

      // ================================================
      // CONDITION PHOTO UPLOAD
      // ================================================

      let photosFailed = false;

      const orderedUnitKeys = unitEntries.map(
        (u) => u.key
      );

      const canMatch =
        rentals.length === orderedUnitKeys.length &&
        rentals.every((r, i) => {
          const actual =
            r.rentalProductId &&
            typeof r.rentalProductId === "object"
              ? String(
                  r.rentalProductId._id ||
                    r.rentalProductId.id ||
                    ""
                )
              : String(r.rentalProductId || "");

          return (
            !actual ||
            actual === unitEntries[i].rentalProductId
          );
        });

      if (canMatch) {
        for (let i = 0; i < rentals.length; i++) {
          try {
            await uploadPhotosForRental(
              String(
                rentals[i]._id || rentals[i].id
              ),
              conditionPhotos[orderedUnitKeys[i]]
            );
          } catch (error) {
            console.error(
              "CONDITION PHOTO UPLOAD ERROR",
              error
            );

            photosFailed = true;
          }
        }
      } else {
        photosFailed = true;

        console.warn(
          "Rental order differs from requested units. Photos not attached to avoid wrong-device mapping."
        );
      }

      // ================================================
      // WARNINGS
      // ================================================

      if (paymentFailed) {
        toast.warning(
          "Rental created, but some deposit payment records failed. Verify before retrying payment."
        );
      }

      if (documentsFailed) {
        toast.warning(
          "Rental created, but customer document upload failed."
        );
      }

      if (photosFailed) {
        toast.warning(
          "Rental created, but some laptop condition photos were not uploaded."
        );
      }

      (Array.isArray(warnings) ? warnings : []).forEach(
        (w) => toast.warning(String(w))
      );

      toast.success(
        `${rentals.length} rental(s) created. Billing: ${billingType}. Deposit ${money(
          depositReceived
        )} received; first rent ${
          rentPaidNow ? "marked paid" : "pending"
        }.`
      );

      await loadProducts(true);

      navigate(
        "/receptionist-dashboard/rental/orders",
        {
          state: { rentals },
        }
      );
    } catch (error) {
      console.error(
        "CREATE WALK-IN RENTAL ERROR",
        error
      );

      toast.error(
        (orderCreated
          ? "Rental may already exist. Check Orders before retrying. "
          : "") +
          (error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to create walk-in rental.")
      );

      await loadProducts(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="wir-loading-page">
        <FaSpinner className="wir-spin" />

        <h2>Loading rental laptops...</h2>

        <p>
          Please wait while rental inventory is loaded.
        </p>
      </div>
    );
  }

  // ====================================================
  // JSX
  // ====================================================

  return (
    <div className="wir-page">
      <header className="wir-header">
        <div className="wir-header-left">
          <button
            type="button"
            className="wir-back-btn"
            onClick={() =>
              navigate("/receptionist-dashboard")
            }
          >
            <FaArrowLeft /> Back
          </button>

          <div>
            <h1 className="wir-header-title">
              Walk-In Rental
            </h1>

            <p className="wir-header-subtitle">
              Create rental for walk-in customer
            </p>
          </div>
        </div>

        <div className="wir-source-badge">
          <FaLaptop /> WALK-IN RENTAL
        </div>
      </header>

      <form
        className="wir-form"
        onSubmit={handleSubmit}
      >
        {/* CUSTOMER TYPE */}

        <section className="wir-card wir-customer-type-section">
          <div className="wir-section-title">
            <FaUser />

            <div>
              <h2>Customer Type</h2>
              <p>
                Select individual or company customer
              </p>
            </div>
          </div>

          <div className="wir-customer-type-grid">
            {[
              [
                "INDIVIDUAL",
                "Individual",
                "1 laptop only",
                FaUser,
              ],
              [
                "COMPANY",
                "Company",
                `Up to ${MAX_UNITS_COMPANY} laptops • min ${MIN_MONTHS} months`,
                FaBuilding,
              ],
            ].map(([type, title, subtitle, Icon]) => (
              <button
                type="button"
                key={type}
                className={`wir-type-card ${
                  customerType === type
                    ? "wir-type-card-active"
                    : ""
                }`}
                onClick={() =>
                  changeCustomerType(type)
                }
              >
                <Icon size={26} />
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SELECT PRODUCTS */}

        <section className="wir-card">
          <div className="wir-section-title">
            <FaLaptop />

            <div>
              <h2>Select Rental Laptops</h2>

              <p>
                {customerType === "COMPANY"
                  ? `Selected ${cartTotalUnits}/${MAX_UNITS_COMPANY} units`
                  : "Individual customer can rent only 1 laptop"}
              </p>
            </div>
          </div>

          <div className="wir-search-box">
            <FaSearch />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search laptop, brand or SKU..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="wir-refresh-row">
            <button
              type="button"
              className="wir-cancel-btn"
              onClick={() => loadProducts(true)}
              disabled={refreshing}
            >
              <FaRedo
                className={
                  refreshing ? "wir-spin" : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Stock"}
            </button>
          </div>

          {!filteredProducts.length ? (
            <div className="wir-empty-products">
              <FaLaptop size={42} />

              <h3>
                {search
                  ? "No rental laptop found"
                  : "No rental laptops available"}
              </h3>

              <p>
                {search
                  ? "Try another search."
                  : "Please add rental products from admin panel."}
              </p>
            </div>
          ) : (
            <div className="wir-product-grid">
              {filteredProducts.map((item) => {
                const id = rentalProductId(item);

                const qty = quantityInCart(id);

                const available =
                  availableQuantity(item);

                const img = imageUrl(item);

                return (
                  <article
                    key={id}
                    className={`wir-product-card ${
                      qty
                        ? "wir-product-card-selected"
                        : ""
                    }`}
                  >
                    <div className="wir-product-image">
                      {img ? (
                        <img
                          src={img}
                          alt={productName(item)}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <FaLaptop size={30} />
                      )}
                    </div>

                    <div className="wir-product-info">
                      <span className="wir-product-brand">
                        {brandName(item) || "Laptop"}
                      </span>

                      <h3>{productName(item)}</h3>

                      <span className="wir-product-sku">
                        SKU: {productSku(item)}
                      </span>

                      <div className="wir-product-prices">
                        <span>
                          Rent: {money(monthlyRent(item))} / month
                        </span>

                        <span>
                          Deposit: {money(depositAmount(item))}
                        </span>

                        <span>
                          Minimum: {minimumMonths(item)} months
                        </span>
                      </div>

                      <span
                        className={`wir-stock ${
                          available > 0
                            ? "wir-stock-available"
                            : "wir-stock-unavailable"
                        }`}
                      >
                        {available > 0
                          ? `${available} Available`
                          : "Out of Stock"}
                      </span>

                      {qty ? (
                        <div className="wir-stepper wir-product-stepper">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(id, -1)
                            }
                          >
                            <FaMinus />
                          </button>

                          <div className="wir-stepper-value">
                            <strong>{qty}</strong>
                            <span>
                              unit{qty > 1 ? "s" : ""}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(id, 1)
                            }
                            disabled={
                              qty >= available ||
                              cartTotalUnits >= maxUnits
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="wir-submit-btn wir-product-select-btn"
                          onClick={() =>
                            addToCart(item)
                          }
                          disabled={
                            available <= 0 ||
                            cartTotalUnits >= maxUnits
                          }
                        >
                          <FaShoppingCart />
                          Add to Order
                        </button>
                      )}
                    </div>

                    {qty > 0 && (
                      <FaCheckCircle className="wir-selected-check" />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            {/* SELECTED CART */}

            <section className="wir-card">
              <div className="wir-section-title">
                <FaCheckCircle />

                <div>
                  <h2>Selected Laptops</h2>

                  <p>
                    {cart.length} laptop type(s) •{" "}
                    {cartTotalUnits} of {maxUnits} units
                  </p>
                </div>
              </div>

              <div className="wir-cart-list">
                {cart.map((c) => (
                  <div
                    key={c.rentalProductId}
                    className="wir-cart-item"
                  >
                    <div className="wir-cart-item-info">
                      <strong>
                        {productName(c.product)}
                      </strong>

                      <span>
                        {brandName(c.product)} • SKU:{" "}
                        {productSku(c.product)}
                      </span>
                    </div>

                    <div className="wir-cart-item-actions">
                      <div className="wir-stepper">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              c.rentalProductId,
                              -1
                            )
                          }
                        >
                          <FaMinus />
                        </button>

                        <div className="wir-stepper-value">
                          <strong>{c.quantity}</strong>
                          <span>units</span>
                        </div>

                        <button
                          type="button"
                          disabled={
                            cartTotalUnits >= maxUnits ||
                            c.quantity >=
                              availableQuantity(c.product)
                          }
                          onClick={() =>
                            changeQuantity(
                              c.rentalProductId,
                              1
                            )
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="wir-remove-cart-btn"
                        onClick={() =>
                          removeFromCart(c.rentalProductId)
                        }
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="wir-cancel-btn"
                onClick={resetForm}
              >
                <FaTimes /> Clear All
              </button>
            </section>

            {/* CUSTOMER DETAILS */}

            <section className="wir-card wir-customer-details-section">
              <div className="wir-section-title">
                {customerType === "INDIVIDUAL" ? (
                  <FaUser />
                ) : (
                  <FaBuilding />
                )}

                <div>
                  <h2>Customer Details</h2>
                  <p>
                    Enter walk-in customer information
                  </p>
                </div>
              </div>

              {customerType === "INDIVIDUAL" ? (
                <div className="wir-form-grid wir-customer-form-grid">
                  {[
                    ["fullName", "Full Name *", FaUser],
                    ["phone", "Phone *", FaPhone],
                    ["email", "Email", FaEnvelope],
                  ].map(([key, label, Icon]) => (
                    <div
                      className="wir-form-group"
                      key={key}
                    >
                      <label>{label}</label>

                      <div className="wir-input-icon">
                        <Icon />

                        <input
                          type={
                            key === "email"
                              ? "email"
                              : key === "phone"
                              ? "tel"
                              : "text"
                          }
                          name={key}
                          value={individualDetails[key]}
                          onChange={(e) =>
                            setIndividualDetails(
                              (prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              })
                            )
                          }
                          placeholder={`Enter ${label
                            .replace(" *", "")
                            .toLowerCase()}`}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="wir-form-group wir-form-group-full">
                    <label>Address</label>

                    <div className="wir-input-icon wir-textarea-icon">
                      <FaMapMarkerAlt />

                      <textarea
                        name="address"
                        rows={4}
                        value={individualDetails.address}
                        onChange={(e) =>
                          setIndividualDetails(
                            (prev) => ({
                              ...prev,
                              address: e.target.value,
                            })
                          )
                        }
                        placeholder="Enter customer address"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="wir-form-grid wir-customer-form-grid">
                  {[
                    ["companyName", "Company Name *"],
                    ["contactPerson", "Contact Person *"],
                    ["phone", "Phone *"],
                    ["email", "Email"],
                    ["gstNumber", "GST Number"],
                  ].map(([key, label]) => (
                    <div
                      className="wir-form-group"
                      key={key}
                    >
                      <label>{label}</label>

                      <input
                        type={
                          key === "email"
                            ? "email"
                            : key === "phone"
                            ? "tel"
                            : "text"
                        }
                        name={key}
                        value={companyDetails[key]}
                        onChange={(e) =>
                          setCompanyDetails(
                            (prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            })
                          )
                        }
                        placeholder={`Enter ${label
                          .replace(" *", "")
                          .toLowerCase()}`}
                      />
                    </div>
                  ))}

                  <div className="wir-form-group wir-form-group-full">
                    <label>Office Address</label>

                    <div className="wir-input-icon wir-textarea-icon">
                      <FaMapMarkerAlt />

                      <textarea
                        rows={4}
                        value={companyDetails.officeAddress}
                        onChange={(e) =>
                          setCompanyDetails(
                            (prev) => ({
                              ...prev,
                              officeAddress: e.target.value,
                            })
                          )
                        }
                        placeholder="Enter office address"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* DOCUMENT UPLOAD */}

            <section className="wir-card wir-documents-section">
              <div className="wir-section-title">
                <FaShieldAlt />

                <div>
                  <h2>Customer Documents</h2>
                  <p>
                    Upload required documents for this rental
                  </p>
                </div>
              </div>

              <div className="wir-document-grid">
                {currentDocuments.map((doc) => (
                  <div
                    key={doc.key}
                    className="wir-document-card"
                  >
                    <div className="wir-document-header">
                      <strong>{doc.label}</strong>
                      <span>Required *</span>
                    </div>

                    {doc.merged && (
                      <div className="wir-doc-type-toggle">
                        {[
                          "OFFICE_ID",
                          "COLLEGE_ID",
                        ].map((type) => (
                          <button
                            type="button"
                            key={type}
                            className={`wir-doc-type-btn ${
                              officeOrCollegeType === type
                                ? "wir-doc-type-btn-active"
                                : ""
                            }`}
                            onClick={() =>
                              setOfficeOrCollegeType(type)
                            }
                          >
                            {type === "OFFICE_ID"
                              ? "Office ID"
                              : "College ID"}
                          </button>
                        ))}
                      </div>
                    )}

                    <label className="wir-document-file-label">
                      <input
                        type="file"
                        accept={doc.accept}
                        onChange={(e) =>
                          handleDocumentChange(
                            doc.key,
                            e
                          )
                        }
                      />

                      <span>
                        {documents[doc.key]?.name ||
                          "Choose document"}
                      </span>
                    </label>

                    {documents[doc.key] && (
                      <div className="wir-document-selected">
                        <FaCheckCircle />

                        <span>
                          {documents[doc.key].name}
                        </span>

                        <button
                          type="button"
                          className="wir-document-remove-btn"
                          onClick={() =>
                            setDocuments((prev) => ({
                              ...prev,
                              [doc.key]: null,
                            }))
                          }
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    <small>
                      JPG, PNG, WEBP or PDF • Max 10 MB
                    </small>
                  </div>
                ))}
              </div>

              <div className="wir-document-note">
                <FaShieldAlt />

                <span>
                  Customer documents are uploaded once;
                  backend must attach them to each rental
                  in the order.
                </span>
              </div>
            </section>

            {/* CONDITION PHOTOS */}

            <section className="wir-card wir-condition-section">
              <div className="wir-condition-heading">
                <h3>Laptop Condition Photos</h3>

                <p>
                  Upload front, back and full image for{" "}
                  <strong>each physical laptop</strong>{" "}
                  before handover.
                </p>
              </div>

              {unitEntries.map((unit) => (
                <div
                  className="wir-condition-unit"
                  key={unit.key}
                >
                  <h4>
                    {unit.name} — Unit {unit.index}
                  </h4>

                  <div className="wir-condition-grid">
                    {PHOTO_SIDES.map((side) => {
                      const file =
                        conditionPhotos[unit.key]?.[
                          side.key
                        ];

                      return (
                        <div
                          className="wir-condition-card"
                          key={side.key}
                        >
                          <div className="wir-condition-card-title">
                            <strong>{side.label}</strong>
                            <span>Required</span>
                          </div>

                          <ConditionPreview
                            file={file}
                            label={`${unit.name} ${side.label}`}
                          />

                          <label className="wir-condition-upload">
                            {file
                              ? "Change Image"
                              : "Choose Image"}

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              hidden
                              onChange={(e) =>
                                handlePhotoChange(
                                  unit.key,
                                  side.key,
                                  e
                                )
                              }
                            />
                          </label>

                          {file && (
                            <div className="wir-condition-file">
                              <span title={file.name}>
                                {file.name}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setConditionPhotos(
                                    (prev) => ({
                                      ...prev,
                                      [unit.key]: {
                                        ...prev[unit.key],
                                        [side.key]: null,
                                      },
                                    })
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <p className="wir-condition-note">
                JPG, PNG or WEBP • Max 5 MB per photo •
                All three required per laptop.
              </p>
            </section>

            {/* RENTAL PERIOD */}

            <section className="wir-card">
              <div className="wir-section-title">
                <FaCalendarAlt />

                <div>
                  <h2>Rental Period</h2>
                  <p>Applies to the whole order</p>
                </div>
              </div>

              <div className="wir-form-grid">
                <div className="wir-form-group">
                  <label>Duration Type</label>

                  <select
                    className="wir-duration-select"
                    value="MONTHS"
                    disabled
                  >
                    <option value="MONTHS">
                      Months
                    </option>
                  </select>

                  <small>
                    Minimum 3 months compulsory.
                  </small>
                </div>

                <div className="wir-form-group">
                  <label>Minimum Rental</label>

                  <input
                    readOnly
                    value={`${minDuration} months`}
                  />

                  <small>
                    Based on selected laptops.
                  </small>
                </div>

                <div className="wir-form-group">
                  <label>Rental Duration</label>

                  <div className="wir-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setRentalDuration((v) =>
                          Math.max(
                            minDuration,
                            v - 1
                          )
                        )
                      }
                      disabled={
                        rentalDuration <= minDuration
                      }
                    >
                      <FaMinus />
                    </button>

                    <div className="wir-stepper-value">
                      <strong>
                        {rentalDuration}
                      </strong>

                      <span>months</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setRentalDuration(
                          (v) => v + 1
                        )
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <small>
                    Cannot be less than {minDuration} months.
                  </small>
                </div>

                <div className="wir-form-group wir-form-group-full">
                  <label>Handover / Notes</label>

                  <textarea
                    rows={4}
                    value={handoverDescription}
                    onChange={(e) =>
                      setHandoverDescription(
                        e.target.value
                      )
                    }
                    placeholder="Laptop condition, charger, bag, accessories or handover notes..."
                  />

                  <small>
                    Saved with each rental.
                  </small>
                </div>
              </div>
            </section>

            {/* NEGOTIATED PRICING */}

            <section className="wir-card wir-pricing-section">
              <div className="wir-section-title">
                <FaRupeeSign />

                <div>
                  <h2>Rental Pricing Negotiation</h2>

                  <p>
                    Change rent per laptop type. Original
                    product master price remains unchanged.
                  </p>
                </div>
              </div>

              <div className="wir-pricing-list">
                {cart.map((c) => {
                  const original =
                    monthlyRent(c.product);

                  const state =
                    negotiations[c.rentalProductId] ||
                    {};

                  const enabled = Boolean(
                    state.enabled
                  );

                  return (
                    <div
                      className="wir-pricing-item"
                      key={c.rentalProductId}
                    >
                      <div className="wir-pricing-item-head">
                        <strong>
                          {productName(c.product)} ×{" "}
                          {c.quantity}
                        </strong>

                        <span>
                          Original: {money(original)} /
                          month / unit
                        </span>
                      </div>

                      <label className="wir-deposit-checkbox">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) =>
                            setNegotiations(
                              (prev) => ({
                                ...prev,
                                [c.rentalProductId]: {
                                  ...prev[
                                    c.rentalProductId
                                  ],
                                  enabled:
                                    e.target.checked,
                                  rate: e.target.checked
                                    ? prev[
                                        c.rentalProductId
                                      ]?.rate ??
                                      String(original)
                                    : String(original),
                                },
                              })
                            )
                          }
                        />

                        <span className="wir-custom-checkbox">
                          {enabled && (
                            <FaCheckCircle />
                          )}
                        </span>

                        <div>
                          <strong>
                            Negotiate Rent
                          </strong>

                          <small>
                            Sales/Admin approval required
                            by backend
                          </small>
                        </div>
                      </label>

                      {enabled && (
                        <div className="wir-form-grid">
                          <div className="wir-form-group">
                            <label>
                              Negotiated Monthly Rent (₹) *
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                state.rate ??
                                String(original)
                              }
                              onChange={(e) =>
                                setNegotiations(
                                  (prev) => ({
                                    ...prev,
                                    [c.rentalProductId]: {
                                      ...prev[
                                        c.rentalProductId
                                      ],
                                      rate:
                                        e.target.value,
                                    },
                                  })
                                )
                              }
                            />
                          </div>

                          <div className="wir-form-group">
                            <label>
                              Difference per Unit / Month
                            </label>

                            <input
                              readOnly
                              value={money(
                                Number(
                                  state.rate ?? original
                                ) - original
                              )}
                            />
                          </div>

                          <div className="wir-form-group wir-form-group-full">
                            <label>
                              Negotiation Reason *
                            </label>

                            <textarea
                              rows={2}
                              value={
                                state.reason || ""
                              }
                              onChange={(e) =>
                                setNegotiations(
                                  (prev) => ({
                                    ...prev,
                                    [c.rentalProductId]: {
                                      ...prev[
                                        c.rentalProductId
                                      ],
                                      reason:
                                        e.target.value,
                                    },
                                  })
                                )
                              }
                              placeholder="Discount, special agreement, revised pricing..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* GST / NON GST */}

            <section className="wir-card wir-tax-section">
              <div className="wir-section-title">
                <FaRupeeSign />

                <div>
                  <h2>GST / Non-GST Billing</h2>

                  <p>
                    Choose the legally applicable invoice
                    treatment.
                  </p>
                </div>
              </div>

              <div className="wir-customer-type-grid">
                {[
                  [
                    "GST",
                    "GST Billing",
                    "GST calculated on rental amount",
                  ],
                  [
                    "NON_GST",
                    "Non-GST Billing",
                    "No GST added to rental amount",
                  ],
                ].map(
                  ([type, label, description]) => (
                    <button
                      type="button"
                      key={type}
                      className={`wir-type-card ${
                        billingType === type
                          ? "wir-type-card-active"
                          : ""
                      }`}
                      onClick={() =>
                        setBillingType(type)
                      }
                    >
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </button>
                  )
                )}
              </div>

              {billingType === "GST" && (
                <div className="wir-form-grid">
                  <div className="wir-form-group">
                    <label>
                      Applicable GST Rate (%) *
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gstPercentage}
                      onChange={(e) =>
                        setGstPercentage(
                          e.target.value
                        )
                      }
                    />

                    <small>
                      Verify the applicable rate with your
                      tax/accounting team.
                    </small>
                  </div>
                </div>
              )}

              <div className="wir-summary-lines">
                <div>
                  <span>Rental Subtotal</span>
                  <strong>
                    {money(pricing.rentSubtotal)}
                  </strong>
                </div>

                <div>
                  <span>
                    GST (
                    {isNonGst
                      ? "Not charged"
                      : `${effectiveGstPercentage}%`}
                    )
                  </span>

                  <strong>
                    {money(pricing.gstAmount)}
                  </strong>
                </div>

                <div>
                  <span>Rent Including Tax</span>
                  <strong>
                    {money(pricing.rentTotalAmount)}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECURITY DEPOSIT */}

            <section className="wir-card wir-deposit-section">
              <div className="wir-section-title">
                <FaShieldAlt />

                <div>
                  <h2>Security Deposit Payment</h2>
                  <p>
                    Record actual received deposit
                  </p>
                </div>
              </div>

              <div className="wir-deposit-box">
                <div className="wir-deposit-header">
                  <div>
                    <span className="wir-deposit-label">
                      Required Security Deposit (all units)
                    </span>

                    <strong>
                      {money(depositExpected)}
                    </strong>
                  </div>

                  <div
                    className={`wir-deposit-badge wir-deposit-badge-${depositStatus.toLowerCase()}`}
                  >
                    {depositStatus}
                  </div>
                </div>

                <label className="wir-deposit-checkbox">
                  <input
                    type="checkbox"
                    checked={depositPaid}
                    onChange={(e) =>
                      changeDepositPaid(
                        e.target.checked
                      )
                    }
                    disabled={depositExpected <= 0}
                  />

                  <span className="wir-custom-checkbox">
                    {depositPaid && (
                      <FaCheckCircle />
                    )}
                  </span>

                  <div>
                    <strong>Deposit Paid</strong>

                    <small>
                      Tick only when customer has actually
                      paid.
                    </small>
                  </div>
                </label>

                {depositPaid ? (
                  <div className="wir-form-grid wir-deposit-grid">
                    <div className="wir-form-group">
                      <label>
                        Deposit Amount Paid *
                      </label>

                      <div className="wir-input-icon">
                        <FaRupeeSign />

                        <input
                          type="number"
                          min="0"
                          max={depositExpected}
                          step="0.01"
                          value={depositAmountPaid}
                          onChange={(e) =>
                            setDepositAmountPaid(
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {depositBalance > 0 && (
                        <small>
                          Remaining:{" "}
                          {money(depositBalance)}
                        </small>
                      )}
                    </div>

                    <div className="wir-form-group">
                      <label>
                        Payment Method *
                      </label>

                      <div className="wir-input-icon">
                        {depositPaymentMethod ===
                        "CASH" ? (
                          <FaMoneyBillWave />
                        ) : depositPaymentMethod ===
                          "BANK_TRANSFER" ? (
                          <FaUniversity />
                        ) : (
                          <FaCreditCard />
                        )}

                        <select
                          value={depositPaymentMethod}
                          onChange={(e) =>
                            setDepositPaymentMethod(
                              e.target.value
                            )
                          }
                        >
                          {PAYMENT_METHODS.map(
                            (method) => (
                              <option
                                key={method.value}
                                value={method.value}
                              >
                                {method.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="wir-form-group wir-form-group-full">
                      <label>
                        Transaction / Payment Reference{" "}
                        {depositPaymentMethod !==
                        "CASH"
                          ? "*"
                          : ""}
                      </label>

                      <input
                        value={
                          depositPaymentReference
                        }
                        onChange={(e) =>
                          setDepositPaymentReference(
                            e.target.value
                          )
                        }
                        placeholder="Transaction ID / receipt reference"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="wir-deposit-unpaid-note">
                    <FaShieldAlt />

                    <div>
                      <strong>
                        Deposit not received
                      </strong>

                      <span>
                        Rental can still be created with
                        deposit pending.
                      </span>
                    </div>
                  </div>
                )}

                {depositStatus === "PARTIAL" && (
                  <div className="wir-deposit-partial-note">
                    <FaShieldAlt />

                    <span>
                      Partial deposit received:{" "}
                      <strong>
                        {money(depositReceived)}
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {money(depositExpected)}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* RENT PAYMENT */}

            <section className="wir-card wir-deposit-section">
              <div className="wir-section-title">
                <FaRupeeSign />

                <div>
                  <h2>Rent Payment</h2>

                  <p>
                    Month-wise tracking •{" "}
                    {pricing.installmentCount} installments
                  </p>
                </div>
              </div>

              <div className="wir-deposit-box">
                <div className="wir-deposit-header">
                  <div>
                    <span className="wir-deposit-label">
                      First Month Rent (
                      {isNonGst
                        ? "Non-GST"
                        : "incl. GST"}
                      , all units)
                    </span>

                    <strong>
                      {money(
                        pricing.firstInstallmentTotal
                      )}
                    </strong>
                  </div>

                  <div
                    className={`wir-deposit-badge wir-deposit-badge-${
                      rentPaidNow
                        ? "paid"
                        : "unpaid"
                    }`}
                  >
                    {rentPaidNow
                      ? "PAID"
                      : "UNPAID"}
                  </div>
                </div>

                <label className="wir-deposit-checkbox">
                  <input
                    type="checkbox"
                    checked={rentPaidNow}
                    onChange={(e) => {
                      setRentPaidNow(
                        e.target.checked
                      );

                      if (!e.target.checked) {
                        setRentPaymentReference("");
                      }
                    }}
                  />

                  <span className="wir-custom-checkbox">
                    {rentPaidNow && (
                      <FaCheckCircle />
                    )}
                  </span>

                  <div>
                    <strong>
                      First Month Rent Paid
                    </strong>

                    <small>
                      Tick only when payment is actually
                      received. Remaining months can be
                      collected later.
                    </small>
                  </div>
                </label>

                {rentPaidNow ? (
                  <div className="wir-form-grid wir-deposit-grid">
                    <div className="wir-form-group">
                      <label>
                        Payment Method *
                      </label>

                      <div className="wir-input-icon">
                        <FaMoneyBillWave />

                        <select
                          value={rentPaymentMethod}
                          onChange={(e) =>
                            setRentPaymentMethod(
                              e.target.value
                            )
                          }
                        >
                          {PAYMENT_METHODS.map(
                            (method) => (
                              <option
                                key={method.value}
                                value={method.value}
                              >
                                {method.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="wir-form-group">
                      <label>
                        Transaction / Payment Reference{" "}
                        {rentPaymentMethod !==
                        "CASH"
                          ? "*"
                          : ""}
                      </label>

                      <input
                        value={
                          rentPaymentReference
                        }
                        onChange={(e) =>
                          setRentPaymentReference(
                            e.target.value
                          )
                        }
                        placeholder="Transaction ID / receipt reference"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="wir-deposit-unpaid-note">
                    <FaShieldAlt />

                    <div>
                      <strong>
                        Rent not received yet
                      </strong>

                      <span>
                        First installment remains pending
                        in the rent schedule.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* RENTAL SUMMARY */}

            <section className="wir-card wir-summary-card">
              <div className="wir-section-title">
                <FaRupeeSign />

                <div>
                  <h2>Rental Summary</h2>

                  <p>
                    Negotiated pricing and tax calculation
                  </p>
                </div>
              </div>

              <div className="wir-cart-summary-lines">
                {pricing.items.map((item) => (
                  <div
                    key={item.rentalProductId}
                    className="wir-cart-summary-line"
                  >
                    <span>
                      {item.name} × {item.quantity} —{" "}
                      {money(item.monthlyRent)}
                      /month
                      {item.negotiated
                        ? " (negotiated)"
                        : ""}
                    </span>

                    <strong>
                      {money(item.lineTotal)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="wir-summary-lines">
                <div>
                  <span>Rental Period</span>

                  <strong>
                    {pricing.duration} months
                  </strong>
                </div>

                <div>
                  <span>
                    Billing Type
                  </span>

                  <strong>
                    {billingType}
                  </strong>
                </div>

                <div>
                  <span>
                    Monthly Installment ({billingType})
                  </span>

                  <strong>
                    {money(
                      pricing.firstInstallmentTotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Rental Amount
                  </span>

                  <strong>
                    {money(pricing.rentSubtotal)}
                  </strong>
                </div>

                <div>
                  <span>
                    GST (
                    {isNonGst
                      ? "not charged"
                      : `${effectiveGstPercentage}%`}
                    )
                  </span>

                  <strong>
                    {money(pricing.gstAmount)}
                  </strong>
                </div>

                <div>
                  <span>
                    Total Rent Including Tax
                  </span>

                  <strong>
                    {money(
                      pricing.rentTotalAmount
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Security Deposit
                  </span>

                  <strong>
                    {money(depositExpected)}
                  </strong>
                </div>

                <div>
                  <span>
                    Deposit Paid
                  </span>

                  <strong
                    className={
                      depositReceived
                        ? "wir-text-paid"
                        : "wir-text-unpaid"
                    }
                  >
                    {money(depositReceived)}
                  </strong>
                </div>

                <div>
                  <span>
                    Deposit Remaining
                  </span>

                  <strong
                    className={
                      depositBalance
                        ? "wir-text-partial"
                        : "wir-text-paid"
                    }
                  >
                    {money(depositBalance)}
                  </strong>
                </div>

                <div>
                  <span>
                    Deposit Status
                  </span>

                  <strong
                    className={`wir-text-${depositStatus.toLowerCase()}`}
                  >
                    {depositStatus}
                  </strong>
                </div>

                <div>
                  <span>
                    First Rent Installment
                  </span>

                  <strong
                    className={
                      rentPaidNow
                        ? "wir-text-paid"
                        : "wir-text-unpaid"
                    }
                  >
                    {rentPaidNow
                      ? "PAID"
                      : "PENDING"}
                  </strong>
                </div>

                <div className="wir-summary-total">
                  <span>
                    Total Payable (including refundable
                    deposit)
                  </span>

                  <strong>
                    {money(pricing.totalAmount)}
                  </strong>
                </div>
              </div>

              <div className="wir-submit-help">
                <FaShieldAlt />

                Security deposit is refundable subject to
                actual receipt, rental return condition
                and rental agreement.
              </div>

              <div className="wir-submit-row">
                <button
                  type="button"
                  className="wir-cancel-btn"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  <FaTimes /> Reset
                </button>

                <button
                  type="submit"
                  className="wir-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="wir-spin" />
                      Creating Rentals...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />

                      Create Walk-In Rental{" "}
                      {cartTotalUnits > 1
                        ? `(${cartTotalUnits} units)`
                        : ""}
                    </>
                  )}
                </button>
              </div>
            </section>
          </>
        )}
      </form>
    </div>
  );
}

export default WalkInRental;
