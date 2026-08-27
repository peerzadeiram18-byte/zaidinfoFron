// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// // =====================================================
// // SHARED LAYOUT
// // =====================================================

// // import Topbar from "../../components/TopBar/TopBar";
// // import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";

// // =====================================================
// // PAGE COMPONENT
// // =====================================================

// import LaptopSection from "./LaptopSection/LaptopSection";

// // =====================================================
// // SERVICES
// // =====================================================

// import { getShopProducts } from "../../services/productService";
// import { getActiveOffers } from "../../services/offerService";
// import { addToCart } from "../../services/cartService";
// import { addToWishlist } from "../../services/wishlistService";

// // =====================================================
// // THEMES
// // =====================================================

// const THEMES = {
//   gaming: {
//     badgeBg: "from-purple-600 to-indigo-600",
//     badgeShadow: "shadow-purple-500/20",
//     pillBg:
//       "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60",
//   },

//   business: {
//     badgeBg: "from-blue-600 to-indigo-600",
//     badgeShadow: "shadow-blue-500/20",
//     pillBg:
//       "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
//   },

//   chromebook: {
//     badgeBg: "from-amber-500 to-orange-600",
//     badgeShadow: "shadow-amber-500/20",
//     pillBg:
//       "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60",
//   },

//   other: {
//     badgeBg: "from-teal-500 to-emerald-600",
//     badgeShadow: "shadow-teal-500/20",
//     pillBg:
//       "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
//   },
// };

// // =====================================================
// // HELPERS
// // =====================================================

// const getProductId = (product) => {
//   if (!product) return null;

//   if (typeof product === "string") {
//     return product;
//   }

//   return product._id || product.id || null;
// };

// // =====================================================
// // PRODUCT PRICE
// // =====================================================

// const getProductPrice = (product) => {
//   return Number(
//     product?.finalPrice ??
//       product?.pricing?.sellingPrice ??
//       product?.sellingPrice ??
//       product?.price ??
//       0
//   );
// };

// // =====================================================
// // OFFER ACTIVE CHECK
// // =====================================================

// const isOfferCurrentlyActive = (offer) => {
//   if (!offer) {
//     return false;
//   }

//   // -----------------------------------------------
//   // STATUS
//   // -----------------------------------------------

//   if (
//     offer.status &&
//     String(offer.status).toUpperCase() !== "ACTIVE"
//   ) {
//     return false;
//   }

//   const now = new Date();

//   // -----------------------------------------------
//   // START DATE
//   // -----------------------------------------------

//   if (offer.startDate) {
//     const start = new Date(offer.startDate);

//     if (now < start) {
//       return false;
//     }
//   }

//   // -----------------------------------------------
//   // END DATE
//   // -----------------------------------------------

//   if (offer.endDate) {
//     const end = new Date(offer.endDate);

//     // Complete end date ko active rakho
//     end.setHours(23, 59, 59, 999);

//     if (now > end) {
//       return false;
//     }
//   }

//   return true;
// };

// // =====================================================
// // CALCULATE OFFER PRICE
// // =====================================================

// const calculateOfferPrice = (product, offer) => {
//   const originalPrice = getProductPrice(product);

//   // No offer
//   if (!offer) {
//     return {
//       originalPrice,
//       finalPrice: originalPrice,
//       discountAmount: 0,
//       offer: null,
//     };
//   }

//   const discountValue = Number(
//     offer.discountValue ?? 0
//   );

//   // Invalid discount
//   if (discountValue <= 0) {
//     return {
//       originalPrice,
//       finalPrice: originalPrice,
//       discountAmount: 0,
//       offer: null,
//     };
//   }

//   let discountAmount = 0;

//   // -----------------------------------------------
//   // PERCENTAGE
//   // -----------------------------------------------

//   if (
//     String(offer.discountType).toUpperCase() ===
//     "PERCENTAGE"
//   ) {
//     discountAmount =
//       (originalPrice * discountValue) / 100;
//   }

//   // -----------------------------------------------
//   // FIXED
//   // -----------------------------------------------

//   else if (
//     String(offer.discountType).toUpperCase() ===
//     "FIXED"
//   ) {
//     discountAmount = discountValue;
//   }

//   // -----------------------------------------------
//   // PROTECT PRICE
//   // -----------------------------------------------

//   discountAmount = Math.min(
//     Math.max(discountAmount, 0),
//     originalPrice
//   );

//   const finalPrice =
//     originalPrice - discountAmount;

//   return {
//     originalPrice,
//     finalPrice,
//     discountAmount,
//     offer,
//   };
// };

// // =====================================================
// // SHOP
// // =====================================================

// const Shop = () => {
//   const navigate = useNavigate();

//   // ===================================================
//   // STATE
//   // ===================================================

//   const [products, setProducts] = useState([]);

//   const [filteredProducts, setFilteredProducts] =
//     useState([]);

//   const [offers, setOffers] = useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [search, setSearch] =
//     useState("");

//   const [category, setCategory] =
//     useState("");

//   const [brand, setBrand] =
//     useState("");

//   const [sort, setSort] =
//     useState("");

//   // ===================================================
//   // LOAD SHOP
//   // ===================================================

//   useEffect(() => {
//     loadProductsAndOffers();
//   }, []);

//   // ===================================================
//   // LOAD PRODUCTS + ACTIVE OFFERS
//   // ===================================================

//   const loadProductsAndOffers = async () => {
//     try {
//       setLoading(true);

//       // ------------------------------------------------
//       // IMPORTANT
//       //
//       // getShopProducts = public
//       // getActiveOffers = public
//       //
//       // Do NOT use getOffers() here.
//       // ------------------------------------------------

//       const [
//         productsResponse,
//         offersResponse,
//       ] = await Promise.all([
//         getShopProducts(),
//         getActiveOffers(),
//       ]);

//       // =================================================
//       // PRODUCTS RESPONSE
//       // =================================================

//       console.log(
//         "SHOP PRODUCTS RESPONSE:",
//         productsResponse?.data
//       );

//       const productList =
//         Array.isArray(
//           productsResponse?.data?.data
//         )
//           ? productsResponse.data.data
//           : Array.isArray(
//               productsResponse?.data?.products
//             )
//           ? productsResponse.data.products
//           : Array.isArray(
//               productsResponse?.data
//             )
//           ? productsResponse.data
//           : [];

//       // =================================================
//       // OFFERS RESPONSE
//       // =================================================

//       console.log(
//         "SHOP ACTIVE OFFERS RESPONSE:",
//         offersResponse?.data
//       );

//       const offerList =
//         Array.isArray(
//           offersResponse?.data?.offers
//         )
//           ? offersResponse.data.offers
//           : Array.isArray(
//               offersResponse?.data?.data
//             )
//           ? offersResponse.data.data
//           : Array.isArray(
//               offersResponse?.data
//             )
//           ? offersResponse.data
//           : [];

//       console.log(
//         "SHOP PRODUCT LIST:",
//         productList
//       );

//       console.log(
//         "SHOP OFFER LIST:",
//         offerList
//       );

//       // =================================================
//       // ACTIVE OFFERS
//       // =================================================

//       const activeOffers =
//         offerList.filter(
//           isOfferCurrentlyActive
//         );

//       console.log(
//         "ACTIVE SHOP OFFERS:",
//         activeOffers
//       );

//       // =================================================
//       // APPLY OFFERS
//       // =================================================

//       const productsWithOffers =
//         productList.map((product) => {
//           const productId =
//             getProductId(product);

//           // --------------------------------------------
//           // FIND OFFERS FOR CURRENT PRODUCT
//           // --------------------------------------------

//           const productOffers =
//             activeOffers.filter(
//               (offer) => {
//                 if (
//                   !Array.isArray(
//                     offer?.products
//                   )
//                 ) {
//                   return false;
//                 }

//                 return offer.products.some(
//                   (offerProduct) => {
//                     const offerProductId =
//                       getProductId(
//                         offerProduct
//                       );

//                     return (
//                       String(
//                         offerProductId
//                       ) ===
//                       String(productId)
//                     );
//                   }
//                 );
//               }
//             );

//           // --------------------------------------------
//           // NO OFFER
//           // --------------------------------------------

//           if (
//             productOffers.length === 0
//           ) {
//             const price =
//               getProductPrice(product);

//             return {
//               ...product,

//               originalPrice: price,

//               finalPrice: price,

//               discountAmount: 0,

//               offer: null,

//               hasOffer: false,

//               offerTitle: "",

//               offerDiscountType: null,

//               offerDiscountValue: 0,
//             };
//           }

//           // --------------------------------------------
//           // CALCULATE ALL OFFERS
//           // --------------------------------------------

//           const calculatedOffers =
//             productOffers
//               .map((offer) =>
//                 calculateOfferPrice(
//                   product,
//                   offer
//                 )
//               )
//               .filter(
//                 (item) =>
//                   item.offer !== null
//               );

//           // Safety
//           if (
//             calculatedOffers.length === 0
//           ) {
//             const price =
//               getProductPrice(product);

//             return {
//               ...product,

//               originalPrice: price,

//               finalPrice: price,

//               discountAmount: 0,

//               offer: null,

//               hasOffer: false,
//             };
//           }

//           // --------------------------------------------
//           // BEST OFFER
//           // Lowest final price
//           // --------------------------------------------

//           const bestOffer =
//             calculatedOffers.reduce(
//               (best, current) => {
//                 if (!best) {
//                   return current;
//                 }

//                 return current.finalPrice <
//                   best.finalPrice
//                   ? current
//                   : best;
//               },
//               null
//             );

//           // --------------------------------------------
//           // PRODUCT WITH OFFER
//           // --------------------------------------------

//           return {
//             ...product,

//             originalPrice:
//               bestOffer.originalPrice,

//             finalPrice:
//               bestOffer.finalPrice,

//             discountAmount:
//               bestOffer.discountAmount,

//             offer:
//               bestOffer.offer,

//             hasOffer: true,

//             offerTitle:
//               bestOffer.offer?.title ||
//               "Special Offer",

//             offerDiscountType:
//               bestOffer.offer
//                 ?.discountType,

//             offerDiscountValue:
//               bestOffer.offer
//                 ?.discountValue ?? 0,
//           };
//         });

//       // =================================================
//       // LOG FINAL DATA
//       // =================================================

//       console.log(
//         "PRODUCTS WITH OFFERS:",
//         productsWithOffers
//       );

//       // =================================================
//       // SET STATE
//       // =================================================

//       setOffers(activeOffers);

//       setProducts(
//         productsWithOffers
//       );

//       setFilteredProducts(
//         productsWithOffers
//       );
//     } catch (error) {
//       console.error(
//         "SHOP PRODUCTS/OFFERS ERROR:",
//         error
//       );

//       console.error(
//         "SHOP ERROR RESPONSE:",
//         error?.response?.data
//       );

//       // -----------------------------------------------
//       // IMPORTANT
//       // -----------------------------------------------
//       //
//       // Agar offers fail ho jayein,
//       // products phir bhi show hone chahiye.
//       //
//       // Isliye Promise.all ke wajah se
//       // entire shop blank nahi karenge.
//       //
//       // -----------------------------------------------

//       try {
//         const productsResponse =
//           await getShopProducts();

//         const productList =
//           Array.isArray(
//             productsResponse?.data?.data
//           )
//             ? productsResponse.data.data
//             : Array.isArray(
//                 productsResponse?.data?.products
//               )
//             ? productsResponse.data.products
//             : Array.isArray(
//                 productsResponse?.data
//               )
//             ? productsResponse.data
//             : [];

//         const productsWithoutOffers =
//           productList.map(
//             (product) => {
//               const price =
//                 getProductPrice(
//                   product
//                 );

//               return {
//                 ...product,

//                 originalPrice: price,

//                 finalPrice: price,

//                 discountAmount: 0,

//                 offer: null,

//                 hasOffer: false,
//               };
//             }
//           );

//         setProducts(
//           productsWithoutOffers
//         );

//         setFilteredProducts(
//           productsWithoutOffers
//         );

//         setOffers([]);

//         console.log(
//           "SHOP LOADED WITHOUT OFFERS:",
//           productsWithoutOffers
//         );
//       } catch (productError) {
//         console.error(
//           "SHOP PRODUCTS ERROR:",
//           productError
//         );

//         toast.error(
//           productError?.response
//             ?.data?.message ||
//             "Failed to load products"
//         );

//         setProducts([]);

//         setFilteredProducts([]);

//         setOffers([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===================================================
//   // CATEGORY LIST
//   // ===================================================

//   const categoriesList =
//     Array.from(
//       new Set(
//         products
//           .map((product) =>
//             typeof product.category ===
//             "object"
//               ? product.category?.name
//               : product.category
//           )
//           .filter(Boolean)
//       )
//     );

//   // ===================================================
//   // BRAND LIST
//   // ===================================================

//   const brandsList =
//     Array.from(
//       new Set(
//         products
//           .map((product) =>
//             typeof product.brand ===
//             "object"
//               ? product.brand?.name
//               : product.brand
//           )
//           .filter(Boolean)
//       )
//     );

//   // ===================================================
//   // FILTER + SORT
//   // ===================================================

//   useEffect(() => {
//     let data = Array.isArray(
//       products
//     )
//       ? [...products]
//       : [];

//     // -------------------------------------------------
//     // SEARCH
//     // -------------------------------------------------

//     if (search) {
//       data = data.filter(
//         (product) =>
//           product.name
//             ?.toLowerCase()
//             .includes(
//               search.toLowerCase()
//             )
//       );
//     }

//     // -------------------------------------------------
//     // CATEGORY
//     // -------------------------------------------------

