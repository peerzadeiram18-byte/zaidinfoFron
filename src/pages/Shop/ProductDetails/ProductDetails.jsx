import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import "./ProductDetails.css";

import {
    getProduct
} from "../../../services/productService";

import {
    getActiveOffers
} from "../../../services/offerService";

import {
    addToCart
} from "../../../services/cartService";

import {
    addToWishlist
} from "../../../services/wishlistService";

import {
    getShopInventory
} from "../../../services/inventoryService";

import ProductReviews from "../../../components/Reviews/ProductReviews";
import AvailabilityRequestModal
    from "../../../components/AvailabilityRequest/AvailabilityRequestModal";
/* =====================================================
   API / IMAGE BASE URL
===================================================== */

const API_URL =
    import.meta.env.VITE_API_URL;

const BASE_URL =
    API_URL?.replace(
        /\/api\/?$/,
        ""
    );


/* =====================================================
   IMAGE URL
===================================================== */

const getImageUrl = (
    imageUrl
) => {

    if (!imageUrl) {
        return "";
    }

    if (
        typeof imageUrl !== "string"
    ) {
        return "";
    }

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        return imageUrl;
    }

    return `${BASE_URL}${
        imageUrl.startsWith("/")
            ? imageUrl
            : `/${imageUrl}`
    }`;
};


/* =====================================================
   PRODUCT ID
===================================================== */

const getProductId = (
    product
) => {

    if (!product) {
        return null;
    }

    if (
        typeof product === "string"
    ) {
        return product;
    }

    return (
        product._id ||
        product.id ||
        product.product?._id ||
        product.product?.id ||
        null
    );
};



/* =====================================================
   PRODUCT PRICE
===================================================== */

const getProductPrice = (
    product
) => {

    if (!product) {
        return 0;
    }

    const price =
        product?.pricing?.sellingPrice ??
        product?.sellingPrice ??
        product?.price ??
        product?.mrp ??
        product?.finalPrice ??
        0;

    return Number(price) || 0;
};


/* =====================================================
   MRP
===================================================== */

const getProductMrp = (
    product
) => {

    if (!product) {
        return 0;
    }

    return Number(
        product?.mrp ??
        product?.pricing?.mrp ??
        0
    ) || 0;
};


/* =====================================================
   STOCK VALUE HELPER
===================================================== */

const extractStockValue = (
    item
) => {

    if (!item) {
        return null;
    }


    /*
     * Direct values
     */

    const possibleValues = [

        item.stock,

        item.quantity,

        item.availableStock,

        item.currentStock,

        item.availableQuantity,

        item.totalStock,

        item.balanceStock,

        item.inventory?.stock,

        item.inventory?.quantity,

        item.inventory?.availableStock,

        item.inventoryData?.stock,

        item.inventoryData?.quantity,

        item.inventoryData?.availableStock

    ];


    for (
        const value of possibleValues
    ) {

        if (
            typeof value === "number" &&
            !Number.isNaN(value)
        ) {
            return value;
        }

        /*
         * Backend kabhi number
         * string ke form mein bhej sakta hai.
         */

        if (
            typeof value === "string" &&
            value.trim() !== ""
        ) {

            const parsed =
                Number(value);

            if (
                !Number.isNaN(parsed)
            ) {
                return parsed;
            }
        }
    }


    return null;
};


/* =====================================================
   PRODUCT STOCK FALLBACK
===================================================== */

