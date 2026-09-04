import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCompare } from "../context/CompareContext"

const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";

const getImageUrl = (imgSource) => {
  if (!imgSource) return "";
  if (typeof imgSource === "object" && imgSource.url) imgSource = imgSource.url;
  if (imgSource.startsWith("http")) return imgSource;
  return `${SERVER_URL}${imgSource.startsWith("/") ? "" : "/"}${imgSource}`;
};

const getProductImage = (product) => {
  if (product.images?.length) return getImageUrl(product.images[0]);
  if (product.primaryImage) return getImageUrl(product.primaryImage);
  if (product.image) return getImageUrl(product.image);
  return "";
};

const getCategoryLabel = (product) => {
  const raw = product?.category ?? product?.categoryId ?? product?.categoryData;
  if (!raw) return "—";
  if (typeof raw === "object") {
    return String(raw.name ?? raw.title ?? raw.categoryName ?? "—").trim() || "—";
  }
  return String(raw).trim() || "—";
};

const getPrice = (product) => {
  const sellingPrice =
    product.pricing?.sellingPrice ?? product.sellingPrice ?? product.price ?? 0;
  return sellingPrice ? `₹${Number(sellingPrice).toLocaleString("en-IN")}` : "—";
};

const getMrp = (product) => {
  const mrp = product.pricing?.mrp ?? product.mrp ?? product.originalPrice ?? 0;
  return mrp ? `₹${Number(mrp).toLocaleString("en-IN")}` : "—";
};

// Spec rows shown in the table. Each `value` resolves a field off the
// product object, falling back to "—" when the field isn't present.
const SPEC_ROWS = [
  { label: "Price", value: (p) => getPrice(p) },
  { label: "MRP", value: (p) => getMrp(p) },
  { label: "Category", value: (p) => getCategoryLabel(p) },
  { label: "Brand", value: (p) => p.brand?.name ?? p.brand ?? "—" },
  { label: "Processor", value: (p) => p.processor ?? p.specs?.processor ?? "—" },
  { label: "RAM", value: (p) => p.ram ?? p.specs?.ram ?? "—" },
  { label: "Storage", value: (p) => p.storage ?? p.specs?.storage ?? "—" },
  { label: "Display", value: (p) => p.display ?? p.specs?.display ?? "—" },
  { label: "Battery", value: (p) => p.battery ?? p.specs?.battery ?? "—" },
  { label: "Warranty", value: (p) => p.warranty ?? p.specs?.warranty ?? "—" },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------
  // EMPTY / SINGLE PRODUCT STATE
  // ---------------------------------------------------------------------
  if (compareList.length < 2) {
    const isEmpty = compareList.length === 0;

    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isEmpty
            ? "No products added to compare yet."
            : "Add at least one more product to compare."}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
          {isEmpty
            ? "Browse our laptops and tap the compare icon on any product to add it here."
            : "You've added 1 product so far. Add one more from the shop to see a full comparison."}
        </p>

        {/* Show the single selected product as a preview card, if any */}
        {!isEmpty && (
          <div className="max-w-[220px] mx-auto mb-8 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-900">
            <img
              src={getProductImage(compareList[0])}
              alt=""
              className="w-full h-28 object-contain mb-3"
            />
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {compareList[0].title || compareList[0].name}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          Browse Laptops
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // COMPARISON TABLE (2+ PRODUCTS)
  // ---------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/shop")}
            className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            aria-label="Back to shop"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Compare products ({compareList.length})
          </h1>
        </div>

        <button
          onClick={clearCompare}
          className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-2xl">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className="w-40 sm:w-48 text-left align-top p-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky left-0 z-10">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                  Product
                </span>
              </th>

              {compareList.map((product) => {
                const productId = product._id || product.id;
                return (
                  <th
                    key={productId}
                    className="min-w-[220px] align-top p-4 border-b border-l border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(productId)}
                        aria-label="Remove from compare"
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <Link to={`/shop/product/${productId}`} className="block">
                        <img
                          src={getProductImage(product)}
                          alt=""
                          className="w-full h-28 object-contain mb-3"
                        />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 text-left">
                          {product.title || product.name}
                        </p>
                      </Link>

                      <button
                        className="mt-3 w-full flex items-center justify-center gap-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold py-2 rounded-full hover:opacity-90 transition"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to cart
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {SPEC_ROWS.map((row, rowIndex) => (
              <tr
                key={row.label}
                className={rowIndex % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-gray-50/60 dark:bg-slate-900/60"}
              >
                <td className="p-4 text-sm font-semibold text-gray-700 dark:text-slate-300 border-b border-gray-200 dark:border-slate-800 sticky left-0 bg-inherit">
                  {row.label}
                </td>
                {compareList.map((product) => {
                  const productId = product._id || product.id;
                  return (
                    <td
                      key={productId}
                      className="p-4 text-sm text-gray-900 dark:text-slate-100 border-b border-l border-gray-200 dark:border-slate-800"
                    >
                      {row.value(product)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}