//     if (category) {
//       data = data.filter(
//         (product) =>
//           (
//             product.category?.name ||
//             product.category
//           ) === category
//       );
//     }

//     // -------------------------------------------------
//     // BRAND
//     // -------------------------------------------------

//     if (brand) {
//       data = data.filter(
//         (product) =>
//           (
//             product.brand?.name ||
//             product.brand
//           ) === brand
//       );
//     }

//     // -------------------------------------------------
//     // LOW TO HIGH
//     // -------------------------------------------------

//     if (sort === "low") {
//       data.sort(
//         (a, b) =>
//           Number(
//             a.finalPrice ??
//               getProductPrice(a)
//           ) -
//           Number(
//             b.finalPrice ??
//               getProductPrice(b)
//           )
//       );
//     }

//     // -------------------------------------------------
//     // HIGH TO LOW
//     // -------------------------------------------------

//     if (sort === "high") {
//       data.sort(
//         (a, b) =>
//           Number(
//             b.finalPrice ??
//               getProductPrice(b)
//           ) -
//           Number(
//             a.finalPrice ??
//               getProductPrice(a)
//           )
//       );
//     }

//     setFilteredProducts(data);
//   }, [
//     search,
//     category,
//     brand,
//     sort,
//     products,
//   ]);

//   // ===================================================
//   // ADD TO CART
//   // ===================================================

//   const handleAddToCart =
//     async (product) => {
//       const token =
//         localStorage.getItem(
//           "token"
//         );

//       if (!token) {
//         toast.error(
//           "Please Login First"
//         );

//         navigate("/login");

//         return;
//       }

//       try {
//         await addToCart({
//           product:
//             product._id,

//           quantity: 1,
//         });

//         toast.success(
//           "Added To Cart"
//         );

//         navigate("/cart");
//       } catch (error) {
//         toast.error(
//           error?.response?.data
//             ?.message ||
//             "Failed to add to cart"
//         );
//       }
//     };

//   // ===================================================
//   // WISHLIST
//   // ===================================================

//   // const handleWishlist =
//   //   async (product) => {
//   //     const token =
//   //       localStorage.getItem(
//   //         "token"
//   //       );

//   //     if (!token) {
//   //       toast.error(
//   //         "Please Login First"
//   //       );

//   //       navigate("/login");

//   //       return;
//   //     }

//   //     try {
//   //       await addToWishlist(
//   //         product._id
//   //       );

//   //       toast.success(
//   //         "Added To Wishlist"
//   //       );
//   //     } catch (error) {
//   //       toast.error(
//   //         error?.response?.data
//   //           ?.message ||
//   //           "Failed to update wishlist"
//   //       );
//   //     }
//   //   };


// const handleWishlist = async (product) => {

//   const token =
//     localStorage.getItem("token");

//   // ===============================================
//   // LOGIN CHECK
//   // ===============================================

//   if (!token) {

//     toast.error(
//       "Please Login First"
//     );

//     navigate("/login");

//     return;
//   }

//   // ===============================================
//   // PRODUCT ID
//   // ===============================================

//   const productId =
//     product?._id ||
//     product?.id;

//   if (!productId) {

//     console.error(
//       "Wishlist Product ID Missing:",
//       product
//     );

//     toast.error(
//       "Product ID not found"
//     );

//     return;
//   }

//   try {

//     console.log(
//       "Adding Wishlist Product:",
//       productId
//     );

//     // =============================================
//     // ADD WISHLIST
//     // =============================================

//     const response =
//       await addToWishlist(
//         productId
//       );

//     console.log(
//       "ADD WISHLIST RESPONSE:",
//       response?.data
//     );

//     // =============================================
//     // SUCCESS
//     // =============================================

//     toast.success(
//       "Added To Wishlist"
//     );

//   } catch (error) {

//     console.error(
//       "ADD WISHLIST ERROR:",
//       error
//     );

//     console.error(
//       "ADD WISHLIST ERROR RESPONSE:",
//       error?.response?.data
//     );

//     const message =
//       error?.response?.data?.message ||
//       error?.response?.data?.error ||
//       "Failed to update wishlist";

//     // ---------------------------------------------
//     // If already exists
//     // ---------------------------------------------

//     if (
//       String(message)
//         .toLowerCase()
//         .includes("already")
//     ) {

//       toast.info(
//         "Product is already in Wishlist"
//       );

//       return;
//     }

//     toast.error(message);
//   }
// };

//   // ===================================================
//   // RENDER
//   // ===================================================

//   return (
//     <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">

//       {/* <Topbar />

//       <Header /> */}

//       <main className="flex-grow py-8 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto w-full space-y-8">

//         {/* =================================================
//             TITLE
//         ================================================= */}

//         <div className="overflow-hidden py-1">

//           <motion.h1
//             initial={{
//               fontWeight: 300,
//               scale: 0.92,
//               opacity: 0.6,
//             }}
//             whileInView={{
//               fontWeight: 900,
//               scale: 1,
//               opacity: 1,
//             }}
//             transition={{
//               duration: 1.2,
//               ease: [
//                 0.25,
//                 1,
//                 0.5,
//                 1,
//               ],
//             }}
//             viewport={{
//               once: false,
//               amount: 0.3,
//             }}
//             className="text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight origin-left transition-colors duration-300"
//           >
//             Laptops
//           </motion.h1>

//         </div>

//         {/* =================================================
//             OFFER INFO
//         ================================================= */}

//         {offers.length > 0 && (
//           <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">

//             <span className="text-xl">
//               🎁
//             </span>

//             <div>

//               <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
//                 Special Offers Available
//               </p>

//               <p className="text-xs text-indigo-600 dark:text-indigo-400">
//                 {offers.length} active offer
//                 {offers.length !== 1
//                   ? "s"
//                   : ""}{" "}
//                 available on selected
//                 products.
//               </p>

//             </div>

//           </div>
//         )}

//         {/* =================================================
//             ACTION BAR
//         ================================================= */}

//         <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gray-100/80 dark:border-slate-800">

//           {/* LEFT */}

//           <div className="flex items-center gap-3 flex-wrap">

//             {/* SEARCH */}

//             <div className="relative">

//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(
//                     e.target.value
//                   )
//                 }
//                 className="bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 pl-8 pr-4 py-1.5 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none border border-transparent focus:border-gray-300 dark:border-slate-800 dark:focus:border-slate-700 transition-all w-40 focus:w-52"
//               />

//               <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">

//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2.5}
//                   stroke="currentColor"
//                   className="w-3.5 h-3.5"
//                 >

//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//                   />

//                 </svg>

//               </div>

//             </div>

//             {/* FILTER LABEL */}

//             <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 ml-1">
//               Filters:
//             </span>

//             {/* CATEGORY */}

//             <div className="relative">

//               <select
//                 value={category}
//                 onChange={(e) =>
//                   setCategory(
//                     e.target.value
//                   )
//                 }
//                 className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
//               >

