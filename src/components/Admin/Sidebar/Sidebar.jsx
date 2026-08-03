// import "./Sidebar.css";
// import { useNavigate } from "react-router-dom";

// function Sidebar() {

//     const navigate = useNavigate();

//     const logout = () => {

//         localStorage.removeItem("token");
//         navigate("/login");

//     };

//     return (

//         <div className="sidebar">

//             <h2>ZAID ERP</h2>

//             <ul>

//                 {/* Dashboard */}

//                 <li onClick={() => navigate("/admin-dashboard")}>
//                     Dashboard
//                 </li>

//                 {/* Customer */}

//                 <li onClick={() => navigate("/customers")}>
//                     Customer List
//                 </li>

//                 <li onClick={() => navigate("/add-customer")}>
//                     Add Customer
//                 </li>

//                 {/* Categories */}

//                 <li onClick={() => navigate("/categories")}>
//                     Category List
//                 </li>

//                 <li onClick={() => navigate("/add-category")}>
//                     Add Category
//                 </li>

//                 {/* Brands */}

//                 <li onClick={() => navigate("/brands")}>
//                     Brand List
//                 </li>

//                 <li onClick={() => navigate("/add-brand")}>
//                     Add Brand
//                 </li>

//                 {/* Products */}

//                 <li onClick={() => navigate("/admin/products")}>
//                     Product List
//                 </li>

//                 <li onClick={() => navigate("/add-product")}>
//                     Add Product
//                 </li>

//                 {/* Rentals */}

//                 <li onClick={() => navigate("/rentals")}>
//                     Rental List
//                 </li>

//                 <li onClick={() => navigate("/add-rental")}>
//                     Add Rental
//                 </li>

//                 {/* Repairs */}

//                 <li onClick={() => navigate("/repairs")}>
//                     Repair Jobs
//                 </li>

//                 <li onClick={() => navigate("/add-repair")}>
//                     Add Repair
//                 </li>

//                 {/* Orders */}

//                 <li onClick={() => navigate("/admin/orders")}>
//                     Order List
//                 </li>

//                 <li onClick={() => navigate("/pending-orders")}>
//                     Pending Orders
//                 </li>

//                 <li onClick={() => navigate("/completed-orders")}>
//                     Completed Orders
//                 </li>

//                 {/* Employees */}

//                 <li onClick={() => navigate("/employees")}>
//                     Employee List
//                 </li>

//                 <li onClick={() => navigate("/add-employee")}>
//                     Add Employee
//                 </li>

//                 {/* Inventory */}

//                 <li onClick={() => navigate("/inventory")}>
//                     Inventory
//                 </li>

//                 <li onClick={() => navigate("/stock-history")}>
//                     Stock History
//                 </li>

//                 {/* Suppliers */}

//                 <li onClick={() => navigate("/suppliers")}>
//                     Supplier List
//                 </li>

//                 <li onClick={() => navigate("/add-supplier")}>
//                     Add Supplier
//                 </li>

//                 {/* Purchase */}

//                 <li onClick={() => navigate("/purchase-orders")}>
//                     Purchase Orders
//                 </li>

//                 <li onClick={() => navigate("/add-purchase-order")}>
//                     Add Purchase Order
//                 </li>

//                 {/* Sales */}

//                 <li onClick={() => navigate("/sales")}>
//                     Sales
//                 </li>

//                 <li onClick={() => navigate("/invoices")}>
//                     Invoices
//                 </li>

//                 {/* Coupons */}

//                 <li onClick={() => navigate("/coupons")}>
//                     Coupons
//                 </li>

//                 <li onClick={() => navigate("/add-coupon")}>
//                     Add Coupon
//                 </li>

//                 {/* Reviews */}

//                 <li onClick={() => navigate("/reviews")}>
//                     Reviews
//                 </li>

//                 {/* Blogs */}

//                 <li onClick={() => navigate("/blogs")}>
//                     Blog List
//                 </li>

//                 <li onClick={() => navigate("/add-blog")}>
//                     Add Blog
//                 </li>

//                 {/* Banner */}

//                 <li onClick={() => navigate("/banners")}>
//                     Banner List
//                 </li>

//                 <li onClick={() => navigate("/add-banner")}>
//                     Add Banner
//                 </li>

