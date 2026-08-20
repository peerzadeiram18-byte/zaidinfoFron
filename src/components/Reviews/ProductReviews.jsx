import React, {
  useEffect,
  useState
} from "react";

import {
  getProductReviews,
  getProductRatingSummary
} from "../../services/reviewService";

import "./ProductReviews.css";


/* =========================================================
   HELPERS
========================================================= */

const getReviewUserName = (review) => {

  const firstName =
    review?.user?.firstName ||
    review?.user?.first_name ||
    review?.customer?.firstName ||
    review?.customer?.first_name ||
    "";

  const lastName =
    review?.user?.lastName ||
    review?.user?.last_name ||
    review?.customer?.lastName ||
    review?.customer?.last_name ||
    "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    review?.user?.name ||
    review?.customer?.name ||
    review?.name ||
    "Customer"
  );
};


/* =========================================================
   NUMBER HELPER
========================================================= */

const toNumber = (value) => {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


/* =========================================================
   EXTRACT REVIEWS
========================================================= */

const extractReviews = (response) => {

  const data =
    response?.data;


  /*
   * Possible:
   *
   * { reviews: [] }
   * { data: [] }
   * { data: { reviews: [] } }
   * { data: { data: [] } }
   */

  if (
    Array.isArray(
      data?.reviews
    )
  ) {
    return data.reviews;
  }


  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
  }


  if (
    Array.isArray(
      data
    )
  ) {
    return data;
  }


  if (
    Array.isArray(
      data?.data?.reviews
    )
  ) {
    return data.data.reviews;
  }


  return [];
};


/* =========================================================
   EXTRACT SUMMARY
========================================================= */

const extractSummary = (response) => {

  console.log(
    "RAW RATING SUMMARY RESPONSE:",
    response
  );


  const root =
    response?.data;


  /*
   * Try all common response structures.
   */

  const summary =
    root?.summary ||
    root?.data?.summary ||
    root?.data ||
    root ||
    {};


  console.log(
    "EXTRACTED RATING SUMMARY:",
    summary
  );


  return summary;
};


/* =========================================================
   NORMALIZE SUMMARY
========================================================= */

const normalizeSummary = (
  summary,
  reviews = []
) => {

  /*
   * Different backend names supported.
   */

  let averageRating =
    toNumber(
      summary?.averageRating ??
      summary?.average ??
      summary?.avgRating ??
      summary?.rating ??
      summary?.average_rating
    );


  let totalReviews =
    toNumber(
      summary?.totalReviews ??
      summary?.total ??
      summary?.count ??
      summary?.reviewCount ??
      summary?.total_reviews
    );


  let fiveStar =
    toNumber(
      summary?.fiveStar ??
      summary?.fiveStars ??
      summary?.rating5 ??
      summary?.five ??
      summary?.five_star ??
      summary?.["5"]
    );


  let fourStar =
    toNumber(
      summary?.fourStar ??
      summary?.fourStars ??
      summary?.rating4 ??
      summary?.four ??
      summary?.four_star ??
      summary?.["4"]
    );


  let threeStar =
    toNumber(
      summary?.threeStar ??
      summary?.threeStars ??
      summary?.rating3 ??
      summary?.three ??
      summary?.three_star ??
      summary?.["3"]
    );


  let twoStar =
    toNumber(
      summary?.twoStar ??
      summary?.twoStars ??
      summary?.rating2 ??
      summary?.two ??
      summary?.two_star ??
      summary?.["2"]
    );


  let oneStar =
    toNumber(
      summary?.oneStar ??
      summary?.oneStars ??
      summary?.rating1 ??
      summary?.one ??
      summary?.one_star ??
      summary?.["1"]
    );


  /*
   * IMPORTANT:
   *
   * If summary API doesn't return
   * proper values, calculate them
   * from the reviews.
   */

  if (
    reviews.length > 0
  ) {

    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };


    let totalRating = 0;


    reviews.forEach(
      (review) => {

        const rating =
          Math.min(
            Math.max(
              toNumber(
                review?.rating
              ),
              1
            ),
            5
          );


        if (
          rating >= 1 &&
          rating <= 5
        ) {

          ratingCounts[rating]++;

          totalRating += rating;

        }

      }
    );


    /*
     * Only fallback when
     * summary values are missing.
     */

    if (
      totalReviews === 0
    ) {

      totalReviews =
        reviews.length;

    }


    if (
      averageRating === 0 &&
      totalReviews > 0
    ) {

      averageRating =
        totalRating /
        totalReviews;

    }


    if (
      fiveStar === 0
    ) {

      fiveStar =
        ratingCounts[5];

    }


    if (
      fourStar === 0
    ) {

      fourStar =
        ratingCounts[4];

    }


    if (
      threeStar === 0
    ) {

      threeStar =
        ratingCounts[3];

    }


    if (
      twoStar === 0
    ) {

      twoStar =
        ratingCounts[2];

    }


    if (
      oneStar === 0
    ) {

      oneStar =
        ratingCounts[1];

    }

  }


  return {

    averageRating:
      Number(
        averageRating
      ).toFixed(1),

    totalReviews,

    fiveStar,

    fourStar,

    threeStar,

    twoStar,

    oneStar

  };

};


