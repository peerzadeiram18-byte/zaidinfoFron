// import { Routes, Route } from "react-router-dom";

// // ===============================
// // PUBLIC
// // ===============================
// import Home from "./pages/Home/Home";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";

// // ===============================
// // ADMIN
// // ===============================
// import AdminDashboard from "./pages/Admin/AdminDashboard";

// import CustomerDashboard from "./pages/Admin/Customer/CustomerDashboard/CustomerDashboard.jsx";
// import CustomerList from "./pages/Admin/Customer/CustomerList";

// import AddEmployee from "./pages/Admin/Employee/AddEmployee";
// import EmployeeList from "./pages/Admin/Employee/EmployeeList";

// // ===============================
// // DASHBOARDS
// // ===============================
// import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
// import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";
// import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
// import AccountantDashboard from "./pages/Accountant/AccountantDashboard";

// // ===============================
// // CATEGORY
// // ===============================
// import AddCategory from "./pages/Admin/Category/AddCategory";
// import CategoryList from "./pages/Admin/Category/CategoryList";

// // ===============================
// // BRAND
// // ===============================
// import AddBrand from "./pages/Admin/Brand/AddBrand";
// import BrandList from "./pages/Admin/Brand/BrandList";

// // ===============================
// // PRODUCTS
// // ===============================
// import ProductList from "./pages/Admin/Products/ProductList/ProductList";
// import AddProduct from "./pages/Admin/Products/AddProduct/AddProduct";
// import EditProduct from "./pages/Admin/Products/EditProduct/EditProduct";
// import ViewProduct from "./pages/Admin/Products/ViewProduct/ViewProduct";

// import Products from "./pages/Products/Products";
// import ProductDetails from "./pages/Shop/ProductDetails/ProductDetails";

// // ===============================
// // INVENTORY
// // ===============================
// import StockHistory from "./pages/Inventory/StockHistory";

// // ===============================
// // SHOP
// // ===============================
// import Shop from "./pages/Shop/Shop";
// import Cart from "./pages/Shop/Cart/Cart";
// import Wishlist from "./pages/Shop/Wishlist/Wishlist";

// // ===============================
// // PROFILE / ADDRESS
// // ===============================
// import MyAddress from "./pages/Profile/MyAddress/MyAddress";
// import AddAddress from "./pages/Profile/AddAddress/AddAddress";

// // ===============================
// // ORDERS
// // ===============================
// import Checkout from "./pages/Shop/Checkout/Checkout";
// import SelectAddress from "./pages/Shop/SelectAddress/SelectAddress";
// import OrderSuccess from "./pages/Shop/OrderSuccess/OrderSuccess";
// import MyOrders from "./pages/Shop/MyOrders/MyOrders";
// import OrderDetails from "./pages/Shop/OrderDetails/OrderDetails";

// import OrderList from "./pages/Admin/Orders/OrderList/OrderList";
// import ViewOrder from "./pages/Admin/Orders/ViewOrder/ViewOrder";

// // ===============================
// // ADMIN DASHBOARD
// // ===============================
// import Dashboard from "./pages/Admin/Dashboard/Dashboard";

// // ===============================
// // PAYMENT
// // ===============================
// import Payment from "./pages/Shop/Payment/Payment";

// // =====================================================
// // RECEPTIONIST - WALK-IN ORDERS
// // =====================================================

// // IMPORTANT:
// // Actual folder is WalkInOrders
// // NOT WalkInOrder

// import NewWalkInOrder from "./pages/Receptionist/WalkInOrders/NewWalkInOrder/NewWalkInOrder.jsx";

// import WalkInOrders from "./pages/Receptionist/WalkInOrders/WalkInOrders.jsx";
// import AdminLayout from "./layouts/AdminLayout/AdminLayout";

// // =====================================================
// // APP
// // =====================================================

// function App() {

//     return (

//         <Routes>

//             {/* =====================================
//                 PUBLIC
//             ===================================== */}

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


//             {/* =====================================
//                 ADMIN
//             ===================================== */}

//             <Route
//                 path="/admin-dashboard"
//                 element={<AdminDashboard />}
//             />

//             <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//             />

//             <Route
//                 path="/customers"
//                 element={<CustomerList />}
//             />

//             <Route
//                 path="/add-employee"
//                 element={<AddEmployee />}
//             />

//             <Route
//                 path="/employees"
//                 element={<EmployeeList />}
//             />


//             {/* =====================================
//                 DASHBOARDS
//             ===================================== */}

//             <Route
//                 path="/receptionist-dashboard"
//                 element={<ReceptionistDashboard />}
//             />

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


//             {/* =====================================
//                 CATEGORY
//             ===================================== */}

//             <Route
//                 path="/add-category"
//                 element={<AddCategory />}
//             />

//             <Route
//                 path="/categories"
//                 element={<CategoryList />}
//             />


//             {/* =====================================
//                 BRAND
//             ===================================== */}

//             <Route
//                 path="/add-brand"
//                 element={<AddBrand />}
//             />

//             <Route
//                 path="/brands"
//                 element={<BrandList />}
//             />


//             {/* =====================================
//                 PRODUCTS
//             ===================================== */}

//             <Route
//                 path="/products"
//                 element={<Products />}
//             />

//             <Route
//                 path="/admin/products"
//                 element={<ProductList />}
//             />

//             <Route
//                 path="/add-product"
//                 element={<AddProduct />}
//             />

//             <Route
//                 path="/edit-product/:id"
//                 element={<EditProduct />}
//             />

