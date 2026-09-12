import React from "react";
import {
  FaLaptop,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./RentalInfo.css";

const RentalInfo = ({ rentalProduct }) => {
  if (!rentalProduct) {
    return null;
  }

  const product =
    rentalProduct?.product ||
    rentalProduct?.productId ||
    {};

  const productName =
    product?.name ||
    rentalProduct?.name ||
    "Laptop";

  const brand =
    typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand || "";

  const category =
    typeof product?.category === "object"
      ? product?.category?.name
      : product?.category || "";

  const availableQuantity = Number(
    rentalProduct?.availableQuantity || 0
  );

  const minimumRentalMonths = Number(
    rentalProduct?.minimumRentalMonths || 3
  );

  const totalQuantity = Number(
    rentalProduct?.totalQuantity || 0
  );

  const rentedQuantity = Number(
    rentalProduct?.rentedQuantity || 0
  );

  const isAvailable =
    rentalProduct?.isAvailableForRent !== false &&
    rentalProduct?.status !== "INACTIVE" &&
    availableQuantity > 0;

  return (
    <div className="rental-info">

      {/* TITLE */}

      <div className="rental-info-header">
        <div className="rental-info-icon">
          <FaLaptop />
        </div>

        <div>
          <h2>{productName}</h2>

          {(brand || category) && (
            <p>
              {brand}
              {brand && category ? " • " : ""}
              {category}
            </p>
          )}
        </div>
      </div>

      {/* AVAILABILITY */}

      <div
        className={`rental-info-availability ${
          isAvailable
            ? "is-available"
            : "is-unavailable"
        }`}
      >
        {isAvailable ? (
          <>
            <FaCheckCircle />
            <span>
              Available for rental
            </span>
          </>
        ) : (
          <>
            <FaTimesCircle />
            <span>
              Currently unavailable
            </span>
          </>
        )}
      </div>

      {/* DETAILS */}

      <div className="rental-info-grid">

        <div className="rental-info-item">
          <FaCalendarAlt />

          <div>
            <span>
              Minimum Rental
            </span>

            <strong>
              {minimumRentalMonths} months
            </strong>
          </div>
        </div>

        <div className="rental-info-item">
          <FaBoxOpen />

          <div>
            <span>
              Available
            </span>

            <strong>
              {availableQuantity} units
            </strong>
          </div>
        </div>

        {totalQuantity > 0 && (
          <div className="rental-info-item">
            <FaLaptop />

            <div>
              <span>
                Total Units
              </span>

              <strong>
                {totalQuantity}
              </strong>
            </div>
          </div>
        )}

        {rentedQuantity > 0 && (
          <div className="rental-info-item">
            <FaLaptop />

            <div>
              <span>
                Currently Rented
              </span>

              <strong>
                {rentedQuantity}
              </strong>
            </div>
          </div>
        )}

      </div>

      {/* INCLUDED ITEMS */}

      {Array.isArray(
        rentalProduct?.includedItems
      ) &&
        rentalProduct.includedItems.length > 0 && (
          <div className="rental-included">

            <h3>
              Included with Rental
            </h3>

            <div className="rental-included-list">
              {rentalProduct.includedItems.map(
                (item, index) => (
                  <div
                    className="rental-included-item"
                    key={`${item}-${index}`}
                  >
                    <FaCheckCircle />
                    <span>
                      {String(item)
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* SOFTWARE */}

      {rentalProduct?.basicSoftwareInstalled && (
        <div className="rental-software">
          <FaCheckCircle />

          <span>
            Basic software installation included
          </span>
        </div>
      )}

      {/* NOTES */}

      {rentalProduct?.notes && (
        <div className="rental-notes">
          <h3>Rental Notes</h3>

          <p>
            {rentalProduct.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default RentalInfo;