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

//                         : [];


//             console.log(
//                 "PRODUCTS SET TO STATE:",
//                 productData
//             );


//             setProducts(productData);

//             setCurrentPage(1);

//         }

//         catch (error) {

//             console.error(
//                 "GET PRODUCTS ERROR:",
//                 error
//             );

//             setProducts([]);

//             toast.error(
//                 error.response?.data?.message ||
//                 "Failed to load products"
//             );

//         }

//         finally {

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

//         const keyword =
//             e.target.value;


//         setSearch(keyword);


//         // =================================================
//         // EMPTY SEARCH
//         // =================================================

//         if (!keyword.trim()) {

//             loadProducts();

//             return;

//         }


//         try {

//             setLoading(true);


//             const res =
//                 await searchProducts(
//                     keyword
//                 );


//             console.log(
//                 "SEARCH API RESPONSE:",
//                 res.data
//             );


//             const searchData =

//                 Array.isArray(
//                     res.data?.data
//                 )

//                     ? res.data.data

//                     : Array.isArray(res.data)

//                         ? res.data

//                         : [];


//             console.log(
//                 "SEARCH PRODUCTS:",
//                 searchData
//             );


//             setProducts(searchData);

//             setCurrentPage(1);

//         }

//         catch (error) {

//             console.error(
//                 "SEARCH ERROR:",
//                 error
//             );

//             setProducts([]);

//         }

//         finally {

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

//         }

//         catch (error) {

//             console.error(
//                 "DELETE PRODUCT ERROR:",
//                 error
//             );


//             toast.error(

//                 error.response?.data?.message ||

//                 "Delete Failed"

//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };


//     // =====================================================
//     // PAGINATION
//     // =====================================================

//     const lastIndex =
//         currentPage *
//         itemsPerPage;


//     const firstIndex =
//         lastIndex -
//         itemsPerPage;


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

//         const imageUrl =
//             product?.images?.[0]?.url;


//         if (!imageUrl) {

//             return null;

//         }


//         if (

//             imageUrl.startsWith("http://") ||

//             imageUrl.startsWith("https://")

//         ) {

//             return imageUrl;

//         }


//         const serverUrl =
//             API.replace(
//                 /\/api\/?$/,
//                 ""
//             );


//         return `${serverUrl}${imageUrl}`;

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

//     const getRefurbishedDetails = (
//         product
//     ) => {

//         return (
//             product?.refurbishedDetails ||
//             null
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
//                                         Purchase Price
//                                     </th>

//                                     <th>
//                                         Selling Price
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
//                                                         PURCHASE PRICE
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             product.pricing
//                                                                 ?.purchasePrice ??
//                                                             0
//                                                         }

//                                                     </td>


//                                                     {/* =================================================
//                                                         SELLING PRICE
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             product.pricing
//                                                                 ?.sellingPrice ??
//                                                             0
//                                                         }

//                                                     </td>


//                                                     {/* =================================================
//                                                         MRP
//                                                     ================================================= */}

//                                                     <td>

//                                                         ₹{" "}

//                                                         {
//                                                             product.pricing
//                                                                 ?.mrp ??
//                                                             0
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
//                                                                     product._id
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
//                                             colSpan="16"
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


import React, { useEffect, useState } from "react";

import "./ProductList.css";

