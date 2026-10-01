import React from "react";
import "../LegalPage.css";

const RepairTerms = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-header">
                    <h1>Repair Terms & Conditions</h1>

                    <p>
                        Terms applicable to ZAID INFOTECH repair and
                        service requests.
                    </p>
                </div>

                <section className="legal-section">
                    <h2>1. Device Inspection</h2>

                    <p>
                        Devices submitted for repair may be inspected
                        and diagnosed to identify the reported issue and
                        other relevant faults.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Diagnosis and Quotation</h2>

                    <p>
                        A repair quotation may be provided after
                        inspection or diagnosis where applicable.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Customer Approval</h2>

                    <p>
                        Where required, repair work may proceed only after
                        customer approval of the applicable quotation or
                        repair scope.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Additional Faults</h2>

                    <p>
                        Additional issues discovered during inspection
                        may require a revised quotation or additional
                        customer approval.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Repair Timeline</h2>

                    <p>
                        Repair timelines are indicative and may depend on
                        diagnosis, parts availability, technician
                        workload and other operational circumstances.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Replacement Components</h2>

                    <p>
                        Repair may involve replacement or installation of
                        applicable components where approved and required.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Data Protection Notice</h2>

                    <div className="legal-warning">
                        <strong>Important:</strong> Customers should back
                        up important data before submitting a device for
                        repair. Where possible, customers should sign out
                        of personal accounts and remove confidential or
                        sensitive information.
                    </div>

                    <p>
                        Customers are responsible for maintaining backups
                        of important data before service.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Repair Warranty</h2>

                    <p>
                        Where a repair warranty applies, its duration and
                        scope will depend on the applicable repair
                        documentation or service terms.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Collection</h2>

                    <p>
                        Customers should collect repaired devices within
                        the applicable period communicated by ZAID INFOTECH.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Contact</h2>

                    <div className="legal-contact">
                        <p>
                            <strong>ZAID INFOTECH</strong>
                        </p>

                        <p>
                            Please keep your repair ticket or service
                            reference available when contacting support.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default RepairTerms;