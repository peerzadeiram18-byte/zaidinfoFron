import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    CheckCircle2,
    FileCheck2,
    FileText,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    Trash2,
    Upload,
    XCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import {
    getRentalById,
    getRentalDocuments,
    uploadRentalDocument,
} from "../../services/rentalApi";

import "./RentalDocuments.css";

/* =========================================================
   DOCUMENT CONFIGURATION
   ========================================================= */

const INDIVIDUAL_DOCUMENTS = [
    {
        type: "PASSPORT_PHOTO",
        title: "Passport Size Photograph",
        description:
            "Recent passport size photograph of the customer.",
        accept: "image/*",
        required: true,
        icon: "image",
    },
    {
        type: "PAN_CARD",
        title: "PAN Card",
        description:
            "Clear copy of PAN Card.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "AADHAAR_CARD",
        title: "Aadhaar Card",
        description:
            "Clear copy of Aadhaar Card.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "HOUSE_RENTAL_AGREEMENT",
        title: "House Rental Agreement",
        description:
            "Valid house rental agreement.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "COLLEGE_OR_OFFICE_ID",
        title: "College ID / Office ID",
        description:
            "College ID or Office ID of the customer.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
];

const COMPANY_DOCUMENTS = [
    {
        type: "PAN_CARD",
        title: "PAN Card",
        description:
            "Company PAN Card.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "AUTHORIZED_PERSON_AADHAAR",
        title: "Aadhaar Card - Authorized Person",
        description:
            "Aadhaar Card of the authorized person.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "GST_REGISTRATION_COPY",
        title: "GST Registration Copy",
        description:
            "Valid GST registration certificate/copy.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "OFFICE_ID",
        title: "Office ID",
        description:
            "Office ID of the authorized person.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
    {
        type: "AUTHORIZATION_LETTER",
        title: "Authorization Letter",
        description:
            "Company authorization letter.",
        accept: "image/*,.pdf",
        required: true,
        icon: "file",
    },
];

/* =========================================================
   RESPONSE HELPERS
   ========================================================= */

const extractRental = (response) => {
    if (!response) {
        return null;
    }

    return (
        response?.data?.data ||
        response?.data?.rental ||
        response?.rental ||
        response?.data ||
        response
    );
};

const extractDocuments = (response) => {
    const candidates = [
        response,
        response?.data,
        response?.documents,
        response?.data?.documents,
        response?.data?.data,
        response?.data?.data?.documents,
    ];

    for (const item of candidates) {
        if (Array.isArray(item)) {
            return item;
        }
    }

    return [];
};

/* =========================================================
   ID HELPER
   ========================================================= */

const getRentalIdFromObject = (rental, rentalId) => {
    return String(
        rental?._id ||
        rental?.id ||
        rental?.rentalId ||
        rentalId ||
        ""
    );
};

/* =========================================================
   DOCUMENT TYPE MATCH
   ========================================================= */

const normalizeDocumentType = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function RentalDocuments({
    rentalId: rentalIdProp,
    rental: rentalProp = null,
    onComplete,
}) {
    const [rental, setRental] = useState(
        rentalProp || null
    );

    const [loading, setLoading] = useState(
        !rentalProp
    );

    const [loadingDocuments, setLoadingDocuments] =
        useState(true);

    const [documents, setDocuments] = useState([]);

    const [uploadingType, setUploadingType] =
        useState("");

    const [selectedFiles, setSelectedFiles] =
        useState({});

    const [refreshing, setRefreshing] =
        useState(false);

    const fileRefs = useRef({});

    /* =====================================================
       RENTAL ID
       ===================================================== */

    const rentalId = useMemo(() => {
        return getRentalIdFromObject(
            rental,
            rentalIdProp
        );
    }, [rental, rentalIdProp]);

    /* =====================================================
       CUSTOMER TYPE
       ===================================================== */

    const customerType = useMemo(() => {
        return String(
            rental?.customerType ||
            rentalProp?.customerType ||
            "INDIVIDUAL"
        ).toUpperCase();
    }, [rental, rentalProp]);

    /* =====================================================
       REQUIRED DOCUMENTS
       ===================================================== */

    const requiredDocuments = useMemo(() => {
        if (customerType === "COMPANY") {
            return COMPANY_DOCUMENTS;
        }

        return INDIVIDUAL_DOCUMENTS;
    }, [customerType]);

    /* =====================================================
       LOAD RENTAL
       ===================================================== */

    const loadRental = async () => {
        if (!rentalIdProp && rental) {
            return;
        }

        if (!rentalIdProp) {
            return;
        }

        try {
            setLoading(true);

            const response =
                await getRentalById(rentalIdProp);

            const rentalData =
                extractRental(response);

            if (rentalData) {
                setRental(rentalData);
            }
        } catch (error) {
            console.error(
                "LOAD RENTAL DOCUMENT PAGE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load rental details."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD DOCUMENTS
       ===================================================== */

    const loadDocuments = async (
        showRefresh = false
    ) => {
        if (!rentalId) {
            setLoadingDocuments(false);
            return;
        }

        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoadingDocuments(true);
            }

            const response =
                await getRentalDocuments(rentalId);

            console.log(
                "RENTAL DOCUMENTS RESPONSE:",
                response
            );

            const list =
                extractDocuments(response);

            console.log(
                "RENTAL DOCUMENTS:",
                list
            );

            setDocuments(list);
        } catch (error) {
            console.error(
                "LOAD RENTAL DOCUMENTS ERROR:",
                error
            );

            setDocuments([]);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load rental documents."
            );
        } finally {
            setLoadingDocuments(false);
            setRefreshing(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    useEffect(() => {
        loadRental();
    }, [rentalIdProp]);

    useEffect(() => {
        if (rentalId) {
            loadDocuments();
        }
    }, [rentalId]);

    /* =====================================================
       DOCUMENT FINDER
       ===================================================== */

    const getUploadedDocument = (documentType) => {
        const wanted =
            normalizeDocumentType(documentType);

        return documents.find((document) => {
            const current =
                normalizeDocumentType(
                    document?.documentType ||
                    document?.type ||
                    document?.documentName ||
                    document?.name
                );

            return current === wanted;
        });
    };

    /* =====================================================
       FILE SELECT
       ===================================================== */

    const handleFileSelect = (
        documentType,
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        /* ---------------------------------------------
           FILE SIZE
           --------------------------------------------- */

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error(
                "Maximum file size is 10 MB."
            );

            event.target.value = "";
            return;
        }

        /* ---------------------------------------------
           FILE TYPE
           --------------------------------------------- */

        const validTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (
            !validTypes.includes(file.type)
        ) {
            toast.error(
                "Only PDF, JPG, PNG and WEBP files are allowed."
            );

            event.target.value = "";
            return;
        }

        setSelectedFiles((previous) => ({
            ...previous,
            [documentType]: file,
        }));
    };

    /* =====================================================
       REMOVE SELECTED FILE
       ===================================================== */

    const removeSelectedFile = (
        documentType
    ) => {
        setSelectedFiles((previous) => {
            const updated = {
                ...previous,
            };

            delete updated[documentType];

            return updated;
        });

        const input =
            fileRefs.current[documentType];

        if (input) {
            input.value = "";
        }
    };

    /* =====================================================
       UPLOAD
       ===================================================== */

    const handleUpload = async (
        documentConfig
    ) => {
        if (!rentalId) {
            toast.error(
                "Rental ID is missing."
            );
            return;
        }

        const file =
            selectedFiles[
                documentConfig.type
            ];

        if (!file) {
            toast.error(
                `Please select ${documentConfig.title}.`
            );
            return;
        }

        try {
            setUploadingType(
                documentConfig.type
            );

            const formData =
                new FormData();

            /*
             * Existing backend upload API.
             *
             * File field:
             * document
             *
             * Document type:
             * documentType
             */

            formData.append(
                "document",
                file
            );

            formData.append(
                "documentType",
                documentConfig.type
            );

            console.log(
                "UPLOADING RENTAL DOCUMENT:",
                {
                    rentalId,
                    documentType:
                        documentConfig.type,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                }
            );

            await uploadRentalDocument(
                rentalId,
                formData
            );

            toast.success(
                `${documentConfig.title} uploaded successfully.`
            );

            removeSelectedFile(
                documentConfig.type
            );

            await loadDocuments(true);

            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error(
                "RENTAL DOCUMENT UPLOAD ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                `Failed to upload ${documentConfig.title}.`
            );
        } finally {
            setUploadingType("");
        }
    };

    /* =====================================================
       OPEN FILE PICKER
       ===================================================== */

    const openFilePicker = (
        documentType
    ) => {
        fileRefs.current[
            documentType
        ]?.click();
    };

    /* =====================================================
       COUNTS
       ===================================================== */

    const uploadedCount = useMemo(() => {
        return requiredDocuments.filter(
            (documentConfig) =>
                Boolean(
                    getUploadedDocument(
                        documentConfig.type
                    )
                )
        ).length;
    }, [
        documents,
        requiredDocuments,
    ]);

    const requiredCount =
        requiredDocuments.length;

    const allUploaded =
        uploadedCount === requiredCount;

    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {
        return (
            <div className="rental-documents-loading">
                <Loader2
                    size={30}
                    className="rental-documents-spinner"
                />

                <h3>
                    Loading rental details...
                </h3>

                <p>
                    Please wait.
                </p>
            </div>
        );
    }

    /* =====================================================
       NO RENTAL
       ===================================================== */

    if (!rentalId) {
        return (
            <div className="rental-documents-error">
                <XCircle size={42} />

                <h3>
                    Rental ID not found
                </h3>

                <p>
                    Documents cannot be uploaded
                    without a rental ID.
                </p>
            </div>
        );
    }

    /* =====================================================
       PAGE
       ===================================================== */

    return (
        <section className="rental-documents-section">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="rental-documents-header">

                <div className="rental-documents-heading">

                    <div className="rental-documents-heading-icon">
                        <FileCheck2 size={23} />
                    </div>

                    <div>
                        <h2>
                            Rental Documents
                        </h2>

                        <p>
                            Upload and manage customer
                            verification documents.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="rental-documents-refresh"
                    onClick={() =>
                        loadDocuments(true)
                    }
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "rental-refresh-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>

            </div>

            {/* =================================================
                INFO
            ================================================= */}

            <div className="rental-documents-info">

                <div className="rental-documents-info-main">

                    <strong>
                        {customerType === "COMPANY"
                            ? "Company / Business Use"
                            : "Individual / Personal Use"}
                    </strong>

                    <span>
                        Rental ID:{" "}
                        {String(rentalId).slice(-10)}
                    </span>

                </div>

                <div className="rental-documents-progress">

                    <strong>
                        {uploadedCount} / {requiredCount}
                    </strong>

                    <span>
                        Documents uploaded
                    </span>

                </div>

            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {allUploaded && (
                <div className="rental-documents-complete">

                    <CheckCircle2 size={22} />

                    <div>
                        <strong>
                            All required documents uploaded
                        </strong>

                        <p>
                            Customer document verification
                            files have been uploaded successfully.
                        </p>
                    </div>

                </div>
            )}

            {/* =================================================
                DOCUMENT LIST
            ================================================= */}

            <div className="rental-document-list">

                {requiredDocuments.map(
                    (documentConfig, index) => {
                        const uploaded =
                            getUploadedDocument(
                                documentConfig.type
                            );

                        const selectedFile =
                            selectedFiles[
                                documentConfig.type
                            ];

                        const uploading =
                            uploadingType ===
                            documentConfig.type;

                        return (
                            <div
                                key={
                                    documentConfig.type
                                }
                                className={`rental-document-card ${
                                    uploaded
                                        ? "uploaded"
                                        : ""
                                }`}
                            >

                                {/* NUMBER / ICON */}

                                <div className="rental-document-number">
                                    {uploaded ? (
                                        <CheckCircle2
                                            size={21}
                                        />
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                {/* CONTENT */}

                                <div className="rental-document-content">

                                    <div className="rental-document-title-row">

                                        <div>

                                            <h3>
                                                {
                                                    documentConfig.title
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    documentConfig.description
                                                }
                                            </p>

                                        </div>

                                        {documentConfig.required && (
                                            <span className="rental-document-required">
                                                Required
                                            </span>
                                        )}

                                    </div>

                                    {/* EXISTING DOCUMENT */}

                                    {uploaded && (
                                        <div className="rental-uploaded-file">

                                            <div className="rental-uploaded-file-icon">
                                                <FileText
                                                    size={19}
                                                />
                                            </div>

                                            <div className="rental-uploaded-file-info">

                                                <strong>
                                                    {uploaded?.originalName ||
                                                        uploaded?.fileName ||
                                                        uploaded?.filename ||
                                                        uploaded?.name ||
                                                        "Document uploaded"}
                                                </strong>

                                                <span>
                                                    Uploaded
                                                </span>

                                            </div>

                                            <div className="rental-uploaded-status">
                                                <CheckCircle2
                                                    size={17}
                                                />

                                                Uploaded
                                            </div>

                                        </div>
                                    )}

                                    {/* SELECTED FILE */}

                                    {selectedFile && !uploaded && (
                                        <div className="rental-selected-file">

                                            <div className="rental-selected-file-left">

                                                <FileText
                                                    size={18}
                                                />

                                                <div>
                                                    <strong>
                                                        {
                                                            selectedFile.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {(
                                                            selectedFile.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(
                                                            2
                                                        )}{" "}
                                                        MB
                                                    </span>
                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                className="rental-remove-file"
                                                onClick={() =>
                                                    removeSelectedFile(
                                                        documentConfig.type
                                                    )
                                                }
                                                disabled={
                                                    uploading
                                                }
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>

                                        </div>
                                    )}

                                    {/* FILE INPUT */}

                                    <input
                                        ref={(element) => {
                                            fileRefs.current[
                                                documentConfig.type
                                            ] = element;
                                        }}
                                        type="file"
                                        accept={
                                            documentConfig.accept
                                        }
                                        className="rental-hidden-file-input"
                                        onChange={(event) =>
                                            handleFileSelect(
                                                documentConfig.type,
                                                event
                                            )
                                        }
                                    />

                                    {/* ACTIONS */}

                                    <div className="rental-document-actions">

                                        <button
                                            type="button"
                                            className="rental-choose-file-btn"
                                            onClick={() =>
                                                openFilePicker(
                                                    documentConfig.type
                                                )
                                            }
                                            disabled={
                                                uploading
                                            }
                                        >
                                            <Upload
                                                size={17}
                                            />

                                            {uploaded
                                                ? "Choose New File"
                                                : "Choose File"}
                                        </button>

                                        {selectedFile && (
                                            <button
                                                type="button"
                                                className="rental-upload-btn"
                                                onClick={() =>
                                                    handleUpload(
                                                        documentConfig
                                                    )
                                                }
                                                disabled={
                                                    uploading
                                                }
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Loader2
                                                            size={17}
                                                            className="rental-documents-spinner"
                                                        />

                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload
                                                            size={17}
                                                        />

                                                        Upload
                                                    </>
                                                )}
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

            {/* =================================================
                FOOTER HELP
            ================================================= */}

            <div className="rental-documents-footer">

                <div>
                    <strong>
                        Accepted files
                    </strong>

                    <span>
                        JPG, PNG, WEBP and PDF
                    </span>
                </div>

                <div>
                    <strong>
                        Maximum size
                    </strong>

                    <span>
                        10 MB per document
                    </span>
                </div>

            </div>

        </section>
    );
}







