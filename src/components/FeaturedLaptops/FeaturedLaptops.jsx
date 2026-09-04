
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LaptopCard from "./LaptopCard";
import { getShopProducts } from "../../services/productService";

// =====================================================
// TABS
// =====================================================

const tabs = [
  "New Arrivals",
  "Best Sellers",
  "Refurbished Deals",
  "Gaming Laptops",
];

// =====================================================
// COMPONENT
// =====================================================

const FeaturedLaptops = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("New Arrivals");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // IMAGE BASE URL
  // =====================================================

  // VITE_API_URL normally points to /api, while uploaded product
  // images are served from the backend root: /uploads/...
  const API_URL = String(import.meta.env.VITE_API_URL || "")
    .replace(/\/$/, "")
    .replace(/\/api\/?$/, "");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================================
  // LOAD SHOP PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getShopProducts();

      console.log("====================================");
      console.log("FEATURED LAPTOPS API RESPONSE:", response);
      console.log("====================================");

      const data = response?.data;

      let productList = [];

      // Possible API response structures
      if (Array.isArray(data)) {
        productList = data;
      } else if (Array.isArray(data?.data)) {
        productList = data.data;
      } else if (Array.isArray(data?.products)) {
        productList = data.products;
      } else if (Array.isArray(data?.data?.products)) {
        productList = data.data.products;
      } else if (Array.isArray(data?.result)) {
        productList = data.result;
      } else if (Array.isArray(data?.result?.products)) {
        productList = data.result.products;
      }

      console.log("FEATURED LAPTOPS PRODUCTS:", productList);

      setProducts(productList);
    } catch (error) {
      console.error("FEATURED LAPTOPS LOAD ERROR:", error);
      console.error(
        "FEATURED LAPTOPS BACKEND RESPONSE:",
        error?.response?.data
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET NAME FROM STRING / OBJECT
  // =====================================================

  const getName = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return (
        value?.name ||
        value?.title ||
        value?.label ||
        value?.categoryName ||
        value?.brandName ||
        ""
      );
    }

    return String(value);
  };

  // =====================================================
  // BUILD IMAGE URL
  // =====================================================

  const buildImageUrl = (image) => {
    if (!image) return "";

    let imageUrl = String(image).trim();

    if (!imageUrl) return "";

    // Already full URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("blob:") ||
      imageUrl.startsWith("data:")
    ) {
      return imageUrl;
    }

    // Backend usually returns paths such as /uploads/products/xxx.png
    // Keep the leading slash when no API URL is configured.
    if (imageUrl.startsWith("/")) {
      return API_URL ? `${API_URL}${imageUrl}` : imageUrl;
    }

    return API_URL ? `${API_URL}/${imageUrl}` : `/${imageUrl}`;
  };

  // =====================================================
  // GET PRODUCT IMAGES
  // =====================================================

  const getProductImages = (product) => {
    const result = [];

    // -----------------------------------------------------
    // images array
    // -----------------------------------------------------

    if (Array.isArray(product?.images)) {
      product.images.forEach((image) => {
        if (!image) return;

        if (typeof image === "object") {
          const url =
            image?.url ||
            image?.path ||
            image?.src ||
            image?.image ||
            image?.secure_url;

          if (url) {
            result.push(buildImageUrl(url));
          }
        } else {
          result.push(buildImageUrl(image));
        }
      });
    }

    // -----------------------------------------------------
    // image object
    // -----------------------------------------------------

    if (product?.image && typeof product.image === "object") {
      const url =
        product.image?.url ||
        product.image?.path ||
        product.image?.src ||
        product.image?.secure_url;

      if (url) {
        result.push(buildImageUrl(url));
      }
    }

    // -----------------------------------------------------
    // single image fields
    // -----------------------------------------------------

    const singleImages = [
      product?.primaryImage,
      product?.thumbnail,
      product?.imageUrl,
      product?.image,
      product?.photo,
      product?.coverImage,
      product?.featuredImage,
    ];

    singleImages.forEach((image) => {
      if (!image) return;

      if (typeof image === "object") {
        const url =
          image?.url ||
          image?.path ||
          image?.src ||
          image?.secure_url;

        if (url) {
          result.push(buildImageUrl(url));
        }
      } else {
        result.push(buildImageUrl(image));
      }
    });

    // Remove duplicates and empty values
    return [...new Set(result.filter(Boolean))];
  };

  // =====================================================
  // NORMALIZE IMAGE FIELDS FROM API
  // =====================================================

  const normalizeProductImages = (product) => {
    const images = getProductImages(product);

    return {
      ...product,
      images,
      image: images[0] || "",
      primaryImage: images[0] || "",
      hoverImage: images[1] || images[0] || "",
      thumbnail: images[0] || "",
      imageUrl: images[0] || "",
    };
  };

  // =====================================================
  // GET PRIMARY IMAGE
  // =====================================================

  const getImageUrl = (product, index = 0) => {
    const images = getProductImages(product);

    if (!images.length) {
      return "";
    }

    return images[index] || images[0];
  };

  // =====================================================
  // PRICE
  // =====================================================

  const getProductPrice = (product) => {
    const price =
      product?.finalPrice ??
      product?.sellingPrice ??
      product?.salePrice ??
      product?.price ??
      product?.pricing?.finalPrice ??
      product?.pricing?.sellingPrice ??
      product?.pricing?.salePrice ??
      0;

    return Number(price) || 0;
  };

  // =====================================================
  // MRP
  // =====================================================

  const getProductMRP = (product) => {
    const mrp =
      product?.mrp ??
      product?.originalPrice ??
      product?.regularPrice ??
      product?.pricing?.mrp ??
      product?.pricing?.originalPrice ??
      product?.pricing?.regularPrice ??
      0;

    const numericMrp = Number(mrp) || 0;

    if (numericMrp > 0) {
      return numericMrp;
    }

    return getProductPrice(product);
  };

  // =====================================================
  // DISCOUNT
  // =====================================================

  const getDiscount = (product) => {
    const backendDiscount =
      product?.discountPercentage ??
      product?.discountPercent ??
      product?.discount ??
      product?.pricing?.discountPercentage ??
      product?.pricing?.discountPercent ??
      product?.pricing?.discount;

    if (
      backendDiscount !== undefined &&
      backendDiscount !== null &&
      backendDiscount !== ""
    ) {
      const numericDiscount = Number(backendDiscount);

      if (!Number.isNaN(numericDiscount)) {
        return Math.max(0, Math.round(numericDiscount));
      }
    }

    const price = getProductPrice(product);
    const mrp = getProductMRP(product);

    if (mrp > price && price > 0) {
      return Math.round(((mrp - price) / mrp) * 100);
    }

    return 0;
  };

  // =====================================================
  // REFURBISHED CHECK
  // =====================================================

  const isRefurbished = (product) => {
    const values = [
      product?.productType,
      product?.condition,
      product?.productCondition,
      product?.type,
    ];

    const text = values
      .filter(Boolean)
      .map((value) => getName(value))
      .join(" ")
      .toUpperCase()
      .trim();

    return (
      text.includes("REFURBISHED") ||
      text.includes("REFURBISH") ||
      text.includes("RENEWED")
    );
  };

  // =====================================================
  // CATEGORY
  // =====================================================

  const getCategory = (product) => {
    return getName(product?.category).toLowerCase().trim();
  };

  // =====================================================
  // SUBCATEGORY
  // =====================================================

  const getSubcategory = (product) => {
    return getName(product?.subcategory).toLowerCase().trim();
  };

  // =====================================================
  // GAMING CHECK
  // =====================================================

  const isGamingLaptop = (product) => {
    const text = [
      product?.name,
      product?.title,
      product?.description,
      product?.shortDescription,
      product?.productType,
      product?.condition,
      getName(product?.brand),
      getName(product?.category),
      getName(product?.subcategory),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const gamingKeywords = [
      "gaming",
      "tuf",
      "rog",
      "strix",
      "legion",
      "loq",
      "omen",
      "nitro",
      "predator",
      "alienware",
      "raider",
      "katana",
      "victus",
      "aorus",
      "gaming laptop",
    ];

    return gamingKeywords.some((keyword) =>
      text.includes(keyword)
    );
  };

  // =====================================================
  // FORMAT PRODUCT
  // =====================================================

  const formatProduct = (product) => {
    const price = getProductPrice(product);
    const mrp = getProductMRP(product);
    const discount = getDiscount(product);
    const refurbished = isRefurbished(product);

    const brand = getName(product?.brand);
    const category = getName(product?.category);
    const subcategory = getName(product?.subcategory);

    const description =
      product?.shortDescription ||
      product?.description ||
      "";

    const images = getProductImages(product);

    // -----------------------------------------------------
    // BADGE
    // -----------------------------------------------------

    let badge = "NEW";
    let badgeBg = "bg-emerald-600";

    if (refurbished) {
      badge = "REFURBISHED";
      badgeBg = "bg-emerald-600";
    } else if (discount > 0) {
      badge = `${discount}% OFF`;
      badgeBg = "bg-red-600";
    }

    return normalizeProductImages({
      ...product,

      // ID
      id: product?._id || product?.id,

      // Name
      title:
        product?.name ||
        product?.title ||
        "Laptop",

      // Description
      subtitle:
        description ||
        [brand, category, subcategory]
          .filter(Boolean)
          .join(" • ") ||
        "Premium Laptop",

      // Price
      price,

      originalPrice: mrp,

      discount,

      // Rating
      rating: Number(
        product?.rating ??
          product?.averageRating ??
          product?.reviews?.averageRating ??
          0
      ),

      // Images
      primaryImage:
        images[0] || getImageUrl(product, 0),

      hoverImage:
        images[1] ||
        images[0] ||
        getImageUrl(product, 0),

      // Product type
      productType: refurbished
        ? "REFURBISHED"
        : String(
            product?.productType || "NEW"
          ).toUpperCase(),

      // Badge
      badge,
      badgeBg,
    });
  };

  // =====================================================
  // FORMATTED PRODUCTS
  // =====================================================

  const formattedProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products
      .map(formatProduct)
      .filter((product) => product?.id);
  }, [products]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    // -----------------------------------------------------
    // NEW ARRIVALS
    // -----------------------------------------------------

    if (activeTab === "New Arrivals") {
      return formattedProducts
        .filter(
          (product) =>
            !isRefurbished(product)
        )
        .slice(0, 8);
    }

    // -----------------------------------------------------
    // BEST SELLERS
    // -----------------------------------------------------

    if (activeTab === "Best Sellers") {
      return [...formattedProducts]
        .filter(
          (product) =>
            !isRefurbished(product)
        )
        .sort((a, b) => {
          const ratingA = Number(
            a?.rating || 0
          );

          const ratingB = Number(
            b?.rating || 0
          );

          const salesA = Number(
            a?.soldCount ??
              a?.salesCount ??
              a?.totalSold ??
              0
          );

          const salesB = Number(
            b?.soldCount ??
              b?.salesCount ??
              b?.totalSold ??
              0
          );

          // Sales first
          if (salesB !== salesA) {
            return salesB - salesA;
          }

          // Rating second
          return ratingB - ratingA;
        })
        .slice(0, 8);
    }

    // -----------------------------------------------------
    // REFURBISHED DEALS
    // -----------------------------------------------------

    if (activeTab === "Refurbished Deals") {
      return formattedProducts
        .filter((product) =>
          isRefurbished(product)
        )
        .sort(
          (a, b) =>
            Number(b.discount || 0) -
            Number(a.discount || 0)
        )
        .slice(0, 8);
    }

    // -----------------------------------------------------
    // GAMING LAPTOPS
    // -----------------------------------------------------

    if (activeTab === "Gaming Laptops") {
      return formattedProducts
        .filter((product) =>
          isGamingLaptop(product)
        )
        .slice(0, 8);
    }

    return formattedProducts.slice(0, 8);
  }, [formattedProducts, activeTab]);

  // =====================================================
  // GO TO SHOP
  // =====================================================

  const handleViewAll = () => {
    navigate("/shop");
  };

  // =====================================================
  // GO TO SHOP AND ALWAYS START AT TOP
  // =====================================================

  const handleShopNavigation = () => {
    navigate("/shop");

    // React Router navigation does not automatically reset
    // the browser scroll position.
    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }, 0);
  };

  // =====================================================
  // HANDLE TAB
  // =====================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // =====================================================
  // IMAGE FALLBACK
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      className="
        pt-4
        sm:pt-6
        pb-4
        sm:pb-6
        px-4
        max-w-7xl
        mx-auto
        font-sans
        bg-white
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-6">
        <h2
          className="
            text-xl
            md:text-2xl
            font-black
            uppercase
            tracking-widest
            text-gray-900
            dark:text-white
          "
        >
          FEATURED LAPTOPS
        </h2>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-center
          gap-6
          md:gap-10
          mb-8
          border-b
          border-gray-100
          dark:border-slate-800
          overflow-x-auto
          scrollbar-hide
          pb-2
        "
      >
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() =>
                handleTabChange(tab)
              }
              className={`
                text-sm
                font-bold
                transition-all
                relative
                pb-2
                whitespace-nowrap
                ${
                  active
                    ? "text-[#008a45] dark:text-emerald-400"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              {tab}

              {active && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    h-[3px]
                    bg-[#008a45]
                    dark:bg-emerald-400
                    rounded-full
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-[380px]
                rounded-xl
                bg-gray-100
                dark:bg-slate-900
                animate-pulse
              "
            />
          ))}
        </div>
      )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {/* {!loading &&
        filteredProducts.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
          >
            {filteredProducts.map(
              (product) => (
                <LaptopCard
                  key={product.id}
                  product={product}
                  onImageError={
                    handleImageError
                  }
                />
              )
            )}
          </div>
        )} */}


        {!loading &&
  filteredProducts.length > 0 && (
    <div
      className="
        flex
        flex-nowrap
        gap-6
        overflow-x-auto
        overflow-y-hidden
        scrollbar-hide
        pb-2
      "
    >
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="
            flex-none
            w-[280px]
            sm:w-[300px]
            lg:w-[310px]
          "
        >
          <LaptopCard
            product={product}
            onImageError={handleImageError}
          />
        </div>
      ))}
    </div>
  )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-3">
              <Star className="w-8 h-8 text-gray-300" />
            </div>

            <h3
              className="
                text-lg
                font-bold
                text-gray-700
                dark:text-gray-300
              "
            >
              No Products Found
            </h3>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              No products are available
              in this section yet.
            </p>
          </div>
        )}

      {/* =================================================
          VIEW ALL
      ================================================= */}

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={handleShopNavigation}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[#008a45]
            dark:text-emerald-400
            hover:underline
            cursor-pointer
          "
        >
          <span>View All Laptops</span>

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedLaptops;
