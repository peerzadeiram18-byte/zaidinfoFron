import { useEffect, useState } from "react";
import { getBrands } from "../../../services/brandService";
import "./BrandList.css";

function BrandList() {

  const [brands, setBrands] = useState([]);

  useEffect(() => {

    loadBrands();

  }, []);

  const loadBrands = async () => {

    try {

      const res = await getBrands();

      setBrands(res.data.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="brand-list-page">

      <h2>Brand List</h2>

      <table>

        <thead>

          <tr>

            <th>Logo</th>

            <th>Name</th>

            <th>Category</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {

            brands.length === 0 ?

            (

              <tr>

                <td colSpan="4">

                  No Brand Found

                </td>

              </tr>

            )

            :

            brands.map((brand) => (

              <tr key={brand._id}>

                <td>

                  {

                    brand.logo ?

                    <img
                      src={`http://localhost:5000${brand.logo}`}
                      alt={brand.name}
                      className="brand-logo"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/100x100?text=No+Image";
                      }}
                    />

                    :

                    "No Image"

                  }

                </td>

                <td>{brand.name}</td>

                <td>{brand.category?.name}</td>

                <td>{brand.status}</td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </div>

  );

}

export default BrandList;