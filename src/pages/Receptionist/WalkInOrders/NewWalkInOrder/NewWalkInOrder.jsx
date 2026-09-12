// import { useEffect, useState } from "react";
// import {
//   useNavigate,
// } from "react-router-dom";
// import "./NewWalkInOrder.css";
// import { toast } from "react-toastify";

// import {
//   getProducts,
//   createWalkInOrder,
// } from "../../../../services/walkInOrderService";

// import WalkInInvoice from "../WalkInInvoice/WalkInInvoice";

// import {
//   createInvoice,
// } from "../../../../services/invoiceService";

// function NewWalkInOrder() {

//     const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   const [cart, setCart] = useState([]);
//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);

//   const [customer, setCustomer] = useState({
//     fullName: "",
//     phone: "",
//     addressLine: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "India",
//     landmark: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("CASH");
//   const [invoiceData, setInvoiceData] = useState(null);

//   // ============================================
//   // LOAD PRODUCTS
//   // ============================================

// //   useEffect(() => {
// //     loadProducts();
// //   }, []);

// // useEffect(() => {
// //     loadProducts();
// // }, []);

// // const loadProducts = async () => {

// //     try {

// //         console.log(
// //             "Loading products for Walk-In..."
// //         );

// //         const data = await getProducts();

// //         console.log(
// //             "WALK-IN PRODUCTS:",
// //             data
// //         );

// //         setProducts(
// //             Array.isArray(data)
// //                 ? data
// //                 : []
// //         );

// //         setFilteredProducts(
// //             Array.isArray(data)
// //                 ? data
// //                 : []
// //         );

// //     } catch (err) {

// //         console.error(
// //             "PRODUCT LOAD ERROR:",
// //             err
// //         );

// //         setProducts([]);
// //         setFilteredProducts([]);

// //     }
// // };

// //   const loadProducts = async () => {
// //     try {
// //       setLoading(true);

// //       const data = await getProducts();

// //       console.log("WALK-IN PRODUCTS:", data);

// //       const productList = Array.isArray(data)
// //         ? data
// //         : data?.products || data?.data || [];

// //       setProducts(productList);
// //       setFilteredProducts(productList);
// //     } catch (err) {
// //       console.error("PRODUCT LOAD ERROR:", err);

// //       alert(
// //         err.response?.data?.message ||
// //           "Unable to load products"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };




// // ============================================
// // LOAD PRODUCTS
// // ============================================

// useEffect(() => {
//     loadProducts();
// }, []);

// const loadProducts = async () => {
//     try {
//         setLoading(true);

//         console.log("Loading products for Walk-In...");

//         const data = await getProducts();

//         console.log("WALK-IN PRODUCTS:", data);

//         const productList = Array.isArray(data)
//             ? data
//             : data?.products ||
//               data?.data ||
//               [];

//         setProducts(productList);
//         setFilteredProducts(productList);

//     } catch (err) {

//         console.error(
//             "PRODUCT LOAD ERROR:",
//             err
//         );

//         setProducts([]);
//         setFilteredProducts([]);

//         alert(
//             err.response?.data?.message ||
//             "Unable to load products"
//         );

//     } finally {

//         setLoading(false);

//     }
// };







//   // ============================================
//   // GET STOCK
//   // ============================================

//   const getStock = (product) => {
//     return Number(
//       product.inventory?.currentStock ??
//       product.stock ??
//       product.availableStock ??
//       0
//     );
//   };

//   // ============================================
//   // SEARCH PRODUCT
//   // ============================================

//   useEffect(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) {
//       setFilteredProducts(products);
//       return;
//     }

//     const result = products.filter((product) => {
//       const name = String(product.name || "").toLowerCase();
//       const sku = String(product.sku || "").toLowerCase();

//       return (
//         name.includes(value) ||
//         sku.includes(value)
//       );
//     });

//     setFilteredProducts(result);
//   }, [search, products]);

//   // ============================================
//   // ADD PRODUCT
//   // ============================================

// //   const addProduct = (product) => {
// //     const stock = getStock(product);

// //     if (stock <= 0) {
// //       alert("This product is out of stock");
// //       return;
// //     }

// //     const exists = cart.find(
// //       (item) => item.product === product._id
// //     );

// //     if (exists) {
// //       if (exists.quantity >= stock) {
// //         alert(`Only ${stock} quantity available`);
// //         return;
// //       }

// //       setCart(
// //         cart.map((item) =>
// //           item.product === product._id
// //             ? {
// //                 ...item,
// //                 quantity: item.quantity + 1,
// //               }
// //             : item
// //         )
// //       );

// //       return;
// //     }

// //     setCart([
// //       ...cart,
// //       {
// //         product: product._id,

// //         title: product.name,

// //         sku: product.sku,

// //         quantity: 1,

// //         stock: stock,

// //         originalPrice: Number(
// //           product.pricing?.sellingPrice || 0
// //         ),

// //         price: Number(
// //           product.pricing?.sellingPrice || 0
// //         ),

// //         discountAmount: 0,

// //         imageUrl:
// //           product.images?.[0]?.url || "",
// //       },
// //     ]);
// //   };

// // const addProduct = (product) => {

// //     const currentStock = Number(
// //         product.inventory?.currentStock ?? 0
// //     );

// //     const reservedStock = Number(
// //         product.inventory?.reservedStock ?? 0
// //     );

// //     const availableStock = Math.max(
// //         currentStock - reservedStock,
// //         0
// //     );

// //     // ==============================
// //     // OUT OF STOCK
// //     // ==============================

// //     if (availableStock <= 0) {

// //         alert(
// //             "This product is out of stock."
// //         );

// //         return;
// //     }

// //     // ==============================
// //     // CHECK CART
// //     // ==============================

// //     const existingItem = cart.find(
// //         item =>
// //             item.product === product._id
// //     );

// //     // ==============================
// //     // PRODUCT ALREADY IN CART
// //     // ==============================

// //     if (existingItem) {

