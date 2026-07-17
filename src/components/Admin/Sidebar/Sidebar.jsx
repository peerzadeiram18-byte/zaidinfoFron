import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        navigate("/login");

    };

    return (

        <div className="sidebar">

            <h2>ZAID ERP</h2>

            <ul>

                {/* Dashboard */}

                <li onClick={() => navigate("/admin-dashboard")}>
                    Dashboard
                </li>

                {/* Customer */}

                <li onClick={() => navigate("/customers")}>
                    Customer List
                </li>

                <li onClick={() => navigate("/add-customer")}>
                    Add Customer
                </li>

                {/* Categories */}

                <li onClick={() => navigate("/categories")}>
                    Category List
                </li>

                <li onClick={() => navigate("/add-category")}>
                    Add Category
                </li>

                {/* Brands */}

                <li onClick={() => navigate("/brands")}>
                    Brand List
                </li>

                <li onClick={() => navigate("/add-brand")}>
                    Add Brand
                </li>

                {/* Products */}

                <li onClick={() => navigate("/admin/products")}>
                    Product List
                </li>

                <li onClick={() => navigate("/add-product")}>
                    Add Product
                </li>

                {/* Rentals */}

                <li onClick={() => navigate("/rentals")}>
                    Rental List
                </li>

                <li onClick={() => navigate("/add-rental")}>
                    Add Rental
                </li>

                {/* Repairs */}

                <li onClick={() => navigate("/repairs")}>
                    Repair Jobs
                </li>

                <li onClick={() => navigate("/add-repair")}>
                    Add Repair
                </li>

                {/* Orders */}

                <li onClick={() => navigate("/orders")}>
                    Order List
                </li>

                <li onClick={() => navigate("/pending-orders")}>
                    Pending Orders
                </li>

                <li onClick={() => navigate("/completed-orders")}>
                    Completed Orders
                </li>

                {/* Employees */}

                <li onClick={() => navigate("/employees")}>
                    Employee List
                </li>

                <li onClick={() => navigate("/add-employee")}>
                    Add Employee
                </li>

                {/* Inventory */}

                <li onClick={() => navigate("/inventory")}>
                    Inventory
                </li>

                <li onClick={() => navigate("/stock-history")}>
                    Stock History
                </li>

                {/* Suppliers */}

                <li onClick={() => navigate("/suppliers")}>
                    Supplier List
                </li>

                <li onClick={() => navigate("/add-supplier")}>
                    Add Supplier
                </li>

                {/* Purchase */}

                <li onClick={() => navigate("/purchase-orders")}>
                    Purchase Orders
                </li>

                <li onClick={() => navigate("/add-purchase-order")}>
                    Add Purchase Order
                </li>

                {/* Sales */}

                <li onClick={() => navigate("/sales")}>
                    Sales
                </li>

                <li onClick={() => navigate("/invoices")}>
                    Invoices
                </li>

                {/* Coupons */}

                <li onClick={() => navigate("/coupons")}>
                    Coupons
                </li>

                <li onClick={() => navigate("/add-coupon")}>
                    Add Coupon
                </li>

                {/* Reviews */}

                <li onClick={() => navigate("/reviews")}>
                    Reviews
                </li>

                {/* Blogs */}

                <li onClick={() => navigate("/blogs")}>
                    Blog List
                </li>

                <li onClick={() => navigate("/add-blog")}>
                    Add Blog
                </li>

                {/* Banner */}

                <li onClick={() => navigate("/banners")}>
                    Banner List
                </li>

                <li onClick={() => navigate("/add-banner")}>
                    Add Banner
                </li>

                {/* Testimonials */}

                <li onClick={() => navigate("/testimonials")}>
                    Testimonials
                </li>

                {/* FAQ */}

                <li onClick={() => navigate("/faqs")}>
                    FAQs
                </li>

                {/* Notifications */}

                <li onClick={() => navigate("/notifications")}>
                    Notifications
                </li>

                {/* Reports */}

                <li onClick={() => navigate("/reports")}>
                    Reports
                </li>

                {/* Settings */}

                <li onClick={() => navigate("/settings")}>
                    Settings
                </li>

                {/* Logout */}

                <li onClick={logout}>
                    Logout
                </li>

            </ul>

        </div>

    );

}

export default Sidebar;