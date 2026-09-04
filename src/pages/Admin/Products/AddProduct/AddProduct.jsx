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




// // import { useEffect, useRef, useState } from "react";

// // import "./AddProduct.css";

// // import { createProduct } from "../../../../services/productService";
// // import { getCategories } from "../../../../services/categoryService";
// // import { getBrands } from "../../../../services/brandService";
// // import { toast } from "react-toastify";

// // const AddProduct = () => {

// //     // =====================================================
// //     // STATES
// //     // =====================================================

// //     const [loading, setLoading] = useState(false);

// //     const [categories, setCategories] = useState([]);

// //     const [brands, setBrands] = useState([]);

// //     const [previewImages, setPreviewImages] = useState([]);

// //     const fileInputRef = useRef(null);

// //     const [formData, setFormData] = useState({

// //         name: "",

// //         category: "",

// //         brand: "",

// //         shortDescription: "",

// //         description: "",

// //         purchasePrice: "",

// //         sellingPrice: "",

// //         mrp: "",

// //         discount: "",

// //         gst: "",

// //         images: []

// //     });


// //     // =====================================================
// //     // LOAD CATEGORIES + BRANDS
// //     // =====================================================

// //     useEffect(() => {

// //         loadCategories();

// //         loadBrands();

// //         return () => {

// //             previewImages.forEach((url) => {

// //                 URL.revokeObjectURL(url);

// //             });

// //         };

// //     }, []);


// //     // =====================================================
// //     // LOAD CATEGORIES
// //     // =====================================================

// //     const loadCategories = async () => {

// //         try {

// //             const res = await getCategories();

// //             console.log(
// //                 "CATEGORY API RESPONSE:",
// //                 res.data
// //             );

// //             const categoryData =
// //                 Array.isArray(res.data)
// //                     ? res.data
// //                     : Array.isArray(res.data?.data)
// //                         ? res.data.data
// //                         : Array.isArray(res.data?.categories)
// //                             ? res.data.categories
// //                             : [];

// //             setCategories(categoryData);

// //         } catch (error) {

// //             console.error(
// //                 "CATEGORY ERROR:",
// //                 error
// //             );

// //             setCategories([]);

// //             toast.error(
// //                 "Failed to load categories"
// //             );

// //         }

// //     };


// //     // =====================================================
// //     // LOAD BRANDS
// //     // =====================================================

// //     const loadBrands = async () => {

// //         try {

// //             const res = await getBrands();

// //             console.log(
// //                 "BRAND API RESPONSE:",
// //                 res.data
// //             );

// //             const brandData =
// //                 Array.isArray(res.data)
// //                     ? res.data
// //                     : Array.isArray(res.data?.data)
// //                         ? res.data.data
// //                         : Array.isArray(res.data?.brands)
// //                             ? res.data.brands
// //                             : [];

// //             setBrands(brandData);

// //         } catch (error) {

// //             console.error(
// //                 "BRAND ERROR:",
// //                 error
// //             );

// //             setBrands([]);

// //             toast.error(
// //                 "Failed to load brands"
// //             );

// //         }

// //     };


// //     // =====================================================
// //     // HANDLE INPUT
// //     // =====================================================

// //     const handleChange = (e) => {

// //         const {
// //             name,
// //             value
// //         } = e.target;

// //         setFormData((prev) => ({

// //             ...prev,

// //             [name]: value

// //         }));

// //     };


// //     // =====================================================
// //     // IMAGE CHANGE
// //     // =====================================================

// //     const handleImageChange = (e) => {

// //         const files = Array.from(
// //             e.target.files || []
// //         );

// //         if (files.length === 0) {

// //             setFormData((prev) => ({

// //                 ...prev,

// //                 images: []

// //             }));

// //             setPreviewImages([]);

// //             return;

// //         }


// //         // Maximum 5 images

// //         if (files.length > 5) {

// //             toast.error(
// //                 "You can upload maximum 5 images"
// //             );

// //             e.target.value = "";

// //             return;

// //         }


// //         // Check file type

// //         const invalidFile = files.find(
// //             (file) =>
// //                 !file.type.startsWith("image/")
// //         );

// //         if (invalidFile) {

// //             toast.error(
// //                 "Only image files are allowed"
// //             );

