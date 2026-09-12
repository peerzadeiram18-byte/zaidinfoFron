// import { useEffect, useRef, useState } from "react";

// import "./AddProduct.css";

// import { createProduct } from "../../../../services/productService";
// import { getCategories } from "../../../../services/categoryService";
// import { getBrands } from "../../../../services/brandService";

// import { toast } from "react-toastify";

// const AddProduct = () => {

//     // =====================================================
//     // STATES
//     // =====================================================

//     const [loading, setLoading] = useState(false);

//     const [categories, setCategories] = useState([]);

//     const [subcategories, setSubcategories] = useState([]);

//     const [brands, setBrands] = useState([]);

//     const [previewImages, setPreviewImages] = useState([]);

//     const fileInputRef = useRef(null);


//     // =====================================================
//     // FORM DATA
//     // =====================================================

//     const [formData, setFormData] = useState({

//         name: "",

//         category: "",

//         subcategory: "",

//         brand: "",

//         // =================================================
//         // PRODUCT TYPE
//         // =================================================

//         productType: "NEW",

//         // =================================================
//         // REFURBISHED DETAILS
//         // =================================================

//         refurbishedDetails: {

//             grade: "",

//             batteryHealth: "",

//             warrantyMonths: "",

//             testingStatus: ""

//         },

//         shortDescription: "",

//         description: "",

//         purchasePrice: "",

//         sellingPrice: "",

//         mrp: "",

//         discount: "",

//         gst: "",

//         images: []

//     });


//     // =====================================================
//     // LOAD CATEGORIES + BRANDS
//     // =====================================================

//     useEffect(() => {

//         loadCategories();

//         loadBrands();

//         return () => {

//             previewImages.forEach((url) => {

//                 URL.revokeObjectURL(url);

//             });

//         };

//     }, []);


//     // =====================================================
//     // LOAD CATEGORIES
//     // =====================================================

//     const loadCategories = async () => {

//         try {

//             const res = await getCategories();

//             console.log(
//                 "CATEGORY API RESPONSE:",
//                 res.data
//             );


//             const categoryData =

//                 Array.isArray(res.data)

//                     ? res.data

//                     : Array.isArray(res.data?.data)

//                         ? res.data.data

//                         : Array.isArray(res.data?.categories)

//                             ? res.data.categories

//                             : Array.isArray(
//                                 res.data?.data?.categories
//                             )

//                                 ? res.data.data.categories

//                                 : [];


//             console.log(
//                 "ALL CATEGORIES:",
//                 categoryData
//             );


//             setCategories(categoryData);

//         }

//         catch (error) {

//             console.error(
//                 "CATEGORY ERROR:",
//                 error
//             );

//             setCategories([]);

//             toast.error(
//                 "Failed to load categories"
//             );

//         }

//     };


//     // =====================================================
//     // LOAD BRANDS
//     // =====================================================

//     const loadBrands = async () => {

//         try {

//             const res = await getBrands();

//             console.log(
//                 "BRAND API RESPONSE:",
//                 res.data
//             );


//             const brandData =

//                 Array.isArray(res.data)

//                     ? res.data

//                     : Array.isArray(res.data?.data)

//                         ? res.data.data

//                         : Array.isArray(res.data?.brands)

//                             ? res.data.brands

//                             : Array.isArray(
//                                 res.data?.data?.brands
//                             )

//                                 ? res.data.data.brands

//                                 : [];


//             console.log(
//                 "ALL BRANDS:",
//                 brandData
//             );


//             setBrands(brandData);

//         }

//         catch (error) {

//             console.error(
//                 "BRAND ERROR:",
//                 error
//             );

//             setBrands([]);

//             toast.error(
//                 "Failed to load brands"
//             );

//         }

//     };


//     // =====================================================
//     // GET PARENT CATEGORIES
//     // =====================================================

//     const getParentCategories = () => {

//         return categories.filter(
//             (category) => {

//                 return !category.parentCategory;

//             }
//         );

//     };


//     // =====================================================
//     // GET CHILDREN / SUBCATEGORIES
//     // =====================================================

//     const getSubcategoriesByParent = (
//         parentCategoryId
//     ) => {

//         if (!parentCategoryId) {

//             return [];

//         }


//         return categories.filter(
//             (category) => {

//                 const parent =
//                     category.parentCategory;


//                 if (!parent) {

//                     return false;

//                 }


//                 const parentId =

//                     typeof parent === "object"

//                         ? parent?._id

//                         : parent;


//                 return (
//                     String(parentId) ===
//                     String(parentCategoryId)
//                 );

//             }
//         );

//     };


//     // =====================================================
//     // CATEGORY CHANGE
//     // =====================================================

//     const handleCategoryChange = (e) => {

//         const parentCategoryId =
//             e.target.value;


//         console.log(
//             "SELECTED PARENT CATEGORY:",
//             parentCategoryId
//         );


//         setFormData((previous) => ({

//             ...previous,

//             category:
//                 parentCategoryId,

//             subcategory: ""

//         }));


//         if (!parentCategoryId) {

//             setSubcategories([]);

//             return;

//         }


//         const children =
//             getSubcategoriesByParent(
//                 parentCategoryId
//             );


//         console.log(
//             "FOUND SUBCATEGORIES:",
//             children
//         );


//         setSubcategories(children);

//     };


//     // =====================================================
//     // SUBCATEGORY CHANGE
//     // =====================================================

//     const handleSubcategoryChange = (e) => {

//         const subcategoryId =
//             e.target.value;


//         console.log(
//             "SELECTED SUBCATEGORY:",
//             subcategoryId
//         );


//         setFormData((previous) => ({

//             ...previous,

//             subcategory:
//                 subcategoryId

//         }));

//     };


//     // =====================================================
//     // NORMAL INPUT CHANGE
//     // =====================================================

//     const handleChange = (e) => {

//         const {
//             name,
//             value
//         } = e.target;


//         setFormData((previous) => ({

//             ...previous,

//             [name]: value

//         }));

//     };


//     // =====================================================
//     // PRODUCT TYPE CHANGE
//     // =====================================================

//     const handleProductTypeChange = (e) => {

//         const productType =
//             e.target.value;


//         setFormData((previous) => ({

//             ...previous,

//             productType,

//             // Reset refurbished details when NEW
//             refurbishedDetails:
//                 productType === "REFURBISHED"

//                     ? previous.refurbishedDetails

//                     : {

//                         grade: "",

//                         batteryHealth: "",

//                         warrantyMonths: "",

//                         testingStatus: ""

//                     }

//         }));

//     };


//     // =====================================================
//     // REFURBISHED DETAIL CHANGE
//     // =====================================================

//     const handleRefurbishedChange = (e) => {

//         const {
//             name,
//             value
//         } = e.target;


//         setFormData((previous) => ({

//             ...previous,

//             refurbishedDetails: {

//                 ...previous.refurbishedDetails,

//                 [name]: value

//             }

//         }));

//     };


//     // =====================================================
//     // IMAGE CHANGE
//     // =====================================================

//     const handleImageChange = (e) => {

//         const files = Array.from(
//             e.target.files || []
//         );


//         if (files.length === 0) {

//             setFormData((previous) => ({

//                 ...previous,

