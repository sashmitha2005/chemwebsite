import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { axiosClient } from "../axios/AxiosSetup";

const Login = ({ setShowModal, setIsLogin, setShowAdminModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
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
          email, password
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
      </div>
    </div>
  );
};

export default Login;
