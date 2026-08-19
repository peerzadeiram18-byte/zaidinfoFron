// // import React, { useEffect, useState } from "react";

// // import "./Wishlist.css";

// // import { Link } from "react-router-dom";

// // import {

// //     getWishlist,

// //     removeFromWishlist

// // } from "../../../services/wishlistService";

// // import {

// //     addToCart

// // } from "../../../services/cartService";

// // const Wishlist = () => {

// //     const [wishlist, setWishlist] = useState([]);

// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {

// //         loadWishlist();

// //     }, []);

// //     const loadWishlist = async () => {

// //         try {

// //             setLoading(true);

// //             const res = await getWishlist();

// //             console.log(res.data);

// //             setWishlist(

// //                 res.data.wishlist.products || []

// //             );

// //         }

// //         catch (error) {

// //             console.log(error);

// //         }

// //         finally {

// //             setLoading(false);

// //         }

// //     };

// //     const handleRemove = async (productId) => {

// //         try {

// //             await removeFromWishlist(productId);

// //             loadWishlist();

// //         }

// //         catch (error) {

// //             console.log(error);

// //             alert(error.response?.data?.message);

// //         }

// //     };

// //     const handleAddToCart = async (productId) => {

// //         try {

// //             await addToCart({

// //                 product: productId,

// //                 quantity: 1

// //             });

// //             alert("Added To Cart");

// //         }

// //         catch (error) {

// //             console.log(error);

// //             alert(error.response?.data?.message);

// //         }

// //     };

// //     if (loading) {

// //         return (

// //             <div className="loading">

// //                 Loading Wishlist...

// //             </div>

// //         );

// //     }

// //     return (

// //         <div className="wishlist-page">

// //             <div className="wishlist-header">

// //                 <h2>

// //                     My Wishlist

// //                 </h2>

// //             </div>

// //             {

// //                 wishlist.length === 0 ?

// //                 (

// //                     <div className="empty-wishlist">

// //                         <h3>

// //                             Wishlist Is Empty

// //                         </h3>

// //                         <Link

// //                             to="/shop"

// //                             className="shop-btn"

// //                         >

// //                             Continue Shopping

// //                         </Link>

// //                     </div>

// //                 )

// //                 :

// //                 (

// //                     <div className="wishlist-grid">

// //                         {

// //                             wishlist.map((item) => (

// //                                 <div

// //                                     className="wishlist-card"

// //                                     key={item.product._id}

// //                                 >

// //                                     <img

// //                                         src={

// //                                             item.product.imageUrl

// //                                                 ?

// //                                                 `http://localhost:5000${item.product.imageUrl}`

// //                                                 :

// //                                                 "/no-image.png"

// //                                         }

// //                                         alt={item.product.title}

// //                                     />

// //                                     <h3>

// //                                         {item.product.title}

// //                                     </h3>

// //                                     <p>

// //                                         ₹ {item.product.discountedPrice}

// //                                     </p>

// //                                     <div className="wishlist-buttons">

// //                                         <button

// //                                             onClick={() =>

// //                                                 handleAddToCart(

// //                                                     item.product._id

// //                                                 )

// //                                             }

// //                                         >

// //                                             Add To Cart

// //                                         </button>

// //                                         <button

// //                                             className="remove-btn"

// //                                             onClick={() =>

// //                                                 handleRemove(

// //                                                     item.product._id

// //                                                 )

// //                                             }

// //                                         >

// //                                             Remove

// //                                         </button>

// //                                     </div>

// //                                 </div>

// //                             ))

// //                         }

// //                     </div>

// //                 )

// //             }

// //         </div>

// //     );

// // };

// // export default Wishlist;




// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
// import "./Wishlist.css";
// import { toast } from "react-toastify";

// import {
//   getWishlist,
//   removeFromWishlist
// } from "../../../services/wishlistService";

// import { addToCart } from "../../../services/cartService";

// const API = import.meta.env.VITE_API_URL;

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadWishlist();
//   }, []);

//   const loadWishlist = async () => {
//     try {
//       setLoading(true);
//       const res = await getWishlist();
//       setWishlist(res.data.wishlist.products || []);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (productId) => {
//     try {
//       await removeFromWishlist(productId);
//       loadWishlist();
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message);
//     }
//   };

//   const handleAddToCart = async (productId) => {
//     try {
//       await addToCart({
//         product: productId,
//         quantity: 1
//       });
//       toast.success("Added To Cart");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading Wishlist...</div>;
//   }

//   return (
//     <div className="wishlist-page">
//       <div className="wishlist-header">
//         <div>
//           <h2>My Wishlist</h2>
//           <span className="wishlist-count">
//             {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Saved
//           </span>
//         </div>
//       </div>

//       {wishlist.length === 0 ? (
//         <div className="empty-wishlist">
//           <h3>Wishlist Is Empty</h3>
//           <p>Explore our store and save your favorite items for later.</p>
//           <Link to="/shop" className="shop-btn">
//             Continue Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="wishlist-grid">
//           {wishlist.map((item) => (
//             <div className="wishlist-card" key={item.product._id}>
//               {/* Quick Remove Floating Button */}
//               <button
//                 className="quick-remove-btn"
//                 title="Remove item"
//                 onClick={() => handleRemove(item.product._id)}
//               >
//                 <FaTrashAlt />
//               </button>

//               {/* Product Image Wrapper */}
//               <div className="card-image-box">
//                 <img
// src={
//   item.product.images?.length
//     ? `${API.replace("/api", "")}${item.product.images[0].url}`
//     : "/no-image.png"
// }
//                   alt={item.product.title}
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="card-details">
// <h3>{item.product.name}</h3>
//                 <div className="price-tag">
// ₹ {item.product.pricing?.sellingPrice}                </div>
//               </div>

//               {/* Card Footer Actions */}
//               <div className="wishlist-buttons">
//                 <button
//                   className="add-cart-btn"
//                   onClick={() => handleAddToCart(item.product._id)}
//                 >
//                   <FaShoppingCart /> Add To Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import "./Wishlist.css";
import { toast } from "react-toastify";

import {
  getWishlist,
  removeFromWishlist,
} from "../../../services/wishlistService";

import { addToCart } from "../../../services/cartService";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BASE_URL = API.replace(/\/api\/?$/, "");

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);

      const res = await getWishlist();

      console.log("========== WISHLIST RESPONSE ==========");
      console.log(res.data);
      console.log(
        "WISHLIST PRODUCTS:",
        res.data?.wishlist?.products
      );
      console.log("========================================");

      const products =
        res.data?.wishlist?.products || [];

      setWishlist(products);

    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (!productId) return;

    try {
      await removeFromWishlist(productId);

      toast.success("Removed from Wishlist");

      await loadWishlist();

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to remove from wishlist"
      );
    }
  };

  const handleAddToCart = async (productId) => {
    if (!productId) {
      toast.error("Product is unavailable");
      return;
    }

    try {
      await addToCart({
        product: productId,
        quantity: 1,
      });

      toast.success("Added To Cart");

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to add to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      {/* HEADER */}

      <div className="wishlist-header">
        <div>
          <h2>My Wishlist</h2>

          <span className="wishlist-count">
            {wishlist.filter(
              (item) => item?.product
            ).length}{" "}
            {wishlist.filter(
              (item) => item?.product
            ).length === 1
              ? "Item"
              : "Items"}{" "}
            Saved
          </span>
        </div>
      </div>

      {/* EMPTY */}

      {wishlist.filter(
        (item) => item?.product
      ).length === 0 ? (

        <div className="empty-wishlist">

          <h3>
            Wishlist Is Empty
          </h3>

          <p>
            Explore our store and save your
            favorite items for later.
          </p>

          <Link
            to="/shop"
            className="shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlist
            .filter(
              (item) => item?.product
            )
            .map((item) => {

              const product =
                item.product;

              const productId =
                product?._id;

              /*
               * IMAGE
               */

              let imageUrl =
                "/no-image.png";

              if (
                product?.images?.length > 0 &&
                product.images[0]?.url
              ) {
                const imagePath =
                  product.images[0].url;

                imageUrl =
                  imagePath.startsWith("http")
                    ? imagePath
                    : `${BASE_URL}${imagePath}`;
              }

              /*
               * PRICE
               */

              const price =
                product?.pricing?.sellingPrice ??
                product?.sellingPrice ??
                product?.price ??
                0;

              /*
               * NAME
               */

              const productName =
                product?.name ||
                product?.title ||
                "Product";

              return (

                <div
                  className="wishlist-card"
                  key={productId}
                >

                  {/* REMOVE */}

                  <button
                    className="quick-remove-btn"
                    title="Remove item"
                    onClick={() =>
                      handleRemove(productId)
                    }
                  >
                    <FaTrashAlt />
                  </button>

                  {/* IMAGE */}

                  <div className="card-image-box">

                    <img
                      src={imageUrl}
                      alt={productName}
                      onError={(e) => {
                        e.currentTarget.src =
                          "/no-image.png";
                      }}
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="card-details">

                    <h3>
                      {productName}
                    </h3>

                    <div className="price-tag">
                      ₹{" "}
                      {Number(price).toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>

                  {/* CART */}

                  <div className="wishlist-buttons">

                    <button
                      className="add-cart-btn"
                      onClick={() =>
                        handleAddToCart(
                          productId
                        )
                      }
                    >
                      <FaShoppingCart />

                      Add To Cart
                    </button>

                  </div>

                </div>

              );
            })}

        </div>

      )}

    </div>
  );
};

export default Wishlist;

