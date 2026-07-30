import { useEffect, useState } from "react";

import "./StockHistory.css";

import {
    getInventory,
    getStockHistory
} from "../../services/inventoryService";


function StockHistory() {


    // ============================================
    // STATES
    // ============================================

    const [products, setProducts] = useState([]);

    const [selected, setSelected] = useState("");

    const [selectedInventory, setSelectedInventory] =
        useState(null);

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

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
                response.data
            );

            console.log(
                "================================="
            );


            const inventoryData =
                response.data?.data;


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
                        item.product?._id ===
                        productId
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
                response.data
            );


            const historyData =
                response.data?.data;


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


        return (
            current - reserved
        );

    };


    // ============================================
    // STATUS CLASS
    // ============================================

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "IN_STOCK":

                return "inventory-status in-stock";


            case "LOW_STOCK":

                return "inventory-status low-stock";


            case "OUT_OF_STOCK":

                return "inventory-status out-of-stock";


            default:

                return "inventory-status";

        }

    };


    // ============================================
    // TRANSACTION CLASS
    // ============================================

    const getTransactionClass = (
        type
    ) => {

        switch (type) {

            case "STOCK_IN":

                return "transaction stock-in";


            case "STOCK_OUT":

                return "transaction stock-out";


            case "ORDER":

                return "transaction order";


            case "RETURN":

                return "transaction return";


            case "REPAIR_USAGE":

                return "transaction repair";


            case "RENTAL_OUT":

                return "transaction rental";


            default:

                return "transaction";

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
    // LOADING
    // ============================================

    if (loading) {

        return (

            <div className="stock-history">

                <div className="inventory-loading">

                    Loading inventory...

                </div>

            </div>

        );

    }


    // ============================================
    // UI
    // ============================================

    return (

        <div className="stock-history">


            {/* ====================================
                HEADER
            ==================================== */}

            <div className="stock-header">

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

                <div className="product-select-wrapper">

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


                                        return (

                                            <option

                                                key={
                                                    item.product._id
                                                }

                                                value={
                                                    item.product._id
                                                }

                                            >

                                                {
                                                    item.product.name
                                                }

                                                {" - Stock: "}

                                                {
                                                    item.currentStock ??
                                                    0
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
                DEBUG INFO
            ==================================== */}

            {/*
            Temporary debugging.
            Agar products nahi aa rahe to
            browser console check karo.
            */}


            {/* ====================================
                SELECTED PRODUCT
            ==================================== */}

            {

                selectedInventory && (

                    <div className="product-inventory-card">


                        {/* ==================================
                            PRODUCT INFO
                        ================================== */}

                        <div className="product-info">


                            <div className="product-image">

                                {

                                    selectedInventory
                                        .product
                                        ?.images
                                        ?.length > 0

                                        ?

                                        (

                                            <img

                                                src={
                                                    selectedInventory
                                                        .product
                                                        .images[0]
                                                        ?.url
                                                        ?.startsWith("http")

                                                        ?

                                                        selectedInventory
                                                            .product
                                                            .images[0]
                                                            .url

                                                        :

                                                        `http://localhost:5000${
                                                            selectedInventory
                                                                .product
                                                                .images[0]
                                                                .url
                                                        }`
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

                                            <div className="no-image">

                                                No Image

                                            </div>

                                        )

                                }

                            </div>


                            {/* PRODUCT DETAILS */}

                            <div className="product-details">

                                <h2>

                                    {
                                        selectedInventory
                                            .product
                                            ?.name ||
                                        "-"
                                    }

                                </h2>


                                <div className="product-meta">


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


                            {/* STATUS */}

                            <div>

                                <span

                                    className={
                                        getStatusClass(
                                            selectedInventory.status
                                        )
                                    }

                                >

                                    {
                                        selectedInventory.status ||
                                        "-"
                                    }

                                </span>

                            </div>

                        </div>


                        {/* ==================================
                            STOCK SUMMARY
                        ================================== */}

                        <div className="stock-summary">


                            <div className="stock-box">

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


                            <div className="stock-box">

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


                            <div className="stock-box">

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


                            <div className="stock-box">

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


                            <div className="stock-box">

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

            <div className="history-section">


                <div className="history-title">

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


                <div className="table-container">

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


                            {/* HISTORY LOADING */}

                            {

                                historyLoading && (

                                    <tr>

                                        <td
                                            colSpan="10"
                                        >

                                            Loading stock history...

                                        </td>

                                    </tr>

                                )

                            }


                            {/* HISTORY DATA */}

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


                                            <td>

                                                {
                                                    formatDate(
                                                        item.createdAt
                                                    )
                                                }

                                            </td>


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


                                            <td>

                                                {
                                                    item.quantity ??
                                                    0
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.previousStock ??
                                                    0
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.updatedStock ??
                                                    0
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.description ||
                                                    "-"
                                                }

                                            </td>


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


                            {/* NO HISTORY */}

                            {

                                !historyLoading &&
                                history.length === 0 &&

                                (

                                    <tr>

                                        <td

                                            colSpan="10"

                                            className="no-data"

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