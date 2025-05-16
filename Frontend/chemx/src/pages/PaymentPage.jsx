import React, { useEffect, useState } from "react";

export default function PaymentPage() {
  const [amount, setAmount] = useState(500);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

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

  return (
    <div className="flex min-h-screen bg-blue-100">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Make a Payment</h2>
          <p className="mb-4">Fill in your details and payment amount:</p>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md mb-3"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md mb-3"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-blue-300 rounded-md mb-4"
            min={1}
          />

          <button
            onClick={handleRazorpayPayment}
            className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Pay ₹{amount}
          </button>
        </div>
      </div>
    </div>
  );
}
