import React, { useEffect, useState } from "react";

import "./EditProduct.css";

import { useNavigate, useParams } from "react-router-dom";

import {

    getProduct,

    updateProduct

} from "../../../../services/productService";

import {

    getCategories

} from "../../../../services/categoryService";
import { toast } from "react-toastify";

import {

    getBrands

} from "../../../../services/brandService";

const EditProduct = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const [specifications, setSpecifications] = useState([]);

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

        stock: "",

        minimumStock: "",

        metaTitle: "",

        metaDescription: "",

        status: "Active",

        images: []

    });

    useEffect(() => {

    loadCategories();

    loadBrands();

    loadProduct();

}, []);

const loadCategories = async () => {

    try {

        const res = await getCategories();

        setCategories(res.data);

    }

    catch (err) {

        console.log(err);

    }

};

const loadBrands = async () => {

    try {

        const res = await getBrands();

        setBrands(res.data);

    }

    catch (err) {

        console.log(err);

    }

};

const loadProduct = async () => {

    try {

        setLoading(true);

        const res = await getProduct(id);

        const product = res.data;

        setFormData({

            name: product.name || "",

            category: product.category?._id || "",

            brand: product.brand?._id || "",

            shortDescription: product.shortDescription || "",

            description: product.description || "",

            purchasePrice: product.purchasePrice || "",

            sellingPrice: product.sellingPrice || "",

            mrp: product.mrp || "",

            discount: product.discount || "",

            gst: product.gst || "",

            stock: product.stock || "",

            minimumStock: product.minimumStock || "",

            metaTitle: product.metaTitle || "",

            metaDescription: product.metaDescription || "",

            status: product.status || "Active",

            images: []

        });

        setPreviewImages(product.images || []);

        setSpecifications(

            product.specifications || []

        );

    }

    catch (err) {

        console.log(err);

    }

    finally {

        setLoading(false);

    }

};

const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({

        ...formData,

        [name]: value

    });

};

const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    setFormData({

        ...formData,

        images: files

    });

    const previews = files.map(

        file => URL.createObjectURL(file)

    );

    setPreviewImages(previews);

};

const addSpecification = () => {

    setSpecifications([

        ...specifications,

        {

            key: "",

            value: ""

        }

    ]);

};

const removeSpecification = (index) => {

    const list = [...specifications];

    list.splice(index, 1);

    setSpecifications(list);

};

const handleSpecification = (index, e) => {

    const { name, value } = e.target;

    const list = [...specifications];

    list[index][name] = value;

    setSpecifications(list);

};



const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        const data = new FormData();

        data.append("name", formData.name);

        data.append("category", formData.category);

        data.append("brand", formData.brand);

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
            formData.purchasePrice
        );

        data.append(
            "sellingPrice",
            formData.sellingPrice
        );

        data.append(
            "mrp",
            formData.mrp
        );

        data.append(
            "discount",
            formData.discount
        );

        data.append(
            "gst",
            formData.gst
        );

        data.append(
            "stock",
            formData.stock
        );

        data.append(
            "minimumStock",
            formData.minimumStock
        );

        data.append(
            "metaTitle",
            formData.metaTitle
        );

        data.append(
            "metaDescription",
            formData.metaDescription
        );

        data.append(
            "status",
            formData.status
        );

        data.append(
            "specifications",
            JSON.stringify(specifications)
        );

        if (formData.images.length > 0) {

            formData.images.forEach((image) => {

                data.append("images", image);

            });

        }

        await updateProduct(id, data);

       toast.success("Product Updated Successfully");

        navigate("/admin/products");

    }

    catch (err) {

        console.log(err);

        toast.error("Failed to Update Product");

    }

    finally {

        setLoading(false);

    }

};


