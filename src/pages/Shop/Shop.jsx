// import React, {
//     useEffect,
//     useMemo,
//     useState
// } from "react";

// import "./Shop.css";

// import {
//     Link,
//     useNavigate
// } from "react-router-dom";

// import {
//     getShopProducts
// } from "../../services/productService";

// import {
//     addToCart
// } from "../../services/cartService";

// import {
//     addToWishlist
// } from "../../services/wishlistService";

// import {
//     getShopInventory
// } from "../../services/inventoryService";


// const Shop = () => {

//     const navigate = useNavigate();


//     // ==================================================
//     // STATES
//     // ==================================================

//     const [products, setProducts] =
//         useState([]);

//     const [inventory, setInventory] =
//         useState([]);

//     const [loading, setLoading] =
//         useState(true);

//     const [inventoryLoading, setInventoryLoading] =
//         useState(true);

//     const [search, setSearch] =
//         useState("");

//     const [category, setCategory] =
//         useState("");

//     const [brand, setBrand] =
//         useState("");

//     const [sort, setSort] =
//         useState("");

//     const [addingCartId, setAddingCartId] =
//         useState(null);

//     const [wishlistLoadingId, setWishlistLoadingId] =
//         useState(null);


//     // ==================================================
//     // LOAD SHOP DATA
//     // ==================================================

//     useEffect(() => {

//         loadShopData();

//     }, []);


//     const loadShopData = async () => {

//         try {

//             setLoading(true);
//             setInventoryLoading(true);


//             // ==========================================
//             // PRODUCTS
//             // ==========================================

//             const productResponse =
//                 await getShopProducts();


//             console.log(
//                 "SHOP PRODUCTS RESPONSE:",
//                 productResponse.data
//             );


//             const productData =
//                 Array.isArray(
//                     productResponse.data?.data
//                 )

//                     ? productResponse.data.data

//                     : [];


//             setProducts(
//                 productData
//             );


//             // ==========================================
//             // PUBLIC INVENTORY
//             // ==========================================

//             try {

//                 const inventoryResponse =
//                     await getShopInventory();


//                 console.log(
//                     "SHOP INVENTORY RESPONSE:",
//                     inventoryResponse.data
//                 );


//                 const inventoryData =
//                     Array.isArray(
//                         inventoryResponse.data?.data
//                     )

//                         ? inventoryResponse.data.data

//                         : [];


//                 setInventory(
//                     inventoryData
//                 );

//             }

//             catch (inventoryError) {

//                 console.error(
//                     "SHOP INVENTORY ERROR:",
//                     inventoryError
//                 );


//                 console.error(
//                     "INVENTORY BACKEND RESPONSE:",
//                     inventoryError.response?.data
//                 );


//                 setInventory([]);

//             }

//         }

//         catch (error) {

//             console.error(
//                 "SHOP DATA ERROR:",
//                 error
//             );


//             console.error(
//                 "BACKEND RESPONSE:",
//                 error.response?.data
//             );


//             setProducts([]);

//         }

//         finally {

//             setLoading(false);

//             setInventoryLoading(false);

//         }

//     };


//     // ==================================================
//     // INVENTORY MAP
//     // ==================================================

//     const inventoryMap =
//         useMemo(() => {

//             const map = {};


//             inventory.forEach(
//                 (item) => {

//                     const productId =
//                         item.product?._id ||
//                         item.product;


//                     if (!productId) {

//                         return;

//                     }


//                     const currentStock =
//                         Number(
//                             item.currentStock || 0
//                         );


//                     const reservedStock =
//                         Number(
//                             item.reservedStock || 0
//                         );


//                     const availableStock =
//                         item.availableStock !== undefined

//                             ?

//                             Number(
//                                 item.availableStock
//                             )

//                             :

//                             Math.max(
//                                 currentStock -
//                                 reservedStock,
//                                 0
//                             );


//                     map[
//                         productId.toString()
//                     ] = {

//                         ...item,

//                         currentStock,

//                         reservedStock,

//                         availableStock