import {
    getProducts,
    deleteProduct,
    searchProducts
} from "../../../../services/productService";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const ProductList = () => {

    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    // =====================================================
    // LOAD ALL PRODUCTS
    // =====================================================

    const loadProducts = async () => {
        try {
            setLoading(true);

            const res = await getProducts();

            console.log(
                "PRODUCT LIST API RESPONSE:",
                res.data
            );

            // Backend response:
            //
            // {
            //     success: true,
            //     message: "...",
            //     data: [...]
            // }

            const productData =
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res.data?.products)
                            ? res.data.products
                            : Array.isArray(res.data?.data?.products)
                                ? res.data.data.products
                                : [];

            console.log(
                "PRODUCTS SET TO STATE:",
                productData
            );

            setProducts(productData);
            setCurrentPage(1);

        } catch (error) {

            console.error(
                "GET PRODUCTS ERROR:",
                error
            );

            setProducts([]);

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // FIRST LOAD
    // =====================================================

    useEffect(() => {
        loadProducts();
    }, []);

    // =====================================================
    // SEARCH PRODUCTS
    // =====================================================

    const handleSearch = async (e) => {

        const keyword = e.target.value;

        setSearch(keyword);

        // =================================================
        // EMPTY SEARCH
        // =================================================

        if (!keyword.trim()) {

            await loadProducts();

            return;
        }

        try {

            setLoading(true);

            const res =
                await searchProducts(keyword);

            console.log(
                "SEARCH API RESPONSE:",
                res.data
            );

            const searchData =
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res.data?.products)
                            ? res.data.products
                            : Array.isArray(res.data?.data?.products)
                                ? res.data.data.products
                                : [];

            console.log(
                "SEARCH PRODUCTS:",
                searchData
            );

            setProducts(searchData);
            setCurrentPage(1);

        } catch (error) {

            console.error(
                "SEARCH ERROR:",
                error
            );

            setProducts([]);

            toast.error(
                error.response?.data?.message ||
                "Search failed"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            setLoading(true);

            console.log(
                "Deleting Product ID:",
                id
            );

            await deleteProduct(id);

            toast.success(
                "Product Deleted Successfully"
            );

            // Reload product list
            await loadProducts();

        } catch (error) {

            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const lastIndex =
        currentPage * itemsPerPage;

    const firstIndex =
        lastIndex - itemsPerPage;

    const currentProducts =
        products.slice(
            firstIndex,
            lastIndex
        );

    const totalPages =
        Math.ceil(
            products.length /
            itemsPerPage
        );

    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (product) => {

        let imageUrl = null;

        // -----------------------------------------------
        // Multiple possible backend image structures
        // -----------------------------------------------

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {

            const firstImage =
                product.images[0];

            if (typeof firstImage === "string") {
                imageUrl = firstImage;
            } else {
                imageUrl =
                    firstImage?.url ||
                    firstImage?.path ||
                    firstImage?.image ||
                    firstImage?.src ||
                    null;
            }
        }

        // -----------------------------------------------
        // Fallback image fields
        // -----------------------------------------------

        if (!imageUrl) {

            imageUrl =
                product?.image ||
                product?.primaryImage ||
                product?.thumbnail ||
                product?.imageUrl ||
                null;
        }

        if (!imageUrl) {
            return null;
        }

        // -----------------------------------------------
        // Full URL
        // -----------------------------------------------

        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {

            return imageUrl;
        }

        // -----------------------------------------------
        // Backend URL
        // -----------------------------------------------

        const serverUrl =
            String(API || "")
                .replace(/\/api\/?$/, "")
                .replace(/\/$/, "");

        const cleanImagePath =
            String(imageUrl)
                .replace(/^\/+/, "");

        return `${serverUrl}/${cleanImagePath}`;
    };

    // =====================================================
    // PRODUCT TYPE
    // =====================================================

    const getProductType = (product) => {

        return (
            product?.productType ||
            "NEW"
        );
    };

    // =====================================================
    // CATEGORY NAME
    // =====================================================

    const getCategoryName = (product) => {

        if (
            typeof product?.category ===
            "object"
        ) {

            return (
                product.category?.name ||
                product.category?.title ||
                "N/A"
            );
        }

        return (
            product?.category ||
            "N/A"
        );
    };

    // =====================================================
    // SUBCATEGORY NAME
    // =====================================================

    const getSubcategoryName = (product) => {

        if (
            typeof product?.subcategory ===
            "object"
        ) {

            return (
                product.subcategory?.name ||
                product.subcategory?.title ||
                "N/A"
            );
        }

        return (
            product?.subcategory ||
            "N/A"
        );
    };

    // =====================================================
    // BRAND NAME
    // =====================================================

    const getBrandName = (product) => {

        if (
            typeof product?.brand ===
            "object"
        ) {

            return (
                product.brand?.name ||
                product.brand?.title ||
                "N/A"
            );
        }

        return (
            product?.brand ||
            "N/A"
        );
    };

    // =====================================================
    // REFURBISHED DETAILS
    // =====================================================

    const getRefurbishedDetails = (product) => {

        return (
            product?.refurbishedDetails ||
            null
        );
    };

    // =====================================================
    // RENTAL DETAILS
    // =====================================================

    const getRentalDetails = (product) => {

        return (
            product?.rental ||
            product?.rentalDetails ||
            product?.rentalProduct ||
            null
        );
    };

    // =====================================================
    // RENTAL QUANTITY
    // =====================================================

    const getRentalQuantity = (product) => {

        const rental =
            getRentalDetails(product);

        if (!rental) {
            return null;
        }

        return {
            available:
                rental?.availableQuantity ??
                rental?.availableQty ??
                0,

            total:
                rental?.totalQuantity ??
                rental?.quantity ??
                rental?.availableQuantity ??
                0,

            rented:
                rental?.rentedQuantity ??
                0
        };
    };

    // =====================================================
    // RENTAL STATUS
    // =====================================================

    const getRentalStatus = (product) => {

        const rental =
            getRentalDetails(product);

        if (!rental) {
            return "NOT_CONFIGURED";
        }

        if (
            rental?.isAvailableForRent === true
        ) {

            return "AVAILABLE";
        }

        return "UNAVAILABLE";
    };

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        const number =
            Number(value || 0);

        return number.toLocaleString(
            "en-IN"
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="product-list1">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-header1">

                <div>

                    <h2>
                        Product List
                    </h2>

                    <p>
                        Manage all your products
                    </p>

                </div>

                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={handleSearch}
                    className="search-box1"
                />

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="loading1">
                    Loading Products...
                </div>

            ) : (

                <>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="table-container1">

                        <table className="product-table1">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Product Name
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Subcategory
                                    </th>

                                    <th>
                                        Brand
                                    </th>

                                    <th>
                                        Refurbished Details
                                    </th>

                                    <th>
                                        Rental Details
                                    </th>

                                    <th>
                                        Purchase Price
                                    </th>

                                    <th>
                                        Selling Price
                                    </th>

                                    <th>
                                        MRP
                                    </th>

                                    <th>
                                        Discount
                                    </th>

                                    <th>
                                        GST
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {currentProducts.length > 0 ? (

                                    currentProducts.map(
                                        (
                                            product,
                                            index
                                        ) => {

                                            const imageUrl =
                                                getImageUrl(
                                                    product
                                                );

                                            const productType =
                                                getProductType(
                                                    product
                                                );

                                            const refurbishedDetails =
                                                getRefurbishedDetails(
                                                    product
                                                );

                                            const rentalDetails =
                                                getRentalDetails(
                                                    product
                                                );

                                            const rentalQuantity =
                                                getRentalQuantity(
                                                    product
                                                );

                                            const rentalStatus =
                                                getRentalStatus(
                                                    product
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        product._id ||
                                                        product.id ||
                                                        index
                                                    }
                                                >

                                                    {/* =================================================
                                                        NUMBER
                                                    ================================================= */}

                                                    <td>
                                                        {
                                                            firstIndex +
                                                            index +
                                                            1
                                                        }
                                                    </td>

                                                    {/* =================================================
                                                        IMAGE
                                                    ================================================= */}

                                                    <td>

                                                        {imageUrl ? (

                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                className="table-image1"
                                                                onError={(e) => {

                                                                    console.error(
                                                                        "PRODUCT IMAGE ERROR:",
                                                                        imageUrl
                                                                    );

                                                                    e.target.style.display =
                                                                        "none";

                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="no-image1">
                                                                No Image
                                                            </div>

                                                        )}

                                                    </td>

                                                    {/* =================================================
                                                        PRODUCT NAME
                                                    ================================================= */}

                                                    <td>

                                                        <strong>
                                                            {
                                                                product.name ||
                                                                "N/A"
                                                            }
                                                        </strong>

                                                    </td>

                                                    {/* =================================================
                                                        PRODUCT TYPE
                                                    ================================================= */}

                                                    <td>

                                                        {productType ===
                                                        "REFURBISHED" ? (

                                                            <span className="refurbished-badge">
                                                                Refurbished
                                                            </span>

                                                        ) : productType ===
                                                        "RENTAL" ? (

                                                            <span className="rental-product-badge">
                                                                Rental
                                                            </span>

                                                        ) : (

                                                            <span className="new-product-badge">
                                                                New
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* =================================================
                                                        CATEGORY
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            getCategoryName(
                                                                product
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        SUBCATEGORY
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            getSubcategoryName(
                                                                product
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        BRAND
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            getBrandName(
                                                                product
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        REFURBISHED DETAILS
                                                    ================================================= */}

                                                    <td>

                                                        {productType ===
                                                        "REFURBISHED" ? (

                                                            refurbishedDetails ? (

                                                                <div className="refurbished-details1">

                                                                    <div>
                                                                        <strong>
                                                                            Grade:
                                                                        </strong>{" "}

                                                                        {
                                                                            refurbishedDetails.grade ||
                                                                            "N/A"
                                                                        }
                                                                    </div>

                                                                    <div>
                                                                        <strong>
                                                                            Battery:
                                                                        </strong>{" "}

                                                                        {
                                                                            refurbishedDetails.batteryHealth ??
                                                                            0
                                                                        }%

                                                                    </div>

                                                                    <div>
                                                                        <strong>
                                                                            Warranty:
                                                                        </strong>{" "}

                                                                        {
                                                                            refurbishedDetails.warrantyMonths ??
                                                                            0
                                                                        }{" "}
                                                                        months
                                                                    </div>

                                                                    <div>
                                                                        <strong>
                                                                            Testing:
                                                                        </strong>{" "}

                                                                        {
                                                                            refurbishedDetails.testingStatus ||
                                                                            "N/A"
                                                                        }
                                                                    </div>

                                                                </div>

                                                            ) : (

                                                                <span>
                                                                    No Details
                                                                </span>

                                                            )

                                                        ) : (

                                                            <span className="not-applicable1">
                                                                N/A
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* =================================================
                                                        RENTAL DETAILS
                                                    ================================================= */}

                                                    <td>

                                                        {productType ===
                                                        "RENTAL" ? (

                                                            rentalDetails ? (

                                                                <div className="rental-details1">

                                                                    {/* -----------------------------------------
                                                                        RENTAL STATUS
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Rental:
                                                                        </strong>{" "}

                                                                        {rentalStatus ===
                                                                        "AVAILABLE" ? (

                                                                            <span className="rental-available1">
                                                                                Available
                                                                            </span>

                                                                        ) : (

                                                                            <span className="rental-unavailable1">
                                                                                Unavailable
                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        MONTHLY RENT
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Monthly:
                                                                        </strong>{" "}

                                                                        ₹
                                                                        {formatMoney(
                                                                            rentalDetails.monthlyRent
                                                                        )}

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        SECURITY DEPOSIT
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Deposit:
                                                                        </strong>{" "}

                                                                        ₹
                                                                        {formatMoney(
                                                                            rentalDetails.securityDeposit
                                                                        )}

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        MINIMUM MONTHS
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Minimum:
                                                                        </strong>{" "}

                                                                        {
                                                                            rentalDetails.minimumRentalMonths ??
                                                                            3
                                                                        }{" "}
                                                                        months

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        GST
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            GST:
                                                                        </strong>{" "}

                                                                        {
                                                                            rentalDetails.gst ??
                                                                            0
                                                                        }%

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        QUANTITY
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Available:
                                                                        </strong>{" "}

                                                                        {
                                                                            rentalQuantity?.available ??
                                                                            0
                                                                        }

                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            Total:
                                                                        </strong>{" "}

                                                                        {
                                                                            rentalQuantity?.total ??
                                                                            0
                                                                        }

                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            Rented:
                                                                        </strong>{" "}

                                                                        {
                                                                            rentalQuantity?.rented ??
                                                                            0
                                                                        }

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        SOFTWARE
                                                                    ----------------------------------------- */}

                                                                    <div>

                                                                        <strong>
                                                                            Software:
                                                                        </strong>{" "}

                                                                        {rentalDetails.basicSoftwareInstalled ===
                                                                        true
                                                                            ? "Installed"
                                                                            : "Not Installed"}

                                                                    </div>

                                                                    {/* -----------------------------------------
                                                                        INCLUDED ITEMS
                                                                    ----------------------------------------- */}

                                                                    {Array.isArray(
                                                                        rentalDetails.includedItems
                                                                    ) &&
                                                                    rentalDetails.includedItems.length >
                                                                    0 ? (

                                                                        <div>

                                                                            <strong>
                                                                                Included:
                                                                            </strong>{" "}

                                                                            {
                                                                                rentalDetails.includedItems.join(
                                                                                    ", "
                                                                                )
                                                                            }

                                                                        </div>

                                                                    ) : null}

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

                                                    {/* =================================================
                                                        PURCHASE PRICE
                                                    ================================================= */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            formatMoney(
                                                                product.pricing
                                                                    ?.purchasePrice
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        SELLING PRICE
                                                    ================================================= */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            formatMoney(
                                                                product.pricing
                                                                    ?.sellingPrice
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        MRP
                                                    ================================================= */}

                                                    <td>

                                                        ₹{" "}

                                                        {
                                                            formatMoney(
                                                                product.pricing
                                                                    ?.mrp
                                                            )
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        DISCOUNT
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            product.pricing
                                                                ?.discount ??
                                                            0
                                                        }%

                                                    </td>

                                                    {/* =================================================
                                                        GST
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            product.pricing
                                                                ?.gst ??
                                                            0
                                                        }%

                                                    </td>

                                                    {/* =================================================
                                                        STOCK
                                                    ================================================= */}

                                                    <td>

                                                        {
                                                            product.inventory
                                                                ?.currentStock ??
                                                            product.stock ??
                                                            0
                                                        }

                                                    </td>

                                                    {/* =================================================
                                                        STATUS
                                                    ================================================= */}

                                                    <td>

                                                        {product.status ===
                                                        "ACTIVE" ? (

                                                            <span className="active-status">
                                                                Active
                                                            </span>

                                                        ) : (

                                                            <span className="inactive-status">
                                                                Inactive
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* =================================================
                                                        ACTIONS
                                                    ================================================= */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="delete-btn1"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product._id ||
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="17"
                                            className="no-products1"
                                        >
                                            No Products Found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {totalPages > 1 && (

                        <div className="pagination1">

                            <button
                                type="button"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map(
                                (_, index) => (

                                    <button
                                        type="button"
                                        key={index}
                                        className={
                                            currentPage ===
                                            index + 1
                                                ? "active-page"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                index + 1
                                            )
                                        }
                                    >
                                        {
                                            index + 1
                                        }
                                    </button>

                                )
                            )}

                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>
    );
};

export default ProductList;