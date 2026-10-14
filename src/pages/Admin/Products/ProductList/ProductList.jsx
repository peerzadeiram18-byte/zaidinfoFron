// // import React, { useEffect, useState } from "react";

// // import "./ProductList.css";

// // import {
// //     getProducts,
// //     deleteProduct,
// //     searchProducts
// // } from "../../../../services/productService";

// // import { toast } from "react-toastify";

// // const API = import.meta.env.VITE_API_URL;

// // const ProductList = () => {

// //     // =====================================================
// //     // STATES
// //     // =====================================================

// //     const [products, setProducts] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [search, setSearch] = useState("");
// //     const [currentPage, setCurrentPage] = useState(1);

// //     const itemsPerPage = 10;

// //     // =====================================================
// //     // LOAD ALL PRODUCTS
// //     // =====================================================

// //     const loadProducts = async () => {
// //         try {
// //             setLoading(true);

// //             const res = await getProducts();

// //             console.log(
// //                 "PRODUCT LIST API RESPONSE:",
// //                 res.data
// //             );

// //             // Backend response:
// //             //
// //             // {
// //             //     success: true,
// //             //     message: "...",
// //             //     data: [...]
// //             // }

// //             const productData =
// //                 Array.isArray(res.data?.data)
// //                     ? res.data.data
// //                     : Array.isArray(res.data)
// //                         ? res.data
// //                         : Array.isArray(res.data?.products)
// //                             ? res.data.products
// //                             : Array.isArray(res.data?.data?.products)
// //                                 ? res.data.data.products
// //                                 : [];

// //             console.log(
// //                 "PRODUCTS SET TO STATE:",
// //                 productData
// //             );

// //             setProducts(productData);
// //             setCurrentPage(1);

// //         } catch (error) {

// //             console.error(
// //                 "GET PRODUCTS ERROR:",
// //                 error
// //             );

// //             setProducts([]);

// //             toast.error(
// //                 error.response?.data?.message ||
// //                 "Failed to load products"
// //             );

// //         } finally {

// //             setLoading(false);
// //         }
// //     };

// //     // =====================================================
// //     // FIRST LOAD
// //     // =====================================================

// //     useEffect(() => {
// //         loadProducts();
// //     }, []);

// //     // =====================================================
// //     // SEARCH PRODUCTS
// //     // =====================================================

// //     const handleSearch = async (e) => {

// //         const keyword = e.target.value;

// //         setSearch(keyword);

// //         // =================================================
// //         // EMPTY SEARCH
// //         // =================================================

// //         if (!keyword.trim()) {

// //             await loadProducts();

// //             return;
// //         }

// //         try {

// //             setLoading(true);

// //             const res =
// //                 await searchProducts(keyword);

// //             console.log(
// //                 "SEARCH API RESPONSE:",
// //                 res.data
// //             );

// //             const searchData =
// //                 Array.isArray(res.data?.data)
// //                     ? res.data.data
// //                     : Array.isArray(res.data)
// //                         ? res.data
// //                         : Array.isArray(res.data?.products)
// //                             ? res.data.products
// //                             : Array.isArray(res.data?.data?.products)
// //                                 ? res.data.data.products
// //                                 : [];

// //             console.log(
// //                 "SEARCH PRODUCTS:",
// //                 searchData
// //             );

// //             setProducts(searchData);
// //             setCurrentPage(1);

// //         } catch (error) {

// //             console.error(
// //                 "SEARCH ERROR:",
// //                 error
// //             );

// //             setProducts([]);

// //             toast.error(
// //                 error.response?.data?.message ||
// //                 "Search failed"
// //             );

// //         } finally {

// //             setLoading(false);
// //         }
// //     };

// //     // =====================================================
// //     // DELETE PRODUCT
// //     // =====================================================

// //     const handleDelete = async (id) => {

// //         const confirmDelete =
// //             window.confirm(
// //                 "Are you sure you want to delete this product?"
// //             );

// //         if (!confirmDelete) {
// //             return;
// //         }

// //         try {

// //             setLoading(true);

// //             console.log(
// //                 "Deleting Product ID:",
// //                 id
// //             );

// //             await deleteProduct(id);

// //             toast.success(
// //                 "Product Deleted Successfully"
// //             );

// //             // Reload product list
// //             await loadProducts();

// //         } catch (error) {

// //             console.error(
// //                 "DELETE PRODUCT ERROR:",
// //                 error
// //             );

// //             toast.error(
// //                 error.response?.data?.message ||
// //                 "Delete Failed"
// //             );

// //         } finally {

// //             setLoading(false);
// //         }
// //     };

// //     // =====================================================
// //     // PAGINATION
// //     // =====================================================

// //     const lastIndex =
// //         currentPage * itemsPerPage;

// //     const firstIndex =
// //         lastIndex - itemsPerPage;

// //     const currentProducts =
// //         products.slice(
// //             firstIndex,
// //             lastIndex
// //         );

// //     const totalPages =
// //         Math.ceil(
// //             products.length /
// //             itemsPerPage
// //         );

// //     // =====================================================
// //     // IMAGE URL
// //     // =====================================================

// //     const getImageUrl = (product) => {

// //         let imageUrl = null;

// //         // -----------------------------------------------
// //         // Multiple possible backend image structures
// //         // -----------------------------------------------

// //         if (
// //             Array.isArray(product?.images) &&
// //             product.images.length > 0
// //         ) {

// //             const firstImage =
// //                 product.images[0];

// //             if (typeof firstImage === "string") {
// //                 imageUrl = firstImage;
// //             } else {
// //                 imageUrl =
// //                     firstImage?.url ||
// //                     firstImage?.path ||
// //                     firstImage?.image ||
// //                     firstImage?.src ||
// //                     null;
// //             }
// //         }

// //         // -----------------------------------------------
// //         // Fallback image fields
// //         // -----------------------------------------------

// //         if (!imageUrl) {

// //             imageUrl =
// //                 product?.image ||
// //                 product?.primaryImage ||
// //                 product?.thumbnail ||
// //                 product?.imageUrl ||
// //                 null;
// //         }

// //         if (!imageUrl) {
// //             return null;
// //         }

// //         // -----------------------------------------------
// //         // Full URL
// //         // -----------------------------------------------

// //         if (
// //             imageUrl.startsWith("http://") ||
// //             imageUrl.startsWith("https://")
// //         ) {

// //             return imageUrl;
// //         }

// //         // -----------------------------------------------
// //         // Backend URL
// //         // -----------------------------------------------

// //         const serverUrl =
// //             String(API || "")
// //                 .replace(/\/api\/?$/, "")
// //                 .replace(/\/$/, "");

// //         const cleanImagePath =
// //             String(imageUrl)
// //                 .replace(/^\/+/, "");

// //         return `${serverUrl}/${cleanImagePath}`;
// //     };

// //     // =====================================================
// //     // PRODUCT TYPE
// //     // =====================================================

// //     const getProductType = (product) => {

// //         return (
// //             product?.productType ||
// //             "NEW"
// //         );
// //     };

// //     // =====================================================
// //     // CATEGORY NAME
// //     // =====================================================

// //     const getCategoryName = (product) => {

// //         if (
// //             typeof product?.category ===
// //             "object"
// //         ) {

// //             return (
// //                 product.category?.name ||
// //                 product.category?.title ||
// //                 "N/A"
// //             );
// //         }

// //         return (
// //             product?.category ||
// //             "N/A"
// //         );
// //     };

// //     // =====================================================
// //     // SUBCATEGORY NAME
// //     // =====================================================

// //     const getSubcategoryName = (product) => {

// //         if (
// //             typeof product?.subcategory ===
// //             "object"
// //         ) {

// //             return (
// //                 product.subcategory?.name ||
// //                 product.subcategory?.title ||
// //                 "N/A"
// //             );
// //         }

// //         return (
// //             product?.subcategory ||
// //             "N/A"
// //         );
// //     };

// //     // =====================================================
// //     // BRAND NAME
// //     // =====================================================

// //     const getBrandName = (product) => {

// //         if (
// //             typeof product?.brand ===
// //             "object"
// //         ) {