// //             e.target.value = "";

// //             return;

// //         }


// //         // Check file size

// //         const oversizedFile = files.find(
// //             (file) =>
// //                 file.size > 5 * 1024 * 1024
// //         );

// //         if (oversizedFile) {

// //             toast.error(
// //                 "Each image must be less than 5MB"
// //             );

// //             e.target.value = "";

// //             return;

// //         }


// //         // Revoke old previews

// //         previewImages.forEach((url) => {

// //             URL.revokeObjectURL(url);

// //         });


// //         // Save files

// //         setFormData((prev) => ({

// //             ...prev,

// //             images: files

// //         }));


// //         // Create previews

// //         const preview = files.map(
// //             (file) =>
// //                 URL.createObjectURL(file)
// //         );

// //         setPreviewImages(preview);

// //     };


// //     // =====================================================
// //     // SUBMIT
// //     // =====================================================

// //     const handleSubmit = async (e) => {

// //         e.preventDefault();


// //         // =================================================
// //         // VALIDATION
// //         // =================================================

// //         if (!formData.name.trim()) {

// //             toast.error(
// //                 "Please enter product name"
// //             );

// //             return;

// //         }


// //         if (!formData.category) {

// //             toast.error(
// //                 "Please select category"
// //             );

// //             return;

// //         }


// //         if (!formData.brand) {

// //             toast.error(
// //                 "Please select brand"
// //             );

// //             return;

// //         }


// //         if (!formData.sellingPrice) {

// //             toast.error(
// //                 "Please enter selling price"
// //             );

// //             return;

// //         }


// //         if (!formData.mrp) {

// //             toast.error(
// //                 "Please enter MRP"
// //             );

// //             return;

// //         }


// //         const purchasePrice =
// //             Number(formData.purchasePrice || 0);

// //         const sellingPrice =
// //             Number(formData.sellingPrice || 0);

// //         const mrp =
// //             Number(formData.mrp || 0);

// //         const discount =
// //             Number(formData.discount || 0);

// //         const gst =
// //             Number(formData.gst || 0);


// //         if (purchasePrice < 0) {

// //             toast.error(
// //                 "Purchase price cannot be negative"
// //             );

// //             return;

// //         }


// //         if (sellingPrice < 0) {

// //             toast.error(
// //                 "Selling price cannot be negative"
// //             );

// //             return;

// //         }


// //         if (mrp < 0) {

// //             toast.error(
// //                 "MRP cannot be negative"
// //             );

// //             return;

// //         }


// //         if (discount < 0 || discount > 100) {

// //             toast.error(
// //                 "Discount must be between 0 and 100"
// //             );

// //             return;

// //         }


// //         if (gst < 0 || gst > 100) {

// //             toast.error(
// //                 "GST must be between 0 and 100"
// //             );

// //             return;

// //         }


// //         try {

// //             setLoading(true);


// //             // =================================================
// //             // CREATE FORM DATA
// //             // =================================================

// //             const data = new FormData();


// //             // =================================================
// //             // BASIC INFORMATION
// //             // =================================================

// //             data.append(
// //                 "name",
// //                 formData.name.trim()
// //             );

// //             data.append(
// //                 "category",
// //                 formData.category
// //             );

// //             data.append(
// //                 "brand",
// //                 formData.brand
// //             );

// //             data.append(
// //                 "shortDescription",
// //                 formData.shortDescription.trim()
// //             );

// //             data.append(
// //                 "description",
// //                 formData.description.trim()
// //             );


// //             // =================================================
// //             // PRICING
// //             // Backend will JSON.parse this before Joi validation
// //             // =================================================

// //             const pricing = {

// //                 purchasePrice,

// //                 sellingPrice,

// //                 mrp,

// //                 discount,

// //                 gst

// //             };


// //             data.append(
// //                 "pricing",
// //                 JSON.stringify(pricing)
// //             );


// //             // =================================================
// //             // IMAGES
// //             // =================================================

// //             formData.images.forEach((image) => {

// //                 data.append(
// //                     "images",
// //                     image
// //                 );

// //             });


// //             // =================================================
// //             // DEBUG
// //             // =================================================

// //             console.log(
// //                 "======================================"
// //             );

// //             console.log(
// //                 "CREATE PRODUCT"
// //             );

