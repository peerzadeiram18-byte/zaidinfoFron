import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import AdminDashboard from "./pages/Admin/AdminDashboard";

// Customer
import CustomerDashboard from "./pages/Admin/Customer/CustomerDashboard/CustomerDashboard.jsx";
import CustomerList from "./pages/Admin/Customer/CustomerList";

// Employee
import AddEmployee from "./pages/Admin/Employee/AddEmployee";
import EmployeeList from "./pages/Admin/Employee/EmployeeList";

// Dashboards
import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import AccountantDashboard from "./pages/Accountant/AccountantDashboard";

// Category
import AddCategory from "./pages/Admin/Category/AddCategory";
import CategoryList from "./pages/Admin/Category/CategoryList";

// Brand
import AddBrand from "./pages/Admin/Brand/AddBrand";
import BrandList from "./pages/Admin/Brand/BrandList";

// Products
import ProductList from "./pages/Admin/Products/ProductList/ProductList";
import AddProduct from "./pages/Admin/Products/AddProduct/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct/EditProduct";
import ViewProduct from "./pages/Admin/Products/ViewProduct/ViewProduct";

import Products from "./pages/Products/Products";
import ProductDetails from "./pages/Shop/ProductDetails/ProductDetails";

// Inventory
import StockHistory from "./pages/Inventory/StockHistory";

// Shop
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Shop/Cart/Cart";
import Wishlist from "./pages/Shop/Wishlist/Wishlist";

// Address
import MyAddress from "./pages/Profile/MyAddress/MyAddress";
import AddAddress from "./pages/Profile/AddAddress/AddAddress";

//Order
import Checkout from "./pages/Shop/Checkout/Checkout";
import SelectAddress from "./pages/Shop/SelectAddress/SelectAddress";
import OrderSuccess from "./pages/Shop/OrderSuccess/OrderSuccess";
import MyOrders from "./pages/Shop/MyOrders/MyOrders";
import OrderDetails from "./pages/Shop/OrderDetails/OrderDetails";
import OrderList from "./pages/Admin/Orders/OrderList/OrderList";
import ViewOrder from "./pages/Admin/Orders/ViewOrder/ViewOrder";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";


function App() {

    return (

        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
            />

            <Route
                path="/customer-dashboard"
                element={<CustomerDashboard />}
            />

            <Route
                path="/customers"
                element={<CustomerList />}
            />

            <Route
                path="/add-employee"
                element={<AddEmployee />}
            />

            <Route
                path="/employees"
                element={<EmployeeList />}
            />

            <Route
                path="/receptionist-dashboard"
                element={<ReceptionistDashboard />}
            />

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

            <Route
                path="/add-category"
                element={<AddCategory />}
            />

            <Route
                path="/categories"
                element={<CategoryList />}
            />

            <Route
                path="/add-brand"
                element={<AddBrand />}
            />

            <Route
                path="/brands"
                element={<BrandList />}
            />

            <Route
                path="/products"
                element={<Products />}
            />

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

            <Route
                path="/my-address"
                element={<MyAddress />}
            />

            <Route
                path="/add-address"
                element={<AddAddress />}
            />

            <Route
                path="/stock-history"
                element={<StockHistory />}
            />
            
            <Route
               path="/checkout"
              element={<Checkout />}
             />
             <Route
                path="/select-address"
                element={<SelectAddress/>}
             />
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

    path="/admin/orders"

    element={<OrderList />}

/>
<Route
    path="/admin/orders/:id"
    element={<ViewOrder />}
/>
<Route

    path="/admin-dashboard"

    element={<Dashboard/>}

/>











        </Routes>

    );

}

export default App;