// src/components/OrderBill.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const OrderBill = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <p>No order data found.</p>;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="bill-container" style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Invoice</h1>
      <hr />
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> {order.userId.name}</p>
      <p><strong>Email:</strong> {order.userId.email}</p>
      <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

      <h3 style={{ marginTop: "20px" }}>Order Items</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productId?.name || "Unnamed"}</td>
              <td>{item.quantity}</td>
              <td>{item.productId?.price}</td>
              <td>{item.productId?.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ textAlign: "right", marginTop: "20px" }}>Total: ₹{order.totalAmount}</h3>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={handleDownload} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px" }}>
          Download Bill
        </button>
      </div>
    </div>
  );
};

export default OrderBill;
