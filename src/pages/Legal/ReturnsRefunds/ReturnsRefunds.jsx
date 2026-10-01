import React from "react";
import "./ReturnsRefunds.css";

const ReturnsRefunds = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                {/* PAGE HEADER */}
                <div className="legal-header">
                    <h1>Returns & Refunds</h1>
                    <p>
                        Please review our returns and refund policy before
                        making a purchase.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="legal-content">

                    <section>
                        <h2>1. Return Policy</h2>
                        <p>
                            We aim to provide our customers with quality
                            products and services. If you receive a product
                            that is damaged, defective, incorrect, or does not
                            match your order, you may contact us to request a
                            return.
                        </p>
                    </section>

                    <section>
                        <h2>2. Eligibility for Return</h2>
                        <p>
                            A return request may be accepted when the product
                            is eligible for return under the applicable
                            product or service conditions.
                        </p>

                        <ul>
                            <li>The product should be in acceptable condition.</li>
                            <li>
                                Original packaging, accessories, and applicable
                                documents should be retained where required.
                            </li>
                            <li>
                                The return request should be submitted within
                                the applicable return period.
                            </li>
                            <li>
                                Proof of purchase may be required.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Non-Returnable Items</h2>
                        <p>
                            Certain products or services may not be eligible
                            for return because of their nature, usage,
                            customization, or other applicable conditions.
                        </p>
                    </section>

                    <section>
                        <h2>4. Damaged or Incorrect Products</h2>
                        <p>
                            If you receive a damaged, defective, or incorrect
                            product, please contact us as soon as possible with
                            the relevant order details and supporting
                            information.
                        </p>
                    </section>

                    <section>
                        <h2>5. Refund Process</h2>
                        <p>
                            Once a return or refund request is reviewed and
                            approved, the applicable refund will be processed
                            according to the payment method and applicable
                            refund conditions.
                        </p>
                    </section>

                    <section>
                        <h2>6. Refund Time</h2>
                        <p>
                            The time required for the refund to appear in your
                            account may vary depending on the payment method,
                            bank, payment gateway, or financial institution.
                        </p>
                    </section>

                    <section>
                        <h2>7. Cancellation</h2>
                        <p>
                            Orders may be cancelled where cancellation is
                            available and the order has not reached a stage
                            where cancellation is no longer possible.
                        </p>
                    </section>

                    <section>
                        <h2>8. Rental Returns</h2>
                        <p>
                            Rental products are subject to the applicable
                            rental agreement, rental duration, return
                            conditions, security deposit terms, and product
                            condition requirements.
                        </p>
                    </section>

                    <section>
                        <h2>9. Repair Services</h2>
                        <p>
                            Repairs and service requests are subject to the
                            applicable repair terms, service charges, parts
                            used, and other conditions communicated at the
                            time of service.
                        </p>
                    </section>

                    <section>
                        <h2>10. Contact Us</h2>
                        <p>
                            If you have questions regarding a return,
                            cancellation, or refund, please contact our
                            customer support team with your order or service
                            details.
                        </p>
                    </section>

                </div>

                {/* FOOTER NOTE */}
                <div className="legal-last-updated">
                    <strong>Last Updated:</strong> September 30, 2026
                </div>

            </div>
        </div>
    );
};

export default ReturnsRefunds;

