import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderPage.css"; // <-- Import the CSS file

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderDetails = {
      product: product,
      quantity: quantity,
      name: name,
      address: address,
      status: "Order Placed",
      price: calculatePrice(quantity),
    };

    console.log("Order confirmed:", orderDetails);

    navigate("/myorders", { state: { orderDetails } });
  };

  const calculatePrice = (quantity) => {
    return 100 * quantity;
  };

  return (
    <div className="order-container">
      <div className="order-box">
        <h1 className="order-title">Order Details for {product}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </div>
          <button type="submit" className="order-button">
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