// //         if (
// //             existingItem.quantity >=
// //             availableStock
// //         ) {

// //             alert(
// //                 `Only ${availableStock} item(s) available.`
// //             );

// //             return;
// //         }

// //         setCart(
// //             cart.map(item =>
// //                 item.product === product._id
// //                     ? {
// //                         ...item,
// //                         quantity:
// //                             item.quantity + 1
// //                     }
// //                     : item
// //             )
// //         );

// //         return;
// //     }

// //     // ==============================
// //     // ADD NEW PRODUCT
// //     // ==============================

// //     const sellingPrice = Number(
// //         product.pricing?.sellingPrice ?? 0
// //     );

// //     setCart([
// //         ...cart,

// //         {
// //             product: product._id,

// //             title: product.name,

// //             sku: product.sku,

// //             quantity: 1,

// //             originalPrice:
// //                 sellingPrice,

// //             price:
// //                 sellingPrice,

// //             discountAmount: 0,

// //             imageUrl:
// //                 product.images?.[0]?.url || "",

// //             availableStock:
// //                 availableStock
// //         }
// //     ]);
// // };


// const addProduct = (product) => {

//     // const currentStock = Number(
//     //     product.inventory?.currentStock ??
//     //     product.currentStock ??
//     //     product.availableStock ??
//     //     product.stock ??
//     //     0
//     // );

//     // const reservedStock = Number(
//     //     product.inventory?.reservedStock ?? 0
//     // );

//     // const availableStock = Math.max(
//     //     currentStock - reservedStock,
//     //     0
//     // );


//     const currentStock = Number(
//     product.inventory?.currentStock ??
//     product.currentStock ??
//     product.availableStock ??
//     product.stock ??
//     0
// );

// const reservedStock = Number(
//     product.inventory?.reservedStock ??
//     product.reservedStock ??
//     0
// );

// const availableStock = Math.max(
//     currentStock - reservedStock,
//     0
// );


//     if (availableStock <= 0) {
//         alert("This product is out of stock.");
//         return;
//     }

//     const existingItem = cart.find(
//         item => item.product === product._id
//     );

//     if (existingItem) {

//         if (existingItem.quantity >= availableStock) {
//             alert(`Only ${availableStock} item(s) available.`);
//             return;
//         }

//         setCart(
//             cart.map(item =>
//                 item.product === product._id
//                     ? {
//                           ...item,
//                           quantity: item.quantity + 1,
//                       }
//                     : item
//             )
//         );

//         return;
//     }

//     const sellingPrice = Number(
//         product.pricing?.sellingPrice ?? 0
//     );

//     setCart([
//         ...cart,
//         {
//             product: product._id,
//             title: product.name,
//             sku: product.sku,
//             quantity: 1,
//             originalPrice: sellingPrice,
//             price: sellingPrice,
//             discountAmount: 0,
//             imageUrl: product.images?.[0]?.url || "",
//             availableStock: availableStock,
//         },
//     ]);
// };



//   // ============================================
//   // INCREASE QUANTITY
//   // ============================================

// //   const increaseQty = (id) => {
// //     setCart((currentCart) =>
// //       currentCart.map((item) => {
// //         if (item.product !== id) {
// //           return item;
// //         }

// //         if (item.quantity >= item.stock) {
// //           alert(
// //             `Only ${item.stock} quantity available`
// //           );

// //           return item;
// //         }

// //         return {
// //           ...item,
// //           quantity: item.quantity + 1,
// //         };
// //       })
// //     );
// //   };


// const increaseQty = (id) => {

//     const cartItem = cart.find(
//         item =>
//             item.product === id
//     );

//     if (!cartItem) {
//         return;
//     }

//     if (
//         cartItem.quantity >=
//         cartItem.availableStock
//     ) {

//         alert(
//             `Only ${cartItem.availableStock} item(s) available.`
//         );

//         return;
//     }

//     setCart(
//         cart.map(item =>
//             item.product === id
//                 ? {
//                     ...item,
//                     quantity:
//                         item.quantity + 1
//                 }
//                 : item
//         )
//     );
// };

//   // ============================================
//   // DECREASE QUANTITY
//   // ============================================

//   const decreaseQty = (id) => {
//     setCart((currentCart) =>
//       currentCart
//         .map((item) =>
//           item.product === id
//             ? {
//                 ...item,
//                 quantity: item.quantity - 1,
//               }
//             : item
//         )
//         .filter(
//           (item) => item.quantity > 0
//         )
//     );
//   };

//   // ============================================
//   // REMOVE
//   // ============================================

//   const removeItem = (id) => {
//     setCart((currentCart) =>
//       currentCart.filter(
//         (item) => item.product !== id
//       )
//     );
//   };

//   // ============================================
//   // TOTAL
//   // ============================================

//   const total = cart.reduce(
//     (sum, item) =>
//       sum +
//       Number(item.price) *
//         Number(item.quantity),
//     0
//   );

//   // ============================================
//   // CUSTOMER INPUT
//   // ============================================

//   const handleCustomerChange = (e) => {
//     setCustomer({
//       ...customer,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ============================================
//   // CREATE WALK-IN ORDER
//   // ============================================

// //   const placeOrder = async () => {
// //     if (cart.length === 0) {
// //       alert("Please add at least one product");
// //       return;
// //     }

// //     if (
// //       !customer.fullName ||
// //       !customer.phone
// //     ) {
// //       alert(
// //         "Customer Name and Phone are required"
// //       );
// //       return;
// //     }

// //     // Check cart quantity against stock
// //     for (const item of cart) {
// //     //   if (item.quantity > item.stock) 
// //         if (item.quantity > item.availableStock)
// //         {
// //         alert(
// //           `${item.title}: only ${item.stock} available`
// //         );
// //         return;
// //       }
// //     }

// //     const orderData = {
// //       orderItems: cart.map((item) => ({
// //         product: item.product,

// //         title: item.title,

// //         quantity: Number(item.quantity),

