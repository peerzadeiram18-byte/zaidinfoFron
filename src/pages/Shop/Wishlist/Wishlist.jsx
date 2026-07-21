import React, { useEffect, useState } from "react";

import "./Wishlist.css";

import { Link } from "react-router-dom";

import {

    getWishlist,

    removeFromWishlist

} from "../../../services/wishlistService";

import {

    addToCart

} from "../../../services/cartService";

const Wishlist = () => {

    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadWishlist();

    }, []);

    const loadWishlist = async () => {

        try {

            setLoading(true);

            const res = await getWishlist();

            console.log(res.data);

            setWishlist(

                res.data.wishlist.products || []

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const handleRemove = async (productId) => {

        try {

            await removeFromWishlist(productId);

            loadWishlist();

        }

        catch (error) {

            console.log(error);

            alert(error.response?.data?.message);

        }

    };

    const handleAddToCart = async (productId) => {

        try {

            await addToCart({

                product: productId,

                quantity: 1

            });

            alert("Added To Cart");

        }

        catch (error) {

            console.log(error);

            alert(error.response?.data?.message);

        }

    };

    if (loading) {

        return (

            <div className="loading">

                Loading Wishlist...

            </div>

        );

    }

    return (

        <div className="wishlist-page">

            <div className="wishlist-header">

                <h2>

                    My Wishlist

                </h2>

            </div>

            {

                wishlist.length === 0 ?

                (

                    <div className="empty-wishlist">

                        <h3>

                            Wishlist Is Empty

                        </h3>

                        <Link

                            to="/shop"

                            className="shop-btn"

                        >

                            Continue Shopping

                        </Link>

                    </div>

                )

                :

                (

                    <div className="wishlist-grid">

                        {

                            wishlist.map((item) => (

                                <div

                                    className="wishlist-card"

                                    key={item.product._id}

                                >

                                    <img

                                        src={

                                            item.product.imageUrl

                                                ?

                                                `http://localhost:5000${item.product.imageUrl}`

                                                :

                                                "/no-image.png"

                                        }

                                        alt={item.product.title}

                                    />

                                    <h3>

                                        {item.product.title}

                                    </h3>

                                    <p>

                                        ₹ {item.product.discountedPrice}

                                    </p>

                                    <div className="wishlist-buttons">

                                        <button

                                            onClick={() =>

                                                handleAddToCart(

                                                    item.product._id

                                                )

                                            }

                                        >

                                            Add To Cart

                                        </button>

                                        <button

                                            className="remove-btn"

                                            onClick={() =>

                                                handleRemove(

                                                    item.product._id

                                                )

                                            }

                                        >

                                            Remove

                                        </button>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default Wishlist;