const getProductStock = (
    product
) => {

    if (!product) {
        return 0;
    }


    /*
     * Direct product stock
     */

    const directStock =
        extractStockValue(
            product
        );


    if (
        directStock !== null
    ) {

        return Math.max(
            directStock,
            0
        );
    }


    /*
     * inventory object
     */

    if (
        product.inventory &&
        !Array.isArray(
            product.inventory
        )
    ) {

        const inventoryStock =
            extractStockValue(
                product.inventory
            );


        if (
            inventoryStock !== null
        ) {

            return Math.max(
                inventoryStock,
                0
            );
        }
    }


    /*
     * inventory array
     */

    if (
        Array.isArray(
            product.inventory
        )
    ) {

        let totalStock = 0;


        product.inventory.forEach(
            (
                inventoryItem
            ) => {

                const value =
                    extractStockValue(
                        inventoryItem
                    );


                if (
                    value !== null
                ) {

                    totalStock +=
                        value;
                }
            }
        );


        if (
            totalStock > 0
        ) {

            return totalStock;
        }
    }


    /*
     * inventoryData
     */

    if (
        product.inventoryData
    ) {

        const inventoryDataStock =
            extractStockValue(
                product.inventoryData
            );


        if (
            inventoryDataStock !== null
        ) {

            return Math.max(
                inventoryDataStock,
                0
            );
        }
    }


    return 0;
};


/* =====================================================
   INVENTORY PRODUCT ID
===================================================== */

const getInventoryProductId = (
    inventory
) => {

    if (!inventory) {
        return null;
    }


    return (
        inventory.product?._id ||
        inventory.product?.id ||
        inventory.productId?._id ||
        inventory.productId?.id ||
        inventory.productId ||
        inventory._idProduct ||
        inventory._productId ||
        null
    );
};


/* =====================================================
   FIND PRODUCT INVENTORY
===================================================== */

const findProductInventory = (
    product,
    inventoryList
) => {

    if (
        !product ||
        !Array.isArray(
            inventoryList
        )
    ) {

        return null;
    }


    const productId =
        getProductId(
            product
        );


    if (!productId) {
        return null;
    }


    const matchedInventory =
        inventoryList.find(
            (
                inventory
            ) => {

                const inventoryProductId =
                    getInventoryProductId(
                        inventory
                    );


                if (
                    !inventoryProductId
                ) {
                    return false;
                }


                return (
                    String(
                        inventoryProductId
                    ) ===
                    String(
                        productId
                    )
                );
            }
        );


    return (
        matchedInventory ||
        null
    );
};


/* =====================================================
   OFFER ACTIVE CHECK
===================================================== */

const isOfferCurrentlyActive = (
    offer
) => {

    if (!offer) {
        return false;
    }


    if (
        offer.status &&
        String(
            offer.status
        ).toUpperCase() !==
        "ACTIVE"
    ) {

        return false;
    }


    const now =
        new Date();


    if (
        offer.startDate
    ) {

        const start =
            new Date(
                offer.startDate
            );


        if (
            now < start
        ) {

            return false;
        }
    }


    if (
        offer.endDate
    ) {

        const end =
            new Date(
                offer.endDate
            );


        end.setHours(
            23,
            59,
            59,
            999
        );


        if (
            now > end
        ) {

            return false;
        }
    }


    return true;
};


/* =====================================================
   CALCULATE OFFER
===================================================== */

const calculateOfferPrice = (
    product,
    offer
) => {

    const originalPrice =
        getProductPrice(
            product
        );


    if (!offer) {

        return {

            originalPrice,

            finalPrice:
                originalPrice,

            discountAmount:
                0,

            offer:
                null

        };
    }


    const discountValue =
        Number(
            offer.discountValue ??
            0
        );


    if (
        discountValue <= 0
    ) {

        return {

            originalPrice,

            finalPrice:
                originalPrice,

            discountAmount:
                0,

            offer:
                null

        };
    }


    let discountAmount =
        0;


    if (
        String(
            offer.discountType
        ).toUpperCase() ===
        "PERCENTAGE"
    ) {

        discountAmount =
            (
                originalPrice *
                discountValue
            ) / 100;
    }


    else if (
        String(
            offer.discountType
        ).toUpperCase() ===
        "FIXED"
    ) {

        discountAmount =
            discountValue;
    }


    discountAmount =
        Math.min(
            Math.max(
                discountAmount,
                0
            ),
            originalPrice
        );


    const finalPrice =
        originalPrice -
        discountAmount;


    return {

        originalPrice,

        finalPrice,

        discountAmount,

        offer

    };
};


