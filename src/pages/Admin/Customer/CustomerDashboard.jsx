import { useState } from "react";

import MyProfile from "./MyProfile";

import "./CustomerDashboard.css";

function CustomerDashboard() {

  const [page, setPage] = useState("profile");

  return (

    <div className="customer-dashboard">

      <div className="sidebar">

        <h2>Customer</h2>

        <button onClick={() => setPage("profile")}>
          My Profile
        </button>

        <button>
          My Orders
        </button>

        <button>
          My Repairs
        </button>

        <button>
          My Rentals
        </button>

        <button>
          Wishlist
        </button>

        <button>
          Cart
        </button>

        <button>
          Addresses
        </button>

        <button>
          Change Password
        </button>

      </div>

      <div className="content">

        {page === "profile" && <MyProfile />}

      </div>

    </div>

  );

}

export default CustomerDashboard;