// //         originalPrice: Number(
// //           item.originalPrice
// //         ),

// //         price: Number(item.price),

// //         discountAmount: Number(
// //           item.discountAmount || 0
// //         ),

// //         imageUrl: item.imageUrl || "",
// //       })),

// //       shippingAddress: {
// //         fullName: customer.fullName,

// //         phone: customer.phone,

// //         addressLine:
// //           customer.addressLine ||
// //           "Walk In Customer",

// //         city: customer.city,

// //         state: customer.state,

// //         pincode: customer.pincode,

// //         country: "India",

// //         landmark:
// //           customer.landmark || "",
// //       },

// //       totalAmount: Number(total),

// //       paymentMethod,

// //       orderSource: "WALK_IN",
// //     };

// //     try {
// //       setPlacingOrder(true);

// //       console.log(
// //         "WALK-IN ORDER DATA:",
// //         orderData
// //       );


// //   //     const res =
// //   // await createWalkInOrder(
// //   //   orderData
// //   // );

// //   const res =
// //   await createWalkInOrder(
// //     orderData
// //   );

// // console.log(
// //   "WALK-IN ORDER RESPONSE:",
// //   res
// // );


// // // ============================================
// // // GET CREATED ORDER
// // // ============================================

// // const createdOrder =
// //   res?.order ||
// //   res?.data?.order ||
// //   res?.data;


// // if (!createdOrder?._id) {

// //   console.error(
// //     "Created order not found:",
// //     res
// //   );

// //   throw new Error(
// //     "Order created but Order ID was not returned."
// //   );
// // }


// // console.log(
// //   "CREATED WALK-IN ORDER:",
// //   createdOrder
// // );


// // // ============================================
// // // CREATE INVOICE
// // // ============================================

// // let createdInvoice = null;

// // try {

// //   console.log(
// //     "Creating invoice for order:",
// //     createdOrder._id
// //   );

// //   const invoiceResponse =
// //     await createInvoice(
// //       createdOrder._id
// //     );

// //   console.log(
// //     "INVOICE RESPONSE:",
// //     invoiceResponse
// //   );

// //   createdInvoice =
// //     invoiceResponse?.data ||
// //     invoiceResponse?.invoice ||
// //     invoiceResponse;

// // } catch (invoiceError) {

// //   console.error(
// //     "INVOICE CREATION ERROR:",
// //     invoiceError
// //   );

// //   alert(
// //     invoiceError?.response?.data?.message ||
// //     invoiceError?.message ||
// //     "Order created successfully, but invoice could not be created."
// //   );

// //   // IMPORTANT:
// //   // Order already created.
// //   // We do NOT break the order flow.
// // }


// // // ============================================
// // // SHOW INVOICE
// // // ============================================

// // if (createdInvoice) {

// //   setInvoiceData(
// //     createdInvoice
// //   );

// // } else {

// //   // fallback:
// //   // show order if invoice API failed
// //   setInvoiceData(
// //     createdOrder
// //   );
// // }


// // alert(
// //   "Walk-In Order Created Successfully"
// // );

// // console.log(
// //   "WALK-IN ORDER RESPONSE:",
// //   res
// // );


// // // ========================================
// // // GET CREATED ORDER
// // // ========================================

// // const createdOrder =
// //   res?.order ||
// //   res?.data?.order ||
// //   res?.data;


// // console.log(
// //   "CREATED WALK-IN ORDER:",
// //   createdOrder
// // );


// // // ========================================
// // // CHECK ORDER ID
// // // ========================================

// // const createdOrderId =
// //   createdOrder?._id ||
// //   createdOrder?.id;


// // if (!createdOrderId) {

// //   console.error(
// //     "Order created but Order ID not found:",
// //     createdOrder
// //   );

// //   alert(
// //     "Order created, but invoice could not be opened."
// //   );

// //   return;

// // }


// // // ========================================
// // // KEEP EXISTING INVOICE WORKING
// // // ========================================

// // setInvoiceData(
// //   createdOrder
// // );


// // // ========================================
// // // SUCCESS
// // // ========================================

// // alert(
// //   "Walk-In Order Created Successfully"
// // );
// //       // const res =
// //       //   await createWalkInOrder(
// //       //     orderData
// //       //   );

// //       // console.log(
// //       //   "WALK-IN ORDER RESPONSE:",
// //       //   res
// //       // );

// //       // const createdOrder =
// //       //   res?.order ||
// //       //   res?.data?.order ||
// //       //   res?.data;

// //       // setInvoiceData(createdOrder);

// //       // alert(
// //       //   "Walk-In Order Created Successfully"
// //       // );

// //       // setCart([]);

// //       setCustomer({
// //         fullName: "",
// //         phone: "",
// //         addressLine: "",
// //         city: "",
// //         state: "",
// //         pincode: "",
// //         country: "India",
// //         landmark: "",
// //       });

// //       // Refresh inventory/product stock
// //       await loadProducts();
// //     } catch (err) {
// //       console.error(
// //         "CREATE WALK-IN ORDER ERROR:",
// //         err
// //       );

// //       alert(
// //         err.response?.data?.message ||
// //           "Unable to create order"
// //       );
// //     } finally {
// //       setPlacingOrder(false);
// //     }
// //   };


// // ============================================
// // CREATE WALK-IN ORDER + INVOICE
// // ============================================

// const placeOrder = async () => {
//     // ============================================
//     // VALIDATE CART
//     // ============================================

//     if (cart.length === 0) {
//         toast.error("Please add at least one product");
//         return;
//     }

//     // ============================================
//     // VALIDATE CUSTOMER
//     // ============================================

//     if (!customer.fullName || !customer.phone) {
//         toast.error("Customer Name and Phone are required");
//         return;
//     }

//     // ============================================
//     // CHECK STOCK
//     // ============================================

//     for (const item of cart) {
//         if (item.quantity > item.availableStock) {
//             toast.error(
//                 `${item.title}: only ${item.availableStock} item(s) available`
//             );
//             return;
//         }
//     }

