import "./ReceptionistDashboard.css";

function ReceptionistDashboard() {

    return (

        <div className="reception-dashboard">

            <div className="reception-sidebar">

                <h2>Receptionist</h2>

                <ul>

                    <li>Dashboard</li>

                    <li>Customers</li>

                    <li>Create Job Card</li>

                    <li>Repair Status</li>

                    <li>Invoices</li>

                    <li>Logout</li>

                </ul>

            </div>

            <div className="reception-content">

                <h1>

                    Welcome Receptionist

                </h1>

                <div className="card-container">

                    <div className="card">

                        <h2>Today's Jobs</h2>

                        <p>25</p>

                    </div>

                    <div className="card">

                        <h2>Pending Repairs</h2>

                        <p>12</p>

                    </div>

                    <div className="card">

                        <h2>Delivered</h2>

                        <p>8</p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ReceptionistDashboard;