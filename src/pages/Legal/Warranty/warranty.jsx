import React from "react";
import "../LegalPage.css";

const Warranty = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-header">
                    <h1>Warranty Policy</h1>

                    <p>
                        Warranty coverage is subject to the applicable
                        product and warranty documentation.
                    </p>
                </div>

                <section className="legal-section">
                    <h2>1. Warranty Coverage</h2>

                    <p>
                        Warranty coverage depends on the applicable
                        product, manufacturer terms and written warranty
                        information provided with the product, invoice or
                        related documentation.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Warranty Claim</h2>

                    <p>
                        Customers may be required to provide the invoice,
                        order details, product information and other
                        information required to verify the warranty claim.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Inspection</h2>

                    <p>
                        Products may be inspected to determine whether the
                        reported issue falls within applicable warranty
                        coverage.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Exclusions</h2>

                    <p>
                        Warranty coverage may be subject to exclusions
                        specified by the applicable manufacturer or
                        warranty documentation.
                    </p>

                    <p>
                        Damage caused by misuse, unauthorized modification,
                        accidental damage or other excluded circumstances
                        may not qualify where such exclusions apply.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Repair Warranty</h2>

                    <p>
                        Where repair services include a repair warranty,
                        its duration and scope will depend on the
                        applicable repair documentation or service terms.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Contact</h2>

                    <div className="legal-contact">
                        <p>
                            <strong>ZAID INFOTECH</strong>
                        </p>

                        <p>
                            Keep your invoice or order details available
                            when contacting support regarding warranty
                            assistance.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Warranty;