//                     };

//                 }

//             );


//             return map;

//         }, [inventory]);


//     // ==================================================
//     // GET PRODUCT INVENTORY
//     // ==================================================

//     const getProductInventory =
//         (product) => {

//             if (!product?._id) {

//                 return {

//                     currentStock: 0,

//                     reservedStock: 0,

//                     availableStock: 0,

//                     status:
//                         "OUT_OF_STOCK"

//                 };

//             }


//             const item =
//                 inventoryMap[
//                     product._id.toString()
//                 ];


//             if (!item) {

//                 return {

//                     currentStock: 0,

//                     reservedStock: 0,

//                     availableStock: 0,

//                     status:
//                         "OUT_OF_STOCK"

//                 };

//             }


//             return item;

//         };


//     // ==================================================
//     // FILTER PRODUCTS
//     // ==================================================

//     const filteredProducts =
//         useMemo(() => {

//             let data = [
//                 ...products
//             ];


//             // SEARCH

//             if (
//                 search.trim()
//             ) {

//                 const searchText =
//                     search
//                         .trim()
//                         .toLowerCase();


//                 data =
//                     data.filter(
//                         (product) => {

//                             const name =
//                                 (
//                                     product.name ||
//                                     ""
//                                 ).toLowerCase();


//                             const sku =
//                                 (
//                                     product.sku ||
//                                     ""
//                                 ).toLowerCase();


//                             const categoryName =
//                                 (
//                                     product.category?.name ||
//                                     ""
//                                 ).toLowerCase();


//                             const brandName =
//                                 (
//                                     product.brand?.name ||
//                                     ""
//                                 ).toLowerCase();


//                             return (

//                                 name.includes(
//                                     searchText
//                                 )

//                                 ||

//                                 sku.includes(
//                                     searchText
//                                 )

//                                 ||

//                                 categoryName.includes(
//                                     searchText
//                                 )

//                                 ||

//                                 brandName.includes(
//                                     searchText
//                                 )

//                             );

//                         }

//                     );

//             }


//             // CATEGORY

//             if (category) {

//                 data =
//                     data.filter(

//                         product =>
//                             product.category?.name ===
//                             category

//                     );

//             }


//             // BRAND

//             if (brand) {

//                 data =
//                     data.filter(

//                         product =>
//                             product.brand?.name ===
//                             brand

//                     );

//             }


//             // PRICE LOW

//             if (
//                 sort === "low"
//             ) {

//                 data.sort(

//                     (a, b) =>

//                         Number(
//                             a.pricing?.sellingPrice || 0
//                         )

//                         -

//                         Number(
//                             b.pricing?.sellingPrice || 0
//                         )

//                 );

//             }


//             // PRICE HIGH

//             if (
//                 sort === "high"
//             ) {

//                 data.sort(

//                     (a, b) =>

//                         Number(
//                             b.pricing?.sellingPrice || 0
//                         )

//                         -

//                         Number(
//                             a.pricing?.sellingPrice || 0
//                         )

//                 );

//             }


//             return data;

//         }, [

//             products,
//             search,
//             category,
//             brand,
//             sort

//         ]);


//     // ==================================================
//     // ADD TO CART
//     // ==================================================

// const handleAddToCart = async (product) => {

//     // ==================================================
//     // CHECK LOGIN
//     // ==================================================

//     const token =
//         localStorage.getItem("token");


//     if (!token) {

//         alert(
//             "Please Login First"
//         );

//         navigate(
//             "/login"
//         );

//         return;

//     }


//     // ==================================================
//     // CHECK PRODUCT
//     // ==================================================

//     if (!product?._id) {

//         alert(
//             "Invalid product"
//         );

//         return;

//     }


//     // ==================================================
//     // CHECK PRICE
//     // ==================================================

//     const sellingPrice =
//         Number(
//             product.pricing?.sellingPrice || 0
//         );


//     if (
//         sellingPrice <= 0
//     ) {

//         alert(
//             "Product price is not available"
//         );

//         return;