return (

    <div className="add-product">

        <div className="page-header">

            <h2>Edit Product</h2>

            <p>Update Existing Product</p>

        </div>

        <form
            className="product-form"
            onSubmit={handleSubmit}
        >

{/* ================= Basic Information ================= */}

<div className="form-section">

    <h3>Basic Information</h3>

    <div className="form-grid">

        <div className="form-group">

            <label>Product Name</label>

            <input

                type="text"

                name="name"

                value={formData.name}

                onChange={handleChange}

                required

            />

        </div>

        <div className="form-group">

            <label>Category</label>

            <select

                name="category"

                value={formData.category}

                onChange={handleChange}

            >

                <option value="">Select Category</option>

                {

                    categories.map(category => (

                        <option

                            key={category._id}

                            value={category._id}

                        >

                            {category.name}

                        </option>

                    ))

                }

            </select>

        </div>

        <div className="form-group">

            <label>Brand</label>

            <select

                name="brand"

                value={formData.brand}

                onChange={handleChange}

            >

                <option value="">Select Brand</option>

                {

                    brands.map(brand => (

                        <option

                            key={brand._id}

                            value={brand._id}

                        >

                            {brand.name}

                        </option>

                    ))

                }

            </select>

        </div>

    </div>

</div>

{/* ================= Description ================= */}

<div className="form-section">

    <h3>Description</h3>

    <div className="form-group">

        <label>Short Description</label>

        <textarea

            rows={3}

            name="shortDescription"

            value={formData.shortDescription}

            onChange={handleChange}

        />

    </div>

    <div className="form-group">

        <label>Description</label>

        <textarea

            rows={8}

            name="description"

            value={formData.description}

            onChange={handleChange}

        />

    </div>

</div>

{/* ================= Pricing ================= */}

<div className="form-section">

    <h3>Pricing</h3>

    <div className="form-grid">

        <div className="form-group">

            <label>Purchase Price</label>

            <input

                type="number"

                name="purchasePrice"

                value={formData.purchasePrice}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>Selling Price</label>

            <input

                type="number"

                name="sellingPrice"

                value={formData.sellingPrice}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>MRP</label>

            <input

                type="number"

                name="mrp"

                value={formData.mrp}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>Discount (%)</label>

            <input

                type="number"

                name="discount"

                value={formData.discount}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>GST (%)</label>

            <input

                type="number"

                name="gst"

                value={formData.gst}

                onChange={handleChange}

            />

        </div>

    </div>

</div>

{/* ================= Inventory ================= */}

<div className="form-section">

    <h3>Inventory</h3>

    <div className="form-grid">

        <div className="form-group">

            <label>Stock</label>

            <input

                type="number"

                name="stock"

                value={formData.stock}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>Minimum Stock</label>

            <input

                type="number"

                name="minimumStock"

                value={formData.minimumStock}

                onChange={handleChange}

            />

        </div>

        <div className="form-group">

            <label>Status</label>

            <select

                name="status"

                value={formData.status}

                onChange={handleChange}

            >

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>

            </select>

        </div>

    </div>

</div>

{/* ================= Images ================= */}

<div className="form-section">

    <h3>Product Images</h3>

    <input

        type="file"

        multiple

        accept="image/*"

        onChange={handleImageChange}

    />

    <div className="image-preview">

        {

            previewImages.map((image, index) => (

                <img

                    key={index}

                    src={image}

                    alt="Preview"

                    className="preview-img"

                />

            ))

        }

    </div>

</div>

{/* ================= Specifications ================= */}

<div className="form-section">

    <h3>Specifications</h3>

    {
        specifications.map((item, index) => (

            <div
                className="specification-row"
                key={index}
            >

                <input
                    type="text"
                    placeholder="Specification Name"
                    name="key"
                    value={item.key}
                    onChange={(e) =>
                        handleSpecification(index, e)
                    }
                />

                <input
                    type="text"
                    placeholder="Specification Value"
                    name="value"
                    value={item.value}
                    onChange={(e) =>
                        handleSpecification(index, e)
                    }
                />

                <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                        removeSpecification(index)
                    }
                >
                    Remove
                </button>

            </div>

        ))
    }

    <button
        type="button"
        className="add-btn"
        onClick={addSpecification}
    >
        + Add Specification
    </button>

</div>

{/* ================= SEO ================= */}

<div className="form-section">

    <h3>SEO Information</h3>

    <div className="form-group">

        <label>Meta Title</label>

        <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
        />

    </div>

    <div className="form-group">

        <label>Meta Description</label>

        <textarea
            rows={4}
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
        />

    </div>

</div>

<div className="submit-section">

    <button
        type="submit"
        className="submit-btn"
        disabled={loading}
    >

        {
            loading
                ? "Updating..."
                : "Update Product"
        }

    </button>

</div>

</form>

</div>

);

};

export default EditProduct;