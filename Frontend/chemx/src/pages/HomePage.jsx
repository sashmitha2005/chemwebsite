import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import "./Home.css";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);
  const closeAdminModal = () => setShowAdminModal(false);

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("https://chemwebsite.onrender.com/adminlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("adminToken", data.token);
        alert("Admin logged in successfully");
        setShowAdminModal(false);
        navigate("/adminpage");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
              Southern Chemicals
            </h1>
          </div>
          <div className="navbar-right">
            <ul className="flex space-x-8 text-lg items-center">
              {["Company profile", "Our Products", "About", "Contact Us"].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-blue-600 transition duration-200 font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={() => setShowModal(true)} className="login-button">
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-blue-800 leading-tight drop-shadow-md">
            Southern Chemicals
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver top-quality chemicals
          </p>
        </div>
      </section>

      {/* Modal for User Login/Signup */}
      {showModal && (
        <div className="modal-overlay">
          {isLogin ? (
            <Login
              setShowModal={handleCloseModal}
              setIsLogin={setIsLogin}
              setShowAdminModal={setShowAdminModal}
            />
          ) : (
            <Signup setShowModal={handleCloseModal} setIsLogin={setIsLogin} />
          )}
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-icon" onClick={closeAdminModal}>
              &times;
            </span>
            <h2 className="modal-title">Admin Login</h2>
            {error && <p className="error-text">{error}</p>}
            <input
              type="email"
              placeholder="Admin Email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="modal-button" onClick={handleAdminLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