//     }


//     // ==================================================
//     // CHECK INVENTORY
//     // ==================================================

//     const stock =
//         getProductInventory(
//             product
//         );


//     const availableStock =
//         Number(
//             stock.availableStock || 0
//         );


//     if (
//         availableStock <= 0
//     ) {

//         alert(
//             "Product is currently out of stock"
//         );

//         return;

//     }


//     // ==================================================
//     // ADD TO CART
//     // ==================================================

//     try {

//         setAddingCartId(
//             product._id
//         );


//         const cartData = {

//             product:
//                 product._id,

//             quantity:
//                 1

//         };


//         console.log(
//             "ADDING PRODUCT TO CART:",
//             product._id
//         );


//         console.log(
//             "CART REQUEST DATA:",
//             cartData
//         );


//         const response =
//             await addToCart(
//                 cartData
//             );


//         console.log(
//             "ADD TO CART RESPONSE:",
//             response.data
//         );


//         alert(
//             "Product Added To Cart Successfully"
//         );


//         // Go to cart

//         navigate(
//             "/cart"
//         );

//     }

//     catch (error) {

//         console.error(
//             "================================"
//         );


//         console.error(
//             "ADD TO CART ERROR"
//         );


//         console.error(
//             "STATUS:",
//             error.response?.status
//         );


//         console.error(
//             "BACKEND RESPONSE:",
//             error.response?.data
//         );


//         console.error(
//             "ERROR:",
//             error
//         );


//         console.error(
//             "================================"
//         );


//         alert(

//             error.response?.data?.message ||

//             "Failed to add product to cart"

//         );

//     }

//     finally {

//         setAddingCartId(
//             null
//         );

//     }

// };


//     // ==================================================
//     // WISHLIST
//     // ==================================================

//     const handleWishlist =
//         async (product) => {

//             const token =
//                 localStorage.getItem(
//                     "token"
//                 );


//             if (!token) {

//                 alert(
//                     "Please Login First"
//                 );

//                 navigate(
//                     "/login"
//                 );

//                 return;

//             }


//             try {

//                 setWishlistLoadingId(
//                     product._id
//                 );


//                 const response =
//                     await addToWishlist(
//                         product._id
//                     );


//                 console.log(
//                     "WISHLIST RESPONSE:",
//                     response.data
//                 );


//                 alert(
//                     "Added To Wishlist"
//                 );

//             }

//             catch (error) {

//                 console.error(
//                     "WISHLIST ERROR:",
//                     error
//                 );


//                 alert(

//                     error.response?.data?.message ||

//                     "Failed to add to wishlist"

//                 );

//             }

//             finally {

//                 setWishlistLoadingId(
//                     null
//                 );

//             }

//         };


//     // ==================================================
//     // IMAGE URL
//     // ==================================================

//     const getImageUrl =
//         (product) => {

//             const image =
//                 product?.images?.[0];


//             if (!image) {

//                 return "/no-image.png";

//             }


//             const imageUrl =
//                 typeof image === "string"

//                     ?

//                     image

//                     :

//                     image.url;


//             if (!imageUrl) {

//                 return "/no-image.png";

//             }


//             if (
//                 imageUrl.startsWith(
//                     "http"
//                 )
//             ) {

//                 return imageUrl;

//             }


//             return (
//                 `http://localhost:5000${imageUrl}`
//             );

//         };


//     // ==================================================
//     // CATEGORIES
//     // ==================================================

//     const categories =
//         useMemo(() => {

//             const values =
//                 products

//                     .map(
//                         product =>
//                             product.category?.name
//                     )

//                     .filter(Boolean);


//             return [
//                 ...new Set(values)
//             ];

//         }, [products]);


//     // ==================================================
//     // BRANDS
//     // ==================================================

//     const brands =
//         useMemo(() => {

//             const values =
//                 products

//                     .map(
//                         product =>
//                             product.brand?.name
//                     )

//                     .filter(Boolean);


//             return [
//                 ...new Set(values)
//             ];

//         }, [products]);