//                 {/* Testimonials */}

//                 <li onClick={() => navigate("/testimonials")}>
//                     Testimonials
//                 </li>

//                 {/* FAQ */}

//                 <li onClick={() => navigate("/faqs")}>
//                     FAQs
//                 </li>

//                 {/* Notifications */}

//                 <li onClick={() => navigate("/notifications")}>
//                     Notifications
//                 </li>

//                 {/* Reports */}

//                 <li onClick={() => navigate("/reports")}>
//                     Reports
//                 </li>

//                 {/* Settings */}

//                 <li onClick={() => navigate("/settings")}>
//                     Settings
//                 </li>

//                 {/* Logout */}

//                 <li onClick={logout}>
//                     Logout
//                 </li>

//             </ul>

//         </div>

//     );

// }

// export default Sidebar;

import "./Sidebar.css";
import { 
    useNavigate, 
    useLocation, 
    Link 
} from "react-router-dom";
function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    // =========================================
    // NAVIGATION
    // =========================================

    const goTo = (path) => {

        navigate(path);

    };


    // =========================================
    // ACTIVE MENU
    // =========================================

    const isActive = (path) => {

        return location.pathname === path;

    };


    return (

        <aside className="sidebar">

            {/* =================================
                LOGO
            ================================= */}

            <div className="sidebar-logo">

                <h2>
                    ZAID ERP
                </h2>

            </div>


            {/* =================================
                MENU
            ================================= */}

            <ul className="sidebar-menu">


                {/* =================================
                    DASHBOARD
                ================================= */}

                <li
                    className={
                        isActive("/admin-dashboard")
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        goTo("/admin-dashboard")
                    }
                >
                    Dashboard
                </li>


                {/* =================================
                    CUSTOMER
                ================================= */}

                <li className="sidebar-heading">
                    CUSTOMER
                </li>

                <li
                    onClick={() =>
                        goTo("/customers")
                    }
                >
                    Customer List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-customer")
                    }
                >
                    Add Customer
                </li>


                {/* =================================
                    CATEGORIES
                ================================= */}

                <li className="sidebar-heading">
                    CATEGORIES
                </li>

                <li
                    onClick={() =>
                        goTo("/categories")
                    }
                >
                    Category List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-category")
                    }
                >
                    Add Category
                </li>


                {/* =================================
                    BRANDS
                ================================= */}

                <li className="sidebar-heading">
                    BRANDS
                </li>

                <li
                    onClick={() =>
                        goTo("/brands")
                    }
                >
                    Brand List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-brand")
                    }
                >
                    Add Brand
                </li>


                {/* =================================
                    PRODUCTS
                ================================= */}

                <li className="sidebar-heading">
                    PRODUCTS
                </li>

                <li
                    onClick={() =>
                        goTo("/admin/products")
                    }
                >
                    Product List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-product")
                    }
                >
                    Add Product
                </li>


                {/* =================================
                    RENTALS
                ================================= */}

                <li className="sidebar-heading">
                    RENTALS
                </li>

                <li
                    onClick={() =>
                        goTo("/rentals")
                    }
                >
                    Rental List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-rental")
                    }
                >
                    Add Rental
                </li>


                {/* =================================
                    REPAIRS
                ================================= */}

                <li className="sidebar-heading">
                    REPAIRS
                </li>

                <li
                    onClick={() =>
                        goTo("/repairs")
                    }
                >
                    Repair Jobs
                </li>

                <li
                    onClick={() =>
                        goTo("/add-repair")
                    }
                >
                    Add Repair
                </li>


<li
    onClick={() =>
        goTo("/receptionist/walk-in-order/new")
    }
>
    Walk-In POS
