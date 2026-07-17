import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Register from "./pages/Register/Register";
import CustomerDashboard from "./pages/Admin/Customer/CustomerDashboard";
import CustomerList from "./pages/Admin/Customer/CustomerList";
import AddEmployee from "./pages/Admin/Employee/AddEmployee";
import EmployeeList from "./pages/Admin/Employee/EmployeeList";
import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import AccountantDashboard from "./pages/Accountant/AccountantDashboard";
import AddCategory from "./pages/Admin/Category/AddCategory";
import CategoryList from "./pages/Admin/Category/CategoryList";
import AddBrand from "./pages/Admin/Brand/AddBrand";
import BrandList from "./pages/Admin/Brand/BrandList";
import ProductDetails from "./pages/Shop/ProductDetails/ProductDetails";
import ProductList from "./pages/Admin/Products/ProductList/ProductList";
import AddProduct from "./pages/Admin/Products/AddProduct/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct/EditProduct";
import ViewProduct from "./pages/Admin/Products/ViewProduct/ViewProduct";
import Products from "./pages/Products/Products";
import StockHistory from "./pages/Inventory/StockHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route path="/register" element={<Register />} />
      <Route

path="/customer-dashboard"

element={<CustomerDashboard />}

/>

<Route

path="/customers"

element={<CustomerList/>}

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
/><Route
    path="/shop/product/:id"
    element={<ProductDetails />}
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

<Route path="/products" element={<Products />} />

<Route

path="/stock-history"

element={<StockHistory />}

/>




  
  
  
  
    </Routes>
  );
}

export default App;