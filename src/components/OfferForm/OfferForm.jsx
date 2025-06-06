import React, { useState } from "react";
import axios from "axios";
import "./OfferForm.css";

const OfferForm = () => {
  const [formData, setFormData] = useState({
    code: "",
    offerType: "percentage",
    value: "",
    description: "",
    startDate: "",
    endDate: "",
    eligibleProducts: "",
    active: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://silksew-back-1.onrender.com/api/offer/create-offer", formData);
      alert("Offer Created Successfully!");
      setFormData({
        code: "",
        offerType: "percentage",
        value: "",
        description: "",
        startDate: "",
        endDate: "",
        eligibleProducts: "",
        active: true,
      });
    } catch (error) {
      console.error("Error creating offer", error);
    }
  };

  return (
    <div className="offer-form">
      <h2>Create Offer</h2>
      <form onSubmit={handleSubmit}>
        <label>Code:</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />

        <label>Offer Type:</label>
        <select
          name="offerType"
          value={formData.offerType}
          onChange={handleChange}
          required
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>

        <label>Value:</label>
        <input
          type="number"
          name="value"
          value={formData.value}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        {/* <label>Eligible Products (comma-separated IDs):</label>
        <input
          type="text"
          name="eligibleProducts"
          value={formData.eligibleProducts}
          onChange={handleChange}
        /> */}

        <label>
          Active:
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={() =>
              setFormData({ ...formData, active: !formData.active })
            }
          />
        </label>

        <button type="submit">Create Offer</button>
      </form>
    </div>
  );
};

export default OfferForm;
