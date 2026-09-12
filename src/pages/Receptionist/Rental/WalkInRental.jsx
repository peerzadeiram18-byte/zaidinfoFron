// import React, {
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

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
// } from "react-icons/fa";

// import {
//     getRentalProducts,
//     createWalkInRentalRequest,
// } from "../../../services/rentalApi";

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
//     if (!item) {
//         return {};
//     }

//     if (
//         item?.productId &&
//         typeof item.productId === "object"
//     ) {
//         return item.productId;
//     }

//     if (
//         item?.product &&
//         typeof item.product === "object"
//     ) {
//         return item.product;
//     }

//     return item;
// };


// /* =========================================================
//    PRODUCT ID
// ========================================================= */

// const getProductId = (item) => {
//     if (!item) {
//         return "";
//     }

//     const product = getProductObject(item);

//     return String(
//         product?._id ||
//         product?.id ||
//         (
//             typeof item?.productId === "string"
//                 ? item.productId
//                 : ""
//         ) ||
//         item?._id ||
//         item?.id ||
//         ""
//     );
// };


// /* =========================================================
//    RENTAL PRODUCT ID
// ========================================================= */

// const getRentalProductId = (item) => {
//     if (!item) {
//         return "";
//     }

//     if (
//         item?.rentalProductId &&
//         typeof item.rentalProductId === "object"
//     ) {
//         return String(
//             item.rentalProductId?._id ||
//             item.rentalProductId?.id ||
//             ""
//         );
//     }

//     if (item?.rentalProductId) {
//         return String(item.rentalProductId);
//     }

//     if (
//         item?.rentalProduct &&
//         typeof item.rentalProduct === "object"
//     ) {
//         return String(
//             item.rentalProduct?._id ||
//             item.rentalProduct?.id ||
//             ""
//         );
//     }

//     return String(
//         item?._id ||
//         item?.id ||
//         ""
//     );
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

//     if (
//         product?.brand &&
//         typeof product.brand === "object"
//     ) {
//         return (
//             product.brand?.name ||
//             product.brand?.title ||
//             ""
//         );
//     }

//     if (
//         item?.brand &&
//         typeof item.brand === "object"
//     ) {
//         return (
//             item.brand?.name ||
//             item.brand?.title ||
//             ""
//         );
//     }

//     return (
//         product?.brand ||
//         item?.brand ||
//         ""
//     );
// };


// /* =========================================================
//    SKU
// ========================================================= */

// const getSku = (item) => {
//     const product = getProductObject(item);

//     return (
//         product?.sku ||
//         product?.productCode ||
//         item?.sku ||
//         item?.productCode ||
//         "N/A"
//     );
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
//     if (!item) {
//         return false;
//     }

//     const product = getProductObject(item);

//     const productType = String(
//         item?.productType ??
//         product?.productType ??
//         ""
//     )
//         .trim()
//         .toUpperCase();

//     if (productType === "RENTAL") {
//         return true;
//     }

//     if (item?.rentalProductId) {
//         return true;
//     }

//     if (
//         item?.monthlyRent !== undefined ||
//         item?.securityDeposit !== undefined ||
//         item?.minimumRentalMonths !== undefined ||
//         item?.isAvailableForRent !== undefined
//     ) {
//         return true;
//     }

//     if (
//         item?.rental ||
//         item?.rentalDetails
//     ) {
//         return true;
//     }

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

//     if (
//         Array.isArray(product?.images) &&
//         product.images.length > 0
//     ) {
//         image = product.images[0];
//     }

//     if (
//         Array.isArray(item?.images) &&
//         item.images.length > 0
//     ) {
//         image = item.images[0];
//     }

//     if (
//         typeof image === "object" &&
//         image !== null
//     ) {
//         image =
//             image?.url ||
//             image?.path ||
//             image?.fileUrl ||
//             image?.src ||
//             "";
//     }

//     if (!image) {
//         return "";
//     }

//     const imageString = String(image).trim();

//     if (
//         imageString.startsWith("http://") ||
//         imageString.startsWith("https://")
//     ) {
//         return imageString;
//     }

//     const serverUrl = String(API)
//         .replace(/\/api\/?$/, "")
//         .replace(/\/$/, "");

//     const cleanPath = imageString.replace(/^\/+/, "");

//     if (!serverUrl) {
//         return `/${cleanPath}`;
//     }

//     return `${serverUrl}/${cleanPath}`;
// };


// /* =========================================================
//    MONEY
// ========================================================= */

// const money = (value) => {
//     return `₹${Number(
//         value || 0
//     ).toLocaleString("en-IN")}`;
// };


// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function WalkInRental() {

//     const navigate = useNavigate();


//     /* =======================================================
//        BASIC STATE
//     ======================================================= */

//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [submitting, setSubmitting] = useState(false);

//     const [products, setProducts] = useState([]);
//     const [search, setSearch] = useState("");
//     const [selectedProduct, setSelectedProduct] = useState(null);


//     /* =======================================================
//        CUSTOMER TYPE
//     ======================================================= */

//     const [customerType, setCustomerType] =
//         useState("INDIVIDUAL");


//     /* =======================================================
//        CUSTOMER DETAILS
//     ======================================================= */

//     const [individualDetails, setIndividualDetails] =
//         useState({
//             ...EMPTY_INDIVIDUAL,
//         });

//     const [companyDetails, setCompanyDetails] =
//         useState({
//             ...EMPTY_COMPANY,
//         });


//     /* =======================================================
//        RENTAL
//     ======================================================= */

//     const [rentalMonths, setRentalMonths] =
//         useState(3);

//     const [handoverDescription, setHandoverDescription] =
//         useState("");


//     /* =======================================================
//        LOAD PRODUCTS
//     ======================================================= */

//     const loadProducts = async (showRefresh = false) => {

//         try {

//             if (showRefresh) {
//                 setRefreshing(true);
//             } else {
//                 setLoading(true);
//             }

//             const response =
//                 await getRentalProducts();

//             console.log(
//                 "WALK-IN RENTAL PRODUCTS RESPONSE:",
//                 response
//             );

//             const list =
//                 getFirstArray(response);

//             console.log(
//                 "ALL RENTAL PRODUCTS:",
//                 list
//             );

//             const rentalOnly =
//                 list.filter(isRentalProduct);

//             console.log(
//                 "ONLY RENTAL PRODUCTS:",
//                 rentalOnly
//             );

//             setProducts(rentalOnly);

//             setSelectedProduct((previous) => {

//                 if (!previous) {
//                     return null;
//                 }

//                 const oldId =
//                     getRentalProductId(previous);

//                 const exists =
//                     rentalOnly.some(
//                         (item) =>
//                             getRentalProductId(item) === oldId
//                     );

//                 return exists ? previous : null;
//             });

//         } catch (error) {

//             console.error(
//                 "LOAD RENTAL PRODUCTS ERROR:",
//                 error
//             );

//             if (!showRefresh) {
//                 setProducts([]);
//             }

//             toast.error(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Failed to load rental products"
//             );

//         } finally {

//             setLoading(false);
//             setRefreshing(false);
//         }
//     };


//     /* =======================================================
//        INITIAL LOAD
//     ======================================================= */

//     useEffect(() => {
//         loadProducts();
//     }, []);


//     /* =======================================================
//        SEARCH
//     ======================================================= */

//     const filteredProducts = useMemo(() => {

//         const keyword =
//             search.trim().toLowerCase();

//         if (!keyword) {
//             return products;
//         }

//         return products.filter((item) => {

//             const name =
//                 String(
//                     getProductName(item)
//                 ).toLowerCase();

//             const brand =
//                 String(
//                     getBrand(item)
//                 ).toLowerCase();

//             const sku =
//                 String(
//                     getSku(item)
//                 ).toLowerCase();

//             return (
//                 name.includes(keyword) ||
//                 brand.includes(keyword) ||
//                 sku.includes(keyword)
//             );
//         });

//     }, [products, search]);


//     /* =======================================================
//        SELECT PRODUCT
//     ======================================================= */

//     const selectProduct = (item) => {

//         if (!isRentalProduct(item)) {

//             toast.error(
//                 "Only rental products can be selected."
//             );

//             return;
//         }

//         const available =
//             getAvailableQuantity(item);

//         if (available <= 0) {

//             toast.error(
//                 "This rental laptop is out of stock."
//             );

//             return;
//         }

//         setSelectedProduct(item);

//         setRentalMonths(
//             getMinimumMonths(item)
//         );

//         setHandoverDescription("");

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };


//     /* =======================================================
//        CLEAR PRODUCT
//     ======================================================= */

//     const clearProduct = () => {

//         setSelectedProduct(null);

//         setRentalMonths(3);

//         setHandoverDescription("");
//     };


//     /* =======================================================
//        INDIVIDUAL CHANGE
//     ======================================================= */

//     const handleIndividualChange = (event) => {

//         const {
//             name,
//             value,
//         } = event.target;

//         console.log(
//             "INDIVIDUAL FIELD:",
//             name,
//             value
//         );

//         setIndividualDetails((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };


//     /* =======================================================
//        COMPANY CHANGE
//     ======================================================= */

//     const handleCompanyChange = (event) => {

//         const {
//             name,
//             value,
//         } = event.target;

//         console.log(
//             "COMPANY FIELD:",
//             name,
//             value
//         );

//         setCompanyDetails((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };


//     /* =======================================================
//        CUSTOMER TYPE CHANGE
//     ======================================================= */

//     const handleCustomerTypeChange = (type) => {

//         console.log(
//             "CUSTOMER TYPE:",
//             type
//         );

//         setCustomerType(type);
//     };


//     /* =======================================================
//        MINIMUM MONTHS
//     ======================================================= */

//     const minimumMonths =
//         selectedProduct
//             ? getMinimumMonths(selectedProduct)
//             : 3;


//     /* =======================================================
//        MONTH DECREASE
//     ======================================================= */

//     const decreaseMonths = () => {

//         setRentalMonths((previous) =>
//             Math.max(
//                 minimumMonths,
//                 previous - 1
//             )
//         );
//     };


//     /* =======================================================
//        MONTH INCREASE
//     ======================================================= */

//     const increaseMonths = () => {

//         setRentalMonths((previous) =>
//             previous + 1
//         );
//     };


//     /* =======================================================
//        PRICING
//     ======================================================= */

//     const pricing = useMemo(() => {

//         if (!selectedProduct) {

//             return {
//                 monthlyRent: 0,
//                 months: rentalMonths,
//                 rentSubtotal: 0,
//                 gstPercentage: 0,
//                 gstAmount: 0,
//                 securityDeposit: 0,
//                 totalAmount: 0,
//             };
//         }

//         const monthlyRent =
//             getMonthlyRent(selectedProduct);

//         const securityDeposit =
//             getSecurityDeposit(selectedProduct);

//         const gstPercentage =
//             getGST(selectedProduct);

//         const rentSubtotal =
//             monthlyRent * rentalMonths;

//         const gstAmount =
//             (rentSubtotal * gstPercentage) / 100;

//         const totalAmount =
//             rentSubtotal +
//             gstAmount +
//             securityDeposit;

//         return {
//             monthlyRent,
//             months: rentalMonths,
//             rentSubtotal,
//             gstPercentage,
//             gstAmount,
//             securityDeposit,
//             totalAmount,
//         };

//     }, [
//         selectedProduct,
//         rentalMonths,
//     ]);


//     /* =======================================================
//        VALIDATION
//     ======================================================= */

//     const validateForm = () => {

//         if (!selectedProduct) {

//             toast.error(
//                 "Please select a rental laptop."
//             );

//             return false;
//         }

//         const rentalProductId =
//             getRentalProductId(selectedProduct);

//         if (!rentalProductId) {

//             toast.error(
//                 "Rental product ID not found."
//             );

//             console.error(
//                 "INVALID RENTAL PRODUCT:",
//                 selectedProduct
//             );

//             return false;
//         }

//         if (
//             getAvailableQuantity(selectedProduct) <= 0
//         ) {

//             toast.error(
//                 "Selected laptop is out of stock."
//             );

//             return false;
//         }

//         if (
//             rentalMonths < minimumMonths
//         ) {

//             toast.error(
//                 `Minimum rental period is ${minimumMonths} months.`
//             );

//             return false;
//         }

//         if (
//             Number(pricing.monthlyRent) <= 0
//         ) {

//             toast.error(
//                 "Monthly rental amount is not configured."
//             );

//             return false;
//         }


//         /* INDIVIDUAL */

//         if (customerType === "INDIVIDUAL") {

//             if (
//                 !individualDetails.fullName.trim()
//             ) {

//                 toast.error(
//                     "Please enter customer name."
//                 );

//                 return false;
//             }

//             if (
//                 !individualDetails.phone.trim()
//             ) {

//                 toast.error(
//                     "Please enter customer phone."
//                 );

//                 return false;
//             }
//         }


//         /* COMPANY */

//         if (customerType === "COMPANY") {

//             if (
//                 !companyDetails.companyName.trim()
//             ) {

//                 toast.error(
//                     "Please enter company name."
//                 );

//                 return false;
//             }

//             if (
//                 !companyDetails.contactPerson.trim()
//             ) {

//                 toast.error(
//                     "Please enter contact person."
//                 );

//                 return false;
//             }

//             if (
//                 !companyDetails.phone.trim()
//             ) {

//                 toast.error(
//                     "Please enter company phone."
//                 );

//                 return false;
//             }
//         }

//         return true;
//     };


//     /* =======================================================
//        RESET
//     ======================================================= */

//     const resetForm = () => {

//         setSelectedProduct(null);

//         setSearch("");

//         setCustomerType("INDIVIDUAL");

//         setIndividualDetails({
//             ...EMPTY_INDIVIDUAL,
//         });

//         setCompanyDetails({
//             ...EMPTY_COMPANY,
//         });

//         setRentalMonths(3);

//         setHandoverDescription("");
//     };


//     /* =======================================================
//        SUBMIT
//     ======================================================= */

//     const handleSubmit = async (event) => {

//         event.preventDefault();

//         if (submitting) {
//             return;
//         }

//         if (!validateForm()) {
//             return;
//         }

//         try {

//             setSubmitting(true);

//             const rentalProductId =
//                 getRentalProductId(selectedProduct);

//             const productId =
//                 getProductId(selectedProduct);


//             /* ============================================
//                PAYLOAD
//             ============================================ */

//             const payload = {

//                 rentalSource: "WALK_IN",

//                 rentalProductId,

//                 productId,

//                 customerType,

//                 individualDetails:
//                     customerType === "INDIVIDUAL"
//                         ? {
//                             fullName:
//                                 individualDetails.fullName.trim(),

//                             phone:
//                                 individualDetails.phone.trim(),

//                             email:
//                                 individualDetails.email.trim(),

//                             address:
//                                 individualDetails.address.trim(),
//                         }
//                         : undefined,

//                 companyDetails:
//                     customerType === "COMPANY"
//                         ? {
//                             companyName:
//                                 companyDetails.companyName.trim(),

//                             contactPerson:
//                                 companyDetails.contactPerson.trim(),

//                             phone:
//                                 companyDetails.phone.trim(),

//                             email:
//                                 companyDetails.email.trim(),

//                             officeAddress:
//                                 companyDetails.officeAddress.trim(),

//                             gstNumber:
//                                 companyDetails.gstNumber.trim(),
//                         }
//                         : undefined,

//                 monthlyRent:
//                     Number(pricing.monthlyRent),

//                 gstPercentage:
//                     Number(pricing.gstPercentage),

//                 securityDeposit:
//                     Number(pricing.securityDeposit),

//                 rentalMonths:
//                     Number(rentalMonths),

//                 notes:
//                     handoverDescription.trim(),

//                 handoverDescription:
//                     handoverDescription.trim(),

//                 handoverNotes:
//                     handoverDescription.trim(),
//             };


//             console.log(
//                 "================================"
//             );

//             console.log(
//                 "WALK-IN RENTAL PAYLOAD:",
//                 payload
//             );

//             console.log(
//                 "================================"
//             );


//             /* ============================================
//                API
//             ============================================ */

//             const response =
//                 await createWalkInRentalRequest(
//                     payload
//                 );


//             console.log(
//                 "WALK-IN RENTAL RESPONSE:",
//                 response
//             );


//             /* ============================================
//                RESPONSE
//             ============================================ */

//             const rental =
//                 response?.rental ||
//                 response?.data?.rental ||
//                 response?.data?.data ||
//                 response?.data ||
//                 response;


//             const rentalId =
//                 rental?._id ||
//                 rental?.id;


//             /* ============================================
//                SUCCESS
//             ============================================ */

//             toast.success(
//                 rental?.rentalNumber
//                     ? `Rental ${rental.rentalNumber} created successfully.`
//                     : "Walk-in rental created successfully."
//             );


//             /* ============================================
//                REFRESH STOCK
//             ============================================ */

//             await loadProducts(true);


//             /* ============================================
//                NEXT PAGE
//             ============================================ */

//             if (rentalId) {

//                 console.log(
//                     "GOING TO WALK-IN ORDERS:",
//                     rentalId
//                 );

//                 navigate(
//                     "/receptionist-dashboard/rental/orders",
//                     {
//                         state: {
//                             rental,
//                             rentalId,
//                         },
//                     }
//                 );

//             } else {

//                 console.warn(
//                     "Rental ID not returned by backend."
//                 );

//                 resetForm();
//             }

//         } catch (error) {

//             console.error(
//                 "================================"
//             );

//             console.error(
//                 "CREATE WALK-IN RENTAL ERROR:",
//                 error
//             );

//             console.error(
//                 "================================"
//             );

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


//     /* =======================================================
//        BACK
//     ======================================================= */

//     const handleBack = () => {

//         navigate(
//             "/receptionist-dashboard"
//         );
//     };


//     /* =======================================================
//        LOADING
//     ======================================================= */

//     if (loading) {

//         return (
//             <div className="walkin-loading-page">

//                 <FaSpinner className="spin" />

//                 <h2>
//                     Loading rental laptops...
//                 </h2>

//                 <p>
//                     Please wait while rental inventory is loaded.
//                 </p>

//             </div>
//         );
//     }


//     /* =======================================================
//        PAGE
//     ======================================================= */

//     return (

//         <div className="walkin-rental-page">

//             {/* HEADER */}

//             <header className="walkin-header">

//                 <div className="walkin-header-left">

//                     <button
//                         type="button"
//                         className="walkin-back-btn"
//                         onClick={handleBack}
//                     >
//                         <FaArrowLeft />
//                         Back
//                     </button>

//                     <div>
//                         <h1>
//                             Walk-In Rental
//                         </h1>

//                         <p>
//                             Create rental for walk-in customer
//                         </p>
//                     </div>

//                 </div>

//                 <div className="walkin-source-badge">

//                     <FaLaptop />

//                     WALK-IN RENTAL

//                 </div>

//             </header>


//             {/* FORM */}

//             <form
//                 className="walkin-form"
//                 onSubmit={handleSubmit}
//             >


//                 {/* =====================================================
//                     CUSTOMER TYPE
//                 ===================================================== */}

//                 <section className="walkin-card customer-type-section">

//                     <div className="section-title">

//                         <FaUser />

//                         <div>

//                             <h2>
//                                 Customer Type
//                             </h2>

//                             <p>
//                                 Select individual or company customer
//                             </p>

//                         </div>

//                     </div>


//                     <div className="customer-type-grid">

//                         <button
//                             type="button"
//                             className={
//                                 customerType === "INDIVIDUAL"
//                                     ? "type-card active"
//                                     : "type-card"
//                             }
//                             onClick={(event) => {

//                                 event.preventDefault();
//                                 event.stopPropagation();