/* =========================================================
   STAR COMPONENT
========================================================= */

const Stars = ({
  rating = 0,
  size = "normal"
}) => {

  const safeRating =
    Math.min(
      Math.max(
        Number(rating) || 0,
        0
      ),
      5
    );


  const fullStars =
    Math.floor(
      safeRating
    );


  const emptyStars =
    5 - fullStars;


  return (

    <span
      className={
        `product-review-stars ${
          size === "large"
            ? "stars-large"
            : ""
        }`
      }
    >

      {"★".repeat(fullStars)}

      <span className="empty-stars">
        {"☆".repeat(emptyStars)}
      </span>

    </span>

  );
};


/* =========================================================
   RATING ROW
========================================================= */

const RatingRow = ({
  stars,
  count,
  total
}) => {

  const percentage =
    total > 0
      ? (
          count /
          total
        ) * 100
      : 0;


  return (

    <div className="rating-distribution-row">

      <span className="rating-number">
        {stars}
      </span>

      <span className="rating-star-small">
        ★
      </span>


      <div className="rating-progress">

        <div
          className="rating-progress-fill"
          style={{
            width:
              `${percentage}%`
          }}
        />

      </div>


      <span className="rating-count">
        {count}
      </span>

    </div>

  );
};


/* =========================================================
   COMPONENT
========================================================= */