</li>
                {/* =================================
                    ORDERS
                ================================= */}

                <li className="sidebar-heading">
                    ORDERS
                </li>

                <li
                    onClick={() =>
                        goTo("/admin/orders")
                    }
                >
                    Order List
                </li>

                <li
                    onClick={() =>
                        goTo("/pending-orders")
                    }
                >
                    Pending Orders
                </li>

                <li
                    onClick={() =>
                        goTo("/completed-orders")
                    }
                >
                    Completed Orders
                </li>


                {/* =================================
                    EMPLOYEES
                ================================= */}

                <li className="sidebar-heading">
                    EMPLOYEES
                </li>

                <li
                    onClick={() =>
                        goTo("/employees")
                    }
                >
                    Employee List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-employee")
                    }
                >
                    Add Employee
                </li>


                {/* =================================
                    INVENTORY
                ================================= */}

                <li className="sidebar-heading">
                    INVENTORY
                </li>

                {/* <li
                    onClick={() =>
                        goTo("/inventory")
                    }
                >
                    Inventory
                </li> */}

                <li
                    onClick={() =>
                        goTo("/stock-history")
                    }
                >
                    Stock History
                </li>


                {/* =================================
                    SUPPLIERS
                ================================= */}

                <li className="sidebar-heading">
                    SUPPLIERS
                </li>

                <li
                    onClick={() =>
                        goTo("/suppliers")
                    }
                >
                    Supplier List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-supplier")
                    }
                >
                    Add Supplier
                </li>


                {/* =================================
                    PURCHASE
                ================================= */}

                <li className="sidebar-heading">
                    PURCHASE
                </li>

                <li
                    onClick={() =>
                        goTo("/purchase-orders")
                    }
                >
                    Purchase Orders
                </li>

                <li
                    onClick={() =>
                        goTo("/add-purchase-order")
                    }
                >
                    Add Purchase Order
                </li>


                {/* =================================
                    SALES
                ================================= */}

                <li className="sidebar-heading">
                    SALES
                </li>

                <li
                    onClick={() =>
                        goTo("/sales")
                    }
                >
                    Sales
                </li>

                <li
                    onClick={() =>
                        goTo("/invoices")
                    }
                >
                    Invoices
                </li>


                {/* =================================
                    COUPONS
                ================================= */}

                <li className="sidebar-heading">
                    COUPONS
                </li>

                <li
                    onClick={() =>
                        goTo("/coupons")
                    }
                >
                    Coupons
                </li>

                <li
                    onClick={() =>
                        goTo("/add-coupon")
                    }
                >
                    Add Coupon
                </li>


                {/* =================================
                    REVIEWS
                ================================= */}

                <li className="sidebar-heading">
                    REVIEWS
                </li>

                <li
                    onClick={() =>
                        goTo("/reviews")
                    }
                >
                    Reviews
                </li>


                {/* =================================
                    BLOGS
                ================================= */}

                <li className="sidebar-heading">
                    BLOGS
                </li>

                <li
                    onClick={() =>
                        goTo("/blogs")
                    }
                >
                    Blog List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-blog")
                    }
                >
                    Add Blog
                </li>


                {/* =================================
                    BANNER
                ================================= */}

                <li className="sidebar-heading">
                    BANNER
                </li>

                <li
                    onClick={() =>
                        goTo("/banners")
                    }
                >
                    Banner List
                </li>

                <li
                    onClick={() =>
                        goTo("/add-banner")
                    }
                >
                    Add Banner
                </li>


                {/* =================================
                    TESTIMONIALS
                ================================= */}

                <li
                    onClick={() =>
                        goTo("/testimonials")
                    }
                >
                    Testimonials
                </li>


                {/* =================================
                    FAQ
                ================================= */}

                <li
                    onClick={() =>
                        goTo("/faqs")
                    }
                >
                    FAQs
                </li>


                {/* =================================
                    NOTIFICATIONS
                ================================= */}

                <li
                    onClick={() =>
                        goTo("/notifications")
                    }
                >
                    Notifications
                </li>


                {/* =================================
                    REPORTS
                ================================= */}

                <li
                    onClick={() =>
                        goTo("/reports")
                    }
                >
                    Reports
                </li>
 {/* =================================
    SALARY
================================= */}

<li className="sidebar-heading">
    SALARY
</li>

<li
    className={
        isActive("/salary")
            ? "active"
            : ""
    }
    onClick={() =>
        goTo("/salary")
    }
>
    Salary Management
</li>

                {/* =================================
                    SETTINGS
                ================================= */}

                <li
                    onClick={() =>
                        goTo("/settings")
                    }
                >
                    Settings
                </li>


                {/* =================================
                    LOGOUT
                ================================= */}

                <li
                    className="logout-menu"
                    onClick={logout}
                >
                    Logout
                </li>

            </ul>

        </aside>

    );

}

export default Sidebar;