// //             return (
// //                 product.brand?.name ||
// //                 product.brand?.title ||
// //                 "N/A"
// //             );
// //         }

// //         return (
// //             product?.brand ||
// //             "N/A"
// //         );
// //     };

// //     // =====================================================
// //     // REFURBISHED DETAILS
// //     // =====================================================

// //     const getRefurbishedDetails = (product) => {

// //         return (
// //             product?.refurbishedDetails ||
// //             null
// //         );
// //     };

// //     // =====================================================
// //     // RENTAL DETAILS
// //     // =====================================================

// //     const getRentalDetails = (product) => {

// //         return (
// //             product?.rental ||
// //             product?.rentalDetails ||
// //             product?.rentalProduct ||
// //             null
// //         );
// //     };

// //     // =====================================================
// //     // RENTAL QUANTITY
// //     // =====================================================

// //     const getRentalQuantity = (product) => {

// //         const rental =
// //             getRentalDetails(product);

// //         if (!rental) {
// //             return null;
// //         }

// //         return {
// //             available:
// //                 rental?.availableQuantity ??
// //                 rental?.availableQty ??
// //                 0,

// //             total:
// //                 rental?.totalQuantity ??
// //                 rental?.quantity ??
// //                 rental?.availableQuantity ??
// //                 0,

// //             rented:
// //                 rental?.rentedQuantity ??
// //                 0
// //         };
// //     };

// //     // =====================================================
// //     // RENTAL STATUS
// //     // =====================================================

// //     const getRentalStatus = (product) => {

// //         const rental =
// //             getRentalDetails(product);

// //         if (!rental) {
// //             return "NOT_CONFIGURED";
// //         }

// //         if (
// //             rental?.isAvailableForRent === true
// //         ) {

// //             return "AVAILABLE";
// //         }

// //         return "UNAVAILABLE";
// //     };

// //     // =====================================================
// //     // FORMAT MONEY
// //     // =====================================================

// //     const formatMoney = (value) => {

// //         const number =
// //             Number(value || 0);

// //         return number.toLocaleString(
// //             "en-IN"
// //         );
// //     };

// //     // =====================================================
// //     // UI
// //     // =====================================================

// //     return (

// //         <div className="product-list1">

// //             {/* =================================================
// //                 HEADER
// //             ================================================= */}

// //             <div className="page-header1">

// //                 <div>

// //                     <h2>
// //                         Product List
// //                     </h2>

// //                     <p>
// //                         Manage all your products
// //                     </p>

// //                 </div>

// //                 <input
// //                     type="text"
// //                     placeholder="Search Product..."
// //                     value={search}
// //                     onChange={handleSearch}
// //                     className="search-box1"
// //                 />

// //             </div>

// //             {/* =================================================
// //                 LOADING
// //             ================================================= */}

// //             {loading ? (

// //                 <div className="loading1">
// //                     Loading Products...
// //                 </div>

// //             ) : (

// //                 <>

// //                     {/* =================================================
// //                         TABLE
// //                     ================================================= */}

// //                     <div className="table-container1">

// //                         <table className="product-table1">

// //                             <thead>

// //                                 <tr>

// //                                     <th>
// //                                         #
// //                                     </th>

// //                                     <th>
// //                                         Image
// //                                     </th>

// //                                     <th>
// //                                         Product Name
// //                                     </th>

// //                                     <th>
// //                                         Type
// //                                     </th>

// //                                     <th>
// //                                         Category
// //                                     </th>

// //                                     <th>
// //                                         Subcategory
// //                                     </th>

// //                                     <th>
// //                                         Brand
// //                                     </th>

// //                                     <th>
// //                                         Refurbished Details
// //                                     </th>

// //                                     <th>
// //                                         Rental Details
// //                                     </th>

// //                                     <th>
// //                                         Purchase Price
// //                                     </th>

// //                                     <th>
// //                                         Selling Price
// //                                     </th>

// //                                     <th>
// //                                         MRP
// //                                     </th>

// //                                     <th>
// //                                         Discount
// //                                     </th>

// //                                     <th>
// //                                         GST
// //                                     </th>

// //                                     <th>
// //                                         Stock
// //                                     </th>

// //                                     <th>
// //                                         Status
// //                                     </th>

// //                                     <th>
// //                                         Actions
// //                                     </th>

// //                                 </tr>

// //                             </thead>

// //                             <tbody>

// //                                 {currentProducts.length > 0 ? (

// //                                     currentProducts.map(
// //                                         (
// //                                             product,
// //                                             index
// //                                         ) => {

// //                                             const imageUrl =
// //                                                 getImageUrl(
// //                                                     product
// //                                                 );

// //                                             const productType =
// //                                                 getProductType(
// //                                                     product
// //                                                 );

// //                                             const refurbishedDetails =
// //                                                 getRefurbishedDetails(
// //                                                     product
// //                                                 );

// //                                             const rentalDetails =
// //                                                 getRentalDetails(
// //                                                     product
// //                                                 );

// //                                             const rentalQuantity =
// //                                                 getRentalQuantity(
// //                                                     product
// //                                                 );

// //                                             const rentalStatus =
// //                                                 getRentalStatus(
// //                                                     product
// //                                                 );

// //                                             return (

// //                                                 <tr
// //                                                     key={
// //                                                         product._id ||
// //                                                         product.id ||
// //                                                         index
// //                                                     }
// //                                                 >

// //                                                     {/* =================================================
// //                                                         NUMBER
// //                                                     ================================================= */}

