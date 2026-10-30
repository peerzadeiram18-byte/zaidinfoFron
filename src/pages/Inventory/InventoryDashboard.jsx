// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import AddStockModal from "./AddStockModal";
// import { getInventory, addStock, removeStock, deleteInventory } from "../../services/inventoryService";
// import { getMyNotifications } from "../../services/notificationService";
// import "./InventoryDashboard.css";

// const getList = (res) => {
//   const candidates = [res?.data?.data, res?.data?.inventory, res?.data, res?.inventory];
//   return candidates.find(Array.isArray) || [];
// };

// const getNotifications = (res) => {
//   const candidates = [res?.notifications, res?.data?.notifications, res?.data?.data?.notifications, res?.data?.data];
//   return candidates.find(Array.isArray) || [];
// };

// const getAvailableStock = (item) => {
//   if (item?.availableStock !== undefined && item?.availableStock !== null) {
//     return Number(item.availableStock) || 0;
//   }
//   return (Number(item?.currentStock) || 0) - (Number(item?.reservedStock) || 0);
// };

// const getStockStatus = (item) => {
//   // Preserves original current-minus-reserved stock calculation.
//   const available = Math.max((Number(item?.currentStock) || 0) - (Number(item?.reservedStock) || 0), 0);
//   if (available === 0) return "OUT_OF_STOCK";
//   if (available <= 5) return "LOW_STOCK";
//   return "IN_STOCK";
// };

// const getImageUrl = (image) => {
//   const path = typeof image === "string" ? image : image?.url;
//   if (!path) return "";
//   if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
//   const api = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
//   const base = api.replace(/\/api$/i, "");
//   return `${base}/${String(path).replace(/^\/+/, "")}`;
// };

// export default function InventoryDashboard() {
//   const [searchParams] = useSearchParams();
//   const notificationProductId = searchParams.get("product");
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [inventoryUnreadCount, setInventoryUnreadCount] = useState(0);
//   const [deletingId, setDeletingId] = useState(null);

//   const loadInventory = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await getInventory();
//       console.log("INVENTORY RESPONSE:", res.data);
//       setInventory(getList(res));
//     } catch (error) {
//       console.error("INVENTORY ERROR:", error);
//       setInventory([]);
//       toast.error(error?.response?.data?.message || "Failed to load inventory");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const loadInventoryNotifications = useCallback(async () => {
//     try {
//       const res = await getMyNotifications();
//       const unread = getNotifications(res).filter((n) =>
//         (n.type === "STOCK_LOW" || n.type === "STOCK_OUT") &&
//         n.isRead !== true && n.read !== true && String(n.status || "").toUpperCase() !== "READ"
//       ).length;
//       setInventoryUnreadCount(unread);
//     } catch (error) {
//       console.error("INVENTORY NOTIFICATION ERROR:", error);
//     }
//   }, []);

//   useEffect(() => { loadInventory(); }, [loadInventory]);
//   useEffect(() => {
//     loadInventoryNotifications();
//     const interval = setInterval(loadInventoryNotifications, 15000);
//     return () => clearInterval(interval);
//   }, [loadInventoryNotifications]);

//   const openAddStock = (item) => {
//     setSelectedProduct(item);
//     setShowModal(true);
//   };

//   const handleAddStock = async (productId, quantity) => {
//     try {
//       await addStock({ productId, quantity: Number(quantity) });
//       toast.success("Stock Added Successfully");
//       setShowModal(false);
//       setSelectedProduct(null);
//       await loadInventory();
//       await loadInventoryNotifications();
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to add stock");
//     }
//   };

//   const handleRemoveStock = async (productId) => {
//     const qty = window.prompt("Enter quantity to remove");
//     if (qty === null || qty.trim() === "") return;
//     const quantity = Number(qty);
//     if (!Number.isInteger(quantity) || quantity <= 0) {
//       toast.error("Enter valid whole-number quantity");
//       return;
//     }
//     try {
//       await removeStock({ productId, quantity });
//       toast.success("Stock Removed Successfully");
//       await loadInventory();
//       await loadInventoryNotifications();
//     } catch (error) {
//       console.error("REMOVE STOCK ERROR:", error);
//       toast.error(error?.response?.data?.message || "Failed to remove stock");
//     }
//   };

//   const handleDelete = async (item) => {
//     // Delete the inventory RECORD, not the product catalog item.
//     const inventoryId = item?._id || item?.id;
//     if (!inventoryId) {
//       toast.error("Inventory record ID is missing");
//       return;
//     }
//     const name = item?.product?.name || "this inventory record";
//     if (!window.confirm(`Delete inventory record for "${name}"?\n\nThis action may be permanent. It does NOT delete the product from the product catalog.`)) return;
//     try {
//       setDeletingId(String(inventoryId));
//       await deleteInventory(inventoryId);
//       toast.success("Inventory record deleted successfully");
//       await loadInventory();
//       await loadInventoryNotifications();
//     } catch (error) {
//       console.error("DELETE INVENTORY ERROR:", error);
//       toast.error(error?.response?.data?.message || "Failed to delete inventory record. Check API permissions and endpoint.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const summary = useMemo(() => ({
//     totalProducts: inventory.length,
//     inStock: inventory.filter((x) => getStockStatus(x) === "IN_STOCK").length,
//     lowStock: inventory.filter((x) => getStockStatus(x) === "LOW_STOCK").length,
//     outOfStock: inventory.filter((x) => getStockStatus(x) === "OUT_OF_STOCK").length,
//     totalStock: inventory.reduce((sum, x) => sum + (Number(x.currentStock) || 0), 0),
//   }), [inventory]);

//   const filteredInventory = useMemo(() => inventory.filter((item) => {
//     const p = item?.product;
//     if (!p) return false;
//     if (notificationProductId && String(p._id || p.id) !== String(notificationProductId)) return false;
//     const query = search.trim().toLowerCase();
//     const searchable = [p.name, p.sku, p.brand?.name, p.category?.name].map((x) => String(x || "").toLowerCase());
//     return searchable.some((x) => x.includes(query)) && (statusFilter === "ALL" || getStockStatus(item) === statusFilter);
//   }), [inventory, notificationProductId, search, statusFilter]);

//   const statusText = (status) => ({ IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out Of Stock" }[status] || status || "-");

//   return (
//     <div className="inventory-dashboard">
//       <div className="inventory-page-header">
//         <div><h1>Inventory Management</h1><p>Manage products and stock</p></div>
//       </div>
//       <div className="inventory-notification-badge" aria-label={`${inventoryUnreadCount} unread inventory notifications`}>
//         🔔 {inventoryUnreadCount > 0 && <span>{inventoryUnreadCount}</span>}
//       </div>

//       <div className="inventory-cards">
//         <div className="card blue"><h3>Total Products</h3><h2>{summary.totalProducts}</h2></div>
//         <div className="card green"><h3>In Stock</h3><h2>{summary.inStock}</h2></div>
//         <div className="card orange"><h3>Low Stock</h3><h2>{summary.lowStock}</h2></div>
//         <div className="card red"><h3>Out Of Stock</h3><h2>{summary.outOfStock}</h2></div>
//         <div className="card purple"><h3>Total Stock</h3><h2>{summary.totalStock}</h2></div>
//       </div>

//       <div className="inventory-top">
//         <input type="text" placeholder="Search product, SKU, brand, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//           <option value="ALL">All Status</option>
//           <option value="IN_STOCK">In Stock</option>
//           <option value="LOW_STOCK">Low Stock</option>
//           <option value="OUT_OF_STOCK">Out Of Stock</option>
//         </select>
//       </div>

