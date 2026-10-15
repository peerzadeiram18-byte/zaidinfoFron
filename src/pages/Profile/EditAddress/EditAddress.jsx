import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./EditAddress.css";

import api from "../../../api/axios";
import { getAddresses } from "../../../services/addressService";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  landmark: "",
  type: "Home",
};

// fields that should only ever contain digits
const DIGIT_FIELDS = ["phone", "pincode"];

const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ===========================
  // Load the address being edited
  // ===========================

  useEffect(() => {
    const loadAddress = async () => {
      try {
        setLoading(true);

        const res = await getAddresses();
        const list = res.data.data || [];

        const address = list.find((item) => item._id === id);

        if (!address) {
          toast.error("Address not found");
          navigate("/my-address");
          return;
        }

        setFormData({
          fullName: address.fullName || "",
          phone: address.phone || "",
          addressLine: address.addressLine || "",
          city: address.city || "",
          state: address.state || "",
          pincode: address.pincode || "",
          country: address.country || "India",
          landmark: address.landmark || "",
          type: address.type || "Home",
        });
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Unable to load address"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAddress();
  }, [id, navigate]);

  // ===========================
  // Handle input change
  // ===========================

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (DIGIT_FIELDS.includes(name)) {
      value = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ===========================
  // Validation
  // ===========================

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Enter the full name";
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a 10-digit phone number";
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Enter the house number, street and area";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Enter the city";
    }

    if (!formData.state.trim()) {
      newErrors.state = "Enter the state";
    }

    if (!/^\d{6}$/.test(String(formData.pincode).trim())) {
      newErrors.pincode = "Enter a 6-digit pincode";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Enter the country";
    }

    setErrors(newErrors);

    // move focus to the first field with a problem
    const firstInvalid = Object.keys(newErrors)[0];
    if (firstInvalid) {
      document.getElementById(`ea-${firstInvalid}`)?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // Submit
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      await api.put(`/addresses/${id}`, {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine: formData.addressLine.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: String(formData.pincode).trim(),
        country: formData.country.trim(),
        landmark: formData.landmark.trim(),
        type: formData.type,
      });

      toast.success("Address updated successfully");
      navigate("/my-address");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Unable to update address"
      );
    } finally {
      setSaving(false);
    }
  };

  // small helpers so every field wires up labels and errors the same way
  const fieldProps = (name) => ({
    id: `ea-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `ea-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <p className="ea-error" id={`ea-${name}-error`} role="alert">
        {errors[name]}
      </p>
    ) : null;

  if (loading) {
    return (
      <div className="edit-address-page">
        <div className="edit-address-card">
          <p className="ea-loading" role="status">
            Loading address...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-address-page">
      <div className="edit-address-card">
        <div className="edit-address-head">
          <h2>Edit address</h2>
          <p>Update where your orders should be delivered.</p>
        </div>

        <form className="edit-address-form" onSubmit={handleSubmit} noValidate>
          <div className="ea-field">
            <label htmlFor="ea-fullName">Full name</label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Name on the delivery"
              {...fieldProps("fullName")}
            />
            {renderError("fullName")}
          </div>

          <div className="ea-field">
            <label htmlFor="ea-phone">Phone number</label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="10-digit mobile number"
              {...fieldProps("phone")}
            />
            {renderError("phone")}
          </div>

          <div className="ea-field ea-field--full">
            <label htmlFor="ea-addressLine">Address</label>
            <textarea
              autoComplete="street-address"
              placeholder="House number, street, area"
              {...fieldProps("addressLine")}
            />
            {renderError("addressLine")}
          </div>

          <div className="ea-field">
            <label htmlFor="ea-city">City</label>
            <input
              type="text"
              autoComplete="address-level2"
              placeholder="City"
              {...fieldProps("city")}
            />
            {renderError("city")}
          </div>

          <div className="ea-field">
            <label htmlFor="ea-state">State</label>
            <input
              type="text"
              autoComplete="address-level1"
              placeholder="State"
              {...fieldProps("state")}
            />
            {renderError("state")}
          </div>

          <div className="ea-field">
            <label htmlFor="ea-pincode">Pincode</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="6-digit pincode"
              {...fieldProps("pincode")}
            />
            {renderError("pincode")}
          </div>

          <div className="ea-field">
            <label htmlFor="ea-country">Country</label>
            <input
              type="text"
              autoComplete="country-name"
              placeholder="Country"
              {...fieldProps("country")}
            />
            {renderError("country")}
          </div>

          <div className="ea-field ea-field--full">
            <label htmlFor="ea-landmark">
              Landmark <span className="ea-optional">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Near a shop, school or building"
              {...fieldProps("landmark")}
            />
          </div>

          <div className="ea-field ea-field--full">
            <label htmlFor="ea-type">Address type</label>
            <select {...fieldProps("type")}>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="ea-actions">
            <button
              type="button"
              className="ea-btn ea-btn--ghost"
              onClick={() => navigate("/my-address")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ea-btn ea-btn--primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;