// //             console.log(
// //                 "======================================"
// //             );

// //             console.log(
// //                 "Product Name:",
// //                 formData.name
// //             );

// //             console.log(
// //                 "Category:",
// //                 formData.category
// //             );

// //             console.log(
// //                 "Brand:",
// //                 formData.brand
// //             );

// //             console.log(
// //                 "Pricing:",
// //                 pricing
// //             );

// //             console.log(
// //                 "Pricing JSON:",
// //                 JSON.stringify(pricing)
// //             );

// //             console.log(
// //                 "Images:",
// //                 formData.images
// //             );

// //             console.log(
// //                 "Image Count:",
// //                 formData.images.length
// //             );


// //             // =================================================
// //             // DEBUG FORMDATA
// //             // =================================================

// //             for (const [key, value] of data.entries()) {

// //                 console.log(
// //                     "FORM DATA:",
// //                     key,
// //                     value
// //                 );

// //             }


// //             // =================================================
// //             // API
// //             // =================================================

// //             const response =
// //                 await createProduct(data);


// //             console.log(
// //                 "======================================"
// //             );

// //             console.log(
// //                 "CREATE PRODUCT SUCCESS"
// //             );

// //             console.log(
// //                 response.data
// //             );

// //             console.log(
// //                 "======================================"
// //             );


// //             // =================================================
// //             // SUCCESS
// //             // =================================================

// //             toast.success(
// //                 "Product Added Successfully"
// //             );


// //             // =================================================
// //             // RESET FORM
// //             // =================================================

// //             setFormData({

// //                 name: "",

// //                 category: "",

// //                 brand: "",

// //                 shortDescription: "",

// //                 description: "",

// //                 purchasePrice: "",

// //                 sellingPrice: "",

// //                 mrp: "",

// //                 discount: "",

// //                 gst: "",

// //                 images: []

// //             });


// //             previewImages.forEach((url) => {

// //                 URL.revokeObjectURL(url);

// //             });

// //             setPreviewImages([]);


// //             // =================================================
// //             // RESET FILE INPUT
// //             // =================================================

// //             if (fileInputRef.current) {

// //                 fileInputRef.current.value = "";

// //             }

// //         } catch (error) {

// //             console.error(
// //                 "======================================"
// //             );

// //             console.error(
// //                 "CREATE PRODUCT ERROR"
// //             );

// //             console.error(
// //                 "======================================"
// //             );

// //             console.error(
// //                 error
// //             );

// //             console.error(
// //                 "STATUS:",
// //                 error.response?.status
// //             );

// //             console.error(
// //                 "BACKEND RESPONSE:",
// //                 error.response?.data
// //             );

// //             console.error(
// //                 "BACKEND MESSAGE:",
// //                 error.response?.data?.message
// //             );

// //             console.error(
// //                 "BACKEND ERRORS:",
// //                 error.response?.data?.errors
// //             );


// //             // =================================================
// //             // ERROR MESSAGE
// //             // =================================================

// //             let backendMessage =
// //                 error.response?.data?.message ||
// //                 error.response?.data?.error ||
// //                 "Failed to add product";


// //             if (
// //                 Array.isArray(
// //                     error.response?.data?.errors
// //                 )
// //                 &&
// //                 error.response.data.errors.length > 0
// //             ) {

// //                 backendMessage =
// //                     error.response.data.errors.join(", ");

// //             }


// //             toast.error(
// //                 backendMessage
// //             );

// //         } finally {

// //             setLoading(false);

// //         }

// //     };


// //     // =====================================================
// //     // UI
// //     // =====================================================

// //     return (

// //         <div className="add-product">

// //             {/* HEADER */}

// //             <div className="page-header">

// //                 <h2>
// //                     Add Product
// //                 </h2>

// //                 <p>
// //                     Create New Product
// //                 </p>

// //             </div>


// //             {/* FORM */}

// //             <form
// //                 className="product-form"
// //                 onSubmit={handleSubmit}
// //             >

// //                 {/* BASIC INFORMATION */}

// //                 <div className="form-section">

// //                     <h3>
// //                         Basic Information
// //                     </h3>


// //                     <div className="form-grid">

// //                         {/* PRODUCT NAME */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Product Name
// //                             </label>