//     // ==================================================
//     // LOADING
//     // ==================================================

//     if (loading) {

//         return (

//             <div className="shop-page">

//                 <div className="loading">

//                     Loading Products...

//                 </div>

//             </div>

//         );

//     }


//     // ==================================================
//     // UI
//     // ==================================================

//     return (

//         <div className="shop-page">


//             <div className="shop-header">

//                 <div>

//                     <h2>
//                         Shop
//                     </h2>

//                     <p>
//                         Browse All Products
//                     </p>

//                 </div>


//                 <div className="product-count">

//                     Showing{" "}

//                     <strong>
//                         {filteredProducts.length}
//                     </strong>

//                     {" "}products

//                 </div>

//             </div>


//             {/* ==========================================
//                 FILTERS
//             ========================================== */}

//             <div className="shop-filters">


//                 <input

//                     type="text"

//                     placeholder="Search Product / SKU..."

//                     value={search}

//                     onChange={
//                         (e) =>
//                             setSearch(
//                                 e.target.value
//                             )
//                     }

//                 />


//                 <select

//                     value={category}

//                     onChange={
//                         (e) =>
//                             setCategory(
//                                 e.target.value
//                             )
//                     }

//                 >

//                     <option value="">

//                         All Categories

//                     </option>


//                     {
//                         categories.map(
//                             (name) => (

//                                 <option
//                                     key={name}
//                                     value={name}
//                                 >

//                                     {name}

//                                 </option>

//                             )
//                         )
//                     }

//                 </select>


//                 <select

//                     value={brand}

//                     onChange={
//                         (e) =>
//                             setBrand(
//                                 e.target.value
//                             )
//                     }

//                 >

//                     <option value="">

//                         All Brands

//                     </option>


//                     {
//                         brands.map(
//                             (name) => (

//                                 <option
//                                     key={name}
//                                     value={name}
//                                 >

//                                     {name}

//                                 </option>

//                             )
//                         )
//                     }

//                 </select>


//                 <select

//                     value={sort}

//                     onChange={
//                         (e) =>
//                             setSort(
//                                 e.target.value
//                             )
//                     }

//                 >

//                     <option value="">

//                         Sort By

//                     </option>

//                     <option value="low">

//                         Price Low to High

//                     </option>

//                     <option value="high">

//                         Price High to Low

//                     </option>

//                 </select>

//             </div>


//             {/* ==========================================
//                 INVENTORY LOADING
//             ========================================== */}

//             {
//                 inventoryLoading && (

//                     <div className="inventory-loading">

//                         Loading stock information...

//                     </div>

//                 )
//             }


//             {/* ==========================================
//                 PRODUCTS
//             ========================================== */}

//             {
//                 filteredProducts.length > 0

//                     ?

//                     (

//                         <div className="product-grid">

//                             {
//                                 filteredProducts.map(
//                                     (product) => {

//                                         const stock =
//                                             getProductInventory(
//                                                 product
//                                             );


//                                         const currentStock =
//                                             Number(
//                                                 stock.currentStock || 0
//                                             );


//                                         const reservedStock =
//                                             Number(
//                                                 stock.reservedStock || 0
//                                             );


//                                         const availableStock =
//                                             Number(
//                                                 stock.availableStock || 0
//                                             );


//                                         const inStock =
//                                             availableStock > 0;


//                                         const discount =
//                                             Number(
//                                                 product.pricing?.discount || 0
//                                             );


//                                         return (

//                                             <div
//                                                 className="product-card"
//                                                 key={product._id}
//                                             >


//                                                 {/* IMAGE */}

//                                                 <div className="product-image-box">

//                                                     <img

//                                                         src={
//                                                             getImageUrl(
//                                                                 product
//                                                             )
//                                                         }

//                                                         alt={
//                                                             product.name ||
//                                                             "Product"
//                                                         }

//                                                         className="product-image"

//                                                         onError={
//                                                             (e) => {

//                                                                 e.currentTarget.src =
//                                                                     "/no-image.png";