//       {loading ? <div className="inventory-loading">Loading inventory...</div> : (
//         <div className="inventory-table-wrapper">
//           <table className="inventory-table">
//             <thead><tr>
//               <th>#</th><th>Image</th><th>Product</th><th>SKU</th><th>Brand</th><th>Category</th>
//               <th>Price</th><th>Current</th><th>Reserved</th><th>Available</th><th>Min</th><th>Max</th><th>Status</th><th>Action</th>
//             </tr></thead>
//             <tbody>
//               {filteredInventory.length ? filteredInventory.map((item, index) => {
//                 const product = item.product;
//                 const status = getStockStatus(item);
//                 const image = product?.images?.length ? getImageUrl(product.images[0]) : "";
//                 const isDeleting = deletingId === String(item._id || item.id);
//                 return (
//                   <tr key={item._id || item.id || index}>
//                     <td>{index + 1}</td>
//                     <td>{image ? <img src={image} alt={product?.name || "Product"} className="inventory-image" /> : <div className="inventory-no-image">No Image</div>}</td>
//                     <td><strong>{product?.name || "-"}</strong></td>
//                     <td>{product?.sku || "-"}</td>
//                     <td>{product?.brand?.name || "-"}</td>
//                     <td>{product?.category?.name || "-"}</td>
//                     <td>₹ {product?.pricing?.sellingPrice ?? 0}</td>
//                     <td><strong>{item.currentStock ?? 0}</strong></td>
//                     <td>{item.reservedStock ?? 0}</td>
//                     <td><strong>{getAvailableStock(item)}</strong></td>
//                     <td>{item.minimumStock ?? 0}</td>
//                     <td>{item.maximumStock ?? 0}</td>
//                     <td><span className={status === "IN_STOCK" ? "status in-stock" : status === "LOW_STOCK" ? "status low-stock" : "status out-stock"}>{statusText(status)}</span></td>
//                     <td><div className="inventory-actions">
//                       <button type="button" className="add-btn" disabled={isDeleting} onClick={() => openAddStock(item)}>+ Stock</button>
//                       <button type="button" className="remove-btn" disabled={isDeleting} onClick={() => handleRemoveStock(product._id)}>− Stock</button>
//                       <button type="button" className="inventory-delete-btn" disabled={isDeleting} onClick={() => handleDelete(item)}>{isDeleting ? "Deleting..." : "Delete"}</button>
//                     </div></td>
//                   </tr>
//                 );
//               }) : <tr><td colSpan={14} className="no-data">No Product Found</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showModal && selectedProduct && <AddStockModal
//         product={selectedProduct}
//         onClose={() => { setShowModal(false); setSelectedProduct(null); }}
//         onSave={handleAddStock}
//       />}
//     </div>
//   );
// }




import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import AddStockModal from "./AddStockModal";

import {
  getInventory,
  addStock,
  removeStock,
  deleteInventory
} from "../../services/inventoryService";

import {
  getMyNotifications
} from "../../services/notificationService";

import {
  adjustRentalStock
} from "../../services/rentalApi";

import "./InventoryDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const unwrapArray = (response) => {
  const values = [
    response?.data?.data,
    response?.data?.inventory,
    response?.data,
    response?.inventory,
    response
  ];

  return values.find(Array.isArray) || [];
};

const getAvailableStock = (item) =>
  Math.max(
    0,
    Number(item?.currentStock || 0) -
    Number(item?.reservedStock || 0)
  );

const getStatus = (available) => {
  if (available <= 0) return "OUT_OF_STOCK";
  if (available <= 5) return "LOW_STOCK";
  return "IN_STOCK";
};

const getImageUrl = (image) => {
  const value =
    typeof image === "string"
      ? image
      : image?.url || image?.path || "";

  if (!value) return "";

  if (/^(https?:|data:)/i.test(value)) {
    return value;
  }

  const base = API_URL
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return `${base}/${String(value).replace(/^\/+/, "")}`;
};

const getProductId = (item) => {
  const value = item?.productId || item?.product?._id;

  if (typeof value === "object") {
    return String(value?._id || "");
  }

  return String(value || "");
};

const getProduct = (item) => {
  if (item?.product && typeof item.product === "object") {
    return item.product;
  }

  if (item?.productId && typeof item.productId === "object") {
    return item.productId;
  }

  return {};
};

const errorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