//                 images: []

//             }));

//             setPreviewImages([]);

//             return;

//         }


//         // Maximum 5 images

//         if (files.length > 5) {

//             toast.error(
//                 "You can upload maximum 5 images"
//             );

//             e.target.value = "";

//             return;

//         }


//         // File type

//         const invalidFile =
//             files.find(
//                 (file) =>
//                     !file.type.startsWith(
//                         "image/"
//                     )
//             );


//         if (invalidFile) {

//             toast.error(
//                 "Only image files are allowed"
//             );

//             e.target.value = "";

//             return;

//         }


//         // File size

//         const oversizedFile =
//             files.find(
//                 (file) =>
//                     file.size >
//                     5 * 1024 * 1024
//             );


//         if (oversizedFile) {

//             toast.error(
//                 "Each image must be less than 5MB"
//             );

//             e.target.value = "";

//             return;

//         }


//         // Revoke old previews

//         previewImages.forEach(
//             (url) => {

//                 URL.revokeObjectURL(url);

//             }
//         );


//         // Save images

//         setFormData((previous) => ({

//             ...previous,

//             images: files

//         }));


//         // Create previews

//         const preview =
//             files.map(
//                 (file) =>
//                     URL.createObjectURL(file)
//             );


//         setPreviewImages(preview);

//     };


//     // =====================================================
//     // SUBMIT
//     // =====================================================

//     const handleSubmit = async (e) => {

//         e.preventDefault();


//         // =================================================
//         // BASIC VALIDATION
//         // =================================================

//         if (!formData.name.trim()) {

//             toast.error(
//                 "Please enter product name"
//             );

//             return;

//         }


//         if (!formData.category) {

//             toast.error(
//                 "Please select category"
//             );

//             return;

//         }


//         if (!formData.brand) {

//             toast.error(
//                 "Please select brand"
//             );

//             return;

//         }


//         // =================================================
//         // REFURBISHED VALIDATION
//         // =================================================

//         if (
//             formData.productType ===
//             "REFURBISHED"
//         ) {

//             if (
//                 !formData.refurbishedDetails.grade
//             ) {

//                 toast.error(
//                     "Please select refurbished grade"
//                 );

//                 return;

//             }


//             if (
//                 formData.refurbishedDetails.batteryHealth ===
//                 ""
//             ) {

//                 toast.error(
//                     "Please enter battery health"
//                 );

//                 return;

//             }


//             const batteryHealth =
//                 Number(
//                     formData.refurbishedDetails
//                         .batteryHealth
//                 );


//             if (
//                 batteryHealth < 0 ||
//                 batteryHealth > 100
//             ) {

//                 toast.error(
//                     "Battery health must be between 0 and 100"
//                 );

//                 return;

//             }


//             if (
//                 formData.refurbishedDetails
//                     .warrantyMonths === ""
//             ) {

//                 toast.error(
//                     "Please enter warranty months"
//                 );

//                 return;

//             }


//             if (
//                 !formData.refurbishedDetails
//                     .testingStatus
//             ) {

//                 toast.error(
//                     "Please select testing status"
//                 );

//                 return;

//             }

//         }


//         // =================================================
//         // PRICE REQUIRED
//         // =================================================

//         if (!formData.sellingPrice) {

//             toast.error(
//                 "Please enter selling price"
//             );

//             return;

//         }


//         if (!formData.mrp) {

//             toast.error(
//                 "Please enter MRP"
//             );

//             return;

//         }


//         const purchasePrice =
//             Number(
//                 formData.purchasePrice || 0
//             );


//         const sellingPrice =
//             Number(
//                 formData.sellingPrice || 0
//             );


//         const mrp =
//             Number(
//                 formData.mrp || 0
//             );


//         const discount =
//             Number(
//                 formData.discount || 0
//             );


//         const gst =
//             Number(
//                 formData.gst || 0
//             );


//         // =================================================
//         // PRICE VALIDATION
//         // =================================================

//         if (purchasePrice < 0) {

//             toast.error(
//                 "Purchase price cannot be negative"
//             );

//             return;

//         }


//         if (sellingPrice < 0) {

//             toast.error(
//                 "Selling price cannot be negative"
//             );

//             return;

//         }


//         if (mrp < 0) {

//             toast.error(
//                 "MRP cannot be negative"
//             );

//             return;

//         }


//         if (
//             discount < 0 ||
//             discount > 100
//         ) {

//             toast.error(
//                 "Discount must be between 0 and 100"
//             );

//             return;

//         }


//         if (
//             gst < 0 ||
//             gst > 100
//         ) {

//             toast.error(
//                 "GST must be between 0 and 100"
//             );

//             return;

//         }


//         // =================================================
//         // CREATE PRODUCT
//         // =================================================

//         try {

//             setLoading(true);


//             const data =
//                 new FormData();


//             // =================================================
//             // BASIC INFORMATION
//             // =================================================

//             data.append(
//                 "name",
//                 formData.name.trim()
//             );


//             data.append(
//                 "category",
//                 formData.category
//             );


//             // =================================================
//             // SUBCATEGORY
//             // =================================================

//             if (formData.subcategory) {

//                 data.append(
//                     "subcategory",
//                     formData.subcategory
//                 );

//             }


//             // =================================================
//             // PRODUCT TYPE
//             // =================================================

//             data.append(
//                 "productType",
//                 formData.productType
//             );


//             // =================================================
//             // REFURBISHED DETAILS
//             // =================================================

//             if (
//                 formData.productType ===
//                 "REFURBISHED"
//             ) {

//                 const refurbishedDetails = {

//                     grade:
//                         formData.refurbishedDetails
//                             .grade,

//                     batteryHealth:
//                         Number(
//                             formData.refurbishedDetails
//                                 .batteryHealth
//                         ),

//                     warrantyMonths:
//                         Number(
//                             formData.refurbishedDetails
//                                 .warrantyMonths
//                         ),

//                     testingStatus:
//                         formData.refurbishedDetails
//                             .testingStatus

//                 };


//                 data.append(
//                     "refurbishedDetails",
//                     JSON.stringify(
//                         refurbishedDetails
//                     )
//                 );

//             }


//             // =================================================
//             // BRAND
//             // =================================================

//             data.append(
//                 "brand",
//                 formData.brand
//             );


//             // =================================================
//             // DESCRIPTION
//             // =================================================

//             data.append(
//                 "shortDescription",
//                 formData.shortDescription.trim()
//             );


//             data.append(
//                 "description",
//                 formData.description.trim()
//             );


//             // =================================================
//             // PRICING
//             // =================================================

//             const pricing = {

//                 purchasePrice,

//                 sellingPrice,

//                 mrp,

//                 discount,

//                 gst

//             };


//             data.append(
//                 "pricing",
//                 JSON.stringify(pricing)
//             );


//             // =================================================
//             // IMAGES
//             // =================================================

//             formData.images.forEach(
//                 (image) => {

//                     data.append(
//                         "images",
//                         image
//                     );

//                 }
//             );


//             // =================================================
//             // DEBUG
//             // =================================================

//             console.log(
//                 "======================================"
//             );

//             console.log(
//                 "CREATE PRODUCT"
//             );