//                                                             }
//                                                         }

//                                                     />


//                                                     {
//                                                         discount > 0 && (

//                                                             <span className="discount-badge">

//                                                                 {discount}%
//                                                                 {" "}
//                                                                 OFF

//                                                             </span>

//                                                         )
//                                                     }

//                                                 </div>


//                                                 {/* DETAILS */}

//                                                 <div className="product-info">

//                                                     <h3>

//                                                         {product.name}

//                                                     </h3>


//                                                     <p className="category">

//                                                         {
//                                                             product.category?.name ||
//                                                             "No Category"
//                                                         }

//                                                     </p>


//                                                     <p className="brand">

//                                                         {
//                                                             product.brand?.name ||
//                                                             "No Brand"
//                                                         }

//                                                     </p>


//                                                     <p className="sku">

//                                                         SKU:
//                                                         {" "}
//                                                         {
//                                                             product.sku ||
//                                                             "-"
//                                                         }

//                                                     </p>


//                                                     {/* PRICE */}

//                                                     <div className="price-section">

//                                                         <span className="selling-price">

//                                                             ₹{" "}

//                                                             {
//                                                                 product.pricing?.sellingPrice ??
//                                                                 0
//                                                             }

//                                                         </span>


//                                                         {
//                                                             Number(
//                                                                 product.pricing?.mrp || 0
//                                                             ) >
//                                                             Number(
//                                                                 product.pricing?.sellingPrice || 0
//                                                             )

//                                                             &&

//                                                             (

//                                                                 <span className="mrp-price">

//                                                                     ₹{" "}

//                                                                     {
//                                                                         product.pricing.mrp
//                                                                     }

//                                                                 </span>

//                                                             )

//                                                         }

//                                                     </div>


//                                                     {/* STOCK */}

//                                                     <div className="stock-information">


//                                                         {
//                                                             inStock

//                                                                 ?

//                                                                 (

//                                                                     <>

//                                                                         <span className="stock in-stock">

//                                                                             In Stock

//                                                                         </span>


//                                                                         <span className="available-stock">

//                                                                             {availableStock}

//                                                                             {" "}
//                                                                             available

//                                                                         </span>

//                                                                     </>

//                                                                 )

//                                                                 :

//                                                                 (

//                                                                     <span className="stock out-stock">

//                                                                         Out Of Stock

//                                                                     </span>

//                                                                 )

//                                                         }


//                                                         {
//                                                             reservedStock > 0 && (

//                                                                 <span className="reserved-stock">

//                                                                     Reserved:
//                                                                     {" "}
//                                                                     {reservedStock}

//                                                                 </span>

//                                                             )
//                                                         }


//                                                         {
//                                                             inStock &&
//                                                             currentStock > 0 &&
//                                                             availableStock <= 5 && (

//                                                                 <span className="low-stock-message">

//                                                                     Only{" "}
//                                                                     {availableStock}
//                                                                     {" "}
//                                                                     left

//                                                                 </span>

//                                                             )
//                                                         }

//                                                     </div>

//                                                 </div>


//                                                 {/* BUTTONS */}

//                                                 <div className="product-buttons">


//                                                     <Link

//                                                         to={
//                                                             `/shop/product/${product._id}`
//                                                         }

//                                                         className="details-btn"

//                                                     >

//                                                         View Details

//                                                     </Link>


//                                                     <button

//                                                         className="cart-btn"

//                                                         onClick={() =>
//                                                             handleAddToCart(
//                                                                 product
//                                                             )
//                                                         }

//                                                         disabled={
//                                                             !inStock ||
//                                                             addingCartId ===
//                                                             product._id
//                                                         }

//                                                     >

//                                                         {
//                                                             addingCartId ===
//                                                             product._id

//                                                                 ?

//                                                                 "Adding..."

//                                                                 :

//                                                             inStock

//                                                                 ?

//                                                                 "Add To Cart"

//                                                                 :

//                                                                 "Out Of Stock"

//                                                         }

//                                                     </button>


//                                                     <button

