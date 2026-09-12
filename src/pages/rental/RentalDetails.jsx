import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaLaptop,
  FaRedo,
} from "react-icons/fa";

import {
  getRentalProduct,
} from "../../services/rentalApi";

import RentalInfo from "../../components/rental/RentalInfo";
import RentalPricing from "../../components/rental/RentalPricing";
import "./RentalDetails.css";


const API_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (product) => {
  const image =
    product?.images?.[0]?.url ||
    product?.images?.[0]?.image ||
    product?.images?.[0] ||
    product?.primaryImage ||
    product?.image ||
    product?.thumbnail ||
    product?.imageUrl;

  if (!image) {
    return null;
  }

  if (
    typeof image === "string" &&
    (image.startsWith("http://") ||
      image.startsWith("https://"))
  ) {
    return image;
  }

  const baseUrl = API_URL?.replace(
    /\/api\/?$/,
    ""
  );

  return `${baseUrl}/${String(image).replace(
    /^\/+/,
    ""
  )}`;
};

const RentalDetails = () => {
  const { productId } = useParams();

  const navigate = useNavigate();

  const [rentalProduct, setRentalProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRentalProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getRentalProduct(productId);

      console.log(
        "Rental Product Details:",
        response
      );

      let data = null;

      if (response?.data) {
        data = response.data;
      } else {
        data = response;
      }

      if (data?.data) {
        data = data.data;
      }

      setRentalProduct(data);
    } catch (err) {
      console.error(
        "Rental details error:",
        err
      );

      setError(
        err?.message ||
          err?.error ||
          "Unable to load rental details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadRentalProduct();
    }
  }, [productId]);

  const handleRentNow = () => {
    if (!rentalProduct) {
      return;
    }

    const availableQuantity = Number(
      rentalProduct?.availableQuantity || 0
    );

    if (
      rentalProduct?.isAvailableForRent === false ||
      availableQuantity <= 0
    ) {
      return;
    }

    navigate(
      `/rental/request/${productId}`
    );
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="rental-details-page">
        <div className="rental-details-loading">
          <div className="rental-details-spinner" />

          <p>
            Loading rental details...
          </p>
        </div>
      </div>
    );
  }

  /* ERROR */

  if (error || !rentalProduct) {
    return (
      <div className="rental-details-page">
        <div className="rental-details-error">

          <FaLaptop />

          <h2>
            Unable to load rental details
          </h2>

          <p>
            {error ||
              "Rental product not found."}
          </p>

          <div className="rental-error-actions">

            <button
              type="button"
              onClick={loadRentalProduct}
            >
              <FaRedo />
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/rentals")
              }
            >
              Back to Rentals
            </button>

          </div>
        </div>
      </div>
    );
  }

  const product =
    rentalProduct?.product ||
    rentalProduct?.productId ||
    {};

  const imageUrl =
    getImageUrl(product);

  return (
    <div className="rental-details-page">

      {/* TOP BAR */}

      <div className="rental-details-topbar">
        <button
          type="button"
          onClick={() =>
            navigate("/rentals")
          }
        >
          <FaArrowLeft />
          Back to Rentals
        </button>
      </div>

      <main className="rental-details-container">

        {/* PRODUCT */}

        <section className="rental-product-section">

          {/* IMAGE */}

          <div className="rental-details-image-box">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={
                  product?.name ||
                  "Rental laptop"
                }
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";

                  e.currentTarget.nextElementSibling.style.display =
                    "flex";
                }}
              />
            ) : null}

            <div
              className="rental-details-placeholder"
              style={{
                display: imageUrl
                  ? "none"
                  : "flex",
              }}
            >
              <FaLaptop />
            </div>

          </div>

          {/* INFO */}

          <RentalInfo
            rentalProduct={
              rentalProduct
            }
          />

        </section>

        {/* PRICING */}

        <section className="rental-pricing-section">

          <RentalPricing
            rentalProduct={
              rentalProduct
            }
            onRentNow={handleRentNow}
          />

        </section>

      </main>
    </div>
  );
};

export default RentalDetails;