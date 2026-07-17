import React, { useEffect, useState } from "react";

import "./ViewProduct.css";

import { useNavigate, useParams } from "react-router-dom";

import { getProduct } from "../../../../services/productService";

const ViewProduct = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState(null);

    useEffect(() => {

    loadProduct();

}, []);


const loadProduct = async () => {

    try {

        setLoading(true);

        const res = await getProduct(id);

        setProduct(res.data);

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

if (loading) {

    return (

        <div className="loading">

            Loading Product...

        </div>

    );

}

if (!product) {

    return (

        <div className="loading">

            Product Not Found

        </div>

    );

}

return (

    <div className="view-product">

        <div className="page-header">

            <h2>Product Details</h2>

            <div className="header-buttons">

                <button

                    className="back-btn"

                    onClick={() => navigate("/admin/products")}

                >

                    Back

                </button>

                <button

                    className="edit-btn"

                    onClick={() =>
                        navigate(`/admin/products/edit/${id}`)
                    }

                >

                    Edit

                </button>

            </div>

        </div>

        <div className="image-gallery">

    {

        product.images?.length > 0 ?

        (

            product.images.map((image, index) => (

                <img

                    key={index}

                    src={image}

                    alt="Product"

                    className="gallery-image"

                />

            ))

        )

        :

        (

            <img

                src="/no-image.png"

                alt="No Image"

                className="gallery-image"

            />

        )

    }

</div>

<div className="details-card">

    <h3>Basic Information</h3>

    <div className="details-grid">

        <div>

            <strong>Product Name</strong>

            <p>{product.name}</p>

        </div>

        <div>

            <strong>Category</strong>

            <p>{product.category?.name}</p>

        </div>

        <div>

            <strong>Brand</strong>

            <p>{product.brand?.name}</p>

        </div>

        <div>

            <strong>Status</strong>

            <p>{product.status}</p>

        </div>

    </div>

</div>

{/* ================= Description ================= */}

<div className="details-card">

    <h3>Description</h3>

    <div className="description-box">

        <h4>Short Description</h4>

        <p>

            {product.shortDescription || "-"}

        </p>

        <h4>Full Description</h4>

        <p>

            {product.description || "-"}

        </p>

    </div>

</div>

{/* ================= Pricing ================= */}

<div className="details-card">

    <h3>Pricing Information</h3>

    <div className="details-grid">

        <div>

            <strong>Purchase Price</strong>

            <p>

                ₹ {product.purchasePrice}

            </p>

        </div>

        <div>

            <strong>Selling Price</strong>

            <p>

                ₹ {product.sellingPrice}

            </p>

        </div>

        <div>

            <strong>MRP</strong>

            <p>

                ₹ {product.mrp}

            </p>

        </div>

        <div>

            <strong>Discount</strong>

            <p>

                {product.discount} %

            </p>

        </div>

        <div>

            <strong>GST</strong>

            <p>

                {product.gst} %

            </p>

        </div>

    </div>

</div>

{/* ================= Inventory ================= */}

<div className="details-card">

    <h3>Inventory</h3>

    <div className="details-grid">

        <div>

            <strong>Available Stock</strong>

            <p>

                {product.stock}

            </p>

        </div>

        <div>

            <strong>Minimum Stock</strong>

            <p>

                {product.minimumStock}

            </p>

        </div>

    </div>

</div>

{/* ================= Specifications ================= */}

<div className="details-card">

    <h3>Specifications</h3>

    {

        product.specifications?.length > 0 ?

        (

            <table className="spec-table">

                <thead>

                    <tr>

                        <th>Specification</th>

                        <th>Value</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        product.specifications.map(

                            (spec, index) => (

                                <tr key={index}>

                                    <td>

                                        {spec.key}

                                    </td>

                                    <td>

                                        {spec.value}

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>

        )

        :

        (

            <p>

                No Specifications Added

            </p>

        )

    }

</div>

{/* ================= SEO ================= */}

<div className="details-card">

    <h3>SEO Information</h3>

    <div className="details-grid">

        <div>

            <strong>Meta Title</strong>

            <p>

                {product.metaTitle || "-"}

            </p>

        </div>

        <div>

            <strong>Meta Description</strong>

            <p>

                {product.metaDescription || "-"}

            </p>

        </div>

    </div>

</div>

</div>

);

};

export default ViewProduct;