//             <Route
//                 path="/view-product/:id"
//                 element={<ViewProduct />}
//             />


//             {/* =====================================
//                 SHOP
//             ===================================== */}

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


//             {/* =====================================
//                 ADDRESS
//             ===================================== */}

//             <Route
//                 path="/my-address"
//                 element={<MyAddress />}
//             />

//             <Route
//                 path="/add-address"
//                 element={<AddAddress />}
//             />


//             {/* =====================================
//                 INVENTORY
//             ===================================== */}

//             <Route
//                 path="/stock-history"
//                 element={<StockHistory />}
//             />


//             {/* =====================================
//                 CUSTOMER CHECKOUT
//             ===================================== */}

//             <Route
//                 path="/checkout"
//                 element={<Checkout />}
//             />

//             <Route
//                 path="/select-address"
//                 element={<SelectAddress />}
//             />


//             {/* =====================================
//                 CUSTOMER ORDERS
//             ===================================== */}

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


//             {/* =====================================
//                 ADMIN ORDERS
//             ===================================== */}

//             <Route
//                 path="/admin/orders"
//                 element={<OrderList />}
//             />

//             <Route
//                 path="/admin/orders/:id"
//                 element={<ViewOrder />}
//             />


//             {/* =====================================
//                 ADMIN DASHBOARD
//             ===================================== */}

//             <Route
//                 path="/dashboard"
//                 element={<Dashboard />}
//             />


//             {/* =====================================
//                 CUSTOMER PAYMENT
//             ===================================== */}

//             <Route
//                 path="/payment"
//                 element={<Payment />}
//             />


//             {/* =================================================
//                 RECEPTIONIST - WALK-IN POS
//             ================================================= */}

//             {/* Receptionist Dashboard */}

//             <Route
//                 path="/receptionist-dashboard"
//                 element={<ReceptionistDashboard />}
//             />


//             {/* New Walk-in Order */}

//             <Route
//                 path="/receptionist/walk-in-order/new"
//                 element={<NewWalkInOrder />}
//             />


//             {/* Walk-in Orders List */}

//             <Route
//                 path="/receptionist/walk-in-orders"
//                 element={<WalkInOrders />}
//             />
            

//         </Routes>

//     );

// }

// export default App;


import { Routes, Route } from "react-router-dom";


// ===============================
// PUBLIC
// ===============================

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";


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


// ===============================
// ADMIN LAYOUT
// ===============================

import AdminLayout from "./layouts/AdminLayout";


import SalaryPage from "./components/Admin/Salary/SalaryPage";
// =====================================================
// APP
// =====================================================

import About from "./pages/About.jsx";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact.jsx"
import FAQ from "./pages/FAQ";


function App() {

    return (

        <Routes>


            {/* =================================================
                PUBLIC
            ================================================= */}


        <Route path="/about-us" element={<About />} />

<Route path="/blog" element={<Blog />} />

<Route path="/careers" element={<Careers />} />

        <Route path="/contact" element={<Contact />} />

<Route path="/faq" element={<FAQ />} />

            <Route
                path="/"
                element={<Home />}
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
                    path="/customer-dashboard"
                    element={<CustomerDashboard />}
                />

                {/* <Route
                    path="/customers"
                    element={<CustomerList />}
                /> */}

                  <Route
                    path="/inventory"
                    element={<InventoryDashboard />}
                />

{/* 
            <Route path="/salary" element={<SalaryPage />}/>
 */}

            {/* =================================================
                ADMIN LAYOUT
                SIDEBAR WILL SHOW ON ALL ROUTES INSIDE HERE
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


    {/* Salary */}
    <Route
        path="/salary"
        element={<SalaryPage />}
    />


                {/* =========================================
                    CUSTOMER
                ========================================= */}

                {/* <Route
                    path="/customer-dashboard"
                    element={<CustomerDashboard />}
                /> */}

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
                    ADMIN INVENTORY
                ========================================= */}

                {/* <Route
                    path="/inventory"
                    element={<InventoryDashboard />}
                /> */}

                <Route
                    path="/stock-history"
                    element={<StockHistory />}
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
                    FUTURE ADMIN PAGES
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

                <Route
                    path="/sales"
                    element={
                        <div>
                            Sales Page
                        </div>
                    }
                />

                <Route
                    path="/invoices"
                    element={
                        <div>
                            Invoices Page
                        </div>
                    }
                />

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

                <Route
                    path="/reviews"
                    element={
                        <div>
                            Reviews Page
                        </div>
                    }
                />

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

                <Route
                    path="/testimonials"
                    element={
                        <div>
                            Testimonials Page
                        </div>
                    }
                />

                <Route
                    path="/faqs"
                    element={
                        <div>
                            FAQs Page
                        </div>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <div>
                            Notifications Page
                        </div>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <div>
                            Reports Page
                        </div>
                    }
                />


{/* <Route
    path="/salary"
    element={<SalaryModal />}
/> */}

                <Route
                    path="/settings"
                    element={
                        <div>
                            Settings Page
                        </div>
                    }
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
                ADDRESS
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


            {/* =================================================
                CUSTOMER PAYMENT
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


            {/* =================================================
                OTHER DASHBOARDS
            ================================================= */}

            <Route
                path="/technician-dashboard"
                element={<TechnicianDashboard />}
            />

            <Route
                path="/inventory-dashboard"
                element={<InventoryDashboard />}
            />

            <Route
                path="/accountant-dashboard"
                element={<AccountantDashboard />}
            />

        </Routes>

    );

}

export default App;