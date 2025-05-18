import React from "react";
import { useLocation } from "react-router-dom";
import "./OrderBill.css"; // Assuming you have a CSS file for styles

const OrderBill = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <p>No order data found.</p>;

  const handleDownload = () => {
    window.print();
  };

  // Function to calculate GST (2%)
  const calculateGST = (price, quantity) => {
    return (price * quantity * 0.02).toFixed(2); // 2% GST
  };

  // Function to calculate total including GST
  const calculateTotalWithGST = (price, quantity) => {
    return (price * quantity + parseFloat(calculateGST(price, quantity))).toFixed(2);
  };

  return (
    <div
      className="bill-container"
      style={{
        padding: "30px",
        fontFamily: "'Roboto', sans-serif",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          borderBottom: "2px solid #2563eb",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        Invoice
      </h1>

      <h3 style={{ color: "#2563eb" }}>Customer Details</h3>
      <p><strong>Name:</strong> {order.userId.name}</p>
      <p><strong>Email:</strong> {order.userId.email}</p>
      <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

      <h3 style={{ color: "#2563eb", marginTop: "20px" }}>Order Items</h3>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          border: "1px solid #ddd",
          textAlign: "center",
        }}
      >
        <thead style={{ backgroundColor: "#2563eb", color: "white" }}>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>GST (2%)</th>
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
              <td>{calculateGST(item.productId?.price, item.quantity)}</td>
              <td>{calculateTotalWithGST(item.productId?.price, item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3
        style={{
          textAlign: "right",
          marginTop: "20px",
          fontWeight: "bold",
          color: "#2563eb",
        }}
      >
        Total: ₹{order.totalAmount}
      </h3>

      <h3
        style={{
          textAlign: "right",
          marginTop: "10px",
          color: "#333",
          fontStyle: "italic",
        }}
      >
        GST Included: ₹{(order.totalAmount * 0.02).toFixed(2)}
      </h3>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          paddingBottom: "30px",
        }}
      >
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Download Bill
        </button>
      </div>
    </div>
  );
};

export default OrderBill;