//     // ============================================
//     // PREPARE ORDER DATA
//     // ============================================

//     const orderData = {
//         orderItems: cart.map((item) => ({
//             product: item.product,

//             title: item.title,

//             quantity: Number(item.quantity),

//             originalPrice: Number(
//                 item.originalPrice || item.price || 0
//             ),

//             price: Number(
//                 item.price || 0
//             ),

//             discountAmount: Number(
//                 item.discountAmount || 0
//             ),

//             imageUrl: item.imageUrl || "",
//         })),

//         shippingAddress: {
//             fullName: customer.fullName,

//             phone: customer.phone,

//             addressLine:
//                 customer.addressLine ||
//                 "Walk In Customer",

//             city: customer.city || "",

//             state: customer.state || "",

//             pincode: customer.pincode || "",

//             country: customer.country || "India",

//             landmark:
//                 customer.landmark || "",
//         },

//         totalAmount: Number(total),

//         paymentMethod,

//         orderSource: "WALK_IN",
//     };

//     // ============================================
//     // CREATE ORDER
//     // ============================================

//     try {
//         setPlacingOrder(true);

//         console.log(
//             "WALK-IN ORDER DATA:",
//             orderData
//         );

//         const res = await createWalkInOrder(
//             orderData
//         );

//         console.log(
//             "WALK-IN ORDER RESPONSE:",
//             res
//         );

//         // ========================================
//         // GET CREATED ORDER
//         // ========================================

//         const createdOrder =
//             res?.order ||
//             res?.data?.order ||
//             res?.data;

//         console.log(
//             "CREATED WALK-IN ORDER:",
//             createdOrder
//         );

//         // ========================================
//         // CHECK ORDER ID
//         // ========================================

//         const createdOrderId =
//             createdOrder?._id ||
//             createdOrder?.id;

//         if (!createdOrderId) {
//             console.error(
//                 "Created order response does not contain order ID:",
//                 res
//             );

//             throw new Error(
//                 "Order created but Order ID was not returned."
//             );
//         }

//         // ========================================
//         // CREATE INVOICE
//         // ========================================

//         let createdInvoice = null;

//         try {
//             console.log(
//                 "CREATING INVOICE FOR ORDER:",
//                 createdOrderId
//             );

//             const invoiceResponse =
//                 await createInvoice(
//                     createdOrderId
//                 );

//             console.log(
//                 "INVOICE RESPONSE:",
//                 invoiceResponse
//             );

//             createdInvoice =
//                 invoiceResponse?.data ||
//                 invoiceResponse?.invoice ||
//                 invoiceResponse;

//             console.log(
//                 "CREATED INVOICE:",
//                 createdInvoice
//             );

//         } catch (invoiceError) {
//             // ====================================
//             // IMPORTANT:
//             // ORDER ALREADY CREATED.
//             // DON'T BREAK WALK-IN FLOW.
//             // ====================================

//             console.error(
//                 "INVOICE CREATION ERROR:",
//                 invoiceError
//             );

//             toast.success(
//                 invoiceError?.response?.data?.message ||
//                 invoiceError?.message ||
//                 "Order created successfully, but invoice could not be created."
//             );
//         }

//         // ========================================
//         // SHOW INVOICE
//         // ========================================

//         if (createdInvoice) {
//             setInvoiceData(
//                 createdInvoice
//             );
//         } else {
//             // Fallback:
//             // existing WalkInInvoice can still
//             // display the created order.
//             setInvoiceData(
//                 createdOrder
//             );
//         }

//         // ========================================
//         // SUCCESS
//         // ========================================

//         toast.success(
//             "Walk-In Order Created Successfully"
//         );

//         // ========================================
//         // CLEAR CART
//         // ========================================

//         setCart([]);

//         // ========================================
//         // CLEAR CUSTOMER
//         // ========================================

//         setCustomer({
//             fullName: "",
//             phone: "",
//             addressLine: "",
//             city: "",
//             state: "",
//             pincode: "",
//             country: "India",
//             landmark: "",
//         });

//         // ========================================
//         // REFRESH PRODUCTS / INVENTORY
//         // ========================================

//         await loadProducts();

//     } catch (err) {

//         console.error(
//             "CREATE WALK-IN ORDER ERROR:",
//             err
//         );

//         toast.error(
//             err?.response?.data?.message ||
//             err?.message ||
//             "Unable to create order"
//         );

//     } finally {

//         setPlacingOrder(false);

//     }
// };

//   // ============================================
//   // JSX
//   // ============================================

//   return (
//     <div className="walkin-page">

//       {/* ======================================
//           LEFT SIDE
//       ====================================== */}

//       <div className="left-side">

//         <h2>Product Search</h2>

//         <input
//           type="text"
//           placeholder="Search product by Name or SKU..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           className="search-box"
//         />

//         {loading ? (
//           <p>Loading products...</p>
//         ) : filteredProducts.length === 0 ? (
//           <p>No products found</p>
//         ) : (
//         //   <div className="product-list">

//         //     {filteredProducts.map(
//         //       (product) => {
//         //         const stock =
//         //           getStock(product);

//         //         const price =
//         //           Number(
//         //             product.pricing
//         //               ?.sellingPrice || 0
//         //           );

//         //         return (
//         //           <div
//         //             key={product._id}
//         //             className="product-card"
//         //           >

//         //             <img
//         //               src={
//         //                 product.images
//         //                   ?.length
//         //                   ? product.images[0].url
//         //                   : "/no-image.png"
//         //               }
//         //               alt={product.name}
//         //             />

//         //             <h4>
//         //               {product.name}
//         //             </h4>

//         //             <p>
//         //               SKU: {product.sku}
//         //             </p>

//         //             <p
//         //               className={
//         //                 stock > 0
//         //                   ? "stock-available"
//         //                   : "stock-out"
//         //               }
//         //             >
//         //               Stock: {stock}
//         //             </p>

