import { useEffect, useState } from "react";

import "./AddProduct.css";

import { createProduct } from "../../../../services/productService";

import { getCategories } from "../../../../services/categoryService";

import { getBrands } from "../../../../services/brandService";


const AddProduct = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

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


    // ==========================================
    // LOAD CATEGORIES + BRANDS
    // ==========================================

    useEffect(() => {

        loadCategories();

        loadBrands();

    }, []);


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

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

        }

        catch (error) {

            console.log(
                "CATEGORY ERROR:",
                error
            );

            setCategories([]);

        }

    };


    // ==========================================
    // LOAD BRANDS
    // ==========================================

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

        }

        catch (error) {

            console.log(
                "BRAND ERROR:",
                error
            );

            setBrands([]);

        }

    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

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


    // ==========================================
    // IMAGE CHANGE
    // ==========================================

    const handleImageChange = (e) => {

        const files =
            Array.from(e.target.files || []);


        setFormData((prev) => ({

            ...prev,

            images: files

        }));


        const preview =
            files.map((file) =>
                URL.createObjectURL(file)
            );


        setPreviewImages(preview);

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.name.trim()) {

            alert("Please enter product name");

            return;

        }


        if (!formData.category) {

            alert("Please select category");

            return;

        }


        if (!formData.brand) {

            alert("Please select brand");

            return;

        }


        try {

            setLoading(true);


            // ==================================
            // FORM DATA
            // ==================================

            const data = new FormData();


            data.append(
                "name",
                formData.name
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
                formData.shortDescription
            );


            data.append(
                "description",
                formData.description
            );


            data.append(
                "purchasePrice",
                formData.purchasePrice || 0
            );


            data.append(
                "sellingPrice",
                formData.sellingPrice || 0
            );


            data.append(
                "mrp",
                formData.mrp || 0
            );


            data.append(
                "discount",
                formData.discount || 0
            );


            data.append(
                "gst",
                formData.gst || 0
            );


            // ==================================
            // IMAGES
            // ==================================

            formData.images.forEach((image) => {

                data.append(
                    "images",
                    image
                );

            });


            // ==================================
            // API
            // ==================================

            const response =
                await createProduct(data);


            console.log(
                "CREATE PRODUCT RESPONSE:",
                response.data
            );


            alert(
                "Product Added Successfully"
            );


            // ==================================
            // RESET FORM
            // ==================================

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


            setPreviewImages([]);

        }

        catch (error) {

            console.log(
                "CREATE PRODUCT ERROR:",
                error
            );


            console.log(
                "STATUS:",
                error.response?.status
            );


            console.log(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Failed to add product"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="add-product">


            {/* =================================
                HEADER
            ================================= */}

            <div className="page-header">

                <h2>
                    Add Product
                </h2>

                <p>
                    Create New Product
                </p>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >


                {/* =================================
                    BASIC INFORMATION
                ================================= */}

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
                                    handleChange
                                }

                                required

                            >

                                <option value="">
                                    Select Category
                                </option>


                                {

                                    categories.map(
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
                                    )

                                }

                            </select>

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


                                {

                                    brands.map(
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
                                    )

                                }

                            </select>

                        </div>


                    </div>

                </div>


                {/* =================================
                    DESCRIPTION
                ================================= */}

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


                {/* =================================
                    PRICING
                ================================= */}

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

                            />

                        </div>


                    </div>

                </div>


                {/* =================================
                    PRODUCT IMAGES
                ================================= */}

                <div className="form-section">

                    <h3>
                        Product Images
                    </h3>


                    <div className="form-group">

                        <input

                            type="file"

                            multiple

                            accept="image/*"

                            onChange={
                                handleImageChange
                            }

                        />

                    </div>


                    {

                        previewImages.length > 0 && (

                            <div className="image-preview">

                                {

                                    previewImages.map(
                                        (image, index) => (

                                            <img

                                                key={index}

                                                src={image}

                                                alt={`Preview ${index + 1}`}

                                                className="preview-img"

                                            />

                                        )
                                    )

                                }

                            </div>

                        )

                    }

                </div>


                {/* =================================
                    SUBMIT
                ================================= */}

                <div className="submit-section">

                    <button

                        type="submit"

                        className="submit-btn"

                        disabled={loading}

                    >

                        {

                            loading

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