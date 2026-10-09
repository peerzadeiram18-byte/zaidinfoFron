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
// } from "../../../services/rentalApi";

// import { createPayment } from "../../../services/paymentService";

// import "./WalkInRental.css";

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
//        Replaces the old single "selectedProduct" — now the receptionist 
//        can add more than one laptop, of any type, each with its own quantity. */
//     const [cart, setCart] = useState([]);

//     /* CUSTOMER TYPE */
//     const [customerType, setCustomerType] = useState("INDIVIDUAL");

//     /* CUSTOMER DETAILS */
//     const [individualDetails, setIndividualDetails] = useState({ ...EMPTY_INDIVIDUAL });
//     const [companyDetails, setCompanyDetails] = useState({ ...EMPTY_COMPANY });

//     /* RENTAL DURATION — shared across the whole order */
//     const [rentalDurationType, setRentalDurationType] = useState("DAYS");
//     const [rentalDuration, setRentalDuration] = useState(1);

//     /* HANDOVER NOTES */
//     const [handoverDescription, setHandoverDescription] = useState("");

//     /* DEPOSIT PAYMENT */
//     const [depositPaid, setDepositPaid] = useState(false);
//     const [depositAmountPaid, setDepositAmountPaid] = useState(0);
//     const [depositPaymentMethod, setDepositPaymentMethod] = useState("CASH");
//     const [depositPaymentReference, setDepositPaymentReference] = useState("");

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

//     /* UPLOAD DOCUMENTS — same set of docs is attached to every rental created for this order */
//     const uploadAllDocuments = async (rentalId) => {
//         if (!rentalId) {
//             throw new Error("Rental ID was not returned by the server.");
//         }

//         const uploadResults = [];

//         for (const documentConfig of currentDocuments) {
//             const file = documents[documentConfig.key];
//             if (!file) continue;

//             const backendDocType = resolveBackendDocType(documentConfig);

//             const response = await uploadRentalDocument(rentalId, backendDocType, file);

//             uploadResults.push({ type: backendDocType, response });
//         }

//         return uploadResults;
//     };

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

//     /* Reset deposit fields whenever the cart changes — never auto-mark as paid */
//     useEffect(() => {
//         setDepositPaid(false);
//         setDepositAmountPaid(0);
//         setDepositPaymentMethod("CASH");
//         setDepositPaymentReference("");
//     }, [cart.length]);

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
//                 setRentalDuration(Math.max(3, minimum));
//             }
//         }
//     };

//     const increaseCartQuantity = (rentalProductId) => {
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
//         setRentalDuration(customerType === "INDIVIDUAL" ? 1 : 3);
//         setHandoverDescription("");
//         setDocuments({});
//         setDepositPaid(false);
//         setDepositAmountPaid(0);
//         setDepositPaymentMethod("CASH");
//         setDepositPaymentReference("");
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
//             cart.length > 0 ? Math.max(...cart.map((c) => getMinimumMonths(c.product))) : 3;

//         if (type === "COMPANY") {
//             setRentalDurationType("MONTHS");
//             setRentalDuration(Math.max(3, minimum));
//         } else {
//             setRentalDurationType("DAYS");
//             setRentalDuration(1);
//         }
//     };

//     /* Highest minimum-months across every laptop currently in the cart */
//     const minimumMonths = useMemo(() => {
//         if (cart.length === 0) return 3;
//         return Math.max(...cart.map((c) => getMinimumMonths(c.product)));
//     }, [cart]);

//     const decreaseDuration = () => {
//         setRentalDuration((previous) => {
//             const minimum = rentalDurationType === "MONTHS" ? Math.max(3, minimumMonths) : 1;
//             return Math.max(minimum, Number(previous) - 1);
//         });
//     };

//     const increaseDuration = () => {
//         setRentalDuration((previous) => Number(previous) + 1);
//     };

//     const handleDurationTypeChange = (event) => {
//         const type = event.target.value;

//         if (customerType === "COMPANY" && type === "DAYS") {
//             toast.error("Company rental must be for a minimum of 3 months.");
//             return;
//         }

//         setRentalDurationType(type);

//         if (type === "DAYS") {
//             setRentalDuration(1);
//         } else {
//             setRentalDuration(Math.max(3, minimumMonths));
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
//             };
//         });

//         const rentSubtotal = Number(items.reduce((sum, i) => sum + i.lineRent, 0).toFixed(2));
//         const gstAmount = Number(items.reduce((sum, i) => sum + i.lineGst, 0).toFixed(2));
//         const securityDeposit = Number(
//             items.reduce((sum, i) => sum + i.lineDeposit, 0).toFixed(2)
//         );
//         const totalAmount = Number((rentSubtotal + gstAmount + securityDeposit).toFixed(2));

//         return {
//             items,
//             duration,
//             durationType: rentalDurationType,
//             rentSubtotal,
//             gstAmount,
//             securityDeposit,
//             totalAmount,
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

//     /* VALIDATE FORM */
//     const validateForm = () => {
//         if (cart.length === 0) {
//             toast.error("Please select at least one rental laptop.");
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
//                 toast.error("Company rental must be for a minimum of 3 months.");
//                 return false;
//             }

//             if (Number(rentalDuration) < 3) {
//                 toast.error("Company rental must be for a minimum of 3 months.");
//                 return false;
//             }

//             if (Number(rentalDuration) < minimumMonths) {
//                 toast.error(`Minimum rental period is ${minimumMonths} months.`);
//                 return false;
//             }
//         }

//         if (customerType === "INDIVIDUAL") {
//             if (rentalDurationType === "DAYS" && Number(rentalDuration) < 1) {
//                 toast.error("Personal rental duration must be at least 1 day.");
//                 return false;
//             }

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
//     };

//     /* SUBMIT — creates one rental per unit (backend books exactly 1 unit per call) */
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (submitting) return;
//         if (!validateForm()) return;
//         if (!validateDocuments()) return;

//         try {
//             setSubmitting(true);

//             const totalDeposit = Number(pricing.securityDeposit || 0);
//             const paidDeposit = Number(depositAmountPaid || 0);
//             let remainingPaidToAllocate = paidDeposit;

//             const createdRentals = [];
//             let anyDepositPaymentFailed = false;

//             for (const item of pricing.items) {
//                 for (let unit = 0; unit < item.quantity; unit++) {
//                     const unitRent =
//                         rentalDurationType === "DAYS"
//                             ? Number((item.dailyRent * pricing.duration).toFixed(2))
//                             : Number((item.monthlyRent * pricing.duration).toFixed(2));

//                     const unitGst = Number(((unitRent * item.gstPercentage) / 100).toFixed(2));
//                     const unitTotal = Number((unitRent + unitGst + item.unitDeposit).toFixed(2));

//                     let calculatedDepositStatus = "UNPAID";

//                     if (item.unitDeposit <= 0) {
//                         calculatedDepositStatus = "PAID";
//                     }

//                     // Allocate the paid amount across units in order, unit deposit at a time.
//                     const allocatedForThisUnit =
//                         item.unitDeposit > 0
//                             ? Math.min(remainingPaidToAllocate, item.unitDeposit)
//                             : 0;

//                     if (allocatedForThisUnit > 0) {
//                         remainingPaidToAllocate = Number(
//                             (remainingPaidToAllocate - allocatedForThisUnit).toFixed(2)
//                         );

//                         calculatedDepositStatus =
//                             allocatedForThisUnit >= item.unitDeposit ? "PAID" : "PARTIAL";
//                     }

//                     const payload = {
//                         rentalSource: "WALK_IN",
//                         rentalProductId: item.rentalProductId,
//                         productId: item.productId,
//                         customerType,
//                         quantity: 1,

//                         individualDetails:
//                             customerType === "INDIVIDUAL"
//                                 ? {
//                                     fullName: individualDetails.fullName.trim(),
//                                     phone: individualDetails.phone.trim(),
//                                     email: individualDetails.email.trim().toLowerCase(),
//                                     address: individualDetails.address.trim(),
//                                 }
//                                 : undefined,

//                         companyDetails:
//                             customerType === "COMPANY"
//                                 ? {
//                                     companyName: companyDetails.companyName.trim(),
//                                     contactPerson: companyDetails.contactPerson.trim(),
//                                     phone: companyDetails.phone.trim(),
//                                     email: companyDetails.email.trim().toLowerCase(),
//                                     officeAddress: companyDetails.officeAddress.trim(),
//                                     gstNumber: companyDetails.gstNumber.trim().toUpperCase(),
//                                 }
//                                 : undefined,

//                         monthlyRent: Number(item.monthlyRent),
//                         gstPercentage: Number(item.gstPercentage),
//                         securityDeposit: Number(item.unitDeposit),

//                         rentalDurationType: rentalDurationType,
//                         rentalDuration: Number(pricing.duration),

//                         rentSubtotal: unitRent,
//                         gstAmount: unitGst,
//                         totalAmount: unitTotal,

//                         depositPaymentStatus: calculatedDepositStatus,
//                         depositPaid: calculatedDepositStatus === "PAID",
//                         depositAmountPaid: allocatedForThisUnit,
//                         depositPaymentMethod:
//                             allocatedForThisUnit > 0 ? depositPaymentMethod : "NONE",
//                         depositPaymentReference:
//                             allocatedForThisUnit > 0 ? depositPaymentReference.trim() : "",
//                         depositPaidAt: allocatedForThisUnit > 0 ? new Date().toISOString() : null,

//                         notes: handoverDescription.trim(),
//                         handoverDescription: handoverDescription.trim(),
//                         handoverNotes: handoverDescription.trim(),
//                     };

//                     const response = await createWalkInRentalRequest(payload);

//                     const rental =
//                         response?.rental ||
//                         response?.data?.rental ||
//                         response?.data?.data ||
//                         response?.data ||
//                         response;

//                     const rentalId = rental?._id || rental?.id;

//                     if (!rentalId) {
//                         throw new Error(
//                             `Rental for ${item.name} was created but rental ID was not returned.`
//                         );
//                     }

