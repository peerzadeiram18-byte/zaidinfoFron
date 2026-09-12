import axios from "axios";

/* =========================================================
   BASE URL
========================================================= */


const API_URL = import.meta.env.VITE_API_URL;

const RENTAL_BASE_URL = `${API_URL}/rentals`;


/* =========================================================
   TOKEN
========================================================= */

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        ""
    );
};

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const rentalAxios = axios.create({
    baseURL: RENTAL_BASE_URL,
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

rentalAxios.interceptors.request.use(
    (config) => {

        const token = getToken();

        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        // IMPORTANT:
        // FormData ke liye Content-Type manually mat lagao.
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            delete config.headers["content-type"];
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

const handleError = (error) => {
    console.error(
        "================================"
    );

    console.error(
        "RENTAL API ERROR"
    );

    console.error(
        "URL:",
        error?.config?.url
    );

    console.error(
        "METHOD:",
        error?.config?.method
    );

    console.error(
        "STATUS:",
        error?.response?.status
    );

    console.error(
        "DATA:",
        error?.response?.data
    );

    console.error(
        "MESSAGE:",
        error?.message
    );

    console.error(
        "================================"
    );

    const backendError =
        error?.response?.data;

    if (
        backendError &&
        typeof backendError === "object"
    ) {
        throw backendError;
    }

    throw {
        success: false,
        message:
            error?.message ||
            "Rental API request failed",
    };
};

/* =========================================================
   RENTAL PRODUCTS
========================================================= */

/**
 * GET
 * /api/rentals/products
 *
 * Used by WalkInRental.jsx
 */

export const getRentalProducts = async () => {
    try {
        const response =
            await rentalAxios.get(
                "/products"
            );

        console.log(
            "RENTAL PRODUCTS RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 * GET
 * /api/rentals/product/:productId
 */

export const getRentalProduct = async (
    productId
) => {
    try {
        if (!productId) {
            throw new Error(
                "Product ID is required"
            );
        }

        const response =
            await rentalAxios.get(
                `/product/${productId}`
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   ONLINE RENTAL
========================================================= */

/**
 * POST
 * /api/rentals
 */

export const createRentalRequest = async (
    rentalData
) => {
    try {
        if (!rentalData) {
            throw new Error(
                "Rental data is required"
            );
        }

        const response =
            await rentalAxios.post(
                "/",
                rentalData
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   WALK-IN RENTAL
========================================================= */

/**
 * POST
 * /api/rentals/walk-in
 *
 * Used by WalkInRental.jsx
 */

export const createWalkInRentalRequest =
    async (rentalData) => {
        try {
            if (!rentalData) {
                throw new Error(
                    "Walk-in rental data is required"
                );
            }

            console.log(
                "================================"
            );

            console.log(
                "WALK-IN RENTAL API REQUEST"
            );

            console.log(
                "URL:",
                `${RENTAL_BASE_URL}/walk-in`
            );

            console.log(
                "PAYLOAD:",
                rentalData
            );

            console.log(
                "================================"
            );

            const response =
                await rentalAxios.post(
                    "/walk-in",
                    {
                        ...rentalData,
                        rentalSource:
                            "WALK_IN",
                    }
                );

            console.log(
                "WALK-IN RENTAL RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            return handleError(error);
        }
    };

/* =========================================================
   MY RENTALS
========================================================= */

/**
 * GET
 * /api/rentals/my
 */

export const getMyRentals = async () => {
    try {
        const response =
            await rentalAxios.get(
                "/my"
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   GET SINGLE RENTAL
========================================================= */

/**
 * GET
 * /api/rentals/:id
 */

export const getRentalById = async (
    rentalId
) => {
    try {
        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        const response =
            await rentalAxios.get(
                `/${rentalId}`
            );

        console.log(
            "RENTAL DETAILS:",
            response.data
        );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   ALL RENTALS
========================================================= */

/**
 * GET
 * /api/rentals
 *
 * Used by WalkInRentalOrders.jsx
 */

export const getAllRentals = async () => {
    try {
        console.log(
            "GETTING ALL RENTALS..."
        );

        const response =
            await rentalAxios.get(
                "/"
            );

        console.log(
            "ALL RENTALS RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   APPROVE RENTAL
========================================================= */

/**
 * PATCH
 * /api/rentals/:id/approve
 */

export const approveRental = async (
    rentalId
) => {
    try {
        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        const response =
            await rentalAxios.patch(
                `/${rentalId}/approve`
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   REJECT RENTAL
========================================================= */

/**
 * PATCH
 * /api/rentals/:id/reject
 */

export const rejectRental = async (
    rentalId,
    reason = ""
) => {
    try {
        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        const response =
            await rentalAxios.patch(
                `/${rentalId}/reject`,
                {
                    reason,
                }
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   SECURITY DEPOSIT
========================================================= */

/**
 * PATCH
 * /api/rentals/:id/deposit-received
 *
 * Backend:
 *
 * req.body.paymentMethod
 */

export const markDepositReceived =
    async (
        rentalId,
        paymentMethod = "CASH"
    ) => {
        try {
            if (!rentalId) {
                throw new Error(
                    "Rental ID is required"
                );
            }

            const response =
                await rentalAxios.patch(
                    `/${rentalId}/deposit-received`,
                    {
                        paymentMethod,
                    }
                );

            return response.data;
        } catch (error) {
            return handleError(error);
        }
    };

/* =========================================================
   ALLOCATE RENTAL
========================================================= */

/**
 * PATCH
 * /api/rentals/:id/allocate
 */

export const allocateRental = async (
    rentalId
) => {
    try {
        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        const response =
            await rentalAxios.patch(
                `/${rentalId}/allocate`
            );

        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/* =========================================================
   RETURN RENTAL
========================================================= */

/**
 * PATCH
 * /api/rentals/:id/return
 */

export const markRentalReturned =
    async (
        rentalId,
        returnData = {}
    ) => {
        try {
            if (!rentalId) {
                throw new Error(
                    "Rental ID is required"
                );
            }

            const payload = {
                returnCondition:
                    returnData.returnCondition ||
                    "GOOD",

                damageCharges:
                    Number(
                        returnData.damageCharges ||
                        0
                    ),

                otherDeductions:
                    Number(
                        returnData.otherDeductions ||
                        0
                    ),
            };

            console.log(
                "RETURN RENTAL PAYLOAD:",
                payload
            );

            const response =
                await rentalAxios.patch(
                    `/${rentalId}/return`,
                    payload
                );

            return response.data;
        } catch (error) {
            return handleError(error);
        }
    };

/* =========================================================
   RENTAL INVENTORY
========================================================= */

/**
 * GET
 * /api/rentals/inventory
 */

export const getRentalInventory =
    async () => {
        try {
            const response =
                await rentalAxios.get(
                    "/inventory"
                );

            return response.data;
        } catch (error) {
            return handleError(error);
        }
    };

/* =========================================================
   SAVE RENTAL PRODUCT
========================================================= */

/**
 * PUT
 * /api/rentals/product/:productId
 */

export const saveRentalProduct =
    async (
        productId,
        rentalData
    ) => {
        try {
            if (!productId) {
                throw new Error(
                    "Product ID is required"
                );
            }

            const response =
                await rentalAxios.put(
                    `/product/${productId}`,
                    rentalData
                );

            return response.data;
        } catch (error) {
            return handleError(error);
        }
    };

/* =========================================================
   RENTAL DOCUMENT UPLOAD
========================================================= */

/**
 * POST
 * /api/rentals/:rentalId/documents
 */

/* =========================================================
   RENTAL DOCUMENT UPLOAD
========================================================= */

/**
 * POST
 * /api/rentals/:rentalId/documents
 */

/* =========================================================
   RENTAL DOCUMENT UPLOAD
========================================================= */

/**
 * POST
 * /api/rentals/:rentalId/documents
 *
 * Backend:
 * rentalDocumentUpload.single("document")
 */
export const uploadRentalDocument = async (
    rentalId,
    documentType,
    file
) => {
    try {
        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        if (!documentType) {
            throw new Error(
                "Document type is required"
            );
        }

        if (!file) {
            throw new Error(
                "Document file is required"
            );
        }

        const formData = new FormData();

        formData.append(
            "documentType",
            String(documentType)
                .trim()
                .toUpperCase()
        );

        formData.append(
            "document",
            file,
            file.name
        );

        console.log(
            "================================"
        );

        console.log(
            "UPLOADING RENTAL DOCUMENT"
        );

        console.log(
            "Rental ID:",
            rentalId
        );

        console.log(
            "Document Type:",
            documentType
        );

        console.log(
            "File:",
            file.name
        );

        console.log(
            "File Type:",
            file.type
        );

        console.log(
            "File Size:",
            file.size
        );

        console.log(
            "================================"
        );


        for (
            const [key, value]
            of formData.entries()
        ) {

            if (
                typeof File !== "undefined" &&
                value instanceof File
            ) {

                console.log(
                    "FORM DATA:",
                    key,
                    "=> FILE",
                    value.name,
                    value.type,
                    value.size
                );

            } else {

                console.log(
                    "FORM DATA:",
                    key,
                    "=>",
                    value
                );
            }
        }


        /*
         * IMPORTANT:
         *
         * Do NOT set Content-Type manually.
         *
         * rentalAxios interceptor will add:
         *
         * Authorization: Bearer TOKEN
         *
         * Browser/Axios will automatically generate:
         *
         * multipart/form-data; boundary=...
         */

        const response =
            await rentalAxios.post(
                `/${rentalId}/documents`,
                formData
            );


        console.log(
            "================================"
        );

        console.log(
            "RENTAL DOCUMENT UPLOAD RESPONSE:",
            response.data
        );

        console.log(
            "================================"
        );


        return response.data;

    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "RENTAL DOCUMENT UPLOAD ERROR"
        );

        console.error(
            "Status:",
            error?.response?.status
        );

        console.error(
            "Response:",
            error?.response?.data
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "================================"
        );


        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Rental document upload failed",
            }
        );
    }
};

/* =========================================================
   GET RENTAL DOCUMENTS
========================================================= */

/**
 * GET
 * /api/rentals/:rentalId/documents
 */
export const getRentalDocuments = async (
    rentalId
) => {
    try {

        if (!rentalId) {
            throw new Error(
                "Rental ID is required"
            );
        }

        console.log(
            "GETTING RENTAL DOCUMENTS:",
            rentalId
        );

        const response =
            await rentalAxios.get(
                `/${rentalId}/documents`
            );

        console.log(
            "RENTAL DOCUMENTS RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {
        return handleError(error);
    }
};


/* =========================================================
   VERIFY RENTAL DOCUMENT
========================================================= */

/**
 * PATCH
 * /api/rentals/documents/:documentId/verify
 *
 * Body:
 * {
 *   verificationStatus: "APPROVED"
 * }
 *
 * OR
 *
 * {
 *   verificationStatus: "REJECTED",
 *   rejectionReason: "Invalid document"
 * }
 */
export const verifyRentalDocument = async (
    documentId,
    verificationData = {}
) => {
    try {

        if (!documentId) {
            throw new Error(
                "Document ID is required"
            );
        }

        const response =
            await rentalAxios.patch(
                `/documents/${documentId}/verify`,
                verificationData
            );

        console.log(
            "VERIFY RENTAL DOCUMENT RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {
        return handleError(error);
    }
};
/* =========================================================
   GET RENTAL DOCUMENTS
========================================================= */

/**
 * GET
 * /api/rentals/:rentalId/documents
 */

// export const getRentalDocuments =
//     async (
//         rentalId
//     ) => {
//         try {
//             if (!rentalId) {
//                 throw new Error(
//                     "Rental ID is required"
//                 );
//             }

//             const token = getToken();

//             const response =
//                 await axios.get(
//                     `${RENTAL_BASE_URL}/${rentalId}/documents`,
//                     {
//                         headers: {
//                             ...(token
//                                 ? {
//                                     Authorization:
//                                         `Bearer ${token}`,
//                                 }
//                                 : {}),
//                         },
//                     }
//                 );

//             return response.data;
//         } catch (error) {
//             return handleError(error);
//         }
//     };

/* =========================================================
   VERIFY RENTAL DOCUMENT
========================================================= */

/**
 * PATCH
 * /api/rentals/documents/:documentId/verify
 */

// export const verifyRentalDocument =
//     async (
//         documentId,
//         verificationData = {}
//     ) => {
//         try {
//             if (!documentId) {
//                 throw new Error(
//                     "Document ID is required"
//                 );
//             }

//             const response =
//                 await rentalAxios.patch(
//                     `/documents/${documentId}/verify`,
//                     verificationData
//                 );

//             return response.data;
//         } catch (error) {
//             return handleError(error);
//         }
//     };

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const rentalApi = {

    // Products
    getRentalProducts,
    getRentalProduct,
    saveRentalProduct,

    // Online
    createRentalRequest,

    // Walk-In
    createWalkInRentalRequest,

    // Rentals
    getMyRentals,
    getRentalById,
    getAllRentals,

    // Status
    approveRental,
    rejectRental,

    // Deposit
    markDepositReceived,

    // Allocation
    allocateRental,

    // Return
    markRentalReturned,

    // Inventory
    getRentalInventory,

    // Documents
    uploadRentalDocument,
    getRentalDocuments,
    verifyRentalDocument,
};

export default rentalApi;