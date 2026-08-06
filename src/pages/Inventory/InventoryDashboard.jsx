// import { useEffect, useState } from "react";
// import "./InventoryDashboard.css";

// import AddStockModal from "./AddStockModal";

// import {
//   getInventory,
//   addStock,
//   removeStock,
// } from "../../services/inventoryService";

// function InventoryDashboard() {

//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);


//   const [search, setSearch] = useState("");

//  const [statusFilter, setStatusFilter] = useState("ALL");


//   useEffect(() => {
//     loadInventory();
//   }, []);

//   const loadInventory = async () => {
//     try {

//       const res = await getInventory();

//       console.log(res.data);

//       setInventory(res.data.data || []);

//     } catch (err) {

//       console.log(err);

//     } finally {

//       setLoading(false);

//     }
//   };

//   // =============================
//   // Add Stock
//   // =============================

//   const openAddStock = (product) => {

//     setSelectedProduct(product);

//     setShowModal(true);

//   };

//   const handleAddStock = async (productId, quantity) => {

//     try {

//       await addStock({

//         productId,

//         quantity: Number(quantity)

//       });

//       alert("Stock Added Successfully");

//       setShowModal(false);

//       loadInventory();

//     } catch (err) {

//       console.log(err);

//       alert("Failed");

//     }

//   };

//   // =============================
//   // Remove Stock
//   // =============================

//   const handleRemoveStock = async (productId, quantity) => {

//     try {

//       await removeStock({

//         productId,

//         quantity: Number(quantity)

//       });

//       alert("Stock Removed Successfully");

//       loadInventory();

//     } catch (err) {

//       console.log(err);

//       alert(err.response?.data?.message || "Remove Failed");

//     }

//   };

//   // =============================
//   // Dashboard Cards
//   // =============================

//   const totalProducts = inventory.length;

//   const inStock = inventory.filter(
//     item => item.status === "IN_STOCK"
//   ).length;

//   const lowStock = inventory.filter(
//     item => item.status === "LOW_STOCK"
//   ).length;

//   const outOfStock = inventory.filter(
//     item => item.status === "OUT_OF_STOCK"
//   ).length;

//   const totalStock = inventory.reduce(
//     (total, item) => total + item.currentStock,
//     0
//   );

// const filteredInventory = inventory.filter((item) => {

//   const matchSearch =
//     item.product.name
//       .toLowerCase()
//       .includes(search.toLowerCase());

//   const matchStatus =
//     statusFilter === "ALL" ||
//     item.status === statusFilter;

//   return matchSearch && matchStatus;

// });


//   return (

//     <div className="inventory-dashboard">

//       <h1>Inventory Management</h1>

//       {loading ? (

//         <h2>Loading...</h2>

//       ) : (

//         <>

//           {/* Cards */}

//           <div className="inventory-cards">

//             <div className="card blue">
//               <h3>Total Products</h3>
//               <h2>{totalProducts}</h2>
//             </div>

//             <div className="card green">
//               <h3>In Stock</h3>
//               <h2>{inStock}</h2>
//             </div>

//             <div className="card orange">
//               <h3>Low Stock</h3>
//               <h2>{lowStock}</h2>
//             </div>

//             <div className="card red">
//               <h3>Out Of Stock</h3>
//               <h2>{outOfStock}</h2>
//             </div>

//             <div className="card purple">
//               <h3>Total Stock</h3>
//               <h2>{totalStock}</h2>
//             </div>

//           </div>


//           <div className="inventory-top">

// <input
// type="text"
// placeholder="Search Product..."
// value={search}
// onChange={(e)=>setSearch(e.target.value)}
// />

// <select
// value={statusFilter}
// onChange={(e)=>setStatusFilter(e.target.value)}
// >

// <option value="ALL">All Status</option>

// <option value="IN_STOCK">
// In Stock
// </option>

// <option value="LOW_STOCK">
// Low Stock
// </option>

// <option value="OUT_OF_STOCK">
// Out Of Stock
// </option>

// </select>

// </div>

//           {/* Table */}

//           <table className="inventory-table">

//             <thead>

//               <tr>

//                 <th>#</th>
//                 <th>Image</th>
//                 <th>Product</th>
//                 <th>SKU</th>
//                 <th>Price</th>
//                 <th>Current Stock</th>
//                 <th>Reserved</th>
//                 <th>Available</th>
//                 <th>Status</th>
//                 <th>Action</th>

//               </tr>

//             </thead>

//         <tbody>

// {
// filteredInventory.length > 0 ? (

// filteredInventory.map((item, index) => (

// <tr
// key={item._id}
// className={

// item.status === "LOW_STOCK"
// ? "low-stock-row"
// : item.status === "OUT_OF_STOCK"
// ? "out-stock-row"
// : ""

// }
// >

// <td>{index + 1}</td>