//                                 handleCustomerTypeChange(
//                                     "INDIVIDUAL"
//                                 );
//                             }}
//                         >

//                             <FaUser size={26} />

//                             <strong>
//                                 Individual
//                             </strong>

//                             <span>
//                                 Personal customer
//                             </span>

//                         </button>


//                         <button
//                             type="button"
//                             className={
//                                 customerType === "COMPANY"
//                                     ? "type-card active"
//                                     : "type-card"
//                             }
//                             onClick={(event) => {

//                                 event.preventDefault();
//                                 event.stopPropagation();

//                                 handleCustomerTypeChange(
//                                     "COMPANY"
//                                 );
//                             }}
//                         >

//                             <FaBuilding size={26} />

//                             <strong>
//                                 Company
//                             </strong>

//                             <span>
//                                 Business customer
//                             </span>

//                         </button>

//                     </div>

//                 </section>


//                 {/* =====================================================
//                     RENTAL PRODUCT
//                 ===================================================== */}

//                 <section className="walkin-card">

//                     <div className="section-title">

//                         <FaLaptop />

//                         <div>

//                             <h2>
//                                 Select Rental Laptop
//                             </h2>

//                             <p>
//                                 Choose an available laptop
//                             </p>

//                         </div>

//                     </div>


//                     {/* SEARCH */}

//                     <div className="rental-search-box">

//                         <FaSearch />

//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(event) =>
//                                 setSearch(event.target.value)
//                             }
//                             placeholder="Search laptop, brand or SKU..."
//                         />

//                         {search && (

//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     setSearch("")
//                                 }
//                             >
//                                 <FaTimes />
//                             </button>

//                         )}

//                     </div>


//                     {/* REFRESH */}

//                     <div className="refresh-stock-row">

//                         <button
//                             type="button"
//                             className="cancel-btn"
//                             onClick={() =>
//                                 loadProducts(true)
//                             }
//                             disabled={refreshing}
//                         >

//                             <FaRedo
//                                 className={
//                                     refreshing
//                                         ? "spin"
//                                         : ""
//                                 }
//                             />

//                             {refreshing
//                                 ? "Refreshing..."
//                                 : "Refresh Stock"
//                             }

//                         </button>

//                     </div>


//                     {/* PRODUCTS */}

//                     {filteredProducts.length === 0 ? (

//                         <div className="empty-products">

//                             <FaLaptop size={42} />

//                             <h3>
//                                 {search
//                                     ? "No rental laptop found"
//                                     : "No rental laptops available"
//                                 }
//                             </h3>

//                             <p>
//                                 {search
//                                     ? "Try another laptop name, brand or SKU."
//                                     : "Please add rental products from admin panel."
//                                 }
//                             </p>

//                         </div>

//                     ) : (

//                         <div className="rental-product-grid">

//                             {filteredProducts.map((item) => {

//                                 const rentalId =
//                                     getRentalProductId(item);

//                                 const image =
//                                     getImageUrl(item);

//                                 const name =
//                                     getProductName(item);

//                                 const brand =
//                                     getBrand(item);

//                                 const sku =
//                                     getSku(item);

//                                 const rent =
//                                     getMonthlyRent(item);

//                                 const deposit =
//                                     getSecurityDeposit(item);

//                                 const available =
//                                     getAvailableQuantity(item);

//                                 const minimum =
//                                     getMinimumMonths(item);

//                                 const selected =
//                                     selectedProduct &&
//                                     getRentalProductId(
//                                         selectedProduct
//                                     ) === rentalId;


//                                 return (

//                                     <article
//                                         key={rentalId}
//                                         className={
//                                             selected
//                                                 ? "rental-product-card selected"
//                                                 : "rental-product-card"
//                                         }
//                                     >

//                                         <div className="product-image">

//                                             {image ? (

//                                                 <img
//                                                     src={image}
//                                                     alt={name}
//                                                     onError={(event) => {
//                                                         event.currentTarget.style.display =
//                                                             "none";
//                                                     }}
//                                                 />

//                                             ) : (

//                                                 <FaLaptop size={30} />

//                                             )}

//                                         </div>


//                                         <div className="product-info">

//                                             <span className="brand">
//                                                 {brand || "Laptop"}
//                                             </span>

//                                             <h3>
//                                                 {name}
//                                             </h3>

//                                             <span className="sku">
//                                                 SKU: {sku}
//                                             </span>

//                                             <div className="product-prices">

//                                                 <span>
//                                                     Rent: {money(rent)} / month
//                                                 </span>

//                                                 <span>
//                                                     Deposit: {money(deposit)}
//                                                 </span>

//                                                 <span>
//                                                     Minimum: {minimum} months
//                                                 </span>

//                                             </div>

//                                             <span
//                                                 className={
//                                                     available > 0
//                                                         ? "stock available"
//                                                         : "stock unavailable"
//                                                 }
//                                             >
//                                                 {available > 0
//                                                     ? `${available} Available`
//                                                     : "Out of Stock"
//                                                 }
//                                             </span>


//                                             <button
//                                                 type="button"
//                                                 className="submit-btn product-select-btn"
//                                                 onClick={(event) => {

//                                                     event.preventDefault();
//                                                     event.stopPropagation();

//                                                     selectProduct(item);
//                                                 }}
//                                                 disabled={
//                                                     available <= 0
//                                                 }
//                                             >

//                                                 {selected ? (

//                                                     <>
//                                                         <FaCheckCircle />
//                                                         Selected
//                                                     </>

//                                                 ) : (

//                                                     <>
//                                                         <FaLaptop />
//                                                         Select Laptop
//                                                     </>

//                                                 )}

//                                             </button>

//                                         </div>


//                                         {selected && (

//                                             <FaCheckCircle
//                                                 className="selected-check"
//                                             />

//                                         )}

//                                     </article>

//                                 );
//                             })}

//                         </div>

//                     )}

//                 </section>


//                 {/* =====================================================
//                     AFTER PRODUCT SELECT
//                 ===================================================== */}

//                 {selectedProduct && (

//                     <>


//                         {/* SELECTED LAPTOP */}

//                         <section className="walkin-card">

//                             <div className="section-title">

//                                 <FaCheckCircle />

//                                 <div>

//                                     <h2>
//                                         Selected Laptop
//                                     </h2>

//                                     <p>
//                                         Rental laptop selected successfully
//                                     </p>

//                                 </div>

//                             </div>


//                             <div className="summary-product">

//                                 <div className="summary-icon">

//                                     <FaLaptop size={25} />

//                                 </div>


//                                 <div>

//                                     <strong>
//                                         {getProductName(
//                                             selectedProduct
//                                         )}
//                                     </strong>

//                                     <span>
//                                         {getBrand(
//                                             selectedProduct
//                                         )}{" "}
//                                         • SKU:{" "}
//                                         {getSku(
//                                             selectedProduct
//                                         )}
//                                     </span>

//                                     <span>
//                                         Available:{" "}
//                                         {getAvailableQuantity(
//                                             selectedProduct
//                                         )}
//                                     </span>

//                                 </div>


//                                 <button
//                                     type="button"
//                                     className="cancel-btn"
//                                     onClick={clearProduct}
//                                 >

//                                     <FaTimes />

//                                     Change

//                                 </button>

//                             </div>

//                         </section>


//                         {/* =====================================================
//                             CUSTOMER DETAILS
//                         ===================================================== */}

//                         <section
//                             className="walkin-card customer-details-section"
//                         >

//                             <div className="section-title">

//                                 {customerType === "INDIVIDUAL"
//                                     ? <FaUser />
//                                     : <FaBuilding />
//                                 }

//                                 <div>

//                                     <h2>
//                                         Customer Details
//                                     </h2>

//                                     <p>
//                                         Enter walk-in customer information
//                                     </p>

//                                 </div>

//                             </div>


//                             {/* =================================================
//                                 INDIVIDUAL
//                             ================================================= */}

//                             {customerType === "INDIVIDUAL" && (

//                                 <div
//                                     className="form-grid customer-form-grid"
//                                 >

//                                     <div className="form-group">

//                                         <label>
//                                             Full Name *
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaUser />

//                                             <input
//                                                 type="text"
//                                                 name="fullName"
//                                                 value={
//                                                     individualDetails.fullName
//                                                 }
//                                                 onChange={
//                                                     handleIndividualChange
//                                                 }
//                                                 placeholder="Enter customer full name"
//                                                 autoComplete="name"
//                                                 autoFocus
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             Phone *
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaPhone />

//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={
//                                                     individualDetails.phone
//                                                 }
//                                                 onChange={
//                                                     handleIndividualChange
//                                                 }
//                                                 placeholder="Enter phone number"
//                                                 autoComplete="tel"
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             Email
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaEnvelope />

//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={
//                                                     individualDetails.email
//                                                 }
//                                                 onChange={
//                                                     handleIndividualChange
//                                                 }
//                                                 placeholder="customer@email.com"
//                                                 autoComplete="email"
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group full">

//                                         <label>
//                                             Address
//                                         </label>

//                                         <div className="input-icon textarea-icon">

//                                             <FaMapMarkerAlt />

//                                             <textarea
//                                                 name="address"
//                                                 value={
//                                                     individualDetails.address
//                                                 }
//                                                 onChange={
//                                                     handleIndividualChange
//                                                 }
//                                                 placeholder="Enter customer address"
//                                                 rows={4}
//                                             />

//                                         </div>

//                                     </div>

//                                 </div>

//                             )}


//                             {/* =================================================
//                                 COMPANY
//                             ================================================= */}

//                             {customerType === "COMPANY" && (

//                                 <div
//                                     className="form-grid customer-form-grid"
//                                 >

//                                     <div className="form-group">

//                                         <label>
//                                             Company Name *
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaBuilding />

//                                             <input
//                                                 type="text"
//                                                 name="companyName"
//                                                 value={
//                                                     companyDetails.companyName
//                                                 }
//                                                 onChange={
//                                                     handleCompanyChange
//                                                 }
//                                                 placeholder="Enter company name"
//                                                 autoFocus
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             Contact Person *
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaUser />

//                                             <input
//                                                 type="text"
//                                                 name="contactPerson"
//                                                 value={
//                                                     companyDetails.contactPerson
//                                                 }
//                                                 onChange={
//                                                     handleCompanyChange
//                                                 }
//                                                 placeholder="Enter contact person"
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             Phone *
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaPhone />

//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={
//                                                     companyDetails.phone
//                                                 }
//                                                 onChange={
//                                                     handleCompanyChange
//                                                 }
//                                                 placeholder="Enter company phone"
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             Email
//                                         </label>

//                                         <div className="input-icon">

//                                             <FaEnvelope />

//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={
//                                                     companyDetails.email
//                                                 }
//                                                 onChange={
//                                                     handleCompanyChange
//                                                 }
//                                                 placeholder="company@email.com"
//                                             />

//                                         </div>

//                                     </div>


//                                     <div className="form-group">

//                                         <label>
//                                             GST Number
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="gstNumber"
//                                             value={
//                                                 companyDetails.gstNumber
//                                             }
//                                             onChange={
//                                                 handleCompanyChange
//                                             }
//                                             placeholder="GST number"
//                                         />

//                                     </div>


//                                     <div className="form-group full">

//                                         <label>
//                                             Office Address
//                                         </label>

//                                         <div className="input-icon textarea-icon">

//                                             <FaMapMarkerAlt />

//                                             <textarea
//                                                 name="officeAddress"
//                                                 value={
//                                                     companyDetails.officeAddress
//                                                 }
//                                                 onChange={
//                                                     handleCompanyChange
//                                                 }
//                                                 placeholder="Enter office address"
//                                                 rows={4}
//                                             />

//                                         </div>

//                                     </div>

//                                 </div>

//                             )}

//                         </section>


//                         {/* =====================================================
//                             RENTAL PERIOD
//                         ===================================================== */}

//                         <section className="walkin-card">

//                             <div className="section-title">

//                                 <FaCalendarAlt />

//                                 <div>

//                                     <h2>
//                                         Rental Period
//                                     </h2>

//                                     <p>
//                                         Select rental duration
//                                     </p>

//                                 </div>

//                             </div>


//                             <div className="form-grid">

//                                 <div className="form-group">

//                                     <label>
//                                         Minimum Rental
//                                     </label>

//                                     <input
//                                         type="text"
//                                         value={`${minimumMonths} months`}
//                                         readOnly
//                                     />

//                                 </div>


//                                 <div className="form-group">

//                                     <label>
//                                         Rental Duration
//                                     </label>

//                                     <div className="month-control">

//                                         <button
//                                             type="button"
//                                             onClick={decreaseMonths}
//                                             disabled={
//                                                 rentalMonths <=
//                                                 minimumMonths
//                                             }
//                                         >
//                                             <FaMinus />
//                                         </button>


//                                         <div className="month-value">

//                                             <strong>
//                                                 {rentalMonths}
//                                             </strong>

//                                             <span>
//                                                 months
//                                             </span>

//                                         </div>


//                                         <button
//                                             type="button"
//                                             onClick={increaseMonths}
//                                         >
//                                             <FaPlus />
//                                         </button>

//                                     </div>

//                                 </div>


//                                 <div className="form-group full">

//                                     <label>
//                                         Handover / Notes
//                                     </label>

//                                     <textarea
//                                         value={
//                                             handoverDescription
//                                         }
//                                         onChange={(event) =>
//                                             setHandoverDescription(
//                                                 event.target.value
//                                             )
//                                         }
//                                         placeholder="Enter laptop condition, accessories, charger, bag or other handover notes..."
//                                         rows={4}
//                                     />

//                                     <small>
//                                         These notes will be saved with the rental.
//                                     </small>

//                                 </div>

//                             </div>

//                         </section>


//                         {/* =====================================================
//                             SUMMARY
//                         ===================================================== */}

//                         <section className="walkin-card summary-card">

//                             <div className="section-title">

//                                 <FaRupeeSign />

//                                 <div>

//                                     <h2>
//                                         Rental Summary
//                                     </h2>

//                                     <p>
//                                         Amount calculation
//                                     </p>

//                                 </div>

//                             </div>


//                             <div className="summary-lines">

//                                 <div>

//                                     <span>
//                                         Monthly Rent
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             pricing.monthlyRent
//                                         )}
//                                     </strong>

//                                 </div>


//                                 <div>

//                                     <span>
//                                         Rental Period
//                                     </span>

//                                     <strong>
//                                         {pricing.months} months
//                                     </strong>

//                                 </div>


//                                 <div>

//                                     <span>
//                                         Rental Amount
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             pricing.rentSubtotal
//                                         )}
//                                     </strong>

//                                 </div>


//                                 <div>

//                                     <span>
//                                         GST ({pricing.gstPercentage}%)
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             pricing.gstAmount
//                                         )}
//                                     </strong>

//                                 </div>


//                                 <div>

//                                     <span>
//                                         Security Deposit
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             pricing.securityDeposit
//                                         )}
//                                     </strong>

//                                 </div>


//                                 <div className="summary-total">

//                                     <span>
//                                         Total Payable
//                                     </span>

//                                     <strong>
//                                         {money(
//                                             pricing.totalAmount
//                                         )}
//                                     </strong>

//                                 </div>

//                             </div>


//                             <div className="submit-help">

//                                 <FaShieldAlt />

//                                 Security deposit is refundable
//                                 according to rental return condition.

//                             </div>


//                             <div className="submit-row">

//                                 <button
//                                     type="button"
//                                     className="cancel-btn"
//                                     onClick={resetForm}
//                                     disabled={submitting}
//                                 >

//                                     <FaTimes />

//                                     Reset

//                                 </button>


//                                 <button
//                                     type="submit"
//                                     className="submit-btn"
//                                     disabled={
//                                         submitting ||
//                                         !selectedProduct
//                                     }
//                                 >

//                                     {submitting ? (

//                                         <>
//                                             <FaSpinner className="spin" />
//                                             Creating Rental...
//                                         </>

//                                     ) : (

//                                         <>
//                                             <FaCheckCircle />
//                                             Create Walk-In Rental
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

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

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
} from "react-icons/fa";

import {
    getRentalProducts,
    createWalkInRentalRequest,
    uploadRentalDocument,
} from "../../../services/rentalApi";

import "./WalkInRental.css";


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
   DOCUMENT CONFIG
========================================================= */

