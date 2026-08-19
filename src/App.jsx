// import AdminAttendance from './components/Attendance/AdminAttendance.jsx'
// import AdminOffers from "./pages/Admin/Offers/AdminOffers";
// import AddOffer from "./pages/Admin/Offers/AddOffer";
// import AddCoupon
//     from "./components/Admin/Coupon/AddCoupon";
// import CouponList from "./components/Admin/Coupon/CouponList";
// import AdminNotifications
//     from "./components/Admin/Notifications/AdminNotifications";



// function App() {
//     return (

        
//         <Routes>

//             {/* =================================================
//                 PUBLIC
//             ================================================= */}

//             <Route
//                 path="/about-us"
//                 element={<About />}
//             />

//             <Route
//                 path="/blog"
//                 element={<Blog />}
//             />

//             <Route
//                 path="/careers"
//                 element={<Careers />}
//             />

//             <Route
//                 path="/contact"
//                 element={<Contact />}
//             />

//             <Route
//                 path="/faq"
//                 element={<FAQ />}
//             />

//             <Route
//                 path="/"
//                 element={<Home />}
//             />

//             <Route
//                 path="/login"
//                 element={<Login />}
//             />

//             <Route
//                 path="/register"
//                 element={<Register />}
//             />

//             <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//             />

//             <Route
//                 path="/inventory"
//                 element={<InventoryDashboard />}
//             />

//             {/* =================================================
//                 ADMIN LAYOUT
//                 SIDEBAR WILL SHOW ON ALL ROUTES INSIDE HERE
//             ================================================= */}

//             <Route element={<AdminLayout />}>

//                 {/* =========================================
//                     ADMIN DASHBOARD
//                 ========================================= */}

//                 <Route
//                     path="/admin-dashboard"
//                     element={<AdminDashboard />}
//                 />

//                 <Route
//                     path="/dashboard"
//                     element={<Dashboard />}
//                 />

//                 {/* =========================================
//                     SALARY
//                 ========================================= */}

//                 <Route
//                     path="/salary"
//                     element={<SalaryPage />}
//                 />

//                 {/* =========================================
//                     CUSTOMER
//                 ========================================= */}

//                 <Route
//                     path="/customers"
//                     element={<CustomerList />}
//                 />

//                 {/* =========================================
//                     EMPLOYEE
//                 ========================================= */}

//                 <Route
//                     path="/add-employee"
//                     element={<AddEmployee />}
//                 />

//                 <Route
//                     path="/employees"
//                     element={<EmployeeList />}
//                 />

//                 <Route path='/attendance' element={<AdminAttendance/>}/>

//                 {/* =========================================
//                     CATEGORY
//                 ========================================= */}

//                 <Route
//                     path="/add-category"
//                     element={<AddCategory />}
//                 />

//                 <Route
//                     path="/categories"
//                     element={<CategoryList />}
//                 />

//                 {/* =========================================
//                     BRAND
//                 ========================================= */}

//                 <Route
//                     path="/add-brand"
//                     element={<AddBrand />}
//                 />

//                 <Route
//                     path="/brands"
//                     element={<BrandList />}
//                 />

//                 {/* =========================================
//                     ADMIN PRODUCTS
//                 ========================================= */}

//                 <Route
//                     path="/admin/products"
//                     element={<ProductList />}
//                 />

//                 <Route
//                     path="/add-product"
//                     element={<AddProduct />}
//                 />

//                 <Route
//                     path="/edit-product/:id"
//                     element={<EditProduct />}
//                 />

//                 <Route
//                     path="/view-product/:id"
//                     element={<ViewProduct />}
//                 />

//                 {/* =========================================
//                     ADMIN INVENTORY
//                 ========================================= */}

//                 <Route
//                     path="/stock-history"
//                     element={<StockHistory />}
//                 />

//              <Route
//   path="/admin/offers"
//   element={<AdminOffers />}
// />

// <Route
//   path="/admin/add-offer"
//   element={<AddOffer />}
// />


// {/* =========================================
//     ADMIN COUPONS
// ========================================= */}

// <Route
//   path="/admin/coupons"
//   element={<CouponList />}
// />

// <Route
//   path="/admin/add-coupon"
//   element={<AddCoupon />}
// />

//                 {/* =========================================
//                     ADMIN ORDERS
//                 ========================================= */}

//                 <Route
//                     path="/admin/orders"
//                     element={<OrderList />}
//                 />