// <td>

// {
// item.product.images?.length > 0 ? (

// <img
// src={`http://localhost:5000${item.product.images[0].url}`}
// alt={item.product.name}
// className="inventory-image"
// />

// ) : (

// "No Image"

// )
// }

// </td>

// <td>

// <b>{item.product.name}</b>

// {
// item.status === "LOW_STOCK" && (

// <p className="warning">

// ⚠ Only few items left

// </p>

// )
// }

// {
// item.status === "OUT_OF_STOCK" && (

// <p className="danger">

// ❌ Product Out Of Stock

// </p>

// )
// }

// </td>

// <td>{item.product.sku}</td>

// <td>

// ₹ {item.product.pricing?.sellingPrice}

// </td>

// <td>{item.currentStock}</td>

// <td>{item.reservedStock}</td>

// <td>{item.availableStock}</td>

// <td>

// {
// item.status === "IN_STOCK" && (
// <span className="status in-stock">
// In Stock
// </span>
// )
// }

// {
// item.status === "LOW_STOCK" && (
// <span className="status low-stock">
// Low Stock
// </span>
// )
// }

// {
// item.status === "OUT_OF_STOCK" && (
// <span className="status out-stock">
// Out Of Stock
// </span>
// )
// }

// </td>

// <td>

// <button
// className="add-btn"
// onClick={() => openAddStock(item)}
// >

// + Stock

// </button>

// <button
// className="remove-btn"
// onClick={() => {

// const qty = prompt("Enter Remove Quantity");

// if(!qty) return;

// handleRemoveStock(
// item.product._id,
// qty
// );

// }}
// >

// - Stock

// </button>

// </td>

// </tr>

// ))

// ) : (

// <tr>

// <td colSpan="10">

// No Product Found

// </td>

// </tr>

// )

// }

// </tbody>

//           </table>

//         </>

//       )}

//       {

//         showModal && (

//           <AddStockModal

//             product={selectedProduct}

//             onClose={() => setShowModal(false)}

//             onSave={handleAddStock}

//           />

//         )

//       }

//     </div>

//   );

// }

// export default InventoryDashboard;

import { useEffect, useState } from "react";

import "./InventoryDashboard.css";

import AddStockModal from "./AddStockModal";

import {
    getInventory,
    addStock,
    removeStock
} from "../../services/inventoryService";
import { toast } from "react-toastify";