//                 <option value="">
//                   Category
//                 </option>

//                 {categoriesList.map(
//                   (cat) => (
//                     <option
//                       key={cat}
//                       value={cat}
//                     >
//                       {cat}
//                     </option>
//                   )
//                 )}

//               </select>

//               <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
//                 ▼
//               </div>

//             </div>

//             {/* BRAND */}

//             <div className="relative">

//               <select
//                 value={brand}
//                 onChange={(e) =>
//                   setBrand(
//                     e.target.value
//                   )
//                 }
//                 className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
//               >

//                 <option value="">
//                   Brand
//                 </option>

//                 {brandsList.map(
//                   (b) => (
//                     <option
//                       key={b}
//                       value={b}
//                     >
//                       {b}
//                     </option>
//                   )
//                 )}

//               </select>

//               <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
//                 ▼
//               </div>

//             </div>

//           </div>

//           {/* SORT */}

//           <div className="relative">

//             <select
//               value={sort}
//               onChange={(e) =>
//                 setSort(
//                   e.target.value
//                 )
//               }
//               className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pl-8 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
//             >

//               <option value="">
//                 Sort by: Recommended
//               </option>

//               <option value="low">
//                 Price: Low to High
//               </option>

//               <option value="high">
//                 Price: High to Low
//               </option>

//             </select>

//             <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-400">

//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="w-3.5 h-3.5"
//               >

//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h7.5"
//                 />

//               </svg>

//             </div>

//             <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
//               ▼
//             </div>

//           </div>

//         </div>

//         {/* =================================================
//             PRODUCTS
//         ================================================= */}

//         {loading ? (

//           <div className="flex flex-col justify-center items-center py-28">

//             <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 dark:border-slate-100 border-t-transparent" />

//             <span className="mt-3 text-gray-500 dark:text-slate-400 font-medium text-xs">
//               Loading laptops...
//             </span>

//           </div>

//         ) : filteredProducts.length === 0 ? (

//           <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 rounded-3xl space-y-2">

//             <div className="text-2xl">
//               🔍
//             </div>

//             <p className="text-gray-900 dark:text-white font-bold text-base">
//               No Products Found
//             </p>

//             <p className="text-gray-400 dark:text-slate-400 text-xs">
//               Try adjusting your search or filters.
//             </p>

//           </div>

//         ) : (

//           <div className="space-y-10">

//             {/* =================================================
//                 GAMING
//             ================================================= */}

//             {filteredProducts.some(
//               (p) =>
//                 (
//                   p.category?.name ||
//                   p.category ||
//                   ""
//                 )
//                   .toLowerCase()
//                   .includes("gaming")
//             ) && (

//               <LaptopSection
//                 icon="🎮"
//                 title="Gaming Laptops"
//                 items={filteredProducts.filter(
//                   (p) =>
//                     (
//                       p.category?.name ||
//                       p.category ||
//                       ""
//                     )
//                       .toLowerCase()
//                       .includes("gaming")
//                 )}
//                 theme={THEMES.gaming}
//                 onAddToCart={
//                   handleAddToCart
//                 }
//                 onAddToWishlist={
//                   handleWishlist
//                 }
//               />

//             )}

//             {/* =================================================
//                 BUSINESS
//             ================================================= */}

//             {filteredProducts.some(
//               (p) =>
//                 (
//                   p.category?.name ||
//                   p.category ||
//                   ""
//                 )
//                   .toLowerCase()
//                   .includes("business")
//             ) && (

//               <LaptopSection
//                 icon="💼"
//                 title="Business Laptops"
//                 items={filteredProducts.filter(
//                   (p) =>
//                     (
//                       p.category?.name ||
//                       p.category ||
//                       ""
//                     )
//                       .toLowerCase()
//                       .includes("business")
//                 )}
//                 theme={THEMES.business}
//                 onAddToCart={
//                   handleAddToCart
//                 }
//                 onAddToWishlist={
//                   handleWishlist
//                 }
//               />

//             )}

//             {/* =================================================
//                 CHROMEBOOK
//             ================================================= */}

//             {filteredProducts.some(
//               (p) =>
//                 (
//                   p.category?.name ||
//                   p.category ||
//                   ""
//                 )
//                   .toLowerCase()
//                   .includes("chromebook")
//             ) && (

//               <LaptopSection
//                 icon="💻"
//                 title="Chromebook Laptops"
//                 items={filteredProducts.filter(
//                   (p) =>
//                     (
//                       p.category?.name ||
//                       p.category ||
//                       ""
//                     )
//                       .toLowerCase()
//                       .includes("chromebook")
//                 )}
//                 theme={THEMES.chromebook}
//                 onAddToCart={
//                   handleAddToCart
//                 }
//                 onAddToWishlist={
//                   handleWishlist
//                 }
//               />

//             )}

//             {/* =================================================
//                 OTHER
//             ================================================= */}

//             {filteredProducts.some(
//               (p) =>
//                 ![
//                   "gaming",
//                   "business",
//                   "chromebook",
//                 ].some((key) =>
//                   (
//                     p.category?.name ||
//                     p.category ||
//                     ""
//                   )
//                     .toLowerCase()
//                     .includes(key)
//                 )
//             ) && (

//               <LaptopSection
//                 icon="📦"
//                 title="Other Laptops & Products"
//                 items={filteredProducts.filter(
//                   (p) =>
//                     ![
//                       "gaming",
//                       "business",
//                       "chromebook",
//                     ].some((key) =>
//                       (
//                         p.category?.name ||
//                         p.category ||
//                         ""
//                       )
//                         .toLowerCase()
//                         .includes(key)
//                     )
//                 )}
//                 theme={THEMES.other}
//                 onAddToCart={
//                   handleAddToCart
//                 }
//                 onAddToWishlist={
//                   handleWishlist
//                 }
//               />

//             )}

//           </div>

//         )}

//       </main>

//       <Footer />

//     </div>
//   );
// };

// export default Shop;

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Footer from "../../components/Footer/Footer";
import LaptopSection from "./LaptopSection/LaptopSection";

import { getShopProducts } from "../../services/productService";
import { getActiveOffers } from "../../services/offerService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";

// =====================================================
// THEMES
// =====================================================

const THEMES = {
  gaming: {
    badgeBg: "from-purple-600 to-indigo-600",
    badgeShadow: "shadow-purple-500/20",
    pillBg:
      "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60",
  },

  business: {
    badgeBg: "from-blue-600 to-indigo-600",
    badgeShadow: "shadow-blue-500/20",
    pillBg:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
  },

  chromebook: {
    badgeBg: "from-amber-500 to-orange-600",
    badgeShadow: "shadow-amber-500/20",
    pillBg:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60",
  },

  refurbished: {
    badgeBg: "from-emerald-600 to-teal-600",
    badgeShadow: "shadow-emerald-500/20",
    pillBg:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
  },

  other: {
    badgeBg: "from-teal-500 to-emerald-600",
    badgeShadow: "shadow-teal-500/20",
    pillBg:
      "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
  },
};