//             console.log(
//                 "======================================"
//             );

//             console.log(
//                 "Product Name:",
//                 formData.name
//             );

//             console.log(
//                 "Parent Category:",
//                 formData.category
//             );

//             console.log(
//                 "Subcategory:",
//                 formData.subcategory
//             );

//             console.log(
//                 "Product Type:",
//                 formData.productType
//             );

//             console.log(
//                 "Refurbished Details:",
//                 formData.refurbishedDetails
//             );

//             console.log(
//                 "Brand:",
//                 formData.brand
//             );

//             console.log(
//                 "Pricing:",
//                 pricing
//             );

//             console.log(
//                 "Images:",
//                 formData.images
//             );


//             // =================================================
//             // FORMDATA DEBUG
//             // =================================================

//             for (
//                 const [key, value]
//                 of data.entries()
//             ) {

//                 console.log(
//                     "FORM DATA:",
//                     key,
//                     value
//                 );

//             }


//             // =================================================
//             // API
//             // =================================================

//             const response =
//                 await createProduct(data);


//             console.log(
//                 "CREATE PRODUCT SUCCESS:",
//                 response.data
//             );


//             // =================================================
//             // SUCCESS
//             // =================================================

//             toast.success(
//                 "Product Added Successfully"
//             );


//             // =================================================
//             // RESET
//             // =================================================

//             setFormData({

//                 name: "",

//                 category: "",

//                 subcategory: "",

//                 brand: "",

//                 productType: "NEW",

//                 refurbishedDetails: {

//                     grade: "",

//                     batteryHealth: "",

//                     warrantyMonths: "",

//                     testingStatus: ""

//                 },

//                 shortDescription: "",

//                 description: "",

//                 purchasePrice: "",

//                 sellingPrice: "",

//                 mrp: "",

//                 discount: "",

//                 gst: "",

//                 images: []

//             });


//             previewImages.forEach(
//                 (url) => {

//                     URL.revokeObjectURL(
//                         url
//                     );

//                 }
//             );


//             setPreviewImages([]);

//             setSubcategories([]);


//             // =================================================
//             // RESET FILE INPUT
//             // =================================================

//             if (
//                 fileInputRef.current
//             ) {

//                 fileInputRef.current.value =
//                     "";

//             }

//         }

//         catch (error) {

//             console.error(
//                 "======================================"
//             );

//             console.error(
//                 "CREATE PRODUCT ERROR"
//             );

//             console.error(
//                 "======================================"
//             );

//             console.error(
//                 error
//             );


//             console.error(
//                 "STATUS:",
//                 error.response?.status
//             );


//             console.error(
//                 "BACKEND RESPONSE:",
//                 error.response?.data
//             );


//             console.error(
//                 "BACKEND MESSAGE:",
//                 error.response?.data?.message
//             );


//             console.error(
//                 "BACKEND ERRORS:",
//                 error.response?.data?.errors
//             );


//             let backendMessage =

//                 error.response?.data?.message ||

//                 error.response?.data?.error ||

//                 "Failed to add product";


//             if (

//                 Array.isArray(
//                     error.response?.data?.errors
//                 )

//                 &&

//                 error.response.data.errors.length > 0

//             ) {

//                 backendMessage =
//                     error.response.data.errors.join(
//                         ", "
//                     );

//             }


//             toast.error(
//                 backendMessage
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <div className="add-product">


//             {/* =================================================
//                 HEADER
//             ================================================= */}

//             <div className="page-header">

//                 <h2>
//                     Add Product
//                 </h2>

//                 <p>
//                     Create New Product
//                 </p>

//             </div>


//             {/* =================================================
//                 FORM
//             ================================================= */}

//             <form
//                 className="product-form"
//                 onSubmit={handleSubmit}
//             >


//                 {/* =================================================
//                     BASIC INFORMATION
//                 ================================================= */}

//                 <div className="form-section">

//                     <h3>
//                         Basic Information
//                     </h3>


//                     <div className="form-grid">


//                         {/* PRODUCT NAME */}

//                         <div className="form-group">

//                             <label>
//                                 Product Name
//                             </label>

//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={
//                                     formData.name
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 placeholder="Enter Product Name"
//                                 required
//                             />

//                         </div>


//                         {/* =================================================
//                             PARENT CATEGORY
//                         ================================================= */}

//                         <div className="form-group">

//                             <label>
//                                 Category
//                             </label>

//                             <select
//                                 name="category"
//                                 value={
//                                     formData.category
//                                 }
//                                 onChange={
//                                     handleCategoryChange
//                                 }
//                                 required
//                             >

//                                 <option value="">
//                                     Select Category
//                                 </option>


//                                 {getParentCategories().map(
//                                     (category) => (

//                                         <option
//                                             key={
//                                                 category._id
//                                             }
//                                             value={
//                                                 category._id
//                                             }
//                                         >

//                                             {
//                                                 category.name
//                                             }

//                                         </option>

//                                     )
//                                 )}

//                             </select>

//                         </div>


//                         {/* =================================================
//                             SUBCATEGORY
//                         ================================================= */}

//                         <div className="form-group">

//                             <label>
//                                 Subcategory
//                             </label>

//                             <select
//                                 name="subcategory"
//                                 value={
//                                     formData.subcategory
//                                 }
//                                 onChange={
//                                     handleSubcategoryChange
//                                 }
//                                 disabled={
//                                     !formData.category ||
//                                     subcategories.length === 0
//                                 }
//                             >

//                                 <option value="">

//                                     {!formData.category

//                                         ? "Select Category First"

//                                         : subcategories.length === 0

//                                             ? "No Subcategories"

//                                             : "Select Subcategory"

//                                     }

//                                 </option>


//                                 {subcategories.map(
//                                     (subcategory) => (

//                                         <option
//                                             key={
//                                                 subcategory._id
//                                             }
//                                             value={
//                                                 subcategory._id
//                                             }
//                                         >

//                                             {
//                                                 subcategory.name
//                                             }

//                                         </option>

//                                     )
//                                 )}

//                             </select>


//                             {formData.category &&
//                                 subcategories.length === 0 && (

//                                     <small className="subcategory-help">

//                                         This category has no
//                                         subcategories.

//                                     </small>

//                                 )}

//                         </div>


//                         {/* =================================================
//                             BRAND
//                         ================================================= */}

//                         <div className="form-group">

//                             <label>
//                                 Brand
//                             </label>

//                             <select
//                                 name="brand"
//                                 value={
//                                     formData.brand
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                             >

//                                 <option value="">
//                                     Select Brand
//                                 </option>


//                                 {brands.map(
//                                     (brand) => (

//                                         <option
//                                             key={
//                                                 brand._id
//                                             }
//                                             value={
//                                                 brand._id
//                                             }
//                                         >

//                                             {
//                                                 brand.name
//                                             }

//                                         </option>

//                                     )
//                                 )}

//                             </select>

//                         </div>


//                         {/* =================================================
//                             PRODUCT TYPE
//                         ================================================= */}

//                         <div className="form-group">

//                             <label>
//                                 Product Type
//                             </label>

//                             <select
//                                 name="productType"
//                                 value={
//                                     formData.productType
//                                 }
//                                 onChange={
//                                     handleProductTypeChange
//                                 }
//                             >

