import React, { useEffect, useState } from "react";

import "./Products.css";

import { getShopProducts } from "../../services/productService";
import {

FaHeart,

FaShoppingCart,

FaStar,

FaSearch

} from "react-icons/fa";
const Products = () => {

    const [search,setSearch] = useState("");

const [category,setCategory] = useState("");

const [brand,setBrand] = useState("");

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const res = await getShopProducts();

            console.log(res.data);

            setProducts(res.data.data || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const filteredProducts =

products.filter(product=>{

const searchMatch=

product.name

.toLowerCase()

.includes(search.toLowerCase());

const categoryMatch=

category==="" ||

product.category?.name===category;

const brandMatch=

brand==="" ||

product.brand?.name===brand;

return(

searchMatch &&

categoryMatch &&

brandMatch

);

});
    return (

        <div className="products-page">

            <div className="products-header">

                <h1>

                    Our Products

                </h1>

                <p>

                    Browse our latest products

                </p>

            </div>


            <div className="product-filters">

<input

type="text"

placeholder="Search Products"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

>

<option value="">

All Categories

</option>

{

[...new Set(filteredProducts.map(p=>p.category?.name))]

.map(cat=>

<option key={cat} value={cat}>

{cat}

</option>

)

}

</select>

<select

value={brand}

onChange={(e)=>setBrand(e.target.value)}

>

<option value="">

All Brands

</option>

{

[...new Set(filteredProducts.map(p=>p.brand?.name))]

.map(br=>

<option key={br} value={br}>

{br}

</option>

)

}

</select>

</div>

            {

                loading ?

                (

                    <div className="loading">

                        Loading Products...

                    </div>

                )

                :

                (

                    <div className="products-grid">

                        {

                            products.length > 0 ?

                            (

                               filteredProducts.map((product) => (

                                    <div

                                        className="product-card"

                                        key={product._id}

                                    >

                                       <div className="product-image">

    {
        product.images?.length > 0 ?

        (
            <img
                src={`http://localhost:5000${product.images[0].url}`}
                alt={product.name}
            />
        )

        :

        (
            <img
                src="https://via.placeholder.com/300x250"
                alt="No Image"
            />
        )

    }

    {
        product.pricing.discount > 0 && (

            <span className="discount-badge">

                {product.pricing.discount}% OFF

            </span>

        )

    }

    {/* 👇 YAHAN ADD KARNA HAI */}

    <div className="wishlist">

        <FaHeart />

    </div>

</div>

                                        <div className="product-info">

                                            <div className="brand-row">

                                                {

                                                    product.brand?.logo ?

                                                    (

                                                        <img

                                                            src={`http://localhost:5000${product.brand.logo}`}

                                                            alt={product.brand.name}

                                                            className="brand-logo"

                                                        />

                                                    )

                                                    :

                                                    null

                                                }

                                                <span>

                                                    {product.brand?.name}

                                                </span>

                                                 
                                            </div>

                                          <h3>

    {product.name}

</h3>

<div className="rating">

    <FaStar />

    <FaStar />

    <FaStar />

    <FaStar />

    <FaStar />

    <span>

        5.0

    </span>

</div>

<p className="category">

    {product.category?.name}

</p>

                                            <div className="price-box">

                                                <span className="price">

                                                    ₹ {product.pricing.sellingPrice}
                                                </span>

                                                {

                                                    product.pricing.mrp >

                                                    product.pricing.sellingPrice &&

                                                    (

                                                        <span className="mrp">

                                                            ₹ {product.pricing.mrp}
                                                        </span>

                                                    )

                                                }

                                            </div>

<div className="stock">

    {

        product.availability === "IN_STOCK"

        ?

        (

            <span className="stock-green">

                In Stock

            </span>

        )

        :

        (

            <span className="stock-red">

                Out Of Stock

            </span>

        )

    }

</div>

                                   <div className="card-buttons">

    <button>

        <FaShoppingCart />

        Add To Cart

    </button>

</div>

                                        </div>

                                    </div>

                                ))

                            )

                            :

                            (

                                <h2>

                                    No Products Found

                                </h2>

                            )

                        }

                    </div>

                )

            }

        </div>

    );

};

export default Products;