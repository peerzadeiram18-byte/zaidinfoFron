
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import AddStockModal from "./AddStockModal";
import TransferStockModal from "./TransferStockModal";

import {
  getInventory,
  addStock,
  removeStock,
  deleteInventory,
  addWarehouseStock,
  transferStock,
  getStockTransfers
} from "../../services/inventoryService";

import { getMyNotifications } from "../../services/notificationService";
import { adjustRentalStock } from "../../services/rentalApi";

import "./InventoryDashboard.css";

// ======================================================
// CONFIG
// ======================================================

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

// ======================================================
// RESPONSE HELPERS
// ======================================================

const unwrapArray = (response) => {
  const candidates = [
    response?.data?.data,
    response?.data?.inventory,
    response?.data?.transfers,
    response?.data?.notifications,
    response?.data,
    response?.inventory,
    response?.transfers,
    response?.notifications,
    response
  ];

  return candidates.find(Array.isArray) || [];
};

const getNotifications = (response) => {
  const candidates = [
    response?.notifications,
    response?.data?.notifications,
    response?.data?.data?.notifications,
    response?.data?.data,
    response?.data
  ];

  return candidates.find(Array.isArray) || [];
};

const errorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

// ======================================================
// STOCK HELPERS
// ======================================================

const getAvailableStock = (item) => {
  if (
    item?.availableStock !== undefined &&
    item?.availableStock !== null
  ) {
    return Math.max(0, Number(item.availableStock) || 0);
  }

  return Math.max(
    0,
    (Number(item?.currentStock) || 0) -
      (Number(item?.reservedStock) || 0)
  );
};

const getStatus = (available) => {
  const quantity = Number(available) || 0;

  if (quantity <= 0) return "OUT_OF_STOCK";
  if (quantity <= 5) return "LOW_STOCK";

  return "IN_STOCK";
};

const getStockStatus = (item) =>
  getStatus(getAvailableStock(item));

// ======================================================
// PRODUCT HELPERS
// ======================================================

const getProduct = (item) => {
  if (item?.product && typeof item.product === "object") {
    return item.product;
  }

  if (
    item?.productId &&
    typeof item.productId === "object"
  ) {
    return item.productId;
  }

  return {};
};

const getProductId = (item) => {
  const value =
    item?.productId ||
    item?.product?._id ||
    item?.product?.id;

  if (typeof value === "object") {
    return String(value?._id || value?.id || "");
  }

  return String(value || "");
};

const getInventoryId = (item) =>
  String(item?._id || item?.id || "");

const getImageUrl = (image) => {
  const value =
    typeof image === "string"
      ? image
      : image?.url || image?.path || "";

  if (!value) return "";

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const base = API_URL.replace(/\/api\/?$/i, "");

  return `${base}/${String(value).replace(/^\/+/, "")}`;
};

// ======================================================
// DISPLAY HELPERS
// ======================================================

const statusLabel = (status) =>
  ({
    IN_STOCK: "In Stock",
    LOW_STOCK: "Low Stock",
    OUT_OF_STOCK: "Out Of Stock"
  })[status] || status || "-";

const locationLabel = (value) =>
  ({
    STORE: "Store",
    WAREHOUSE: "Warehouse",
    SUPPLIER: "Supplier"
  })[value] || value || "-";

const personName = (user) =>
  [
    user?.firstName,
    user?.lastName
  ].filter(Boolean).join(" ") ||
  user?.name ||
  user?.email ||
  "-";

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString();
};

// ======================================================
// COMPONENT
// ======================================================