// //                             <input
// //                                 type="text"
// //                                 name="name"
// //                                 value={formData.name}
// //                                 onChange={handleChange}
// //                                 placeholder="Enter Product Name"
// //                                 required
// //                             />

// //                         </div>


// //                         {/* CATEGORY */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Category
// //                             </label>

// //                             <select
// //                                 name="category"
// //                                 value={formData.category}
// //                                 onChange={handleChange}
// //                                 required
// //                             >

// //                                 <option value="">
// //                                     Select Category
// //                                 </option>

// //                                 {categories.map(
// //                                     (category) => (

// //                                         <option
// //                                             key={category._id}
// //                                             value={category._id}
// //                                         >
// //                                             {category.name}
// //                                         </option>

// //                                     )
// //                                 )}

// //                             </select>

// //                         </div>


// //                         {/* BRAND */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Brand
// //                             </label>

// //                             <select
// //                                 name="brand"
// //                                 value={formData.brand}
// //                                 onChange={handleChange}
// //                                 required
// //                             >

// //                                 <option value="">
// //                                     Select Brand
// //                                 </option>

// //                                 {brands.map(
// //                                     (brand) => (

// //                                         <option
// //                                             key={brand._id}
// //                                             value={brand._id}
// //                                         >
// //                                             {brand.name}
// //                                         </option>

// //                                     )
// //                                 )}

// //                             </select>

// //                         </div>

// //                     </div>

// //                 </div>


// //                 {/* DESCRIPTION */}

// //                 <div className="form-section">

// //                     <h3>
// //                         Description
// //                     </h3>


// //                     <div className="form-group">

// //                         <label>
// //                             Short Description
// //                         </label>

// //                         <textarea
// //                             name="shortDescription"
// //                             value={
// //                                 formData.shortDescription
// //                             }
// //                             onChange={handleChange}
// //                             rows={3}
// //                             placeholder="Enter short description"
// //                         />

// //                     </div>


// //                     <div className="form-group">

// //                         <label>
// //                             Description
// //                         </label>

// //                         <textarea
// //                             name="description"
// //                             value={
// //                                 formData.description
// //                             }
// //                             onChange={handleChange}
// //                             rows={8}
// //                             placeholder="Enter product description"
// //                         />

// //                     </div>

// //                 </div>


// //                 {/* PRICING */}

// //                 <div className="form-section">

// //                     <h3>
// //                         Pricing
// //                     </h3>


// //                     <div className="form-grid">

// //                         {/* PURCHASE PRICE */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Purchase Price
// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 name="purchasePrice"
// //                                 value={
// //                                     formData.purchasePrice
// //                                 }
// //                                 onChange={handleChange}
// //                                 min="0"
// //                                 step="0.01"
// //                             />

// //                         </div>


// //                         {/* SELLING PRICE */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Selling Price
// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 name="sellingPrice"
// //                                 value={
// //                                     formData.sellingPrice
// //                                 }
// //                                 onChange={handleChange}
// //                                 min="0"
// //                                 step="0.01"
// //                                 required
// //                             />

// //                         </div>


// //                         {/* MRP */}

// //                         <div className="form-group">

// //                             <label>
// //                                 MRP
// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 name="mrp"
// //                                 value={formData.mrp}
// //                                 onChange={handleChange}
// //                                 min="0"
// //                                 step="0.01"
// //                                 required
// //                             />

// //                         </div>


// //                         {/* DISCOUNT */}

// //                         <div className="form-group">

// //                             <label>
// //                                 Discount (%)
// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 name="discount"
// //                                 value={
// //                                     formData.discount
// //                                 }
// //                                 onChange={handleChange}
// //                                 min="0"
// //                                 max="100"
// //                                 step="0.01"
// //                             />

// //                         </div>


// //                         {/* GST */}

// //                         <div className="form-group">

// //                             <label>
// //                                 GST (%)
// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 name="gst"
// //                                 value={formData.gst}
// //                                 onChange={handleChange}
// //                                 min="0"
// //                                 max="100"
// //                                 step="0.01"
// //                             />

// //                         </div>

// //                     </div>

// //                 </div>


// //                 {/* PRODUCT IMAGES */}

// //                 <div className="form-section">