const ProductReviews = ({
  productId
}) => {

  const [
    reviews,
    setReviews
  ] = useState([]);


  const [
    summary,
    setSummary
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* =======================================================
     LOAD REVIEWS
  ======================================================= */

  useEffect(() => {

    if (!productId) {

      setLoading(false);

      return;

    }


    loadReviews();

  }, [productId]);


  /* =======================================================
     API
  ======================================================= */

  const loadReviews = async () => {

    try {

      setLoading(true);


      /*
       * Run APIs separately.
       *
       * If summary API fails,
       * reviews should still show.
       */

      let reviewsResponse = null;

      let summaryResponse = null;


      try {

        reviewsResponse =
          await getProductReviews(
            productId
          );

      } catch (reviewError) {

        console.error(
          "GET PRODUCT REVIEWS ERROR:",
          reviewError
        );

      }


      try {

        summaryResponse =
          await getProductRatingSummary(
            productId
          );

      } catch (summaryError) {

        console.error(
          "GET RATING SUMMARY ERROR:",
          summaryError
        );

      }


      console.log(
        "================================"
      );

      console.log(
        "PRODUCT ID:",
        productId
      );

      console.log(
        "REVIEWS RESPONSE:",
        reviewsResponse?.data
      );

      console.log(
        "SUMMARY RESPONSE:",
        summaryResponse?.data
      );

      console.log(
        "================================"
      );


      /* ================================================
         REVIEWS
      ================================================= */

      const reviewsData =
        extractReviews(
          reviewsResponse
        );


      console.log(
        "EXTRACTED REVIEWS:",
        reviewsData
      );


      setReviews(
        Array.isArray(
          reviewsData
        )
          ? reviewsData
          : []
      );


      /* ================================================
         SUMMARY
      ================================================= */

      const rawSummary =
        extractSummary(
          summaryResponse
        );


      const normalizedSummary =
        normalizeSummary(
          rawSummary,
          reviewsData
        );


      console.log(
        "NORMALIZED SUMMARY:",
        normalizedSummary
      );


      setSummary(
        normalizedSummary
      );


    } catch (error) {

      console.error(
        "PRODUCT REVIEWS ERROR:",
        error
      );


      setReviews([]);


      setSummary({

        averageRating: "0.0",

        totalReviews: 0,

        fiveStar: 0,

        fourStar: 0,

        threeStar: 0,

        twoStar: 0,

        oneStar: 0

      });

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <section className="product-reviews">

        <div className="reviews-header">

          <h2>
            Customer Reviews
          </h2>

        </div>


        <div className="reviews-loading">

          <div className="reviews-spinner" />

          <p>
            Loading reviews...
          </p>

        </div>

      </section>

    );

  }


  /* =======================================================
     DEFAULT SUMMARY
  ======================================================= */

  const safeSummary =
    summary || {

      averageRating: "0.0",

      totalReviews: 0,

      fiveStar: 0,

      fourStar: 0,

      threeStar: 0,

      twoStar: 0,

      oneStar: 0

    };


  const totalReviews =
    Number(
      safeSummary.totalReviews
    ) || 0;


  /* =======================================================
     RETURN
  ======================================================= */

  return (

    <section className="product-reviews">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="reviews-header">

        <div>

          <span className="reviews-eyebrow">
            CUSTOMER FEEDBACK
          </span>

          <h2>
            Customer Reviews
          </h2>

          <p>
            See what customers are saying
            about this product.
          </p>

        </div>

      </div>


      {/* =================================================
          RATING SUMMARY
      ================================================= */}

      <div className="rating-summary">


        {/* ===============================================
            AVERAGE
        =============================================== */}

        <div className="average-rating">

          <strong>
            {safeSummary.averageRating}
          </strong>


          <Stars
            rating={
              Number(
                safeSummary.averageRating
              )
            }
            size="large"
          />


          <span className="average-review-count">

            {totalReviews}

            {" "}

            {totalReviews === 1
              ? "Review"
              : "Reviews"}

          </span>

        </div>


        {/* ===============================================
            DISTRIBUTION
        =============================================== */}

        <div className="rating-breakdown">

          <h3>
            Rating Breakdown
          </h3>


          <RatingRow
            stars={5}
            count={
              safeSummary.fiveStar
            }
            total={totalReviews}
          />


          <RatingRow
            stars={4}
            count={
              safeSummary.fourStar
            }
            total={totalReviews}
          />


          <RatingRow
            stars={3}
            count={
              safeSummary.threeStar
            }
            total={totalReviews}
          />


          <RatingRow
            stars={2}
            count={
              safeSummary.twoStar
            }
            total={totalReviews}
          />


          <RatingRow
            stars={1}
            count={
              safeSummary.oneStar
            }
            total={totalReviews}
          />

        </div>

      </div>


      {/* =================================================
          REVIEWS TITLE
      ================================================= */}

      <div className="review-list-header">

        <h3>
          Customer Feedback
        </h3>

        <span>
          {reviews.length}

          {" "}

          {reviews.length === 1
            ? "review"
            : "reviews"}

        </span>

      </div>


      {/* =================================================
          REVIEW LIST
      ================================================= */}

      <div className="review-list">

        {reviews.length === 0 ? (

          <div className="no-reviews">

            <div className="no-reviews-icon">
              💬
            </div>

            <h3>
              No reviews yet
            </h3>

            <p>
              Be the first customer to
              review this product.
            </p>

          </div>

        ) : (

          reviews.map(
            (review, index) => {

              const rating =
                Number(
                  review?.rating
                ) || 0;


              const userName =
                getReviewUserName(
                  review
                );


              return (

                <article
                  className="review-card"
                  key={
                    review?._id ||
                    review?.id ||
                    index
                  }
                >


                  {/* ==================================
                      USER
                  ================================== */}

                  <div className="review-user">

                    <div className="review-avatar">

                      {userName
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="review-user-info">

                      <strong>
                        {userName}
                      </strong>


                      {review?.verifiedPurchase && (

                        <span className="verified-badge">

                          ✓ Verified Purchase

                        </span>

                      )}

                    </div>

                  </div>


                  {/* ==================================
                      RATING
                  ================================== */}

                  <div className="review-rating-row">

                    <Stars
                      rating={rating}
                    />

                    <span className="review-rating-number">
                      {rating}.0
                    </span>

                  </div>


                  {/* ==================================
                      COMMENT
                  ================================== */}

                  <p className="review-comment">

                    {review?.comment ||
                      "No comment provided."}

                  </p>


                  {/* ==================================
                      DATE
                  ================================== */}

                  {review?.createdAt && (

                    <small className="review-date">

                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )}

                    </small>

                  )}

                </article>

              );

            }
          )

        )}

      </div>

    </section>

  );

};


export default ProductReviews;