//                                                         className="wishlist-btn"

//                                                         onClick={() =>
//                                                             handleWishlist(
//                                                                 product
//                                                             )
//                                                         }

//                                                         disabled={
//                                                             wishlistLoadingId ===
//                                                             product._id
//                                                         }

//                                                     >

//                                                         {
//                                                             wishlistLoadingId ===
//                                                             product._id

//                                                                 ?

//                                                                 "..."

//                                                                 :

//                                                                 "❤️"

//                                                         }

//                                                     </button>

//                                                 </div>

//                                             </div>

//                                         );

//                                     }
//                                 )
//                             }

//                         </div>

//                     )

//                     :

//                     (

//                         <div className="no-products">

//                             No Products Found

//                         </div>

//                     )

//             }

//         </div>

//     );

// };


// export default Shop;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Shared Layout Components
// import Topbar from "../../components/Topbar/Topbar";

import Topbar from "../../components/TopBar/TopBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Page Sub-Component
import LaptopSection from "./LaptopSection/LaptopSection";

// Services
import { getShopProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";

// Theme configuration for category sections
const THEMES = {
  gaming: {
    badgeBg: "from-purple-600 to-indigo-600",
    badgeShadow: "shadow-purple-500/20",
    pillBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60",
  },
  business: {
    badgeBg: "from-blue-600 to-indigo-600",
    badgeShadow: "shadow-blue-500/20",
    pillBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
  },
  chromebook: {
    badgeBg: "from-amber-500 to-orange-600",
    badgeShadow: "shadow-amber-500/20",
    pillBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60",
  },
  other: {
    badgeBg: "from-teal-500 to-emerald-600",
    badgeShadow: "shadow-teal-500/20",
    pillBg: "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
  },
};

const Shop = () => {
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("");

  // 1. Fetch Products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getShopProducts();
      const productList = Array.isArray(res.data?.data) ? res.data.data : [];

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Dynamic Dropdown Lists derived directly from products state
  const categoriesList = Array.from(
    new Set(
      products
        .map((p) =>
          typeof p.category === "object" ? p.category?.name : p.category
        )
        .filter(Boolean)
    )
  );

  const brandsList = Array.from(
    new Set(
      products
        .map((p) => (typeof p.brand === "object" ? p.brand?.name : p.brand))
        .filter(Boolean)
    )
  );

  // 3. Filter & Sort Logic
  useEffect(() => {
    let data = Array.isArray(products) ? [...products] : [];

    if (search) {
      data = data.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(
        (product) =>
          (product.category?.name || product.category) === category
      );
    }

    if (brand) {
      data = data.filter(
        (product) =>
          (product.brand?.name || product.brand) === brand
      );
    }

    if (sort === "low") {
      data.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }

    if (sort === "high") {
      data.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }

    setFilteredProducts(data);
  }, [search, category, brand, sort, products]);

  // Cart Handler
  // const handleAddToCart = async (product) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.error("Please Login First");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     await addToCart({ product: product._id, quantity: 1 });
  //     toast.error("Added To Cart");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to add to cart");
  //   }
  // };

const handleAddToCart = async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please Login First");
    navigate("/login");
    return;
  }

  try {
    await addToCart({
      product: product._id,
      quantity: 1,
    });

    toast.success("Added To Cart");

    // Navigate to Cart Page
    navigate("/cart");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add to cart"
    );
  }
};
  

  // Wishlist Handler
  const handleWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please Login First");
      navigate("/login");
      return;
    }

    try {
      await addToWishlist(product._id);
      toast.success("Added To Wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Topbar />
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto w-full space-y-8">

        {/* MAIN PAGE TITLE WITH SLOWER SMOOTH ZOOM */}
        <div className="overflow-hidden py-1">
          <motion.h1
            initial={{
              fontWeight: 300,
              scale: 0.92,
              opacity: 0.6,
            }}
            whileInView={{
              fontWeight: 900,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.2,
              ease: [0.25, 1, 0.5, 1],
            }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight origin-left transition-colors duration-300"
          >
            Laptops
          </motion.h1>
        </div>

        {/* ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gray-100/80 dark:border-slate-800">

          {/* Left Side: Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* 1. Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 pl-8 pr-4 py-1.5 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none border border-transparent focus:border-gray-300 dark:border-slate-800 dark:focus:border-slate-700 transition-all w-40 focus:w-52"
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>

            {/* Separator / Filter Label */}
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 ml-1">Filters:</span>

            {/* 2. Category Pill Dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="" className="dark:bg-slate-900 dark:text-slate-200">Category</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900 dark:text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* 3. Brand Pill Dropdown */}
            <div className="relative">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="" className="dark:bg-slate-900 dark:text-slate-200">Brand</option>
                {brandsList.map((b) => (
                  <option key={b} value={b} className="dark:bg-slate-900 dark:text-slate-200">
                    {b}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Right Side: Sort Pill Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pl-8 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
            >
              <option value="" className="dark:bg-slate-900 dark:text-slate-200">Sort by: Recommended</option>
              <option value="low" className="dark:bg-slate-900 dark:text-slate-200">Price: Low to High</option>
              <option value="high" className="dark:bg-slate-900 dark:text-slate-200">Price: High to Low</option>
            </select>

            {/* Sort Icon */}
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h7.5"
                />
              </svg>
            </div>

            {/* Arrow Icon */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* MAIN PRODUCT LIST SECTIONS */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-28">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 dark:border-slate-100 border-t-transparent"></div>
            <span className="mt-3 text-gray-500 dark:text-slate-400 font-medium text-xs">
              Loading laptops...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 rounded-3xl space-y-2">
            <div className="text-2xl">🔍</div>
            <p className="text-gray-900 dark:text-white font-bold text-base">No Products Found</p>
            <p className="text-gray-400 dark:text-slate-400 text-xs">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* 1. Gaming Laptops Section */}
            {filteredProducts.some((p) =>
              (p.category?.name || p.category || "")
                .toLowerCase()
                .includes("gaming")
            ) && (
                <LaptopSection
                  icon="🎮"
                  title="Gaming Laptops"
                  items={filteredProducts.filter((p) =>
                    (p.category?.name || p.category || "")
                      .toLowerCase()
                      .includes("gaming")
                  )}
                  theme={THEMES.gaming}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleWishlist}
                />
              )}

            {/* 2. Business Laptops Section */}
            {filteredProducts.some((p) =>
              (p.category?.name || p.category || "")
                .toLowerCase()
                .includes("business")
            ) && (
                <LaptopSection
                  icon="💼"
                  title="Business Laptops"
                  items={filteredProducts.filter((p) =>
                    (p.category?.name || p.category || "")
                      .toLowerCase()
                      .includes("business")
                  )}
                  theme={THEMES.business}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleWishlist}
                />
              )}

            {/* 3. Chromebook Laptops Section */}
            {filteredProducts.some((p) =>
              (p.category?.name || p.category || "")
                .toLowerCase()
                .includes("chromebook")
            ) && (
                <LaptopSection
                  icon="💻"
                  title="Chromebook Laptops"
                  items={filteredProducts.filter((p) =>
                    (p.category?.name || p.category || "")
                      .toLowerCase()
                      .includes("chromebook")
                  )}
                  theme={THEMES.chromebook}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleWishlist}
                />
              )}

            {/* 4. Other Products Section */}
            {filteredProducts.some(
              (p) =>
                !["gaming", "business", "chromebook"].some((key) =>
                  (p.category?.name || p.category || "")
                    .toLowerCase()
                    .includes(key)
                )
            ) && (
                <LaptopSection
                  icon="📦"
                  title="Other Laptops & Products"
                  items={filteredProducts.filter(
                    (p) =>
                      !["gaming", "business", "chromebook"].some((key) =>
                        (p.category?.name || p.category || "")
                          .toLowerCase()
                          .includes(key)
                      )
                  )}
                  theme={THEMES.other}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleWishlist}
                />
              )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;