//         //             <h3>
//         //               ₹{" "}
//         //               {price.toLocaleString(
//         //                 "en-IN"
//         //               )}
//         //             </h3>

//         //             <button
//         //               type="button"
//         //               disabled={stock <= 0}
//         //               onClick={() =>
//         //                 addProduct(product)
//         //               }
//         //             >
//         //               {stock > 0
//         //                 ? "+ Add"
//         //                 : "Out of Stock"}
//         //             </button>

//         //           </div>
//         //         );
//         //       }
//         //     )}

//         //   </div>

//         <div className="product-list">

//     {filteredProducts.length === 0 ? (

//         <div className="no-products">
//             No products found
//         </div>

//     ) : (

//         filteredProducts.map((product) => {

//             // const currentStock = Number(
//             //     product.inventory?.currentStock ?? 0
//             // );


//     console.log(
//         "PRODUCT JSON",
//         JSON.stringify(product, null, 2)
//     );
//     const currentStock = Number(
//         product.inventory?.currentStock ??
//         product.currentStock ??
//         product.availableStock ??
//         product.stock ??
//         0
//     );


//             const reservedStock = Number(
//                 product.inventory?.reservedStock ?? 0
//             );

//             const availableStock =
//                 Math.max(
//                     currentStock -
//                     reservedStock,
//                     0
//                 );

//             const sellingPrice = Number(
//                 product.pricing?.sellingPrice ?? 0
//             );

//             return (

//                 <div
//                     key={product._id}
//                     className="product-card"
//                 >

//                     {/* <img
//                         src={
//                             product.images?.[0]?.url ||
//                             "/no-image.png"
//                         }
//                         alt={product.name}
//                     /> */}
                    


// <img
//     src={
//         product.images?.length
//             ? `${import.meta.env.VITE_API_URL.replace("/api","")}${product.images[0].url}`
//             : "/no-image.png"
//     }
//     alt={product.name}
// />


//                     <h4>
//                         {product.name}
//                     </h4>

//                     <p>
//                         SKU: {product.sku}
//                     </p>

//                     <p>
//                         Stock: {availableStock}
//                     </p>

//                     <h3>
//                         ₹{" "}
//                         {sellingPrice.toLocaleString(
//                             "en-IN"
//                         )}
//                     </h3>

//                     <button
//                         type="button"
//                         disabled={
//                             availableStock <= 0
//                         }
//                         onClick={() =>
//                             addProduct(product)
//                         }
//                     >

//                         {availableStock <= 0
//                             ? "Out of Stock"
//                             : "+ Add"}

//                     </button>

//                 </div>

//             );

//         })

//     )}

// </div>
//         )}

//       </div>

//       {/* ======================================
//           RIGHT SIDE
//       ====================================== */}

//       <div className="right-side">

//         <h2>Cart</h2>

//         {cart.length === 0 ? (
//           <p>No Product Added</p>
//         ) : (
//           cart.map((item) => (
//             <div
//               className="cart-item"
//               key={item.product}
//             >

//               <div>
//                 <h4>
//                   {item.title}
//                 </h4>

//                 <p>
//                   SKU: {item.sku}
//                 </p>

//                 <p>
//                   ₹{" "}
//                   {item.price.toLocaleString(
//                     "en-IN"
//                   )}
//                 </p>

//                 <small>
//     Available: {item.availableStock}
// </small>
//               </div>

//               <div className="qty-box">

//                 <button
//                   type="button"
//                   onClick={() =>
//                     decreaseQty(
//                       item.product
//                     )
//                   }
//                 >
//                   -
//                 </button>

//                 <span>
//                   {item.quantity}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     increaseQty(
//                       item.product
//                     )
//                   }
//                 >
//                   +
//                 </button>

//               </div>

//               <button
//                 type="button"
//                 className="remove-btn"
//                 onClick={() =>
//                   removeItem(
//                     item.product
//                   )
//                 }
//               >
//                 Remove
//               </button>

//             </div>
//           ))
//         )}

//         <hr />

//         <h3>
//           Grand Total: ₹{" "}
//           {total.toLocaleString("en-IN")}
//         </h3>

//         <hr />

//         <h2>
//           Customer Details
//         </h2>

//         <input
//           type="text"
//           name="fullName"
//           placeholder="Customer Name"
//           value={customer.fullName}
//           onChange={handleCustomerChange}
//         />

//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone Number"
//           value={customer.phone}
//           onChange={handleCustomerChange}
//         />

//         <input
//           type="text"
//           name="addressLine"
//           placeholder="Address"
//           value={customer.addressLine}
//           onChange={handleCustomerChange}
//         />

//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={customer.city}
//           onChange={handleCustomerChange}
//         />

//         <input
//           type="text"
//           name="state"
//           placeholder="State"
//           value={customer.state}
//           onChange={handleCustomerChange}
//         />

//         <input
//           type="text"
//           name="pincode"
//           placeholder="Pincode"
//           value={customer.pincode}
//           onChange={handleCustomerChange}
//         />

//         <select
//           value={paymentMethod}
//           onChange={(e) =>
//             setPaymentMethod(
//               e.target.value
//             )
//           }
//         >
//           <option value="CASH">
//             Cash
//           </option>

//           <option value="CARD">
//             Card
//           </option>

//           <option value="UPI">
//             UPI
//           </option>
//         </select>

//         <button
//           type="button"
//           className="place-order-btn"
//           disabled={
//             placingOrder ||
//             cart.length === 0
//           }
//           onClick={placeOrder}
//         >
//           {placingOrder
//             ? "Creating Order..."
//             : "Create Walk-In Order"}
//         </button>

//       </div>

//       {/* ======================================
//           INVOICE
//       ====================================== */}

//       {invoiceData && (
//         <WalkInInvoice
//           order={invoiceData}
//           onClose={() =>
//             setInvoiceData(null)
//           }
//         />
//       )}

//     </div>
//   );
// }

// export default NewWalkInOrder;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewWalkInOrder.css";
import { toast } from "react-toastify";