// =====================================================
// GET PRODUCT ID
// =====================================================

const getProductId = (product) => {
  if (!product) {
    return null;
  }

  if (typeof product === "string") {
    return product;
  }

  return (
    product._id ||
    product.id ||
    product.productId ||
    null
  );
};

// =====================================================
// GET PRODUCT PRICE
// =====================================================

const getProductPrice = (product) => {
  return Number(
    product?.finalPrice ??
      product?.pricing?.sellingPrice ??
      product?.sellingPrice ??
      product?.price ??
      0
  );
};

// =====================================================
// GENERIC OBJECT NAME
// =====================================================

const getObjectName = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return String(
      value.name ??
        value.title ??
        value.label ??
        value.categoryName ??
        value.subcategoryName ??
        value.subCategoryName ??
        ""
    ).trim();
  }

  return String(value).trim();
};

// =====================================================
// CATEGORY
// =====================================================

const getCategoryName = (product) => {
  if (!product) {
    return "";
  }

  return getObjectName(
    product.category ??
      product.categoryId ??
      product.categoryData
  );
};

// =====================================================
// SUBCATEGORY
// =====================================================

const getSubcategoryName = (product) => {
  if (!product) {
    return "";
  }

  const possibleValues = [
    product.subcategory,
    product.subCategory,
    product.subcategoryId,
    product.subCategoryId,
    product.subcategoryData,
    product.subCategoryData,
  ];

  for (const value of possibleValues) {
    const name = getObjectName(value);

    if (name) {
      return name;
    }
  }

  return "";
};

// =====================================================
// BRAND
// =====================================================

const getBrandName = (product) => {
  if (!product) {
    return "";
  }

  return getObjectName(
    product.brand ??
      product.brandId ??
      product.brandData
  );
};

// =====================================================
// PRODUCT CONDITION
//
// IMPORTANT:
// productType is now the MAIN SOURCE.
//
// NEW          -> New
// REFURBISHED  -> Refurbished
//
// Old fallback fields are checked ONLY when
// productType is missing.
// =====================================================

const isProductRefurbished = (product) => {
  if (!product) {
    return false;
  }

  // =================================================
  // 1. PRODUCT TYPE - AUTHORITATIVE
  // =================================================

  const rawProductType =
    product.productType;

  if (
    rawProductType !== undefined &&
    rawProductType !== null &&
    String(rawProductType).trim() !== ""
  ) {
    const productType = String(
      rawProductType
    )
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

    // -----------------------------------------------
    // NEW IS ALWAYS NEW
    // -----------------------------------------------

    if (
      productType === "NEW" ||
      productType === "NEW_PRODUCT"
    ) {
      return false;
    }

    // -----------------------------------------------
    // REFURBISHED IS ALWAYS REFURBISHED
    // -----------------------------------------------

    if (
      productType === "REFURBISHED" ||
      productType === "REFURB" ||
      productType === "RENEWED" ||
      productType === "RECONDITIONED" ||
      productType === "REFURBISHED_PRODUCT"
    ) {
      return true;
    }

    // -----------------------------------------------
    // If productType exists but is unknown,
    // DO NOT guess from refurbishedDetails.
    // -----------------------------------------------

    return false;
  }

  // =================================================
  // 2. OLD DATA FALLBACK
  //
  // Only used when productType does not exist.
  // =================================================

  if (product.isRefurbished === true) {
    return true;
  }

  if (product.refurbished === true) {
    return true;
  }

  // =================================================
  // 3. STRING BOOLEAN
  // =================================================

  const isRefurbishedValue = String(
    product.isRefurbished ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    [
      "true",
      "yes",
      "1",
      "refurbished",
      "refurb",
    ].includes(isRefurbishedValue)
  ) {
    return true;
  }

  const refurbishedValue = String(
    product.refurbished ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    [
      "true",
      "yes",
      "1",
      "refurbished",
      "refurb",
    ].includes(refurbishedValue)
  ) {
    return true;
  }

  // =================================================
  // 4. OLD CONDITION FIELD
  // =================================================

  const conditionValue = String(
    product.condition ??
      product.productCondition ??
      product.type ??
      ""
  )
    .trim()
    .toLowerCase();

  if (
    conditionValue === "refurbished" ||
    conditionValue === "refurb" ||
    conditionValue === "renewed" ||
    conditionValue === "reconditioned"
  ) {
    return true;
  }

  // =================================================
  // 5. OLD REFURBISHED DETAILS
  //
  // Only for products without productType.
  // =================================================

  if (
    product.refurbishedDetails &&
    typeof product.refurbishedDetails ===
      "object"
  ) {
    const details =
      product.refurbishedDetails;

    const hasRealRefurbishedValue =
      Boolean(
        details.grade ||
          details.batteryHealth !==
            undefined ||
          details.warrantyMonths !==
            undefined ||
          details.testingStatus
      );

    if (hasRealRefurbishedValue) {
      return true;
    }
  }

  return false;
};

// =====================================================
// PRODUCT CONDITION TEXT
// =====================================================

const getProductCondition = (product) => {
  return isProductRefurbished(product)
    ? "Refurbished"
    : "New";
};

// =====================================================
// ACTIVE OFFER CHECK
// =====================================================

const isOfferCurrentlyActive = (offer) => {
  if (!offer) {
    return false;
  }

  if (
    offer.status &&
    String(offer.status).toUpperCase() !==
      "ACTIVE"
  ) {
    return false;
  }

  const now = new Date();

  if (offer.startDate) {
    const start = new Date(
      offer.startDate
    );

    if (now < start) {
      return false;
    }
  }

  if (offer.endDate) {
    const end = new Date(
      offer.endDate
    );

    end.setHours(
      23,
      59,
      59,
      999
    );

    if (now > end) {
      return false;
    }
  }

  return true;
};

// =====================================================
// CALCULATE OFFER PRICE
// =====================================================

const calculateOfferPrice = (
  product,
  offer
) => {
  const originalPrice =
    getProductPrice(product);

  if (!offer) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discountAmount: 0,
      offer: null,
    };
  }

  const discountValue = Number(
    offer.discountValue ?? 0
  );

  if (discountValue <= 0) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discountAmount: 0,
      offer: null,
    };
  }

  let discountAmount = 0;

  const discountType = String(
    offer.discountType ?? ""
  ).toUpperCase();

  if (discountType === "PERCENTAGE") {
    discountAmount =
      (originalPrice *
        discountValue) /
      100;
  }

  if (discountType === "FIXED") {
    discountAmount = discountValue;
  }

  discountAmount = Math.min(
    Math.max(discountAmount, 0),
    originalPrice
  );

  const finalPrice =
    originalPrice -
    discountAmount;

  return {
    originalPrice,
    finalPrice,
    discountAmount,
    offer,
  };
};

