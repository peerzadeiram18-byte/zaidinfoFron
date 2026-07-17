import { useEffect, useState } from "react";
import "./InventoryDashboard.css";

import AddStockModal from "./AddStockModal";

import {
  getInventory,
  addStock,
  removeStock,
} from "../../services/inventoryService";

function InventoryDashboard() {

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const [search, setSearch] = useState("");

 const [statusFilter, setStatusFilter] = useState("ALL");


  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {

      const res = await getInventory();

      console.log(res.data);

      setInventory(res.data.data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  // =============================
  // Add Stock
  // =============================

  const openAddStock = (product) => {

    setSelectedProduct(product);

    setShowModal(true);

  };

  const handleAddStock = async (productId, quantity) => {

    try {

      await addStock({

        productId,

        quantity: Number(quantity)

      });

      alert("Stock Added Successfully");

      setShowModal(false);

      loadInventory();

    } catch (err) {

      console.log(err);

      alert("Failed");

    }

  };

  // =============================
  // Remove Stock
  // =============================

  const handleRemoveStock = async (productId, quantity) => {

    try {

      await removeStock({

        productId,

        quantity: Number(quantity)

      });

      alert("Stock Removed Successfully");

      loadInventory();

    } catch (err) {

      console.log(err);

      alert(err.response?.data?.message || "Remove Failed");

    }

  };

  // =============================
  // Dashboard Cards
  // =============================

  const totalProducts = inventory.length;

  const inStock = inventory.filter(
    item => item.status === "IN_STOCK"
  ).length;

  const lowStock = inventory.filter(
    item => item.status === "LOW_STOCK"
  ).length;

  const outOfStock = inventory.filter(
    item => item.status === "OUT_OF_STOCK"
  ).length;

  const totalStock = inventory.reduce(
    (total, item) => total + item.currentStock,
    0
  );

const filteredInventory = inventory.filter((item) => {

  const matchSearch =
    item.product.name
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "ALL" ||
    item.status === statusFilter;

  return matchSearch && matchStatus;

});


  return (

    <div className="inventory-dashboard">

      <h1>Inventory Management</h1>

      {loading ? (

        <h2>Loading...</h2>

      ) : (

        <>

          {/* Cards */}

          <div className="inventory-cards">

            <div className="card blue">
              <h3>Total Products</h3>
              <h2>{totalProducts}</h2>
            </div>

            <div className="card green">
              <h3>In Stock</h3>
              <h2>{inStock}</h2>
            </div>

            <div className="card orange">
              <h3>Low Stock</h3>
              <h2>{lowStock}</h2>
            </div>

            <div className="card red">
              <h3>Out Of Stock</h3>
              <h2>{outOfStock}</h2>
            </div>

            <div className="card purple">
              <h3>Total Stock</h3>
              <h2>{totalStock}</h2>
            </div>

          </div>


          <div className="inventory-top">

<input
type="text"
placeholder="Search Product..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option value="ALL">All Status</option>

<option value="IN_STOCK">
In Stock
</option>

<option value="LOW_STOCK">
Low Stock
</option>

<option value="OUT_OF_STOCK">
Out Of Stock
</option>

</select>

</div>

          {/* Table */}

          <table className="inventory-table">

            <thead>

              <tr>

                <th>#</th>
                <th>Image</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

        <tbody>

{
filteredInventory.length > 0 ? (

filteredInventory.map((item, index) => (

<tr
key={item._id}
className={

item.status === "LOW_STOCK"
? "low-stock-row"
: item.status === "OUT_OF_STOCK"
? "out-stock-row"
: ""

}
>

<td>{index + 1}</td>

<td>

{
item.product.images?.length > 0 ? (

<img
src={`http://localhost:5000${item.product.images[0].url}`}
alt={item.product.name}
className="inventory-image"
/>

) : (

"No Image"

)
}

</td>

<td>

<b>{item.product.name}</b>

{
item.status === "LOW_STOCK" && (

<p className="warning">

⚠ Only few items left

</p>

)
}

{
item.status === "OUT_OF_STOCK" && (

<p className="danger">

❌ Product Out Of Stock

</p>

)
}

</td>

<td>{item.product.sku}</td>

<td>

₹ {item.product.pricing?.sellingPrice}

</td>

<td>{item.currentStock}</td>

<td>{item.reservedStock}</td>

<td>{item.availableStock}</td>

<td>

{
item.status === "IN_STOCK" && (
<span className="status in-stock">
In Stock
</span>
)
}

{
item.status === "LOW_STOCK" && (
<span className="status low-stock">
Low Stock
</span>
)
}

{
item.status === "OUT_OF_STOCK" && (
<span className="status out-stock">
Out Of Stock
</span>
)
}

</td>

<td>

<button
className="add-btn"
onClick={() => openAddStock(item)}
>

+ Stock

</button>

<button
className="remove-btn"
onClick={() => {

const qty = prompt("Enter Remove Quantity");

if(!qty) return;

handleRemoveStock(
item.product._id,
qty
);

}}
>

- Stock

</button>

</td>

</tr>

))

) : (

<tr>

<td colSpan="10">

No Product Found

</td>

</tr>

)

}

</tbody>

          </table>

        </>

      )}

      {

        showModal && (

          <AddStockModal

            product={selectedProduct}

            onClose={() => setShowModal(false)}

            onSave={handleAddStock}

          />

        )

      }

    </div>

  );

}

export default InventoryDashboard;