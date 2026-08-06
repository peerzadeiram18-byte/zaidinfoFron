import React, { useEffect, useState } from "react";
import "./ProductList.css";

import {
    getProducts,
    deleteProduct,
    searchProducts
} from "../../../../services/productService";
import { toast } from "react-toastify";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    // ============================================
    // LOAD ALL PRODUCTS
    // ============================================

    const loadProducts = async () => {

        try {

            setLoading(true);

            const res = await getProducts();

            console.log("PRODUCT LIST API RESPONSE:", res.data);

            // Backend response:
            // {
            //   success: true,
            //   message: "...",
            //   data: [...]
            // }

            const productData = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                    ? res.data
                    : [];

            console.log("PRODUCTS SET TO STATE:", productData);

            setProducts(productData);

            setCurrentPage(1);

        } catch (error) {

            console.error("GET PRODUCTS ERROR:", error);

            setProducts([]);

        } finally {

            setLoading(false);

        }

    };

    // ============================================
    // FIRST LOAD
    // ============================================

    useEffect(() => {

        loadProducts();

    }, []);

    // ============================================
    // SEARCH PRODUCTS
    // ============================================

    const handleSearch = async (e) => {

        const keyword = e.target.value;

        setSearch(keyword);

        // If search box empty
        if (!keyword.trim()) {

            loadProducts();

            return;

        }

        try {

            setLoading(true);

            const res = await searchProducts(keyword);

            console.log("SEARCH API RESPONSE:", res.data);

            const searchData = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                    ? res.data
                    : [];

            console.log("SEARCH PRODUCTS:", searchData);

            setProducts(searchData);

            setCurrentPage(1);

        } catch (error) {

            console.error("SEARCH ERROR:", error);

            setProducts([]);

        } finally {

            setLoading(false);

        }

    };

    // ============================================
    // DELETE PRODUCT
    // ============================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setLoading(true);

            console.log("Deleting Product ID:", id);

            await deleteProduct(id);

         toast.success("Product Deleted Successfully");

            // Reload product list
            await loadProducts();

        } catch (error) {

            console.error("DELETE PRODUCT ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    // ============================================
    // PAGINATION
    // ============================================

    const lastIndex = currentPage * itemsPerPage;

    const firstIndex = lastIndex - itemsPerPage;

    const currentProducts = products.slice(
        firstIndex,
        lastIndex
    );

    const totalPages = Math.ceil(
        products.length / itemsPerPage
    );

    // ============================================
    // IMAGE URL
    // ============================================

    const getImageUrl = (product) => {

        if (!product?.images?.length) {
            return null;
        }

        const imageUrl = product.images[0]?.url;

        if (!imageUrl) {
            return null;
        }

        // If backend already returns complete URL
        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        // Backend local image
        return `http://localhost:5000${imageUrl}`;

    };

    // ============================================
    // UI
    // ============================================

    return (

        <div className="product-list">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <h2>Product List</h2>

                    <p>
                        Manage all your products
                    </p>

                </div>

                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={handleSearch}
                    className="search-box"
                />

            </div>


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="loading">

                    Loading Products...

                </div>

            ) : (

                <>

                    {/* ================= TABLE ================= */}

                    <div className="table-container">

                        <table className="product-table">

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>Image</th>

                                    <th>Product Name</th>

                                    <th>Category</th>

                                    <th>Brand</th>

                                    <th>Purchase Price</th>

                                    <th>Selling Price</th>

                                    <th>MRP</th>

                                    <th>Discount</th>

                                    <th>GST</th>

                                    <th>Stock</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentProducts.length > 0 ? (

                                    currentProducts.map(
                                        (product, index) => {

                                            const imageUrl =
                                                getImageUrl(product);

                                            return (

                                                <tr
                                                    key={
                                                        product._id ||
                                                        product.id ||
                                                        index
                                                    }
                                                >

                                                    {/* NUMBER */}

                                                    <td>
                                                        {firstIndex + index + 1}
                                                    </td>


                                                    {/* IMAGE */}

                                                    <td>

                                                        {imageUrl ? (

                                                            <img
                                                                src={imageUrl}
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                className="table-image"
                                                                onError={(e) => {
                                                                    e.target.style.display =
                                                                        "none";
                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="no-image">
                                                                No Image
                                                            </div>

                                                        )}

                                                    </td>


                                                    {/* PRODUCT NAME */}

                                                    <td>

                                                        <strong>
                                                            {product.name ||
                                                                "N/A"}
                                                        </strong>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        {product.category?.name ||
                                                            "N/A"}

                                                    </td>


                                                    {/* BRAND */}

                                                    <td>

                                                        {product.brand?.name ||
                                                            "N/A"}

                                                    </td>


                                                    {/* PURCHASE PRICE */}

                                                    <td>

                                                        ₹{" "}
                                                        {
                                                            product.pricing
                                                                ?.purchasePrice ??
                                                            0
                                                        }

                                                    </td>


                                                    {/* SELLING PRICE */}

                                                    <td>

                                                        ₹{" "}
                                                        {
                                                            product.pricing
                                                                ?.sellingPrice ??
                                                            0
                                                        }

                                                    </td>


                                                    {/* MRP */}

                                                    <td>

                                                        ₹{" "}
                                                        {
                                                            product.pricing
                                                                ?.mrp ??
                                                            0
                                                        }

                                                    </td>


                                                    {/* DISCOUNT */}

                                                    <td>

                                                        {
                                                            product.pricing
                                                                ?.discount ??
                                                            0
                                                        }%

                                                    </td>


                                                    {/* GST */}

                                                    <td>

                                                        {
                                                            product.pricing
                                                                ?.gst ??
                                                            0
                                                        }%

                                                    </td>


                                                    {/* STOCK */}

                                                    <td>

                                                        {
                                                            product.inventory
                                                                ?.currentStock ??
                                                            0
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        {product.status ===
                                                        "ACTIVE" ? (

                                                            <span className="active-status">
                                                                Active
                                                            </span>

                                                        ) : (

                                                            <span className="inactive-status">
                                                                Inactive
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product._id
                                                                )
                                                            }
                                                        >

                                                            Delete

                                                        </button>

                                                    </td>

                                                </tr>

                                            );

                                        }

                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="13"
                                            className="no-products"
                                        >

                                            No Products Found

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ================= PAGINATION ================= */}

                    {totalPages > 1 && (

                        <div className="pagination">

                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }
                            >

                                Previous

                            </button>


                            {[...Array(totalPages)].map(
                                (_, index) => (

                                    <button
                                        type="button"
                                        key={index}
                                        className={
                                            currentPage ===
                                            index + 1
                                                ? "active-page"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                index + 1
                                            )
                                        }
                                    >

                                        {index + 1}

                                    </button>

                                )
                            )}


                            <button
                                type="button"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }
                            >

                                Next

                            </button>

                        </div>

                    )}

                </>

            )}

        </div>

    );

};

export default ProductList;