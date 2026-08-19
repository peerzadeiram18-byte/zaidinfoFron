import React from "react";
import { useNavigate } from "react-router-dom";

import "./AddOffer.css";

const AddOffer = () => {
  const navigate = useNavigate();

  return (
    <div className="add-offer-page">

      <div className="add-offer-box">

        <div className="add-offer-icon">
          🎁
        </div>

        <h1>
          Create New Offer
        </h1>

        <p>
          Create and manage product discounts
          from the Offers section.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/offers", {
              state: {
                openCreateOffer: true,
              },
            })
          }
        >
          + Create Offer
        </button>

      </div>

    </div>
  );
};

export default AddOffer;