const DOCUMENT_CONFIG = {
    INDIVIDUAL: [
        {
            key: "PASSPORT_PHOTO",
            label: "Passport Size Photograph",
            accept: "image/jpeg,image/jpg,image/png,image/webp",
        },
        {
            key: "PAN_CARD",
            label: "PAN Card",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "AADHAAR_CARD",
            label: "Aadhaar Card",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "HOUSE_RENTAL_AGREEMENT",
            label: "House Rental Agreement",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "COLLEGE_ID",
            label: "College ID",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
    ],

    COMPANY: [
        {
            key: "PAN_CARD",
            label: "PAN Card",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "AADHAAR_CARD",
            label: "Aadhaar Card (Authorized Person)",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "GST_REGISTRATION",
            label: "GST Registration Copy",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "OFFICE_ID",
            label: "Office ID",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
        {
            key: "AUTHORIZATION_LETTER",
            label: "Authorization Letter",
            accept: "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
        },
    ],
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
   PRODUCT OBJECT
========================================================= */

const getProductObject = (item) => {
    if (!item) {
        return {};
    }

    if (
        item?.productId &&
        typeof item.productId === "object"
    ) {
        return item.productId;
    }

    if (
        item?.product &&
        typeof item.product === "object"
    ) {
        return item.product;
    }

    return item;
};


/* =========================================================
   PRODUCT ID
========================================================= */

const getProductId = (item) => {
    if (!item) {
        return "";
    }

    const product = getProductObject(item);

    return String(
        product?._id ||
        product?.id ||
        (
            typeof item?.productId === "string"
                ? item.productId
                : ""
        ) ||
        item?._id ||
        item?.id ||
        ""
    );
};


/* =========================================================
   RENTAL PRODUCT ID
========================================================= */

const getRentalProductId = (item) => {
    if (!item) {
        return "";
    }

    if (
        item?.rentalProductId &&
        typeof item.rentalProductId === "object"
    ) {
        return String(
            item.rentalProductId?._id ||
            item.rentalProductId?.id ||
            ""
        );
    }

    if (item?.rentalProductId) {
        return String(item.rentalProductId);
    }

    if (
        item?.rentalProduct &&
        typeof item.rentalProduct === "object"
    ) {
        return String(
            item.rentalProduct?._id ||
            item.rentalProduct?.id ||
            ""
        );
    }

    return String(
        item?._id ||
        item?.id ||
        ""
    );
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

    if (
        product?.brand &&
        typeof product.brand === "object"
    ) {
        return (
            product.brand?.name ||
            product.brand?.title ||
            ""
        );
    }

    if (
        item?.brand &&
        typeof item.brand === "object"
    ) {
        return (
            item.brand?.name ||
            item.brand?.title ||
            ""
        );
    }

    return (
        product?.brand ||
        item?.brand ||
        ""
    );
};


/* =========================================================
   SKU
========================================================= */

const getSku = (item) => {
    const product = getProductObject(item);

    return (
        product?.sku ||
        product?.productCode ||
        item?.sku ||
        item?.productCode ||
        "N/A"
    );
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
    if (!item) {
        return false;
    }

    const product = getProductObject(item);

    const productType = String(
        item?.productType ??
        product?.productType ??
        ""
    )
        .trim()
        .toUpperCase();

    if (productType === "RENTAL") {
        return true;
    }

    if (item?.rentalProductId) {
        return true;
    }

    if (
        item?.monthlyRent !== undefined ||
        item?.securityDeposit !== undefined ||
        item?.minimumRentalMonths !== undefined ||
        item?.isAvailableForRent !== undefined
    ) {
        return true;
    }

    if (
        item?.rental ||
        item?.rentalDetails
    ) {
        return true;
    }

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

    if (
        Array.isArray(product?.images) &&
        product.images.length > 0
    ) {
        image = product.images[0];
    }

    if (
        Array.isArray(item?.images) &&
        item.images.length > 0
    ) {
        image = item.images[0];
    }

    if (
        typeof image === "object" &&
        image !== null
    ) {
        image =
            image?.url ||
            image?.path ||
            image?.fileUrl ||
            image?.src ||
            "";
    }

    if (!image) {
        return "";
    }

    const imageString = String(image).trim();

    if (
        imageString.startsWith("http://") ||
        imageString.startsWith("https://")
    ) {
        return imageString;
    }

    const serverUrl = String(API)
        .replace(/\/api\/?$/, "")
        .replace(/\/$/, "");

    const cleanPath = imageString.replace(/^\/+/, "");

    if (!serverUrl) {
        return `/${cleanPath}`;
    }

    return `${serverUrl}/${cleanPath}`;
};


/* =========================================================
   MONEY
========================================================= */

const money = (value) => {
    return `₹${Number(
        value || 0
    ).toLocaleString("en-IN")}`;
};


/* =========================================================
   COMPONENT
========================================================= */

export default function WalkInRental() {

    const navigate = useNavigate();


    /* =======================================================
       BASIC STATE
    ======================================================= */

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);


    /* =======================================================
       CUSTOMER TYPE
    ======================================================= */

    const [customerType, setCustomerType] =
        useState("INDIVIDUAL");


    /* =======================================================
       CUSTOMER DETAILS
    ======================================================= */

    const [individualDetails, setIndividualDetails] =
        useState({
            ...EMPTY_INDIVIDUAL,
        });

    const [companyDetails, setCompanyDetails] =
        useState({
            ...EMPTY_COMPANY,
        });


    /* =======================================================
       RENTAL
    ======================================================= */

    const [rentalMonths, setRentalMonths] =
        useState(3);

    const [handoverDescription, setHandoverDescription] =
        useState("");


    /* =======================================================
       DOCUMENT UPLOADS
    ======================================================= */

    const [documents, setDocuments] = useState({});

    /*
     * We keep refs for file inputs so when a document is
     * removed, the browser input is also cleared.
     */
    const documentInputRefs = useRef({});


    const currentDocuments =
        DOCUMENT_CONFIG[customerType] ||
        DOCUMENT_CONFIG.INDIVIDUAL;


    /* =======================================================
       DOCUMENT CHANGE
    ======================================================= */

    const handleDocumentChange = (
        documentType,
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const maxSize =
            10 * 1024 * 1024;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            toast.error(
                "Only JPG, PNG, WEBP or PDF files are allowed."
            );

            event.target.value = "";

            return;
        }

        if (file.size > maxSize) {

            toast.error(
                "Document size must be less than 10 MB."
            );

            event.target.value = "";

            return;
        }

        console.log(
            "DOCUMENT SELECTED:",
            {
                documentType,
                name: file.name,
                type: file.type,
                size: file.size,
            }
        );

        setDocuments((previous) => ({
            ...previous,
            [documentType]: file,
        }));
    };


    /* =======================================================
       REMOVE DOCUMENT
    ======================================================= */

    const removeDocument = (
        documentType
    ) => {

        setDocuments((previous) => {

            const next = {
                ...previous,
            };

            delete next[documentType];

            return next;
        });

        const input =
            documentInputRefs.current[
                documentType
            ];

        if (input) {
            input.value = "";
        }
    };


    /* =======================================================
       VALIDATE DOCUMENTS
    ======================================================= */

    const validateDocuments = () => {

        for (
            const documentConfig
            of currentDocuments
        ) {

            if (
                !documents[
                    documentConfig.key
                ]
            ) {

                toast.error(
                    `Please upload ${documentConfig.label}.`
                );

                return false;
            }
        }

        return true;
    };


    /* =======================================================
       UPLOAD ALL DOCUMENTS
    ======================================================= */

    const uploadAllDocuments = async (
        rentalId
    ) => {

        if (!rentalId) {

            throw new Error(
                "Rental ID was not returned by the server."
            );
        }

        const uploadResults = [];

        for (
            const documentConfig
            of currentDocuments
        ) {

            const file =
                documents[
                    documentConfig.key
                ];

            if (!file) {
                continue;
            }

            console.log(
                "================================"
            );

            console.log(
                "UPLOADING RENTAL DOCUMENT"
            );

            console.log(
                "Rental ID:",
                rentalId
            );

            console.log(
                "Document Type:",
                documentConfig.key
            );

            console.log(
                "File:",
                file.name
            );

            console.log(
                "File Type:",
                file.type
            );

            console.log(
                "File Size:",
                file.size
            );

            console.log(
                "================================"
            );


            try {

                const response =
                    await uploadRentalDocument(
                        rentalId,
                        documentConfig.key,
                        file
                    );

                uploadResults.push({
                    type:
                        documentConfig.key,

                    fileName:
                        file.name,

                    success: true,

                    response,
                });

            } catch (error) {

                console.error(
                    `DOCUMENT UPLOAD FAILED: ${documentConfig.key}`,
                    error
                );

                /*
                 * Very important:
                 * Rental is already created.
                 *
                 * We attach document information to the
                 * error so handleSubmit knows that this is
                 * an upload problem, NOT a rental creation
                 * problem.
                 */

                const uploadError =
                    new Error(
                        error?.message ||
                        error?.error ||
                        `Failed to upload ${documentConfig.label}`
                    );

                uploadError.isDocumentUploadError = true;
                uploadError.rentalId = rentalId;
                uploadError.documentType =
                    documentConfig.key;
                uploadError.documentLabel =
                    documentConfig.label;
                uploadError.originalError =
                    error;

                throw uploadError;
            }
        }

        return uploadResults;
    };


    /* =======================================================
       LOAD PRODUCTS
    ======================================================= */

    const loadProducts = async (
        showRefresh = false
    ) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response =
                await getRentalProducts();

            console.log(
                "WALK-IN RENTAL PRODUCTS RESPONSE:",
                response
            );

            const list =
                getFirstArray(response);

            console.log(
                "ALL RENTAL PRODUCTS:",
                list
            );

            const rentalOnly =
                list.filter(
                    isRentalProduct
                );

            console.log(
                "ONLY RENTAL PRODUCTS:",
                rentalOnly
            );

            setProducts(
                rentalOnly
            );

            setSelectedProduct(
                (previous) => {

                    if (!previous) {
                        return null;
                    }

                    const oldId =
                        getRentalProductId(
                            previous
                        );

                    const exists =
                        rentalOnly.some(
                            (item) =>
                                getRentalProductId(
                                    item
                                ) === oldId
                        );

                    return exists
                        ? previous
                        : null;
                }
            );

        } catch (error) {

            console.error(
                "LOAD RENTAL PRODUCTS ERROR:",
                error
            );

            if (!showRefresh) {
                setProducts([]);
            }

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                error?.error ||
                "Failed to load rental products"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    /* =======================================================
       INITIAL LOAD
    ======================================================= */

    useEffect(() => {

        loadProducts();

    }, []);


    /* =======================================================
       SEARCH
    ======================================================= */

    const filteredProducts =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return products;
            }

            return products.filter(
                (item) => {

                    const name =
                        String(
                            getProductName(
                                item
                            )
                        ).toLowerCase();

                    const brand =
                        String(
                            getBrand(
                                item
                            )
                        ).toLowerCase();

                    const sku =
                        String(
                            getSku(
                                item
                            )
                        ).toLowerCase();

                    return (
                        name.includes(
                            keyword
                        ) ||
                        brand.includes(
                            keyword
                        ) ||
                        sku.includes(
                            keyword
                        )
                    );
                }
            );

        }, [
            products,
            search,
        ]);


    /* =======================================================
       SELECT PRODUCT
    ======================================================= */

    const selectProduct = (
        item
    ) => {

        if (
            !isRentalProduct(
                item
            )
        ) {

            toast.error(
                "Only rental products can be selected."
            );

            return;
        }

        const available =
            getAvailableQuantity(
                item
            );

        if (available <= 0) {

            toast.error(
                "This rental laptop is out of stock."
            );

            return;
        }

        setSelectedProduct(
            item
        );

        setRentalMonths(
            getMinimumMonths(
                item
            )
        );

        setHandoverDescription("");

        setDocuments({});

        /*
         * Clear old file inputs as well.
         */
        documentInputRefs.current = {};

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /* =======================================================
       CLEAR PRODUCT
    ======================================================= */

    const clearProduct = () => {

        setSelectedProduct(
            null
        );

        setRentalMonths(
            3
        );

        setHandoverDescription(
            ""
        );

        setDocuments({});

        documentInputRefs.current = {};
    };


    /* =======================================================
       INDIVIDUAL CHANGE
    ======================================================= */

    const handleIndividualChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setIndividualDetails(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    /* =======================================================
       COMPANY CHANGE
    ======================================================= */

    const handleCompanyChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setCompanyDetails(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    /* =======================================================
       CUSTOMER TYPE CHANGE
    ======================================================= */

    const handleCustomerTypeChange = (
        type
    ) => {

        setCustomerType(
            type
        );

        /*
         * Documents belong to customer type.
         * Therefore switching Individual/Company clears
         * previous document selections so wrong documents
         * are never uploaded.
         */
        setDocuments({});

        documentInputRefs.current = {};
    };


    /* =======================================================
       MINIMUM MONTHS
    ======================================================= */

    const minimumMonths =
        selectedProduct
            ? getMinimumMonths(
                selectedProduct
            )
            : 3;


    /* =======================================================
       MONTH DECREASE
    ======================================================= */

    const decreaseMonths = () => {

        setRentalMonths(
            (previous) =>
                Math.max(
                    minimumMonths,
                    previous - 1
                )
        );
    };


    /* =======================================================
       MONTH INCREASE
    ======================================================= */

    const increaseMonths = () => {

        setRentalMonths(
            (previous) =>
                previous + 1
        );
    };


    /* =======================================================
       PRICING
    ======================================================= */

    const pricing =
        useMemo(() => {

            if (!selectedProduct) {

                return {
                    monthlyRent: 0,
                    months: rentalMonths,
                    rentSubtotal: 0,
                    gstPercentage: 0,
                    gstAmount: 0,
                    securityDeposit: 0,
                    totalAmount: 0,
                };
            }

            const monthlyRent =
                getMonthlyRent(
                    selectedProduct
                );

            const securityDeposit =
                getSecurityDeposit(
                    selectedProduct
                );

            const gstPercentage =
                getGST(
                    selectedProduct
                );

            const rentSubtotal =
                monthlyRent *
                rentalMonths;

            const gstAmount =
                (
                    rentSubtotal *
                    gstPercentage
                ) / 100;

            const totalAmount =
                rentSubtotal +
                gstAmount +
                securityDeposit;

            return {
                monthlyRent,
                months:
                    rentalMonths,
                rentSubtotal,
                gstPercentage,
                gstAmount,
                securityDeposit,
                totalAmount,
            };

        }, [
            selectedProduct,
            rentalMonths,
        ]);


    /* =======================================================
       VALIDATION
    ======================================================= */

    const validateForm = () => {

        if (!selectedProduct) {

            toast.error(
                "Please select a rental laptop."
            );

            return false;
        }


        const rentalProductId =
            getRentalProductId(
                selectedProduct
            );

        if (!rentalProductId) {

            toast.error(
                "Rental product ID not found."
            );

            console.error(
                "INVALID RENTAL PRODUCT:",
                selectedProduct
            );

            return false;
        }


        const productId =
            getProductId(
                selectedProduct
            );

        if (!productId) {

            toast.error(
                "Product ID not found."
            );

            console.error(
                "INVALID PRODUCT:",
                selectedProduct
            );

            return false;
        }


        if (
            getAvailableQuantity(
                selectedProduct
            ) <= 0
        ) {

            toast.error(
                "Selected laptop is out of stock."
            );

            return false;
        }


        if (
            rentalMonths <
            minimumMonths
        ) {

            toast.error(
                `Minimum rental period is ${minimumMonths} months.`
            );

            return false;
        }


        if (
            Number(
                pricing.monthlyRent
            ) <= 0
        ) {

            toast.error(
                "Monthly rental amount is not configured."
            );

            return false;
        }


        /* =================================================
           INDIVIDUAL
        ================================================= */

        if (
            customerType ===
            "INDIVIDUAL"
        ) {

            if (
                !individualDetails.fullName.trim()
            ) {

                toast.error(
                    "Please enter customer name."
                );

                return false;
            }

            if (
                !individualDetails.phone.trim()
            ) {

                toast.error(
                    "Please enter customer phone."
                );

                return false;
            }
        }


        /* =================================================
           COMPANY
        ================================================= */

        if (
            customerType ===
            "COMPANY"
        ) {

            if (
                !companyDetails.companyName.trim()
            ) {

                toast.error(
                    "Please enter company name."
                );

                return false;
            }

            if (
                !companyDetails.contactPerson.trim()
            ) {

                toast.error(
                    "Please enter contact person."
                );

                return false;
            }

            if (
                !companyDetails.phone.trim()
            ) {

                toast.error(
                    "Please enter company phone."
                );

                return false;
            }
        }


        return true;
    };


    /* =======================================================
       RESET
    ======================================================= */

    const resetForm = () => {

        if (submitting) {
            return;
        }

        setSelectedProduct(
            null
        );

        setSearch("");

        setCustomerType(
            "INDIVIDUAL"
        );

        setIndividualDetails({
            ...EMPTY_INDIVIDUAL,
        });

        setCompanyDetails({
            ...EMPTY_COMPANY,
        });

        setRentalMonths(
            3
        );

        setHandoverDescription(
            ""
        );

        setDocuments({});

        documentInputRefs.current = {};

        /*
         * Clear browser file inputs.
         */
        Object.values(
            documentInputRefs.current
        ).forEach(
            (input) => {
                if (input) {
                    input.value = "";
                }
            }
        );
    };


    /* =======================================================
       SUBMIT
    ======================================================= */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (submitting) {
            return;
        }


        /* =================================================
           FORM VALIDATION
        ================================================= */

        if (!validateForm()) {
            return;
        }


        /* =================================================
           DOCUMENT VALIDATION
        ================================================= */

        if (!validateDocuments()) {
            return;
        }


        try {

            setSubmitting(
                true
            );


            /* =============================================
               IDs
            ============================================= */

            const rentalProductId =
                getRentalProductId(
                    selectedProduct
                );

            const productId =
                getProductId(
                    selectedProduct
                );


            /* =============================================
               PAYLOAD
               KEEPING EXISTING RENTAL CREATE PAYLOAD
            ============================================= */

            const payload = {

                rentalSource:
                    "WALK_IN",

                rentalProductId,

                productId,

                customerType,

                individualDetails:
                    customerType ===
                    "INDIVIDUAL"
                        ? {
                            fullName:
                                individualDetails.fullName.trim(),

                            phone:
                                individualDetails.phone.trim(),

                            email:
                                individualDetails.email.trim(),

                            address:
                                individualDetails.address.trim(),
                        }
                        : undefined,

                companyDetails:
                    customerType ===
                    "COMPANY"
                        ? {
                            companyName:
                                companyDetails.companyName.trim(),

                            contactPerson:
                                companyDetails.contactPerson.trim(),

                            phone:
                                companyDetails.phone.trim(),

                            email:
                                companyDetails.email.trim(),

                            officeAddress:
                                companyDetails.officeAddress.trim(),

                            gstNumber:
                                companyDetails.gstNumber.trim(),
                        }
                        : undefined,

                monthlyRent:
                    Number(
                        pricing.monthlyRent
                    ),

                gstPercentage:
                    Number(
                        pricing.gstPercentage
                    ),

                securityDeposit:
                    Number(
                        pricing.securityDeposit
                    ),

                rentalMonths:
                    Number(
                        rentalMonths
                    ),

                notes:
                    handoverDescription.trim(),

                handoverDescription:
                    handoverDescription.trim(),

                handoverNotes:
                    handoverDescription.trim(),
            };


            console.log(
                "================================"
            );

            console.log(
                "WALK-IN RENTAL PAYLOAD:",
                payload
            );

            console.log(
                "================================"
            );


            /* =============================================
               STEP 1
               CREATE RENTAL
            ============================================= */

            toast.info(
                "Creating walk-in rental..."
            );


            const response =
                await createWalkInRentalRequest(
                    payload
                );


            console.log(
                "WALK-IN RENTAL RESPONSE:",
                response
            );


            /* =============================================
               EXTRACT CREATED RENTAL
            ============================================= */

            const rental =
                response?.rental ||
                response?.data?.rental ||
                response?.data?.data ||
                response?.data ||
                response;


            const rentalId =
                rental?._id ||
                rental?.id;


            /* =============================================
               IMPORTANT
               RENTAL MUST HAVE ID
            ============================================= */

            if (!rentalId) {

                console.error(
                    "RENTAL CREATED BUT ID NOT FOUND:",
                    response
                );

                throw new Error(
                    "Rental was created but rental ID was not returned by the server."
                );
            }


            console.log(
                "CREATED RENTAL ID:",
                rentalId
            );


            /* =============================================
               STEP 2
               UPLOAD DOCUMENTS
            ============================================= */

            toast.info(
                "Rental created. Uploading customer documents..."
            );


            let uploadedDocuments = [];

            try {

                uploadedDocuments =
                    await uploadAllDocuments(
                        rentalId
                    );

            } catch (documentError) {

                /*
                 * VERY IMPORTANT:
                 *
                 * Rental already exists here.
                 *
                 * We DO NOT call createWalkInRentalRequest
                 * again.
                 *
                 * This prevents duplicate rental creation
                 * and duplicate stock deduction.
                 */

                console.error(
                    "DOCUMENT UPLOAD ERROR:",
                    documentError
                );


                toast.error(
                    documentError?.message ||
                    "Rental created, but one or more documents could not be uploaded."
                );


                /*
                 * Go to rental details/orders instead of
                 * creating the rental again.
                 *
                 * This preserves the already-created rental.
                 */

                navigate(
                    `/receptionist-dashboard/rental/orders/${rentalId}`,
                    {
                        state: {
                            rental,
                            rentalId,
                            documentUploadFailed: true,
                            failedDocumentType:
                                documentError?.documentType ||
                                null,
                        },
                    }
                );

                return;
            }


            /* =============================================
               DOCUMENT SUCCESS
            ============================================= */

            console.log(
                "ALL RENTAL DOCUMENTS UPLOADED:",
                uploadedDocuments
            );


            /* =============================================
               SUCCESS
            ============================================= */

            toast.success(
                rental?.rentalNumber
                    ? `Rental ${rental.rentalNumber} and all documents saved successfully.`
                    : "Rental and all documents saved successfully."
            );


            /* =============================================
               REFRESH STOCK
            ============================================= */

            await loadProducts(
                true
            );


            /* =============================================
               NEXT PAGE
            ============================================= */

            console.log(
                "GOING TO WALK-IN ORDERS:",
                rentalId
            );


            navigate(
                "/receptionist-dashboard/rental/orders",
                {
                    state: {
                        rental,
                        rentalId,
                        documentsUploaded:
                            uploadedDocuments,
                    },
                }
            );

        } catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "CREATE WALK-IN RENTAL ERROR:",
                error
            );

            console.error(
                "================================"
            );


            /*
             * This catch is mainly for:
             *
             * - Rental API failure
             * - validation/server failure
             * - missing rental ID
             *
             * Document-upload failure is handled separately
             * above so we don't falsely say rental creation failed.
             */

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                error?.error ||
                "Failed to create walk-in rental.";


            toast.error(
                message
            );

        } finally {

            setSubmitting(
                false
            );
        }
    };


    /* =======================================================
       BACK
    ======================================================= */

    const handleBack = () => {

        if (submitting) {
            return;
        }

        navigate(
            "/receptionist-dashboard"
        );
    };


    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {

        return (
            <div className="walkin-loading-page">

                <FaSpinner className="spin" />

                <h2>
                    Loading rental laptops...
                </h2>

                <p>
                    Please wait while rental inventory is loaded.
                </p>

            </div>
        );
    }


    /* =======================================================
       PAGE
    ======================================================= */

    return (

        <div className="walkin-rental-page">

            <style>{`

                .document-upload-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        2,
                        minmax(0, 1fr)
                    );
                    gap: 18px;
                    margin-top: 20px;
                }

                .document-upload-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 18px;
                    background: #ffffff;
                }

                .document-upload-header {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .document-upload-header strong {
                    color: #111827;
                    font-size: 15px;
                    line-height: 1.4;
                }

                .document-upload-header span {
                    color: #dc2626;
                    font-size: 12px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .document-file-label {
                    display: block;
                    border: 1px dashed #cbd5e1;
                    border-radius: 10px;
                    padding: 12px;
                    cursor: pointer;
                    background: #f8fafc;
                }

                .document-file-label:hover {
                    border-color: #94a3b8;
                    background: #f1f5f9;
                }

                .document-file-label input {
                    width: 100%;
                    cursor: pointer;
                }

                .document-file-label span {
                    display: block;
                    margin-top: 8px;
                    color: #475569;
                    font-size: 13px;
                    overflow-wrap: anywhere;
                }

                .document-upload-card small {
                    display: block;
                    margin-top: 8px;
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.4;
                }

                .document-selected {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                    padding: 9px 10px;
                    border-radius: 8px;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #166534;
                    font-size: 12px;
                }

                .document-selected span {
                    flex: 1;
                    min-width: 0;
                    overflow-wrap: anywhere;
                }

                .document-remove-btn {
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                    color: #dc2626;
                    padding: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .document-remove-btn:hover {
                    color: #991b1b;
                }

                .document-upload-note {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-top: 18px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #1e40af;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .document-upload-note svg {
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                @media (max-width: 768px) {

                    .document-upload-grid {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="walkin-header">

                <div className="walkin-header-left">

                    <button
                        type="button"
                        className="walkin-back-btn"
                        onClick={handleBack}
                        disabled={submitting}
                    >

                        <FaArrowLeft />

                        Back

                    </button>


                    <div>

                        <h1>
                            Walk-In Rental
                        </h1>

                        <p>
                            Create rental for walk-in customer
                        </p>

                    </div>

                </div>


                <div className="walkin-source-badge">

                    <FaLaptop />

                    WALK-IN RENTAL

                </div>

            </header>


            {/* =====================================================
                FORM
            ===================================================== */}

            <form
                className="walkin-form"
                onSubmit={handleSubmit}
            >


                {/* =====================================================
                    CUSTOMER TYPE
                ===================================================== */}

                <section
                    className="walkin-card customer-type-section"
                >

                    <div className="section-title">

                        <FaUser />

                        <div>

                            <h2>
                                Customer Type
                            </h2>

                            <p>
                                Select individual or company customer
                            </p>

                        </div>

                    </div>


                    <div className="customer-type-grid">

                        <button
                            type="button"
                            className={
                                customerType ===
                                "INDIVIDUAL"
                                    ? "type-card active"
                                    : "type-card"
                            }
                            onClick={(
                                event
                            ) => {

                                event.preventDefault();
                                event.stopPropagation();

                                handleCustomerTypeChange(
                                    "INDIVIDUAL"
                                );
                            }}
                            disabled={submitting}
                        >

                            <FaUser
                                size={26}
                            />

                            <strong>
                                Individual
                            </strong>

                            <span>
                                Personal customer
                            </span>

                        </button>


                        <button
                            type="button"
                            className={
                                customerType ===
                                "COMPANY"
                                    ? "type-card active"
                                    : "type-card"
                            }
                            onClick={(
                                event
                            ) => {

                                event.preventDefault();
                                event.stopPropagation();

                                handleCustomerTypeChange(
                                    "COMPANY"
                                );
                            }}
                            disabled={submitting}
                        >

                            <FaBuilding
                                size={26}
                            />

                            <strong>
                                Company
                            </strong>

                            <span>
                                Business customer
                            </span>

                        </button>

                    </div>

                </section>


                {/* =====================================================
                    RENTAL PRODUCT
                ===================================================== */}

                <section
                    className="walkin-card"
                >

                    <div className="section-title">

                        <FaLaptop />

                        <div>

                            <h2>
                                Select Rental Laptop
                            </h2>

                            <p>
                                Choose an available laptop
                            </p>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="rental-search-box">

                        <FaSearch />

                        <input
                            type="text"
                            value={search}
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search laptop, brand or SKU..."
                            disabled={submitting}
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                disabled={submitting}
                            >

                                <FaTimes />

                            </button>

                        )}

                    </div>


                    {/* REFRESH */}

                    <div
                        className="refresh-stock-row"
                    >

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                loadProducts(true)
                            }
                            disabled={
                                refreshing ||
                                submitting
                            }
                        >

                            <FaRedo
                                className={
                                    refreshing
                                        ? "spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh Stock"
                            }

                        </button>

                    </div>


                    {/* PRODUCTS */}

                    {filteredProducts.length === 0 ? (

                        <div
                            className="empty-products"
                        >

                            <FaLaptop
                                size={42}
                            />

                            <h3>

                                {search
                                    ? "No rental laptop found"
                                    : "No rental laptops available"
                                }

                            </h3>

                            <p>

                                {search
                                    ? "Try another laptop name, brand or SKU."
                                    : "Please add rental products from admin panel."
                                }

                            </p>

                        </div>

                    ) : (

                        <div
                            className="rental-product-grid"
                        >

                            {filteredProducts.map(
                                (item) => {

                                    const rentalId =
                                        getRentalProductId(
                                            item
                                        );

                                    const image =
                                        getImageUrl(
                                            item
                                        );

                                    const name =
                                        getProductName(
                                            item
                                        );

                                    const brand =
                                        getBrand(
                                            item
                                        );

                                    const sku =
                                        getSku(
                                            item
                                        );

                                    const rent =
                                        getMonthlyRent(
                                            item
                                        );

                                    const deposit =
                                        getSecurityDeposit(
                                            item
                                        );

                                    const available =
                                        getAvailableQuantity(
                                            item
                                        );

                                    const minimum =
                                        getMinimumMonths(
                                            item
                                        );

                                    const selected =
                                        selectedProduct &&
                                        getRentalProductId(
                                            selectedProduct
                                        ) === rentalId;


                                    return (

                                        <article
                                            key={rentalId}
                                            className={
                                                selected
                                                    ? "rental-product-card selected"
                                                    : "rental-product-card"
                                            }
                                        >

                                            <div
                                                className="product-image"
                                            >

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={name}
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />

                                                ) : (

                                                    <FaLaptop
                                                        size={30}
                                                    />

                                                )}

                                            </div>


                                            <div
                                                className="product-info"
                                            >

                                                <span
                                                    className="brand"
                                                >
                                                    {brand ||
                                                        "Laptop"}
                                                </span>


                                                <h3>
                                                    {name}
                                                </h3>


                                                <span
                                                    className="sku"
                                                >
                                                    SKU: {sku}
                                                </span>


                                                <div
                                                    className="product-prices"
                                                >

                                                    <span>
                                                        Rent:{" "}
                                                        {money(
                                                            rent
                                                        )}{" "}
                                                        / month
                                                    </span>

                                                    <span>
                                                        Deposit:{" "}
                                                        {money(
                                                            deposit
                                                        )}
                                                    </span>

                                                    <span>
                                                        Minimum:{" "}
                                                        {minimum}{" "}
                                                        months
                                                    </span>

                                                </div>


                                                <span
                                                    className={
                                                        available > 0
                                                            ? "stock available"
                                                            : "stock unavailable"
                                                    }
                                                >

                                                    {available > 0
                                                        ? `${available} Available`
                                                        : "Out of Stock"
                                                    }

                                                </span>


                                                <button
                                                    type="button"
                                                    className="submit-btn product-select-btn"
                                                    onClick={(
                                                        event
                                                    ) => {

                                                        event.preventDefault();
                                                        event.stopPropagation();

                                                        selectProduct(
                                                            item
                                                        );
                                                    }}
                                                    disabled={
                                                        available <=
                                                        0 ||
                                                        submitting
                                                    }
                                                >

                                                    {selected ? (

                                                        <>
                                                            <FaCheckCircle />
                                                            Selected
                                                        </>

                                                    ) : (

                                                        <>
                                                            <FaLaptop />
                                                            Select Laptop
                                                        </>

                                                    )}

                                                </button>

                                            </div>


                                            {selected && (

                                                <FaCheckCircle
                                                    className="selected-check"
                                                />

                                            )}

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =====================================================
                    AFTER PRODUCT SELECT
                ===================================================== */}

                {selectedProduct && (

                    <>


                        {/* =================================================
                            SELECTED LAPTOP
                        ================================================= */}

                        <section
                            className="walkin-card"
                        >

                            <div className="section-title">

                                <FaCheckCircle />

                                <div>

                                    <h2>
                                        Selected Laptop
                                    </h2>

                                    <p>
                                        Rental laptop selected successfully
                                    </p>

                                </div>

                            </div>


                            <div
                                className="summary-product"
                            >

                                <div
                                    className="summary-icon"
                                >

                                    <FaLaptop
                                        size={25}
                                    />

                                </div>


                                <div>

                                    <strong>
                                        {getProductName(
                                            selectedProduct
                                        )}
                                    </strong>

                                    <span>
                                        {getBrand(
                                            selectedProduct
                                        )}{" "}
                                        • SKU:{" "}
                                        {getSku(
                                            selectedProduct
                                        )}
                                    </span>

                                    <span>
                                        Available:{" "}
                                        {getAvailableQuantity(
                                            selectedProduct
                                        )}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        clearProduct
                                    }
                                    disabled={submitting}
                                >

                                    <FaTimes />

                                    Change

                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            CUSTOMER DETAILS
                        ================================================= */}

                        <section
                            className="walkin-card customer-details-section"
                        >

                            <div className="section-title">

                                {customerType ===
                                "INDIVIDUAL"
                                    ? <FaUser />
                                    : <FaBuilding />
                                }

                                <div>

                                    <h2>
                                        Customer Details
                                    </h2>

                                    <p>
                                        Enter walk-in customer information
                                    </p>

                                </div>

                            </div>


                            {/* =============================================
                                INDIVIDUAL
                            ============================================= */}

                            {customerType ===
                            "INDIVIDUAL" && (

                                <div
                                    className="form-grid customer-form-grid"
                                >

                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Full Name *
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaUser />

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={
                                                    individualDetails.fullName
                                                }
                                                onChange={
                                                    handleIndividualChange
                                                }
                                                placeholder="Enter customer full name"
                                                autoComplete="name"
                                                autoFocus
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Phone *
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaPhone />

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    individualDetails.phone
                                                }
                                                onChange={
                                                    handleIndividualChange
                                                }
                                                placeholder="Enter phone number"
                                                autoComplete="tel"
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Email
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaEnvelope />

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    individualDetails.email
                                                }
                                                onChange={
                                                    handleIndividualChange
                                                }
                                                placeholder="customer@email.com"
                                                autoComplete="email"
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group full"
                                    >

                                        <label>
                                            Address
                                        </label>

                                        <div
                                            className="input-icon textarea-icon"
                                        >

                                            <FaMapMarkerAlt />

                                            <textarea
                                                name="address"
                                                value={
                                                    individualDetails.address
                                                }
                                                onChange={
                                                    handleIndividualChange
                                                }
                                                placeholder="Enter customer address"
                                                rows={4}
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =============================================
                                COMPANY
                            ============================================= */}

                            {customerType ===
                            "COMPANY" && (

                                <div
                                    className="form-grid customer-form-grid"
                                >

                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Company Name *
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaBuilding />

                                            <input
                                                type="text"
                                                name="companyName"
                                                value={
                                                    companyDetails.companyName
                                                }
                                                onChange={
                                                    handleCompanyChange
                                                }
                                                placeholder="Enter company name"
                                                autoFocus
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Contact Person *
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaUser />

                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={
                                                    companyDetails.contactPerson
                                                }
                                                onChange={
                                                    handleCompanyChange
                                                }
                                                placeholder="Enter contact person"
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Phone *
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaPhone />

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    companyDetails.phone
                                                }
                                                onChange={
                                                    handleCompanyChange
                                                }
                                                placeholder="Enter company phone"
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Email
                                        </label>

                                        <div
                                            className="input-icon"
                                        >

                                            <FaEnvelope />

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    companyDetails.email
                                                }
                                                onChange={
                                                    handleCompanyChange
                                                }
                                                placeholder="company@email.com"
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            GST Number
                                        </label>

                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={
                                                companyDetails.gstNumber
                                            }
                                            onChange={
                                                handleCompanyChange
                                            }
                                            placeholder="GST number"
                                            disabled={submitting}
                                        />

                                    </div>


                                    <div
                                        className="form-group full"
                                    >

                                        <label>
                                            Office Address
                                        </label>

                                        <div
                                            className="input-icon textarea-icon"
                                        >

                                            <FaMapMarkerAlt />

                                            <textarea
                                                name="officeAddress"
                                                value={
                                                    companyDetails.officeAddress
                                                }
                                                onChange={
                                                    handleCompanyChange
                                                }
                                                placeholder="Enter office address"
                                                rows={4}
                                                disabled={submitting}
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}

                        </section>


                        {/* =====================================================
                            CUSTOMER DOCUMENTS
                        ===================================================== */}

                        <section
                            className="walkin-card customer-documents-section"
                        >

                            <div className="section-title">

                                <FaShieldAlt />

                                <div>

                                    <h2>
                                        Customer Documents
                                    </h2>

                                    <p>
                                        Upload required documents for this rental
                                    </p>

                                </div>

                            </div>


                            <div
                                className="document-upload-grid"
                            >

                                {currentDocuments.map(
                                    (
                                        documentConfig
                                    ) => {

                                        const selectedFile =
                                            documents[
                                                documentConfig.key
                                            ];


                                        return (

                                            <div
                                                key={
                                                    documentConfig.key
                                                }
                                                className="document-upload-card"
                                            >

                                                <div
                                                    className="document-upload-header"
                                                >

                                                    <strong>
                                                        {
                                                            documentConfig.label
                                                        }
                                                    </strong>

                                                    <span>
                                                        Required *
                                                    </span>

                                                </div>


                                                <label
                                                    className="document-file-label"
                                                >

                                                    <input
                                                        ref={(
                                                            element
                                                        ) => {

                                                            documentInputRefs.current[
                                                                documentConfig.key
                                                            ] =
                                                                element;

                                                        }}
                                                        type="file"
                                                        accept={
                                                            documentConfig.accept
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleDocumentChange(
                                                                documentConfig.key,
                                                                event
                                                            )
                                                        }
                                                        disabled={
                                                            submitting
                                                        }
                                                    />

                                                    <span>

                                                        {selectedFile
                                                            ? selectedFile.name
                                                            : "Choose document"}

                                                    </span>

                                                </label>


                                                {selectedFile && (

                                                    <div
                                                        className="document-selected"
                                                    >

                                                        <FaCheckCircle />

                                                        <span>
                                                            {
                                                                selectedFile.name
                                                            }
                                                        </span>


                                                        <button
                                                            type="button"
                                                            className="document-remove-btn"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    documentConfig.key
                                                                )
                                                            }
                                                            disabled={
                                                                submitting
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

                                        );
                                    }
                                )}

                            </div>


                            <div
                                className="document-upload-note"
                            >

                                <FaShieldAlt />

                                <span>
                                    Documents are uploaded automatically after
                                    the rental is created. You do not need to
                                    leave this form or upload them again.
                                </span>

                            </div>

                        </section>


                        {/* =====================================================
                            RENTAL PERIOD
                        ===================================================== */}

                        <section
                            className="walkin-card"
                        >

                            <div className="section-title">

                                <FaCalendarAlt />

                                <div>

                                    <h2>
                                        Rental Period
                                    </h2>

                                    <p>
                                        Select rental duration
                                    </p>

                                </div>

                            </div>


                            <div className="form-grid">

                                <div
                                    className="form-group"
                                >

                                    <label>
                                        Minimum Rental
                                    </label>

                                    <input
                                        type="text"
                                        value={`${minimumMonths} months`}
                                        readOnly
                                    />

                                </div>


                                <div
                                    className="form-group"
                                >

                                    <label>
                                        Rental Duration
                                    </label>


                                    <div
                                        className="month-control"
                                    >

                                        <button
                                            type="button"
                                            onClick={
                                                decreaseMonths
                                            }
                                            disabled={
                                                rentalMonths <=
                                                minimumMonths ||
                                                submitting
                                            }
                                        >

                                            <FaMinus />

                                        </button>


                                        <div
                                            className="month-value"
                                        >

                                            <strong>
                                                {rentalMonths}
                                            </strong>

                                            <span>
                                                months
                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                increaseMonths
                                            }
                                            disabled={
                                                submitting
                                            }
                                        >

                                            <FaPlus />

                                        </button>

                                    </div>

                                </div>


                                <div
                                    className="form-group full"
                                >

                                    <label>
                                        Handover / Notes
                                    </label>

                                    <textarea
                                        value={
                                            handoverDescription
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setHandoverDescription(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter laptop condition, accessories, charger, bag or other handover notes..."
                                        rows={4}
                                        disabled={submitting}
                                    />

                                    <small>
                                        These notes will be saved with the rental.
                                    </small>

                                </div>

                            </div>

                        </section>


                        {/* =====================================================
                            SUMMARY
                        ===================================================== */}

                        <section
                            className="walkin-card summary-card"
                        >

                            <div className="section-title">

                                <FaRupeeSign />

                                <div>

                                    <h2>
                                        Rental Summary
                                    </h2>

                                    <p>
                                        Amount calculation
                                    </p>

                                </div>

                            </div>


                            <div
                                className="summary-lines"
                            >

                                <div>

                                    <span>
                                        Monthly Rent
                                    </span>

                                    <strong>
                                        {money(
                                            pricing.monthlyRent
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Rental Period
                                    </span>

                                    <strong>
                                        {pricing.months} months
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Rental Amount
                                    </span>

                                    <strong>
                                        {money(
                                            pricing.rentSubtotal
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        GST ({pricing.gstPercentage}%)
                                    </span>

                                    <strong>
                                        {money(
                                            pricing.gstAmount
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Security Deposit
                                    </span>

                                    <strong>
                                        {money(
                                            pricing.securityDeposit
                                        )}
                                    </strong>

                                </div>


                                <div
                                    className="summary-total"
                                >

                                    <span>
                                        Total Payable
                                    </span>

                                    <strong>
                                        {money(
                                            pricing.totalAmount
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div
                                className="submit-help"
                            >

                                <FaShieldAlt />

                                Security deposit is refundable
                                according to rental return condition.

                            </div>


                            <div
                                className="submit-row"
                            >

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        resetForm
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    <FaTimes />

                                    Reset

                                </button>


                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={
                                        submitting ||
                                        !selectedProduct
                                    }
                                >

                                    {submitting ? (

                                        <>

                                            <FaSpinner
                                                className="spin"
                                            />

                                            Creating Rental & Uploading...

                                        </>

                                    ) : (

                                        <>

                                            <FaCheckCircle />

                                            Create Walk-In Rental

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