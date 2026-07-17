import { useEffect, useState } from "react";

import "./StockHistory.css";

import {
  getInventory,
  getStockHistory
} from "../../services/inventoryService";

function StockHistory() {

  const [products, setProducts] = useState([]);

  const [selected, setSelected] = useState("");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadInventory();

  }, []);

  const loadInventory = async () => {

    try {

      const res = await getInventory();

      setProducts(res.data.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  const loadHistory = async (id) => {

    try {

      setSelected(id);

      setLoading(true);

      if (id === "") {

        setHistory([]);

        return;

      }

      const res = await getStockHistory(id);

      setHistory(res.data.data);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="stock-history">

      <div className="stock-header">

        <h1>

          Stock History

        </h1>

        <select

          value={selected}

          onChange={(e) => loadHistory(e.target.value)}

        >

          <option value="">

            Select Product

          </option>

          {

            products.map((item) => (

              <option

                key={item.product._id}

                value={item.product._id}

              >

                {item.product.name}

              </option>

            ))

          }

        </select>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Date</th>

              <th>Type</th>

              <th>Qty</th>

              <th>Previous</th>

              <th>Updated</th>

              <th>Description</th>

            </tr>

          </thead>

          <tbody>

            {

              loading ?

              (

                <tr>

                  <td colSpan="6">

                    Loading...

                  </td>

                </tr>

              )

              :

              history.length > 0 ?

              (

                history.map((item) => (

                  <tr key={item._id}>

                    <td>

                      {

                        new Date(item.createdAt)

                        .toLocaleString()

                      }

                    </td>

                    <td>

                      <span

                        className={

                          item.type === "STOCK_IN"

                          ? "stock-in"

                          : item.type === "STOCK_OUT"

                          ? "stock-out"

                          : "return"

                        }

                      >

                        {item.type}

                      </span>

                    </td>

                    <td>

                      {item.quantity}

                    </td>

                    <td>

                      {item.previousStock}

                    </td>

                    <td>

                      {item.updatedStock}

                    </td>

                    <td>

                      {item.description}

                    </td>

                  </tr>

                ))

              )

              :

              (

                <tr>

                  <td

                    colSpan="6"

                    className="no-data"

                  >

                    No Stock History Found

                  </td>

                </tr>

              )

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default StockHistory;