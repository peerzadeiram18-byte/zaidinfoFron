import React, { useState } from "react";
import { toast } from "react-toastify";

import { createReview } from "./../../services/reviewService";

import "./ReviewModal.css";
const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = API_URL?.replace(
    /\/api\/?$/,
    ""
);

const getImageUrl = (image) => {

    if (!image) {
        return "/placeholder-product.png";
    }

    if (
        typeof image === "string" &&
        (
            image.startsWith("http://") ||
            image.startsWith("https://")
        )
    ) {
        return image;
    }

    const imagePath =
        typeof image === "string"
            ? image
            : (
                image?.url ||
                image?.path ||
                image?.image ||
                ""
            );

    if (!imagePath) {
        return "/placeholder-product.png";
    }

    return `${BASE_URL}${
        imagePath.startsWith("/")
            ? imagePath
            : `/${imagePath}`
    }`;
};



const ReviewModal = ({
    product,
    order,
    onClose,
    onSuccess
}) => {

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================================
    // SUBMIT REVIEW
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ======================================
        // VALIDATION
        // ======================================

        if (!rating || rating < 1 || rating > 5) {

            toast.error(
                "Please select a rating."
            );

            return;

        }


        if (!comment.trim()) {

            toast.error(
                "Please write your review."
            );

            return;

        }


        if (comment.trim().length < 3) {

            toast.error(
                "Review must contain at least 3 characters."
            );

            return;

        }


        // ======================================
        // GET PRODUCT ID
        // ======================================

        const productId =
            product?._id || product;


        // ======================================
        // GET ORDER ID
        // ======================================

        const orderId =
            order?._id || order;


        console.log(
            "================================="
        );

        console.log(
            "REVIEW PRODUCT:",
            product
        );

        console.log(
            "REVIEW PRODUCT ID:",
            productId
        );

        console.log(
            "REVIEW ORDER:",
            order
        );

        console.log(
            "REVIEW ORDER ID:",
            orderId
        );

        console.log(
            "================================="
        );


        // ======================================
        // CHECK IDS
        // ======================================

        if (!productId) {

            toast.error(
                "Product information is missing."
            );

            console.error(
                "PRODUCT ID MISSING:",
                product
            );

            return;

        }


        if (!orderId) {

            toast.error(
                "Order information is missing."
            );

            console.error(
                "ORDER ID MISSING:",
                order
            );

            return;

        }


        try {

            setLoading(true);


            // ==================================
            // FINAL REVIEW DATA
            // ==================================

            const reviewData = {

                product: productId,

                order: orderId,

                rating: Number(rating),

                comment: comment.trim(),

                images: []

            };


            console.log(
                "================================="
            );

            console.log(
                "FINAL REVIEW DATA:",
                reviewData
            );

            console.log(
                "================================="
            );


            // ==================================
            // CREATE REVIEW API
            // ==================================

            const response =
                await createReview(
                    reviewData
                );


            console.log(
                "CREATE REVIEW RESPONSE:",
                response
            );


            // ==================================
            // SUCCESS
            // ==================================

            toast.success(

                response?.message ||

                response?.data?.message ||

                "Review submitted successfully. It is waiting for admin approval."

            );


            // ==================================
            // CALLBACK
            // ==================================

            if (onSuccess) {

                onSuccess(
                    response?.review ||
                    response?.data?.review
                );

            }


            // ==================================
            // CLOSE MODAL
            // ==================================

            if (onClose) {

                onClose();

            }

        }

        catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "CREATE REVIEW ERROR:",
                error
            );

            console.error(
                "BACKEND ERROR:",
                error?.response?.data
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "================================="
            );


            // ==================================
            // BACKEND MESSAGE
            // ==================================

            const backendMessage =

                error?.response?.data?.message ||

                error?.response?.data?.error ||

                "Failed to submit review.";


            toast.error(
                backendMessage
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        if (onClose) {
            onClose();
        }

    };


    return (

        <div
            className="review-modal-overlay"
            onClick={handleClose}
        >

            <div
                className="review-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* =================================
                    HEADER
                ================================= */}

                <div className="review-modal-header">

                    <h2>
                        Review Product
                    </h2>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="review-close-btn"
                        disabled={loading}
                    >
                        ×
                    </button>

                </div>


                {/* =================================
                    PRODUCT
                ================================= */}

                <div className="review-product">
{/* 
                    <img
                        src={
                            product?.images?.[0] ||
                            "/placeholder-product.png"
                        }
                        alt={
                            product?.name ||
                            "Product"
                        }
                    /> */}
                    <img
    src={getImageUrl(product?.images?.[0])}
    alt={
        product?.name ||
        "Product"
    }
/>


                    <div>

                        <h3>

                            {product?.name ||
                                "Product"}

                        </h3>


                        <p>
                            How was your experience
                            with this product?
                        </p>

                    </div>

                </div>


                {/* =================================
                    FORM
                ================================= */}

                <form
                    onSubmit={handleSubmit}
                >


                    {/* =============================
                        RATING
                    ============================= */}

                    <div className="rating-section">

                        <label>
                            Your Rating
                        </label>


                        <div className="stars">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating
                                                ? "star active"
                                                : "star"
                                        }
                                        onClick={() =>
                                            setRating(star)
                                        }
                                        disabled={loading}
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>


                        {rating > 0 && (

                            <p>
                                {rating} / 5
                            </p>

                        )}

                    </div>


                    {/* =============================
                        COMMENT
                    ============================= */}

                    <div className="comment-section">

                        <label>
                            Your Review
                        </label>


                        <textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Write your review..."
                            maxLength={1000}
                            rows={5}
                            disabled={loading}
                        />


                        <small>
                            {comment.length}/1000
                        </small>

                    </div>


                    {/* =============================
                        SUBMIT
                    ============================= */}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            rating === 0 ||
                            !comment.trim()
                        }
                        className="submit-review-btn"
                    >

                        {loading
                            ? "Submitting..."
                            : "Submit Review"}

                    </button>


                </form>

            </div>

        </div>

    );

};


export default ReviewModal;