//                                 <option value="NEW">
//                                     New Product
//                                 </option>

//                                 <option value="REFURBISHED">
//                                     Refurbished Product
//                                 </option>

//                             </select>

//                         </div>

//                     </div>

//                 </div>


//                 {/* =================================================
//                     REFURBISHED DETAILS
//                 ================================================= */}

//                 {formData.productType ===
//                     "REFURBISHED" && (

//                     <div className="form-section">

//                         <h3>
//                             Refurbished Product Details
//                         </h3>


//                         <div className="form-grid">


//                             {/* GRADE */}

//                             <div className="form-group">

//                                 <label>
//                                     Refurbished Grade
//                                 </label>

//                                 <select
//                                     name="grade"
//                                     value={
//                                         formData
//                                             .refurbishedDetails
//                                             .grade
//                                     }
//                                     onChange={
//                                         handleRefurbishedChange
//                                     }
//                                     required
//                                 >

//                                     <option value="">
//                                         Select Grade
//                                     </option>

//                                     <option value="A+">
//                                         A+ - Excellent
//                                     </option>

//                                     <option value="A">
//                                         A - Very Good
//                                     </option>

//                                     <option value="B">
//                                         B - Good
//                                     </option>

//                                     <option value="C">
//                                         C - Fair
//                                     </option>

//                                 </select>

//                             </div>


//                             {/* BATTERY HEALTH */}

//                             <div className="form-group">

//                                 <label>
//                                     Battery Health (%)
//                                 </label>

//                                 <input
//                                     type="number"
//                                     name="batteryHealth"
//                                     value={
//                                         formData
//                                             .refurbishedDetails
//                                             .batteryHealth
//                                     }
//                                     onChange={
//                                         handleRefurbishedChange
//                                     }
//                                     min="0"
//                                     max="100"
//                                     step="1"
//                                     placeholder="Example: 85"
//                                     required
//                                 />

//                             </div>


//                             {/* WARRANTY */}

//                             <div className="form-group">

//                                 <label>
//                                     Warranty (Months)
//                                 </label>

//                                 <input
//                                     type="number"
//                                     name="warrantyMonths"
//                                     value={
//                                         formData
//                                             .refurbishedDetails
//                                             .warrantyMonths
//                                     }
//                                     onChange={
//                                         handleRefurbishedChange
//                                     }
//                                     min="0"
//                                     step="1"
//                                     placeholder="Example: 6"
//                                     required
//                                 />

//                             </div>


//                             {/* TESTING STATUS */}

//                             <div className="form-group">

//                                 <label>
//                                     Testing Status
//                                 </label>

//                                 <select
//                                     name="testingStatus"
//                                     value={
//                                         formData
//                                             .refurbishedDetails
//                                             .testingStatus
//                                     }
//                                     onChange={
//                                         handleRefurbishedChange
//                                     }
//                                     required
//                                 >

//                                     <option value="">
//                                         Select Testing Status
//                                     </option>

//                                     <option value="TESTED">
//                                         Tested
//                                     </option>

//                                     <option value="NOT_TESTED">
//                                         Not Tested
//                                     </option>

//                                 </select>

//                             </div>

//                         </div>

//                     </div>

//                 )}


//                 {/* =================================================
//                     DESCRIPTION
//                 ================================================= */}

//                 <div className="form-section">

//                     <h3>
//                         Description
//                     </h3>


//                     <div className="form-group">

//                         <label>
//                             Short Description
//                         </label>

//                         <textarea
//                             name="shortDescription"
//                             value={
//                                 formData.shortDescription
//                             }
//                             onChange={
//                                 handleChange
//                             }
//                             rows={3}
//                             placeholder="Enter short description"
//                         />

//                     </div>


//                     <div className="form-group">

//                         <label>
//                             Description
//                         </label>

//                         <textarea
//                             name="description"
//                             value={
//                                 formData.description
//                             }
//                             onChange={
//                                 handleChange
//                             }
//                             rows={8}
//                             placeholder="Enter product description"
//                         />

//                     </div>

//                 </div>


//                 {/* =================================================
//                     PRICING
//                 ================================================= */}

//                 <div className="form-section">

//                     <h3>
//                         Pricing
//                     </h3>


//                     <div className="form-grid">


//                         {/* PURCHASE PRICE */}

//                         <div className="form-group">

//                             <label>
//                                 Purchase Price
//                             </label>

//                             <input
//                                 type="number"
//                                 name="purchasePrice"
//                                 value={
//                                     formData.purchasePrice
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 min="0"
//                                 step="0.01"
//                             />

//                         </div>


//                         {/* SELLING PRICE */}

//                         <div className="form-group">

//                             <label>
//                                 Selling Price
//                             </label>

//                             <input
//                                 type="number"
//                                 name="sellingPrice"
//                                 value={
//                                     formData.sellingPrice
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 min="0"
//                                 step="0.01"
//                                 required
//                             />

//                         </div>


//                         {/* MRP */}

//                         <div className="form-group">

//                             <label>
//                                 MRP
//                             </label>

//                             <input
//                                 type="number"
//                                 name="mrp"
//                                 value={
//                                     formData.mrp
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 min="0"
//                                 step="0.01"
//                                 required
//                             />

//                         </div>


//                         {/* DISCOUNT */}

//                         <div className="form-group">

//                             <label>
//                                 Discount (%)
//                             </label>

//                             <input
//                                 type="number"
//                                 name="discount"
//                                 value={
//                                     formData.discount
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 min="0"
//                                 max="100"
//                                 step="0.01"
//                             />

//                         </div>


//                         {/* GST */}

//                         <div className="form-group">

//                             <label>
//                                 GST (%)
//                             </label>

//                             <input
//                                 type="number"
//                                 name="gst"
//                                 value={
//                                     formData.gst
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 min="0"
//                                 max="100"
//                                 step="0.01"
//                             />

//                         </div>

//                     </div>

//                 </div>


//                 {/* =================================================
//                     PRODUCT IMAGES
//                 ================================================= */}

//                 <div className="form-section">

//                     <h3>
//                         Product Images
//                     </h3>


//                     <div className="form-group">

