import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaLaptop, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import RentalCard from "../../components/rental/RentalCard";
import { getRentalProducts } from "../../services/rentalApi";

import "./RentalListing.css";

const RentalListing = () => {
  const navigate = useNavigate();

  const [rentalProducts, setRentalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD RENTAL PRODUCTS
  |--------------------------------------------------------------------------
  */

  const loadRentalProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRentalProducts();

      console.log(
        "Rental Products API Response:",
        response
      );

      /*
       * Support different backend response structures.
       */

      let products = [];

      if (Array.isArray(response)) {
        products = response;
      } else if (Array.isArray(response?.data)) {
        products = response.data;
      } else if (
        Array.isArray(response?.data?.data)
      ) {
        products = response.data.data;
      } else if (
        Array.isArray(response?.data?.products)
      ) {
        products = response.data.products;
      } else if (
        Array.isArray(response?.products)
      ) {
        products = response.products;
      }

      setRentalProducts(products);
    } catch (err) {
      console.error(
        "Failed to load rental products:",
        err
      );

      setError(
        err?.message ||
          err?.error ||
          "Unable to load rental products."
      );

      setRentalProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentalProducts();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return rentalProducts;
    }

    return rentalProducts.filter((item) => {
      const product =
        item?.product ||
        item?.productId ||
        {};

      const name =
        product?.name ||
        item?.name ||
        "";

      const brand =
        typeof product?.brand === "object"
          ? product?.brand?.name
          : product?.brand || "";

      const category =
        typeof product?.category === "object"
          ? product?.category?.name
          : product?.category || "";

      const sku =
        product?.sku ||
        item?.sku ||
        "";

      const searchableText = `
        ${name}
        ${brand}
        ${category}
        ${sku}
      `.toLowerCase();

      return searchableText.includes(searchText);
    });
  }, [rentalProducts, search]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="rental-listing-page">

      {/* HERO */}
      <section className="rental-listing-hero">
        <div className="rental-hero-content">
          <div className="rental-hero-icon">
            <FaLaptop />
          </div>

          <div>
            <h1>Rent a Laptop</h1>

            <p>
              Choose from our available laptops and
              rent the perfect device for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="rental-listing-container">

        {/* HEADER */}
        <div className="rental-listing-header">

          <div>
            <h2>Available Laptops</h2>

            {!loading && (
              <p>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "laptop"
                  : "laptops"}{" "}
                available for rent
              </p>
            )}
          </div>

          {/* SEARCH */}
          <div className="rental-search-box">
            <FaSearch />

            <input
              type="text"
              placeholder="Search laptop, brand, category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rental-loading">
            <div className="rental-spinner"></div>

            <p>
              Loading rental laptops...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rental-error">

            <div className="rental-error-icon">
              ⚠️
            </div>

            <h3>
              Unable to load rental laptops
            </h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadRentalProducts}
            >
              <FaRedo />
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="rental-empty">

              <FaLaptop />

              <h3>
                {search
                  ? "No laptops found"
                  : "No rental laptops available"}
              </h3>

              <p>
                {search
                  ? "Try searching with another laptop name or brand."
                  : "There are currently no laptops available for rent."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {/* GRID */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="rental-products-grid">
              {filteredProducts.map(
                (rentalProduct, index) => (
                  <RentalCard
                    key={
                      rentalProduct?._id ||
                      rentalProduct?.productId?._id ||
                      index
                    }
                    rentalProduct={rentalProduct}
                  />
                )
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default RentalListing;