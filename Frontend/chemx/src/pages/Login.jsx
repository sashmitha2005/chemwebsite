import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { axiosClient } from "../axios/AxiosSetup";

const Login = ({ setShowModal, setIsLogin, setShowAdminModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0); // Forgot Password Steps: 0 = none, 1 = email, 2 = otp, 3 = reset
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosClient.post("/login", {
          email,
          password,
        });

        alert("Login successful!");
        setShowModal(false);
        navigate("/products");
      } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowModal(false)}>
            &times;
          </button>

          <h3 className="modal-title">Login</h3>
          <form className="modal-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}

            <button type="submit">Login</button>
          </form>

          <p className="modal-toggle">
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Sign Up</span>
          </p>

          <p
            className="modal-toggle cursor-pointer text-blue-600 hover:underline mt-2"
            onClick={() => {
              setShowModal(false);
              setShowAdminModal(true);
            }}
          >
            Login as Admin
          </p>

          <p
            className="modal-toggle cursor-pointer text-blue-600 hover:underline mt-2"
            onClick={() => setStep(1)}
          >
            Forgot Password?
          </p>
        </div>
      </div>

      {step > 0 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setStep(0)}>
              &times;
            </button>

            {step === 1 && (
              <>
                <h3>Forgot Password - Step 1</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await axiosClient.post("/forgot-password", {
                        email: forgotEmail,
                      });
                      setForgotMessage(res.data.message);
                      setStep(2);
                    } catch (err) {
                      setForgotMessage(
                        err.response?.data?.error || "Error sending OTP"
                      );
                    }
                  }}
                >
                  Send OTP
                </button>
                <p>{forgotMessage}</p>
              </>
            )}

            {step === 2 && (
              <>
                <h3>Forgot Password - Step 2</h3>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await axiosClient.post("/verify-otp", {
                        email: forgotEmail,
                        otp,
                      });
                      setForgotMessage(res.data.message);
                      setStep(3);
                    } catch (err) {
                      setForgotMessage(
                        err.response?.data?.error || "OTP verification failed"
                      );
                    }
                  }}
                >
                  Verify OTP
                </button>
                <p>{forgotMessage}</p>
              </>
            )}

            {step === 3 && (
              <>
                <h3>Reset Password - Step 3</h3>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await axiosClient.post("/reset-password", {
                        email: forgotEmail,
                        otp,
                        newPassword,
                      });
                      setForgotMessage(res.data.message);
                      setTimeout(() => {
                        alert("Password updated. Please log in.");
                        setStep(0);
                        setShowModal(true); // reopen login modal
                      }, 1000);
                    } catch (err) {
                      setForgotMessage(
                        err.response?.data?.error || "Password reset failed"
                      );
                    }
                  }}
                >
                  Reset Password
                </button>
                <p>{forgotMessage}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
