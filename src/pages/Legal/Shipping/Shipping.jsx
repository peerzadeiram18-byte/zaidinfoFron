import React from "react";
import "../LegalPage.css";

const Shipping = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-header">
                    <h1>Shipping & Delivery Policy</h1>

                    <p>
                        Information regarding order dispatch,
                        transportation and delivery.
                    </p>
                </div>

                <section className="legal-section">
                    <h2>1. Order Processing</h2>

                    <p>
                        Orders are processed subject to successful order
                        confirmation, payment where applicable,
                        product availability and required verification.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Dispatch</h2>

                    <p>
                        Once an order is ready for dispatch, it may be
                        handed over to the applicable courier or logistics
                        provider.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Delivery Timelines</h2>

                    <p>
                        Delivery timelines are indicative and may vary
                        depending on destination, product availability,
                        courier operations and other circumstances.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Delivery Delays</h2>

                    <p>
                        Delivery may be delayed due to courier issues,
                        weather, public holidays, transportation
                        disruptions, operational issues or circumstances
                        beyond reasonable control.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Shipment Tracking</h2>

                    <p>
                        Where tracking information is available, customers
                        may use the shipment tracking facility provided
                        through the website.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Delivery Address</h2>

                    <p>
                        Customers are responsible for providing an accurate
                        delivery address and appropriate contact details.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Contact</h2>

                    <div className="legal-contact">
                        <p>
                            <strong>ZAID INFOTECH</strong>
                        </p>

                        <p>
                            Keep your order number available when contacting
                            support regarding delivery.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Shipping;