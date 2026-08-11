
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

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({

        name: "",

        category: "",

        brand: "",

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
                            : [];

            setCategories(categoryData);

        } catch (error) {

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
                            : [];

            setBrands(brandData);

        } catch (error) {

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
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

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

            setFormData((prev) => ({

                ...prev,

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


        // Check file type

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


        // Check file size

        const oversizedFile = files.find(
            (file) =>
                file.size > 5 * 1024 * 1024
        );

        if (oversizedFile) {

            toast.error(
                "Each image must be less than 5MB"
            );

            e.target.value = "";

            return;

        }


        // Revoke old previews

        previewImages.forEach((url) => {

            URL.revokeObjectURL(url);

        });


        // Save files

        setFormData((prev) => ({

            ...prev,

            images: files

        }));


        // Create previews

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
        // VALIDATION
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
            Number(formData.purchasePrice || 0);

        const sellingPrice =
            Number(formData.sellingPrice || 0);

        const mrp =
            Number(formData.mrp || 0);

        const discount =
            Number(formData.discount || 0);

        const gst =
            Number(formData.gst || 0);


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


        if (discount < 0 || discount > 100) {

            toast.error(
                "Discount must be between 0 and 100"
            );

            return;

        }


        if (gst < 0 || gst > 100) {

            toast.error(
                "GST must be between 0 and 100"
            );

            return;

        }


        try {

            setLoading(true);


            // =================================================
            // CREATE FORM DATA
            // =================================================

            const data = new FormData();


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

            data.append(
                "brand",
                formData.brand
            );

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
            // Backend will JSON.parse this before Joi validation
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

            formData.images.forEach((image) => {

                data.append(
                    "images",
                    image
                );

            });


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
                "Category:",
                formData.category
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
                "Pricing JSON:",
                JSON.stringify(pricing)
            );

            console.log(
                "Images:",
                formData.images
            );

            console.log(
                "Image Count:",
                formData.images.length
            );


            // =================================================
            // DEBUG FORMDATA
            // =================================================

            for (const [key, value] of data.entries()) {

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
                "======================================"
            );

            console.log(
                "CREATE PRODUCT SUCCESS"
            );

            console.log(
                response.data
            );

            console.log(
                "======================================"
            );


            // =================================================
            // SUCCESS
            // =================================================

            toast.success(
                "Product Added Successfully"
            );


            // =================================================
            // RESET FORM
            // =================================================

            setFormData({

                name: "",

                category: "",

                brand: "",

                shortDescription: "",

                description: "",

                purchasePrice: "",

                sellingPrice: "",

                mrp: "",

                discount: "",

                gst: "",

                images: []

            });


            previewImages.forEach((url) => {

                URL.revokeObjectURL(url);

            });

            setPreviewImages([]);


            // =================================================
            // RESET FILE INPUT
            // =================================================

            if (fileInputRef.current) {

                fileInputRef.current.value = "";

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


            // =================================================
            // ERROR MESSAGE
            // =================================================

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
                    error.response.data.errors.join(", ");

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

            {/* HEADER */}

            <div className="page-header">

                <h2>
                    Add Product
                </h2>

                <p>
                    Create New Product
                </p>

            </div>


            {/* FORM */}

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                {/* BASIC INFORMATION */}

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
                                value={formData.name}
                                onChange={handleChange}
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
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* BRAND */}

                        <div className="form-group">

                            <label>
                                Brand
                            </label>

                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands.map(
                                    (brand) => (

                                        <option
                                            key={brand._id}
                                            value={brand._id}
                                        >
                                            {brand.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </div>


                {/* DESCRIPTION */}

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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            rows={8}
                            placeholder="Enter product description"
                        />

                    </div>

                </div>


                {/* PRICING */}

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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                value={formData.mrp}
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                value={formData.gst}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.01"
                            />

                        </div>

                    </div>

                </div>


                {/* PRODUCT IMAGES */}

                <div className="form-section">

                    <h3>
                        Product Images
                    </h3>


                    <div className="form-group">

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                    </div>


                    {previewImages.length > 0 && (

                        <div className="image-preview">

                            {previewImages.map(
                                (image, index) => (

                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className="preview-img"
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* SUBMIT */}

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

