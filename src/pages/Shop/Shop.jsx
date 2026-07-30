import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import "./Shop.css";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    getShopProducts
} from "../../services/productService";

import {
    addToCart
} from "../../services/cartService";

import {
    addToWishlist
} from "../../services/wishlistService";

import {
    getShopInventory
} from "../../services/inventoryService";


const Shop = () => {

    const navigate = useNavigate();


    // ==================================================
    // STATES
    // ==================================================

    const [products, setProducts] =
        useState([]);

    const [inventory, setInventory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [inventoryLoading, setInventoryLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [brand, setBrand] =
        useState("");

    const [sort, setSort] =
        useState("");

    const [addingCartId, setAddingCartId] =
        useState(null);

    const [wishlistLoadingId, setWishlistLoadingId] =
        useState(null);


    // ==================================================
    // LOAD SHOP DATA
    // ==================================================

    useEffect(() => {

        loadShopData();

    }, []);


    const loadShopData = async () => {

        try {

            setLoading(true);
            setInventoryLoading(true);


            // ==========================================
            // PRODUCTS
            // ==========================================

            const productResponse =
                await getShopProducts();


            console.log(
                "SHOP PRODUCTS RESPONSE:",
                productResponse.data
            );


            const productData =
                Array.isArray(
                    productResponse.data?.data
                )

                    ? productResponse.data.data

                    : [];


            setProducts(
                productData
            );


            // ==========================================
            // PUBLIC INVENTORY
            // ==========================================

            try {

                const inventoryResponse =
                    await getShopInventory();


                console.log(
                    "SHOP INVENTORY RESPONSE:",
                    inventoryResponse.data
                );


                const inventoryData =
                    Array.isArray(
                        inventoryResponse.data?.data
                    )

                        ? inventoryResponse.data.data

                        : [];


                setInventory(
                    inventoryData
                );

            }

            catch (inventoryError) {

                console.error(
                    "SHOP INVENTORY ERROR:",
                    inventoryError
                );


                console.error(
                    "INVENTORY BACKEND RESPONSE:",
                    inventoryError.response?.data
                );


                setInventory([]);

            }

        }

        catch (error) {

            console.error(
                "SHOP DATA ERROR:",
                error
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            setProducts([]);

        }

        finally {

            setLoading(false);

            setInventoryLoading(false);

        }

    };


    // ==================================================
    // INVENTORY MAP
    // ==================================================

    const inventoryMap =
        useMemo(() => {

            const map = {};


            inventory.forEach(
                (item) => {

                    const productId =
                        item.product?._id ||
                        item.product;


                    if (!productId) {

                        return;

                    }


                    const currentStock =
                        Number(
                            item.currentStock || 0
                        );


                    const reservedStock =
                        Number(
                            item.reservedStock || 0
                        );


                    const availableStock =
                        item.availableStock !== undefined

                            ?

                            Number(
                                item.availableStock
                            )

                            :

                            Math.max(
                                currentStock -
                                reservedStock,
                                0
                            );


                    map[
                        productId.toString()
                    ] = {

                        ...item,

                        currentStock,

                        reservedStock,

                        availableStock

                    };

                }

            );


            return map;

        }, [inventory]);


    // ==================================================
    // GET PRODUCT INVENTORY
    // ==================================================

    const getProductInventory =
        (product) => {

            if (!product?._id) {

                return {

                    currentStock: 0,

                    reservedStock: 0,

                    availableStock: 0,

                    status:
                        "OUT_OF_STOCK"

                };

            }


            const item =
                inventoryMap[
                    product._id.toString()
                ];


            if (!item) {

                return {

                    currentStock: 0,

                    reservedStock: 0,

                    availableStock: 0,

                    status:
                        "OUT_OF_STOCK"

                };

            }


            return item;

        };


    // ==================================================
    // FILTER PRODUCTS
    // ==================================================

    const filteredProducts =
        useMemo(() => {

            let data = [
                ...products
            ];


            // SEARCH

            if (
                search.trim()
            ) {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                data =
                    data.filter(
                        (product) => {

                            const name =
                                (
                                    product.name ||
                                    ""
                                ).toLowerCase();


                            const sku =
                                (
                                    product.sku ||
                                    ""
                                ).toLowerCase();


                            const categoryName =
                                (
                                    product.category?.name ||
                                    ""
                                ).toLowerCase();


                            const brandName =
                                (
                                    product.brand?.name ||
                                    ""
                                ).toLowerCase();


                            return (

                                name.includes(
                                    searchText
                                )

                                ||

                                sku.includes(
                                    searchText
                                )

                                ||

                                categoryName.includes(
                                    searchText
                                )

                                ||

                                brandName.includes(
                                    searchText
                                )

                            );

                        }

                    );

            }


            // CATEGORY

            if (category) {

                data =
                    data.filter(

                        product =>
                            product.category?.name ===
                            category

                    );

            }


            // BRAND

            if (brand) {

                data =
                    data.filter(

                        product =>
                            product.brand?.name ===
                            brand

                    );

            }


            // PRICE LOW

            if (
                sort === "low"
            ) {

                data.sort(

                    (a, b) =>

                        Number(
                            a.pricing?.sellingPrice || 0
                        )

                        -

                        Number(
                            b.pricing?.sellingPrice || 0
                        )

                );

            }


            // PRICE HIGH

            if (
                sort === "high"
            ) {

                data.sort(

                    (a, b) =>

                        Number(
                            b.pricing?.sellingPrice || 0
                        )

                        -

                        Number(
                            a.pricing?.sellingPrice || 0
                        )

                );

            }


            return data;

        }, [

            products,
            search,
            category,
            brand,
            sort

        ]);


    // ==================================================
    // ADD TO CART
    // ==================================================

const handleAddToCart = async (product) => {

    // ==================================================
    // CHECK LOGIN
    // ==================================================

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please Login First"
        );

        navigate(
            "/login"
        );

        return;

    }


    // ==================================================
    // CHECK PRODUCT
    // ==================================================

    if (!product?._id) {

        alert(
            "Invalid product"
        );

        return;

    }


    // ==================================================
    // CHECK PRICE
    // ==================================================

    const sellingPrice =
        Number(
            product.pricing?.sellingPrice || 0
        );


    if (
        sellingPrice <= 0
    ) {

        alert(
            "Product price is not available"
        );

        return;

    }


    // ==================================================
    // CHECK INVENTORY
    // ==================================================

    const stock =
        getProductInventory(
            product
        );


    const availableStock =
        Number(
            stock.availableStock || 0
        );


    if (
        availableStock <= 0
    ) {

        alert(
            "Product is currently out of stock"
        );

        return;

    }


    // ==================================================
    // ADD TO CART
    // ==================================================

    try {

        setAddingCartId(
            product._id
        );


        const cartData = {

            product:
                product._id,

            quantity:
                1

        };


        console.log(
            "ADDING PRODUCT TO CART:",
            product._id
        );


        console.log(
            "CART REQUEST DATA:",
            cartData
        );


        const response =
            await addToCart(
                cartData
            );


        console.log(
            "ADD TO CART RESPONSE:",
            response.data
        );


        alert(
            "Product Added To Cart Successfully"
        );


        // Go to cart

        navigate(
            "/cart"
        );

    }

    catch (error) {

        console.error(
            "================================"
        );


        console.error(
            "ADD TO CART ERROR"
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
            "ERROR:",
            error
        );


        console.error(
            "================================"
        );


        alert(

            error.response?.data?.message ||

            "Failed to add product to cart"

        );

    }

    finally {

        setAddingCartId(
            null
        );

    }

};


    // ==================================================
    // WISHLIST
    // ==================================================

    const handleWishlist =
        async (product) => {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "Please Login First"
                );

                navigate(
                    "/login"
                );

                return;

            }


            try {

                setWishlistLoadingId(
                    product._id
                );


                const response =
                    await addToWishlist(
                        product._id
                    );


                console.log(
                    "WISHLIST RESPONSE:",
                    response.data
                );


                alert(
                    "Added To Wishlist"
                );

            }

            catch (error) {

                console.error(
                    "WISHLIST ERROR:",
                    error
                );


                alert(

                    error.response?.data?.message ||

                    "Failed to add to wishlist"

                );

            }

            finally {

                setWishlistLoadingId(
                    null
                );

            }

        };


    // ==================================================
    // IMAGE URL
    // ==================================================

    const getImageUrl =
        (product) => {

            const image =
                product?.images?.[0];


            if (!image) {

                return "/no-image.png";

            }


            const imageUrl =
                typeof image === "string"

                    ?

                    image

                    :

                    image.url;


            if (!imageUrl) {

                return "/no-image.png";

            }


            if (
                imageUrl.startsWith(
                    "http"
                )
            ) {

                return imageUrl;

            }


            return (
                `http://localhost:5000${imageUrl}`
            );

        };


    // ==================================================
    // CATEGORIES
    // ==================================================

    const categories =
        useMemo(() => {

            const values =
                products

                    .map(
                        product =>
                            product.category?.name
                    )

                    .filter(Boolean);


            return [
                ...new Set(values)
            ];

        }, [products]);


    // ==================================================
    // BRANDS
    // ==================================================

    const brands =
        useMemo(() => {

            const values =
                products

                    .map(
                        product =>
                            product.brand?.name
                    )

                    .filter(Boolean);


            return [
                ...new Set(values)
            ];

        }, [products]);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="shop-page">

                <div className="loading">

                    Loading Products...

                </div>

            </div>

        );

    }


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="shop-page">


            <div className="shop-header">

                <div>

                    <h2>
                        Shop
                    </h2>

                    <p>
                        Browse All Products
                    </p>

                </div>


                <div className="product-count">

                    Showing{" "}

                    <strong>
                        {filteredProducts.length}
                    </strong>

                    {" "}products

                </div>

            </div>


            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="shop-filters">


                <input

                    type="text"

                    placeholder="Search Product / SKU..."

                    value={search}

                    onChange={
                        (e) =>
                            setSearch(
                                e.target.value
                            )
                    }

                />


                <select

                    value={category}

                    onChange={
                        (e) =>
                            setCategory(
                                e.target.value
                            )
                    }

                >

                    <option value="">

                        All Categories

                    </option>


                    {
                        categories.map(
                            (name) => (

                                <option
                                    key={name}
                                    value={name}
                                >

                                    {name}

                                </option>

                            )
                        )
                    }

                </select>


                <select

                    value={brand}

                    onChange={
                        (e) =>
                            setBrand(
                                e.target.value
                            )
                    }

                >

                    <option value="">

                        All Brands

                    </option>


                    {
                        brands.map(
                            (name) => (

                                <option
                                    key={name}
                                    value={name}
                                >

                                    {name}

                                </option>

                            )
                        )
                    }

                </select>


                <select

                    value={sort}

                    onChange={
                        (e) =>
                            setSort(
                                e.target.value
                            )
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


            {/* ==========================================
                INVENTORY LOADING
            ========================================== */}

            {
                inventoryLoading && (

                    <div className="inventory-loading">

                        Loading stock information...

                    </div>

                )
            }


            {/* ==========================================
                PRODUCTS
            ========================================== */}

            {
                filteredProducts.length > 0

                    ?

                    (

                        <div className="product-grid">

                            {
                                filteredProducts.map(
                                    (product) => {

                                        const stock =
                                            getProductInventory(
                                                product
                                            );


                                        const currentStock =
                                            Number(
                                                stock.currentStock || 0
                                            );


                                        const reservedStock =
                                            Number(
                                                stock.reservedStock || 0
                                            );


                                        const availableStock =
                                            Number(
                                                stock.availableStock || 0
                                            );


                                        const inStock =
                                            availableStock > 0;


                                        const discount =
                                            Number(
                                                product.pricing?.discount || 0
                                            );


                                        return (

                                            <div
                                                className="product-card"
                                                key={product._id}
                                            >


                                                {/* IMAGE */}

                                                <div className="product-image-box">

                                                    <img

                                                        src={
                                                            getImageUrl(
                                                                product
                                                            )
                                                        }

                                                        alt={
                                                            product.name ||
                                                            "Product"
                                                        }

                                                        className="product-image"

                                                        onError={
                                                            (e) => {

                                                                e.currentTarget.src =
                                                                    "/no-image.png";

                                                            }
                                                        }

                                                    />


                                                    {
                                                        discount > 0 && (

                                                            <span className="discount-badge">

                                                                {discount}%
                                                                {" "}
                                                                OFF

                                                            </span>

                                                        )
                                                    }

                                                </div>


                                                {/* DETAILS */}

                                                <div className="product-info">

                                                    <h3>

                                                        {product.name}

                                                    </h3>


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


                                                    <p className="sku">

                                                        SKU:
                                                        {" "}
                                                        {
                                                            product.sku ||
                                                            "-"
                                                        }

                                                    </p>


                                                    {/* PRICE */}

                                                    <div className="price-section">

                                                        <span className="selling-price">

                                                            ₹{" "}

                                                            {
                                                                product.pricing?.sellingPrice ??
                                                                0
                                                            }

                                                        </span>


                                                        {
                                                            Number(
                                                                product.pricing?.mrp || 0
                                                            ) >
                                                            Number(
                                                                product.pricing?.sellingPrice || 0
                                                            )

                                                            &&

                                                            (

                                                                <span className="mrp-price">

                                                                    ₹{" "}

                                                                    {
                                                                        product.pricing.mrp
                                                                    }

                                                                </span>

                                                            )

                                                        }

                                                    </div>


                                                    {/* STOCK */}

                                                    <div className="stock-information">


                                                        {
                                                            inStock

                                                                ?

                                                                (

                                                                    <>

                                                                        <span className="stock in-stock">

                                                                            In Stock

                                                                        </span>


                                                                        <span className="available-stock">

                                                                            {availableStock}

                                                                            {" "}
                                                                            available

                                                                        </span>

                                                                    </>

                                                                )

                                                                :

                                                                (

                                                                    <span className="stock out-stock">

                                                                        Out Of Stock

                                                                    </span>

                                                                )

                                                        }


                                                        {
                                                            reservedStock > 0 && (

                                                                <span className="reserved-stock">

                                                                    Reserved:
                                                                    {" "}
                                                                    {reservedStock}

                                                                </span>

                                                            )
                                                        }


                                                        {
                                                            inStock &&
                                                            currentStock > 0 &&
                                                            availableStock <= 5 && (

                                                                <span className="low-stock-message">

                                                                    Only{" "}
                                                                    {availableStock}
                                                                    {" "}
                                                                    left

                                                                </span>

                                                            )
                                                        }

                                                    </div>

                                                </div>


                                                {/* BUTTONS */}

                                                <div className="product-buttons">


                                                    <Link

                                                        to={
                                                            `/shop/product/${product._id}`
                                                        }

                                                        className="details-btn"

                                                    >

                                                        View Details

                                                    </Link>


                                                    <button

                                                        className="cart-btn"

                                                        onClick={() =>
                                                            handleAddToCart(
                                                                product
                                                            )
                                                        }

                                                        disabled={
                                                            !inStock ||
                                                            addingCartId ===
                                                            product._id
                                                        }

                                                    >

                                                        {
                                                            addingCartId ===
                                                            product._id

                                                                ?

                                                                "Adding..."

                                                                :

                                                            inStock

                                                                ?

                                                                "Add To Cart"

                                                                :

                                                                "Out Of Stock"

                                                        }

                                                    </button>


                                                    <button

                                                        className="wishlist-btn"

                                                        onClick={() =>
                                                            handleWishlist(
                                                                product
                                                            )
                                                        }

                                                        disabled={
                                                            wishlistLoadingId ===
                                                            product._id
                                                        }

                                                    >

                                                        {
                                                            wishlistLoadingId ===
                                                            product._id

                                                                ?

                                                                "..."

                                                                :

                                                                "❤️"

                                                        }

                                                    </button>

                                                </div>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )

                    :

                    (

                        <div className="no-products">

                            No Products Found

                        </div>

                    )

            }

        </div>

    );

};


export default Shop;