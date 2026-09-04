import { useEffect, useState } from "react";

import "./StockHistory.css";

import {
    getInventory,
    getStockHistory
} from "../../services/inventoryService";

import { toast } from "react-toastify";


// ======================================================
// API URL
// ======================================================

// const API_URL =
//     import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const BASE_URL =
//     API_URL.replace(/\/api\/?$/, "");


// ======================================================
// API URL
// ======================================================

// ======================================================
// API URL
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = API_URL.replace(/\/api\/?$/, "");


// ======================================================
// COMPONENT
// ===========================================


// ======================================================
// COMPONENT
// ===========================================


// ======================================================
// COMPONENT
// ======================================================

function StockHistory() {

    // ============================================
    // STATES
    // ============================================

    const [products, setProducts] =
        useState([]);

    const [selected, setSelected] =
        useState("");

    const [selectedInventory, setSelectedInventory] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [historyLoading, setHistoryLoading] =
        useState(false);


    // ============================================
    // LOAD INVENTORY
    // ============================================

    useEffect(() => {

        loadInventory();

    }, []);


    const loadInventory = async () => {

        try {

            setLoading(true);

            const response =
                await getInventory();


            console.log(
                "================================="
            );

            console.log(
                "INVENTORY API RESPONSE:"
            );

            console.log(
                response?.data
            );

            console.log(
                "================================="
            );


            // ========================================
            // SUPPORT DIFFERENT API RESPONSE FORMATS
            // ========================================

            const inventoryData =
                response?.data?.data ||
                response?.data?.inventory ||
                response?.data?.data?.inventory ||
                [];


            if (
                Array.isArray(
                    inventoryData
                )
            ) {

                setProducts(
                    inventoryData
                );

            }
            else {

                console.log(
                    "Inventory data is not array:",
                    inventoryData
                );

                setProducts([]);

            }

        }

        catch (error) {

            console.error(
                "INVENTORY LOAD ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to load inventory"
            );


            setProducts([]);

        }

        finally {

            setLoading(false);

        }

    };


    // ============================================
    // PRODUCT CHANGE
    // ============================================

    const handleProductChange = async (e) => {

        const productId =
            e.target.value;


        console.log(
            "SELECTED PRODUCT ID:",
            productId
        );


        setSelected(
            productId
        );


        setHistory([]);


        if (!productId) {

            setSelectedInventory(
                null
            );

            return;

        }


        // ========================================
        // FIND INVENTORY
        // ========================================

        const inventory =
            products.find(

                (item) => {

                    return (
                        String(
                            item.product?._id
                        ) === String(
                            productId
                        )
                    );

                }

            );


        console.log(
            "SELECTED INVENTORY:",
            inventory
        );


        setSelectedInventory(
            inventory || null
        );


        // ========================================
        // LOAD HISTORY
        // ========================================

        await loadHistory(
            productId
        );

    };


    // ============================================
    // LOAD STOCK HISTORY
    // ============================================

    const loadHistory = async (
        productId
    ) => {

        try {

            setHistoryLoading(
                true
            );


            console.log(
                "GETTING STOCK HISTORY FOR:",
                productId
            );


            const response =
                await getStockHistory(
                    productId
                );


            console.log(
                "STOCK HISTORY RESPONSE:",
                response?.data
            );


            // ========================================
            // SUPPORT DIFFERENT RESPONSE FORMATS
            // ========================================

            const historyData =
                response?.data?.data ||
                response?.data?.history ||
                response?.data?.data?.history ||
                [];


            if (
                Array.isArray(
                    historyData
                )
            ) {

                setHistory(
                    historyData
                );

            }

            else {

                setHistory([]);

            }

        }

        catch (error) {

            console.error(
                "STOCK HISTORY ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to load stock history"
            );


            setHistory([]);

        }

        finally {

            setHistoryLoading(
                false
            );

        }

    };


    // ============================================
    // AVAILABLE STOCK
    // ============================================

    const getAvailableStock = (
        inventory
    ) => {

        if (!inventory) {

            return 0;

        }


        const current =
            Number(
                inventory.currentStock || 0
            );


        const reserved =
            Number(
                inventory.reservedStock || 0
            );


        return Math.max(
            current - reserved,
            0
        );

    };


    // ============================================
    // STOCK STATUS
    // ============================================

    /*
        0       = OUT OF STOCK
        1 - 5   = LOW STOCK
        6+      = IN STOCK

        Backend status par depend nahi karna.
        Current + Reserved stock se calculate hoga.
    */

    const getStockStatus = (
        inventory
    ) => {

        if (!inventory) {

            return "OUT_OF_STOCK";

        }


        const currentStock =
            Number(
                inventory.currentStock || 0
            );


        const reservedStock =
            Number(
                inventory.reservedStock || 0
            );


        const availableStock =
            Math.max(
                currentStock -
                reservedStock,
                0
            );


        // ========================================
        // OUT OF STOCK
        // ========================================

        if (
            availableStock <= 0
        ) {

            return "OUT_OF_STOCK";

        }


        // ========================================
        // LOW STOCK
        // ========================================

        if (
            availableStock >= 1 &&
            availableStock <= 5
        ) {

            return "LOW_STOCK";

        }


        // ========================================
        // IN STOCK
        // ========================================

        return "IN_STOCK";

    };


    // ============================================
    // STATUS TEXT
    // ============================================

    const getStatusText = (
        status
    ) => {

        switch (status) {

            case "IN_STOCK":

                return "In Stock";


            case "LOW_STOCK":

                return "Low Stock";


            case "OUT_OF_STOCK":

                return "Out Of Stock";


            default:

                return "-";

        }

    };


    // ============================================
    // UNIQUE STATUS CLASS
    // ============================================

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "IN_STOCK":

                return "zaid-stock-history-status zaid-stock-history-status-in";


            case "LOW_STOCK":

                return "zaid-stock-history-status zaid-stock-history-status-low";


            case "OUT_OF_STOCK":

                return "zaid-stock-history-status zaid-stock-history-status-out";


            default:

                return "zaid-stock-history-status";

        }

    };


    // ============================================
    // UNIQUE TRANSACTION CLASS
    // ============================================

    const getTransactionClass = (
        type
    ) => {

        switch (type) {

            case "STOCK_IN":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-in";


            case "STOCK_OUT":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-out";


            case "ORDER":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-order";


            case "RETURN":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-return";


            case "REPAIR_USAGE":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-repair";


            case "RENTAL_OUT":

                return "zaid-stock-history-transaction zaid-stock-history-transaction-rental";


            default:

                return "zaid-stock-history-transaction";

        }

    };


    // ============================================
    // TRANSACTION LABEL
    // ============================================

    const getTransactionLabel = (
        type
    ) => {

        switch (type) {

            case "STOCK_IN":

                return "Stock In";


            case "STOCK_OUT":

                return "Stock Out";


            case "ORDER":

                return "Order";


            case "RETURN":

                return "Return";


            case "REPAIR_USAGE":

                return "Repair Usage";


            case "RENTAL_OUT":

                return "Rental Out";


            default:

                return type || "-";

        }

    };


    // ============================================
    // FORMAT DATE
    // ============================================

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "-";

        }


        try {

            return new Date(
                date
            ).toLocaleString();

        }

        catch {

            return "-";

        }

    };


    // ============================================
    // IMAGE URL
    // ============================================

    const getImageUrl = (
        image
    ) => {

        if (!image) {

            return "";

        }


        // ========================================
        // STRING IMAGE
        // ========================================

        if (
            typeof image === "string"
        ) {

            if (
                image.startsWith("http://") ||
                image.startsWith("https://")
            ) {

                return image;

            }


            const cleanImage =
                image.startsWith("/")
                    ? image
                    : `/${image}`;


            return `${BASE_URL}${cleanImage}`;

        }


        // ========================================
        // OBJECT IMAGE
        // ========================================

        if (
            typeof image === "object"
        ) {

            const imageUrl =
                image.url ||
                image.path ||
                image.image ||
                image.src ||
                "";


            if (!imageUrl) {

                return "";

            }


            if (
                imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")
            ) {

                return imageUrl;

            }


            const cleanImage =
                imageUrl.startsWith("/")
                    ? imageUrl
                    : `/${imageUrl}`;


            return `${BASE_URL}${cleanImage}`;

        }


        return "";

    };


    // ============================================
    // GET PRODUCT IMAGE
    // ============================================

    const getProductImage = (
        product
    ) => {

        if (!product) {

            return "";

        }


        // ========================================
        // IMAGES ARRAY
        // ========================================

        if (
            Array.isArray(
                product.images
            ) &&
            product.images.length > 0
        ) {

            return getImageUrl(
                product.images[0]
            );

        }


        // ========================================
        // SINGLE IMAGE FIELDS
        // ========================================

        return getImageUrl(
            product.image ||
            product.primaryImage ||
            product.thumbnail ||
            product.imageUrl
        );

    };


    // ============================================
    // LOADING
    // ============================================

    if (loading) {

        return (

            <div className="zaid-stock-history-page">

                <div className="zaid-stock-history-loading">

                    Loading inventory...

                </div>

            </div>

        );

    }


    // ============================================
    // UI
    // ============================================

    return (

        <div className="zaid-stock-history-page">


            {/* ====================================
                HEADER
            ==================================== */}

            <div className="zaid-stock-history-header">

                <div>

                    <h1>
                        Stock History
                    </h1>

                    <p>
                        View product inventory and stock movement history.
                    </p>

                </div>


                {/* ==================================
                    PRODUCT SELECT
                ================================== */}

                <div className="zaid-stock-history-select-wrapper">

                    <label>
                        Select Product
                    </label>


                    <select

                        value={selected}

                        onChange={
                            handleProductChange
                        }

                    >

                        <option value="">

                            Select Product

                        </option>


                        {

                            products.length > 0

                                ?

                                products.map(
                                    (item) => {

                                        if (
                                            !item.product
                                        ) {

                                            return null;

                                        }


                                        const productId =
                                            item.product._id;


                                        const availableStock =
                                            getAvailableStock(
                                                item
                                            );


                                        const stockStatus =
                                            getStockStatus(
                                                item
                                            );


                                        return (

                                            <option

                                                key={
                                                    productId
                                                }

                                                value={
                                                    productId
                                                }

                                            >

                                                {
                                                    item.product.name
                                                }

                                                {" - Stock: "}

                                                {
                                                    availableStock
                                                }

                                                {" - "}

                                                {
                                                    getStatusText(
                                                        stockStatus
                                                    )
                                                }

                                            </option>

                                        );

                                    }

                                )

                                :

                                (

                                    <option
                                        disabled
                                    >

                                        No Products Found

                                    </option>

                                )

                        }

                    </select>

                </div>

            </div>


            {/* ====================================
                SELECTED PRODUCT
            ==================================== */}

            {

                selectedInventory && (

                    <div className="zaid-stock-history-product-card">


                        {/* ==================================
                            PRODUCT INFO
                        ================================== */}

                        <div className="zaid-stock-history-product-info">


                            {/* PRODUCT IMAGE */}

                            <div className="zaid-stock-history-product-image">

                                {

                                    getProductImage(
                                        selectedInventory.product
                                    )

                                        ?

                                        (

                                            <img

                                                src={
                                                    getProductImage(
                                                        selectedInventory.product
                                                    )
                                                }

                                                alt={
                                                    selectedInventory
                                                        .product
                                                        ?.name ||
                                                    "Product"
                                                }

                                            />

                                        )

                                        :

                                        (

                                            <div className="zaid-stock-history-no-image">

                                                No Image

                                            </div>

                                        )

                                }

                            </div>


                            {/* ==================================
                                PRODUCT DETAILS
                            ================================== */}

                            <div className="zaid-stock-history-product-details">

                                <h2>

                                    {
                                        selectedInventory
                                            .product
                                            ?.name ||
                                        "-"
                                    }

                                </h2>


                                <div className="zaid-stock-history-product-meta">


                                    <span>

                                        SKU:

                                        {" "}

                                        {
                                            selectedInventory
                                                .product
                                                ?.sku ||
                                            "-"
                                        }

                                    </span>


                                    <span>

                                        Brand:

                                        {" "}

                                        {
                                            selectedInventory
                                                .product
                                                ?.brand
                                                ?.name ||
                                            "-"
                                        }

                                    </span>


                                    <span>

                                        Category:

                                        {" "}

                                        {
                                            selectedInventory
                                                .product
                                                ?.category
                                                ?.name ||
                                            "-"
                                        }

                                    </span>


                                </div>

                            </div>


                            {/* ==================================
                                STATUS
                            ================================== */}

                            <div className="zaid-stock-history-status-wrapper">

                                <span

                                    className={
                                        getStatusClass(
                                            getStockStatus(
                                                selectedInventory
                                            )
                                        )
                                    }

                                >

                                    {
                                        getStatusText(
                                            getStockStatus(
                                                selectedInventory
                                            )
                                        )
                                    }

                                </span>

                            </div>

                        </div>


                        {/* ==================================
                            STOCK SUMMARY
                        ================================== */}

                        <div className="zaid-stock-history-summary">


                            {/* CURRENT */}

                            <div className="zaid-stock-history-summary-box">

                                <span>
                                    Current Stock
                                </span>

                                <strong>

                                    {
                                        selectedInventory
                                            .currentStock ??
                                        0
                                    }

                                </strong>

                                <small>

                                    {
                                        selectedInventory.unit ||
                                        "piece"
                                    }

                                </small>

                            </div>


                            {/* RESERVED */}

                            <div className="zaid-stock-history-summary-box">

                                <span>
                                    Reserved Stock
                                </span>

                                <strong>

                                    {
                                        selectedInventory
                                            .reservedStock ??
                                        0
                                    }

                                </strong>

                                <small>
                                    Pending orders
                                </small>

                            </div>


                            {/* AVAILABLE */}

                            <div className="zaid-stock-history-summary-box">

                                <span>
                                    Available Stock
                                </span>

                                <strong>

                                    {
                                        getAvailableStock(
                                            selectedInventory
                                        )
                                    }

                                </strong>

                                <small>
                                    Available for sale
                                </small>

                            </div>


                            {/* MINIMUM */}

                            <div className="zaid-stock-history-summary-box">

                                <span>
                                    Minimum Stock
                                </span>

                                <strong>

                                    {
                                        selectedInventory
                                            .minimumStock ??
                                        0
                                    }

                                </strong>

                                <small>
                                    Alert level
                                </small>

                            </div>


                            {/* MAXIMUM */}

                            <div className="zaid-stock-history-summary-box">

                                <span>
                                    Maximum Stock
                                </span>

                                <strong>

                                    {
                                        selectedInventory
                                            .maximumStock ??
                                        0
                                    }

                                </strong>

                                <small>
                                    Capacity
                                </small>

                            </div>


                        </div>


                    </div>

                )

            }


            {/* ====================================
                HISTORY SECTION
            ==================================== */}

            <div className="zaid-stock-history-section">


                <div className="zaid-stock-history-title">

                    <h2>
                        Stock Movement History
                    </h2>


                    {

                        selectedInventory && (

                            <span>

                                Product:

                                {" "}

                                {
                                    selectedInventory
                                        .product
                                        ?.name ||
                                    "-"
                                }

                            </span>

                        )

                    }

                </div>


                <div className="zaid-stock-history-table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Brand
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Qty
                                </th>

                                <th>
                                    Previous Stock
                                </th>

                                <th>
                                    Updated Stock
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Updated By
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {/* ==================================
                                HISTORY LOADING
                            ================================== */}

                            {

                                historyLoading && (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="zaid-stock-history-message-cell"
                                        >

                                            Loading stock history...

                                        </td>

                                    </tr>

                                )

                            }


                            {/* ==================================
                                HISTORY DATA
                            ================================== */}

                            {

                                !historyLoading &&
                                history.length > 0 &&

                                history.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >


                                            {/* DATE */}

                                            <td>

                                                {
                                                    formatDate(
                                                        item.createdAt
                                                    )
                                                }

                                            </td>


                                            {/* PRODUCT */}

                                            <td>

                                                {
                                                    item.product
                                                        ?.name ||

                                                    selectedInventory
                                                        ?.product
                                                        ?.name ||

                                                    "-"
                                                }

                                            </td>


                                            {/* BRAND */}

                                            <td>

                                                {
                                                    item.product
                                                        ?.brand
                                                        ?.name ||

                                                    selectedInventory
                                                        ?.product
                                                        ?.brand
                                                        ?.name ||

                                                    "-"
                                                }

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                {
                                                    item.product
                                                        ?.category
                                                        ?.name ||

                                                    selectedInventory
                                                        ?.product
                                                        ?.category
                                                        ?.name ||

                                                    "-"
                                                }

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span

                                                    className={
                                                        getTransactionClass(
                                                            item.type
                                                        )
                                                    }

                                                >

                                                    {
                                                        getTransactionLabel(
                                                            item.type
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* QUANTITY */}

                                            <td>

                                                {
                                                    item.quantity ??
                                                    0
                                                }

                                            </td>


                                            {/* PREVIOUS STOCK */}

                                            <td>

                                                {
                                                    item.previousStock ??
                                                    0
                                                }

                                            </td>


                                            {/* UPDATED STOCK */}

                                            <td>

                                                {
                                                    item.updatedStock ??
                                                    0
                                                }

                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>

                                                {
                                                    item.description ||
                                                    "-"
                                                }

                                            </td>


                                            {/* UPDATED BY */}

                                            <td>

                                                {
                                                    item.createdBy
                                                        ?.name ||

                                                    item.createdBy
                                                        ?.firstName ||

                                                    item.createdBy
                                                        ?.email ||

                                                    "-"
                                                }

                                            </td>


                                        </tr>

                                    )

                                )

                            }


                            {/* ==================================
                                NO HISTORY
                            ================================== */}

                            {

                                !historyLoading &&
                                history.length === 0 &&

                                (

                                    <tr>

                                        <td

                                            colSpan="10"

                                            className="zaid-stock-history-no-data"

                                        >

                                            {

                                                selected

                                                    ?

                                                    "No Stock History Found"

                                                    :

                                                    "Select a product to view stock history"

                                            }

                                        </td>

                                    </tr>

                                )

                            }


                        </tbody>

                    </table>

                </div>

            </div>


        </div>

    );

}


export default StockHistory;