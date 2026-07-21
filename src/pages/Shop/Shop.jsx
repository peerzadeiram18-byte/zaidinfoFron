import React, { useEffect, useState } from "react";

import "./Shop.css";

import { Link } from "react-router-dom";

import {

    getShopProducts

} from "../../services/productService";

import { addToCart } from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import {

addToWishlist

} from "../../services/wishlistService";


const Shop = () => {

    const navigate = useNavigate();


    const [products, setProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [brand, setBrand] = useState("");

    const [sort, setSort] = useState("");


    useEffect(() => {

    loadProducts();

}, []);

const loadProducts = async () => {
    try {

        setLoading(true);

        const res = await getShopProducts();

        console.log("Shop API =", res.data);

        const productList = Array.isArray(res.data.data)
            ? res.data.data
            : [];

        setProducts(productList);

        setFilteredProducts(productList);

    } catch (err) {

        console.log(err);

    } finally {

        setLoading(false);

    }
};
useEffect(() => {

let data = Array.isArray(products)
    ? [...products]
    : [];

    if(search){

        data = data.filter(product =>

            product.name

            .toLowerCase()

            .includes(search.toLowerCase())

        );

    }

    if(category){

        data = data.filter(

            product =>

            product.category?.name === category

        );

    }

    if(brand){

        data = data.filter(

            product =>

            product.brand?.name === brand

        );

    }

    if(sort==="low"){

        data.sort(

            (a,b)=>

            a.sellingPrice-b.sellingPrice

        );

    }

    if(sort==="high"){

        data.sort(

            (a,b)=>

            b.sellingPrice-a.sellingPrice

        );

    }

    setFilteredProducts(data);

},[

    search,

    category,

    brand,

    sort,

    products

]);


const handleAddToCart = async(product)=>{

    const token = localStorage.getItem("token");

    if(!token){

        alert("Please Login First");

        navigate("/login");

        return;

    }

    try{

        await addToCart({

            product: product._id,

            quantity:1

        });

        alert("Added To Cart");

    }

    catch(error){

        console.log(error);

        alert(
            error.response?.data?.message
        );

    }

};

const handleWishlist = async (product) => {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please Login First");
        navigate("/login");
        return;

    }

    try {

        console.log("========================");
        console.log(product);

        console.log(product._id);

        const res = await addToWishlist(product._id);

        console.log(res.data);

        alert("Added To Wishlist");

    }

    catch (error) {

        console.log(error.response?.data);

        alert(error.response?.data?.message);

    }

};

return(

<div className="shop-page">

<div className="shop-header">

<h2>

Shop

</h2>

<p>

Browse All Products

</p>

</div>

<div className="shop-filters">

<input

type="text"

placeholder="Search Product..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>

<input

type="text"

placeholder="Category"

value={category}

onChange={(e)=>

setCategory(e.target.value)

}

/>

<input

type="text"

placeholder="Brand"

value={brand}

onChange={(e)=>

setBrand(e.target.value)

}

/>

<select

value={sort}

onChange={(e)=>

setSort(e.target.value)

}

>

<option value="">

Sort By

</option>

<option value="low">

Price Low to High

</option>

<option value="high">

Price High to Low

</option>

</select>

</div>

{/* ================= Products ================= */}

{
    loading ?

    (

        <div className="loading">

            Loading Products...

        </div>

    )

    :

    (

        <div className="product-grid">

            {

                filteredProducts.length > 0 ?

                (

                    filteredProducts.map((product) => (

                        <div

                            className="product-card"

                            key={product._id}

                        >

                            {/* Product Image */}

                            <div className="product-image-box">

    <img
    src={
        product.images?.length
            ? `http://localhost:5000${product.images[0].url}`
            : "/no-image.png"
    }
    alt={product.name}
    className="product-image"
/>

                                {

                                    Number(product.pricing?.discount) > 0 &&

                                    (

                                        <span className="discount-badge">

                                            {product.pricing?.discount}% OFF

                                        </span>

                                    )

                                }

                            </div>

                            {/* Product Details */}

                            <div className="product-info">
<h3>{product.name}</h3>

                                <p className="category">

                                    {

                                        product.category?.name ||

                                        "No Category"

                                    }

                                </p>

                                <p className="brand">

                                    {

                                        product.brand?.name ||

                                        "No Brand"

                                    }

                                </p>

                                <div className="price-section">

                                    <span className="selling-price">

                                        ₹ {product.pricing?.sellingPrice}

                                    </span>

                                    <span className="mrp-price">

                                        ₹ {product.pricing?.mrp}

                                    </span>

                                </div>

{
product.availability === "IN_STOCK"

?

<span className="stock in-stock">

In Stock

</span>

:

<span className="stock out-stock">

Out Of Stock

</span>

}

                            </div>

                            {/* Buttons */}

                            <div className="product-buttons">

                                <Link

                                    to={`/shop/product/${product._id}`}

                                    className="details-btn"

                                >

                                    View Details

                                </Link>

                            <button
className="cart-btn"
onClick={()=>
handleAddToCart(product)
}
>
Add To Cart
</button>

<button
    className="wishlist-btn"
    onClick={() => handleWishlist(product)}
>
    ❤️
</button>

                            </div>

                        </div>

                    ))

                )

                :

                (

                    <div className="no-products">

                        No Products Found

                    </div>

                )

            }

        </div>

    )

}

</div>

);

};

export default Shop;