//                 <Route
//                     path="/admin/orders/:id"
//                     element={<ViewOrder />}
//                 />

//                 {/* =========================================
//                     ADMIN INVOICES
//                 ========================================= */}

//                 <Route
//                     path="/admin/invoices"
//                     element={<AdminInvoices />}
//                 />

//                 {/* =========================================
//                     FUTURE ADMIN PAGES
//                 ========================================= */}

//                 <Route
//                     path="/rentals"
//                     element={
//                         <div>
//                             Rental List Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-rental"
//                     element={
//                         <div>
//                             Add Rental Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/repairs"
//                     element={
//                         <div>
//                             Repair Jobs Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-repair"
//                     element={
//                         <div>
//                             Add Repair Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/pending-orders"
//                     element={
//                         <div>
//                             Pending Orders Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/completed-orders"
//                     element={
//                         <div>
//                             Completed Orders Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/suppliers"
//                     element={
//                         <div>
//                             Supplier List Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-supplier"
//                     element={
//                         <div>
//                             Add Supplier Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/purchase-orders"
//                     element={
//                         <div>
//                             Purchase Orders Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-purchase-order"
//                     element={
//                         <div>
//                             Add Purchase Order Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/sales"
//                     element={
//                         <div>
//                             Sales Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/invoice/:id"
//                     element={
//                         <div>
//                             Invoices Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/coupons"
//                     element={
//                         <div>
//                             Coupons Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-coupon"
//                     element={
//                         <div>
//                             Add Coupon Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/reviews"
//                     element={
//                         <div>
//                             Reviews Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/blogs"
//                     element={
//                         <div>
//                             Blog List Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-blog"
//                     element={
//                         <div>
//                             Add Blog Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/banners"
//                     element={
//                         <div>
//                             Banner List Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/add-banner"
//                     element={
//                         <div>
//                             Add Banner Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/testimonials"
//                     element={
//                         <div>
//                             Testimonials Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/faqs"
//                     element={
//                         <div>
//                             FAQs Page
//                         </div>
//                     }
//                 />

//              <Route
//     path="/notifications"
//     element={<AdminNotifications />}
// />

//                 <Route
//                     path="/reports"
//                     element={
//                         <div>
//                             Reports Page
//                         </div>
//                     }
//                 />

//                 <Route
//                     path="/settings"
//                     element={
//                         <div>
//                             Settings Page
//                         </div>
//                     }
//                 />

//                 {/* =========================================
//                     SHIFT MANAGEMENT
//                 ========================================= */}

//                 <Route
//                     path="/add-shift"
//                     element={<ShiftManagement />}
//                 />

//                 <Route
//                     path="/employee-shift"
//                     element={<EmployeeShiftList />}
//                 />

//                 {/* =========================================
//                     ATTENDANCE
//                 =========================================

//                     TEMPORARILY REMOVED

//                     AdminAttendance.jsx does not exist.

//                     DO NOT ADD THIS UNTIL FILE EXISTS:

//                     <Route
//                         path="/attendance"
//                         element={<AdminAttendance />}
//                     />

//                 ========================================= */}

//             </Route>

//             {/* =================================================
//                 PUBLIC PRODUCTS
//             ================================================= */}

//             <Route
//                 path="/products"
//                 element={<Products />}
//             />

//             <Route
//                 path="/shop"
//                 element={<Shop />}
//             />

//             <Route
//                 path="/shop/product/:id"
//                 element={<ProductDetails />}
//             />

//             <Route
//                 path="/cart"
//                 element={<Cart />}
//             />

//             <Route
//                 path="/wishlist"
//                 element={<Wishlist />}
//             />

//             {/* =================================================
//                 ADDRESS
//             ================================================= */}

//             <Route
//                 path="/my-address"
//                 element={<MyAddress />}
//             />

//             <Route
//                 path="/add-address"
//                 element={<AddAddress />}
//             />

//             {/* =================================================
//                 CUSTOMER CHECKOUT
//             ================================================= */}

//             <Route
//                 path="/checkout"
//                 element={<Checkout />}
//             />

//             <Route
//                 path="/select-address"
//                 element={<SelectAddress />}
//             />

//             {/* =================================================
//                 CUSTOMER ORDERS
//             ================================================= */}

//             <Route
//                 path="/order-success"
//                 element={<OrderSuccess />}
//             />

//             <Route
//                 path="/my-orders"
//                 element={<MyOrders />}
//             />

//             <Route
//                 path="/order/:id"
//                 element={<OrderDetails />}
//             />