//                     /* SECURITY DEPOSIT PAYMENT RECORD for this specific rental unit */
//                     if (allocatedForThisUnit > 0) {
//                         try {
//                             const databasePaymentMethod =
//                                 depositPaymentMethod === "BANK_TRANSFER"
//                                     ? "NET_BANKING"
//                                     : depositPaymentMethod === "ONLINE"
//                                         ? "UPI"
//                                         : depositPaymentMethod;

//                             const paymentData = {
//                                 paymentFor: "RENTAL",
//                                 paymentType: "SECURITY_DEPOSIT",
//                                 referenceId: rentalId,
//                                 amount: allocatedForThisUnit,
//                                 paymentMethod: databasePaymentMethod,
//                                 paymentStatus: "SUCCESS",
//                                 paymentDate: new Date().toISOString(),
//                                 paidAt: new Date().toISOString(),
//                                 gateway: "",
//                                 transactionId: depositPaymentReference.trim(),
//                                 gatewayPaymentId: "",
//                             };

//                             const paymentResponse = await createPayment(paymentData);

//                             if (!paymentResponse?.success || !paymentResponse?.payment) {
//                                 throw new Error(
//                                     paymentResponse?.message ||
//                                     "Security deposit payment record could not be created."
//                                 );
//                             }
//                         } catch (paymentError) {
//                             console.error("DEPOSIT PAYMENT RECORD ERROR:", paymentError);
//                             anyDepositPaymentFailed = true;
//                         }
//                     }

//                     await uploadAllDocuments(rentalId);

//                     createdRentals.push(rental);
//                 }
//             }

//             if (anyDepositPaymentFailed) {
//                 toast.warning(
//                     "Rentals created, but some deposit payment records could not be saved."
//                 );
//             }

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

//     const cartTotalUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

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
//                             <span>Personal customer</span>
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
//                             <span>Business customer</span>
//                         </button>
//                     </div>
//                 </section>

//                 {/* RENTAL PRODUCT — multi-select with per-card quantity */}
//                 <section className="wir-card">
//                     <div className="wir-section-title">
//                         <FaLaptop />
//                         <div>
//                             <h2>Select Rental Laptops</h2>
//                             <p>Add one or more laptops — set quantity for each</p>
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
//                                                         disabled={inCartQuantity >= available}
//                                                     >
//                                                         <FaPlus />
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <button
//                                                     type="button"
//                                                     className="wir-submit-btn wir-product-select-btn"
//                                                     onClick={() => addToCart(item)}
//                                                     disabled={available <= 0}
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
//                                         {cart.length} laptop type(s) • {cartTotalUnits} total unit(s)
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
//                                                         disabled={cartItem.quantity >= available}
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
//                                     These documents apply to the whole order and will be attached to
//                                     every rental created below.
//                                 </span>
//                             </div>
//                         </section>

//                         {/* RENTAL PERIOD */}
//                         <section className="wir-card">
//                             <div className="wir-section-title">
//                                 <FaCalendarAlt />
//                                 <div>
//                                     <h2>Rental Period</h2>
//                                     <p>Applies to the whole order</p>
//                                 </div>
//                             </div>

//                             <div className="wir-form-grid">
//                                 <div className="wir-form-group">
//                                     <label>Duration Type</label>
//                                     <select
//                                         className="wir-duration-select"
//                                         value={rentalDurationType}
//                                         onChange={handleDurationTypeChange}
//                                     >
//                                         <option value="MONTHS">Months</option>
//                                         {customerType === "INDIVIDUAL" && <option value="DAYS">Days</option>}
//                                     </select>

//                                     {customerType === "INDIVIDUAL" && (
//                                         <small>Individual customers can rent for 1 or more days.</small>
//                                     )}

//                                     {customerType === "COMPANY" && (
//                                         <small>Company rental minimum is 3 months.</small>
//                                     )}
//                                 </div>

//                                 <div className="wir-form-group">
//                                     <label>Minimum Rental</label>
//                                     <input
//                                         type="text"
//                                         value={
//                                             rentalDurationType === "MONTHS"
//                                                 ? `${Math.max(3, minimumMonths)} months`
//                                                 : "1 day"
//                                         }
//                                         readOnly
//                                     />
//                                 </div>

//                                 <div className="wir-form-group">
//                                     <label>Rental Duration</label>
//                                     <div className="wir-stepper">
//                                         <button
//                                             type="button"
//                                             onClick={decreaseDuration}
//                                             disabled={
//                                                 rentalDuration <=
//                                                 (rentalDurationType === "MONTHS" ? Math.max(3, minimumMonths) : 1)
//                                             }
//                                         >
//                                             <FaMinus />
//                                         </button>

//                                         <div className="wir-stepper-value">
//                                             <strong>{rentalDuration}</strong>
//                                             <span>{rentalDurationType === "MONTHS" ? "months" : "days"}</span>
//                                         </div>

//                                         <button type="button" onClick={increaseDuration}>
//                                             <FaPlus />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="wir-form-group wir-form-group-full">
//                                     <label>Handover / Notes</label>
//                                     <textarea
//                                         value={handoverDescription}
//                                         onChange={(event) => setHandoverDescription(event.target.value)}
//                                         placeholder="Enter laptop condition, accessories, charger, bag or other handover notes..."
//                                         rows={4}
//                                     />
//                                     <small>These notes will be saved with every rental in this order.</small>
//                                 </div>
//                             </div>
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
} from "../../../services/rentalApi";

import { createPayment } from "../../../services/paymentService";

import "./WalkInRental.css";

/* ========================================================= 
   BUSINESS RULES (backend rental.constants.js ke same rakhna)
========================================================= */

const MAX_UNITS_INDIVIDUAL = 1;
const MAX_UNITS_COMPANY = 10;
const COMPANY_MIN_MONTHS = 3;

/* ========================================================= 
   API 
========================================================= */

const API = import.meta.env.VITE_API_URL || "";

/* ========================================================= 
   EMPTY CUSTOMER 
========================================================= */

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

/* ========================================================= 
   ARRAY HELPER 
========================================================= */

const getFirstArray = (response) => {
    const candidates = [
        response,
        response?.data,
        response?.products,
        response?.data?.products,
        response?.data?.data,
        response?.data?.data?.products,
    ];

    for (const item of candidates) {
        if (Array.isArray(item)) {
            return item;
        }
    }

    return [];
};

/* ========================================================= 
   CREATED ORDER (backend: data = { orderId, rentals, warnings })
========================================================= */

const looksLikeRental = (value) =>
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Boolean(value.rentalNumber || (value._id && (value.rentalProductId || value.customerType)));

// Response kisi bhi shape me aaye (axios response, {success,data}, naya
// {orderId,rentals} ya purana single rental) — rentals dhoondh nikalta hai.
const extractCreatedOrder = (response) => {
    let level = [response];

    for (let depth = 0; depth < 5 && level.length > 0; depth++) {
        const next = [];

        for (const node of level) {
            if (!node || typeof node !== "object") continue;

            if (Array.isArray(node.rentals) && node.rentals.length > 0) {
                return {
                    orderId: node.orderId || "",
                    rentals: node.rentals,
                    warnings: Array.isArray(node.warnings) ? node.warnings : [],
                };
            }

            if (looksLikeRental(node.rental)) {
                return { orderId: node.rental.orderId || "", rentals: [node.rental], warnings: [] };
            }

            if (looksLikeRental(node)) {
                return { orderId: node.orderId || "", rentals: [node], warnings: [] };
            }

            next.push(node.data, node.result);
        }

        level = next;
    }

    return { orderId: "", rentals: [], warnings: [] };
};

/* ========================================================= 
   PRODUCT OBJECT 
========================================================= */

const getProductObject = (item) => {
    if (!item) return {};

    if (item?.productId && typeof item.productId === "object") {
        return item.productId;
    }

    if (item?.product && typeof item.product === "object") {
        return item.product;
    }

    return item;
};

/* ========================================================= 
   PRODUCT ID 
========================================================= */

const getProductId = (item) => {
    if (!item) return "";

    const product = getProductObject(item);

    return String(
        product?._id ||
        product?.id ||
        (typeof item?.productId === "string" ? item.productId : "") ||
        item?._id ||
        item?.id ||
        ""
    );
};

/* ========================================================= 
   RENTAL PRODUCT ID 
========================================================= */

const getRentalProductId = (item) => {
    if (!item) return "";

    if (item?.rentalProductId && typeof item.rentalProductId === "object") {
        return String(item.rentalProductId?._id || item.rentalProductId?.id || "");
    }

    if (item?.rentalProductId) {
        return String(item.rentalProductId);
    }

    if (item?.rentalProduct && typeof item.rentalProduct === "object") {
        return String(item.rentalProduct?._id || item.rentalProduct?.id || "");
    }

    return String(item?._id || item?.id || "");
};

/* ========================================================= 
   PRODUCT NAME 
========================================================= */

const getProductName = (item) => {
    const product = getProductObject(item);

    return (
        product?.name ||
        product?.title ||
        item?.name ||
        item?.title ||
        item?.productName ||
        "Rental Laptop"
    );
};

/* ========================================================= 
   BRAND 
========================================================= */

const getBrand = (item) => {
    const product = getProductObject(item);

    if (product?.brand && typeof product.brand === "object") {
        return product.brand?.name || product.brand?.title || "";
    }

    if (item?.brand && typeof item.brand === "object") {
        return item.brand?.name || item.brand?.title || "";
    }

    return product?.brand || item?.brand || "";
};

/* ========================================================= 
   SKU 
========================================================= */

const getSku = (item) => {
    const product = getProductObject(item);

    return product?.sku || product?.productCode || item?.sku || item?.productCode || "N/A";
};

/* ========================================================= 
   MONTHLY RENT 
========================================================= */

const getMonthlyRent = (item) => {
    const product = getProductObject(item);

    return Number(
        item?.monthlyRent ??
        item?.rental?.monthlyRent ??
        item?.rentalDetails?.monthlyRent ??
        item?.pricing?.monthlyRent ??
        product?.monthlyRent ??
        product?.rental?.monthlyRent ??
        product?.rentalDetails?.monthlyRent ??
        product?.pricing?.monthlyRent ??
        0
    );
};

/* ========================================================= 
   SECURITY DEPOSIT 
========================================================= */

