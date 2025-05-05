import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://chemwebsite.onrender.com/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const goToBillPage = (order) => {
    navigate("/bill", { state: { order } });
  };

  return (
    <div className="my-orders-container">
      <h1 className="orders-heading">My Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders to display.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h2 className="order-title">Order Confirmed</h2>

              {/* User Details */}
              <div className="user-details">
                <p><strong>User Name:</strong> {order.userId.name}</p>
                <p><strong>Email:</strong> {order.userId.email}</p>
              </div>

              {/* Order Items */}
              <div className="order-items-grid">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <p><strong>Product:</strong> {item.productId?.name || "Unnamed Product"}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ₹{item.productId?.price || "N/A"}</p>
                  </div>
                ))}
              </div>

              {/* Order Status & Total Amount */}
              <div className="order-status-total">
                <p><strong>Status:</strong> {order.status || "Placed"}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              </div>

              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

              <button
                className="generate-bill-btn"
                onClick={() => goToBillPage(order)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Generate Bill
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