function InventoryDashboard() {


    // ==========================================
    // STATES
    // ==========================================

    const [inventory, setInventory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showModal, setShowModal] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");


    // ==========================================
    // LOAD INVENTORY
    // ==========================================

    useEffect(() => {

        loadInventory();

    }, []);


    const loadInventory = async () => {

        try {

            setLoading(true);


            const res =
                await getInventory();


            console.log(
                "INVENTORY RESPONSE:",
                res.data
            );


            setInventory(
                res.data?.data || []
            );

        }

        catch (error) {

            console.log(
                "INVENTORY ERROR:",
                error
            );

            setInventory([]);

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // OPEN ADD STOCK
    // ==========================================

    const openAddStock = (item) => {

        setSelectedProduct(item);

        setShowModal(true);

    };


    // ==========================================
    // ADD STOCK
    // ==========================================

   const handleAddStock = async (
    productId,
    quantity
) => {

    try {

        await addStock({

            productId,

            quantity: Number(quantity)

        });


       toast.success("Stock Added Successfully");


        setShowModal(false);


        await loadInventory();

    }

    catch (err) {

        console.log(err);

        toast.error(
            err.response?.data?.message ||
            "Failed to add stock"
        );

    }

};


    // ==========================================
    // REMOVE STOCK
    // ==========================================

    const handleRemoveStock = async (
        productId
    ) => {


        const qty =
            window.prompt(
                "Enter quantity to remove"
            );


        if (
            qty === null ||
            qty === ""
        ) {

            return;

        }


        const quantity =
            Number(qty);


        if (
            !quantity ||
            quantity <= 0
        ) {

            toast.error(
                "Enter valid quantity"
            );

            return;

        }


        try {


            await removeStock({

                productId,

                quantity

            });


           toast.success(
                "Stock Removed Successfully"
            );


            await loadInventory();

        }

        catch (error) {

            console.log(
                "REMOVE STOCK ERROR:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                "Failed to remove stock"

            );

        }

    };


    // ==========================================
    // AVAILABLE STOCK
    // ==========================================

    const getAvailableStock = (item) => {


        if (
            item.availableStock !== undefined &&
            item.availableStock !== null
        ) {

            return item.availableStock;

        }


        const current =
            Number(
                item.currentStock || 0
            );


        const reserved =
            Number(
                item.reservedStock || 0
            );


        return current - reserved;

    };


    // ==========================================
    // DASHBOARD DATA
    // ==========================================

    const totalProducts =
        inventory.length;


    const inStock =
        inventory.filter(
            item =>
                item.status === "IN_STOCK"
        ).length;


    const lowStock =
        inventory.filter(
            item =>
                item.status === "LOW_STOCK"
        ).length;


    const outOfStock =
        inventory.filter(
            item =>
                item.status === "OUT_OF_STOCK"
        ).length;


    const totalStock =
        inventory.reduce(

            (total, item) =>

                total +
                Number(
                    item.currentStock || 0
                ),

            0

        );


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const filteredInventory =
        inventory.filter((item) => {


            const product =
                item.product;


            if (!product) {

                return false;

            }


            const searchText =
                search.toLowerCase();


            const productName =
                (
                    product.name || ""
                ).toLowerCase();


            const sku =
                (
                    product.sku || ""
                ).toLowerCase();


            const brand =
                (
                    product.brand?.name || ""
                ).toLowerCase();


            const category =
                (
                    product.category?.name || ""
                ).toLowerCase();


            const matchSearch =

                productName.includes(
                    searchText
                )

                ||

                sku.includes(
                    searchText
                )

                ||

                brand.includes(
                    searchText
                )

                ||

                category.includes(
                    searchText
                );


            const matchStatus =

                statusFilter === "ALL"

                ||

                item.status ===
                statusFilter;


            return (
                matchSearch &&
                matchStatus
            );

        });


    // ==========================================
    // IMAGE URL
    // ==========================================

    // const getImageUrl = (image) => {


    //     if (!image) {

    //         return "";

    //     }


    //     if (
    //         typeof image === "string"
    //     ) {

    //         if (
    //             image.startsWith("http")
    //         ) {

    //             return image;

    //         }


    //         return `http://localhost:5000${image}`;

    //     }


    //     if (image.url) {

    //         if (
    //             image.url.startsWith("http")
    //         ) {

    //             return image.url;

    //         }


    //         return `http://localhost:5000${image.url}`;

    //     }


    //     return "";

    // };

    const getImageUrl = (image) => {

    if (!image) {
        return "";
    }

    const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

    if (typeof image === "string") {

        if (image.startsWith("http")) {
            return image;
        }

        return `${BASE_URL}${image}`;
    }

    if (image.url) {

        if (image.url.startsWith("http")) {
            return image.url;
        }

        return `${BASE_URL}${image.url}`;
    }

    return "";
};

    // ==========================================
    // STATUS
    // ==========================================

    const getStatusText = (status) => {


        switch (status) {

            case "IN_STOCK":

                return "In Stock";


            case "LOW_STOCK":

                return "Low Stock";


            case "OUT_OF_STOCK":

                return "Out Of Stock";


            default:

                return status || "-";

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="inventory-dashboard">


            <div className="inventory-page-header">

                <div>

                    <h1>
                        Inventory Management
                    </h1>

                    <p>
                        Manage products and stock
                    </p>

                </div>

            </div>


            {/* ==================================
                SUMMARY CARDS
            ================================== */}

            <div className="inventory-cards">


                <div className="card blue">

                    <h3>
                        Total Products
                    </h3>

                    <h2>
                        {totalProducts}
                    </h2>

                </div>


                <div className="card green">

                    <h3>
                        In Stock
                    </h3>

                    <h2>
                        {inStock}
                    </h2>

                </div>


                <div className="card orange">

                    <h3>
                        Low Stock
                    </h3>

                    <h2>
                        {lowStock}
                    </h2>

                </div>


                <div className="card red">

                    <h3>
                        Out Of Stock
                    </h3>

                    <h2>
                        {outOfStock}
                    </h2>

                </div>


                <div className="card purple">

                    <h3>
                        Total Stock
                    </h3>

                    <h2>
                        {totalStock}
                    </h2>

                </div>


            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="inventory-top">


                <input

                    type="text"

                    placeholder="Search product, SKU, brand, category..."

                    value={search}

                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }

                />


                <select

                    value={statusFilter}

                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }

                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="IN_STOCK">
                        In Stock
                    </option>

                    <option value="LOW_STOCK">
                        Low Stock
                    </option>

                    <option value="OUT_OF_STOCK">
                        Out Of Stock
                    </option>

                </select>


            </div>


            {/* ==================================
                TABLE
            ================================== */}

            {

                loading

                    ?

                    (

                        <div className="inventory-loading">

                            Loading inventory...

                        </div>

                    )

                    :

                    (

                        <div className="inventory-table-wrapper">

                            <table
                                className="inventory-table"
                            >


                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Image
                                        </th>

                                        <th>
                                            Product
                                        </th>

                                        <th>
                                            SKU
                                        </th>

                                        <th>
                                            Brand
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Price
                                        </th>

                                        <th>
                                            Current
                                        </th>

                                        <th>
                                            Reserved
                                        </th>

                                        <th>
                                            Available
                                        </th>

                                        <th>
                                            Min
                                        </th>

                                        <th>
                                            Max
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {

                                        filteredInventory.length > 0

                                            ?

                                            (

                                                filteredInventory.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => {


                                                        const product =
                                                            item.product;


                                                        const image =
                                                            product
                                                                ?.images
                                                                ?.length > 0

                                                                ?

                                                                getImageUrl(
                                                                    product
                                                                        .images[0]
                                                                )

                                                                :

                                                                "";


                                                        return (

                                                            <tr

                                                                key={
                                                                    item._id
                                                                }

                                                            >


                                                                {/* NUMBER */}

                                                                <td>

                                                                    {
                                                                        index + 1
                                                                    }

                                                                </td>


                                                                {/* IMAGE */}

                                                                <td>

                                                                    {

                                                                        image

                                                                            ?

                                                                            (

                                                                                <img

                                                                                    src={
                                                                                        image
                                                                                    }

                                                                                    alt={
                                                                                        product?.name ||
                                                                                        "Product"
                                                                                    }

                                                                                    className="inventory-image"

                                                                                />

                                                                            )

                                                                            :

                                                                            (

                                                                                <div className="inventory-no-image">

                                                                                    No Image

                                                                                </div>

                                                                            )

                                                                    }

                                                                </td>


                                                                {/* PRODUCT */}

                                                                <td>

                                                                    <strong>

                                                                        {
                                                                            product?.name ||
                                                                            "-"
                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* SKU */}

                                                                <td>

                                                                    {
                                                                        product?.sku ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* BRAND */}

                                                                <td>

                                                                    {
                                                                        product?.brand?.name ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* CATEGORY */}

                                                                <td>

                                                                    {
                                                                        product?.category?.name ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* PRICE */}

                                                                <td>

                                                                    ₹{" "}

                                                                    {
                                                                        product
                                                                            ?.pricing
                                                                            ?.sellingPrice ??
                                                                        0
                                                                    }

                                                                </td>


                                                                {/* CURRENT */}

                                                                <td>

                                                                    <strong>

                                                                        {
                                                                            item.currentStock ??
                                                                            0
                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* RESERVED */}

                                                                <td>

                                                                    {
                                                                        item.reservedStock ??
                                                                        0
                                                                    }

                                                                </td>


                                                                {/* AVAILABLE */}

                                                                <td>

                                                                    <strong>

                                                                        {
                                                                            getAvailableStock(
                                                                                item
                                                                            )
                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* MINIMUM */}

                                                                <td>

                                                                    {
                                                                        item.minimumStock ??
                                                                        0
                                                                    }

                                                                </td>


                                                                {/* MAXIMUM */}

                                                                <td>

                                                                    {
                                                                        item.maximumStock ??
                                                                        0
                                                                    }

                                                                </td>


                                                                {/* STATUS */}

                                                                <td>

                                                                    <span

                                                                        className={

                                                                            item.status ===
                                                                            "IN_STOCK"

                                                                                ?

                                                                                "status in-stock"

                                                                                :

                                                                            item.status ===
                                                                            "LOW_STOCK"

                                                                                ?

                                                                                "status low-stock"

                                                                                :

                                                                                "status out-stock"

                                                                        }

                                                                    >

                                                                        {
                                                                            getStatusText(
                                                                                item.status
                                                                            )
                                                                        }

                                                                    </span>

                                                                </td>


                                                                {/* ACTION */}

                                                                <td>

                                                                    <div className="inventory-actions">


                                                                        <button

                                                                            className="add-btn"

                                                                            onClick={() =>
                                                                                openAddStock(
                                                                                    item
                                                                                )
                                                                            }

                                                                        >

                                                                            + Stock

                                                                        </button>


                                                                        <button

                                                                            className="remove-btn"

                                                                            onClick={() =>
                                                                                handleRemoveStock(
                                                                                    product._id
                                                                                )
                                                                            }

                                                                        >

                                                                            - Stock

                                                                        </button>


                                                                    </div>

                                                                </td>


                                                            </tr>

                                                        );

                                                    }

                                                )

                                            )

                                            :

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="14"
                                                        className="no-data"
                                                    >

                                                        No Product Found

                                                    </td>

                                                </tr>

                                            )

                                    }


                                </tbody>


                            </table>

                        </div>

                    )

            }


            {/* ==================================
                ADD STOCK MODAL
            ================================== */}

            {

                showModal &&

                selectedProduct &&

                (

                    <AddStockModal

                        product={
                            selectedProduct
                        }

                        onClose={() => {

                            setShowModal(
                                false
                            );

                            setSelectedProduct(
                                null
                            );

                        }}

                        onSave={
                            handleAddStock
                        }

                    />

                )

            }


        </div>

    );

}


export default InventoryDashboard;