// //                     <h3>
// //                         Product Images
// //                     </h3>


// //                     <div className="form-group">

// //                         <input
// //                             ref={fileInputRef}
// //                             type="file"
// //                             multiple
// //                             accept="image/*"
// //                             onChange={handleImageChange}
// //                         />

// //                     </div>


// //                     {previewImages.length > 0 && (

// //                         <div className="image-preview">

// //                             {previewImages.map(
// //                                 (image, index) => (

// //                                     <img
// //                                         key={index}
// //                                         src={image}
// //                                         alt={`Preview ${index + 1}`}
// //                                         className="preview-img"
// //                                     />

// //                                 )
// //                             )}

// //                         </div>

// //                     )}

// //                 </div>


// //                 {/* SUBMIT */}

// //                 <div className="submit-section">

// //                     <button
// //                         type="submit"
// //                         className="submit-btn"
// //                         disabled={loading}
// //                     >

// //                         {loading
// //                             ? "Saving Product..."
// //                             : "Save Product"
// //                         }

// //                     </button>

// //                 </div>

// //             </form>

// //         </div>

// //     );

// // };

// // export default AddProduct;




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


//             /*
//              * Support:
//              *
//              * [
//              *   {...}
//              * ]
//              *
//              * OR
//              *
//              * {
//              *   data: [...]
//              * }
//              *
//              * OR
//              *
//              * {
//              *   categories: [...]
//              * }
//              */

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


//                 // No parent = main category

//                 if (!parent) {

//                     return false;

//                 }


//                 /*
//                  * parentCategory can be:
//                  *
//                  * ObjectId string
//                  *
//                  * OR
//                  *
//                  * populated object
//                  */

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


//         // Update parent category

//         setFormData((previous) => ({

//             ...previous,

//             category:
//                 parentCategoryId,

//             // Reset old subcategory

//             subcategory: ""

//         }));


//         // No category selected

//         if (!parentCategoryId) {

//             setSubcategories([]);

//             return;

//         }


//         // Find children

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
//     // IMAGE CHANGE
//     // =====================================================

//     const handleImageChange = (e) => {

//         const files = Array.from(
//             e.target.files || []
//         );


//         // No files

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
//         // VALIDATION
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


//             /*
//              * IMPORTANT:
//              *
//              * Your existing backend Product schema
//              * requires "category".
//              *
//              * We keep that exactly as it is.
//              */

//             data.append(
//                 "category",
//                 formData.category
//             );


//             /*
//              * Send subcategory as well.
//              *
//              * If backend has already been updated
//              * to accept subcategory, it will save it.
//              */

//             if (formData.subcategory) {

//                 data.append(
//                     "subcategory",
//                     formData.subcategory
//                 );

//             }


//             data.append(
//                 "brand",
//                 formData.brand
//             );


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


//                             {/* HELPER TEXT */}

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

//                     </div>