//                         <input
//                             ref={
//                                 fileInputRef
//                             }
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={
//                                 handleImageChange
//                             }
//                         />

//                     </div>


//                     {previewImages.length > 0 && (

//                         <div className="image-preview">

//                             {previewImages.map(
//                                 (
//                                     image,
//                                     index
//                                 ) => (

//                                     <img
//                                         key={index}
//                                         src={image}
//                                         alt={`Preview ${
//                                             index + 1
//                                         }`}
//                                         className="preview-img"
//                                     />

//                                 )
//                             )}

//                         </div>

//                     )}

//                 </div>


//                 {/* =================================================
//                     SUBMIT
//                 ================================================= */}

//                 <div className="submit-section">

//                     <button
//                         type="submit"
//                         className="submit-btn"
//                         disabled={loading}
//                     >

//                         {loading

//                             ? "Saving Product..."

//                             : "Save Product"

//                         }

//                     </button>

//                 </div>

//             </form>

//         </div>

//     );

// };


// export default AddProduct;



import { useEffect, useRef, useState } from "react";

import "./AddProduct.css";

import { createProduct } from "../../../../services/productService";
import { getCategories } from "../../../../services/categoryService";
import { getBrands } from "../../../../services/brandService";

import { toast } from "react-toastify";

const AddProduct = () => {
    // =====================================================
    // STATES
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [subcategories, setSubcategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const fileInputRef = useRef(null);

    // =====================================================
    // EMPTY OBJECTS
    // =====================================================

    const emptyRefurbishedDetails = {
        grade: "",
        batteryHealth: "",
        warrantyMonths: "",
        testingStatus: "",
    };

    const emptyRentalDetails = {
        isAvailableForRent: false,
        monthlyRent: "",
        securityDeposit: "",
        minimumRentalMonths: 3,
        gst: "",
        availableQuantity: 1,
        basicSoftwareInstalled: true,
        includedItems: [
            "LAPTOP",
            "CHARGING_ADAPTER",
            "BACKPACK",
        ],
        notes: "",
    };

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",

        category: "",

        subcategory: "",

        brand: "",

        // PRODUCT TYPE
        productType: "NEW",

        // REFURBISHED
        refurbishedDetails: {
            ...emptyRefurbishedDetails,
        },

        // RENTAL
        rental: {
            ...emptyRentalDetails,
        },

        // DESCRIPTION
        shortDescription: "",

        description: "",

        // PRICING
        purchasePrice: "",

        sellingPrice: "",

        mrp: "",

        discount: "",

        gst: "",

        // IMAGES
        images: [],
    });

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadCategories();
        loadBrands();

        return () => {
            previewImages.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {
        try {
            const res = await getCategories();

            console.log("CATEGORY API RESPONSE:", res.data);

            const categoryData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.categories)
                ? res.data.categories
                : Array.isArray(res.data?.data?.categories)
                ? res.data.data.categories
                : [];

            console.log("ALL CATEGORIES:", categoryData);

            setCategories(categoryData);
        } catch (error) {
            console.error("CATEGORY ERROR:", error);

            setCategories([]);

            toast.error("Failed to load categories");
        }
    };

    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {
        try {
            const res = await getBrands();

            console.log("BRAND API RESPONSE:", res.data);

            const brandData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.brands)
                ? res.data.brands
                : Array.isArray(res.data?.data?.brands)
                ? res.data.data.brands
                : [];

            console.log("ALL BRANDS:", brandData);

            setBrands(brandData);
        } catch (error) {
            console.error("BRAND ERROR:", error);

            setBrands([]);

            toast.error("Failed to load brands");
        }
    };

    // =====================================================
    // GET PARENT CATEGORIES
    // =====================================================

    const getParentCategories = () => {
        return categories.filter(
            (category) => !category.parentCategory
        );
    };

    // =====================================================
    // GET SUBCATEGORIES
    // =====================================================

    const getSubcategoriesByParent = (parentCategoryId) => {
        if (!parentCategoryId) {
            return [];
        }

        return categories.filter((category) => {
            const parent = category.parentCategory;

            if (!parent) {
                return false;
            }

            const parentId =
                typeof parent === "object"
                    ? parent?._id
                    : parent;

            return (
                String(parentId) ===
                String(parentCategoryId)
            );
        });
    };

    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange = (e) => {
        const parentCategoryId = e.target.value;

        console.log(
            "SELECTED PARENT CATEGORY:",
            parentCategoryId
        );

        setFormData((previous) => ({
            ...previous,

            category: parentCategoryId,

            subcategory: "",
        }));

        if (!parentCategoryId) {
            setSubcategories([]);

            return;
        }

        const children =
            getSubcategoriesByParent(
                parentCategoryId
            );

        console.log(
            "FOUND SUBCATEGORIES:",
            children
        );

        setSubcategories(children);
    };

    // =====================================================
    // SUBCATEGORY CHANGE
    // =====================================================

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;

        console.log(
            "SELECTED SUBCATEGORY:",
            subcategoryId
        );

        setFormData((previous) => ({
            ...previous,

            subcategory: subcategoryId,
        }));
    };

    // =====================================================
    // NORMAL INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,

            [name]: value,
        }));
    };

    // =====================================================
    // PRODUCT TYPE CHANGE
    // =====================================================

    const handleProductTypeChange = (e) => {
        const productType = e.target.value;

        console.log(
            "PRODUCT TYPE:",
            productType
        );

        setFormData((previous) => ({
            ...previous,

            productType,

            // REFURBISHED DATA
            refurbishedDetails:
                productType === "REFURBISHED"
                    ? previous.refurbishedDetails
                    : {
                        ...emptyRefurbishedDetails,
                    },

            // RENTAL DATA
            rental:
                productType === "RENTAL"
                    ? {
                        ...previous.rental,

                        isAvailableForRent:
                            true,
                    }
                    : previous.rental,
        }));
    };

    // =====================================================
    // REFURBISHED CHANGE
    // =====================================================

    const handleRefurbishedChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,

            refurbishedDetails: {
                ...previous.refurbishedDetails,

                [name]: value,
            },
        }));
    };

    // =====================================================
    // RENTAL CHANGE
    // IMPORTANT
    // Supports:
    // handleRentalChange("monthlyRent", value)
    // handleRentalChange("basicSoftwareInstalled", true)
    // =====================================================

    const handleRentalChange = (
        name,
        value
    ) => {
        setFormData((previous) => ({
            ...previous,

            rental: {
                ...previous.rental,

                [name]: value,
            },
        }));
    };

    // =====================================================
    // RENTAL INCLUDED ITEM
    // =====================================================

    const handleRentalItemChange = (item) => {
        setFormData((previous) => {
            const currentItems =
                previous.rental.includedItems || [];

            const exists =
                currentItems.includes(item);

            const updatedItems = exists
                ? currentItems.filter(
                    (value) => value !== item
                )
                : [
                    ...currentItems,
                    item,
                ];

            return {
                ...previous,

                rental: {
                    ...previous.rental,

                    includedItems:
                        updatedItems,
                },
            };
        });
    };

    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {
        const files = Array.from(
            e.target.files || []
        );

        if (files.length === 0) {
            setFormData((previous) => ({
                ...previous,

                images: [],
            }));

            previewImages.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            setPreviewImages([]);

            return;
        }

        // MAX 5
        if (files.length > 5) {
            toast.error(
                "You can upload maximum 5 images"
            );

            e.target.value = "";

            return;
        }

        // IMAGE TYPE
        const invalidFile = files.find(
            (file) =>
                !file.type.startsWith("image/")
        );

        if (invalidFile) {
            toast.error(
                "Only image files are allowed"
            );

            e.target.value = "";

            return;
        }

        // IMAGE SIZE
        const oversizedFile = files.find(
            (file) =>
                file.size >
                5 * 1024 * 1024
        );

        if (oversizedFile) {
            toast.error(
                "Each image must be less than 5MB"
            );

            e.target.value = "";

            return;
        }

        // REVOKE OLD PREVIEWS
        previewImages.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        // SAVE FILES
        setFormData((previous) => ({
            ...previous,

            images: files,
        }));

        // CREATE PREVIEWS
        const preview = files.map(
            (file) =>
                URL.createObjectURL(file)
        );

        setPreviewImages(preview);
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!formData.name.trim()) {
            toast.error(
                "Please enter product name"
            );

            return;
        }

        if (!formData.category) {
            toast.error(
                "Please select category"
            );

            return;
        }

        if (!formData.brand) {
            toast.error(
                "Please select brand"
            );

            return;
        }

        if (!formData.productType) {
            toast.error(
                "Please select product type"
            );

            return;
        }

        // =================================================
        // REFURBISHED VALIDATION
        // =================================================

        if (
            formData.productType ===
            "REFURBISHED"
        ) {
            const details =
                formData.refurbishedDetails;

            if (!details.grade) {
                toast.error(
                    "Please select refurbished grade"
                );

                return;
            }

            if (
                details.batteryHealth === ""
            ) {
                toast.error(
                    "Please enter battery health"
                );

                return;
            }

            const batteryHealth =
                Number(
                    details.batteryHealth
                );

            if (
                !Number.isFinite(
                    batteryHealth
                ) ||
                batteryHealth < 0 ||
                batteryHealth > 100
            ) {
                toast.error(
                    "Battery health must be between 0 and 100"
                );

                return;
            }

            if (
                details.warrantyMonths === ""
            ) {
                toast.error(
                    "Please enter warranty months"
                );

                return;
            }

            const warrantyMonths =
                Number(
                    details.warrantyMonths
                );

            if (
                !Number.isFinite(
                    warrantyMonths
                ) ||
                warrantyMonths < 0
            ) {
                toast.error(
                    "Warranty months cannot be negative"
                );

                return;
            }

            if (!details.testingStatus) {
                toast.error(
                    "Please select testing status"
                );

                return;
            }
        }

        // =================================================
        // RENTAL VALIDATION
        // =================================================

        if (
            formData.productType ===
            "RENTAL"
        ) {
            const monthlyRent =
                Number(
                    formData.rental
                        .monthlyRent || 0
                );

            const securityDeposit =
                Number(
                    formData.rental
                        .securityDeposit || 0
                );

            const minimumRentalMonths =
                Number(
                    formData.rental
                        .minimumRentalMonths || 0
                );

            const rentalGst =
                Number(
                    formData.rental.gst || 0
                );

            const availableQuantity =
                Number(
                    formData.rental
                        .availableQuantity || 0
                );

            if (
                !Number.isFinite(
                    monthlyRent
                ) ||
                monthlyRent <= 0
            ) {
                toast.error(
                    "Please enter valid monthly rent"
                );

                return;
            }

            if (
                !Number.isFinite(
                    securityDeposit
                ) ||
                securityDeposit < 0
            ) {
                toast.error(
                    "Security deposit cannot be negative"
                );

                return;
            }

            if (
                !Number.isInteger(
                    minimumRentalMonths
                ) ||
                minimumRentalMonths < 3
            ) {
                toast.error(
                    "Minimum rental period must be at least 3 months"
                );

                return;
            }

            if (
                !Number.isFinite(
                    rentalGst
                ) ||
                rentalGst < 0 ||
                rentalGst > 100
            ) {
                toast.error(
                    "Rental GST must be between 0 and 100"
                );

                return;
            }

            if (
                !Number.isInteger(
                    availableQuantity
                ) ||
                availableQuantity <= 0
            ) {
                toast.error(
                    "Available rental quantity must be greater than 0"
                );

                return;
            }
        }

        // =================================================
        // PRICE VALIDATION
        // =================================================

        if (
            formData.sellingPrice === ""
        ) {
            toast.error(
                "Please enter selling price"
            );

            return;
        }

        if (
            formData.mrp === ""
        ) {
            toast.error(
                "Please enter MRP"
            );

            return;
        }

        const purchasePrice =
            Number(
                formData.purchasePrice || 0
            );

        const sellingPrice =
            Number(
                formData.sellingPrice || 0
            );

        const mrp =
            Number(
                formData.mrp || 0
            );

        const discount =
            Number(
                formData.discount || 0
            );

        const gst =
            Number(
                formData.gst || 0
            );

        if (
            !Number.isFinite(
                purchasePrice
            ) ||
            purchasePrice < 0
        ) {
            toast.error(
                "Purchase price cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(
                sellingPrice
            ) ||
            sellingPrice < 0
        ) {
            toast.error(
                "Selling price cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(mrp) ||
            mrp < 0
        ) {
            toast.error(
                "MRP cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(
                discount
            ) ||
            discount < 0 ||
            discount > 100
        ) {
            toast.error(
                "Discount must be between 0 and 100"
            );

            return;
        }

        if (
            !Number.isFinite(gst) ||
            gst < 0 ||
            gst > 100
        ) {
            toast.error(
                "GST must be between 0 and 100"
            );

            return;
        }

        // =================================================
        // CREATE PRODUCT
        // =================================================

        try {
            setLoading(true);

            const data =
                new FormData();

            // =================================================
            // BASIC
            // =================================================

            data.append(
                "name",
                formData.name.trim()
            );

            data.append(
                "category",
                formData.category
            );

            // =================================================
            // SUBCATEGORY
            // =================================================

            if (
                formData.subcategory
            ) {
                data.append(
                    "subcategory",
                    formData.subcategory
                );
            }

            // =================================================
            // PRODUCT TYPE
            // =================================================

            data.append(
                "productType",
                formData.productType
            );

            // =================================================
            // REFURBISHED
            // =================================================

            if (
                formData.productType ===
                "REFURBISHED"
            ) {
                const refurbishedDetails = {
                    grade:
                        formData
                            .refurbishedDetails
                            .grade,

                    batteryHealth:
                        Number(
                            formData
                                .refurbishedDetails
                                .batteryHealth
                        ),

                    warrantyMonths:
                        Number(
                            formData
                                .refurbishedDetails
                                .warrantyMonths
                        ),

                    testingStatus:
                        formData
                            .refurbishedDetails
                            .testingStatus,
                };

                data.append(
                    "refurbishedDetails",
                    JSON.stringify(
                        refurbishedDetails
                    )
                );
            }

            // =================================================
            // RENTAL
            // =================================================

            const isRental =
                formData.productType ===
                "RENTAL";

            const rentalData = {
                isAvailableForRent:
                    isRental
                        ? true
                        : formData.rental
                            .isAvailableForRent ===
                          true,

                monthlyRent:
                    Number(
                        formData.rental
                            .monthlyRent || 0
                    ),

                securityDeposit:
                    Number(
                        formData.rental
                            .securityDeposit || 0
                    ),

                minimumRentalMonths:
                    Math.max(
                        Number(
                            formData.rental
                                .minimumRentalMonths ||
                                3
                        ),
                        3
                    ),

                gst:
                    Number(
                        formData.rental
                            .gst || 0
                    ),

                availableQuantity:
                    Number(
                        formData.rental
                            .availableQuantity ||
                            0
                    ),

                basicSoftwareInstalled:
                    formData.rental
                        .basicSoftwareInstalled ===
                    true,

                includedItems:
                    Array.isArray(
                        formData.rental
                            .includedItems
                    )
                        ? formData.rental
                            .includedItems
                        : [],

                notes:
                    formData.rental
                        .notes
                        ?.trim() || "",
            };

            data.append(
                "rental",
                JSON.stringify(
                    rentalData
                )
            );

            // =================================================
            // BRAND
            // =================================================

            data.append(
                "brand",
                formData.brand
            );

            // =================================================
            // DESCRIPTION
            // =================================================

            data.append(
                "shortDescription",
                formData.shortDescription.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            // =================================================
            // PRICING
            // =================================================

            const pricing = {
                purchasePrice,

                sellingPrice,

                mrp,

                discount,

                gst,
            };

            data.append(
                "pricing",
                JSON.stringify(
                    pricing
                )
            );

            // =================================================
            // IMAGES
            // =================================================

            formData.images.forEach(
                (image) => {
                    data.append(
                        "images",
                        image
                    );
                }
            );

            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "======================================"
            );

            console.log(
                "CREATE PRODUCT"
            );

            console.log(
                "======================================"
            );

            console.log(
                "Product Name:",
                formData.name
            );

            console.log(
                "Parent Category:",
                formData.category
            );

            console.log(
                "Subcategory:",
                formData.subcategory
            );

            console.log(
                "Product Type:",
                formData.productType
            );

            console.log(
                "Refurbished Details:",
                formData.refurbishedDetails
            );

            console.log(
                "Rental:",
                rentalData
            );

            console.log(
                "Brand:",
                formData.brand
            );

            console.log(
                "Pricing:",
                pricing
            );

            console.log(
                "Images:",
                formData.images
            );

            for (
                const [key, value]
                of data.entries()
            ) {
                console.log(
                    "FORM DATA:",
                    key,
                    value
                );
            }

            // =================================================
            // API CALL
            // =================================================

            const response =
                await createProduct(
                    data
                );

            console.log(
                "======================================"
            );

            console.log(
                "CREATE PRODUCT SUCCESS:",
                response.data
            );

            console.log(
                "======================================"
            );

            // =================================================
            // SUCCESS
            // =================================================

            toast.success(
                isRental
                    ? "Rental Product Added Successfully"
                    : formData.productType ===
                      "REFURBISHED"
                    ? "Refurbished Product Added Successfully"
                    : "New Product Added Successfully"
            );

            // =================================================
            // RESET
            // =================================================

            setFormData({
                name: "",

                category: "",

                subcategory: "",

                brand: "",

                productType: "NEW",

                refurbishedDetails: {
                    ...emptyRefurbishedDetails,
                },

                rental: {
                    ...emptyRentalDetails,
                },

                shortDescription: "",

                description: "",

                purchasePrice: "",

                sellingPrice: "",

                mrp: "",

                discount: "",

                gst: "",

                images: [],
            });

            // =================================================
            // RESET PREVIEWS
            // =================================================

            previewImages.forEach(
                (url) => {
                    URL.revokeObjectURL(url);
                }
            );

            setPreviewImages([]);

            // =================================================
            // RESET SUBCATEGORY
            // =================================================

            setSubcategories([]);

            // =================================================
            // RESET FILE INPUT
            // =================================================

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }
        } catch (error) {
            console.error(
                "======================================"
            );

            console.error(
                "CREATE PRODUCT ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            console.error(
                "BACKEND MESSAGE:",
                error.response?.data?.message
            );

            console.error(
                "BACKEND ERRORS:",
                error.response?.data?.errors
            );

            let backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to add product";

            if (
                Array.isArray(
                    error.response?.data?.errors
                ) &&
                error.response.data.errors
                    .length > 0
            ) {
                backendMessage =
                    error.response.data.errors.join(
                        ", "
                    );
            }

            toast.error(
                backendMessage
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="add-product">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-header">

                <h2>
                    Add Product
                </h2>

                <p>
                    Create New Product
                </p>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="form-section">

                    <h3>
                        Basic Information
                    </h3>

                    <div className="form-grid">

                        {/* PRODUCT NAME */}

                        <div className="form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter Product Name"
                                required
                            />

                        </div>

                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleCategoryChange
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {getParentCategories().map(
                                    (category) => (
                                        <option
                                            key={
                                                category._id
                                            }
                                            value={
                                                category._id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* SUBCATEGORY */}

                        <div className="form-group">

                            <label>
                                Subcategory
                            </label>

                            <select
                                name="subcategory"
                                value={
                                    formData.subcategory
                                }
                                onChange={
                                    handleSubcategoryChange
                                }
                                disabled={
                                    !formData.category ||
                                    subcategories.length === 0
                                }
                            >

                                <option value="">

                                    {!formData.category
                                        ? "Select Category First"
                                        : subcategories.length === 0
                                        ? "No Subcategories"
                                        : "Select Subcategory"}

                                </option>

                                {subcategories.map(
                                    (subcategory) => (
                                        <option
                                            key={
                                                subcategory._id
                                            }
                                            value={
                                                subcategory._id
                                            }
                                        >
                                            {
                                                subcategory.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {formData.category &&
                                subcategories.length ===
                                    0 && (
                                    <small className="subcategory-help">
                                        This category has no
                                        subcategories.
                                    </small>
                                )}

                        </div>

                        {/* BRAND */}

                        <div className="form-group">

                            <label>
                                Brand
                            </label>

                            <select
                                name="brand"
                                value={
                                    formData.brand
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands.map(
                                    (brand) => (
                                        <option
                                            key={
                                                brand._id
                                            }
                                            value={
                                                brand._id
                                            }
                                        >
                                            {
                                                brand.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* PRODUCT TYPE */}

                        <div className="form-group">

                            <label>
                                Product Type
                            </label>

                            <select
                                name="productType"
                                value={
                                    formData.productType
                                }
                                onChange={
                                    handleProductTypeChange
                                }
                                required
                            >

                                <option value="NEW">
                                    New Product
                                </option>

                                <option value="REFURBISHED">
                                    Refurbished Product
                                </option>

                                <option value="RENTAL">
                                    Rental Product
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    REFURBISHED DETAILS
                ================================================= */}

                {formData.productType ===
                    "REFURBISHED" && (
                    <div className="form-section">

                        <h3>
                            Refurbished Product Details
                        </h3>

                        <div className="form-grid">

                            {/* GRADE */}

                            <div className="form-group">

                                <label>
                                    Refurbished Grade
                                </label>

                                <select
                                    name="grade"
                                    value={
                                        formData
                                            .refurbishedDetails
                                            .grade
                                    }
                                    onChange={
                                        handleRefurbishedChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Grade
                                    </option>

                                    <option value="A+">
                                        A+ - Excellent
                                    </option>

                                    <option value="A">
                                        A - Very Good
                                    </option>

                                    <option value="B">
                                        B - Good
                                    </option>

                                    <option value="C">
                                        C - Fair
                                    </option>

                                </select>

                            </div>

                            {/* BATTERY */}

                            <div className="form-group">

                                <label>
                                    Battery Health (%)
                                </label>

                                <input
                                    type="number"
                                    name="batteryHealth"
                                    value={
                                        formData
                                            .refurbishedDetails
                                            .batteryHealth
                                    }
                                    onChange={
                                        handleRefurbishedChange
                                    }
                                    min="0"
                                    max="100"
                                    step="1"
                                    placeholder="Example: 85"
                                    required
                                />

                            </div>

                            {/* WARRANTY */}

                            <div className="form-group">

                                <label>
                                    Warranty (Months)
                                </label>

                                <input
                                    type="number"
                                    name="warrantyMonths"
                                    value={
                                        formData
                                            .refurbishedDetails
                                            .warrantyMonths
                                    }
                                    onChange={
                                        handleRefurbishedChange
                                    }
                                    min="0"
                                    step="1"
                                    placeholder="Example: 6"
                                    required
                                />

                            </div>

                            {/* TESTING */}

                            <div className="form-group">

                                <label>
                                    Testing Status
                                </label>

                                <select
                                    name="testingStatus"
                                    value={
                                        formData
                                            .refurbishedDetails
                                            .testingStatus
                                    }
                                    onChange={
                                        handleRefurbishedChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Testing Status
                                    </option>

                                    <option value="TESTED">
                                        Tested
                                    </option>

                                    <option value="NOT_TESTED">
                                        Not Tested
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>
                )}

                {/* =================================================
                    RENTAL DETAILS
                ================================================= */}

                {formData.productType ===
                    "RENTAL" && (
                    <div className="form-section rental-section">

                        <h3>
                            Rental Details
                        </h3>

                        <div className="form-grid">

                            {/* MONTHLY RENT */}

                            <div className="form-group">

                                <label>
                                    Monthly Rent
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="monthlyRent"
                                    value={
                                        formData
                                            .rental
                                            .monthlyRent
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "monthlyRent",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter monthly rent"
                                    required
                                />

                            </div>

                            {/* SECURITY DEPOSIT */}

                            <div className="form-group">

                                <label>
                                    Security Deposit
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="securityDeposit"
                                    value={
                                        formData
                                            .rental
                                            .securityDeposit
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "securityDeposit",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter security deposit"
                                    required
                                />

                            </div>

                            {/* MINIMUM MONTHS */}

                            <div className="form-group">

                                <label>
                                    Minimum Rental Months
                                </label>

                                <input
                                    type="number"
                                    min="3"
                                    step="1"
                                    name="minimumRentalMonths"
                                    value={
                                        formData
                                            .rental
                                            .minimumRentalMonths
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "minimumRentalMonths",
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <small>
                                    Minimum rental period is
                                    3 months.
                                </small>

                            </div>

                            {/* GST */}

                            <div className="form-group">

                                <label>
                                    Rental GST (%)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    name="gst"
                                    value={
                                        formData
                                            .rental
                                            .gst
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "gst",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: 18"
                                />

                            </div>

                            {/* QUANTITY */}

                            <div className="form-group">

                                <label>
                                    Available Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    name="availableQuantity"
                                    value={
                                        formData
                                            .rental
                                            .availableQuantity
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "availableQuantity",
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {/* SOFTWARE */}

                        <div className="form-group">

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    checked={
                                        formData
                                            .rental
                                            .basicSoftwareInstalled
                                    }
                                    onChange={(e) =>
                                        handleRentalChange(
                                            "basicSoftwareInstalled",
                                            e.target.checked
                                        )
                                    }
                                />

                                Basic Software Installed

                            </label>

                        </div>

                        {/* INCLUDED ITEMS */}

                        <div className="form-group">

                            <label>
                                Included Items
                            </label>

                            <div className="rental-items">

                                {[
                                    "LAPTOP",
                                    "CHARGING_ADAPTER",
                                    "BACKPACK",
                                    "MOUSE",
                                    "LAPTOP_BAG",
                                ].map((item) => (
                                    <label
                                        key={item}
                                        className="checkbox-label"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                formData
                                                    .rental
                                                    .includedItems
                                                    .includes(
                                                        item
                                                    )
                                            }
                                            onChange={() =>
                                                handleRentalItemChange(
                                                    item
                                                )
                                            }
                                        />

                                        {item.replaceAll(
                                            "_",
                                            " "
                                        )}

                                    </label>
                                ))}

                            </div>

                        </div>

                        {/* NOTES */}

                        <div className="form-group">

                            <label>
                                Rental Notes
                            </label>

                            <textarea
                                name="rentalNotes"
                                value={
                                    formData
                                        .rental
                                        .notes
                                }
                                onChange={(e) =>
                                    handleRentalChange(
                                        "notes",
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Enter rental notes..."
                            />

                        </div>

                    </div>
                )}

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div className="form-section">

                    <h3>
                        Description
                    </h3>

                    <div className="form-group">

                        <label>
                            Short Description
                        </label>

                        <textarea
                            name="shortDescription"
                            value={
                                formData
                                    .shortDescription
                            }
                            onChange={
                                handleChange
                            }
                            rows={3}
                            placeholder="Enter short description"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            rows={8}
                            placeholder="Enter product description"
                        />

                    </div>

                </div>

                {/* =================================================
                    PRICING
                ================================================= */}

                <div className="form-section">

                    <h3>
                        Pricing
                    </h3>

                    <div className="form-grid">

                        {/* PURCHASE PRICE */}

                        <div className="form-group">

                            <label>
                                Purchase Price
                            </label>

                            <input
                                type="number"
                                name="purchasePrice"
                                value={
                                    formData.purchasePrice
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="Purchase price"
                            />

                        </div>

                        {/* SELLING PRICE */}

                        <div className="form-group">

                            <label>
                                Selling Price
                            </label>

                            <input
                                type="number"
                                name="sellingPrice"
                                value={
                                    formData.sellingPrice
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>

                        {/* MRP */}

                        <div className="form-group">

                            <label>
                                MRP
                            </label>

                            <input
                                type="number"
                                name="mrp"
                                value={
                                    formData.mrp
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>

                        {/* DISCOUNT */}

                        <div className="form-group">

                            <label>
                                Discount (%)
                            </label>

                            <input
                                type="number"
                                name="discount"
                                value={
                                    formData.discount
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                max="100"
                                step="0.01"
                            />

                        </div>

                        {/* GST */}

                        <div className="form-group">

                            <label>
                                Product GST (%)
                            </label>

                            <input
                                type="number"
                                name="gst"
                                value={
                                    formData.gst
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                max="100"
                                step="0.01"
                            />

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRODUCT IMAGES
                ================================================= */}

                <div className="form-section">

                    <h3>
                        Product Images
                    </h3>

                    <div className="form-group">

                        <input
                            ref={
                                fileInputRef
                            }
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                        />

                        <small>
                            Maximum 5 images, each less
                            than 5MB.
                        </small>

                    </div>

                    {previewImages.length > 0 && (
                        <div className="image-preview">

                            {previewImages.map(
                                (
                                    image,
                                    index
                                ) => (
                                    <img
                                        key={
                                            index
                                        }
                                        src={
                                            image
                                        }
                                        alt={`Preview ${
                                            index + 1
                                        }`}
                                        className="preview-img"
                                    />
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <div className="submit-section">

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={
                            loading
                        }
                    >

                        {loading
                            ? "Saving Product..."
                            : formData.productType ===
                              "RENTAL"
                            ? "Save Rental Product"
                            : formData.productType ===
                              "REFURBISHED"
                            ? "Save Refurbished Product"
                            : "Save New Product"}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddProduct;