import React, { useEffect, useState } from "react";
import "./AddProduct.css";

import {createProduct} from "../../../../services/productService";

import {
    getCategories
} from "../../../../services/categoryService";

import {
    getBrands
} from "../../../../services/brandService";

const AddProduct = () => {

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const [specifications, setSpecifications] = useState([
        {
            key: "",
            value: ""
        }
    ]);

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

        // stock: "",

        // minimumStock: "",

        // metaTitle: "",

        // metaDescription: "",

        // status: "Active",

        images: []

    });

        useEffect(() => {

        loadCategories();

        loadBrands();

    }, []);

const loadCategories = async () => {

    try {

        const res = await getCategories();

        console.log("Category API Response:", res.data);

        setCategories(
            Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.categories)
                ? res.data.categories
                : Array.isArray(res.data.data)
                ? res.data.data
                : []
        );

    }

    catch (err) {

        console.log("Category Error:", err);

        setCategories([]);

    }

};
    const loadBrands = async () => {

    try {

        const res = await getBrands();

        console.log("Brand API Response:", res.data);

        setBrands(
            Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.brands)
                ? res.data.brands
                : Array.isArray(res.data.data)
                ? res.data.data
                : []
        );

    }

    catch (err) {

        console.log("Brand Error:", err);

        setBrands([]);

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

        const preview = files.map(file => URL.createObjectURL(file));

        setPreviewImages(preview);

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

data.append(
    "name",
    formData.name
);
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

        // data.append(
        //     "stock",
        //     formData.stock
        // );

        // data.append(
        //     "minimumStock",
        //     formData.minimumStock
        // );

        // data.append(
        //     "metaTitle",
        //     formData.metaTitle
        // );

        // data.append(
        //     "metaDescription",
        //     formData.metaDescription
        // );

        // data.append(
        //     "status",
        //     formData.status
        // );

        // data.append(
        //     "specifications",
        //     JSON.stringify(specifications)
        // );

        formData.images.forEach((image) => {

            data.append("images", image);

        });

        await createProduct(data);

        alert("Product Added Successfully");

        setFormData({

            name:"" ,

            category: "",

            brand: "",

            shortDescription: "",

            description: "",

            purchasePrice: "",

            sellingPrice: "",

            mrp: "",

            discount: "",

            gst: "",

            // stock: "",

            // minimumStock: "",

            // metaTitle: "",

            // metaDescription: "",

            // status: "Active",

            images: []

        });

        setPreviewImages([]);

        setSpecifications([

            {

                key: "",

                value: ""

            }

        ]);

    }


    catch (error) {

    console.log("Status:", error.response?.status);

    console.log("Backend Response:", error.response?.data);

    alert(JSON.stringify(error.response?.data));

}
    // catch (error) {

    //     console.log(error);

    //     alert("Failed to Add Product");

    // }

    finally {

        setLoading(false);

    }

};

        return (

        <div className="add-product">

            <div className="page-header">

                <h2>Add Product</h2>

                <p>Create New Product</p>

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
                placeholder="Enter Product Name"
                required
            />

        </div>

        <div className="form-group">

            <label>Category</label>

            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
            >

                <option value="">Select Category</option>

                {
                    categories.map((cat) => (

                        <option
                            key={cat._id}
                            value={cat._id}
                        >
                            {cat.name}
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
                    brands.map((brand) => (

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

            name="shortDescription"

            value={formData.shortDescription}

            onChange={handleChange}

            rows={3}

        />

    </div>

    <div className="form-group">

        <label>Description</label>

        <textarea

            name="description"

            value={formData.description}

            onChange={handleChange}

            rows={8}

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


{/* ================= Stock ================= */}
{/*
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

</div>*/}


{/* ================= Images ================= */}

<div className="form-section">

    <h3>Product Images</h3>

    <div className="form-group">

        <input

            type="file"

            multiple

            accept="image/*"

            onChange={handleImageChange}

        />

    </div>

    <div className="image-preview">

        {

            previewImages.map((img, index) => (

                <img

                    key={index}

                    src={img}

                    alt="preview"

                    className="preview-img"

                />

            ))

        }

    </div>

</div>

{/* ================= Specifications ================= */}
{/*
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
*/}


{/* ================= SEO ================= */}
{/*
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
*/}


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







