import React, { useEffect, useState } from "react";

import "./ProductList.css";

import {

    getProducts,

    deleteProduct,

    searchProducts

} from "../../../../services/productService";

const ProductList = () => {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

        useEffect(() => {

        loadProducts();

    }, []);

    // const loadProducts = async () => {

    //     try {

    //         setLoading(true);

    //         const res = await getProducts();

    //         console.log("Products API:", res.data);
    //     }

    //     catch (err) {

    //         console.log(err);

    //     }

    //     finally {

    //         setLoading(false);

    //     }

    // };


 const loadProducts = async () => {

    try {

        setLoading(true);

        const res = await getProducts();

        console.log(res.data);

        setProducts(res.data.data || []);

    }

    catch (err) {

        console.log(err);

    }

    finally {

        setLoading(false);

    }

};
       const handleSearch = async (e) => {

        const keyword = e.target.value;

        setSearch(keyword);

        if (keyword === "") {

            loadProducts();

            return;

        }

        try {

            const res = await searchProducts(keyword);

            setProducts(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }; 

        const handleDelete = async (id) => {

        const confirmDelete = window.confirm(

            "Are you sure you want to delete this product?"

        );

        if (!confirmDelete) return;

        try {

            await deleteProduct(id);

            loadProducts();

            alert("Product Deleted Successfully");

        }

        catch (err) {

            console.log(err);

            alert("Delete Failed");

        }

    };

        const lastIndex = currentPage * itemsPerPage;

    const firstIndex = lastIndex - itemsPerPage;

    const currentProducts = products.slice(

        firstIndex,

        lastIndex

    );

    const totalPages = Math.ceil(

        products.length / itemsPerPage

    );

        return (

        <div className="product-list">

            <div className="page-header">

                <h2>

                    Product List

                </h2>

                <input

                    type="text"

                    placeholder="Search Product..."

                    value={search}

                    onChange={handleSearch}

                    className="search-box"

                />

            </div>

                        {

                loading ?

                (

                    <div className="loading">

                        Loading Products...

                    </div>

                )

                :

                (

                    <>

                        <table className="product-table">

<thead>
    <tr>
        <th>#</th>
        <th>Image</th>
        <th>Product Name</th>
        <th>Category</th>
        <th>Brand</th>
        <th>Purchase Price</th>
        <th>Selling Price</th>
        <th>MRP</th>
        <th>Discount</th>
        <th>GST</th>
        <th>Stock</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>
</thead>

<tbody>

{
currentProducts.length > 0 ?

currentProducts.map((product,index)=>(

<tr key={product._id}>

<td>{firstIndex + index + 1}</td>

<td>

{
product.images?.length > 0 ?

<img
src={`http://localhost:5000${product.images[0].url}`}
alt={product.name}
className="table-image"
/>

:

"No Image"

}

</td>

<td>{product.name}</td>

<td>{product.category?.name}</td>

<td>{product.brand?.name}</td>

<td>
₹ {product.pricing?.purchasePrice}
</td>

<td>
₹ {product.pricing?.sellingPrice}
</td>

<td>
₹ {product.pricing?.mrp}
</td>

<td>
{product.pricing?.discount} %
</td>

<td>
{product.pricing?.gst} %
</td>

<td>

{
product.inventory?.currentStock ??

0
}

</td>

<td>

{
product.status === "ACTIVE"

?

<span className="active-status">

Active

</span>

:

<span className="inactive-status">

Inactive

</span>

}

</td>

<td>

<button
className="delete-btn"
onClick={() => handleDelete(product._id)}
>

Delete

</button>

</td>

</tr>

))

:

<tr>

<td colSpan="13">

No Products Found

</td>

</tr>

}

</tbody>

                        </table>


                        {/* ================= Pagination ================= */}

                        {
                            totalPages > 1 && (

                                <div className="pagination">

                                    <button

                                        disabled={currentPage === 1}

                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }

                                    >

                                        Previous

                                    </button>

                                    {

                                        [...Array(totalPages)].map((_, index) => (

                                            <button

                                                key={index}

                                                className={
                                                    currentPage === index + 1
                                                        ? "active-page"
                                                        : ""
                                                }

                                                onClick={() =>
                                                    setCurrentPage(index + 1)
                                                }

                                            >

                                                {index + 1}

                                            </button>

                                        ))

                                    }

                                    <button

                                        disabled={
                                            currentPage === totalPages
                                        }

                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }

                                    >

                                        Next

                                    </button>

                                </div>

                            )

                        }

                    </>

                )

            }

        </div>

    );

};

export default ProductList;