import {
    getProducts,
    createWalkInOrder,
} from "../../../../services/walkInOrderService";

import WalkInInvoice from "../WalkInInvoice/WalkInInvoice";

import {
    createInvoice,
} from "../../../../services/invoiceService";

function NewWalkInOrder() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [customer, setCustomer] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        landmark: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [invoiceData, setInvoiceData] = useState(null);

    // =====================================================
    // PRODUCT TYPE CHECK
    // =====================================================
    // Walk-In Order me sirf:
    // NEW
    // REFURBISHED / REFURBISH
    // products show honge.
    //
    // RENTAL products ko completely hide kiya jayega.
    // =====================================================

    const isWalkInProduct = (product) => {

        if (!product) {
            return false;
        }

        const productType = String(
            product.productType ??
            product.type ??
            product.product_type ??
            product.productCategoryType ??
            product.itemType ??
            ""
        )
            .trim()
            .toUpperCase();

        // =================================================
        // NEW PRODUCT
        // =================================================

        if (
            productType === "NEW" ||
            productType === "NEW_PRODUCT"
        ) {
            return true;
        }

        // =================================================
        // REFURBISHED PRODUCT
        // =================================================

        if (
            productType === "REFURBISHED" ||
            productType === "REFURBISH" ||
            productType === "REFURB" ||
            productType === "REFURBISHED_PRODUCT"
        ) {
            return true;
        }

        // =================================================
        // EVERYTHING ELSE INCLUDING RENTAL = HIDE
        // =================================================

        return false;
    };

    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {

        try {

            setLoading(true);

            console.log(
                "Loading products for Walk-In..."
            );

            const data = await getProducts();

            console.log(
                "WALK-IN ALL PRODUCTS:",
                data
            );

            // =================================================
            // GET PRODUCT ARRAY
            // =================================================

            const allProducts = Array.isArray(data)
                ? data
                : data?.products ||
                  data?.data ||
                  [];

            // =================================================
            // ONLY NEW + REFURBISHED
            // RENTAL WILL NOT SHOW
            // =================================================

            const walkInProducts = allProducts.filter(
                (product) => {

                    const type = String(
                        product?.productType ??
                        product?.type ??
                        product?.product_type ??
                        product?.productCategoryType ??
                        product?.itemType ??
                        ""
                    )
                        .trim()
                        .toUpperCase();

                    console.log(
                        "WALK-IN PRODUCT TYPE:",
                        product?.name,
                        type
                    );

                    return isWalkInProduct(product);
                }
            );

            console.log(
                "WALK-IN ALLOWED PRODUCTS:",
                walkInProducts
            );

            setProducts(
                walkInProducts
            );

            setFilteredProducts(
                walkInProducts
            );

        } catch (err) {

            console.error(
                "PRODUCT LOAD ERROR:",
                err
            );

            setProducts([]);
            setFilteredProducts([]);

            toast.error(
                err?.response?.data?.message ||
                "Unable to load products"
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // GET STOCK
    // =====================================================

    const getStock = (product) => {

        return Number(
            product.inventory?.currentStock ??
            product.currentStock ??
            product.availableStock ??
            product.stock ??
            0
        );
    };

    // =====================================================
    // SEARCH PRODUCT
    // =====================================================

    useEffect(() => {

        const value = search
            .trim()
            .toLowerCase();

        if (!value) {

            setFilteredProducts(
                products
            );

            return;
        }

        const result = products.filter(
            (product) => {

                const name = String(
                    product.name || ""
                ).toLowerCase();

                const sku = String(
                    product.sku || ""
                ).toLowerCase();

                return (
                    name.includes(value) ||
                    sku.includes(value)
                );
            }
        );

        setFilteredProducts(result);

    }, [
        search,
        products
    ]);

    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const addProduct = (product) => {

        // =================================================
        // SAFETY CHECK
        // =================================================
        // Agar kisi reason se rental product frontend
        // tak aa bhi jaye to cart me add nahi hoga.
        // =================================================

        if (!isWalkInProduct(product)) {

            toast.error(
                "Rental products cannot be added to Walk-In Order."
            );

            return;
        }

        const currentStock = Number(
            product.inventory?.currentStock ??
            product.currentStock ??
            product.availableStock ??
            product.stock ??
            0
        );

        const reservedStock = Number(
            product.inventory?.reservedStock ??
            product.reservedStock ??
            0
        );

        const availableStock = Math.max(
            currentStock - reservedStock,
            0
        );

        // =================================================
        // OUT OF STOCK
        // =================================================

        if (availableStock <= 0) {

            toast.error(
                "This product is out of stock."
            );

            return;
        }

        // =================================================
        // CHECK CART
        // =================================================

        const existingItem = cart.find(
            (item) =>
                item.product === product._id
        );

        // =================================================
        // PRODUCT ALREADY IN CART
        // =================================================

        if (existingItem) {

            if (
                existingItem.quantity >=
                availableStock
            ) {

                toast.error(
                    `Only ${availableStock} item(s) available.`
                );

                return;
            }

            setCart(
                cart.map(
                    (item) =>
                        item.product === product._id
                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1,
                            }
                            : item
                )
            );

            return;
        }

        // =================================================
        // ADD NEW PRODUCT
        // =================================================

        const sellingPrice = Number(
            product.pricing?.sellingPrice ?? 0
        );

        setCart([
            ...cart,

            {
                product: product._id,

                title: product.name,

                sku: product.sku,

                quantity: 1,

                originalPrice:
                    sellingPrice,

                price:
                    sellingPrice,

                discountAmount: 0,

                imageUrl:
                    product.images?.[0]?.url || "",

                availableStock:
                    availableStock,
            },
        ]);
    };

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    const increaseQty = (id) => {

        const cartItem = cart.find(
            (item) =>
                item.product === id
        );

        if (!cartItem) {
            return;
        }

        if (
            cartItem.quantity >=
            cartItem.availableStock
        ) {

            toast.error(
                `Only ${cartItem.availableStock} item(s) available.`
            );

            return;
        }

        setCart(
            cart.map(
                (item) =>
                    item.product === id
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1,
                        }
                        : item
            )
        );
    };

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    const decreaseQty = (id) => {

        setCart(
            (currentCart) =>
                currentCart
                    .map(
                        (item) =>
                            item.product === id
                                ? {
                                    ...item,
                                    quantity:
                                        item.quantity - 1,
                                }
                                : item
                    )
                    .filter(
                        (item) =>
                            item.quantity > 0
                    )
        );
    };

    // =====================================================
    // REMOVE
    // =====================================================

    const removeItem = (id) => {

        setCart(
            (currentCart) =>
                currentCart.filter(
                    (item) =>
                        item.product !== id
                )
        );
    };

    // =====================================================
    // TOTAL
    // =====================================================

    const total = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    // =====================================================
    // CUSTOMER INPUT
    // =====================================================

    const handleCustomerChange = (e) => {

        setCustomer({
            ...customer,
            [e.target.name]:
                e.target.value,
        });
    };

    // =====================================================
    // CREATE WALK-IN ORDER + INVOICE
    // =====================================================

    const placeOrder = async () => {

        // =================================================
        // VALIDATE CART
        // =================================================

        if (cart.length === 0) {

            toast.error(
                "Please add at least one product"
            );

            return;
        }

        // =================================================
        // VALIDATE CUSTOMER
        // =================================================

        if (
            !customer.fullName ||
            !customer.phone
        ) {

            toast.error(
                "Customer Name and Phone are required"
            );

            return;
        }

        // =================================================
        // CHECK STOCK
        // =================================================

        for (const item of cart) {

            if (
                item.quantity >
                item.availableStock
            ) {

                toast.error(
                    `${item.title}: only ${item.availableStock} item(s) available`
                );

                return;
            }
        }

        // =================================================
        // PREPARE ORDER DATA
        // =================================================

        const orderData = {

            orderItems:
                cart.map(
                    (item) => ({

                        product:
                            item.product,

                        title:
                            item.title,

                        quantity:
                            Number(
                                item.quantity
                            ),

                        originalPrice:
                            Number(
                                item.originalPrice ||
                                item.price ||
                                0
                            ),

                        price:
                            Number(
                                item.price ||
                                0
                            ),

                        discountAmount:
                            Number(
                                item.discountAmount ||
                                0
                            ),

                        imageUrl:
                            item.imageUrl ||
                            "",
                    })
                ),

            shippingAddress: {

                fullName:
                    customer.fullName,

                phone:
                    customer.phone,

                addressLine:
                    customer.addressLine ||
                    "Walk In Customer",

                city:
                    customer.city ||
                    "",

                state:
                    customer.state ||
                    "",

                pincode:
                    customer.pincode ||
                    "",

                country:
                    customer.country ||
                    "India",

                landmark:
                    customer.landmark ||
                    "",
            },

            totalAmount:
                Number(total),

            paymentMethod,

            orderSource:
                "WALK_IN",
        };

        // =================================================
        // CREATE ORDER
        // =================================================

        try {

            setPlacingOrder(true);

            console.log(
                "WALK-IN ORDER DATA:",
                orderData
            );

            const res =
                await createWalkInOrder(
                    orderData
                );

            console.log(
                "WALK-IN ORDER RESPONSE:",
                res
            );

            // =============================================
            // GET CREATED ORDER
            // =============================================

            const createdOrder =
                res?.order ||
                res?.data?.order ||
                res?.data;

            console.log(
                "CREATED WALK-IN ORDER:",
                createdOrder
            );

            // =============================================
            // CHECK ORDER ID
            // =============================================

            const createdOrderId =
                createdOrder?._id ||
                createdOrder?.id;

            if (!createdOrderId) {

                console.error(
                    "Created order response does not contain order ID:",
                    res
                );

                throw new Error(
                    "Order created but Order ID was not returned."
                );
            }

            // =============================================
            // CREATE INVOICE
            // =============================================

            let createdInvoice = null;

            try {

                console.log(
                    "CREATING INVOICE FOR ORDER:",
                    createdOrderId
                );

                const invoiceResponse =
                    await createInvoice(
                        createdOrderId
                    );

                console.log(
                    "INVOICE RESPONSE:",
                    invoiceResponse
                );

                createdInvoice =
                    invoiceResponse?.data ||
                    invoiceResponse?.invoice ||
                    invoiceResponse;

                console.log(
                    "CREATED INVOICE:",
                    createdInvoice
                );

            } catch (
                invoiceError
            ) {

                // =========================================
                // IMPORTANT:
                // ORDER ALREADY CREATED.
                // DON'T BREAK WALK-IN FLOW.
                // =========================================

                console.error(
                    "INVOICE CREATION ERROR:",
                    invoiceError
                );

                toast.success(
                    invoiceError?.response?.data?.message ||
                    invoiceError?.message ||
                    "Order created successfully, but invoice could not be created."
                );
            }

            // =============================================
            // SHOW INVOICE
            // =============================================

            if (createdInvoice) {

                setInvoiceData(
                    createdInvoice
                );

            } else {

                // =========================================
                // FALLBACK
                // =========================================

                setInvoiceData(
                    createdOrder
                );
            }

            // =============================================
            // SUCCESS
            // =============================================

            toast.success(
                "Walk-In Order Created Successfully"
            );

            // =============================================
            // CLEAR CART
            // =============================================

            setCart([]);

            // =============================================
            // CLEAR CUSTOMER
            // =============================================

            setCustomer({

                fullName: "",

                phone: "",

                addressLine: "",

                city: "",

                state: "",

                pincode: "",

                country: "India",

                landmark: "",
            });

            // =============================================
            // REFRESH PRODUCTS / INVENTORY
            // =============================================

            await loadProducts();

        } catch (err) {

            console.error(
                "CREATE WALK-IN ORDER ERROR:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to create order"
            );

        } finally {

            setPlacingOrder(false);

        }
    };

    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="walkin-page">

            {/* ==========================================
                LEFT SIDE
            ========================================== */}

            <div className="left-side">

                <h2>
                    Product Search
                </h2>

                <input
                    type="text"
                    placeholder="Search product by Name or SKU..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="search-box"
                />

                {loading ? (

                    <p>
                        Loading products...
                    </p>

                ) : filteredProducts.length === 0 ? (

                    <p>
                        No products found
                    </p>

                ) : (

                    <div className="product-list">

                        {filteredProducts.map(
                            (product) => {

                                // =================================
                                // EXTRA SAFETY
                                // =================================
                                // Rental product kabhi bhi UI me
                                // accidentally aa jaye to render
                                // nahi hoga.
                                // =================================

                                if (
                                    !isWalkInProduct(
                                        product
                                    )
                                ) {
                                    return null;
                                }

                                const currentStock =
                                    Number(
                                        product.inventory?.currentStock ??
                                        product.currentStock ??
                                        product.availableStock ??
                                        product.stock ??
                                        0
                                    );

                                const reservedStock =
                                    Number(
                                        product.inventory?.reservedStock ??
                                        product.reservedStock ??
                                        0
                                    );

                                const availableStock =
                                    Math.max(
                                        currentStock -
                                        reservedStock,
                                        0
                                    );

                                const sellingPrice =
                                    Number(
                                        product.pricing?.sellingPrice ??
                                        0
                                    );

                                return (

                                    <div
                                        key={
                                            product._id
                                        }
                                        className="product-card"
                                    >

                                        {/* ==========================
                                            PRODUCT IMAGE
                                        ========================== */}

                                        <img
                                            src={
                                                product.images?.length
                                                    ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${product.images[0].url}`
                                                    : "/no-image.png"
                                            }
                                            alt={
                                                product.name
                                            }
                                        />

                                        {/* ==========================
                                            PRODUCT NAME
                                        ========================== */}

                                        <h4>
                                            {
                                                product.name
                                            }
                                        </h4>

                                        {/* ==========================
                                            SKU
                                        ========================== */}

                                        <p>
                                            SKU:{" "}
                                            {
                                                product.sku
                                            }
                                        </p>

                                        {/* ==========================
                                            PRODUCT TYPE
                                        ========================== */}

                                        <p>
                                            Type:{" "}
                                            {String(
                                                product.productType ??
                                                product.type ??
                                                product.product_type ??
                                                product.productCategoryType ??
                                                product.itemType ??
                                                ""
                                            ).toUpperCase()}
                                        </p>

                                        {/* ==========================
                                            STOCK
                                        ========================== */}

                                        <p>
                                            Stock:{" "}
                                            {
                                                availableStock
                                            }
                                        </p>

                                        {/* ==========================
                                            PRICE
                                        ========================== */}

                                        <h3>
                                            ₹{" "}
                                            {sellingPrice.toLocaleString(
                                                "en-IN"
                                            )}
                                        </h3>

                                        {/* ==========================
                                            ADD BUTTON
                                        ========================== */}

                                        <button
                                            type="button"
                                            disabled={
                                                availableStock <= 0
                                            }
                                            onClick={() =>
                                                addProduct(
                                                    product
                                                )
                                            }
                                        >

                                            {availableStock <= 0
                                                ? "Out of Stock"
                                                : "+ Add"}

                                        </button>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

            {/* ==========================================
                RIGHT SIDE
            ========================================== */}

            <div className="right-side">

                <h2>
                    Cart
                </h2>

                {cart.length === 0 ? (

                    <p>
                        No Product Added
                    </p>

                ) : (

                    cart.map(
                        (item) => (

                            <div
                                className="cart-item"
                                key={
                                    item.product
                                }
                            >

                                <div>

                                    <h4>
                                        {
                                            item.title
                                        }
                                    </h4>

                                    <p>
                                        SKU:{" "}
                                        {
                                            item.sku
                                        }
                                    </p>

                                    <p>
                                        ₹{" "}
                                        {item.price.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                    <small>
                                        Available:{" "}
                                        {
                                            item.availableStock
                                        }
                                    </small>

                                </div>

                                <div className="qty-box">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            decreaseQty(
                                                item.product
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>
                                        {
                                            item.quantity
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            increaseQty(
                                                item.product
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() =>
                                        removeItem(
                                            item.product
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    )
                )}

                <hr />

                <h3>
                    Grand Total: ₹{" "}
                    {total.toLocaleString(
                        "en-IN"
                    )}
                </h3>

                <hr />

                <h2>
                    Customer Details
                </h2>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Customer Name"
                    value={
                        customer.fullName
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={
                        customer.phone
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <input
                    type="text"
                    name="addressLine"
                    placeholder="Address"
                    value={
                        customer.addressLine
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={
                        customer.city
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={
                        customer.state
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={
                        customer.pincode
                    }
                    onChange={
                        handleCustomerChange
                    }
                />

                <select
                    value={
                        paymentMethod
                    }
                    onChange={(e) =>
                        setPaymentMethod(
                            e.target.value
                        )
                    }
                >

                    <option value="CASH">
                        Cash
                    </option>

                    <option value="CARD">
                        Card
                    </option>

                    <option value="UPI">
                        UPI
                    </option>

                </select>

                <button
                    type="button"
                    className="place-order-btn"
                    disabled={
                        placingOrder ||
                        cart.length === 0
                    }
                    onClick={
                        placeOrder
                    }
                >

                    {placingOrder
                        ? "Creating Order..."
                        : "Create Walk-In Order"}

                </button>

            </div>

            {/* ==========================================
                INVOICE
            ========================================== */}

            {invoiceData && (

                <WalkInInvoice
                    order={
                        invoiceData
                    }
                    onClose={() =>
                        setInvoiceData(
                            null
                        )
                    }
                />

            )}

        </div>
    );
}

export default NewWalkInOrder;