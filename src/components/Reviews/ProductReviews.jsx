import React, {
  useEffect,
  useState
} from "react";

import {
  getProductReviews,
  getProductRatingSummary
} from "../../services/reviewService";


const ProductReviews = ({
  productId
}) => {

  const [reviews, setReviews] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =======================================
  // LOAD PRODUCT REVIEWS
  // =======================================

  useEffect(() => {

    if (!productId) {
      return;
    }

    loadReviews();

  }, [productId]);


  const loadReviews = async () => {

    try {

      setLoading(true);


      const [
        reviewsResponse,
        summaryResponse
      ] = await Promise.all([

        getProductReviews(productId),

        getProductRatingSummary(productId)

      ]);


      // =======================================
      // REVIEWS RESPONSE
      // Supports:
      // { reviews: [] }
      // { data: [] }
      // =======================================

      const reviewsData =
        reviewsResponse?.data?.reviews ||
        reviewsResponse?.data?.data ||
        [];


      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : []
      );


      // =======================================
      // SUMMARY RESPONSE
      // Supports:
      // { summary: {} }
      // { data: {} }
      // =======================================

      const summaryData =
        summaryResponse?.data?.summary ||
        summaryResponse?.data?.data ||
        null;


      setSummary(summaryData);


    } catch (error) {

      console.error(
        "REVIEWS ERROR:",
        error
      );

      setReviews([]);

      setSummary(null);

    } finally {

      setLoading(false);

    }

  };


  // =======================================
  // LOADING
  // =======================================

  if (loading) {

    return (

      <section className="product-reviews">

        <h2>
          Customer Reviews
        </h2>

        <p>
          Loading reviews...
        </p>

      </section>

    );

  }


  return (

    <section className="product-reviews">

      <h2>
        Customer Reviews
      </h2>


      {/* =================================
          RATING SUMMARY
      ================================= */}

      <div className="rating-summary">

        <div className="average-rating">

          <strong>
            {summary?.averageRating ?? 0}
          </strong>

          <span>
            ⭐
          </span>

        </div>


        <p>

          {summary?.totalReviews ?? 0}

          {" "}

          Reviews

        </p>


        {/* 5 STAR */}

        <div>

          ⭐⭐⭐⭐⭐

          {" "}

          {summary?.fiveStar ?? 0}

        </div>


        {/* 4 STAR */}

        <div>

          ⭐⭐⭐⭐

          {" "}

          {summary?.fourStar ?? 0}

        </div>


        {/* 3 STAR */}

        <div>

          ⭐⭐⭐

          {" "}

          {summary?.threeStar ?? 0}

        </div>


        {/* 2 STAR */}

        <div>

          ⭐⭐

          {" "}

          {summary?.twoStar ?? 0}

        </div>


        {/* 1 STAR */}

        <div>

          ⭐

          {" "}

          {summary?.oneStar ?? 0}

        </div>

      </div>


      {/* =================================
          REVIEW LIST
      ================================= */}

      <div className="review-list">

        {reviews.length === 0 ? (

          <p>
            No approved reviews yet.
          </p>

        ) : (

          reviews.map((review) => (

            <div
              className="review-card"
              key={review._id}
            >

              {/* USER */}

              <div className="review-user">

                <strong>

                  {review.user?.firstName || "Customer"}

                  {" "}

                  {review.user?.lastName || ""}

                </strong>

              </div>


              {/* RATING */}

              <div className="review-rating">

                {"★".repeat(
                  Number(review.rating) || 0
                )}

                {"☆".repeat(
                  5 - (Number(review.rating) || 0)
                )}

              </div>


              {/* COMMENT */}

              <p>

                {review.comment}

              </p>


              {/* VERIFIED PURCHASE */}

              {review.verifiedPurchase && (

                <small>

                  ✓ Verified Purchase

                </small>

              )}

            </div>

          ))

        )}

      </div>

    </section>

  );

};


export default ProductReviews;