const getSecurityDeposit = (item) => {
    const product = getProductObject(item);

    return Number(
        item?.securityDeposit ??
        item?.rental?.securityDeposit ??
        item?.rentalDetails?.securityDeposit ??
        item?.pricing?.securityDeposit ??
        product?.securityDeposit ??
        product?.rental?.securityDeposit ??
        product?.rentalDetails?.securityDeposit ??
        product?.pricing?.securityDeposit ??
        0
    );
};

/* ========================================================= 
   MINIMUM MONTHS 
========================================================= */

const getMinimumMonths = (item) => {
    const product = getProductObject(item);

    const value =
        item?.minimumRentalMonths ??
        item?.minRentalMonths ??
        item?.rental?.minimumRentalMonths ??
        item?.rentalDetails?.minimumRentalMonths ??
        product?.minimumRentalMonths ??
        product?.minRentalMonths ??
        product?.rental?.minimumRentalMonths ??
        product?.rentalDetails?.minimumRentalMonths ??
        3;

    const months = Number(value);

    return months >= 1 ? months : 3;
};

/* ========================================================= 
   GST 
========================================================= */

const getGST = (item) => {
    const product = getProductObject(item);

    return Number(
        item?.gstPercentage ??
        item?.gst ??
        item?.rental?.gstPercentage ??
        item?.rental?.gst ??
        item?.rentalDetails?.gstPercentage ??
        item?.rentalDetails?.gst ??
        product?.gstPercentage ??
        product?.gst ??
        product?.rental?.gstPercentage ??
        product?.rental?.gst ??
        0
    );
};

/* ========================================================= 
   AVAILABLE QUANTITY 
========================================================= */

const getAvailableQuantity = (item) => {
    const product = getProductObject(item);

    return Number(
        item?.availableQuantity ??
        item?.availableQty ??
        item?.availableStock ??
        item?.rental?.availableQuantity ??
        item?.rentalDetails?.availableQuantity ??
        product?.availableQuantity ??
        product?.rental?.availableQuantity ??
        product?.rentalDetails?.availableQuantity ??
        item?.quantity ??
        0
    );
};

/* ========================================================= 
   RENTAL PRODUCT CHECK 
========================================================= */

const isRentalProduct = (item) => {
    if (!item) return false;

    const product = getProductObject(item);

    const productType = String(item?.productType ?? product?.productType ?? "")
        .trim()
        .toUpperCase();

    if (productType === "RENTAL") return true;
    if (item?.rentalProductId) return true;

    if (
        item?.monthlyRent !== undefined ||
        item?.securityDeposit !== undefined ||
        item?.minimumRentalMonths !== undefined ||
        item?.isAvailableForRent !== undefined
    ) {
        return true;
    }

    if (item?.rental || item?.rentalDetails) return true;

    return false;
};

/* ========================================================= 
   IMAGE 
========================================================= */

const getImageUrl = (item) => {
    const product = getProductObject(item);

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

    if (Array.isArray(product?.images) && product.images.length > 0) {
        image = product.images[0];
    }

    if (Array.isArray(item?.images) && item.images.length > 0) {
        image = item.images[0];
    }

    if (typeof image === "object" && image !== null) {
        image = image?.url || image?.path || image?.fileUrl || image?.src || "";
    }

    if (!image) return "";

    const imageString = String(image).trim();

    if (imageString.startsWith("http://") || imageString.startsWith("https://")) {
        return imageString;
    }

    const serverUrl = String(API).replace(/\/api\/?$/, "").replace(/\/$/, "");
    const cleanPath = imageString.replace(/^\/+/, "");

    if (!serverUrl) return `/${cleanPath}`;

    return `${serverUrl}/${cleanPath}`;
};

/* ========================================================= 
   MONEY 
========================================================= */

const money = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
};

/* ========================================================= 
   COMPONENT 
========================================================= */

function WalkInRental() {
    const navigate = useNavigate();

    /* BASIC STATE */
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    /* CART — array of { rentalProductId, productId, product, quantity } 
       INDIVIDUAL: sirf 1 laptop (1 unit). 
       COMPANY: maximum 10 units total (alag alag laptops mila kar). */
    const [cart, setCart] = useState([]);

    /* CUSTOMER TYPE */
    const [customerType, setCustomerType] = useState("INDIVIDUAL");

    /* CUSTOMER DETAILS */
    const [individualDetails, setIndividualDetails] = useState({ ...EMPTY_INDIVIDUAL });
    const [companyDetails, setCompanyDetails] = useState({ ...EMPTY_COMPANY });

    /* RENTAL DURATION — shared across the whole order */
    const [rentalDurationType, setRentalDurationType] = useState("DAYS");
    const [rentalDuration, setRentalDuration] = useState(1);

    /* HANDOVER NOTES */
    const [handoverDescription, setHandoverDescription] = useState("");

    /* DEPOSIT PAYMENT */
    const [depositPaid, setDepositPaid] = useState(false);
    const [depositAmountPaid, setDepositAmountPaid] = useState(0);
    const [depositPaymentMethod, setDepositPaymentMethod] = useState("CASH");
    const [depositPaymentReference, setDepositPaymentReference] = useState("");

    /* FIRST RENT INSTALLMENT PAYMENT (pehle month ka rent abhi liya ya nahi) */
    const [rentPaidNow, setRentPaidNow] = useState(false);
    const [rentPaymentMethod, setRentPaymentMethod] = useState("CASH");
    const [rentPaymentReference, setRentPaymentReference] = useState("");

    const maxUnits = customerType === "COMPANY" ? MAX_UNITS_COMPANY : MAX_UNITS_INDIVIDUAL;

    const cartTotalUnits = useMemo(
        () => cart.reduce((sum, c) => sum + c.quantity, 0),
        [cart]
    );

    /* DOCUMENT CONFIG — Office ID / College ID share ONE upload field in the UI, 
       but the backend only recognizes the exact types "OFFICE_ID" / "COLLEGE_ID" — 
       so this entry carries a toggle (officeOrCollegeType) that decides which of 
       those two valid types gets sent when the file is actually uploaded. */
    const DOCUMENT_CONFIG = {
        INDIVIDUAL: [
            { key: "PASSPORT_PHOTO", label: "Passport Size Photograph", accept: "image/*" },
            { key: "PAN_CARD", label: "PAN Card", accept: "image/*,.pdf" },
            { key: "AADHAAR_CARD", label: "Aadhaar Card", accept: "image/*,.pdf" },
            { key: "HOUSE_RENTAL_AGREEMENT", label: "House Rental Agreement", accept: "image/*,.pdf" },
            {
                key: "OFFICE_OR_COLLEGE_ID",
                label: "Office ID / College ID (any one)",
                accept: "image/*,.pdf",
                isOfficeOrCollege: true,
            },
        ],
        COMPANY: [
            { key: "PAN_CARD", label: "PAN Card", accept: "image/*,.pdf" },
            { key: "AADHAAR_CARD", label: "Authorized Person Aadhaar Card", accept: "image/*,.pdf" },
            { key: "GST_REGISTRATION", label: "GST Registration", accept: "image/*,.pdf" },
            { key: "OFFICE_ID", label: "Office ID", accept: "image/*,.pdf" },
            { key: "AUTHORIZATION_LETTER", label: "Authorization Letter", accept: "image/*,.pdf" },
        ],
    };

    const [documents, setDocuments] = useState({});

    // Which real backend type the merged Office/College ID slot currently represents.
    const [officeOrCollegeType, setOfficeOrCollegeType] = useState("OFFICE_ID");

    const currentDocuments = DOCUMENT_CONFIG[customerType] || DOCUMENT_CONFIG.INDIVIDUAL;

    // The document key actually sent to the backend for a given config entry —
    // every entry uses its own key, except the merged Office/College slot, which
    // resolves to whichever of the two valid backend types the user picked.
    const resolveBackendDocType = (documentConfig) =>
        documentConfig.isOfficeOrCollege ? officeOrCollegeType : documentConfig.key;

    /* DOCUMENT CHANGE */
    const handleDocumentChange = (documentType, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, WEBP or PDF files are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            toast.error("Document size must be less than 10 MB.");
            event.target.value = "";
            return;
        }

        setDocuments((previous) => ({
            ...previous,
            [documentType]: file,
        }));
    };

    /* VALIDATE DOCUMENTS */
    const validateDocuments = () => {
        for (const documentConfig of currentDocuments) {
            if (!documents[documentConfig.key]) {
                toast.error(`Please upload ${documentConfig.label}.`);
                return false;
            }
        }

        return true;
    };

    /* UPLOAD DOCUMENTS — sirf pehle rental par upload hota hai,
       backend same order ke baaki laptops par khud copy kar deta hai. */

