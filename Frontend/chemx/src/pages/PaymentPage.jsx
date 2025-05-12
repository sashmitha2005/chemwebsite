import React, { useState } from "react";


export default function PaymentPage() {
  const [amount, setAmount] = useState(500); // Default ₹500

  const handleRazorpayPayment = () => {
    const options = {
      key: "rzp_test_nt5GTCtjqpqi8E",
      amount: amount * 100,
      currency: "INR",
      name: "Southern Chemicals",
      description: "Payment for services",
      image: "https://yourlogo.com/logo.png",
      handler: function (response) {
        alert("✅ Payment Successful!");
        alert("Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Srisuthi P",
        email: "srisuthi@gmail.com",
        contact: "9876543210"
      },
      notes: {
        company: "Southern Chemicals",
      },
      theme: {
        color: "#1e3a8a"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex min-h-screen bg-blue-100">


      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Make a Payment</h2>
          <p className="mb-4">Enter the amount you wish to pay:</p>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-blue-300 rounded-md mb-4 text-center"
            min={1}
          />

          <button
            onClick={handleRazorpayPayment}
            className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Pay ₹{amount}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Or use your payment link: <br />
            <a
              href="https://rzp.io/rzp/m0HdBj3h"
              className="text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              razorpay.me/@srisuthipalanisamy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
