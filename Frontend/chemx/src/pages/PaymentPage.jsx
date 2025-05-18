import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();

  // Extract passed data from location.state or fallback to defaults
  const {
    amount: passedAmount = 500,
    customer = {},
  } = location.state || {};

  const [amount, setAmount] = useState(passedAmount);
  const [name, setName] = useState(customer.name || "");
  const [email, setEmail] = useState(customer.email || "");
  const [contact, setContact] = useState(customer.phone || "");

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = () => {
    if (!window.Razorpay) {
      alert("⚠️ Razorpay SDK not loaded. Please wait.");
      return;
    }

    if (!name || !email || !contact || amount <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const options = {
      key: "rzp_test_nt5GTCtjqpqi8E", // Replace with live key in production
      amount: amount * 100,
      currency: "INR",
      name: "Southern Chemicals",
      description: "Payment for services",
      image: "https://yourlogo.com/logo.png", // Optional logo
      handler: function (response) {
        alert("✅ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
        setAmount(500);
        setName("");
        setEmail("");
        setContact("");
        setIsModalOpen(false); // Close modal after success
      },
      prefill: {
        name,
        email,
        contact,
      },
      notes: {
        company: "Southern Chemicals",
      },
      theme: {
        color: "#1e3a8a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Close modal handler
  const closeModal = () => setIsModalOpen(false);

  // Inline styles for modal content and close button
  const modalContentStyle = {
    position: "relative",
    background: "white",
    borderRadius: "8px",
    padding: "2rem 1.5rem 1.5rem 1.5rem",
    maxWidth: "400px",
    margin: "auto",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#555",
    lineHeight: 1,
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" style={{ 
          position: "fixed", 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          zIndex: 9999,
        }}>
          <div className="modal-content payment-card" style={modalContentStyle}>
            <button
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
              style={closeBtnStyle}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-3">Make a Payment</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              style={{ display: "block", width: "100%", marginBottom: "15px", padding: "8px" }}
            />

            <button
              onClick={handleRazorpayPayment}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Pay ₹{amount}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