// //                                                     <td>
// //                                                         {
// //                                                             firstIndex +
// //                                                             index +
// //                                                             1
// //                                                         }
// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         IMAGE
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {imageUrl ? (

// //                                                             <img
// //                                                                 src={
// //                                                                     imageUrl
// //                                                                 }
// //                                                                 alt={
// //                                                                     product.name ||
// //                                                                     "Product"
// //                                                                 }
// //                                                                 className="table-image1"
// //                                                                 onError={(e) => {

// //                                                                     console.error(
// //                                                                         "PRODUCT IMAGE ERROR:",
// //                                                                         imageUrl
// //                                                                     );

// //                                                                     e.target.style.display =
// //                                                                         "none";

// //                                                                 }}
// //                                                             />

// //                                                         ) : (

// //                                                             <div className="no-image1">
// //                                                                 No Image
// //                                                             </div>

// //                                                         )}

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         PRODUCT NAME
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         <strong>
// //                                                             {
// //                                                                 product.name ||
// //                                                                 "N/A"
// //                                                             }
// //                                                         </strong>

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         PRODUCT TYPE
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {productType ===
// //                                                         "REFURBISHED" ? (

// //                                                             <span className="refurbished-badge">
// //                                                                 Refurbished
// //                                                             </span>

// //                                                         ) : productType ===
// //                                                         "RENTAL" ? (

// //                                                             <span className="rental-product-badge">
// //                                                                 Rental
// //                                                             </span>

// //                                                         ) : (

// //                                                             <span className="new-product-badge">
// //                                                                 New
// //                                                             </span>

// //                                                         )}

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         CATEGORY
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             getCategoryName(
// //                                                                 product
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         SUBCATEGORY
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             getSubcategoryName(
// //                                                                 product
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         BRAND
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             getBrandName(
// //                                                                 product
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         REFURBISHED DETAILS
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {productType ===
// //                                                         "REFURBISHED" ? (

// //                                                             refurbishedDetails ? (

// //                                                                 <div className="refurbished-details1">

// //                                                                     <div>
// //                                                                         <strong>
// //                                                                             Grade:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             refurbishedDetails.grade ||
// //                                                                             "N/A"
// //                                                                         }
// //                                                                     </div>

// //                                                                     <div>
// //                                                                         <strong>
// //                                                                             Battery:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             refurbishedDetails.batteryHealth ??
// //                                                                             0
// //                                                                         }%

// //                                                                     </div>

// //                                                                     <div>
// //                                                                         <strong>
// //                                                                             Warranty:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             refurbishedDetails.warrantyMonths ??
// //                                                                             0
// //                                                                         }{" "}
// //                                                                         months
// //                                                                     </div>

// //                                                                     <div>
// //                                                                         <strong>
// //                                                                             Testing:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             refurbishedDetails.testingStatus ||
// //                                                                             "N/A"
// //                                                                         }
// //                                                                     </div>

// //                                                                 </div>

// //                                                             ) : (

// //                                                                 <span>
// //                                                                     No Details
// //                                                                 </span>

// //                                                             )

// //                                                         ) : (

// //                                                             <span className="not-applicable1">
// //                                                                 N/A
// //                                                             </span>

// //                                                         )}

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         RENTAL DETAILS
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {productType ===
// //                                                         "RENTAL" ? (

// //                                                             rentalDetails ? (

// //                                                                 <div className="rental-details1">

// //                                                                     {/* -----------------------------------------
// //                                                                         RENTAL STATUS
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Rental:
// //                                                                         </strong>{" "}

// //                                                                         {rentalStatus ===
// //                                                                         "AVAILABLE" ? (

// //                                                                             <span className="rental-available1">
// //                                                                                 Available
// //                                                                             </span>

// //                                                                         ) : (

// //                                                                             <span className="rental-unavailable1">
// //                                                                                 Unavailable
// //                                                                             </span>

// //                                                                         )}

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         MONTHLY RENT
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Monthly:
// //                                                                         </strong>{" "}

// //                                                                         ₹
// //                                                                         {formatMoney(
// //                                                                             rentalDetails.monthlyRent
// //                                                                         )}

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         SECURITY DEPOSIT
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Deposit:
// //                                                                         </strong>{" "}

// //                                                                         ₹
// //                                                                         {formatMoney(
// //                                                                             rentalDetails.securityDeposit
// //                                                                         )}

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         MINIMUM MONTHS
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Minimum:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             rentalDetails.minimumRentalMonths ??
// //                                                                             3
// //                                                                         }{" "}
// //                                                                         months

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         GST
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             GST:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             rentalDetails.gst ??
// //                                                                             0
// //                                                                         }%

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         QUANTITY
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Available:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             rentalQuantity?.available ??
// //                                                                             0
// //                                                                         }

// //                                                                     </div>

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Total:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             rentalQuantity?.total ??
// //                                                                             0
// //                                                                         }

// //                                                                     </div>

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Rented:
// //                                                                         </strong>{" "}

// //                                                                         {
// //                                                                             rentalQuantity?.rented ??
// //                                                                             0
// //                                                                         }

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         SOFTWARE
// //                                                                     ----------------------------------------- */}

// //                                                                     <div>

// //                                                                         <strong>
// //                                                                             Software:
// //                                                                         </strong>{" "}

// //                                                                         {rentalDetails.basicSoftwareInstalled ===
// //                                                                         true
// //                                                                             ? "Installed"
// //                                                                             : "Not Installed"}

// //                                                                     </div>

// //                                                                     {/* -----------------------------------------
// //                                                                         INCLUDED ITEMS
// //                                                                     ----------------------------------------- */}

// //                                                                     {Array.isArray(
// //                                                                         rentalDetails.includedItems
// //                                                                     ) &&
// //                                                                     rentalDetails.includedItems.length >
// //                                                                     0 ? (

// //                                                                         <div>

// //                                                                             <strong>
// //                                                                                 Included:
// //                                                                             </strong>{" "}

// //                                                                             {
// //                                                                                 rentalDetails.includedItems.join(
// //                                                                                     ", "
// //                                                                                 )
// //                                                                             }

// //                                                                         </div>

// //                                                                     ) : null}

// //                                                                 </div>

// //                                                             ) : (

// //                                                                 <span className="rental-not-configured1">
// //                                                                     Rental Not Configured
// //                                                                 </span>

// //                                                             )

// //                                                         ) : (

// //                                                             <span className="not-applicable1">
// //                                                                 N/A
// //                                                             </span>

// //                                                         )}

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         PURCHASE PRICE
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         ₹{" "}

// //                                                         {
// //                                                             formatMoney(
// //                                                                 product.pricing
// //                                                                     ?.purchasePrice
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         SELLING PRICE
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         ₹{" "}

// //                                                         {
// //                                                             formatMoney(
// //                                                                 product.pricing
// //                                                                     ?.sellingPrice
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         MRP
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         ₹{" "}

// //                                                         {
// //                                                             formatMoney(
// //                                                                 product.pricing
// //                                                                     ?.mrp
// //                                                             )
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         DISCOUNT
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             product.pricing
// //                                                                 ?.discount ??
// //                                                             0
// //                                                         }%

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         GST
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             product.pricing
// //                                                                 ?.gst ??
// //                                                             0
// //                                                         }%

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         STOCK
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {
// //                                                             product.inventory
// //                                                                 ?.currentStock ??
// //                                                             product.stock ??
// //                                                             0
// //                                                         }

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         STATUS
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         {product.status ===
// //                                                         "ACTIVE" ? (

// //                                                             <span className="active-status">
// //                                                                 Active
// //                                                             </span>

// //                                                         ) : (

// //                                                             <span className="inactive-status">
// //                                                                 Inactive
// //                                                             </span>

// //                                                         )}

// //                                                     </td>

// //                                                     {/* =================================================
// //                                                         ACTIONS
// //                                                     ================================================= */}

// //                                                     <td>

// //                                                         <button
// //                                                             type="button"
// //                                                             className="delete-btn1"
// //                                                             onClick={() =>
// //                                                                 handleDelete(
// //                                                                     product._id ||
// //                                                                     product.id
// //                                                                 )
// //                                                             }
// //                                                         >
// //                                                             Delete
// //                                                         </button>

// //                                                     </td>

// //                                                 </tr>

// //                                             );
// //                                         }
// //                                     )

// //                                 ) : (

// //                                     <tr>

// //                                         <td
// //                                             colSpan="17"
// //                                             className="no-products1"
// //                                         >
// //                                             No Products Found
// //                                         </td>

// //                                     </tr>

// //                                 )}

// //                             </tbody>

// //                         </table>

// //                     </div>

// //                     {/* =================================================
// //                         PAGINATION
// //                     ================================================= */}

// //                     {totalPages > 1 && (

// //                         <div className="pagination1">

// //                             <button
// //                                 type="button"
// //                                 disabled={
// //                                     currentPage === 1
// //                                 }
// //                                 onClick={() =>
// //                                     setCurrentPage(
// //                                         currentPage - 1
// //                                     )
// //                                 }
// //                             >
// //                                 Previous
// //                             </button>

// //                             {[...Array(totalPages)].map(
// //                                 (_, index) => (

// //                                     <button
// //                                         type="button"
// //                                         key={index}
// //                                         className={
// //                                             currentPage ===
// //                                             index + 1
// //                                                 ? "active-page"
// //                                                 : ""
// //                                         }
// //                                         onClick={() =>
// //                                             setCurrentPage(
// //                                                 index + 1
// //                                             )
// //                                         }
// //                                     >
// //                                         {
// //                                             index + 1
// //                                         }
// //                                     </button>

// //                                 )
// //                             )}

// //                             <button
// //                                 type="button"
// //                                 disabled={
// //                                     currentPage ===
// //                                     totalPages
// //                                 }
// //                                 onClick={() =>
// //                                     setCurrentPage(
// //                                         currentPage + 1
// //                                     )
// //                                 }
// //                             >
// //                                 Next
// //                             </button>

// //                         </div>

// //                     )}

// //                 </>

// //             )}

// //         </div>
// //     );
// // };

// // export default ProductList;



// import React, { useEffect, useState } from "react";

// import "./ProductList.css";

// import {
//     getProducts,
//     deleteProduct,
//     searchProducts
// } from "../../../../services/productService";

// import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;

// const ProductList = () => {

//     // =====================================================
//     // STATES
//     // =====================================================

//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     const itemsPerPage = 10;

//     // =====================================================
//     // LOAD ALL PRODUCTS
//     // =====================================================

//     const loadProducts = async () => {
//         try {
//             setLoading(true);

//             const res = await getProducts();

//             console.log(
//                 "PRODUCT LIST API RESPONSE:",
//                 res.data
//             );

//             // Backend response:
//             //
//             // {
//             //     success: true,
//             //     message: "...",
//             //     data: [...]
//             // }

//             const productData =
//                 Array.isArray(res.data?.data)
//                     ? res.data.data
//                     : Array.isArray(res.data)
//                         ? res.data
//                         : Array.isArray(res.data?.products)
//                             ? res.data.products
//                             : Array.isArray(res.data?.data?.products)
//                                 ? res.data.data.products
//                                 : [];

//             console.log(
//                 "PRODUCTS SET TO STATE:",
//                 productData
//             );

//             setProducts(productData);
//             setCurrentPage(1);

//         } catch (error) {

//             console.error(
//                 "GET PRODUCTS ERROR:",
//                 error
//             );

//             setProducts([]);

//             toast.error(
//                 error.response?.data?.message ||
//                 "Failed to load products"
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // FIRST LOAD
//     // =====================================================

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     // =====================================================
//     // SEARCH PRODUCTS
//     // =====================================================

//     const handleSearch = async (e) => {

//         const keyword = e.target.value;

//         setSearch(keyword);

//         // =================================================
//         // EMPTY SEARCH
//         // =================================================

//         if (!keyword.trim()) {

//             await loadProducts();

//             return;
//         }

//         try {

//             setLoading(true);

//             const res =
//                 await searchProducts(keyword);

//             console.log(
//                 "SEARCH API RESPONSE:",
//                 res.data
//             );

//             const searchData =
//                 Array.isArray(res.data?.data)
//                     ? res.data.data
//                     : Array.isArray(res.data)
//                         ? res.data
//                         : Array.isArray(res.data?.products)
//                             ? res.data.products
//                             : Array.isArray(res.data?.data?.products)
//                                 ? res.data.data.products
//                                 : [];

//             console.log(
//                 "SEARCH PRODUCTS:",
//                 searchData
//             );

//             setProducts(searchData);
//             setCurrentPage(1);

//         } catch (error) {

//             console.error(
//                 "SEARCH ERROR:",
//                 error
//             );

//             setProducts([]);

//             toast.error(
//                 error.response?.data?.message ||
//                 "Search failed"
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // DELETE PRODUCT
//     // =====================================================

//     const handleDelete = async (id) => {

//         const confirmDelete =
//             window.confirm(
//                 "Are you sure you want to delete this product?"
//             );

//         if (!confirmDelete) {
//             return;
//         }

//         try {

//             setLoading(true);

//             console.log(
//                 "Deleting Product ID:",
//                 id
//             );

//             await deleteProduct(id);

//             toast.success(
//                 "Product Deleted Successfully"
//             );

//             // Reload product list
//             await loadProducts();

//         } catch (error) {

//             console.error(
//                 "DELETE PRODUCT ERROR:",
//                 error
//             );

//             toast.error(
//                 error.response?.data?.message ||
//                 "Delete Failed"
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // PAGINATION
//     // =====================================================

//     const lastIndex =
//         currentPage * itemsPerPage;

//     const firstIndex =
//         lastIndex - itemsPerPage;

//     const currentProducts =
//         products.slice(
//             firstIndex,
//             lastIndex
//         );

//     const totalPages =
//         Math.ceil(
//             products.length /
//             itemsPerPage
//         );

//     // =====================================================
//     // IMAGE URL
//     // =====================================================

//     const getImageUrl = (product) => {

//         let imageUrl = null;

//         // -----------------------------------------------
//         // Multiple possible backend image structures
//         // -----------------------------------------------

//         if (
//             Array.isArray(product?.images) &&
//             product.images.length > 0
//         ) {

//             const firstImage =
//                 product.images[0];

//             if (typeof firstImage === "string") {
//                 imageUrl = firstImage;
//             } else {
//                 imageUrl =
//                     firstImage?.url ||
//                     firstImage?.path ||
//                     firstImage?.image ||
//                     firstImage?.src ||
//                     null;
//             }
//         }

//         // -----------------------------------------------
//         // Fallback image fields
//         // -----------------------------------------------

//         if (!imageUrl) {

//             imageUrl =
//                 product?.image ||
//                 product?.primaryImage ||
//                 product?.thumbnail ||
//                 product?.imageUrl ||
//                 null;
//         }

//         if (!imageUrl) {
//             return null;
//         }

//         // -----------------------------------------------
//         // Full URL
//         // -----------------------------------------------

//         if (
//             imageUrl.startsWith("http://") ||
//             imageUrl.startsWith("https://")
//         ) {

//             return imageUrl;
//         }

//         // -----------------------------------------------
//         // Backend URL
//         // -----------------------------------------------

//         const serverUrl =
//             String(API || "")
//                 .replace(/\/api\/?$/, "")
//                 .replace(/\/$/, "");

//         const cleanImagePath =
//             String(imageUrl)
//                 .replace(/^\/+/, "");

//         return `${serverUrl}/${cleanImagePath}`;
//     };

//     // =====================================================
//     // PRODUCT TYPE
//     // =====================================================

//     const getProductType = (product) => {

//         return (
//             product?.productType ||
//             "NEW"
//         );
//     };

//     // =====================================================
//     // CATEGORY NAME
//     // =====================================================

//     const getCategoryName = (product) => {

//         if (
//             typeof product?.category ===
//             "object"
//         ) {

//             return (
//                 product.category?.name ||
//                 product.category?.title ||
//                 "N/A"
//             );
//         }

//         return (
//             product?.category ||
//             "N/A"
//         );
//     };

//     // =====================================================
//     // SUBCATEGORY NAME
//     // =====================================================

//     const getSubcategoryName = (product) => {

//         if (
//             typeof product?.subcategory ===
//             "object"
//         ) {

//             return (
//                 product.subcategory?.name ||
//                 product.subcategory?.title ||
//                 "N/A"
//             );
//         }

//         return (
//             product?.subcategory ||
//             "N/A"
//         );
//     };

//     // =====================================================
//     // BRAND NAME
//     // =====================================================

//     const getBrandName = (product) => {

//         if (
//             typeof product?.brand ===
//             "object"
//         ) {

//             return (
//                 product.brand?.name ||
//                 product.brand?.title ||
//                 "N/A"
//             );
//         }

//         return (
//             product?.brand ||
//             "N/A"
//         );
//     };

//     // =====================================================
//     // REFURBISHED DETAILS
//     // =====================================================

//     const getRefurbishedDetails = (product) => {

//         return (
//             product?.refurbishedDetails ||
//             null
//         );
//     };

//     // =====================================================
//     // RENTAL DETAILS
//     // =====================================================

//     const getRentalDetails = (product) => {

//         return (
//             product?.rental ||
//             product?.rentalDetails ||
//             product?.rentalProduct ||
//             null
//         );
//     };

//     // =====================================================
//     // RENTAL QUANTITY
//     // =====================================================

//     const getRentalQuantity = (product) => {

//         const rental =
//             getRentalDetails(product);

//         if (!rental) {
//             return null;
//         }

//         return {
//             available:
//                 rental?.availableQuantity ??
//                 rental?.availableQty ??
//                 0,

//             total:
//                 rental?.totalQuantity ??
//                 rental?.quantity ??
//                 rental?.availableQuantity ??
//                 0,

//             rented:
//                 rental?.rentedQuantity ??
//                 0
//         };
//     };

//     // =====================================================
//     // RENTAL STATUS
//     // =====================================================

//     const getRentalStatus = (product) => {

//         const rental =
//             getRentalDetails(product);

//         if (!rental) {
//             return "NOT_CONFIGURED";
//         }

//         if (
//             rental?.isAvailableForRent === true
//         ) {

//             return "AVAILABLE";
//         }

//         return "UNAVAILABLE";
//     };

//     // =====================================================
//     // FORMAT MONEY
//     // =====================================================

//     const formatMoney = (value) => {

//         const number =
//             Number(value || 0);

//         return number.toLocaleString(
//             "en-IN"
//         );
//     };

//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <div className="product-list1">

//             {/* =================================================
//                 HEADER
//             ================================================= */}

//             <div className="page-header1">

//                 <div>

//                     <h2>
//                         Product List
//                     </h2>

//                     <p>
//                         Manage all your products
//                     </p>

//                 </div>

//                 <input
//                     type="text"
//                     placeholder="Search Product..."
//                     value={search}
//                     onChange={handleSearch}
//                     className="search-box1"
//                 />

//             </div>

//             {/* =================================================
//                 LOADING
//             ================================================= */}

//             {loading ? (

//                 <div className="loading1">
//                     Loading Products...
//                 </div>

//             ) : (

//                 <>

//                     {/* =================================================
//                         TABLE
//                     ================================================= */}

//                     <div className="table-container1">

//                         <table className="product-table1">

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         #
//                                     </th>

//                                     <th>
//                                         Image
//                                     </th>

//                                     <th>
//                                         Product Name
//                                     </th>

//                                     <th>
//                                         Type
//                                     </th>

//                                     <th>
//                                         Category
//                                     </th>

//                                     <th>
//                                         Subcategory
//                                     </th>

//                                     <th>
//                                         Brand
//                                     </th>

//                                     <th>
//                                         Refurbished Details
//                                     </th>

//                                     <th>
//                                         Rental Details
//                                     </th>

//                                     <th>
//                                         Purchase Price
//                                     </th>

//                                     <th>
//                                         Retail Price (Personal)
//                                     </th>

//                                     <th>
//                                         Wholesale Price (Business)
//                                     </th>

//                                     <th>
//                                         MRP
//                                     </th>

//                                     <th>
//                                         Discount
//                                     </th>

//                                     <th>
//                                         GST
//                                     </th>

//                                     <th>
//                                         Stock
//                                     </th>

//                                     <th>
//                                         Status
//                                     </th>

//                                     <th>
//                                         Actions
//                                     </th>

//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {currentProducts.length > 0 ? (

//                                     currentProducts.map(
//                                         (
//                                             product,
//                                             index
//                                         ) => {

//                                             const imageUrl =
//                                                 getImageUrl(
//                                                     product
//                                                 );

//                                             const productType =
//                                                 getProductType(
//                                                     product
//                                                 );

//                                             const refurbishedDetails =
//                                                 getRefurbishedDetails(
//                                                     product
//                                                 );

//                                             const rentalDetails =
//                                                 getRentalDetails(
//                                                     product
//                                                 );

//                                             const rentalQuantity =
//                                                 getRentalQuantity(
//                                                     product
//                                                 );

//                                             const rentalStatus =
//                                                 getRentalStatus(
//                                                     product
//                                                 );

//                                             return (

//                                                 <tr
//                                                     key={
//                                                         product._id ||
//                                                         product.id ||
//                                                         index
//                                                     }
//                                                 >

//                                                     {/* =================================================
//                                                         NUMBER
//                                                     ================================================= */}

//                                                     <td>
//                                                         {
//                                                             firstIndex +
//                                                             index +
//                                                             1
//                                                         }
//                                                     </td>

//                                                     {/* =================================================
//                                                         IMAGE
//                                                     ================================================= */}

//                                                     <td>

//                                                         {imageUrl ? (

//                                                             <img
//                                                                 src={
//                                                                     imageUrl
//                                                                 }
//                                                                 alt={
//                                                                     product.name ||
//                                                                     "Product"
//                                                                 }
//                                                                 className="table-image1"
//                                                                 onError={(e) => {

//                                                                     console.error(
//                                                                         "PRODUCT IMAGE ERROR:",
//                                                                         imageUrl
//                                                                     );

//                                                                     e.target.style.display =
//                                                                         "none";

//                                                                 }}
//                                                             />

//                                                         ) : (

//                                                             <div className="no-image1">
//                                                                 No Image
//                                                             </div>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         PRODUCT NAME
//                                                     ================================================= */}

//                                                     <td>

//                                                         <strong>
//                                                             {
//                                                                 product.name ||
//                                                                 "N/A"
//                                                             }
//                                                         </strong>

//                                                     </td>

//                                                     {/* =================================================
//                                                         PRODUCT TYPE
//                                                     ================================================= */}

//                                                     <td>

//                                                         {productType ===
//                                                         "REFURBISHED" ? (

//                                                             <span className="refurbished-badge">
//                                                                 Refurbished
//                                                             </span>

//                                                         ) : productType ===
//                                                         "RENTAL" ? (

//                                                             <span className="rental-product-badge">
//                                                                 Rental
//                                                             </span>

//                                                         ) : (

//                                                             <span className="new-product-badge">
//                                                                 New
//                                                             </span>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         CATEGORY
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             getCategoryName(
//                                                                 product
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         SUBCATEGORY
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             getSubcategoryName(
//                                                                 product
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         BRAND
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             getBrandName(
//                                                                 product
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         REFURBISHED DETAILS
//                                                     ================================================= */}

//                                                     <td>

//                                                         {productType ===
//                                                         "REFURBISHED" ? (

//                                                             refurbishedDetails ? (

//                                                                 <div className="refurbished-details1">

//                                                                     <div>
//                                                                         <strong>
//                                                                             Grade:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             refurbishedDetails.grade ||
//                                                                             "N/A"
//                                                                         }
//                                                                     </div>

//                                                                     <div>
//                                                                         <strong>
//                                                                             Battery:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             refurbishedDetails.batteryHealth ??
//                                                                             0
//                                                                         }%

//                                                                     </div>

//                                                                     <div>
//                                                                         <strong>
//                                                                             Warranty:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             refurbishedDetails.warrantyMonths ??
//                                                                             0
//                                                                         }{" "}
//                                                                         months
//                                                                     </div>

//                                                                     <div>
//                                                                         <strong>
//                                                                             Testing:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             refurbishedDetails.testingStatus ||
//                                                                             "N/A"
//                                                                         }
//                                                                     </div>

//                                                                 </div>

//                                                             ) : (

//                                                                 <span>
//                                                                     No Details
//                                                                 </span>

//                                                             )

//                                                         ) : (

//                                                             <span className="not-applicable1">
//                                                                 N/A
//                                                             </span>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         RENTAL DETAILS
//                                                     ================================================= */}

//                                                     <td>

//                                                         {productType ===
//                                                         "RENTAL" ? (

//                                                             rentalDetails ? (

//                                                                 <div className="rental-details1">

//                                                                     {/* -----------------------------------------
//                                                                         RENTAL STATUS
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Rental:
//                                                                         </strong>{" "}

//                                                                         {rentalStatus ===
//                                                                         "AVAILABLE" ? (

//                                                                             <span className="rental-available1">
//                                                                                 Available
//                                                                             </span>

//                                                                         ) : (

//                                                                             <span className="rental-unavailable1">
//                                                                                 Unavailable
//                                                                             </span>

//                                                                         )}

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         MONTHLY RENT
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Monthly:
//                                                                         </strong>{" "}

//                                                                         ₹
//                                                                         {formatMoney(
//                                                                             rentalDetails.monthlyRent
//                                                                         )}

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         SECURITY DEPOSIT
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Deposit:
//                                                                         </strong>{" "}

//                                                                         ₹
//                                                                         {formatMoney(
//                                                                             rentalDetails.securityDeposit
//                                                                         )}

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         MINIMUM MONTHS
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Minimum:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             rentalDetails.minimumRentalMonths ??
//                                                                             3
//                                                                         }{" "}
//                                                                         months

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         GST
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             GST:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             rentalDetails.gst ??
//                                                                             0
//                                                                         }%

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         QUANTITY
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Available:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             rentalQuantity?.available ??
//                                                                             0
//                                                                         }

//                                                                     </div>

//                                                                     <div>

//                                                                         <strong>
//                                                                             Total:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             rentalQuantity?.total ??
//                                                                             0
//                                                                         }

//                                                                     </div>

//                                                                     <div>

//                                                                         <strong>
//                                                                             Rented:
//                                                                         </strong>{" "}

//                                                                         {
//                                                                             rentalQuantity?.rented ??
//                                                                             0
//                                                                         }

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         SOFTWARE
//                                                                     ----------------------------------------- */}

//                                                                     <div>

//                                                                         <strong>
//                                                                             Software:
//                                                                         </strong>{" "}

//                                                                         {rentalDetails.basicSoftwareInstalled ===
//                                                                         true
//                                                                             ? "Installed"
//                                                                             : "Not Installed"}

//                                                                     </div>

//                                                                     {/* -----------------------------------------
//                                                                         INCLUDED ITEMS
//                                                                     ----------------------------------------- */}

//                                                                     {Array.isArray(
//                                                                         rentalDetails.includedItems
//                                                                     ) &&
//                                                                     rentalDetails.includedItems.length >
//                                                                     0 ? (

//                                                                         <div>

//                                                                             <strong>
//                                                                                 Included:
//                                                                             </strong>{" "}

//                                                                             {
//                                                                                 rentalDetails.includedItems.join(
//                                                                                     ", "
//                                                                                 )
//                                                                             }

//                                                                         </div>

//                                                                     ) : null}

//                                                                 </div>

//                                                             ) : (

//                                                                 <span className="rental-not-configured1">
//                                                                     Rental Not Configured
//                                                                 </span>

//                                                             )

//                                                         ) : (

//                                                             <span className="not-applicable1">
//                                                                 N/A
//                                                             </span>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         PURCHASE PRICE
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             formatMoney(
//                                                                 product.pricing
//                                                                     ?.purchasePrice
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         RETAIL PRICE (PERSONAL CUSTOMERS)
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             formatMoney(
//                                                                 product.pricing
//                                                                     ?.retailPrice
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         WHOLESALE PRICE (BUSINESS CUSTOMERS)
//                                                     ================================================= */}

//                                                     <td>

//                                                         {product.pricing
//                                                             ?.wholesalePrice !==
//                                                             null &&
//                                                         product.pricing
//                                                             ?.wholesalePrice !==
//                                                             undefined ? (

//                                                             <>
//                                                                 ₹{" "}

//                                                                 {
//                                                                     formatMoney(
//                                                                         product.pricing
//                                                                             .wholesalePrice
//                                                                     )
//                                                                 }
//                                                             </>

//                                                         ) : (

//                                                             <span className="not-applicable1">
//                                                                 Not set
//                                                             </span>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         MRP
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             formatMoney(
//                                                                 product.pricing
//                                                                     ?.mrp
//                                                             )
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         DISCOUNT
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             product.pricing
//                                                                 ?.discount ??
//                                                             0
//                                                         }%

//                                                     </td>

//                                                     {/* =================================================
//                                                         GST
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             product.pricing
//                                                                 ?.gst ??
//                                                             0
//                                                         }%

//                                                     </td>

//                                                     {/* =================================================
//                                                         STOCK
//                                                     ================================================= */}

//                                                     <td>

//                                                         {
//                                                             product.inventory
//                                                                 ?.currentStock ??
//                                                             product.stock ??
//                                                             0
//                                                         }

//                                                     </td>

//                                                     {/* =================================================
//                                                         STATUS
//                                                     ================================================= */}

//                                                     <td>

//                                                         {product.status ===
//                                                         "ACTIVE" ? (

//                                                             <span className="active-status">
//                                                                 Active
//                                                             </span>

//                                                         ) : (

//                                                             <span className="inactive-status">
//                                                                 Inactive
//                                                             </span>

//                                                         )}

//                                                     </td>

//                                                     {/* =================================================
//                                                         ACTIONS
//                                                     ================================================= */}

//                                                     <td>

//                                                         <button
//                                                             type="button"
//                                                             className="delete-btn1"
//                                                             onClick={() =>
//                                                                 handleDelete(
//                                                                     product._id ||
//                                                                     product.id
//                                                                 )
//                                                             }
//                                                         >
//                                                             Delete
//                                                         </button>

//                                                     </td>

//                                                 </tr>

//                                             );
//                                         }
//                                     )

//                                 ) : (

//                                     <tr>

//                                         <td
//                                             colSpan="18"
//                                             className="no-products1"
//                                         >
//                                             No Products Found
//                                         </td>

//                                     </tr>

//                                 )}

//                             </tbody>

//                         </table>

//                     </div>

//                     {/* =================================================
//                         PAGINATION
//                     ================================================= */}

//                     {totalPages > 1 && (

//                         <div className="pagination1">

//                             <button
//                                 type="button"
//                                 disabled={
//                                     currentPage === 1
//                                 }
//                                 onClick={() =>
//                                     setCurrentPage(
//                                         currentPage - 1
//                                     )
//                                 }
//                             >
//                                 Previous
//                             </button>

//                             {[...Array(totalPages)].map(
//                                 (_, index) => (

//                                     <button
//                                         type="button"
//                                         key={index}
//                                         className={
//                                             currentPage ===
//                                             index + 1
//                                                 ? "active-page"
//                                                 : ""
//                                         }
//                                         onClick={() =>
//                                             setCurrentPage(
//                                                 index + 1
//                                             )
//                                         }
//                                     >
//                                         {
//                                             index + 1
//                                         }
//                                     </button>

//                                 )
//                             )}

//                             <button
//                                 type="button"
//                                 disabled={
//                                     currentPage ===
//                                     totalPages
//                                 }
//                                 onClick={() =>
//                                     setCurrentPage(
//                                         currentPage + 1
//                                     )
//                                 }
//                             >
//                                 Next
//                             </button>

//                         </div>

//                     )}

//                 </>

//             )}

//         </div>
//     );
// };

// export default ProductList;



import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import "./ProductList.css";

import {
  getProducts,
  deleteProduct,
  searchProducts,
updateProduct,

} from "../../../../services/productService";

import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const API = String(import.meta.env.VITE_API_URL || "/api")
  .replace(/\/+$/, "");

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const extractProducts = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  return [];
};

const numberValue = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const formatMoney = (value) =>
  numberValue(value).toLocaleString("en-IN");

const getProductType = (product) =>
  String(product?.productType || "NEW").toUpperCase();

const getObjectName = (value) => {
  if (value && typeof value === "object") {
    return value.name || value.title || "N/A";
  }

  return value || "N/A";
};

const getRentalDetails = (product) =>
  product?.rental ||
  product?.rentalDetails ||
  product?.rentalProduct ||
  null;

const getRentalQuantity = (product) => {
  const rental = getRentalDetails(product);

  if (!rental) return null;

  return {
    available:
      rental.availableQuantity ??
      rental.availableQty ??
      0,

    total:
      rental.totalQuantity ??
      rental.quantity ??
      rental.availableQuantity ??
      0,

    rented: rental.rentedQuantity ?? 0,
  };
};

const getRentalStatus = (product) => {
  const rental = getRentalDetails(product);

  if (!rental) return "NOT_CONFIGURED";

  return rental.isAvailableForRent === true
    ? "AVAILABLE"
    : "UNAVAILABLE";
};

const getImageUrl = (product) => {
  let imageUrl = null;

  if (Array.isArray(product?.images) && product.images.length) {
    const firstImage = product.images[0];

    imageUrl =
      typeof firstImage === "string"
        ? firstImage
        : firstImage?.url ||
          firstImage?.path ||
          firstImage?.image ||
          firstImage?.src;
  }

  if (!imageUrl) {
    const fallback =
      product?.image ||
      product?.primaryImage ||
      product?.thumbnail ||
      product?.imageUrl;

    imageUrl =
      typeof fallback === "string"
        ? fallback
        : fallback?.url || fallback?.path || null;
  }

  if (!imageUrl || typeof imageUrl !== "string") return null;

  if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
    return imageUrl;
  }

  const serverUrl = API.replace(/\/api\/?$/i, "");
  return `${serverUrl}/${imageUrl.replace(/^\/+/, "")}`;
};

const createEditForm = (product) => {
  const pricing = product?.pricing || {};
  const refurbished = product?.refurbishedDetails || {};
  const rental = getRentalDetails(product) || {};

  return {
    name: product?.name || "",
    productType: getProductType(product),
    status: product?.status || "ACTIVE",

    pricing: {
      purchasePrice: pricing.purchasePrice ?? 0,
      retailPrice: pricing.retailPrice ?? 0,
      wholesalePrice: pricing.wholesalePrice ?? "",
      mrp: pricing.mrp ?? 0,
      discount: pricing.discount ?? 0,
      gst: pricing.gst ?? 0,
    },

    refurbishedDetails: {
      grade: refurbished.grade || "",
      batteryHealth: refurbished.batteryHealth ?? 0,
      warrantyMonths: refurbished.warrantyMonths ?? 0,
      testingStatus: refurbished.testingStatus || "",
    },

    rental: {
      monthlyRent: rental.monthlyRent ?? 0,
      securityDeposit: rental.securityDeposit ?? 0,
      minimumRentalMonths: rental.minimumRentalMonths ?? 3,
      gst: rental.gst ?? 0,
      totalQuantity: rental.totalQuantity ?? rental.quantity ?? 0,
      availableQuantity: rental.availableQuantity ?? 0,
      rentedQuantity: rental.rentedQuantity ?? 0,
      isAvailableForRent: rental.isAvailableForRent === true,
      basicSoftwareInstalled:
        rental.basicSoftwareInstalled === true,
      includedItems: Array.isArray(rental.includedItems)
        ? rental.includedItems.join(", ")
        : "",
    },
  };
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const itemsPerPage = 10;
  const requestIdRef = useRef(0);

  // ==========================================
  // LOAD / SEARCH PRODUCTS
  // ==========================================

  const loadProducts = useCallback(async (keyword = "") => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const res = keyword.trim()
        ? await searchProducts(keyword.trim())
        : await getProducts();

      if (requestId !== requestIdRef.current) return;

      setProducts(extractProducts(res));
      setCurrentPage(1);
    }
     catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("PRODUCT LOAD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        (keyword.trim()
          ? "Search failed"
          : "Failed to load products")
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProducts();

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadProducts]);

  const handleSearch = (e) => {
    const keyword = e.target.value;

    setSearch(keyword);
    setCurrentPage(1);
    loadProducts(keyword);
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Product ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      toast.success("Product Deleted Successfully");

      await loadProducts(search);
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Delete Failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // OPEN / CLOSE EDIT MODAL
  // ==========================================

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditForm(createEditForm(product));
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingProduct(null);
    setEditForm(null);
  };

  // ==========================================
  // EDIT INPUT HANDLERS
  // ==========================================

  const updateMainField = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (section, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

 
const handleSaveEdit = async (e) => {
  e.preventDefault();

  if (!editingProduct || !editForm) {
    return;
  }

  const id = editingProduct._id || editingProduct.id;

  if (!id) {
    toast.error("Product ID not found");
    return;
  }

  if (!editForm.name.trim()) {
    toast.error("Product name is required");
    return;
  }

  const toNumber = (value, fallback = 0) => {
    if (value === "" || value === null || value === undefined) {
      return fallback;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  };

  const pricing = {
    purchasePrice: toNumber(editForm.pricing.purchasePrice),
    retailPrice: toNumber(editForm.pricing.retailPrice),
    mrp: toNumber(editForm.pricing.mrp),
    discount: toNumber(editForm.pricing.discount),
    gst: toNumber(editForm.pricing.gst),
  };

  if (editForm.pricing.wholesalePrice !== "") {
    pricing.wholesalePrice = toNumber(
      editForm.pricing.wholesalePrice
    );
  }

  const payload = {
    name: editForm.name.trim(),
    status: editForm.status,
    pricing,
  };

  // ==========================================
  // REFURBISHED PRODUCT
  // ==========================================

  if (editForm.productType === "REFURBISHED") {
    payload.refurbishedDetails = {
      grade: editForm.refurbishedDetails.grade,
      batteryHealth: toNumber(
        editForm.refurbishedDetails.batteryHealth
      ),
      warrantyMonths: toNumber(
        editForm.refurbishedDetails.warrantyMonths
      ),
      testingStatus:
        editForm.refurbishedDetails.testingStatus,
    };
  }

  // ==========================================
  // RENTAL PRODUCT
  // ==========================================

  if (editForm.productType === "RENTAL") {
    payload.rental = {
      monthlyRent: toNumber(editForm.rental.monthlyRent),
      securityDeposit: toNumber(
        editForm.rental.securityDeposit
      ),
      minimumRentalMonths: toNumber(
        editForm.rental.minimumRentalMonths,
        3
      ),
      gst: toNumber(editForm.rental.gst),
      isAvailableForRent:
        editForm.rental.isAvailableForRent,
      basicSoftwareInstalled:
        editForm.rental.basicSoftwareInstalled,
      includedItems: editForm.rental.includedItems
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  // ==========================================
  // UPDATE PRODUCT API
  // ==========================================

  try {
    setSaving(true);

    const response = await updateProduct(id, payload);

    if (response.data?.success === false) {
      throw new Error(
        response.data?.message || "Product update failed"
      );
    }

    toast.success("Product Updated Successfully");

    setEditingProduct(null);
    setEditForm(null);

    await loadProducts(search);
  } 
 
catch (error) {
  const response = error.response?.data;

  console.error("========== PRODUCT UPDATE FAILED ==========");
  console.error("HTTP STATUS:", error.response?.status);
  console.error("BACKEND RESPONSE:", response);
  console.error("VALIDATION ERRORS:", response?.errors);
  console.error("SENT PAYLOAD:", payload);

  let message =
    response?.message ||
    error.message ||
    "Product update failed";

  if (Array.isArray(response?.errors) && response.errors.length) {
    message = response.errors
      .map((item) => {
        if (typeof item === "string") return item;

        return (
          item.message ||
          item.msg ||
          JSON.stringify(item)
        );
      })
      .join(", ");
  }

  toast.error(message);
} finally {
    setSaving(false);
  }
};

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const safePage = Math.max(
    1,
    Math.min(currentPage, totalPages || 1)
  );

  const firstIndex = (safePage - 1) * itemsPerPage;

  const currentProducts = products.slice(
    firstIndex,
    firstIndex + itemsPerPage
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="product-list1">
      <div className="page-header1">
        <div>
          <h2>Product List</h2>
          <p>Manage all your products</p>
        </div>

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={handleSearch}
          className="search-box1"
        />
      </div>

      {loading ? (
        <div className="loading1">
          Loading Products...
        </div>
      ) : (
        <>
          <div className="table-container1">
            <table className="product-table1">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Brand</th>
                  <th>Refurbished Details</th>
                  <th>Rental Details</th>
                  <th>Purchase Price</th>
                  <th>Retail Price (Personal)</th>
                  <th>Wholesale Price (Business)</th>
                  <th>MRP</th>
                  <th>Discount</th>
                  <th>GST</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => {
                    const id = product._id || product.id;
                    const imageUrl = getImageUrl(product);
                    const productType = getProductType(product);
                    const refurbishedDetails =
                      product.refurbishedDetails;

                    const rentalDetails =
                      getRentalDetails(product);

                    const rentalQuantity =
                      getRentalQuantity(product);

                    const rentalStatus =
                      getRentalStatus(product);

                    return (
                      <tr key={id || index}>
                        <td>{firstIndex + index + 1}</td>

                        <td>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name || "Product"}
                              className="table-image1"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="no-image1">
                              No Image
                            </div>
                          )}
                        </td>

                        <td>
                          <strong>
                            {product.name || "N/A"}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              productType === "REFURBISHED"
                                ? "refurbished-badge"
                                : productType === "RENTAL"
                                ? "rental-product-badge"
                                : "new-product-badge"
                            }
                          >
                            {productType === "REFURBISHED"
                              ? "Refurbished"
                              : productType === "RENTAL"
                              ? "Rental"
                              : "New"}
                          </span>
                        </td>

                        <td>{getObjectName(product.category)}</td>

                        <td>
                          {getObjectName(product.subcategory)}
                        </td>

                        <td>{getObjectName(product.brand)}</td>

                        <td>
                          {productType === "REFURBISHED" ? (
                            refurbishedDetails ? (
                              <div className="refurbished-details1">
                                <div>
                                  <strong>Grade:</strong>{" "}
                                  {refurbishedDetails.grade || "N/A"}
                                </div>
                                <div>
                                  <strong>Battery:</strong>{" "}
                                  {refurbishedDetails.batteryHealth ?? 0}%
                                </div>
                                <div>
                                  <strong>Warranty:</strong>{" "}
                                  {refurbishedDetails.warrantyMonths ?? 0} months
                                </div>
                                <div>
                                  <strong>Testing:</strong>{" "}
                                  {refurbishedDetails.testingStatus || "N/A"}
                                </div>
                              </div>
                            ) : (
                              "No Details"
                            )
                          ) : (
                            <span className="not-applicable1">
                              N/A
                            </span>
                          )}
                        </td>

                        <td>
                          {productType === "RENTAL" ? (
                            rentalDetails ? (
                              <div className="rental-details1">
                                <div>
                                  <strong>Rental:</strong>{" "}
                                  <span
                                    className={
                                      rentalStatus === "AVAILABLE"
                                        ? "rental-available1"
                                        : "rental-unavailable1"
                                    }
                                  >
                                    {rentalStatus === "AVAILABLE"
                                      ? "Available"
                                      : "Unavailable"}
                                  </span>
                                </div>

                                <div>
                                  <strong>Monthly:</strong> ₹
                                  {formatMoney(rentalDetails.monthlyRent)}
                                </div>

                                <div>
                                  <strong>Deposit:</strong> ₹
                                  {formatMoney(rentalDetails.securityDeposit)}
                                </div>

                                <div>
                                  <strong>Minimum:</strong>{" "}
                                  {rentalDetails.minimumRentalMonths ?? 3} months
                                </div>

                                <div>
                                  <strong>GST:</strong>{" "}
                                  {rentalDetails.gst ?? 0}%
                                </div>

                                <div>
                                  <strong>Available:</strong>{" "}
                                  {rentalQuantity?.available ?? 0}
                                </div>

                                <div>
                                  <strong>Total:</strong>{" "}
                                  {rentalQuantity?.total ?? 0}
                                </div>

                                <div>
                                  <strong>Rented:</strong>{" "}
                                  {rentalQuantity?.rented ?? 0}
                                </div>

                                <div>
                                  <strong>Software:</strong>{" "}
                                  {rentalDetails.basicSoftwareInstalled
                                    ? "Installed"
                                    : "Not Installed"}
                                </div>

                                {Array.isArray(
                                  rentalDetails.includedItems
                                ) &&
                                  rentalDetails.includedItems.length > 0 && (
                                    <div>
                                      <strong>Included:</strong>{" "}
                                      {rentalDetails.includedItems.join(", ")}
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <span className="rental-not-configured1">
                                Rental Not Configured
                              </span>
                            )
                          ) : (
                            <span className="not-applicable1">
                              N/A
                            </span>
                          )}
                        </td>

                        <td>
                          ₹ {formatMoney(product.pricing?.purchasePrice)}
                        </td>

                        <td>
                          ₹ {formatMoney(product.pricing?.retailPrice)}
                        </td>

                        <td>
                          {product.pricing?.wholesalePrice != null ? (
                            <>
                              ₹{" "}
                              {formatMoney(
                                product.pricing.wholesalePrice
                              )}
                            </>
                          ) : (
                            <span className="not-applicable1">
                              Not set
                            </span>
                          )}
                        </td>

                        <td>
                          ₹ {formatMoney(product.pricing?.mrp)}
                        </td>

                        <td>
                          {product.pricing?.discount ?? 0}%
                        </td>

                        <td>
                          {product.pricing?.gst ?? 0}%
                        </td>

                        <td>
                          {product.inventory?.currentStock ??
                            product.stock ??
                            0}
                        </td>

                        <td>
                          <span
                            className={
                              product.status === "ACTIVE"
                                ? "active-status"
                                : "inactive-status"
                            }
                          >
                            {product.status === "ACTIVE"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <div className="product-actions1">
                            <button
                              type="button"
                              className="edit-btn1"
                              onClick={() => openEdit(product)}
                              disabled={deletingId === id}
                            >
                              <FaEdit /> Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn1"
                              onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                            >
                              <FaTrash />{" "}
                              {deletingId === id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={18} className="no-products1">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(safePage - 1)}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={
                      safePage === index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ======================================
          EDIT PRODUCT MODAL
      ====================================== */}

      {editingProduct && editForm && (
        <div
          className="product-edit-overlay1"
          onClick={closeEdit}
        >
          <div
            className="product-edit-modal1"
            role="dialog"
            aria-modal="true"
            aria-label="Edit product"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product-edit-header1">
              <div>
                <h2>Edit Product</h2>
                <p>
                  {editingProduct.name}
                </p>
              </div>

              <button
                type="button"
                className="product-edit-close1"
                onClick={closeEdit}
                disabled={saving}
                aria-label="Close edit product"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="product-edit-body1">
                <div className="product-edit-grid1">
                  <label>
                    Product Name
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        updateMainField(
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Product Type
                    <input
                      value={editForm.productType}
                      disabled
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        updateMainField(
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </label>
                </div>

                <h3>Pricing Details</h3>

                <div className="product-edit-grid1">
                  {[
                    ["purchasePrice", "Purchase Price"],
                    ["retailPrice", "Retail Price"],
                    ["wholesalePrice", "Wholesale Price"],
                    ["mrp", "MRP"],
                    ["discount", "Discount (%)"],
                    ["gst", "GST (%)"],
                  ].map(([field, label]) => (
                    <label key={field}>
                      {label}
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editForm.pricing[field]}
                        onChange={(e) =>
                          updateNestedField(
                            "pricing",
                            field,
                            e.target.value
                          )
                        }
                      />
                    </label>
                  ))}
                </div>

                {editForm.productType === "REFURBISHED" && (
                  <>
                    <h3>Refurbished Details</h3>

                    <div className="product-edit-grid1">
                      <label>
                        Grade
                        <input
                          value={editForm.refurbishedDetails.grade}
                          onChange={(e) =>
                            updateNestedField(
                              "refurbishedDetails",
                              "grade",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Battery Health (%)
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            editForm.refurbishedDetails.batteryHealth
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "refurbishedDetails",
                              "batteryHealth",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Warranty (Months)
                        <input
                          type="number"
                          min="0"
                          value={
                            editForm.refurbishedDetails.warrantyMonths
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "refurbishedDetails",
                              "warrantyMonths",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Testing Status
                        <input
                          value={
                            editForm.refurbishedDetails.testingStatus
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "refurbishedDetails",
                              "testingStatus",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </>
                )}

                {editForm.productType === "RENTAL" && (
                  <>
                    <h3>Rental Details</h3>

                    <div className="product-edit-grid1">
                      {[
                        ["monthlyRent", "Monthly Rent"],
                        ["securityDeposit", "Security Deposit"],
                        ["minimumRentalMonths", "Minimum Rental Months"],
                        ["gst", "Rental GST (%)"],
                      ].map(([field, label]) => (
                        <label key={field}>
                          {label}
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={editForm.rental[field]}
                            onChange={(e) =>
                              updateNestedField(
                                "rental",
                                field,
                                e.target.value
                              )
                            }
                          />
                        </label>
                      ))}

                      <label>
                        Rental Availability
                        <select
                          value={
                            editForm.rental.isAvailableForRent
                              ? "true"
                              : "false"
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "rental",
                              "isAvailableForRent",
                              e.target.value === "true"
                            )
                          }
                        >
                          <option value="true">Available</option>
                          <option value="false">Unavailable</option>
                        </select>
                      </label>

                      <label>
                        Basic Software
                        <select
                          value={
                            editForm.rental.basicSoftwareInstalled
                              ? "true"
                              : "false"
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "rental",
                              "basicSoftwareInstalled",
                              e.target.value === "true"
                            )
                          }
                        >
                          <option value="true">Installed</option>
                          <option value="false">Not Installed</option>
                        </select>
                      </label>

                      <label className="product-edit-wide1">
                        Included Items (comma separated)
                        <textarea
                          rows={3}
                          value={editForm.rental.includedItems}
                          onChange={(e) =>
                            updateNestedField(
                              "rental",
                              "includedItems",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <p className="product-edit-note1">
                      Rental quantities are managed separately
                      through inventory and rental APIs.
                    </p>
                  </>
                )}
              </div>

              <div className="product-edit-footer1">
                <button
                  type="button"
                  className="product-edit-cancel1"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="product-edit-save1"
                  disabled={saving}
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;