//             <Route
//                 path="/order/:id/track"
//                 element={<TrackOrder />}
//             />

//             {/* =================================================
//                 CUSTOMER PAYMENT
//             ================================================= */}

//             <Route
//                 path="/payment"
//                 element={<Payment />}
//             />

//             {/* =================================================
//                 RECEPTIONIST
//             ================================================= */}

//             <Route
//                 path="/receptionist-dashboard"
//                 element={<ReceptionistDashboard />}
//             />

//             <Route
//                 path="/receptionist/walk-in-order/new"
//                 element={<NewWalkInOrder />}
//             />

//             <Route
//                 path="/receptionist/walk-in-orders"
//                 element={<WalkInOrders />}
//             />

//             <Route
//                 path="/receptionist/walk-in-invoice/:invoiceId"
//                 element={<WalkInInvoice />}
//             />

//             {/* =================================================
//                 OTHER DASHBOARDS
//             ================================================= */}

//             <Route
//                 path="/technician-dashboard"
//                 element={<TechnicianDashboard />}
//             />

//             <Route
//                 path="/inventory-dashboard"
//                 element={<InventoryDashboard />}
//             />

//             <Route
//                 path="/accountant-dashboard"
//                 element={<AccountantDashboard />}
//             />

//             {/* =================================================
//                 INVOICE
//             ================================================= */}

//             <Route
//                 path="/invoice/walkin/:orderId"
//                 element={<WalkInInvoicePage />}
//             />

//             <Route
//     path="/repair"
//     element={<Repair />}
// />

//              <Route
//                 path="/rental"
//                 element={<Rental />}
//             />

//         </Routes>
//     );
// }

// export default App;

import { Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar/TopBar";
import Header from "./components/Header/Header";

// ===============================
// PUBLIC
// ===============================

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Repair from "./pages/Repair/Repair.jsx";
import Rental from "./pages/Rental.jsx";

// ===============================
// ADMIN DASHBOARD
// ===============================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";

// ===============================
// ADMIN CUSTOMER
// ===============================

import CustomerDashboard from "./pages/Admin/Customer/CustomerDashboard/CustomerDashboard.jsx";
import CustomerList from "./pages/Admin/Customer/CustomerList";

// ===============================
// ADMIN EMPLOYEE
// ===============================

import AddEmployee from "./pages/Admin/Employee/AddEmployee";
import EmployeeList from "./pages/Admin/Employee/EmployeeList";

// ===============================
// DASHBOARDS
// ===============================

import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import AccountantDashboard from "./pages/Accountant/AccountantDashboard";

// ===============================
// CATEGORY
// ===============================

import AddCategory from "./pages/Admin/Category/AddCategory";
import CategoryList from "./pages/Admin/Category/CategoryList";

// ===============================
// BRAND
// ===============================

import AddBrand from "./pages/Admin/Brand/AddBrand";
import BrandList from "./pages/Admin/Brand/BrandList";

// ===============================
// PRODUCTS
// ===============================

import ProductList from "./pages/Admin/Products/ProductList/ProductList";
import AddProduct from "./pages/Admin/Products/AddProduct/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct/EditProduct";
import ViewProduct from "./pages/Admin/Products/ViewProduct/ViewProduct";

import Products from "./pages/Products/Products";
import ProductDetails from "./pages/Shop/ProductDetails/ProductDetails";

// ===============================
// INVENTORY
// ===============================

import StockHistory from "./pages/Inventory/StockHistory";

// ===============================
// SHOP
// ===============================

import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Shop/Cart/Cart";
import Wishlist from "./pages/Shop/Wishlist/Wishlist";

// ===============================
// PROFILE / ADDRESS
// ===============================

import MyAddress from "./pages/Profile/MyAddress/MyAddress";
import AddAddress from "./pages/Profile/AddAddress/AddAddress";

// ===============================
// CUSTOMER ORDERS
// ===============================

import Checkout from "./pages/Shop/Checkout/Checkout";
import SelectAddress from "./pages/Shop/SelectAddress/SelectAddress";
import OrderSuccess from "./pages/Shop/OrderSuccess/OrderSuccess";
import MyOrders from "./pages/Shop/MyOrders/MyOrders";
import OrderDetails from "./pages/Shop/OrderDetails/OrderDetails";
import TrackOrder from "./pages/Shop/TrackOrder/TrackOrder";

// ===============================
// ADMIN ORDERS
// ===============================

import OrderList from "./pages/Admin/Orders/OrderList/OrderList";
import ViewOrder from "./pages/Admin/Orders/ViewOrder/ViewOrder";

// ===============================
// PAYMENT
// ===============================

import Payment from "./pages/Shop/Payment/Payment";

// ===============================
// RECEPTIONIST WALK-IN
// ===============================

import NewWalkInOrder from "./pages/Receptionist/WalkInOrders/NewWalkInOrder/NewWalkInOrder.jsx";
import WalkInOrders from "./pages/Receptionist/WalkInOrders/WalkInOrders.jsx";
import WalkInInvoice from "./pages/Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice.jsx";
import WalkInInvoicePage from "./pages/invoice/WalkInInvoicePage";

// ===============================
// ADMIN LAYOUT
// ===============================

import AdminLayout from "./layouts/AdminLayout";

// ===============================
// SALARY
// ===============================

import SalaryPage from "./components/Admin/Salary/SalaryPage";

// ===============================
// PUBLIC PAGES
// ===============================

import About from "./pages/About.jsx";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ";

// ===============================
// INVOICES
// ===============================

import InvoicePage from "./pages/invoice/InvoicePage";
import AdminInvoices from "./pages/Admin/Invoices/AdminInvoices";

// ===============================
// SHIFT MANAGEMENT
// ===============================

import ShiftManagement from "./components/ShiftManagement/ShiftManagement.jsx";
import EmployeeShiftList from "./components/ShiftManagement/EmployeeShiftList.jsx";

// ===============================
// ATTENDANCE
// ===============================

import AdminAttendance from "./components/Attendance/AdminAttendance.jsx";

// ===============================
// OFFERS
// ===============================

import AdminOffers from "./pages/Admin/Offers/AdminOffers";
import AddOffer from "./pages/Admin/Offers/AddOffer";

// ===============================
// COUPONS
// ===============================

import AddCoupon from "./components/Admin/Coupon/AddCoupon";
import CouponList from "./components/Admin/Coupon/CouponList";

// ===============================
// NOTIFICATIONS
// ===============================

import AdminNotifications from "./components/Admin/Notifications/AdminNotifications";

// =====================================================
// APP
// =====================================================

function App() {
    return (
        <>
            {/* =================================================
                GLOBAL WEBSITE HEADER

                IMPORTANT:
                Header yahan sirf EK baar render hoga.

                Isliye Home, Shop, Product, Cart,
                Customer Dashboard, Admin Dashboard,
                Inventory, Receptionist, Technician etc.
                sab pages par same Header available rahega.
            ================================================= */}
{/* =================================================
    FIXED WEBSITE HEADER
    TOPBAR + HEADER BOTH FIXED
================================================= */}

<div
    className="
        fixed
        top-0
        left-0
        right-0
        z-[1000]
        w-full
    "
>
    <TopBar />
    <Header />
</div>

{/* Header + TopBar ke liye space */}
<div className="h-[150px] w-full"></div>
            {/* =================================================
                ALL ROUTES
            ================================================= */}

            <Routes>

                {/* =================================================
                    PUBLIC
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about-us"
                    element={<About />}
                />

                <Route
                    path="/blog"
                    element={<Blog />}
                />

                <Route
                    path="/careers"
                    element={<Careers />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/faq"
                    element={<FAQ />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/repair"
                    element={<Repair />}
                />

                <Route
                    path="/rental"
                    element={<Rental />}
                />

                {/* =================================================
                    CUSTOMER DASHBOARD
                ================================================= */}

                <Route
                    path="/customer-dashboard"
                    element={<CustomerDashboard />}
                />

                {/* =================================================
                    INVENTORY DASHBOARD
                ================================================= */}

                <Route
                    path="/inventory"
                    element={<InventoryDashboard />}
                />

                {/* =================================================
                    ADMIN LAYOUT

                    Sidebar / Admin content routes
                ================================================= */}

                <Route element={<AdminLayout />}>

                    {/* =========================================
                        ADMIN DASHBOARD
                    ========================================= */}

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* =========================================
                        SALARY
                    ========================================= */}

                    <Route
                        path="/salary"
                        element={<SalaryPage />}
                    />

                    {/* =========================================
                        CUSTOMER
                    ========================================= */}

                    <Route
                        path="/customers"
                        element={<CustomerList />}
                    />

                    {/* =========================================
                        EMPLOYEE
                    ========================================= */}

                    <Route
                        path="/add-employee"
                        element={<AddEmployee />}
                    />

                    <Route
                        path="/employees"
                        element={<EmployeeList />}
                    />

                    {/* =========================================
                        ATTENDANCE
                    ========================================= */}

                    <Route
                        path="/attendance"
                        element={<AdminAttendance />}
                    />

                    {/* =========================================
                        CATEGORY
                    ========================================= */}

                    <Route
                        path="/add-category"
                        element={<AddCategory />}
                    />

                    <Route
                        path="/categories"
                        element={<CategoryList />}
                    />

                    {/* =========================================
                        BRAND
                    ========================================= */}

                    <Route
                        path="/add-brand"
                        element={<AddBrand />}
                    />

                    <Route
                        path="/brands"
                        element={<BrandList />}
                    />

                    {/* =========================================
                        ADMIN PRODUCTS
                    ========================================= */}

                    <Route
                        path="/admin/products"
                        element={<ProductList />}
                    />

                    <Route
                        path="/add-product"
                        element={<AddProduct />}
                    />

                    <Route
                        path="/edit-product/:id"
                        element={<EditProduct />}
                    />

                    <Route
                        path="/view-product/:id"
                        element={<ViewProduct />}
                    />

                    {/* =========================================
                        INVENTORY
                    ========================================= */}

                    <Route
                        path="/stock-history"
                        element={<StockHistory />}
                    />

                    {/* =========================================
                        OFFERS
                    ========================================= */}

                    <Route
                        path="/admin/offers"
                        element={<AdminOffers />}
                    />

                    <Route
                        path="/admin/add-offer"
                        element={<AddOffer />}
                    />

                    {/* =========================================
                        COUPONS
                    ========================================= */}

                    <Route
                        path="/admin/coupons"
                        element={<CouponList />}
                    />

                    <Route
                        path="/admin/add-coupon"
                        element={<AddCoupon />}
                    />

                    {/* =========================================
                        ADMIN ORDERS
                    ========================================= */}

                    <Route
                        path="/admin/orders"
                        element={<OrderList />}
                    />

                    <Route
                        path="/admin/orders/:id"
                        element={<ViewOrder />}
                    />

                    {/* =========================================
                        ADMIN INVOICES
                    ========================================= */}

                    <Route
                        path="/admin/invoices"
                        element={<AdminInvoices />}
                    />

                    {/* =========================================
                        RENTALS
                    ========================================= */}

                    <Route
                        path="/rentals"
                        element={
                            <div>
                                Rental List Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-rental"
                        element={
                            <div>
                                Add Rental Page
                            </div>
                        }
                    />

                    {/* =========================================
                        REPAIRS
                    ========================================= */}

                    <Route
                        path="/repairs"
                        element={
                            <div>
                                Repair Jobs Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-repair"
                        element={
                            <div>
                                Add Repair Page
                            </div>
                        }
                    />

                    {/* =========================================
                        ORDERS
                    ========================================= */}

                    <Route
                        path="/pending-orders"
                        element={
                            <div>
                                Pending Orders Page
                            </div>
                        }
                    />

                    <Route
                        path="/completed-orders"
                        element={
                            <div>
                                Completed Orders Page
                            </div>
                        }
                    />

                    {/* =========================================
                        SUPPLIERS
                    ========================================= */}

                    <Route
                        path="/suppliers"
                        element={
                            <div>
                                Supplier List Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-supplier"
                        element={
                            <div>
                                Add Supplier Page
                            </div>
                        }
                    />

                    {/* =========================================
                        PURCHASE
                    ========================================= */}

                    <Route
                        path="/purchase-orders"
                        element={
                            <div>
                                Purchase Orders Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-purchase-order"
                        element={
                            <div>
                                Add Purchase Order Page
                            </div>
                        }
                    />

                    {/* =========================================
                        SALES
                    ========================================= */}

                    <Route
                        path="/sales"
                        element={
                            <div>
                                Sales Page
                            </div>
                        }
                    />

                    {/* =========================================
                        INVOICE
                    ========================================= */}

                    <Route
                        path="/invoice/:id"
                        element={
                            <div>
                                Invoices Page
                            </div>
                        }
                    />

                    {/* =========================================
                        OLD COUPON ROUTES
                    ========================================= */}

                    <Route
                        path="/coupons"
                        element={
                            <div>
                                Coupons Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-coupon"
                        element={
                            <div>
                                Add Coupon Page
                            </div>
                        }
                    />

                    {/* =========================================
                        REVIEWS
                    ========================================= */}

                    <Route
                        path="/reviews"
                        element={
                            <div>
                                Reviews Page
                            </div>
                        }
                    />

                    {/* =========================================
                        BLOGS
                    ========================================= */}

                    <Route
                        path="/blogs"
                        element={
                            <div>
                                Blog List Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-blog"
                        element={
                            <div>
                                Add Blog Page
                            </div>
                        }
                    />

                    {/* =========================================
                        BANNERS
                    ========================================= */}

                    <Route
                        path="/banners"
                        element={
                            <div>
                                Banner List Page
                            </div>
                        }
                    />

                    <Route
                        path="/add-banner"
                        element={
                            <div>
                                Add Banner Page
                            </div>
                        }
                    />

                    {/* =========================================
                        TESTIMONIALS
                    ========================================= */}

                    <Route
                        path="/testimonials"
                        element={
                            <div>
                                Testimonials Page
                            </div>
                        }
                    />

                    {/* =========================================
                        FAQ
                    ========================================= */}

                    <Route
                        path="/faqs"
                        element={
                            <div>
                                FAQs Page
                            </div>
                        }
                    />

                    {/* =========================================
                        NOTIFICATIONS
                    ========================================= */}

                    <Route
                        path="/notifications"
                        element={<AdminNotifications />}
                    />

                    {/* =========================================
                        REPORTS
                    ========================================= */}

                    <Route
                        path="/reports"
                        element={
                            <div>
                                Reports Page
                            </div>
                        }
                    />

                    {/* =========================================
                        SETTINGS
                    ========================================= */}

                    <Route
                        path="/settings"
                        element={
                            <div>
                                Settings Page
                            </div>
                        }
                    />

                    {/* =========================================
                        SHIFT MANAGEMENT
                    ========================================= */}

                    <Route
                        path="/add-shift"
                        element={<ShiftManagement />}
                    />

                    <Route
                        path="/employee-shift"
                        element={<EmployeeShiftList />}
                    />

                </Route>

                {/* =================================================
                    PUBLIC PRODUCTS
                ================================================= */}

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/shop"
                    element={<Shop />}
                />

                <Route
                    path="/shop/product/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                {/* =================================================
                    PROFILE / ADDRESS
                ================================================= */}

                <Route
                    path="/my-address"
                    element={<MyAddress />}
                />

                <Route
                    path="/add-address"
                    element={<AddAddress />}
                />

                {/* =================================================
                    CUSTOMER CHECKOUT
                ================================================= */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/select-address"
                    element={<SelectAddress />}
                />

                {/* =================================================
                    CUSTOMER ORDERS
                ================================================= */}

                <Route
                    path="/order-success"
                    element={<OrderSuccess />}
                />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />

                <Route
                    path="/order/:id"
                    element={<OrderDetails />}
                />

                <Route
                    path="/order/:id/track"
                    element={<TrackOrder />}
                />

                {/* =================================================
                    PAYMENT
                ================================================= */}

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                {/* =================================================
                    RECEPTIONIST
                ================================================= */}

                <Route
                    path="/receptionist-dashboard"
                    element={<ReceptionistDashboard />}
                />

                <Route
                    path="/receptionist/walk-in-order/new"
                    element={<NewWalkInOrder />}
                />

                <Route
                    path="/receptionist/walk-in-orders"
                    element={<WalkInOrders />}
                />

                <Route
                    path="/receptionist/walk-in-invoice/:invoiceId"
                    element={<WalkInInvoice />}
                />

                {/* =================================================
                    TECHNICIAN
                ================================================= */}

                <Route
                    path="/technician-dashboard"
                    element={<TechnicianDashboard />}
                />

                {/* =================================================
                    INVENTORY
                ================================================= */}

                <Route
                    path="/inventory-dashboard"
                    element={<InventoryDashboard />}
                />

                {/* =================================================
                    ACCOUNTANT
                ================================================= */}

                <Route
                    path="/accountant-dashboard"
                    element={<AccountantDashboard />}
                />

                {/* =================================================
                    WALK-IN INVOICE
                ================================================= */}

                <Route
                    path="/invoice/walkin/:orderId"
                    element={<WalkInInvoicePage />}
                />

                {/* =================================================
                    REPAIR
                ================================================= */}

                <Route
                    path="/repair"
                    element={<Repair />}
                />

                {/* =================================================
                    RENTAL
                ================================================= */}

                <Route
                    path="/rental"
                    element={<Rental />}
                />

            </Routes>
        </>
    );
}

export default App;