// =====================================================
// EXTRACT PRODUCTS
// =====================================================

const extractProducts = (response) => {
  if (!response) {
    return [];
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data.data;
  }

  if (
    Array.isArray(
      response?.data?.products
    )
  ) {
    return response.data.products;
  }

  if (
    Array.isArray(
      response?.data?.items
    )
  ) {
    return response.data.items;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};

// =====================================================
// EXTRACT OFFERS
// =====================================================

const extractOffers = (response) => {
  if (!response) {
    return [];
  }

  if (
    Array.isArray(
      response?.data?.offers
    )
  ) {
    return response.data.offers;
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data.data;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};

// =====================================================
// REMOVE DUPLICATE PRODUCTS
// =====================================================

const removeDuplicateProducts = (
  productList
) => {
  if (!Array.isArray(productList)) {
    return [];
  }

  const seen = new Set();

  const uniqueProducts =
    productList.filter((product) => {
      const id =
        getProductId(product);

      // If no ID, keep product.
      if (!id) {
        return true;
      }

      const key = String(id);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });

  console.log(
    "PRODUCT DUPLICATE CHECK:",
    {
      originalCount:
        productList.length,

      uniqueCount:
        uniqueProducts.length,

      removed:
        productList.length -
        uniqueProducts.length,
    }
  );

  return uniqueProducts;
};

// =====================================================
// SHOP
// =====================================================

const Shop = () => {
  const navigate = useNavigate();

  // ===================================================
  // STATES
  // ===================================================

  const [products, setProducts] =
    useState([]);

  const [
    filteredProducts,
    setFilteredProducts,
  ] = useState([]);

  const [offers, setOffers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [subcategory, setSubcategory] =
    useState("");

  const [condition, setCondition] =
    useState("");

  const [sort, setSort] =
    useState("");

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    loadProductsAndOffers();
  }, []);

  // ===================================================
  // LOAD PRODUCTS + OFFERS
  // ===================================================

  const loadProductsAndOffers =
    async () => {
      try {
        setLoading(true);

        const [
          productsResponse,
          offersResponse,
        ] = await Promise.all([
          getShopProducts(),
          getActiveOffers(),
        ]);

        console.log(
          "SHOP PRODUCTS RESPONSE:",
          productsResponse?.data
        );

        // ---------------------------------------------
        // RAW PRODUCTS
        // ---------------------------------------------

        const rawProductList =
          extractProducts(
            productsResponse
          );

        console.log(
          "RAW SHOP PRODUCT LIST:",
          rawProductList
        );

        // ---------------------------------------------
        // REMOVE REAL DUPLICATES ONLY
        // ---------------------------------------------

        const productList =
          removeDuplicateProducts(
            rawProductList
          );

        console.log(
          "UNIQUE SHOP PRODUCT LIST:",
          productList
        );

        // ---------------------------------------------
        // DEBUG CONDITION
        // ---------------------------------------------

        productList.forEach(
          (product, index) => {
            console.log(
              `PRODUCT ${index + 1}:`,
              {
                id:
                  getProductId(
                    product
                  ),

                name:
                  product?.name,

                productType:
                  product?.productType,

                condition:
                  product?.condition,

                isRefurbished:
                  product?.isRefurbished,

                refurbished:
                  product?.refurbished,

                refurbishedDetails:
                  product?.refurbishedDetails,

                detectedCondition:
                  getProductCondition(
                    product
                  ),
              }
            );
          }
        );

        // ---------------------------------------------
        // OFFERS
        // ---------------------------------------------

        const offerList =
          extractOffers(
            offersResponse
          );

        const activeOffers =
          offerList.filter(
            isOfferCurrentlyActive
          );

        // ---------------------------------------------
        // APPLY OFFERS
        // ---------------------------------------------

        const productsWithOffers =
          productList.map(
            (product) => {
              const productId =
                getProductId(
                  product
                );

              const productOffers =
                activeOffers.filter(
                  (offer) => {
                    if (
                      !Array.isArray(
                        offer?.products
                      )
                    ) {
                      return false;
                    }

                    return offer.products.some(
                      (
                        offerProduct
                      ) => {
                        const offerProductId =
                          getProductId(
                            offerProduct
                          );

                        return (
                          String(
                            offerProductId
                          ) ===
                          String(
                            productId
                          )
                        );
                      }
                    );
                  }
                );

              // ---------------------------------------
              // NO OFFER
              // ---------------------------------------

              if (
                productOffers.length ===
                0
              ) {
                const price =
                  getProductPrice(
                    product
                  );

                return {
                  ...product,

                  originalPrice:
                    price,

                  finalPrice:
                    price,

                  discountAmount: 0,

                  offer: null,

                  hasOffer: false,

                  offerTitle: "",

                  offerDiscountType:
                    null,

                  offerDiscountValue: 0,
                };
              }

              // ---------------------------------------
              // CALCULATE OFFERS
              // ---------------------------------------

              const calculatedOffers =
                productOffers
                  .map((offer) =>
                    calculateOfferPrice(
                      product,
                      offer
                    )
                  )
                  .filter(
                    (item) =>
                      item.offer !==
                      null
                  );

              if (
                calculatedOffers.length ===
                0
              ) {
                const price =
                  getProductPrice(
                    product
                  );

                return {
                  ...product,

                  originalPrice:
                    price,

                  finalPrice:
                    price,

                  discountAmount: 0,

                  offer: null,

                  hasOffer: false,

                  offerTitle: "",

                  offerDiscountType:
                    null,

                  offerDiscountValue: 0,
                };
              }

              // ---------------------------------------
              // BEST OFFER
              // ---------------------------------------

              const bestOffer =
                calculatedOffers.reduce(
                  (
                    best,
                    current
                  ) => {
                    if (!best) {
                      return current;
                    }

                    return current.finalPrice <
                      best.finalPrice
                      ? current
                      : best;
                  },
                  null
                );

              return {
                ...product,

                originalPrice:
                  bestOffer.originalPrice,

                finalPrice:
                  bestOffer.finalPrice,

                discountAmount:
                  bestOffer.discountAmount,

                offer:
                  bestOffer.offer,

                hasOffer: true,

                offerTitle:
                  bestOffer.offer
                    ?.title ||
                  "Special Offer",

                offerDiscountType:
                  bestOffer.offer
                    ?.discountType,

                offerDiscountValue:
                  bestOffer.offer
                    ?.discountValue ??
                  0,
              };
            }
          );

        setProducts(
          productsWithOffers
        );

        setFilteredProducts(
          productsWithOffers
        );

        setOffers(
          activeOffers
        );
      } catch (error) {
        console.error(
          "SHOP PRODUCTS/OFFERS ERROR:",
          error
        );

        console.error(
          "SHOP ERROR RESPONSE:",
          error?.response?.data
        );

        // ---------------------------------------------
        // FALLBACK PRODUCTS
        // ---------------------------------------------

        try {
          const productsResponse =
            await getShopProducts();

          const rawProductList =
            extractProducts(
              productsResponse
            );

          const productList =
            removeDuplicateProducts(
              rawProductList
            );

          const productsWithoutOffers =
            productList.map(
              (product) => {
                const price =
                  getProductPrice(
                    product
                  );

                return {
                  ...product,

                  originalPrice:
                    price,

                  finalPrice:
                    price,

                  discountAmount: 0,

                  offer: null,

                  hasOffer: false,

                  offerTitle: "",

                  offerDiscountType:
                    null,

                  offerDiscountValue: 0,
                };
              }
            );

          setProducts(
            productsWithoutOffers
          );

          setFilteredProducts(
            productsWithoutOffers
          );

          setOffers([]);
        } catch (productError) {
          console.error(
            "SHOP PRODUCTS ERROR:",
            productError
          );

          toast.error(
            productError
              ?.response?.data
              ?.message ||
              "Failed to load products"
          );

          setProducts([]);

          setFilteredProducts([]);

          setOffers([]);
        }
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categoriesList =
    useMemo(() => {
      return Array.from(
        new Set(
          products
            .map(
              getCategoryName
            )
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(b)
      );
    }, [products]);

  // ===================================================
  // SUBCATEGORIES
  // ===================================================

  const subcategoriesList =
    useMemo(() => {
      let source = products;

      if (category) {
        source = source.filter(
          (product) =>
            getCategoryName(
              product
            ) === category
        );
      }

      return Array.from(
        new Set(
          source
            .map(
              getSubcategoryName
            )
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(b)
      );
    }, [products, category]);

  // ===================================================
  // BRANDS
  // ===================================================

  const brandsList =
    useMemo(() => {
      return Array.from(
        new Set(
          products
            .map(getBrandName)
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(b)
      );
    }, [products]);

  // ===================================================
  // FILTER PRODUCTS
  // ===================================================

  useEffect(() => {
    let data = Array.isArray(
      products
    )
      ? [...products]
      : [];

    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      data = data.filter(
        (product) => {
          const productName =
            String(
              product?.name || ""
            ).toLowerCase();

          const categoryName =
            getCategoryName(
              product
            ).toLowerCase();

          const subcategoryName =
            getSubcategoryName(
              product
            ).toLowerCase();

          const brandName =
            getBrandName(
              product
            ).toLowerCase();

          const conditionName =
            getProductCondition(
              product
            ).toLowerCase();

          return (
            productName.includes(
              searchValue
            ) ||
            categoryName.includes(
              searchValue
            ) ||
            subcategoryName.includes(
              searchValue
            ) ||
            brandName.includes(
              searchValue
            ) ||
            conditionName.includes(
              searchValue
            )
          );
        }
      );
    }

    // =================================================
    // CATEGORY
    // =================================================

    if (category) {
      data = data.filter(
        (product) =>
          getCategoryName(
            product
          ) === category
      );
    }

    // =================================================
    // SUBCATEGORY
    // =================================================

    if (subcategory) {
      data = data.filter(
        (product) =>
          getSubcategoryName(
            product
          ) === subcategory
      );
    }

    // =================================================
    // BRAND
    // =================================================

    if (brand) {
      data = data.filter(
        (product) =>
          getBrandName(
            product
          ) === brand
      );
    }

    // =================================================
    // CONDITION - NEW
    // =================================================

    if (condition === "new") {
      data = data.filter(
        (product) =>
          !isProductRefurbished(
            product
          )
      );
    }

    // =================================================
    // CONDITION - REFURBISHED
    // =================================================

    if (
      condition ===
      "refurbished"
    ) {
      data = data.filter(
        (product) =>
          isProductRefurbished(
            product
          )
      );
    }

    // =================================================
    // SORT LOW -> HIGH
    // =================================================

    if (sort === "low") {
      data.sort(
        (a, b) =>
          Number(
            a.finalPrice ??
              getProductPrice(a)
          ) -
          Number(
            b.finalPrice ??
              getProductPrice(b)
          )
      );
    }

    // =================================================
    // SORT HIGH -> LOW
    // =================================================

    if (sort === "high") {
      data.sort(
        (a, b) =>
          Number(
            b.finalPrice ??
              getProductPrice(b)
          ) -
          Number(
            a.finalPrice ??
              getProductPrice(a)
          )
      );
    }

    setFilteredProducts(
      data
    );
  }, [
    products,
    search,
    category,
    subcategory,
    brand,
    condition,
    sort,
  ]);

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setBrand("");
    setCondition("");
    setSort("");
  };

  const hasActiveFilters =
    Boolean(
      search ||
        category ||
        subcategory ||
        brand ||
        condition ||
        sort
    );

  // ===================================================
  // CART
  // ===================================================

  const handleAddToCart =
    async (product) => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        toast.error(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      const productId =
        getProductId(product);

      if (!productId) {
        toast.error(
          "Product ID not found"
        );

        return;
      }

      try {
        await addToCart({
          product: productId,
          quantity: 1,
        });

        toast.success(
          "Added To Cart"
        );

        navigate("/cart");
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add to cart"
        );
      }
    };

  // ===================================================
  // WISHLIST
  // ===================================================

  const handleWishlist =
    async (product) => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        toast.error(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      const productId =
        getProductId(product);

      if (!productId) {
        toast.error(
          "Product ID not found"
        );

        return;
      }

      try {
        await addToWishlist(
          productId
        );

        toast.success(
          "Added To Wishlist"
        );
      } catch (error) {
        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to update wishlist";

        if (
          String(message)
            .toLowerCase()
            .includes("already")
        ) {
          toast.info(
            "Product is already in Wishlist"
          );

          return;
        }

        toast.error(message);
      }
    };

  // ===================================================
  // SECTION DATA
  //
  // IMPORTANT:
  // Refurbished products are EXCLUDED from all normal
  // sections.
  // ===================================================

  const gamingProducts =
    filteredProducts.filter(
      (product) =>
        !isProductRefurbished(
          product
        ) &&
        getCategoryName(product)
          .toLowerCase()
          .includes("gaming")
    );

  const businessProducts =
    filteredProducts.filter(
      (product) =>
        !isProductRefurbished(
          product
        ) &&
        getCategoryName(product)
          .toLowerCase()
          .includes("business")
    );

  const chromebookProducts =
    filteredProducts.filter(
      (product) =>
        !isProductRefurbished(
          product
        ) &&
        getCategoryName(product)
          .toLowerCase()
          .includes("chromebook")
    );

  // ===================================================
  // REFURBISHED
  // ===================================================

  const refurbishedProducts =
    filteredProducts.filter(
      (product) =>
        isProductRefurbished(
          product
        )
    );

  // ===================================================
  // OTHER
  //
  // IMPORTANT:
  // Refurbished products are NOT included here.
  // ===================================================

  const specialCategoryProducts =
    filteredProducts.filter(
      (product) => {
        // ---------------------------------------------
        // NEVER put refurbished in Other
        // ---------------------------------------------

        if (
          isProductRefurbished(
            product
          )
        ) {
          return false;
        }

        const categoryName =
          getCategoryName(
            product
          ).toLowerCase();

        return ![
          "gaming",
          "business",
          "chromebook",
        ].some((key) =>
          categoryName.includes(
            key
          )
        );
      }
    );

  // ===================================================
  // DEBUG SECTION COUNTS
  // ===================================================

  useEffect(() => {
    if (!loading) {
      console.log(
        "SHOP SECTION COUNTS:",
        {
          total:
            filteredProducts.length,

          newProducts:
            filteredProducts.filter(
              (product) =>
                !isProductRefurbished(
                  product
                )
            ).length,

          refurbished:
            refurbishedProducts.length,

          gaming:
            gamingProducts.length,

          business:
            businessProducts.length,

          chromebook:
            chromebookProducts.length,

          other:
            specialCategoryProducts.length,
        }
      );
    }
  }, [
    loading,
    filteredProducts,
    refurbishedProducts.length,
    gamingProducts.length,
    businessProducts.length,
    chromebookProducts.length,
    specialCategoryProducts.length,
  ]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">

      <main className="flex-grow py-8 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto w-full space-y-8">

        {/* =================================================
            TITLE
        ================================================= */}

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
              ease: [
                0.25,
                1,
                0.5,
                1,
              ],
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            className="text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight origin-left transition-colors duration-300"
          >
            Laptops
          </motion.h1>
        </div>

        {/* =================================================
            OFFERS
        ================================================= */}

        {offers.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <span className="text-xl">
              🎁
            </span>

            <div>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                Special Offers Available
              </p>

              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                {offers.length} active
                offer
                {offers.length !==
                1
                  ? "s"
                  : ""}{" "}
                available on selected
                products.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gray-100/80 dark:border-slate-800">

          <div className="flex items-center gap-3 flex-wrap">

            {/* SEARCH */}

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
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

            <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 ml-1">
              Filters:
            </span>

            {/* CATEGORY */}

            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(
                    e.target.value
                  );

                  setSubcategory("");
                }}
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="">
                  Category
                </option>

                {categoriesList.map(
                  (cat) => (
                    <option
                      key={cat}
                      value={cat}
                    >
                      {cat}
                    </option>
                  )
                )}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* SUBCATEGORY */}

            <div className="relative">
              <select
                value={subcategory}
                onChange={(e) =>
                  setSubcategory(
                    e.target.value
                  )
                }
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="">
                  Subcategory
                </option>

                {subcategoriesList.map(
                  (subcat) => (
                    <option
                      key={subcat}
                      value={subcat}
                    >
                      {subcat}
                    </option>
                  )
                )}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* BRAND */}

            <div className="relative">
              <select
                value={brand}
                onChange={(e) =>
                  setBrand(
                    e.target.value
                  )
                }
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="">
                  Brand
                </option>

                {brandsList.map(
                  (b) => (
                    <option
                      key={b}
                      value={b}
                    >
                      {b}
                    </option>
                  )
                )}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* CONDITION */}

            <div className="relative">
              <select
                value={condition}
                onChange={(e) =>
                  setCondition(
                    e.target.value
                  )
                }
                className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="">
                  Condition
                </option>

                <option value="new">
                  New
                </option>

                <option value="refurbished">
                  Refurbished
                </option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* CLEAR */}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* SORT */}

          <div className="relative">
            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="appearance-none bg-[#e9ecef]/60 hover:bg-[#e2e6ea] dark:bg-slate-900 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-4 py-1.5 pl-8 pr-8 rounded-full text-xs font-semibold text-gray-800 dark:text-slate-200 cursor-pointer focus:outline-none transition-colors"
            >
              <option value="">
                Sort by: Recommended
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* =================================================
            RESULT INFO
        ================================================= */}

        {!loading && (
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Showing{" "}
              <span className="text-gray-900 dark:text-white">
                {
                  filteredProducts.length
                }
              </span>{" "}
              product
              {filteredProducts.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-28">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 dark:border-slate-100 border-t-transparent" />

            <span className="mt-3 text-gray-500 dark:text-slate-400 font-medium text-xs">
              Loading laptops...
            </span>
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 rounded-3xl space-y-2">
            <div className="text-2xl">
              🔍
            </div>

            <p className="text-gray-900 dark:text-white font-bold text-base">
              No Products Found
            </p>

            <p className="text-gray-400 dark:text-slate-400 text-xs">
              Try adjusting your
              search or filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-3 px-5 py-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-bold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">

            {/* =================================================
                REFURBISHED
            ================================================= */}

            {condition ===
              "refurbished" &&
              refurbishedProducts.length >
                0 && (
                <LaptopSection
                  icon="♻️"
                  title="Refurbished Laptops"
                  items={
                    refurbishedProducts
                  }
                  theme={
                    THEMES.refurbished
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
                />
              )}

            {/* =================================================
                GAMING
            ================================================= */}

            {condition !==
              "refurbished" &&
              gamingProducts.length >
                0 && (
                <LaptopSection
                  icon="🎮"
                  title="Gaming Laptops"
                  items={
                    gamingProducts
                  }
                  theme={
                    THEMES.gaming
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
                />
              )}

            {/* =================================================
                BUSINESS
            ================================================= */}

            {condition !==
              "refurbished" &&
              businessProducts.length >
                0 && (
                <LaptopSection
                  icon="💼"
                  title="Business Laptops"
                  items={
                    businessProducts
                  }
                  theme={
                    THEMES.business
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
                />
              )}

            {/* =================================================
                CHROMEBOOK
            ================================================= */}

            {condition !==
              "refurbished" &&
              chromebookProducts.length >
                0 && (
                <LaptopSection
                  icon="💻"
                  title="Chromebook Laptops"
                  items={
                    chromebookProducts
                  }
                  theme={
                    THEMES.chromebook
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
                />
              )}

            {/* =================================================
                OTHER
            ================================================= */}

            {condition !==
              "refurbished" &&
              specialCategoryProducts.length >
                0 && (
                <LaptopSection
                  icon="📦"
                  title="Other Laptops & Products"
                  items={
                    specialCategoryProducts
                  }
                  theme={
                    THEMES.other
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
                />
              )}

            {/* =================================================
                REFURBISHED SECTION WHEN NO FILTER
                =================================================
                
                If you want refurbished products to ALWAYS
                show in Shop, even without selecting the
                Refurbished filter, this section shows them.
            ================================================= */}

            {condition === "" &&
              refurbishedProducts.length >
                0 && (
                <LaptopSection
                  icon="♻️"
                  title="Refurbished Laptops"
                  items={
                    refurbishedProducts
                  }
                  theme={
                    THEMES.refurbished
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onAddToWishlist={
                    handleWishlist
                  }
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