const uploadAllDocuments = async (rentalId) => {
    if (!rentalId) {
        throw new Error("Rental ID is missing");
    }

    const uploadResults = [];

    for (const documentConfig of currentDocuments) {
        const file = documents[documentConfig.key];

        if (!file) {
            throw new Error(
                `Please upload ${documentConfig.label}.`
            );
        }

        // Office/College ID ke liye actual backend type use karein.
        const documentType = resolveBackendDocType(documentConfig);

        console.log("Uploading rental document:", {
            rentalId,
            documentType,
            fileName: file.name,
            fileSize: file.size,
        });

        const response = await uploadRentalDocument(
            rentalId,
            documentType,
            file
        );

        if (response?.success === false) {
            throw new Error(
                response.message || `Failed to upload ${documentConfig.label}.`
            );
        }

        uploadResults.push({
            type: documentType,
            fileName: file.name,
            response,
        });
    }

    console.log("ALL DOCUMENT UPLOAD RESULTS:", uploadResults);

    return uploadResults;
};

    /* LOAD PRODUCTS */
    const loadProducts = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getRentalProducts();

            const list = getFirstArray(response);
            const rentalOnly = list.filter(isRentalProduct);

            setProducts(rentalOnly);

            // Drop cart items whose product no longer exists / is no longer rentable,
            // and clamp quantities to the latest available stock.
            setCart((previousCart) =>
                previousCart
                    .map((cartItem) => {
                        const fresh = rentalOnly.find(
                            (p) => getRentalProductId(p) === cartItem.rentalProductId
                        );

                        if (!fresh) return null;

                        const available = getAvailableQuantity(fresh);

                        if (available <= 0) return null;

                        return {
                            ...cartItem,
                            product: fresh,
                            quantity: Math.min(cartItem.quantity, available),
                        };
                    })
                    .filter(Boolean)
            );
        } catch (error) {
            console.error("LOAD RENTAL PRODUCTS ERROR:", error);

            if (!showRefresh) {
                setProducts([]);
            }

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
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

    /* Reset deposit / rent payment fields whenever the cart changes — never auto-mark as paid */
    useEffect(() => {
        setDepositPaid(false);
        setDepositAmountPaid(0);
        setDepositPaymentMethod("CASH");
        setDepositPaymentReference("");

        setRentPaidNow(false);
        setRentPaymentMethod("CASH");
        setRentPaymentReference("");
    }, [cartTotalUnits]);

    /* SEARCH FILTER */
    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return products;

        return products.filter((item) => {
            const name = String(getProductName(item)).toLowerCase();
            const brand = String(getBrand(item)).toLowerCase();
            const sku = String(getSku(item)).toLowerCase();

            return name.includes(keyword) || brand.includes(keyword) || sku.includes(keyword);
        });
    }, [products, search]);

    /* CART HELPERS */
    const getCartQuantity = (rentalProductId) => {
        const found = cart.find((c) => c.rentalProductId === rentalProductId);
        return found ? found.quantity : 0;
    };

    const limitMessage =
        customerType === "COMPANY"
            ? `Company can rent a maximum of ${MAX_UNITS_COMPANY} laptops in one order.`
            : "Individual customer can rent only 1 laptop at a time.";

    const addToCart = (item) => {
        if (!isRentalProduct(item)) {
            toast.error("Only rental products can be selected.");
            return;
        }

        const available = getAvailableQuantity(item);

        if (available <= 0) {
            toast.error("This rental laptop is out of stock.");
            return;
        }

        if (cartTotalUnits >= maxUnits) {
            toast.error(limitMessage);
            return;
        }

        const rentalProductId = getRentalProductId(item);
        const productId = getProductId(item);

        setCart((previous) => {
            const existingIndex = previous.findIndex(
                (c) => c.rentalProductId === rentalProductId
            );

            if (existingIndex >= 0) {
                const next = [...previous];
                const current = next[existingIndex];

                if (current.quantity >= available) {
                    toast.error(`Only ${available} unit(s) available in stock.`);
                    return previous;
                }

                next[existingIndex] = { ...current, quantity: current.quantity + 1 };
                return next;
            }

            return [
                ...previous,
                {
                    rentalProductId,
                    productId,
                    product: item,
                    quantity: 1,
                },
            ];
        });

        // First laptop added to a fresh order — set sensible default duration.
        if (cart.length === 0) {
            const minimum = getMinimumMonths(item);

            if (customerType === "INDIVIDUAL") {
                setRentalDurationType("DAYS");
                setRentalDuration(1);
            } else {
                setRentalDurationType("MONTHS");
                setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimum));
            }
        }
    };

    const increaseCartQuantity = (rentalProductId) => {
        if (cartTotalUnits >= maxUnits) {
            toast.error(limitMessage);
            return;
        }

        setCart((previous) =>
            previous.map((c) => {
                if (c.rentalProductId !== rentalProductId) return c;

                const available = getAvailableQuantity(c.product);

                if (c.quantity >= available) {
                    toast.error(`Only ${available} unit(s) available in stock.`);
                    return c;
                }

                return { ...c, quantity: c.quantity + 1 };
            })
        );
    };

    const decreaseCartQuantity = (rentalProductId) => {
        setCart((previous) =>
            previous
                .map((c) =>
                    c.rentalProductId === rentalProductId
                        ? { ...c, quantity: c.quantity - 1 }
                        : c
                )
                .filter((c) => c.quantity > 0)
        );
    };

    const removeFromCart = (rentalProductId) => {
        setCart((previous) => previous.filter((c) => c.rentalProductId !== rentalProductId));
    };

    const clearCart = () => {
        setCart([]);
        setRentalDurationType(customerType === "INDIVIDUAL" ? "DAYS" : "MONTHS");
        setRentalDuration(customerType === "INDIVIDUAL" ? 1 : COMPANY_MIN_MONTHS);
        setHandoverDescription("");
        setDocuments({});
        setDepositPaid(false);
        setDepositAmountPaid(0);
        setDepositPaymentMethod("CASH");
        setDepositPaymentReference("");
        setRentPaidNow(false);
        setRentPaymentMethod("CASH");
        setRentPaymentReference("");
    };

    const handleIndividualChange = (event) => {
        const { name, value } = event.target;
        setIndividualDetails((previous) => ({ ...previous, [name]: value }));
    };

    const handleCompanyChange = (event) => {
        const { name, value } = event.target;
        setCompanyDetails((previous) => ({ ...previous, [name]: value }));
    };

    const handleCustomerTypeChange = (type) => {
        setCustomerType(type);
        setDocuments({});

        const minimum =
            cart.length > 0
                ? Math.max(...cart.map((c) => getMinimumMonths(c.product)))
                : COMPANY_MIN_MONTHS;

        if (type === "COMPANY") {
            setRentalDurationType("MONTHS");
            setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimum));
        } else {
            setRentalDurationType("DAYS");
            setRentalDuration(1);

            // Individual = sirf 1 laptop. Pehla laptop rakho, baaki hata do.
            if (cartTotalUnits > MAX_UNITS_INDIVIDUAL) {
                setCart((previous) =>
                    previous.slice(0, 1).map((c) => ({ ...c, quantity: 1 }))
                );

                toast.info("Individual customer can rent only 1 laptop. Extra laptops were removed.");
            }
        }
    };

    /* Highest minimum-months across every laptop currently in the cart */
    const minimumMonths = useMemo(() => {
        if (cart.length === 0) return COMPANY_MIN_MONTHS;
        return Math.max(...cart.map((c) => getMinimumMonths(c.product)));
    }, [cart]);

    const decreaseDuration = () => {
        setRentalDuration((previous) => {
            const minimum =
                rentalDurationType === "MONTHS"
                    ? Math.max(COMPANY_MIN_MONTHS, minimumMonths)
                    : 1;
            return Math.max(minimum, Number(previous) - 1);
        });
    };

    const increaseDuration = () => {
        setRentalDuration((previous) => Number(previous) + 1);
    };

    const handleDurationTypeChange = (event) => {
        const type = event.target.value;

        if (customerType === "COMPANY" && type === "DAYS") {
            toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
            return;
        }

        setRentalDurationType(type);

        if (type === "DAYS") {
            setRentalDuration(1);
        } else {
            setRentalDuration(Math.max(COMPANY_MIN_MONTHS, minimumMonths));
        }
    };

    /* PRICING — computed per cart line, then totalled */
    const pricing = useMemo(() => {
        if (cart.length === 0) {
            return {
                items: [],
                duration: rentalDuration,
                durationType: rentalDurationType,
                rentSubtotal: 0,
                gstAmount: 0,
                securityDeposit: 0,
                totalAmount: 0,
                installmentCount: 0,
                firstInstallmentTotal: 0,
            };
        }

        const duration = Number(rentalDuration) || 1;

        const items = cart.map((cartItem) => {
            const monthlyRent = getMonthlyRent(cartItem.product);
            const dailyRent = monthlyRent / 30;
            const unitDeposit = getSecurityDeposit(cartItem.product);
            const gstPercentage = getGST(cartItem.product);
            const quantity = cartItem.quantity;

            let lineRent =
                rentalDurationType === "DAYS"
                    ? dailyRent * duration * quantity
                    : monthlyRent * duration * quantity;

            lineRent = Number(lineRent.toFixed(2));

            const lineDeposit = Number((unitDeposit * quantity).toFixed(2));
            const lineGst = Number(((lineRent * gstPercentage) / 100).toFixed(2));
            const lineTotal = Number((lineRent + lineGst + lineDeposit).toFixed(2));

            // Pehli installment: MONTHS = 1 mahine ka rent, DAYS = poora rent
            const firstRent =
                rentalDurationType === "DAYS"
                    ? lineRent
                    : Number((monthlyRent * quantity).toFixed(2));

            const firstGst = Number(((firstRent * gstPercentage) / 100).toFixed(2));

            return {
                rentalProductId: cartItem.rentalProductId,
                productId: cartItem.productId,
                name: getProductName(cartItem.product),
                quantity,
                monthlyRent,
                dailyRent: Number(dailyRent.toFixed(2)),
                unitDeposit,
                gstPercentage,
                lineRent,
                lineGst,
                lineDeposit,
                lineTotal,
                firstInstallment: Number((firstRent + firstGst).toFixed(2)),
            };
        });

        const rentSubtotal = Number(items.reduce((sum, i) => sum + i.lineRent, 0).toFixed(2));
        const gstAmount = Number(items.reduce((sum, i) => sum + i.lineGst, 0).toFixed(2));
        const securityDeposit = Number(
            items.reduce((sum, i) => sum + i.lineDeposit, 0).toFixed(2)
        );
        const totalAmount = Number((rentSubtotal + gstAmount + securityDeposit).toFixed(2));
        const firstInstallmentTotal = Number(
            items.reduce((sum, i) => sum + i.firstInstallment, 0).toFixed(2)
        );

        return {
            items,
            duration,
            durationType: rentalDurationType,
            rentSubtotal,
            gstAmount,
            securityDeposit,
            totalAmount,
            installmentCount: rentalDurationType === "MONTHS" ? duration : 1,
            firstInstallmentTotal,
        };
    }, [cart, rentalDuration, rentalDurationType]);

    const depositStatus = useMemo(() => {
        const expected = Number(pricing.securityDeposit || 0);
        const paid = Number(depositAmountPaid || 0);

        if (expected <= 0) return "PAID";
        if (!depositPaid || paid <= 0) return "UNPAID";
        if (paid >= expected) return "PAID";

        return "PARTIAL";
    }, [pricing.securityDeposit, depositAmountPaid, depositPaid]);

    const depositBalance = useMemo(() => {
        const expected = Number(pricing.securityDeposit || 0);
        const paid = Number(depositAmountPaid || 0);

        return Math.max(expected - paid, 0);
    }, [pricing.securityDeposit, depositAmountPaid]);

    const handleDepositPaidChange = (event) => {
        const checked = event.target.checked;

        setDepositPaid(checked);

        if (checked) {
            setDepositAmountPaid(Number(pricing.securityDeposit || 0));
            setDepositPaymentMethod("CASH");
        } else {
            setDepositAmountPaid(0);
            setDepositPaymentMethod("NONE");
            setDepositPaymentReference("");
        }
    };

    const handleDepositAmountChange = (event) => {
        const value = event.target.value;

        if (value === "") {
            setDepositAmountPaid("");
            return;
        }

        const amount = Number(value);

        if (Number.isNaN(amount) || amount < 0) return;

        setDepositAmountPaid(amount);
    };

    const handleRentPaidChange = (event) => {
        const checked = event.target.checked;

        setRentPaidNow(checked);

        if (checked) {
            setRentPaymentMethod("CASH");
        } else {
            setRentPaymentReference("");
        }
    };

    /* VALIDATE FORM */
    const validateForm = () => {
        if (cart.length === 0) {
            toast.error("Please select at least one rental laptop.");
            return false;
        }

        if (cartTotalUnits > maxUnits) {
            toast.error(limitMessage);
            return false;
        }

        for (const cartItem of cart) {
            const freshProduct =
                products.find((p) => getRentalProductId(p) === cartItem.rentalProductId) ||
                cartItem.product;

            const availableStock = getAvailableQuantity(freshProduct);

            if (availableStock <= 0) {
                toast.error(`${getProductName(freshProduct)} is out of stock.`);
                return false;
            }

            if (cartItem.quantity > availableStock) {
                toast.error(
                    `Only ${availableStock} unit(s) of ${getProductName(freshProduct)} available.`
                );
                return false;
            }
        }

        if (!["DAYS", "MONTHS"].includes(rentalDurationType)) {
            toast.error("Please select a valid rental duration type.");
            return false;
        }

        if (Number(rentalDuration) < 1) {
            toast.error("Rental duration must be at least 1.");
            return false;
        }

        if (customerType === "COMPANY") {
            if (rentalDurationType !== "MONTHS") {
                toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
                return false;
            }

            if (Number(rentalDuration) < COMPANY_MIN_MONTHS) {
                toast.error(`Company rental must be for a minimum of ${COMPANY_MIN_MONTHS} months.`);
                return false;
            }

            if (Number(rentalDuration) < minimumMonths) {
                toast.error(`Minimum rental period is ${minimumMonths} months.`);
                return false;
            }
        }

        if (customerType === "INDIVIDUAL") {
            if (rentalDurationType === "MONTHS" && Number(rentalDuration) < minimumMonths) {
                toast.error(`Minimum rental period is ${minimumMonths} months.`);
                return false;
            }

            if (!individualDetails.fullName.trim()) {
                toast.error("Please enter customer name.");
                return false;
            }

            if (!individualDetails.phone.trim()) {
                toast.error("Please enter customer phone.");
                return false;
            }
        }

        if (customerType === "COMPANY") {
            if (!companyDetails.companyName.trim()) {
                toast.error("Please enter company name.");
                return false;
            }

            if (!companyDetails.contactPerson.trim()) {
                toast.error("Please enter contact person.");
                return false;
            }

            if (!companyDetails.phone.trim()) {
                toast.error("Please enter company phone.");
                return false;
            }
        }

        const expectedDeposit = Number(pricing.securityDeposit || 0);
        const paidDeposit = Number(depositAmountPaid || 0);

        if (expectedDeposit > 0) {
            if (depositPaid) {
                if (paidDeposit <= 0) {
                    toast.error("Please enter the deposit amount paid.");
                    return false;
                }

                if (paidDeposit > expectedDeposit) {
                    toast.error(`Deposit paid cannot be more than ${money(expectedDeposit)}.`);
                    return false;
                }

                if (
                    !["CASH", "UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(
                        depositPaymentMethod
                    )
                ) {
                    toast.error("Please select a valid deposit payment method.");
                    return false;
                }

                if (
                    ["UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(depositPaymentMethod) &&
                    !depositPaymentReference.trim()
                ) {
                    toast.error("Please enter payment reference / transaction number.");
                    return false;
                }
            } else {
                if (paidDeposit > 0) {
                    toast.error("Please mark Deposit Paid if you are entering a paid amount.");
                    return false;
                }
            }
        }

        if (rentPaidNow) {
            if (
                !["CASH", "UPI", "CARD", "BANK_TRANSFER", "ONLINE"].includes(rentPaymentMethod)
            ) {
                toast.error("Please select a valid rent payment method.");
                return false;
            }

            if (rentPaymentMethod !== "CASH" && !rentPaymentReference.trim()) {
                toast.error("Please enter rent payment reference / transaction number.");
                return false;
            }
        }

        return true;
    };

    /* RESET */
    const resetForm = () => {
        setCart([]);
        setSearch("");
        setCustomerType("INDIVIDUAL");

        setIndividualDetails({ ...EMPTY_INDIVIDUAL });
        setCompanyDetails({ ...EMPTY_COMPANY });

        setRentalDurationType("DAYS");
        setRentalDuration(1);

        setHandoverDescription("");
        setDocuments({});

        setDepositPaid(false);
        setDepositAmountPaid(0);
        setDepositPaymentMethod("CASH");
        setDepositPaymentReference("");

        setRentPaidNow(false);
        setRentPaymentMethod("CASH");
        setRentPaymentReference("");
    };

    /* SUBMIT — ek hi API call me poora order. 
       Backend har laptop ka alag rental + month-wise rent schedule banata hai. */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;
        if (!validateForm()) return;
        if (!validateDocuments()) return;

        try {
            setSubmitting(true);

            const totalDeposit = Number(pricing.securityDeposit || 0);
            const paidDeposit = depositPaid ? Number(depositAmountPaid || 0) : 0;

            const payload = {
                rentalSource: "WALK_IN",
                customerType,

                items: cart.map((c) => ({
                    rentalProductId: c.rentalProductId,
                    quantity: c.quantity,
                })),

                individualDetails:
                    customerType === "INDIVIDUAL"
                        ? {
                            fullName: individualDetails.fullName.trim(),
                            phone: individualDetails.phone.trim(),
                            email: individualDetails.email.trim().toLowerCase(),
                            address: individualDetails.address.trim(),
                        }
                        : undefined,

                companyDetails:
                    customerType === "COMPANY"
                        ? {
                            companyName: companyDetails.companyName.trim(),
                            contactPerson: companyDetails.contactPerson.trim(),
                            phone: companyDetails.phone.trim(),
                            email: companyDetails.email.trim().toLowerCase(),
                            officeAddress: companyDetails.officeAddress.trim(),
                            gstNumber: companyDetails.gstNumber.trim().toUpperCase(),
                        }
                        : undefined,

                rentalDurationType,
                rentalDuration: Number(pricing.duration),

                // Deposit (poore order ka total — backend laptops me baant deta hai)
                depositAmountPaid: paidDeposit,
                depositPaymentMethod: paidDeposit > 0 ? depositPaymentMethod : "NONE",
                depositPaymentReference: paidDeposit > 0 ? depositPaymentReference.trim() : "",

                // Pehli rent installment abhi li ya nahi
                rentPaidNow,
                rentPaymentMethod: rentPaidNow ? rentPaymentMethod : "",
                rentPaymentReference: rentPaidNow ? rentPaymentReference.trim() : "",

                notes: handoverDescription.trim(),
                handoverNotes: handoverDescription.trim(),
            };

            const response = await createWalkInRentalRequest(payload);

            console.log("WALK-IN CREATE RESPONSE (full):", response);

            // const { rentals: createdRentals, warnings } = extractCreatedOrder(response);

            // if (createdRentals.length === 0) {
            //     console.warn("WALK-IN CREATE: rentals not found in response:", response);

            //     toast.warning(
            //         "Rental was created, but its details could not be read from the server response. " +
            //         "Documents were NOT uploaded - open the rental and upload them from there."
            //     );

            //     await loadProducts(true);
            //     navigate("/receptionist-dashboard/rental/orders");
            //     return;
            // }

           
console.log(
    "WALK-IN CREATE RESPONSE (JSON):",
    JSON.stringify(response, null, 2)
);

// const extractCreatedOrderSafe = (res) => {
//     const candidates = [
//         res?.data,
//         res?.data?.data,
//         res?.data?.rental,
//         res?.data?.data?.rental,
//         res?.data?.rentals,
//         res?.data?.data?.rentals,
//         res?.rental,
//         res?.rentals,
//         res,
//     ];

//     for (const candidate of candidates) {
//         if (Array.isArray(candidate)) {
//             const validRentals = candidate.filter(
//                 (item) => item && (item._id || item.id)
//             );

//             if (validRentals.length) {
//                 return validRentals;
//             }
//         }

//         if (candidate && typeof candidate === "object") {
//             if (candidate._id || candidate.id) {
//                 return [candidate];
//             }

//             if (Array.isArray(candidate.rentals)) {
//                 const validRentals = candidate.rentals.filter(
//                     (item) => item && (item._id || item.id)
//                 );

//                 if (validRentals.length) {
//                     return validRentals;
//                 }
//             }
//         }
//     }

//     return [];
// };



const extractCreatedOrderSafe = (response) => {
  const queue = [response];
  const visited = new Set();

  for (let depth = 0; depth < 8 && queue.length; depth++) {
    const next = [];

    for (const node of queue) {
      if (!node || typeof node !== "object" || visited.has(node)) {
        continue;
      }

      visited.add(node);

      // Backend: { orderId, rentals: [...] }
      if (Array.isArray(node.rentals)) {
        const validRentals = node.rentals.filter(
          (rental) =>
            rental &&
            typeof rental === "object" &&
            (rental._id || rental.id)
        );

        if (validRentals.length > 0) {
          return validRentals;
        }
      }

      // Backend: { rental: {...} }
      if (
        node.rental &&
        typeof node.rental === "object" &&
        (node.rental._id || node.rental.id)
      ) {
        return [node.rental];
      }

      // Direct rental object
      if (
        (node._id || node.id) &&
        (node.rentalNumber ||
          node.rentalProductId ||
          node.customerType ||
          node.orderId)
      ) {
        return [node];
      }

      // Search common response wrappers
      for (const key of [
        "data",
        "result",
        "payload",
        "response",
        "body",
      ]) {
        if (node[key] && typeof node[key] === "object") {
          next.push(node[key]);
        }
      }
    }

    queue.push(...next);
  }

  return [];
};

const createdRentals = extractCreatedOrderSafe(response);


const warnings =
  response?.data?.warnings ||
  response?.data?.data?.warnings ||
  response?.warnings ||
  [];

console.log("EXTRACTED CREATED RENTALS:", createdRentals);
console.log(
  "EXTRACTED RENTAL IDS:",
  createdRentals.map((rental) => rental._id || rental.id)
);

if (createdRentals.length === 0) {
  console.error(
    "Rental response does not contain a recognizable rental ID:",
    response
  );

  toast.error(
    "Rental ID response mein nahi mili. Backend response aur database insert check karein."
  );

  await loadProducts(true);
  return;
}
// const warnings = response?.warnings || response?.data?.warnings || [];

// console.log("EXTRACTED CREATED RENTALS:", createdRentals);

// if (createdRentals.length === 0) {
//     console.error(
//         "Rental response does not contain a recognizable rental ID:",
//         response
//     );

//     toast.error(
//         "Rental create response mein rental ID nahi mili. Console mein response check karein."
//     );

//     await loadProducts(true);
//     return;
// }



            /* SECURITY DEPOSIT PAYMENT RECORD for each rental unit */
            let anyDepositPaymentFailed = false;

            for (const rental of createdRentals) {
                const allocated = Number(rental?.depositAmountPaid || 0);

                if (allocated <= 0) continue;

                try {
                    const databasePaymentMethod =
                        depositPaymentMethod === "BANK_TRANSFER"
                            ? "NET_BANKING"
                            : depositPaymentMethod === "ONLINE"
                                ? "UPI"
                                : depositPaymentMethod;

                    const paymentResponse = await createPayment({
                        paymentFor: "RENTAL",
                        paymentType: "SECURITY_DEPOSIT",
                        referenceId: rental._id,
                        amount: allocated,
                        paymentMethod: databasePaymentMethod,
                        paymentStatus: "SUCCESS",
                        paymentDate: new Date().toISOString(),
                        paidAt: new Date().toISOString(),
                        gateway: "",
                        transactionId: depositPaymentReference.trim(),
                        gatewayPaymentId: "",
                    });

                    if (!paymentResponse?.success || !paymentResponse?.payment) {
                        throw new Error(
                            paymentResponse?.message ||
                            "Security deposit payment record could not be created."
                        );
                    }
                } catch (paymentError) {
                    console.error("DEPOSIT PAYMENT RECORD ERROR:", paymentError);
                    anyDepositPaymentFailed = true;
                }
            }

            /* DOCUMENTS — sirf pehle rental par; backend baaki laptops par copy karta hai */
            let documentsFailed = false;

            try {
                // await uploadAllDocuments(createdRentals[0]._id || createdRentals[0].id);

             const firstRentalId =
  createdRentals[0]?._id || createdRentals[0]?.id;

if (!firstRentalId) {
  throw new Error("Created rental ka database ID nahi mila.");
}

await uploadAllDocuments(String(firstRentalId));

            } catch (documentError) {
                console.error("UPLOAD RENTAL DOCUMENTS ERROR:", documentError);
                documentsFailed = true;
            }

            if (anyDepositPaymentFailed) {
                toast.warning(
                    "Rentals created, but some deposit payment records could not be saved."
                );
            }

            if (documentsFailed) {
                toast.warning(
                    "Rentals created, but documents could not be uploaded. Please upload them again from rental details."
                );
            }

            warnings.forEach((warning) => toast.warning(warning));

            let successMessage =
                createdRentals.length > 1
                    ? `${createdRentals.length} rentals created successfully.`
                    : "Rental created successfully.";

            if (totalDeposit > 0) {
                if (paidDeposit >= totalDeposit) {
                    successMessage += ` Deposit ${money(paidDeposit)} received.`;
                } else if (paidDeposit > 0) {
                    successMessage += ` Partial deposit ${money(paidDeposit)} received.`;
                } else {
                    successMessage += " Deposit is unpaid.";
                }
            }

            if (rentPaidNow) {
                successMessage += ` First rent ${money(pricing.firstInstallmentTotal)} received.`;
            }

            toast.success(successMessage);

            await loadProducts(true);

            navigate("/receptionist-dashboard/rental/orders", {
                state: {
                    rentals: createdRentals,
                },
            });
        } catch (error) {
            console.error("CREATE WALK-IN RENTAL ERROR:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Failed to create walk-in rental.";

            toast.error(message);

            // Stock badal gaya ho sakta hai — taaza stock dikhao
            loadProducts(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate("/receptionist-dashboard");
    };

    if (loading) {
        return (
            <div className="wir-loading-page">
                <FaSpinner className="wir-spin" />
                <h2>Loading rental laptops...</h2>
                <p>Please wait while rental inventory is loaded.</p>
            </div>
        );
    }

    const limitReached = cartTotalUnits >= maxUnits;

    return (
        <div className="wir-page">
            <header className="wir-header">
                <div className="wir-header-left">
                    <button type="button" className="wir-back-btn" onClick={handleBack}>
                        <FaArrowLeft />
                        Back
                    </button>

                    <div>
                        <h1 className="wir-header-title">Walk-In Rental</h1>
                        <p className="wir-header-subtitle">Create rental for walk-in customer</p>
                    </div>
                </div>

                <div className="wir-source-badge">
                    <FaLaptop />
                    WALK-IN RENTAL
                </div>
            </header>

            <form className="wir-form" onSubmit={handleSubmit}>
                {/* CUSTOMER TYPE */}
                <section className="wir-card wir-customer-type-section">
                    <div className="wir-section-title">
                        <FaUser />
                        <div>
                            <h2>Customer Type</h2>
                            <p>Select individual or company customer</p>
                        </div>
                    </div>

                    <div className="wir-customer-type-grid">
                        <button
                            type="button"
                            className={
                                customerType === "INDIVIDUAL"
                                    ? "wir-type-card wir-type-card-active"
                                    : "wir-type-card"
                            }
                            onClick={() => handleCustomerTypeChange("INDIVIDUAL")}
                        >
                            <FaUser size={26} />
                            <strong>Individual</strong>
                            <span>1 laptop only</span>
                        </button>

                        <button
                            type="button"
                            className={
                                customerType === "COMPANY"
                                    ? "wir-type-card wir-type-card-active"
                                    : "wir-type-card"
                            }
                            onClick={() => handleCustomerTypeChange("COMPANY")}
                        >
                            <FaBuilding size={26} />
                            <strong>Company</strong>
                            <span>
                                Up to {MAX_UNITS_COMPANY} laptops • min {COMPANY_MIN_MONTHS} months
                            </span>
                        </button>
                    </div>
                </section>

                {/* RENTAL PRODUCT — multi-select with per-card quantity */}
                <section className="wir-card">
                    <div className="wir-section-title">
                        <FaLaptop />
                        <div>
                            <h2>Select Rental Laptops</h2>
                            <p>
                                {customerType === "COMPANY"
                                    ? `Add up to ${MAX_UNITS_COMPANY} laptops in total — selected ${cartTotalUnits}/${MAX_UNITS_COMPANY}`
                                    : "Individual customer can rent only 1 laptop"}
                            </p>
                        </div>
                    </div>

                    <div className="wir-search-box">
                        <FaSearch />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search laptop, brand or SKU..."
                        />

                        {search && (
                            <button type="button" onClick={() => setSearch("")}>
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
                            <FaRedo className={refreshing ? "wir-spin" : ""} />
                            {refreshing ? "Refreshing..." : "Refresh Stock"}
                        </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="wir-empty-products">
                            <FaLaptop size={42} />
                            <h3>{search ? "No rental laptop found" : "No rental laptops available"}</h3>
                            <p>
                                {search
                                    ? "Try another laptop name, brand or SKU."
                                    : "Please add rental products from admin panel."}
                            </p>
                        </div>
                    ) : (
                        <div className="wir-product-grid">
                            {filteredProducts.map((item) => {
                                const rentalId = getRentalProductId(item);
                                const image = getImageUrl(item);
                                const name = getProductName(item);
                                const brand = getBrand(item);
                                const sku = getSku(item);
                                const rent = getMonthlyRent(item);
                                const deposit = getSecurityDeposit(item);
                                const available = getAvailableQuantity(item);
                                const minimum = getMinimumMonths(item);
                                const inCartQuantity = getCartQuantity(rentalId);

                                return (
                                    <article
                                        key={rentalId}
                                        className={
                                            inCartQuantity > 0
                                                ? "wir-product-card wir-product-card-selected"
                                                : "wir-product-card"
                                        }
                                    >
                                        <div className="wir-product-image">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <FaLaptop size={30} />
                                            )}
                                        </div>

                                        <div className="wir-product-info">
                                            <span className="wir-product-brand">{brand || "Laptop"}</span>
                                            <h3>{name}</h3>
                                            <span className="wir-product-sku">SKU: {sku}</span>

                                            <div className="wir-product-prices">
                                                <span>Rent: {money(rent)} / month</span>
                                                <span>Deposit: {money(deposit)}</span>
                                                <span>Minimum: {minimum} months</span>
                                            </div>

                                            <span
                                                className={
                                                    available > 0
                                                        ? "wir-stock wir-stock-available"
                                                        : "wir-stock wir-stock-unavailable"
                                                }
                                            >
                                                {available > 0 ? `${available} Available` : "Out of Stock"}
                                            </span>

                                            {inCartQuantity > 0 ? (
                                                <div className="wir-stepper wir-product-stepper">
                                                    <button
                                                        type="button"
                                                        onClick={() => decreaseCartQuantity(rentalId)}
                                                    >
                                                        <FaMinus />
                                                    </button>

                                                    <div className="wir-stepper-value">
                                                        <strong>{inCartQuantity}</strong>
                                                        <span>unit{inCartQuantity > 1 ? "s" : ""}</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => increaseCartQuantity(rentalId)}
                                                        disabled={inCartQuantity >= available || limitReached}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="wir-submit-btn wir-product-select-btn"
                                                    onClick={() => addToCart(item)}
                                                    disabled={available <= 0 || limitReached}
                                                    title={limitReached ? limitMessage : ""}
                                                >
                                                    <FaShoppingCart />
                                                    Add to Order
                                                </button>
                                            )}
                                        </div>

                                        {inCartQuantity > 0 && (
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
                        {/* SELECTED LAPTOPS */}
                        <section className="wir-card">
                            <div className="wir-section-title">
                                <FaCheckCircle />
                                <div>
                                    <h2>Selected Laptops</h2>
                                    <p>
                                        {cart.length} laptop type(s) • {cartTotalUnits} of {maxUnits} unit(s)
                                    </p>
                                </div>
                            </div>

                            <div className="wir-cart-list">
                                {cart.map((cartItem) => {
                                    const available = getAvailableQuantity(cartItem.product);

                                    return (
                                        <div key={cartItem.rentalProductId} className="wir-cart-item">
                                            <div className="wir-cart-item-info">
                                                <strong>{getProductName(cartItem.product)}</strong>
                                                <span>
                                                    {getBrand(cartItem.product)} • SKU:{" "}
                                                    {getSku(cartItem.product)}
                                                </span>
                                            </div>

                                            <div className="wir-cart-item-actions">
                                                <div className="wir-stepper">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseCartQuantity(cartItem.rentalProductId)
                                                        }
                                                    >
                                                        <FaMinus />
                                                    </button>

                                                    <div className="wir-stepper-value">
                                                        <strong>{cartItem.quantity}</strong>
                                                        <span>unit{cartItem.quantity > 1 ? "s" : ""}</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseCartQuantity(cartItem.rentalProductId)
                                                        }
                                                        disabled={cartItem.quantity >= available || limitReached}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="wir-remove-cart-btn"
                                                    onClick={() => removeFromCart(cartItem.rentalProductId)}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button type="button" className="wir-cancel-btn" onClick={clearCart}>
                                <FaTimes />
                                Clear All
                            </button>
                        </section>

                        {/* CUSTOMER DETAILS */}
                        <section className="wir-card wir-customer-details-section">
                            <div className="wir-section-title">
                                {customerType === "INDIVIDUAL" ? <FaUser /> : <FaBuilding />}
                                <div>
                                    <h2>Customer Details</h2>
                                    <p>Enter walk-in customer information</p>
                                </div>
                            </div>

                            {customerType === "INDIVIDUAL" && (
                                <div className="wir-form-grid wir-customer-form-grid">
                                    <div className="wir-form-group">
                                        <label>Full Name *</label>
                                        <div className="wir-input-icon">
                                            <FaUser />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={individualDetails.fullName}
                                                onChange={handleIndividualChange}
                                                placeholder="Enter customer full name"
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>Phone *</label>
                                        <div className="wir-input-icon">
                                            <FaPhone />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={individualDetails.phone}
                                                onChange={handleIndividualChange}
                                                placeholder="Enter phone number"
                                                autoComplete="tel"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>Email</label>
                                        <div className="wir-input-icon">
                                            <FaEnvelope />
                                            <input
                                                type="email"
                                                name="email"
                                                value={individualDetails.email}
                                                onChange={handleIndividualChange}
                                                placeholder="customer@email.com"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group wir-form-group-full">
                                        <label>Address</label>
                                        <div className="wir-input-icon wir-textarea-icon">
                                            <FaMapMarkerAlt />
                                            <textarea
                                                name="address"
                                                value={individualDetails.address}
                                                onChange={handleIndividualChange}
                                                placeholder="Enter customer address"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {customerType === "COMPANY" && (
                                <div className="wir-form-grid wir-customer-form-grid">
                                    <div className="wir-form-group">
                                        <label>Company Name *</label>
                                        <div className="wir-input-icon">
                                            <FaBuilding />
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={companyDetails.companyName}
                                                onChange={handleCompanyChange}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>Contact Person *</label>
                                        <div className="wir-input-icon">
                                            <FaUser />
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={companyDetails.contactPerson}
                                                onChange={handleCompanyChange}
                                                placeholder="Enter contact person"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>Phone *</label>
                                        <div className="wir-input-icon">
                                            <FaPhone />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={companyDetails.phone}
                                                onChange={handleCompanyChange}
                                                placeholder="Enter company phone"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>Email</label>
                                        <div className="wir-input-icon">
                                            <FaEnvelope />
                                            <input
                                                type="email"
                                                name="email"
                                                value={companyDetails.email}
                                                onChange={handleCompanyChange}
                                                placeholder="company@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="wir-form-group">
                                        <label>GST Number</label>
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={companyDetails.gstNumber}
                                            onChange={handleCompanyChange}
                                            placeholder="GST number"
                                        />
                                    </div>

                                    <div className="wir-form-group wir-form-group-full">
                                        <label>Office Address</label>
                                        <div className="wir-input-icon wir-textarea-icon">
                                            <FaMapMarkerAlt />
                                            <textarea
                                                name="officeAddress"
                                                value={companyDetails.officeAddress}
                                                onChange={handleCompanyChange}
                                                placeholder="Enter office address"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* DOCUMENTS */}
                        <section className="wir-card wir-documents-section">
                            <div className="wir-section-title">
                                <FaShieldAlt />
                                <div>
                                    <h2>Customer Documents</h2>
                                    <p>Upload required documents for this rental</p>
                                </div>
                            </div>

                            <div className="wir-document-grid">
                                {currentDocuments.map((documentConfig) => {
                                    const selectedFile = documents[documentConfig.key];

                                    return (
                                        <div key={documentConfig.key} className="wir-document-card">
                                            <div className="wir-document-header">
                                                <strong>{documentConfig.label}</strong>
                                                <span>Required *</span>
                                            </div>

                                            {documentConfig.isOfficeOrCollege && (
                                                <div className="wir-doc-type-toggle">
                                                    <button
                                                        type="button"
                                                        className={
                                                            officeOrCollegeType === "OFFICE_ID"
                                                                ? "wir-doc-type-btn wir-doc-type-btn-active"
                                                                : "wir-doc-type-btn"
                                                        }
                                                        onClick={() => setOfficeOrCollegeType("OFFICE_ID")}
                                                    >
                                                        Office ID
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={
                                                            officeOrCollegeType === "COLLEGE_ID"
                                                                ? "wir-doc-type-btn wir-doc-type-btn-active"
                                                                : "wir-doc-type-btn"
                                                        }
                                                        onClick={() => setOfficeOrCollegeType("COLLEGE_ID")}
                                                    >
                                                        College ID
                                                    </button>
                                                </div>
                                            )}

                                            <label className="wir-document-file-label">
                                                <input
                                                    type="file"
                                                    accept={documentConfig.accept}
                                                    onChange={(event) =>
                                                        handleDocumentChange(documentConfig.key, event)
                                                    }
                                                />
                                                <span>{selectedFile ? selectedFile.name : "Choose document"}</span>
                                            </label>

                                            {selectedFile && (
                                                <div className="wir-document-selected">
                                                    <FaCheckCircle />
                                                    <span>{selectedFile.name}</span>

                                                    <button
                                                        type="button"
                                                        className="wir-document-remove-btn"
                                                        onClick={() => {
                                                            setDocuments((previous) => {
                                                                const next = { ...previous };
                                                                delete next[documentConfig.key];
                                                                return next;
                                                            });
                                                        }}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}

                                            <small>JPG, PNG, WEBP or PDF • Max 10 MB</small>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="wir-document-note">
                                <FaShieldAlt />
                                <span>
                                    These documents are uploaded once and are attached automatically to
                                    every laptop rental in this order.
                                </span>
                            </div>
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
                                        value={rentalDurationType}
                                        onChange={handleDurationTypeChange}
                                    >
                                        <option value="MONTHS">Months</option>
                                        {customerType === "INDIVIDUAL" && <option value="DAYS">Days</option>}
                                    </select>

                                    {customerType === "INDIVIDUAL" && (
                                        <small>Individual customers can rent for 1 or more days.</small>
                                    )}

                                    {customerType === "COMPANY" && (
                                        <small>
                                            Company rental minimum is {COMPANY_MIN_MONTHS} months (compulsory).
                                        </small>
                                    )}
                                </div>

                                <div className="wir-form-group">
                                    <label>Minimum Rental</label>
                                    <input
                                        type="text"
                                        value={
                                            rentalDurationType === "MONTHS"
                                                ? `${Math.max(COMPANY_MIN_MONTHS, minimumMonths)} months`
                                                : "1 day"
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="wir-form-group">
                                    <label>Rental Duration</label>
                                    <div className="wir-stepper">
                                        <button
                                            type="button"
                                            onClick={decreaseDuration}
                                            disabled={
                                                rentalDuration <=
                                                (rentalDurationType === "MONTHS"
                                                    ? Math.max(COMPANY_MIN_MONTHS, minimumMonths)
                                                    : 1)
                                            }
                                        >
                                            <FaMinus />
                                        </button>

                                        <div className="wir-stepper-value">
                                            <strong>{rentalDuration}</strong>
                                            <span>{rentalDurationType === "MONTHS" ? "months" : "days"}</span>
                                        </div>

                                        <button type="button" onClick={increaseDuration}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="wir-form-group wir-form-group-full">
                                    <label>Handover / Notes</label>
                                    <textarea
                                        value={handoverDescription}
                                        onChange={(event) => setHandoverDescription(event.target.value)}
                                        placeholder="Enter laptop condition, accessories, charger, bag or other handover notes..."
                                        rows={4}
                                    />
                                    <small>These notes will be saved with every rental in this order.</small>
                                </div>
                            </div>
                        </section>

                        {/* DEPOSIT PAYMENT */}
                        <section className="wir-card wir-deposit-section">
                            <div className="wir-section-title">
                                <FaShieldAlt />
                                <div>
                                    <h2>Security Deposit Payment</h2>
                                    <p>Record whether the total security deposit was received</p>
                                </div>
                            </div>

                            <div className="wir-deposit-box">
                                <div className="wir-deposit-header">
                                    <div>
                                        <span className="wir-deposit-label">
                                            Required Security Deposit (all units)
                                        </span>
                                        <strong>{money(pricing.securityDeposit)}</strong>
                                    </div>

                                    <div className={`wir-deposit-badge wir-deposit-badge-${depositStatus.toLowerCase()}`}>
                                        {depositStatus}
                                    </div>
                                </div>

                                <label className="wir-deposit-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={depositPaid}
                                        onChange={handleDepositPaidChange}
                                    />
                                    <span className="wir-custom-checkbox">
                                        {depositPaid && <FaCheckCircle />}
                                    </span>
                                    <div>
                                        <strong>Deposit Paid</strong>
                                        <small>Tick this only when customer has actually paid the deposit.</small>
                                    </div>
                                </label>

                                {depositPaid && (
                                    <div className="wir-form-grid wir-deposit-grid">
                                        <div className="wir-form-group">
                                            <label>Deposit Amount Paid *</label>
                                            <div className="wir-input-icon">
                                                <FaRupeeSign />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={depositAmountPaid}
                                                    onChange={handleDepositAmountChange}
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                            {depositBalance > 0 && (
                                                <small>Remaining deposit: {money(depositBalance)}</small>
                                            )}
                                        </div>

                                        <div className="wir-form-group">
                                            <label>Payment Method *</label>
                                            <div className="wir-input-icon">
                                                {depositPaymentMethod === "CASH" && <FaMoneyBillWave />}
                                                {depositPaymentMethod === "UPI" && <FaCreditCard />}
                                                {depositPaymentMethod === "CARD" && <FaCreditCard />}
                                                {depositPaymentMethod === "BANK_TRANSFER" && <FaUniversity />}
                                                {depositPaymentMethod === "ONLINE" && <FaCreditCard />}

                                                <select
                                                    value={depositPaymentMethod}
                                                    onChange={(event) =>
                                                        setDepositPaymentMethod(event.target.value)
                                                    }
                                                >
                                                    <option value="CASH">Cash</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="CARD">Card</option>
                                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                                    <option value="ONLINE">Online</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="wir-form-group wir-form-group-full">
                                            <label>
                                                Transaction / Payment Reference
                                                {depositPaymentMethod !== "CASH" ? " *" : ""}
                                            </label>
                                            <input
                                                type="text"
                                                value={depositPaymentReference}
                                                onChange={(event) =>
                                                    setDepositPaymentReference(event.target.value)
                                                }
                                                placeholder={
                                                    depositPaymentMethod === "CASH"
                                                        ? "Optional cash receipt/reference"
                                                        : "Enter UPI / transaction / reference number"
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {!depositPaid && (
                                    <div className="wir-deposit-unpaid-note">
                                        <FaShieldAlt />
                                        <div>
                                            <strong>Deposit not received</strong>
                                            <span>
                                                Rental can still be created. The deposit will be shown as unpaid and
                                                no refund will be calculated from an unpaid deposit.
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {depositStatus === "PARTIAL" && (
                                    <div className="wir-deposit-partial-note">
                                        <FaShieldAlt />
                                        <span>
                                            Partial deposit received: <strong>{money(depositAmountPaid)}</strong> of{" "}
                                            <strong>{money(pricing.securityDeposit)}</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* RENT PAYMENT (FIRST INSTALLMENT) */}
                        <section className="wir-card wir-deposit-section">
                            <div className="wir-section-title">
                                <FaRupeeSign />
                                <div>
                                    <h2>Rent Payment</h2>
                                    <p>
                                        {rentalDurationType === "MONTHS"
                                            ? `Rent is tracked month by month — ${pricing.installmentCount} installment(s)`
                                            : "Rent for the whole period is one installment"}
                                    </p>
                                </div>
                            </div>

                            <div className="wir-deposit-box">
                                <div className="wir-deposit-header">
                                    <div>
                                        <span className="wir-deposit-label">
                                            {rentalDurationType === "MONTHS"
                                                ? "First month rent (incl. GST, all units)"
                                                : "Total rent (incl. GST, all units)"}
                                        </span>
                                        <strong>{money(pricing.firstInstallmentTotal)}</strong>
                                    </div>

                                    <div
                                        className={`wir-deposit-badge wir-deposit-badge-${
                                            rentPaidNow ? "paid" : "unpaid"
                                        }`}
                                    >
                                        {rentPaidNow ? "PAID" : "UNPAID"}
                                    </div>
                                </div>

                                <label className="wir-deposit-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={rentPaidNow}
                                        onChange={handleRentPaidChange}
                                    />
                                    <span className="wir-custom-checkbox">
                                        {rentPaidNow && <FaCheckCircle />}
                                    </span>
                                    <div>
                                        <strong>
                                            {rentalDurationType === "MONTHS"
                                                ? "First Month Rent Paid"
                                                : "Rent Paid"}
                                        </strong>
                                        <small>
                                            Tick only if the customer has paid it now. Next months can be
                                            collected later from the rental's rent schedule.
                                        </small>
                                    </div>
                                </label>

                                {rentPaidNow && (
                                    <div className="wir-form-grid wir-deposit-grid">
                                        <div className="wir-form-group">
                                            <label>Payment Method *</label>
                                            <div className="wir-input-icon">
                                                <FaMoneyBillWave />
                                                <select
                                                    value={rentPaymentMethod}
                                                    onChange={(event) =>
                                                        setRentPaymentMethod(event.target.value)
                                                    }
                                                >
                                                    <option value="CASH">Cash</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="CARD">Card</option>
                                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                                    <option value="ONLINE">Online</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="wir-form-group">
                                            <label>
                                                Transaction / Payment Reference
                                                {rentPaymentMethod !== "CASH" ? " *" : ""}
                                            </label>
                                            <input
                                                type="text"
                                                value={rentPaymentReference}
                                                onChange={(event) =>
                                                    setRentPaymentReference(event.target.value)
                                                }
                                                placeholder={
                                                    rentPaymentMethod === "CASH"
                                                        ? "Optional cash receipt/reference"
                                                        : "Enter UPI / transaction / reference number"
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {!rentPaidNow && (
                                    <div className="wir-deposit-unpaid-note">
                                        <FaShieldAlt />
                                        <div>
                                            <strong>Rent not received yet</strong>
                                            <span>
                                                The first installment will stay pending and show as due today in
                                                the rent schedule.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* SUMMARY */}
                        <section className="wir-card wir-summary-card">
                            <div className="wir-section-title">
                                <FaRupeeSign />
                                <div>
                                    <h2>Rental Summary</h2>
                                    <p>Amount calculation</p>
                                </div>
                            </div>

                            <div className="wir-cart-summary-lines">
                                {pricing.items.map((item) => (
                                    <div key={item.rentalProductId} className="wir-cart-summary-line">
                                        <span>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <strong>{money(item.lineTotal)}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="wir-summary-lines">
                                <div>
                                    <span>Rental Period</span>
                                    <strong>
                                        {pricing.duration} {rentalDurationType === "MONTHS" ? "months" : "days"}
                                    </strong>
                                </div>

                                {rentalDurationType === "MONTHS" && (
                                    <div>
                                        <span>Monthly Installment (incl. GST)</span>
                                        <strong>{money(pricing.firstInstallmentTotal)}</strong>
                                    </div>
                                )}

                                <div>
                                    <span>Rental Amount</span>
                                    <strong>{money(pricing.rentSubtotal)}</strong>
                                </div>

                                <div>
                                    <span>GST</span>
                                    <strong>{money(pricing.gstAmount)}</strong>
                                </div>

                                <div>
                                    <span>Security Deposit</span>
                                    <strong>{money(pricing.securityDeposit)}</strong>
                                </div>

                                <div>
                                    <span>Deposit Paid</span>
                                    <strong
                                        className={
                                            depositStatus === "PAID"
                                                ? "wir-text-paid"
                                                : depositStatus === "PARTIAL"
                                                    ? "wir-text-partial"
                                                    : "wir-text-unpaid"
                                        }
                                    >
                                        {money(depositAmountPaid)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Deposit Remaining</span>
                                    <strong className={depositBalance > 0 ? "wir-text-partial" : "wir-text-paid"}>
                                        {money(depositBalance)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Deposit Status</span>
                                    <strong
                                        className={
                                            depositStatus === "PAID"
                                                ? "wir-text-paid"
                                                : depositStatus === "PARTIAL"
                                                    ? "wir-text-partial"
                                                    : "wir-text-unpaid"
                                        }
                                    >
                                        {depositStatus}
                                    </strong>
                                </div>

                                <div>
                                    <span>First Rent Installment</span>
                                    <strong className={rentPaidNow ? "wir-text-paid" : "wir-text-unpaid"}>
                                        {rentPaidNow ? "PAID" : "PENDING"}
                                    </strong>
                                </div>

                                <div className="wir-summary-total">
                                    <span>Total Payable</span>
                                    <strong>{money(pricing.totalAmount)}</strong>
                                </div>
                            </div>

                            <div className="wir-submit-help">
                                <FaShieldAlt />
                                Security deposit is refundable according to rental return condition and actual
                                deposit received.
                            </div>

                            <div className="wir-submit-row">
                                <button
                                    type="button"
                                    className="wir-cancel-btn"
                                    onClick={resetForm}
                                    disabled={submitting}
                                >
                                    <FaTimes />
                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    className="wir-submit-btn"
                                    disabled={submitting || cart.length === 0}
                                >
                                    {submitting ? (
                                        <>
                                            <FaSpinner className="wir-spin" />
                                            Creating Rental{cartTotalUnits > 1 ? "s" : ""}...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            Create Walk-In Rental
                                            {cartTotalUnits > 1 ? ` (${cartTotalUnits} units)` : ""}
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