/* =====================================================
   FIND BEST OFFER
===================================================== */

const findBestOffer = (
    product,
    offerList
) => {

    if (
        !product ||
        !Array.isArray(
            offerList
        )
    ) {

        return null;
    }


    const productId =
        getProductId(
            product
        );


    if (!productId) {
        return null;
    }


    const productOffers =
        offerList.filter(
            (
                offer
            ) => {

                if (
                    !Array.isArray(
                        offer?.products
                    )
                ) {

                    return false;
                }


                return offer.products.some(
                    (
                        offerProduct
                    ) => {

                        const offerProductId =
                            getProductId(
                                offerProduct
                            );


                        return (
                            String(
                                offerProductId
                            ) ===
                            String(
                                productId
                            )
                        );
                    }
                );
            }
        );


    if (
        productOffers.length === 0
    ) {

        return null;
    }


    const calculatedOffers =
        productOffers
            .map(
                (
                    offer
                ) =>
                    calculateOfferPrice(
                        product,
                        offer
                    )
            )
            .filter(
                (
                    item
                ) =>
                    item.offer !== null
            );


    if (
        calculatedOffers.length === 0
    ) {

        return null;
    }


    return calculatedOffers.reduce(
        (
            best,
            current
        ) => {

            if (!best) {
                return current;
            }


            return (
                current.finalPrice <
                best.finalPrice
            )
                ? current
                : best;
        },
        null
    );
};


/* =====================================================
   COMPONENT
===================================================== */

