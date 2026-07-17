import { useEffect, useState } from "react";
import axios from "axios";

function CustomerList() {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const onlyCustomers = res.data.users.filter(
        (item) => item.role === "CUSTOMER"
      );

      setCustomers(onlyCustomers);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Customers</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>

          {customers.map((item) => (

            <tr key={item._id}>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default CustomerList;