//                 </div>


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
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        name: "",

        category: "",

        subcategory: "",

        brand: "",

        // =================================================
        // PRODUCT TYPE
        // =================================================

        productType: "NEW",

        // =================================================
        // REFURBISHED DETAILS
        // =================================================

        refurbishedDetails: {

            grade: "",

            batteryHealth: "",

            warrantyMonths: "",

            testingStatus: ""

        },

        shortDescription: "",

        description: "",

        purchasePrice: "",

        sellingPrice: "",

        mrp: "",

        discount: "",

        gst: "",

        images: []

    });


    // =====================================================
    // LOAD CATEGORIES + BRANDS
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

            console.log(
                "CATEGORY API RESPONSE:",
                res.data
            );


            const categoryData =

                Array.isArray(res.data)

                    ? res.data

                    : Array.isArray(res.data?.data)

                        ? res.data.data

                        : Array.isArray(res.data?.categories)

                            ? res.data.categories

                            : Array.isArray(
                                res.data?.data?.categories
                            )

                                ? res.data.data.categories

                                : [];


            console.log(
                "ALL CATEGORIES:",
                categoryData
            );


            setCategories(categoryData);

        }

        catch (error) {

            console.error(
                "CATEGORY ERROR:",
                error
            );

            setCategories([]);

            toast.error(
                "Failed to load categories"
            );

        }

    };


    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {

        try {

            const res = await getBrands();

            console.log(
                "BRAND API RESPONSE:",
                res.data
            );


            const brandData =

                Array.isArray(res.data)

                    ? res.data

                    : Array.isArray(res.data?.data)

                        ? res.data.data

                        : Array.isArray(res.data?.brands)

                            ? res.data.brands

                            : Array.isArray(
                                res.data?.data?.brands
                            )

                                ? res.data.data.brands

                                : [];


            console.log(
                "ALL BRANDS:",
                brandData
            );


            setBrands(brandData);

        }

        catch (error) {

            console.error(
                "BRAND ERROR:",
                error
            );

            setBrands([]);

            toast.error(
                "Failed to load brands"
            );

        }

    };


    // =====================================================
    // GET PARENT CATEGORIES
    // =====================================================

    const getParentCategories = () => {

        return categories.filter(
            (category) => {

                return !category.parentCategory;

            }
        );

    };


    // =====================================================
    // GET CHILDREN / SUBCATEGORIES
    // =====================================================

    const getSubcategoriesByParent = (
        parentCategoryId
    ) => {

        if (!parentCategoryId) {

            return [];

        }


        return categories.filter(
            (category) => {

                const parent =
                    category.parentCategory;


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

            }
        );

    };


    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange = (e) => {

        const parentCategoryId =
            e.target.value;


        console.log(
            "SELECTED PARENT CATEGORY:",
            parentCategoryId
        );


        setFormData((previous) => ({

            ...previous,

            category:
                parentCategoryId,

            subcategory: ""

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

        const subcategoryId =
            e.target.value;


        console.log(
            "SELECTED SUBCATEGORY:",
            subcategoryId
        );


        setFormData((previous) => ({

            ...previous,

            subcategory:
                subcategoryId

        }));

    };


    // =====================================================
    // NORMAL INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // =====================================================
    // PRODUCT TYPE CHANGE
    // =====================================================

    const handleProductTypeChange = (e) => {

        const productType =
            e.target.value;


        setFormData((previous) => ({

            ...previous,

            productType,

            // Reset refurbished details when NEW
            refurbishedDetails:
                productType === "REFURBISHED"

                    ? previous.refurbishedDetails

                    : {

                        grade: "",

                        batteryHealth: "",

                        warrantyMonths: "",

                        testingStatus: ""

                    }

        }));

    };


    // =====================================================
    // REFURBISHED DETAIL CHANGE
    // =====================================================

    const handleRefurbishedChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            refurbishedDetails: {

                ...previous.refurbishedDetails,

                [name]: value

            }

        }));

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

                images: []

            }));

            setPreviewImages([]);

            return;

        }


        // Maximum 5 images

        if (files.length > 5) {

            toast.error(
                "You can upload maximum 5 images"
            );

            e.target.value = "";

            return;

        }


        // File type

        const invalidFile =
            files.find(
                (file) =>
                    !file.type.startsWith(
                        "image/"
                    )
            );


        if (invalidFile) {

            toast.error(
                "Only image files are allowed"
            );

            e.target.value = "";

            return;

        }


        // File size

        const oversizedFile =
            files.find(
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


        // Revoke old previews

        previewImages.forEach(
            (url) => {

                URL.revokeObjectURL(url);

            }
        );


        // Save images

        setFormData((previous) => ({

            ...previous,

            images: files

        }));


        // Create previews

        const preview =
            files.map(
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


        // =================================================
        // REFURBISHED VALIDATION
        // =================================================

        if (
            formData.productType ===
            "REFURBISHED"
        ) {

            if (
                !formData.refurbishedDetails.grade
            ) {

                toast.error(
                    "Please select refurbished grade"
                );

                return;

            }


            if (
                formData.refurbishedDetails.batteryHealth ===
                ""
            ) {

                toast.error(
                    "Please enter battery health"
                );

                return;

            }


            const batteryHealth =
                Number(
                    formData.refurbishedDetails
                        .batteryHealth
                );


            if (
                batteryHealth < 0 ||
                batteryHealth > 100
            ) {

                toast.error(
                    "Battery health must be between 0 and 100"
                );

                return;

            }


            if (
                formData.refurbishedDetails
                    .warrantyMonths === ""
            ) {

                toast.error(
                    "Please enter warranty months"
                );

                return;

            }


            if (
                !formData.refurbishedDetails
                    .testingStatus
            ) {

                toast.error(
                    "Please select testing status"
                );

                return;

            }

        }


        // =================================================
        // PRICE REQUIRED
        // =================================================

        if (!formData.sellingPrice) {

            toast.error(
                "Please enter selling price"
            );

            return;

        }


        if (!formData.mrp) {

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


        // =================================================
        // PRICE VALIDATION
        // =================================================

        if (purchasePrice < 0) {

            toast.error(
                "Purchase price cannot be negative"
            );

            return;

        }


        if (sellingPrice < 0) {

            toast.error(
                "Selling price cannot be negative"
            );

            return;

        }


        if (mrp < 0) {

            toast.error(
                "MRP cannot be negative"
            );

            return;

        }


        if (
            discount < 0 ||
            discount > 100
        ) {

            toast.error(
                "Discount must be between 0 and 100"
            );

            return;

        }


        if (
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
            // BASIC INFORMATION
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

            if (formData.subcategory) {

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
            // REFURBISHED DETAILS
            // =================================================

            if (
                formData.productType ===
                "REFURBISHED"
            ) {

                const refurbishedDetails = {

                    grade:
                        formData.refurbishedDetails
                            .grade,

                    batteryHealth:
                        Number(
                            formData.refurbishedDetails
                                .batteryHealth
                        ),

                    warrantyMonths:
                        Number(
                            formData.refurbishedDetails
                                .warrantyMonths
                        ),

                    testingStatus:
                        formData.refurbishedDetails
                            .testingStatus

                };


                data.append(
                    "refurbishedDetails",
                    JSON.stringify(
                        refurbishedDetails
                    )
                );

            }


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

                gst

            };


            data.append(
                "pricing",
                JSON.stringify(pricing)
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


            // =================================================
            // FORMDATA DEBUG
            // =================================================

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
            // API
            // =================================================

            const response =
                await createProduct(data);


            console.log(
                "CREATE PRODUCT SUCCESS:",
                response.data
            );


            // =================================================
            // SUCCESS
            // =================================================

            toast.success(
                "Product Added Successfully"
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

                    grade: "",

                    batteryHealth: "",

                    warrantyMonths: "",

                    testingStatus: ""

                },

                shortDescription: "",

                description: "",

                purchasePrice: "",

                sellingPrice: "",

                mrp: "",

                discount: "",

                gst: "",

                images: []

            });


            previewImages.forEach(
                (url) => {

                    URL.revokeObjectURL(
                        url
                    );

                }
            );


            setPreviewImages([]);

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

        }

        catch (error) {

            console.error(
                "======================================"
            );

            console.error(
                "CREATE PRODUCT ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(
                error
            );


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

                "Failed to add product";


            if (

                Array.isArray(
                    error.response?.data?.errors
                )

                &&

                error.response.data.errors.length > 0

            ) {

                backendMessage =
                    error.response.data.errors.join(
                        ", "
                    );

            }


            toast.error(
                backendMessage
            );

        }

        finally {

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


                        {/* =================================================
                            PARENT CATEGORY
                        ================================================= */}

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


                        {/* =================================================
                            SUBCATEGORY
                        ================================================= */}

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

                                            : "Select Subcategory"

                                    }

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
                                subcategories.length === 0 && (

                                    <small className="subcategory-help">

                                        This category has no
                                        subcategories.

                                    </small>

                                )}

                        </div>


                        {/* =================================================
                            BRAND
                        ================================================= */}

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


                        {/* =================================================
                            PRODUCT TYPE
                        ================================================= */}

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
                            >

                                <option value="NEW">
                                    New Product
                                </option>

                                <option value="REFURBISHED">
                                    Refurbished Product
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


                            {/* BATTERY HEALTH */}

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


                            {/* TESTING STATUS */}

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
                                formData.shortDescription
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
                                GST (%)
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

                    </div>


                    {previewImages.length > 0 && (

                        <div className="image-preview">

                            {previewImages.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <img
                                        key={index}
                                        src={image}
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
                        disabled={loading}
                    >

                        {loading

                            ? "Saving Product..."

                            : "Save Product"

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};


export default AddProduct;