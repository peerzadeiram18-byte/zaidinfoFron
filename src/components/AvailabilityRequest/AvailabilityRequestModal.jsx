import { useState } from "react";

import {
    createAvailabilityRequest
} from "../../services/availabilityRequestService";

import "./AvailabilityRequestModal.css";


const AvailabilityRequestModal = ({
    product,
    onClose,
    onSuccess
}) => {

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        message: ""
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==================================================
    // INPUT CHANGE
    // ==================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------
        // FRONTEND VALIDATION
        // ----------------------------------------------

        if (!formData.name.trim()) {

            setError(
                "Please enter your name."
            );

            return;
        }


        if (!/^[0-9]{10}$/.test(
            formData.mobile.trim()
        )) {

            setError(
                "Please enter a valid 10 digit mobile number."
            );

            return;
        }


        setLoading(true);


        try {

            const payload = {

                product: product._id,

                name:
                    formData.name.trim(),

                mobile:
                    formData.mobile.trim(),

                email:
                    formData.email.trim(),

                message:
                    formData.message.trim()
            };


            await createAvailabilityRequest(
                payload
            );


            setSuccess(
                "Your availability request has been submitted successfully."
            );


            setFormData({
                name: "",
                mobile: "",
                email: "",
                message: ""
            });


            if (onSuccess) {

                setTimeout(() => {
                    onSuccess();
                }, 1200);

            }

        }
        catch (error) {

            console.error(
                "Availability request error:",
                error
            );


            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to submit availability request. Please try again.";


            setError(message);

        }
        finally {

            setLoading(false);

        }
    };


    if (!product) {
        return null;
    }


    return (

        <div
            className="availability-modal-overlay"
            onClick={onClose}
        >

            <div
                className="availability-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="availability-modal-header">

                    <div>

                        <h2>
                            Request Availability
                        </h2>

                        <p>
                            {product.name}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="availability-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* ======================================
                    FORM
                ====================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="availability-form"
                >

                    {/* NAME */}

                    <div className="availability-field">

                        <label>
                            Name
                            <span>*</span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            maxLength={100}
                            disabled={loading}
                        />

                    </div>


                    {/* MOBILE */}

                    <div className="availability-field">

                        <label>
                            Mobile Number
                            <span>*</span>
                        </label>

                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10 digit mobile number"
                            maxLength={10}
                            inputMode="numeric"
                            disabled={loading}
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="availability-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={loading}
                        />

                    </div>


                    {/* MESSAGE */}

                    <div className="availability-field">

                        <label>
                            Message
                        </label>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Any additional information..."
                            maxLength={500}
                            rows={4}
                            disabled={loading}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="availability-error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="availability-success">
                            {success}
                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="availability-form-actions">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="availability-cancel-btn"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="availability-submit-btn"
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Request"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default AvailabilityRequestModal;

