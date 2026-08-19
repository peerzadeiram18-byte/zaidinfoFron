// import React, {
//   useEffect,
//   useState,
// } from "react";

// import { toast } from "react-toastify";

// import {
//   getOffers,
//   createOffer,
//   updateOffer,
//   updateOfferStatus,
//   deleteOffer,
// } from "../../../services/offerService";

// import {
//   getProducts,
// } from "../../../services/productService";


// // =====================================================
// // COMPONENT
// // =====================================================

// const AdminOffers = () => {

//   // ===================================================
//   // STATES
//   // ===================================================

//   const [offers, setOffers] = useState([]);

//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [showModal, setShowModal] = useState(false);

//   const [editingOffer, setEditingOffer] =
//     useState(null);


//   // ===================================================
//   // FORM
//   // ===================================================

//   const [form, setForm] = useState({

//     title: "",

//     products: [],

//     discountType: "PERCENTAGE",

//     discountValue: "",

//     startDate: "",

//     endDate: "",

//     status: "ACTIVE",

//   });


//   // ===================================================
//   // LOAD DATA
//   // ===================================================

//   useEffect(() => {

//     loadData();

//   }, []);


//   const loadData = async () => {

//     try {

//       setLoading(true);

//       const [
//         offersRes,
//         productsRes,
//       ] = await Promise.all([

//         getOffers(),

//         getProducts(),

//       ]);


//       // -----------------------------------------------
//       // OFFERS
//       // -----------------------------------------------

//       const offerData =
//         Array.isArray(
//           offersRes.data?.data
//         )
//           ? offersRes.data.data
//           : Array.isArray(
//               offersRes.data
//             )
//           ? offersRes.data
//           : [];


//       // -----------------------------------------------
//       // PRODUCTS
//       // -----------------------------------------------

//       const productData =
//         Array.isArray(
//           productsRes.data?.data
//         )
//           ? productsRes.data.data
//           : Array.isArray(
//               productsRes.data
//             )
//           ? productsRes.data
//           : [];


//       setOffers(offerData);

//       setProducts(productData);

//     } catch (error) {

//       console.error(
//         "LOAD OFFER DATA ERROR:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to load offers"
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   // ===================================================
//   // FORM CHANGE
//   // ===================================================

//   const handleChange = (e) => {

//     const {
//       name,
//       value,
//     } = e.target;


//     setForm((prev) => ({

//       ...prev,

//       [name]: value,

//     }));

//   };


//   // ===================================================
//   // PRODUCT SELECT
//   // ===================================================

//   const handleProductSelect = (
//     productId
//   ) => {

//     setForm((prev) => {

//       const alreadySelected =
//         prev.products.includes(
//           productId
//         );


//       if (alreadySelected) {

//         return {

//           ...prev,

//           products:
//             prev.products.filter(
//               (id) =>
//                 id !== productId
//             ),

//         };

//       }


//       return {

//         ...prev,

//         products: [

//           ...prev.products,

//           productId,

//         ],

//       };

//     });

//   };


//   // ===================================================
//   // OPEN CREATE
//   // ===================================================

//   const openCreateModal = () => {

//     setEditingOffer(null);

//     setForm({

//       title: "",

//       products: [],

//       discountType: "PERCENTAGE",

//       discountValue: "",

//       startDate: "",

//       endDate: "",

//       status: "ACTIVE",

//     });

//     setShowModal(true);

//   };


//   // ===================================================
//   // OPEN EDIT
//   // ===================================================

//   const openEditModal = (offer) => {

//     setEditingOffer(offer);


//     setForm({

//       title:
//         offer.title ||
//         offer.name ||
//         "",

//       products:
//         Array.isArray(
//           offer.products
//         )
//           ? offer.products.map(
//               (product) =>
//                 typeof product ===
//                 "object"
//                   ? product._id
//                   : product
//             )
//           : [],

//       discountType:
//         offer.discountType ||
//         "PERCENTAGE",

//       discountValue:
//         offer.discountValue ??
//         "",

//       startDate:
//         offer.startDate
//           ? new Date(
//               offer.startDate
//             )
//               .toISOString()
//               .slice(0, 10)
//           : "",

//       endDate:
//         offer.endDate
//           ? new Date(
//               offer.endDate
//             )
//               .toISOString()
//               .slice(0, 10)
//           : "",

//       status:
//         offer.status ||
//         "ACTIVE",

//     });


//     setShowModal(true);

//   };


//   // ===================================================
//   // SUBMIT
//   // ===================================================

//   const handleSubmit = async (
//     e
//   ) => {

//     e.preventDefault();


//     // -----------------------------------------------
//     // VALIDATION
//     // -----------------------------------------------

//     if (!form.title.trim()) {

//       toast.error(
//         "Offer title is required"
//       );

//       return;

//     }


//     if (
//       form.products.length === 0
//     ) {

//       toast.error(
//         "Please select at least one product"
//       );

//       return;

//     }


//     if (
//       !form.discountValue ||
//       Number(form.discountValue) <= 0
//     ) {

//       toast.error(
//         "Enter a valid discount"
//       );

//       return;

//     }


//     if (!form.startDate) {

//       toast.error(
//         "Start date is required"
//       );

//       return;

//     }


//     if (!form.endDate) {

//       toast.error(
//         "End date is required"
//       );

//       return;

//     }


//     if (
//       new Date(form.endDate) <
//       new Date(form.startDate)
//     ) {

//       toast.error(
//         "End date cannot be before start date"
//       );

//       return;

//     }


//     try {

//       setSaving(true);


//       const payload = {

//         title:
//           form.title.trim(),

//         products:
//           form.products,

//         discountType:
//           form.discountType,

//         discountValue:
//           Number(
//             form.discountValue
//           ),

//         startDate:
//           form.startDate,

//         endDate:
//           form.endDate,

//         status:
//           form.status,

//       };


//       // ---------------------------------------------
//       // UPDATE
//       // ---------------------------------------------

//       if (editingOffer) {

//         await updateOffer(
//           editingOffer._id,
//           payload
//         );

//         toast.success(
//           "Offer updated successfully"
//         );

//       }

//       // ---------------------------------------------
//       // CREATE
//       // ---------------------------------------------

//       else {

//         await createOffer(
//           payload
//         );

//         toast.success(
//           "Offer created successfully"
//         );

//       }


//       setShowModal(false);

//       setEditingOffer(null);

//       await loadData();

//     } catch (error) {

//       console.error(
//         "SAVE OFFER ERROR:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to save offer"
//       );

//     } finally {

//       setSaving(false);

//     }

//   };


//   // ===================================================
//   // STATUS
//   // ===================================================

//   const handleStatus = async (
//     offer
//   ) => {

//     const newStatus =
//       offer.status === "ACTIVE"
//         ? "INACTIVE"
//         : "ACTIVE";


//     try {

//       await updateOfferStatus(
//         offer._id,
//         newStatus
//       );


//       toast.success(
//         `Offer ${newStatus.toLowerCase()}`
//       );


//       await loadData();

//     } catch (error) {

//       console.error(
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to update offer status"
//       );

//     }

//   };


//   // ===================================================
//   // DELETE
//   // ===================================================

//   const handleDelete = async (
//     offer
//   ) => {

//     const confirmDelete =
//       window.confirm(
//         `Delete offer "${offer.title || offer.name}"?`
//       );


//     if (!confirmDelete) {
//       return;
//     }


//     try {

//       await deleteOffer(
//         offer._id
//       );


//       toast.success(
//         "Offer deleted successfully"
//       );


//       await loadData();

//     } catch (error) {

//       console.error(
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to delete offer"
//       );

//     }

//   };


//   // ===================================================
//   // PRODUCT NAME
//   // ===================================================

//   const getProductName = (
//     productId
//   ) => {

//     const product =
//       products.find(
//         (item) =>
//           item._id === productId
//       );


//     return (
//       product?.name ||
//       "Unknown Product"
//     );

//   };


//   // ===================================================
//   // RENDER
//   // ===================================================

//   return (

//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

//         <div>

//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">

//             Offers

//           </h1>

//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">

//             Manage product offers and discounts

//           </p>

//         </div>


//         <button

//           onClick={
//             openCreateModal
//           }

//           className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"

//         >

//           + Add Offer

//         </button>

//       </div>


//       {/* =================================================
//           LOADING
//       ================================================= */}

//       {loading ? (

//         <div className="flex justify-center py-20">

//           <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />

//         </div>

//       ) : offers.length === 0 ? (

//         <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">

//           <div className="text-4xl mb-3">
//             🎁
//           </div>

//           <h2 className="font-bold text-gray-900 dark:text-white">

//             No Offers Yet

//           </h2>

//           <p className="text-sm text-gray-500 mt-1">

//             Create your first product offer.

//           </p>

//         </div>

//       ) : (

//         /* =================================================
//            TABLE
//         ================================================= */

//         <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">

//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead>

//                 <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">

//                   <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Offer

//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Products

//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Discount

//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Dates

//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Status

//                   </th>

//                   <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">

//                     Actions

//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {offers.map(
//                   (offer) => (

//                     <tr

//                       key={
//                         offer._id
//                       }

//                       className="border-b border-gray-100 dark:border-slate-800 last:border-0"

//                     >

//                       {/* OFFER */}

//                       <td className="px-5 py-4">

//                         <div className="font-bold text-gray-900 dark:text-white">

//                           {
//                             offer.title ||
//                             offer.name
//                           }

//                         </div>

//                       </td>


//                       {/* PRODUCTS */}

//                       <td className="px-5 py-4">

//                         <div className="flex flex-wrap gap-1 max-w-xs">

//                           {Array.isArray(
//                             offer.products
//                           ) &&

//                             offer.products
//                               .slice(0, 3)
//                               .map(
//                                 (
//                                   product,
//                                   index
//                                 ) => {

//                                   const id =
//                                     typeof product ===
//                                     "object"
//                                       ? product._id
//                                       : product;

//                                   const name =
//                                     typeof product ===
//                                     "object"
//                                       ? product.name
//                                       : getProductName(
//                                           id
//                                         );

//                                   return (

//                                     <span

//                                       key={
//                                         id ||
//                                         index
//                                       }

//                                       className="px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-md text-xs text-gray-700 dark:text-slate-300"

//                                     >

//                                       {name}

//                                     </span>

//                                   );

//                                 }
//                               )}

//                           {offer.products?.length >
//                             3 && (

//                             <span className="text-xs text-gray-500 px-2 py-1">

//                               +
//                               {offer.products.length -
//                                 3}

//                               more

//                             </span>

//                           )}

//                         </div>

//                       </td>


//                       {/* DISCOUNT */}

//                       <td className="px-5 py-4">

//                         <span className="font-bold text-indigo-600 dark:text-indigo-400">

//                           {
//                             offer.discountValue
//                           }

//                           {offer.discountType ===
//                           "PERCENTAGE"
//                             ? "%"
//                             : " ₹"}

//                         </span>

//                       </td>


//                       {/* DATE */}

//                       <td className="px-5 py-4">

//                         <div className="text-xs text-gray-600 dark:text-slate-400">

//                           {offer.startDate
//                             ? new Date(
//                                 offer.startDate
//                               ).toLocaleDateString(
//                                 "en-IN"
//                               )
//                             : "-"}

//                           {" → "}

//                           {offer.endDate
//                             ? new Date(
//                                 offer.endDate
//                               ).toLocaleDateString(
//                                 "en-IN"
//                               )
//                             : "-"}

//                         </div>

//                       </td>


//                       {/* STATUS */}

//                       <td className="px-5 py-4">

//                         <button

//                           onClick={() =>
//                             handleStatus(
//                               offer
//                             )
//                           }

//                           className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             offer.status ===
//                             "ACTIVE"

//                               ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"

//                               : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
//                           }`}

//                         >

//                           {offer.status ===
//                           "ACTIVE"
//                             ? "ACTIVE"
//                             : "INACTIVE"}

//                         </button>

//                       </td>


//                       {/* ACTIONS */}

//                       <td className="px-5 py-4">

//                         <div className="flex justify-end gap-2">

//                           <button

//                             onClick={() =>
//                               openEditModal(
//                                 offer
//                               )
//                             }

//                             className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold"

//                           >

//                             Edit

//                           </button>


//                           <button

//                             onClick={() =>
//                               handleDelete(
//                                 offer
//                               )
//                             }

//                             className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"

//                           >

//                             Delete

//                           </button>

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       )}


//       {/* =================================================
//           MODAL
//       ================================================= */}

//       {showModal && (

//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

//           <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">

//             {/* HEADER */}

//             <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-800">

//               <div>

//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">

//                   {editingOffer
//                     ? "Edit Offer"
//                     : "Create Offer"}

//                 </h2>

//                 <p className="text-xs text-gray-500 mt-1">

//                   Select products and configure discount

//                 </p>

//               </div>


//               <button

//                 onClick={() =>
//                   setShowModal(false)
//                 }

//                 className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"

//               >

//                 ×

//               </button>

//             </div>


//             {/* FORM */}

//             <form
//               onSubmit={
//                 handleSubmit
//               }
//               className="p-6 space-y-5"
//             >

//               {/* TITLE */}

//               <div>

//                 <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                   Offer Title

//                 </label>

//                 <input

//                   type="text"

//                   name="title"

//                   value={
//                     form.title
//                   }

//                   onChange={
//                     handleChange
//                   }

//                   placeholder="Summer Sale"

//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"

//                 />

//               </div>


//               {/* PRODUCTS */}

//               <div>

//                 <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                   Select Products

//                 </label>


//                 <div className="max-h-52 overflow-y-auto border border-gray-300 dark:border-slate-700 rounded-xl p-3 space-y-2">

//                   {products.length ===
//                   0 ? (

//                     <p className="text-sm text-gray-500">

//                       No products found.

//                     </p>

//                   ) : (

//                     products.map(
//                       (product) => (

//                         <label

//                           key={
//                             product._id
//                           }

//                           className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"

//                         >

//                           <input

//                             type="checkbox"

//                             checked={form.products.includes(
//                               product._id
//                             )}

//                             onChange={() =>
//                               handleProductSelect(
//                                 product._id
//                               )
//                             }

//                             className="w-4 h-4"

//                           />


//                           <div className="flex-1">

//                             <p className="text-sm font-semibold text-gray-900 dark:text-white">

//                               {
//                                 product.name
//                               }

//                             </p>

//                             <p className="text-xs text-gray-500">

//                               SKU:{" "}

//                               {
//                                 product.sku ||
//                                 "-"
//                               }

//                               {" • "}

//                               ₹
//                               {
//                                 product.pricing?.sellingPrice ??
//                                 product.sellingPrice ??
//                                 0
//                               }

//                             </p>

//                           </div>

//                         </label>

//                       )
//                     )

//                   )}

//                 </div>

//                 <p className="text-xs text-gray-500 mt-2">

//                   Selected:{" "}

//                   {form.products.length}

//                 </p>

//               </div>


//               {/* DISCOUNT */}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 <div>

//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                     Discount Type

//                   </label>

//                   <select

//                     name="discountType"

//                     value={
//                       form.discountType
//                     }

//                     onChange={
//                       handleChange
//                     }

//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none"

//                   >

//                     <option value="PERCENTAGE">

//                       Percentage (%)

//                     </option>

//                     <option value="FIXED">

//                       Fixed Amount (₹)

//                     </option>

//                   </select>

//                 </div>


//                 <div>

//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                     Discount Value

//                   </label>

//                   <input

//                     type="number"

//                     name="discountValue"

//                     value={
//                       form.discountValue
//                     }

//                     onChange={
//                       handleChange
//                     }

//                     min="0"

//                     max={
//                       form.discountType ===
//                       "PERCENTAGE"
//                         ? "100"
//                         : undefined
//                     }

//                     placeholder={
//                       form.discountType ===
//                       "PERCENTAGE"
//                         ? "10"
//                         : "500"
//                     }

//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none"

//                   />

//                 </div>

//               </div>


//               {/* DATES */}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 <div>

//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                     Start Date

//                   </label>

//                   <input

//                     type="date"

//                     name="startDate"

//                     value={
//                       form.startDate
//                     }

//                     onChange={
//                       handleChange
//                     }

//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none"

//                   />

//                 </div>


//                 <div>

//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                     End Date

//                   </label>

//                   <input

//                     type="date"

//                     name="endDate"

//                     value={
//                       form.endDate
//                     }

//                     onChange={
//                       handleChange
//                     }

//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none"

//                   />

//                 </div>

//               </div>


//               {/* STATUS */}

//               <div>

//                 <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">

//                   Status

//                 </label>

//                 <select

//                   name="status"

//                   value={
//                     form.status
//                   }

//                   onChange={
//                     handleChange
//                   }

//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none"

//                 >

//                   <option value="ACTIVE">
//                     ACTIVE
//                   </option>

//                   <option value="INACTIVE">
//                     INACTIVE
//                   </option>

//                 </select>

//               </div>


//               {/* BUTTONS */}

//               <div className="flex justify-end gap-3 pt-3">

//                 <button

//                   type="button"

//                   onClick={() =>
//                     setShowModal(false)
//                   }

//                   className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold"

//                 >

//                   Cancel

//                 </button>


//                 <button

//                   type="submit"

//                   disabled={
//                     saving
//                   }

//                   className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold"

//                 >

//                   {saving
//                     ? "Saving..."
//                     : editingOffer
//                     ? "Update Offer"
//                     : "Create Offer"}

//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// };


// export default AdminOffers;








import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getOffers,
  createOffer,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
} from "../../../services/offerService";

import { getProducts } from "../../../services/productService";

import "./AdminOffers.css";

const EMPTY_FORM = {
  title: "",
  products: [],
  discountType: "PERCENTAGE",
  discountValue: "",
  startDate: "",
  endDate: "",
  status: "ACTIVE",
};

const AdminOffers = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [offersRes, productsRes] = await Promise.all([
        getOffers(),
        getProducts(),
      ]);

      // =================================================
      // IMPORTANT:
      // Backend response:
      //
      // {
      //   success: true,
      //   offers: [...]
      // }
      //
      // So we MUST read .offers
      // =================================================

      console.log("OFFERS API RESPONSE:", offersRes);

      const offersResponse = offersRes?.data;

    //   const offerData = Array.isArray(offersResponse?.offers)
    //     ? offersResponse.offers
    //     : Array.isArray(offersResponse?.data)
    //     ? offersResponse.data
    //     : Array.isArray(offersResponse)
    //     ? offersResponse
    //     : [];


    const offerData =
  Array.isArray(offersRes.data?.offers)
    ? offersRes.data.offers
    : Array.isArray(offersRes.data?.data)
    ? offersRes.data.data
    : Array.isArray(offersRes.data)
    ? offersRes.data
    : [];

      // =================================================
      // PRODUCTS
      // =================================================

      console.log("PRODUCTS API RESPONSE:", productsRes);

      const productsResponse = productsRes?.data;

      const productData = Array.isArray(productsResponse?.products)
        ? productsResponse.products
        : Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : Array.isArray(productsResponse)
        ? productsResponse
        : [];

      console.log("FINAL OFFERS:", offerData);
      console.log("FINAL PRODUCTS:", productData);

      setOffers(offerData);
      setProducts(productData);
    } catch (error) {
      console.error("LOAD OFFER DATA ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load offers"
      );

      setOffers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // PRODUCT SELECT
  // =====================================================

  const handleProductSelect = (productId) => {
    setForm((prev) => {
      const alreadySelected = prev.products.includes(productId);

      if (alreadySelected) {
        return {
          ...prev,
          products: prev.products.filter(
            (id) => id !== productId
          ),
        };
      }

      return {
        ...prev,
        products: [...prev.products, productId],
      };
    });
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setEditingOffer(null);

    setForm({
      ...EMPTY_FORM,
      products: [],
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingOffer(null);

    setForm({
      ...EMPTY_FORM,
      products: [],
    });
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditModal = (offer) => {
    setEditingOffer(offer);

    const productIds = Array.isArray(offer.products)
      ? offer.products
          .map((product) =>
            typeof product === "object"
              ? product?._id
              : product
          )
          .filter(Boolean)
      : [];

    setForm({
      title: offer.title || offer.name || "",

      products: productIds,

      discountType:
        offer.discountType || "PERCENTAGE",

      discountValue:
        offer.discountValue ??
        offer.discount ??
        "",

      startDate: offer.startDate
        ? new Date(offer.startDate)
            .toISOString()
            .slice(0, 10)
        : "",

      endDate: offer.endDate
        ? new Date(offer.endDate)
            .toISOString()
            .slice(0, 10)
        : "",

      status: offer.status || "ACTIVE",
    });

    setShowModal(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Offer title is required");
      return;
    }

    if (form.products.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (
      !form.discountValue ||
      Number(form.discountValue) <= 0
    ) {
      toast.error("Enter a valid discount");
      return;
    }

    if (
      form.discountType === "PERCENTAGE" &&
      Number(form.discountValue) > 100
    ) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!form.endDate) {
      toast.error("End date is required");
      return;
    }

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
    ) {
      toast.error(
        "End date cannot be before start date"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),

        products: form.products,

        discountType: form.discountType,

        discountValue: Number(
          form.discountValue
        ),

        startDate: form.startDate,

        endDate: form.endDate,

        status: form.status,
      };

      console.log("OFFER PAYLOAD:", payload);

      // =================================================
      // UPDATE
      // =================================================

      if (editingOffer) {
        await updateOffer(
          editingOffer._id,
          payload
        );

        toast.success(
          "Offer updated successfully"
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        const response = await createOffer(payload);

        console.log(
          "CREATE OFFER RESPONSE:",
          response
        );

        toast.success(
          "Offer created successfully"
        );
      }

      closeModal();

      // =================================================
      // IMPORTANT
      // Reload from backend
      // =================================================

      await loadData();
    } catch (error) {
      console.error(
        "SAVE OFFER ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save offer"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatus = async (offer) => {
    const newStatus =
      offer.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {
      await updateOfferStatus(
        offer._id,
        newStatus
      );

      toast.success(
        `Offer ${newStatus.toLowerCase()}`
      );

      await loadData();
    } catch (error) {
      console.error(
        "STATUS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update offer status"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (offer) => {
    const confirmDelete = window.confirm(
      `Delete offer "${
        offer.title || offer.name
      }"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteOffer(offer._id);

      toast.success(
        "Offer deleted successfully"
      );

      await loadData();
    } catch (error) {
      console.error(
        "DELETE OFFER ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete offer"
      );
    }
  };

  // =====================================================
  // PRODUCT NAME
  // =====================================================

  const getProductName = (productId) => {
    const product = products.find(
      (item) =>
        String(item?._id) === String(productId)
    );

    return (
      product?.name ||
      product?.title ||
      "Unknown Product"
    );
  };

  // =====================================================
  // PRODUCT COUNT
  // =====================================================

  const getProductCount = (offer) => {
    return Array.isArray(offer?.products)
      ? offer.products.length
      : 0;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="offers-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="offers-header">

        <div>
          <h1>Offers</h1>

          <p>
            Manage product offers and discounts
          </p>
        </div>

        <button
          type="button"
          className="add-offer-btn"
          onClick={openCreateModal}
        >
          <span>+</span>
          Add Offer
        </button>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="offers-loading">
          <div className="offers-spinner" />
          <p>Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        /* =================================================
           EMPTY
        ================================================= */

        <div className="offers-empty">

          <div className="empty-icon">
            🎁
          </div>

          <h2>No Offers Yet</h2>

          <p>
            Create your first product offer.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="empty-add-btn"
          >
            + Create First Offer
          </button>

        </div>
      ) : (
        /* =================================================
           TABLE
        ================================================= */

        <div className="offers-card">

          <div className="offers-card-header">

            <div>
              <h2>All Offers</h2>

              <p>
                {offers.length}{" "}
                {offers.length === 1
                  ? "offer"
                  : "offers"}{" "}
                available
              </p>
            </div>

          </div>

          <div className="offers-table-wrapper">

            <table className="offers-table">

              <thead>
                <tr>

                  <th>Offer</th>

                  <th>Products</th>

                  <th>Discount</th>

                  <th>Start Date</th>

                  <th>End Date</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {offers.map((offer) => {

                  const offerProducts =
                    Array.isArray(
                      offer.products
                    )
                      ? offer.products
                      : [];

                  return (
                    <tr
                      key={offer._id}
                    >

                      {/* OFFER */}

                      <td>
                        <div className="offer-title">

                          {offer.title ||
                            offer.name ||
                            "Untitled Offer"}

                        </div>

                        {offer.description && (
                          <div className="offer-description">
                            {offer.description}
                          </div>
                        )}
                      </td>

                      {/* PRODUCTS */}

                      <td>

                        <div className="product-tags">

                          {offerProducts
                            .slice(0, 3)
                            .map(
                              (
                                product,
                                index
                              ) => {

                                const id =
                                  typeof product ===
                                  "object"
                                    ? product?._id
                                    : product;

                                const name =
                                  typeof product ===
                                  "object"
                                    ? product?.name ||
                                      product?.title ||
                                      "Product"
                                    : getProductName(
                                        id
                                      );

                                return (
                                  <span
                                    key={
                                      id ||
                                      index
                                    }
                                    className="product-tag"
                                  >
                                    {name}
                                  </span>
                                );
                              }
                            )}

                          {offerProducts.length >
                            3 && (
                            <span className="more-tag">
                              +
                              {offerProducts.length -
                                3}{" "}
                              more
                            </span>
                          )}

                          {offerProducts.length ===
                            0 && (
                            <span className="no-product">
                              No products
                            </span>
                          )}

                        </div>

                        <small className="product-count">
                          {getProductCount(
                            offer
                          )}{" "}
                          product
                          {getProductCount(
                            offer
                          ) !== 1
                            ? "s"
                            : ""}
                        </small>

                      </td>

                      {/* DISCOUNT */}

                      <td>

                        <span className="discount-badge">

                          {offer.discountType ===
                          "PERCENTAGE"
                            ? `${offer.discountValue}%`
                            : `₹${offer.discountValue}`}

                        </span>

                      </td>

                      {/* START */}

                      <td>

                        <span className="date-text">

                          {offer.startDate
                            ? new Date(
                                offer.startDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </span>

                      </td>

                      {/* END */}

                      <td>

                        <span className="date-text">

                          {offer.endDate
                            ? new Date(
                                offer.endDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatus(
                              offer
                            )
                          }
                          className={`status-btn ${
                            offer.status ===
                            "ACTIVE"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >

                          <span className="status-dot" />

                          {offer.status ===
                          "ACTIVE"
                            ? "ACTIVE"
                            : "INACTIVE"}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              openEditModal(
                                offer
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                offer
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="offer-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="offer-modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>
                <h2>
                  {editingOffer
                    ? "Edit Offer"
                    : "Create Offer"}
                </h2>

                <p>
                  Select products and configure
                  your offer
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="offer-form"
            >

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Offer Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Summer Sale"
                />

              </div>

              {/* PRODUCTS */}

              <div className="form-group">

                <div className="label-row">

                  <label>
                    Select Products
                  </label>

                  <span>
                    Selected:{" "}
                    {form.products.length}
                  </span>

                </div>

                <div className="products-selector">

                  {products.length === 0 ? (
                    <div className="no-products">
                      No products found.
                    </div>
                  ) : (
                    products.map(
                      (product) => {

                        const productId =
                          product?._id;

                        const selected =
                          form.products.includes(
                            productId
                          );

                        const price =
                          product?.pricing
                            ?.sellingPrice ??
                          product?.sellingPrice ??
                          0;

                        return (
                          <label
                            key={
                              productId
                            }
                            className={`product-option ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                          >

                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                handleProductSelect(
                                  productId
                                )
                              }
                            />

                            <div className="product-option-info">

                              <strong>
                                {product?.name ||
                                  product?.title ||
                                  "Unnamed Product"}
                              </strong>

                              <span>
                                SKU:{" "}
                                {product?.sku ||
                                  "-"}
                                {" • "}
                                ₹{price}
                              </span>

                            </div>

                          </label>
                        );
                      }
                    )
                  )}

                </div>

              </div>

              {/* DISCOUNT */}

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Discount Type
                  </label>

                  <select
                    name="discountType"
                    value={
                      form.discountType
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="PERCENTAGE">
                      Percentage (%)
                    </option>

                    <option value="FIXED">
                      Fixed Amount (₹)
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Discount Value
                  </label>

                  <input
                    type="number"
                    name="discountValue"
                    value={
                      form.discountValue
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    max={
                      form.discountType ===
                      "PERCENTAGE"
                        ? "100"
                        : undefined
                    }
                    placeholder={
                      form.discountType ===
                      "PERCENTAGE"
                        ? "10"
                        : "500"
                    }
                  />

                </div>

              </div>

              {/* DATES */}

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      form.startDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      form.endDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={
                    handleChange
                  }
                >

                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : editingOffer
                    ? "Update Offer"
                    : "Create Offer"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default AdminOffers;