const ProductDetails = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    /* =================================================
       STATE
    ================================================= */

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        product,
        setProduct
    ] = useState(null);


    const [
        selectedImage,
        setSelectedImage
    ] = useState("");


    const [
        quantity,
        setQuantity
    ] = useState(1);


    const [
        offerData,
        setOfferData
    ] = useState(null);


    const [
        inventoryLoading,
        setInventoryLoading
    ] = useState(false);

    const [
    showAvailabilityModal,
    setShowAvailabilityModal
] = useState(false);

    /* =================================================
       LOAD
    ================================================= */

    useEffect(() => {

        if (!id) {
            return;
        }


        loadProduct();

    }, [id]);


    /* =================================================
       LOAD PRODUCT
    ================================================= */

    const loadProduct =
        async () => {

            try {

                setLoading(true);


                /*
                 * ======================================
                 * PRODUCT
                 * ======================================
                 */

                const productResponse =
                    await getProduct(
                        id
                    );


                console.log(
                    "PRODUCT API RESPONSE:",
                    productResponse?.data
                );


                const productData =
                    productResponse?.data?.data ||
                    productResponse?.data?.product ||
                    productResponse?.data;


                console.log(
                    "PRODUCT DATA:",
                    productData
                );


                if (!productData) {

                    setProduct(
                        null
                    );

                    return;
                }


                /*
                 * ======================================
                 * IMAGE
                 * ======================================
                 */

                const images =
                    Array.isArray(
                        productData.images
                    )
                        ? productData.images
                        : [];


                if (
                    images.length > 0
                ) {

                    const firstImage =
                        images[0];


                    const firstImagePath =
                        typeof firstImage ===
                        "string"
                            ? firstImage
                            : (
                                firstImage?.url ||
                                firstImage?.path ||
                                firstImage?.image
                            );


                    const firstImageUrl =
                        getImageUrl(
                            firstImagePath
                        );


                    if (
                        firstImageUrl
                    ) {

                        setSelectedImage(
                            firstImageUrl
                        );
                    }
                }


                /*
                 * ======================================
                 * INITIAL PRODUCT
                 * STOCK
                 * ======================================
                 */

                let finalProduct =
                    productData;


                /*
                 * ======================================
                 * INVENTORY API
                 * ======================================
                 */

                try {

                    setInventoryLoading(
                        true
                    );


                    const inventoryResponse =
                        await getShopInventory();


                    console.log(
                        "SHOP INVENTORY RESPONSE:",
                        inventoryResponse?.data
                    );


                    /*
                     * Handle all common response
                     * structures.
                     */

                    const inventoryList =
                        Array.isArray(
                            inventoryResponse?.data?.data
                        )
                            ? inventoryResponse.data.data

                            : Array.isArray(
                                inventoryResponse?.data?.inventory
                            )
                                ? inventoryResponse.data.inventory

                                : Array.isArray(
                                    inventoryResponse?.data?.inventories
                                )
                                    ? inventoryResponse.data.inventories

                                    : Array.isArray(
                                        inventoryResponse?.data
                                    )
                                        ? inventoryResponse.data
                                        : [];


                    console.log(
                        "SHOP INVENTORY LIST:",
                        inventoryList
                    );


                    /*
                     * Find inventory for current
                     * product.
                     */

                    const matchedInventory =
                        findProductInventory(
                            productData,
                            inventoryList
                        );


                    console.log(
                        "MATCHED PRODUCT INVENTORY:",
                        matchedInventory
                    );


                    if (
                        matchedInventory
                    ) {

                        const inventoryStock =
                            extractStockValue(
                                matchedInventory
                            );


                        console.log(
                            "INVENTORY STOCK:",
                            inventoryStock
                        );


                        if (
                            inventoryStock !== null
                        ) {

                            /*
                             * Important:
                             *
                             * Product object ke andar
                             * inventory stock merge kar
                             * rahe hain.
                             */

                            finalProduct = {

                                ...productData,

                                inventory:
                                    matchedInventory,

                                stock:
                                    Math.max(
                                        inventoryStock,
                                        0
                                    )

                            };
                        }
                    }

                } catch (
                    inventoryError
                ) {

                    /*
                     * Inventory API fail hone par
                     * product page break nahi hogi.
                     */

                    console.error(
                        "SHOP INVENTORY ERROR:",
                        inventoryError
                    );

                    console.error(
                        "SHOP INVENTORY ERROR RESPONSE:",
                        inventoryError?.response?.data
                    );

                } finally {

                    setInventoryLoading(
                        false
                    );
                }


                /*
                 * ======================================
                 * SAVE PRODUCT
                 * ======================================
                 */

                setProduct(
                    finalProduct
                );


                /*
                 * ======================================
                 * STOCK
                 * ======================================
                 */

                const stock =
                    getProductStock(
                        finalProduct
                    );


                console.log(
                    "FINAL PRODUCT STOCK:",
                    stock
                );


                /*
                 * Quantity reset
                 */

                if (
                    stock <= 0
                ) {

                    setQuantity(
                        1
                    );

                } else {

                    setQuantity(
                        (
                            previous
                        ) =>
                            Math.min(
                                Math.max(
                                    previous,
                                    1
                                ),
                                stock
                            )
                    );
                }


                /*
                 * ======================================
                 * ACTIVE OFFERS
                 * ======================================
                 */

                try {

                    const offersResponse =
                        await getActiveOffers();


                    console.log(
                        "PRODUCT ACTIVE OFFERS RESPONSE:",
                        offersResponse?.data
                    );


                    const offerList =
                        Array.isArray(
                            offersResponse?.data?.offers
                        )
                            ? offersResponse.data.offers

                            : Array.isArray(
                                offersResponse?.data?.data
                            )
                                ? offersResponse.data.data

                                : Array.isArray(
                                    offersResponse?.data
                                )
                                    ? offersResponse.data

                                    : [];


                    const activeOffers =
                        offerList.filter(
                            isOfferCurrentlyActive
                        );


                    const bestOffer =
                        findBestOffer(
                            finalProduct,
                            activeOffers
                        );


                    console.log(
                        "PRODUCT BEST OFFER:",
                        bestOffer
                    );


                    setOfferData(
                        bestOffer
                    );

                } catch (
                    offerError
                ) {

                    console.error(
                        "PRODUCT OFFER ERROR:",
                        offerError
                    );


                    setOfferData(
                        null
                    );
                }

            } catch (
                error
            ) {

                console.error(
                    "GET PRODUCT ERROR:",
                    error
                );


                console.error(
                    "GET PRODUCT ERROR RESPONSE:",
                    error?.response?.data
                );


                setProduct(
                    null
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    /* =================================================
       LOADING
    ================================================= */

    if (loading) {

        return (

            <div className="product-details-loading3">

                <div className="product-spinner3" />

                <p>
                    Loading Product...
                </p>

            </div>
        );
    }


    /* =================================================
       NOT FOUND
    ================================================= */

    if (!product) {

        return (

            <div className="product-details-not-found3">

                <div className="not-found-icon3">
                    📦
                </div>

                <h2>
                    Product Not Found
                </h2>

                <p>
                    The product you are looking for
                    is not available.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/shop")
                    }
                >
                    Back To Shop
                </button>

            </div>
        );
    }


    /* =================================================
       PRODUCT VALUES
    ================================================= */

    const stock =
        getProductStock(
            product
        );


    const isOutOfStock =
        stock <= 0;


    const basePrice =
        getProductPrice(
            product
        );


    const mrp =
        getProductMrp(
            product
        );


    const originalPrice =
        offerData?.originalPrice ??
        basePrice;


    const finalPrice =
        offerData?.finalPrice ??
        basePrice;


    const discountAmount =
        offerData?.discountAmount ??
        0;


    const hasOffer =
        Boolean(
            offerData?.offer
        );


    /* =================================================
       PRODUCT IMAGES
    ================================================= */

    const productImages =
        Array.isArray(
            product.images
        )
            ? product.images
            : [];


    /* =================================================
       QUANTITY
    ================================================= */

    const decreaseQuantity =
        () => {

            setQuantity(
                (
                    previous
                ) =>
                    Math.max(
                        previous - 1,
                        1
                    )
            );
        };


    const increaseQuantity =
        () => {

            if (
                isOutOfStock
            ) {
                return;
            }


            setQuantity(
                (
                    previous
                ) =>
                    Math.min(
                        previous + 1,
                        stock
                    )
            );
        };


    const handleQuantityChange =
        (
            event
        ) => {

            let value =
                Number(
                    event.target.value
                );


            if (
                Number.isNaN(value)
            ) {

                return;
            }


            if (
                value < 1
            ) {

                value = 1;
            }


            if (
                !isOutOfStock &&
                value > stock
            ) {

                value =
                    stock;
            }


            setQuantity(
                value
            );
        };


    /* =================================================
       LOGIN
    ================================================= */

    const requireLogin =
        () => {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                toast.error(
                    "Please Login First"
                );


                navigate(
                    "/login"
                );


                return false;
            }


            return true;
        };


    /* =================================================
       STOCK VALIDATION
    ================================================= */

    const validateStock =
        () => {

            if (
                stock <= 0
            ) {

                toast.error(
                    "Product is out of stock"
                );

                return false;
            }


            if (
                quantity > stock
            ) {

                toast.error(
                    `Only ${stock} item${
                        stock > 1
                            ? "s"
                            : ""
                    } available`
                );


                setQuantity(
                    stock
                );


                return false;
            }


            return true;
        };


    /* =================================================
       ADD TO CART
    ================================================= */

    const handleAddToCart =
        async () => {

            if (
                !requireLogin()
            ) {
                return;
            }


            if (
                !validateStock()
            ) {
                return;
            }


            try {

                await addToCart({

                    product:
                        product._id,

                    quantity:
                        quantity

                });


                toast.success(
                    "Added To Cart"
                );


                navigate(
                    "/cart"
                );

            } catch (
                error
            ) {

                console.error(
                    "ADD TO CART ERROR:",
                    error
                );


                toast.error(
                    error?.response?.data?.message ||
                    "Failed to add to cart"
                );
            }
        };


    /* =================================================
       BUY NOW
    ================================================= */

    const handleBuyNow =
        async () => {

            if (
                !requireLogin()
            ) {
                return;
            }


            if (
                !validateStock()
            ) {
                return;
            }


            try {

                await addToCart({

                    product:
                        product._id,

                    quantity:
                        quantity

                });


                navigate(
                    "/cart"
                );

            } catch (
                error
            ) {

                console.error(
                    "BUY NOW ERROR:",
                    error
                );


                toast.error(
                    error?.response?.data?.message ||
                    "Failed to continue"
                );
            }
        };


    /* =================================================
       WISHLIST
    ================================================= */

    const handleWishlist =
        async () => {

            if (
                !requireLogin()
            ) {
                return;
            }


            try {

                await addToWishlist(
                    product._id
                );


                toast.success(
                    "Added To Wishlist"
                );

            } catch (
                error
            ) {

                console.error(
                    "WISHLIST ERROR:",
                    error
                );


                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update wishlist"
                );
            }
        };


    /* =================================================
       CATEGORY / BRAND
    ================================================= */

    const categoryName =
        product.category?.name ||
        product.categoryName ||
        (
            typeof product.category ===
            "string"
                ? product.category
                : ""
        ) ||
        "N/A";


    const brandName =
        product.brand?.name ||
        product.brandName ||
        (
            typeof product.brand ===
            "string"
                ? product.brand
                : ""
        ) ||
        "N/A";


    /* =================================================
       RETURN
    ================================================= */

    return (

        <div className="product-details-page3">


            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="breadcrumb-wrapper3">

                <div className="breadcrumb3">

                    {/* <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Home
                    </button> */}

                    {/* <span>
                        /
                    </span> */}

                    {/* <button
                        type="button"
                        onClick={() =>
                            navigate("/shop")
                        }
                    >
                        Shop
                    </button> */}

                    {/* <span>
                        /
                    </span> */}

                    <span className="breadcrumb-current3">
                        {product.name}
                    </span>

                </div>

            </div>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="details-container3">


                {/* =================================================
                    LEFT IMAGE
                ================================================= */}

                <section className="left-side3">

                    <div className="main-image-box3">

                        {selectedImage ? (

                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="main-image3"
                            />

                        ) : (

                            <div className="no-image3">

                                <span>
                                    📦
                                </span>

                                <p>
                                    No Image Available
                                </p>

                            </div>
                        )}


                        {hasOffer && (

                            <div className="offer-badge3">

                                {offerData?.offer
                                    ?.discountType
                                    ?.toUpperCase() ===
                                "PERCENTAGE"

                                    ? `${offerData.offer.discountValue}% OFF`

                                    : `₹${Number(
                                        offerData?.offer
                                            ?.discountValue ??
                                        0
                                    )} OFF`
                                }

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        THUMBNAILS
                    ================================================= */}

                    {productImages.length > 0 && (

                        <div className="thumbnail-list3">

                            {productImages.map(
                                (
                                    image,
                                    index
                                ) => {

                                    const imagePath =
                                        typeof image ===
                                        "string"
                                            ? image
                                            : (
                                                image?.url ||
                                                image?.path ||
                                                image?.image
                                            );


                                    const imageUrl =
                                        getImageUrl(
                                            imagePath
                                        );


                                    if (
                                        !imageUrl
                                    ) {

                                        return null;
                                    }


                                    return (

                                        <button
                                            type="button"
                                            key={`${imageUrl}-${index}`}
                                            className={
                                                `thumbnail-button3 ${
                                                    selectedImage ===
                                                    imageUrl
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                setSelectedImage(
                                                    imageUrl
                                                )
                                            }
                                        >

                                            <img
                                                src={
                                                    imageUrl
                                                }
                                                alt={
                                                    product.name
                                                }
                                                className="thumbnail3"
                                            />

                                        </button>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <section className="right-side3">


                    <div className="category-label3">
                        {categoryName}
                    </div>


                    <h1 className="product-title3">
                        {product.name}
                    </h1>


                    <div className="product-meta3">

                        <span>

                            <strong>
                                Brand:
                            </strong>{" "}

                            {brandName}

                        </span>


                        {product.sku && (

                            <span>

                                <strong>
                                    SKU:
                                </strong>{" "}

                                {product.sku}

                            </span>
                        )}

                    </div>


                    {/* =================================================
                        RATING
                    ================================================= */}

                    <div className="rating-row3">

                        <span className="stars3">
                            ★★★★★
                        </span>

                        <span className="rating-text3">
                            Customer Reviews
                        </span>

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <div className="price-box3">

                        <span className="price3">

                            ₹
                            {Number(
                                finalPrice
                            ).toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}

                        </span>


                        {(
                            mrp > finalPrice ||
                            originalPrice > finalPrice
                        ) && (

                            <span className="mrp3">

                                ₹
                                {Number(
                                    Math.max(
                                        mrp,
                                        originalPrice
                                    )
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </span>
                        )}


                        {hasOffer &&
                            discountAmount > 0 && (

                            <span className="saved-price3">

                                Save ₹
                                {Number(
                                    discountAmount
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </span>
                        )}

                    </div>


                    {/* =================================================
                        OFFER
                    ================================================= */}

                    {hasOffer && (

                        <div className="offer-box3">

                            <div className="offer-icon3">
                                🎁
                            </div>

                            <div>

                                <strong>

                                    {offerData?.offer
                                        ?.title ||
                                        "Special Offer"}

                                </strong>

                                <p>

                                    {offerData?.offer
                                        ?.discountType
                                        ?.toUpperCase() ===
                                    "PERCENTAGE"

                                        ? `${offerData.offer.discountValue}% discount available on this product.`

                                        : `₹${offerData?.offer?.discountValue} discount available on this product.`
                                    }

                                </p>

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {product.shortDescription && (

                        <p className="short-desc3">

                            {product.shortDescription}

                        </p>
                    )}


                    {/* =================================================
                        STOCK
                    ================================================= */}

                    <div className="stock-box3">

                        {inventoryLoading ? (

                            <span className="in-stock3">

                                <span>
                                    ●
                                </span>

                                Checking Stock...

                            </span>

                        ) : isOutOfStock ? (

                            <span className="out-stock3">

                                <span>
                                    ●
                                </span>

                                Out Of Stock

                            </span>

                        ) : (

                            <span className="in-stock3">

                                <span>
                                    ●
                                </span>

                                In Stock

                                <small>
                                    {stock} available
                                </small>

                            </span>
                        )}

                    </div>


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <div className="quantity-section3">

                        <label>
                            Quantity
                        </label>


                        <div className="quantity-controls3">

                            <button
                                type="button"
                                disabled={
                                    isOutOfStock ||
                                    quantity <= 1
                                }
                                onClick={
                                    decreaseQuantity
                                }
                            >
                                −
                            </button>


                            <input
                                type="number"
                                min="1"
                                max={
                                    stock > 0
                                        ? stock
                                        : 1
                                }
                                value={
                                    isOutOfStock
                                        ? 1
                                        : quantity
                                }
                                disabled={
                                    isOutOfStock
                                }
                                onChange={
                                    handleQuantityChange
                                }
                            />


                            <button
                                type="button"
                                disabled={
                                    isOutOfStock ||
                                    quantity >= stock
                                }
                                onClick={
                                    increaseQuantity
                                }
                            >
                                +
                            </button>

                        </div>


                        {!isOutOfStock && (

                            <span className="stock-limit3">

                                Maximum available:
                                {" "}
                                {stock}

                            </span>
                        )}

                    </div>


                  
{/* =================================================
    ACTION BUTTONS
================================================= */}


{/* =================================================
    ACTION BUTTONS
================================================= */}

<div className="action-buttons3">

    {isOutOfStock ? (

        <button
            type="button"
            className="availability-request-btn3"
            onClick={() =>
                setShowAvailabilityModal(true)
            }
        >
            <span>
                📦
            </span>

            Request Availability
        </button>

    ) : (

        <>
            <button
                type="button"
                className="cart-btn3"
                onClick={handleAddToCart}
            >
                <span>
                    🛒
                </span>

                Add To Cart
            </button>


            <button
                type="button"
                className="buy-btn3"
                onClick={handleBuyNow}
            >
                Buy Now
            </button>
        </>

    )}


    {/* =================================================
        WISHLIST
    ================================================= */}

    <button
        type="button"
        className="wishlist-btn3"
        onClick={handleWishlist}
    >
        <span>
            ♡
        </span>

        Wishlist
    </button>

</div>






                    {/* =================================================
                        INFO
                    ================================================= */}

                    <div className="product-info-cards3">

                        <div className="info-card3">

                            <span className="info-icon3">
                                🚚
                            </span>

                            <div>

                                <strong>
                                    Fast Delivery
                                </strong>

                                <p>
                                    Reliable delivery
                                    to your address
                                </p>

                            </div>

                        </div>


                        <div className="info-card3">

                            <span className="info-icon3">
                                🔒
                            </span>

                            <div>

                                <strong>
                                    Secure Payment
                                </strong>

                                <p>
                                    Safe and secure
                                    checkout
                                </p>

                            </div>

                        </div>


                        <div className="info-card3">

                            <span className="info-icon3">
                                ↩️
                            </span>

                            <div>

                                <strong>
                                    Easy Support
                                </strong>

                                <p>
                                    Customer support
                                    available
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <section className="content-section3">

                <div className="content-card3">

                    <h2>
                        Product Description
                    </h2>


                    <div className="description-content3">

                        {product.description ? (

                            <p>
                                {product.description}
                            </p>

                        ) : (

                            <p className="empty-content3">
                                No description available.
                            </p>
                        )}

                    </div>

                </div>


                {/* =================================================
                    SPECIFICATIONS
                ================================================= */}

                <div className="content-card3">

                    <h2>
                        Specifications
                    </h2>


                    {Array.isArray(
                        product.specifications
                    ) &&
                    product.specifications.length > 0 ? (

                        <div className="specification-table-wrapper3">

                            <table className="specification-table3">

                                <thead>

                                    <tr>

                                        <th>
                                            Specification
                                        </th>

                                        <th>
                                            Value
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {product.specifications.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    index
                                                }
                                            >

                                                <td>
                                                    {item?.key ||
                                                        item?.name ||
                                                        "N/A"}
                                                </td>

                                                <td>
                                                    {item?.value ||
                                                        "N/A"}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <p className="empty-content3">
                            No specifications available.
                        </p>
                    )}

                </div>

            </section>


            {/* =================================================
                REVIEWS
            ================================================= */}

            <section className="product-reviews-section3">

                <ProductReviews
                    productId={
                        product._id
                    }
                />

            </section>

           
{/* =================================================
    AVAILABILITY REQUEST MODAL
================================================= */}

{showAvailabilityModal && (

    <AvailabilityRequestModal

        product={product}

        onClose={() =>
            setShowAvailabilityModal(false)
        }

        onSuccess={() => {

            setShowAvailabilityModal(false);

            toast.success(
                "Availability request submitted successfully."
            );

        }}

    />

)}



        </div>
    );
};


export default ProductDetails;