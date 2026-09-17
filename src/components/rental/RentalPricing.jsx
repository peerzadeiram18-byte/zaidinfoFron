import React, { useMemo } from "react";
import {
  FaRupeeSign,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import "./RentalPricing.css";

const RentalPricing = ({
  rentalProduct,
  onRentNow,
}) => {
  // const pricing = useMemo(() => {
  //   const monthlyRent = Number(
  //     rentalProduct?.monthlyRent || 0
  //   );

  //   const securityDeposit = Number(
  //     rentalProduct?.securityDeposit || 0
  //   );

  //   const gstPercentage = Number(
  //     rentalProduct?.gst || 0
  //   );

  //   const minimumMonths = Math.max(
  //     Number(
  //       rentalProduct?.minimumRentalMonths || 3
  //     ),
  //     3
  //   );

  //   const monthlyGST =
  //     (monthlyRent * gstPercentage) / 100;

  //   const monthlyTotal =
  //     monthlyRent + monthlyGST;

  //   const minimumRentalAmount =
  //     monthlyTotal * minimumMonths;

  //   const firstPayment =
  //     minimumRentalAmount + securityDeposit;

  //   return {
  //     monthlyRent,
  //     securityDeposit,
  //     gstPercentage,
  //     monthlyGST,
  //     monthlyTotal,
  //     minimumMonths,
  //     minimumRentalAmount,
  //     firstPayment,
  //   };
  // }, [rentalProduct]);

const pricing = useMemo(() => {

    if (!selectedProduct) {
        return {
            monthlyRent: 0,
            dailyRent: 0,
            duration: rentalDuration,
            durationType: rentalDurationType,
            rentSubtotal: 0,
            gstPercentage: 0,
            gstAmount: 0,
            securityDeposit: 0,
            totalAmount: 0,
        };
    }

    const monthlyRent =
        getMonthlyRent(selectedProduct);

    const dailyRent =
        monthlyRent / 30;

    const securityDeposit =
        getSecurityDeposit(selectedProduct);

    const gstPercentage =
        getGST(selectedProduct);


    let rentSubtotal = 0;


    if (rentalDurationType === "DAYS") {

        rentSubtotal =
            dailyRent *
            Number(rentalDuration);

    } else {

        rentSubtotal =
            monthlyRent *
            Number(rentalDuration);
    }


    const gstAmount =
        (rentSubtotal * gstPercentage) / 100;


    const totalAmount =
        rentSubtotal +
        gstAmount +
        securityDeposit;


    return {

        monthlyRent,

        dailyRent,

        duration:
            Number(rentalDuration),

        durationType:
            rentalDurationType,

        rentSubtotal:
            Number(rentSubtotal.toFixed(2)),

        gstPercentage,

        gstAmount:
            Number(gstAmount.toFixed(2)),

        securityDeposit,

        totalAmount:
            Number(totalAmount.toFixed(2)),
    };

}, [
    selectedProduct,
    rentalDuration,
    rentalDurationType,
]);


  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  return (
    <div className="rental-pricing">

      <div className="rental-pricing-header">
        <h2>Rental Pricing</h2>

        <span>
          Monthly plan
        </span>
      </div>

      {/* MONTHLY RENT */}

      <div className="rental-price-main">
        <div className="rental-price-label">
          <span>Monthly Rent</span>

          <small>
            {pricing.gstPercentage > 0
              ? `GST ${pricing.gstPercentage}% applicable`
              : "GST not applicable"}
          </small>
        </div>

        <strong>
          <FaRupeeSign />
          {formatMoney(
            pricing.monthlyRent
          )}
        </strong>
      </div>

      {/* BREAKDOWN */}

      <div className="rental-price-breakdown">

        {pricing.gstPercentage > 0 && (
          <div className="rental-price-row">
            <span>
              Monthly GST
            </span>

            <strong>
              ₹{formatMoney(pricing.monthlyGST)}
            </strong>
          </div>
        )}

        <div className="rental-price-row">
          <span>
            Monthly total
          </span>

          <strong>
            ₹{formatMoney(pricing.monthlyTotal)}
          </strong>
        </div>

        <div className="rental-price-row">
          <span>
            Security Deposit
          </span>

          <strong>
            ₹{formatMoney(
              pricing.securityDeposit
            )}
          </strong>
        </div>

      </div>

      {/* MINIMUM PERIOD */}

      <div className="rental-minimum-period">
        <FaCalendarAlt />

        <div>
          <span>
            Minimum rental period
          </span>

          <strong>
            {pricing.minimumMonths} months
          </strong>
        </div>
      </div>

      {/* ESTIMATE */}

      <div className="rental-estimate">

        <div className="rental-estimate-title">
          Minimum rental estimate
        </div>

        <div className="rental-estimate-row">
          <span>
            {pricing.minimumMonths} months rent
          </span>

          <strong>
            ₹{formatMoney(
              pricing.minimumRentalAmount
            )}
          </strong>
        </div>

        <div className="rental-estimate-row">
          <span>
            Security deposit
          </span>

          <strong>
            ₹{formatMoney(
              pricing.securityDeposit
            )}
          </strong>
        </div>

        <div className="rental-estimate-total">
          <span>
            Initial amount estimate
          </span>

          <strong>
            ₹{formatMoney(
              pricing.firstPayment
            )}
          </strong>
        </div>

      </div>

      {/* BUTTON */}

      <button
        type="button"
        className="rental-now-button"
        onClick={onRentNow}
        disabled={
          rentalProduct?.availableQuantity <= 0 ||
          rentalProduct?.isAvailableForRent === false
        }
      >
        <FaShieldAlt />

        Rent This Laptop
      </button>

      <p className="rental-price-disclaimer">
        Final rental amount and terms are confirmed
        by the rental system during request processing.
      </p>
    </div>
  );
};

export default RentalPricing;