import React, { useEffect, useState } from "react";

import "./ProductDetails.css";

import { Link, useParams } from "react-router-dom";

import { getProduct } from "../../../services/productService";

const ProductDetails = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");

    const [quantity, setQuantity] = useState(1);

useEffect(() => {

    loadProduct();

}, [id]);

const loadProduct = async () => {

    try {

        setLoading(true);

        const res = await getProduct(id);

         setProduct(res.data.product);

         
        if(res.data.images?.length){

            setSelectedImage(

                res.data.images[0]

            );

        }

    }

    catch(err){

        console.log(err);

    }

    finally{

        setLoading(false);

    }

};



if(loading){

    return(

        <div className="loading">

            Loading Product...

        </div>

    );

}

if(!product){

    return(

        <div className="loading">

            Product Not Found

        </div>

    );

}


return(

<div className="product-details">

<div className="breadcrumb">

<Link to="/">

Home

</Link>

<span>

/

</span>

<Link to="/shop">

Shop

</Link>

<span>

/

</span>

<span>

{product.name}

</span>

</div>

<div className="details-container">

<div className="left-side">

<img

src={selectedImage}

alt={product.name}

className="main-image"

/>

<div className="thumbnail-list">

{

product.images?.map(

(image,index)=>(

<img

key={index}

src={image}

alt=""

className={`thumbnail ${
    selectedImage === image ? "active" : ""
}`}

onClick={()=>

setSelectedImage(image)

}

/>

)

)

}

</div>

</div>

<div className="right-side">

<h1>

{product.name}

</h1>

<p className="brand">

Brand :

{product.brand?.name}

</p>

<p className="category">

Category :

{product.category?.name}

</p>

<div className="price-box">

<span className="price">

₹ {product.sellingPrice}

</span>

<span className="mrp">

₹ {product.mrp}

</span>

</div>

<p className="short-desc">

{product.shortDescription}

</p>


{/* ================= Stock ================= */}

<div className="stock-box">

    {
        product.stock > 0 ?

        (

            <span className="in-stock">

                ✅ In Stock ({product.stock})

            </span>

        )

        :

        (

            <span className="out-stock">

                ❌ Out Of Stock

            </span>

        )

    }

</div>

{/* ================= Quantity ================= */}

<div className="quantity-box">

    <label>Quantity</label>

    <div className="quantity-controls">

        <button

            type="button"

            onClick={() =>

                quantity > 1 &&

                setQuantity(quantity - 1)

            }

        >

            -

        </button>

        <input

            type="number"

            value={quantity}

            readOnly

        />

        <button

            type="button"

            onClick={() =>

                quantity < product.stock &&

                setQuantity(quantity + 1)

            }

        >

            +

        </button>

    </div>

</div>

{/* ================= Buttons ================= */}

<div className="action-buttons">

    <button

        className="cart-btn"

        disabled={product.stock === 0}

    >

        🛒 Add To Cart

    </button>

    <button

        className="buy-btn"

        disabled={product.stock === 0}

    >

        Buy Now

    </button>

    <button

        className="wishlist-btn"

    >

        ❤️ Wishlist

    </button>

</div>

{/* ================= Description ================= */}

<div className="description-section">

    <h3>

        Product Description

    </h3>

    <p>

        {product.description}

    </p>

</div>

{/* ================= Specifications ================= */}

<div className="specification-section">

    <h3>

        Specifications

    </h3>

    {

        product.specifications?.length > 0 ?

        (

            <table className="specification-table">

                <thead>

                    <tr>

                        <th>Specification</th>

                        <th>Value</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        product.specifications.map(

                            (item, index) => (

                                <tr key={index}>

                                    <td>

                                        {item.key}

                                    </td>

                                    <td>

                                        {item.value}

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

                No Specifications Available

            </p>

        )

    }

</div>

</div>  {/* right-side */}

</div>  {/* details-container */}

</div> 

);

};

export default ProductDetails;