export default function InventoryDashboard() {
  const [searchParams] = useSearchParams();

  const notificationProductId =
    searchParams.get("product");

  // ====================================================
  // STATES
  // ====================================================

  const [activeTab, setActiveTab] = useState("SALE");

  const [inventory, setInventory] = useState([]);
  const [rentalInventory, setRentalInventory] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [transfersLoading, setTransfersLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showTransfer, setShowTransfer] = useState(false);
  const [transferProduct, setTransferProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");

  const [inventoryUnreadCount, setInventoryUnreadCount] =
    useState(0);

  const [busyId, setBusyId] = useState(null);

  // ====================================================
  // LOAD SALE INVENTORY
  // ====================================================

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getInventory();

      console.log("INVENTORY RESPONSE:", response?.data || response);

      setInventory(unwrapArray(response));
    } catch (error) {
      console.error("INVENTORY ERROR:", error);

      setInventory([]);

      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // LOAD RENTAL INVENTORY
  // ====================================================

  const loadRentalInventory = useCallback(async () => {
    try {
      setRentalLoading(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/rentals/inventory`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {})
          }
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          "Failed to load rental inventory"
        );
      }

      setRentalInventory(unwrapArray(result));
    } catch (error) {
      console.error("RENTAL INVENTORY ERROR:", error);

      setRentalInventory([]);

      toast.error(errorMessage(error));
    } finally {
      setRentalLoading(false);
    }
  }, []);

  // ====================================================
  // LOAD TRANSFER HISTORY
  // ====================================================

  const loadTransfers = useCallback(async () => {
    try {
      setTransfersLoading(true);

      const response = await getStockTransfers();

      console.log("STOCK TRANSFERS:", response?.data || response);

      setTransfers(unwrapArray(response));
    } catch (error) {
      console.error("TRANSFER HISTORY ERROR:", error);

      setTransfers([]);

      toast.error(errorMessage(error));
    } finally {
      setTransfersLoading(false);
    }
  }, []);

  // ====================================================
  // LOAD NOTIFICATIONS
  // ====================================================

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getMyNotifications();

      const notifications = getNotifications(response);

      const unread = notifications.filter((notification) => {
        const isInventoryNotification = [
          "STOCK_LOW",
          "STOCK_OUT"
        ].includes(
          String(notification?.type || "").toUpperCase()
        );

        const isUnread =
          notification?.isRead !== true &&
          notification?.read !== true &&
          String(notification?.status || "").toUpperCase() !== "READ";

        return isInventoryNotification && isUnread;
      }).length;

      setInventoryUnreadCount(unread);
    } catch (error) {
      console.error("INVENTORY NOTIFICATION ERROR:", error);
    }
  }, []);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadInventory();
    loadRentalInventory();
    loadNotifications();
  }, [
    loadInventory,
    loadRentalInventory,
    loadNotifications
  ]);

  // ====================================================
  // LOAD TRANSFERS WHEN TAB OPENS
  // ====================================================

  useEffect(() => {
    if (activeTab === "TRANSFERS") {
      loadTransfers();
    }
  }, [activeTab, loadTransfers]);

  // ====================================================
  // AUTO REFRESH INVENTORY
  // ====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "RENTAL") {
        loadRentalInventory();
      } else if (activeTab === "TRANSFERS") {
        loadTransfers();
      } else {
        loadInventory();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [
    activeTab,
    loadInventory,
    loadRentalInventory,
    loadTransfers
  ]);

  // ====================================================
  // AUTO REFRESH NOTIFICATIONS
  // ====================================================

  useEffect(() => {
    const interval = setInterval(
      loadNotifications,
      15000
    );

    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ====================================================
  // ADD STOCK
  // ====================================================

  const handleAddStock = async (
    productId,
    quantity,
    location = "STORE"
  ) => {
    const parsedQuantity = Number(quantity);

    if (
      !productId ||
      !Number.isSafeInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    try {
      if (location === "WAREHOUSE") {
        await addWarehouseStock({
          productId,
          quantity: parsedQuantity
        });

        toast.success(
          "Warehouse stock added successfully"
        );
      } else {
        await addStock({
          productId,
          quantity: parsedQuantity
        });

        toast.success("Stock added successfully");
      }

      setShowModal(false);
      setSelectedProduct(null);

      await Promise.all([
        loadInventory(),
        loadNotifications()
      ]);
    } catch (error) {
      console.error("ADD STOCK ERROR:", error);

      toast.error(errorMessage(error));
    }
  };

  // ====================================================
  // REMOVE SALE STOCK
  // ====================================================

  const handleRemoveStock = async (productId) => {
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    const input = window.prompt(
      "Enter quantity to remove"
    );

    if (input === null || !input.trim()) {
      return;
    }

    const quantity = Number(input);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      toast.error(
        "Enter a valid positive whole-number quantity"
      );
      return;
    }

    try {
      setBusyId(String(productId));

      await removeStock({
        productId,
        quantity
      });

      toast.success("Stock removed successfully");

      await Promise.all([
        loadInventory(),
        loadNotifications()
      ]);
    } catch (error) {
      console.error("REMOVE STOCK ERROR:", error);

      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // ====================================================
  // DELETE INVENTORY RECORD
  // ====================================================

  const handleDelete = async (item) => {
    const inventoryId = getInventoryId(item);

    if (!inventoryId) {
      toast.error("Inventory record ID is missing");
      return;
    }

    const product = getProduct(item);

    const productName = product?.name || "this product";

    const confirmed = window.confirm(
      `Delete inventory record for "${productName}"?\n\n` +
      "This action may be permanent. It will NOT delete " +
      "the product from the product catalog."
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(inventoryId);

      await deleteInventory(inventoryId);

      toast.success(
        "Inventory record deleted successfully"
      );

      await Promise.all([
        loadInventory(),
        loadNotifications()
      ]);
    } catch (error) {
      console.error("DELETE INVENTORY ERROR:", error);

      toast.error(
        errorMessage(error) ||
        "Failed to delete inventory record"
      );
    } finally {
      setBusyId(null);
    }
  };

  // ====================================================
  // TRANSFER STOCK
  // ====================================================

  const handleTransfer = async (payload) => {
    try {
      await transferStock(payload);

      toast.success("Stock transferred successfully");

      setShowTransfer(false);
      setTransferProduct(null);

      await Promise.all([
        loadInventory(),
        loadNotifications()
      ]);

      if (activeTab === "TRANSFERS") {
        await loadTransfers();
      }
    } catch (error) {
      console.error("TRANSFER STOCK ERROR:", error);

      toast.error(errorMessage(error));
    }
  };

  // ====================================================
  // RENTAL STOCK ADD / REMOVE
  // ====================================================

  const handleRentalStock = async (item, action) => {
    const productId = getProductId(item);

    if (!productId) {
      toast.error("Rental product ID missing");
      return;
    }

    const available = Number(
      item?.availableQuantity || 0
    );

    const input = window.prompt(
      action === "ADD"
        ? "How many rental units do you want to add?"
        : `How many rental units do you want to remove? Available: ${available}`
    );

    if (input === null || !input.trim()) {
      return;
    }

    const quantity = Number(input);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      toast.error(
        "Enter a valid positive whole number"
      );
      return;
    }

    if (
      action === "REMOVE" &&
      quantity > available
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
        throw new Error(
          response?.message ||
          "Failed to update rental stock"
        );
      }

      toast.success(
        action === "ADD"
          ? "Rental stock added successfully"
          : "Rental stock removed successfully"
      );

      await loadRentalInventory();
    } catch (error) {
      console.error("RENTAL STOCK ERROR:", error);

      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // ====================================================
  // FILTER INVENTORY
  // ====================================================

  const filteredInventory = useMemo(() => {
    const source =
      activeTab === "RENTAL"
        ? rentalInventory
        : inventory;

    return source.filter((item) => {
      const product = getProduct(item);

      const productId =
        activeTab === "RENTAL"
          ? getProductId(item)
          : String(
              product?._id ||
              product?.id ||
              getProductId(item)
            );

      // Notification product filter
      if (
        notificationProductId &&
        productId !== String(notificationProductId)
      ) {
        return false;
      }

      // Search
      const query = search.trim().toLowerCase();

      const searchable = [
        product?.name,
        product?.sku,
        product?.brand?.name,
        product?.category?.name
      ]
        .map((value) =>
          String(value || "").toLowerCase()
        )
        .join(" ");

      if (!searchable.includes(query)) {
        return false;
      }

      // Available stock
      const available =
        activeTab === "RENTAL"
          ? Number(item?.availableQuantity || 0)
          : getAvailableStock(item);

      const status = getStatus(available);

      // Status filter
      if (
        statusFilter !== "ALL" &&
        statusFilter !== status
      ) {
        return false;
      }

      // Store / Warehouse location filter
      if (activeTab === "SALE") {
        if (
          locationFilter === "IN_STORE" &&
          Number(item?.currentStock || 0) <= 0
        ) {
          return false;
        }

        if (
          locationFilter === "IN_WAREHOUSE" &&
          Number(item?.warehouseStock || 0) <= 0
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeTab,
    inventory,
    rentalInventory,
    notificationProductId,
    search,
    statusFilter,
    locationFilter
  ]);

  // ====================================================
  // SUMMARY CARDS
  // ====================================================

  const summary = useMemo(() => {
    const source =
      activeTab === "RENTAL"
        ? rentalInventory
        : inventory;

    const available = (item) =>
      activeTab === "RENTAL"
        ? Number(item?.availableQuantity || 0)
        : getAvailableStock(item);

    return {
      totalProducts: source.length,

      inStock: source.filter(
        (item) =>
          getStatus(available(item)) === "IN_STOCK"
      ).length,

      lowStock: source.filter(
        (item) =>
          getStatus(available(item)) === "LOW_STOCK"
      ).length,

      outOfStock: source.filter(
        (item) =>
          getStatus(available(item)) === "OUT_OF_STOCK"
      ).length,

      totalStock: source.reduce(
        (sum, item) =>
          sum +
          Number(
            activeTab === "RENTAL"
              ? item?.totalQuantity || 0
              : item?.currentStock || 0
          ),
        0
      ),

      warehouseStock: inventory.reduce(
        (sum, item) =>
          sum + Number(item?.warehouseStock || 0),
        0
      ),

      rented: rentalInventory.reduce(
        (sum, item) =>
          sum + Number(item?.rentedQuantity || 0),
        0
      )
    };
  }, [
    activeTab,
    inventory,
    rentalInventory
  ]);

  // ====================================================
  // REFRESH CURRENT TAB
  // ====================================================

  const handleRefresh = () => {
    if (activeTab === "RENTAL") {
      loadRentalInventory();
    } else if (activeTab === "TRANSFERS") {
      loadTransfers();
    } else {
      loadInventory();
    }

    loadNotifications();
  };

  // ====================================================
  // LOADING
  // ====================================================

  const isLoading =
    activeTab === "RENTAL"
      ? rentalLoading
      : loading;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="inventory-dashboard">

      {/* ================================================
          HEADER
      ================================================ */}

      <div className="inventory-page-header">
        <div>
          <h1>Inventory Management</h1>

          <p>
            Manage store, warehouse, refurbished and rental stock
          </p>
        </div>
      </div>

      {/* ================================================
          NOTIFICATIONS
      ================================================ */}

      <div
        className="inventory-notification-badge"
        aria-label={`${inventoryUnreadCount} unread inventory notifications`}
        title={`${inventoryUnreadCount} unread inventory notifications`}
      >
        🔔

        {inventoryUnreadCount > 0 && (
          <span>{inventoryUnreadCount}</span>
        )}
      </div>

      {/* ================================================
          TABS
      ================================================ */}

      <div className="inventory-stock-tabs">

        <button
          type="button"
          className={
            activeTab === "SALE" ? "active" : ""
          }
          onClick={() => setActiveTab("SALE")}
        >
          New & Refurbished
        </button>

        <button
          type="button"
          className={
            activeTab === "RENTAL" ? "active" : ""
          }
          onClick={() => setActiveTab("RENTAL")}
        >
          Rental Inventory
        </button>

        <button
          type="button"
          className={
            activeTab === "TRANSFERS" ? "active" : ""
          }
          onClick={() => setActiveTab("TRANSFERS")}
        >
          Transfer History
        </button>

        <button
          type="button"
          className="inventory-refresh-btn"
          onClick={handleRefresh}
          disabled={
            loading ||
            rentalLoading ||
            transfersLoading
          }
        >
          Refresh
        </button>

      </div>

      {/* ================================================
          TRANSFER HISTORY
      ================================================ */}

      {activeTab === "TRANSFERS" ? (

        transfersLoading ? (

          <div className="inventory-loading">
            Loading transfer history...
          </div>

        ) : (

          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Qty</th>
                  <th>Store (Before → After)</th>
                  <th>Warehouse (Before → After)</th>
                  <th>Note</th>
                  <th>By</th>
                </tr>
              </thead>

              <tbody>

                {transfers.length === 0 ? (

                  <tr>
                    <td
                      colSpan={12}
                      className="no-data"
                    >
                      No transfers found
                    </td>
                  </tr>

                ) : (

                  transfers.map((transfer, index) => (

                    <tr key={transfer._id || index}>

                      <td>{index + 1}</td>

                      <td>
                        {formatDate(transfer.createdAt)}
                      </td>

                      <td>
                        <strong>
                          {transfer.product?.name || "-"}
                        </strong>
                      </td>

                      <td>
                        {transfer.product?.sku || "-"}
                      </td>

                      <td>
                        {transfer.movementType === "WAREHOUSE_IN"
                          ? "Warehouse In"
                          : "Transfer"}
                      </td>

                      <td>
                        {locationLabel(transfer.fromLocation)}
                      </td>

                      <td>
                        {locationLabel(transfer.toLocation)}
                      </td>

                      <td>
                        <strong>
                          {transfer.quantity ?? 0}
                        </strong>
                      </td>

                      <td>
                        {transfer.storeStockBefore ?? 0}
                        {" → "}
                        {transfer.storeStockAfter ?? 0}
                      </td>

                      <td>
                        {transfer.warehouseStockBefore ?? 0}
                        {" → "}
                        {transfer.warehouseStockAfter ?? 0}
                      </td>

                      <td>
                        {transfer.note || "-"}
                      </td>

                      <td>
                        {personName(transfer.transferredBy)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )

      ) : (

        <>

          {/* ============================================
              SUMMARY CARDS
          ============================================ */}

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
              <h3>
                {activeTab === "SALE"
                  ? "Store Stock"
                  : "Total Stock"}
              </h3>

              <h2>{summary.totalStock}</h2>
            </div>

            {activeTab === "SALE" && (

              <div className="card blue">
                <h3>Warehouse Stock</h3>
                <h2>{summary.warehouseStock}</h2>
              </div>

            )}

            {activeTab === "RENTAL" && (

              <div className="card blue">
                <h3>Currently Rented</h3>
                <h2>{summary.rented}</h2>
              </div>

            )}

          </div>

          {/* ============================================
              SEARCH AND FILTERS
          ============================================ */}

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

            {activeTab === "SALE" && (

              <select
                value={locationFilter}
                onChange={(event) =>
                  setLocationFilter(event.target.value)
                }
              >
                <option value="ALL">All Locations</option>

                <option value="IN_STORE">
                  Available In Store
                </option>

                <option value="IN_WAREHOUSE">
                  Available In Warehouse
                </option>

              </select>

            )}

          </div>

          {/* ============================================
              INVENTORY TABLE
          ============================================ */}

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

                    <th>
                      {activeTab === "SALE"
                        ? "Store Stock"
                        : "Total"}
                    </th>

                    <th>
                      {activeTab === "RENTAL"
                        ? "Rented"
                        : "Reserved"}
                    </th>

                    <th>Available</th>

                    {activeTab === "SALE" && (
                      <th>Warehouse</th>
                    )}

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

                  {filteredInventory.length === 0 ? (

                    <tr>
                      <td
                        colSpan={activeTab === "SALE" ? 15 : 12}
                        className="no-data"
                      >
                        No products found
                      </td>
                    </tr>

                  ) : (

                    filteredInventory.map((item, index) => {

                      const product = getProduct(item);

                      const productId =
                        activeTab === "RENTAL"
                          ? getProductId(item)
                          : String(
                              product?._id ||
                              product?.id ||
                              getProductId(item)
                            );

                      const inventoryId =
                        getInventoryId(item);

                      const available =
                        activeTab === "RENTAL"
                          ? Number(item?.availableQuantity || 0)
                          : getAvailableStock(item);

                      const status = getStatus(available);

                      const image = product?.images?.length
                        ? getImageUrl(product.images[0])
                        : "";

                      const busy =
                        busyId === productId ||
                        busyId === inventoryId;

                      return (

                        <tr
                          key={
                            item?.rentalProductId ||
                            inventoryId ||
                            productId ||
                            index
                          }
                        >

                          <td>{index + 1}</td>

                          {/* IMAGE */}

                          <td>

                            {image ? (

                              <img
                                src={image}
                                alt={product?.name || "Product"}
                                className="inventory-image"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />

                            ) : (

                              <div className="inventory-no-image">
                                No Image
                              </div>

                            )}

                          </td>

                          {/* PRODUCT */}

                          <td>
                            <strong>
                              {product?.name || "-"}
                            </strong>
                          </td>

                          <td>
                            {product?.sku || "-"}
                          </td>

                          <td>
                            {product?.brand?.name || "-"}
                          </td>

                          <td>
                            {product?.category?.name || "-"}
                          </td>

                          {/* SALE PRICE */}

                          {activeTab === "SALE" && (

                            <td>
                              ₹{" "}
                              {product?.pricing?.sellingPrice ?? 0}
                            </td>

                          )}

                          {/* TOTAL / STORE STOCK */}

                          <td>
                            <strong>
                              {activeTab === "RENTAL"
                                ? item?.totalQuantity ?? 0
                                : item?.currentStock ?? 0}
                            </strong>
                          </td>

                          {/* RESERVED / RENTED */}

                          <td>
                            {activeTab === "RENTAL"
                              ? item?.rentedQuantity ?? 0
                              : item?.reservedStock ?? 0}
                          </td>

                          {/* AVAILABLE */}

                          <td>
                            <strong>{available}</strong>
                          </td>

                          {/* WAREHOUSE STOCK */}

                          {activeTab === "SALE" && (

                            <td>
                              <strong>
                                {Number(item?.warehouseStock || 0)}
                              </strong>
                            </td>

                          )}

                          {/* MIN / MAX OR RENT */}

                          {activeTab === "RENTAL" ? (

                            <td>
                              {item?.monthlyRent !== undefined
                                ? `₹ ${item.monthlyRent}`
                                : "—"}
                            </td>

                          ) : (

                            <>
                              <td>
                                {item?.minimumStock ?? 0}
                              </td>

                              <td>
                                {item?.maximumStock ?? 0}
                              </td>
                            </>

                          )}

                          {/* STATUS */}

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

                          {/* ACTIONS */}

                          <td>

                            <div className="inventory-actions">

                              {activeTab === "RENTAL" ? (

                                <>

                                  <button
                                    type="button"
                                    className="add-btn"
                                    disabled={busy || !productId}
                                    onClick={() =>
                                      handleRentalStock(item, "ADD")
                                    }
                                  >
                                    + Stock
                                  </button>

                                  <button
                                    type="button"
                                    className="remove-btn"
                                    disabled={
                                      busy ||
                                      !productId ||
                                      available <= 0
                                    }
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
                                    disabled={busy || !productId}
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
                                    disabled={busy || !productId}
                                    onClick={() =>
                                      handleRemoveStock(productId)
                                    }
                                  >
                                    − Stock
                                  </button>

                                  <button
                                    type="button"
                                    className="add-btn"
                                    disabled={busy || !productId}
                                    onClick={() => {
                                      setTransferProduct(item);
                                      setShowTransfer(true);
                                    }}
                                  >
                                    Transfer
                                  </button>

                                  <button
                                    type="button"
                                    className="inventory-delete-btn"
                                    disabled={busy || !inventoryId}
                                    onClick={() =>
                                      handleDelete(item)
                                    }
                                  >
                                    {busy && busyId === inventoryId
                                      ? "Deleting..."
                                      : "Delete"}
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

        </>

      )}

      {/* ================================================
          ADD STOCK MODAL
      ================================================ */}

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

      {/* ================================================
          TRANSFER STOCK MODAL
      ================================================ */}

      {showTransfer && transferProduct && (

        <TransferStockModal
          item={transferProduct}
          onClose={() => {
            setShowTransfer(false);
            setTransferProduct(null);
          }}
          onSave={handleTransfer}
        />

      )}

    </div>
  );
}
