const BACKEND_URL =
    import.meta.env.VITE_API_URL.replace(
        "/api",
        ""
    );

export const getImageUrl = (image) => {

    if (!image) {
        return "";
    }

    // image object
    if (
        typeof image === "object" &&
        image.url
    ) {

        image = image.url;

    }

    // Already full URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }

    // Relative backend URL
    if (image.startsWith("/")) {

        return `${BACKEND_URL}${image}`;

    }

    return `${BACKEND_URL}/${image}`;

};