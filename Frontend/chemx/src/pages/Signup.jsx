import React, { useState } from "react";

const Signup = ({ setShowModal, setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // To show backend error

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Signup successful!");
          setShowModal(false);
        } else {
          setServerError(data.error || "Signup failed. Please try again.");
        }
      } catch (err) {
        setServerError("Server error. Please try again later.");
        console.error("Signup error:", err);
      }
    }
  };

  return (
    <div className="modal-content">
      <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
      <h3 className="modal-title">Signup</h3>
      <form className="modal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {serverError && <p className="error-text">{serverError}</p>}

        <button type="submit">Sign Up</button>
      </form>
      <div className="modal-toggle">
        Already have an account?{" "}
        <span onClick={() => setIsLogin(true)}>Log in</span>
      </div>
    </div>
  );
};

export default Signup;