export default function InventoryDashboard() {
  const [searchParams] = useSearchParams();
  const notificationProductId = searchParams.get("product");

  const [activeTab, setActiveTab] = useState("SALE");
  const [inventory, setInventory] = useState([]);
  const [rentalInventory, setRentalInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rentalLoading, setRentalLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [inventoryUnreadCount, setInventoryUnreadCount] =
    useState(0);

  const [busyId, setBusyId] = useState(null);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getInventory();

      setInventory(unwrapArray(response));
    } catch (error) {
      toast.error(errorMessage(error));
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRentalInventory = useCallback(async () => {
    try {
      setRentalLoading(true);

      const response = await fetch(
        `${API_URL}/rentals/inventory`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || "Failed to load rental inventory"
        );
      }

      setRentalInventory(unwrapArray(result));
    } catch (error) {
      setRentalInventory([]);
      toast.error(errorMessage(error));
    } finally {
      setRentalLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getMyNotifications();

      const notifications =
        response?.notifications ||
        response?.data?.notifications ||
        response?.data?.data?.notifications ||
        response?.data?.data ||
        [];

      const count = (Array.isArray(notifications)
        ? notifications
        : []
      ).filter(
        (n) =>
          ["STOCK_LOW", "STOCK_OUT"].includes(n.type) &&
          n.isRead !== true &&
          n.read !== true &&
          String(n.status || "").toUpperCase() !== "READ"
      ).length;

      setInventoryUnreadCount(count);
    } catch (error) {
      console.error("Notification error:", error);
    }
  }, []);

  useEffect(() => {
    loadInventory();
    loadRentalInventory();
    loadNotifications();
  }, [
    loadInventory,
    loadRentalInventory,
    loadNotifications
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "RENTAL") {
        loadRentalInventory();
      } else {
        loadInventory();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, loadInventory, loadRentalInventory]);

  useEffect(() => {
    const interval = setInterval(
      loadNotifications,
      15000
    );

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleAddStock = async (productId, quantity) => {
    try {
      await addStock({
        productId,
        quantity: Number(quantity)
      });

      toast.success("Stock added successfully");

      setShowModal(false);
      setSelectedProduct(null);

      await loadInventory();
      await loadNotifications();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleRemoveStock = async (productId) => {
    const input = window.prompt(
      "Enter quantity to remove"
    );

    if (input === null || !input.trim()) return;

    const quantity = Number(input);

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    try {
      setBusyId(String(productId));

      await removeStock({ productId, quantity });

      toast.success("Stock removed successfully");

      await loadInventory();
      await loadNotifications();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    const id = item?._id || item?.id;

    if (!id) {
      toast.error("Inventory ID missing");
      return;
    }

    if (
      !window.confirm(
        `Delete inventory record for "${item.product?.name || "Product"}"?`
      )
    ) {
      return;
    }

    try {
      setBusyId(String(id));

      await deleteInventory(id);

      toast.success("Inventory deleted");

      await loadInventory();
      await loadNotifications();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleRentalStock = async (item, action) => {
    const productId = getProductId(item);

    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    const input = window.prompt(
      action === "ADD"
        ? "How many rental units to add?"
        : `How many units to remove? Available: ${item.availableQuantity}`
    );

    if (input === null || !input.trim()) return;

    const quantity = Number(input);

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      toast.error("Enter a valid positive whole number");
      return;
    }

    if (
      action === "REMOVE" &&
      quantity > Number(item.availableQuantity || 0)
    ) {
      toast.error(
        "Cannot remove units already rented to customers"
      );
      return;
    }

    try {
      setBusyId(productId);

      const response = await adjustRentalStock(
        productId,
        action,
        quantity
      );

      if (response?.success === false) {
        throw new Error(response.message);
      }

      toast.success(
        action === "ADD"
          ? "Rental stock added"
          : "Rental stock removed"
      );

      await loadRentalInventory();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const source =
      activeTab === "RENTAL"
        ? rentalInventory
        : inventory;

    return source.filter((item) => {
      const product = getProduct(item);

      const productId =
        activeTab === "RENTAL"
          ? getProductId(item)
          : String(product?._id || "");

      if (
        notificationProductId &&
        productId !== notificationProductId
      ) {
        return false;
      }

      const query = search.trim().toLowerCase();

      const searchable = [
        product.name,
        product.sku,
        product.brand?.name,
        product.category?.name
      ]
        .map((value) =>
          String(value || "").toLowerCase()
        )
        .join(" ");

      const available =
        activeTab === "RENTAL"
          ? Number(item.availableQuantity || 0)
          : getAvailableStock(item);

      const status = getStatus(available);

      return (
        searchable.includes(query) &&
        (statusFilter === "ALL" || statusFilter === status)
      );
    });
  }, [
    activeTab,
    inventory,
    rentalInventory,
    notificationProductId,
    search,
    statusFilter
  ]);

  const summary = useMemo(() => {
    const source =
      activeTab === "RENTAL"
        ? rentalInventory
        : inventory;

    const available = (item) =>
      activeTab === "RENTAL"
        ? Number(item.availableQuantity || 0)
        : getAvailableStock(item);

    return {
      totalProducts: source.length,
      inStock: source.filter(
        (item) => getStatus(available(item)) === "IN_STOCK"
      ).length,
      lowStock: source.filter(
        (item) => getStatus(available(item)) === "LOW_STOCK"
      ).length,
      outOfStock: source.filter(
        (item) => getStatus(available(item)) === "OUT_OF_STOCK"
      ).length,
      totalStock: source.reduce(
        (sum, item) =>
          sum +
          Number(
            activeTab === "RENTAL"
              ? item.totalQuantity
              : item.currentStock
          ),
        0
      ),
      rented: rentalInventory.reduce(
        (sum, item) =>
          sum + Number(item.rentedQuantity || 0),
        0
      )
    };
  }, [activeTab, inventory, rentalInventory]);

  const statusLabel = (status) =>
    ({
      IN_STOCK: "In Stock",
      LOW_STOCK: "Low Stock",
      OUT_OF_STOCK: "Out Of Stock"
    })[status] || status;

  const isLoading =
    activeTab === "RENTAL" ? rentalLoading : loading;

  return (
    <div className="inventory-dashboard">
      <div className="inventory-page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>
            Manage sales, refurbished and rental stock
          </p>
        </div>
      </div>

      <div
        className="inventory-notification-badge"
        aria-label={`${inventoryUnreadCount} unread inventory notifications`}
      >
        🔔
        {inventoryUnreadCount > 0 && (
          <span>{inventoryUnreadCount}</span>
        )}
      </div>

      <div className="inventory-stock-tabs">
        <button
          type="button"
          className={activeTab === "SALE" ? "active" : ""}
          onClick={() => setActiveTab("SALE")}
        >
          New & Refurbished
        </button>

        <button
          type="button"
          className={activeTab === "RENTAL" ? "active" : ""}
          onClick={() => setActiveTab("RENTAL")}
        >
          Rental Inventory
        </button>

        <button
          type="button"
          className="inventory-refresh-btn"
          onClick={() =>
            activeTab === "RENTAL"
              ? loadRentalInventory()
              : loadInventory()
          }
        >
          Refresh
        </button>
      </div>

      <div className="inventory-cards">
        <div className="card blue">
          <h3>Total Products</h3>
          <h2>{summary.totalProducts}</h2>
        </div>

        <div className="card green">
          <h3>In Stock</h3>
          <h2>{summary.inStock}</h2>
        </div>

        <div className="card orange">
          <h3>Low Stock</h3>
          <h2>{summary.lowStock}</h2>
        </div>

        <div className="card red">
          <h3>Out Of Stock</h3>
          <h2>{summary.outOfStock}</h2>
        </div>

        <div className="card purple">
          <h3>Total Stock</h3>
          <h2>{summary.totalStock}</h2>
        </div>

        {activeTab === "RENTAL" && (
          <div className="card blue">
            <h3>Currently Rented</h3>
            <h2>{summary.rented}</h2>
          </div>
        )}
      </div>

      <div className="inventory-top">
        <input
          type="text"
          placeholder="Search product, SKU, brand, category..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="ALL">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out Of Stock</option>
        </select>
      </div>

      {isLoading ? (
        <div className="inventory-loading">
          Loading inventory...
        </div>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Brand</th>
                <th>Category</th>
                {activeTab === "SALE" && (
                  <th>Price</th>
                )}
                <th>Total</th>
                <th>
                  {activeTab === "RENTAL"
                    ? "Rented"
                    : "Reserved"}
                </th>
                <th>Available</th>
                {activeTab === "RENTAL" ? (
                  <th>Monthly Rent</th>
                ) : (
                  <>
                    <th>Min</th>
                    <th>Max</th>
                  </>
                )}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="no-data"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const product = getProduct(item);

                  const productId =
                    activeTab === "RENTAL"
                      ? getProductId(item)
                      : String(product?._id || "");

                  const available =
                    activeTab === "RENTAL"
                      ? Number(item.availableQuantity || 0)
                      : getAvailableStock(item);

                  const status = getStatus(available);

                  const image = product.images?.length
                    ? getImageUrl(product.images[0])
                    : "";

                  const busy =
                    busyId === productId ||
                    busyId === String(item._id);

                  return (
                    <tr
                      key={
                        item.rentalProductId ||
                        item._id ||
                        index
                      }
                    >
                      <td>{index + 1}</td>

                      <td>
                        {image ? (
                          <img
                            src={image}
                            alt={product.name || "Product"}
                            className="inventory-image"
                          />
                        ) : (
                          <div className="inventory-no-image">
                            No Image
                          </div>
                        )}
                      </td>

                      <td>
                        <strong>{product.name || "-"}</strong>
                      </td>

                      <td>{product.sku || "-"}</td>
                      <td>{product.brand?.name || "-"}</td>
                      <td>{product.category?.name || "-"}</td>

                      {activeTab === "SALE" && (
                        <td>
                          ₹ {product.pricing?.sellingPrice ?? 0}
                        </td>
                      )}

                      <td>
                        <strong>
                          {activeTab === "RENTAL"
                            ? item.totalQuantity
                            : item.currentStock}
                        </strong>
                      </td>

                      <td>
                        {activeTab === "RENTAL"
                          ? item.rentedQuantity
                          : item.reservedStock}
                      </td>

                      <td>
                        <strong>{available}</strong>
                      </td>

                      {activeTab === "RENTAL" ? (
                        <td>
                          {item.monthlyRent !== undefined
                            ? `₹ ${item.monthlyRent}`
                            : "—"}
                        </td>
                      ) : (
                        <>
                          <td>{item.minimumStock ?? 0}</td>
                          <td>{item.maximumStock ?? 0}</td>
                        </>
                      )}

                      <td>
                        <span
                          className={
                            status === "IN_STOCK"
                              ? "status in-stock"
                              : status === "LOW_STOCK"
                              ? "status low-stock"
                              : "status out-stock"
                          }
                        >
                          {statusLabel(status)}
                        </span>
                      </td>

                      <td>
                        <div className="inventory-actions">
                          {activeTab === "RENTAL" ? (
                            <>
                              <button
                                type="button"
                                className="add-btn"
                                disabled={busy}
                                onClick={() =>
                                  handleRentalStock(item, "ADD")
                                }
                              >
                                + Stock
                              </button>

                              <button
                                type="button"
                                className="remove-btn"
                                disabled={busy || available <= 0}
                                onClick={() =>
                                  handleRentalStock(item, "REMOVE")
                                }
                              >
                                − Stock
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="add-btn"
                                disabled={busy}
                                onClick={() => {
                                  setSelectedProduct(item);
                                  setShowModal(true);
                                }}
                              >
                                + Stock
                              </button>

                              <button
                                type="button"
                                className="remove-btn"
                                disabled={busy}
                                onClick={() =>
                                  handleRemoveStock(productId)
                                }
                              >
                                − Stock
                              </button>

                              <button
                                type="button"
                                className="inventory-delete-btn"
                                disabled={busy}
                                onClick={() =>
                                  handleDelete(item)
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedProduct && (
        <AddStockModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleAddStock}
        />
      )}
    </div>
  );
}
