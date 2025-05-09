import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { axiosClient } from "../axios/AxiosSetup";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    address: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        setLoading(false);
        return;
      }

      const response = await axiosClient.get("/viewcart");
      if (response.data.cart && response.data.cart.items) {
        const validItems = response.data.cart.items.filter((item) => item.productId);
        setCartItems(validItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axiosClient.delete(`/removecart/${productId}`);
      fetchCartItems();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
    }
  };

  const handleBuyNowClick = (item) => {
    setSelectedProduct(item);
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!userDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(userDetails.email.trim())) {
      errors.email = "Invalid email format";
    }

    if (!userDetails.name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(userDetails.name.trim())) {
      errors.name = "Name must contain only letters and spaces";
    }

    if (!userDetails.address.trim()) {
      errors.address = "Address is required";
    } else if (userDetails.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    if (!userDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(userDetails.phone.trim())) {
      errors.phone = "Phone number must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendOtp = async () => {
    try {
      const response = await axiosClient.post("/send-otp", {
        email: userDetails.email,
      });

      const generatedOtp = response.data.otp;

      if (generatedOtp) {
        localStorage.setItem("generatedOtp", generatedOtp); // Store OTP for test verification
        alert("OTP sent to your email");
        setOtpSent(true);
      } else {
        alert("Failed to receive OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    const storedOtp = localStorage.getItem("generatedOtp");

    try {
      await axiosClient.post("/order-otp", {
        email: userDetails.email,
        otp: storedOtp,
      });

      alert("✅ OTP verified successfully!");
      setOtpVerified(true);
      localStorage.removeItem("generatedOtp");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert(error.response?.data?.error || "OTP verification failed");
    }
  };

  const placeOrder = async (productToOrder = null) => {
    if (!otpVerified) {
      alert("Please verify OTP before placing the order.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const orderData = productToOrder
        ? [{
            productId: productToOrder.productId._id || productToOrder.productId,
            quantity: productToOrder.quantity,
          }]
        : cartItems.map((item) => ({
            productId: item.productId._id || item.productId,
            quantity: item.quantity,
          }));

      if (orderData.length === 0) {
        alert("No valid products to order.");
        return;
      }

      const response = await axiosClient.post(
        "/cartorder",
        {
          products: orderData,
          customer: userDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      alert("✅ Order placed successfully!");
      setCartItems([]);
      fetchCartItems();
      setShowForm(false);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setUserDetails({ email: "", name: "", address: "", phone: "" });
      setFormErrors({});
      navigate("/myorders", { state: { orders: response.data.orders } });
    } catch (error) {
      console.error("❌ Failed to place order:", error);
      alert(error.response?.data?.error || "Something went wrong while placing the order.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sendOtp();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtp();
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.quantity * (item.productId?.price || 0);
  }, 0);

  return (
    <div className="cart-container">
      <button
        onClick={() => navigate("/myorders")}
        className="my-orders-btn"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        My Orders
      </button>

      <h1 className="cart-heading">Your Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="empty-message">Your cart is empty!</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-card">
                <h2>{item.productId.name || "Unnamed Product"}</h2>
                <p>Price: ₹{item.productId.price || "N/A"}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(index)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(index)}>+</button>
                </div>
                <div className="button-group">
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.productId._id || item.productId)}
                  >
                    Remove
                  </button>
                  <button
                    className="buy-btn"
                    onClick={() => handleBuyNowClick(item)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="total-amount">Total Amount: ₹{totalAmount}</div>

          <div className="place-order">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
            >
              Place All Orders
            </button>
          </div>
        </>
      )}

      <div className="back-btn">
        <button onClick={() => window.history.back()}>← Back to Products</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleFormSubmit} className="modal-form">
            <h2>Confirm Order</h2>

            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}

            <input
              type="text"
              placeholder="Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            />
            {formErrors.name && <span className="error">{formErrors.name}</span>}

            <input
              type="text"
              placeholder="Address"
              value={userDetails.address}
              onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
            />
            {formErrors.address && <span className="error">{formErrors.address}</span>}

            <input
              type="tel"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
            />
            {formErrors.phone && <span className="error">{formErrors.phone}</span>}

            {otpSent && (
              <div className="otp-input">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleOtpSubmit}>Verify OTP</button>
              </div>
            )}

            <div className="modal-buttons">
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              {







otpVerified ? (
<button type="button" onClick={() => placeOrder(selectedProduct || null)}>Place Order</button>
) : (
<button type="submit">Send OTP</button>
)}
</div>
</form>
</div>
)}
</div>
);
};

export default Cart;