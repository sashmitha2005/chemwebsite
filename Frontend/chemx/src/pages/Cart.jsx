import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; // Link to external CSS

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

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

      const response = await axios.get("https://chemwebsite.onrender.com/viewcart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.cart && response.data.cart.items) {
        setCartItems(response.data.cart.items);
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
      const token = localStorage.getItem("token");
      await axios.delete(`https://chemwebsite.onrender.com/removecart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const placeOrder = async (productToOrder = null) => {
    try {
      const token = localStorage.getItem("token");

      const orderData = productToOrder
        ? [
            {
              productId: productToOrder.productId._id || productToOrder.productId,
              quantity: productToOrder.quantity,
            },
          ]
        : cartItems
            .filter((item) => item.productId)
            .map((item) => ({
              productId: item.productId._id || item.productId,
              quantity: item.quantity,
            }));

      if (orderData.length === 0) {
        alert("No valid products to order.");
        return;
      }

      const response = await axios.post(
        "https://chemwebsite.onrender.com/cartorder",
        { products: orderData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Order placed successfully!");
      setCartItems([]);
      fetchCartItems();
      setShowForm(false);
      navigate("/myorders", { state: { orders: response.data.orders } });
    } catch (error) {
      console.error("❌ Failed to place order:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Something went wrong while placing the order.");
      }
    }
  };

  const increaseQuantity = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += 1;
    setCartItems(updatedItems);
  };

  const decreaseQuantity = (index) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setCartItems(updatedItems);
    }
  };

  const handleBuyNowClick = (item) => {
    setSelectedProduct(item);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    placeOrder(selectedProduct);
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    if (item.productId && item.productId.price) {
      return acc + item.quantity * item.productId.price;
    }
    return acc;
  }, 0);

  return (
    <div className="cart-container">
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
                {item.productId ? (
                  <>
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
                        onClick={() =>
                          removeItem(item.productId._id || item.productId)
                        }
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
                  </>
                ) : (
                  <p className="invalid-product">Invalid product in cart.</p>
                )}
              </div>
            ))}
          </div>

          <div className="total-amount">
            Total Amount: ₹{totalAmount}
          </div>

          <div className="place-order">
            <button onClick={() => placeOrder()}>Place All Orders</button>
          </div>
        </>
      )}

      <div className="back-btn">
        <button onClick={() => window.history.back()}>
          ← Back to Products
        </button>
      </div>

      {showForm && selectedProduct && (
        <div className="modal-overlay">
          <form onSubmit={handleFormSubmit} className="modal-form">
            <h2>Confirm Order</h2>
            <p>
              Product:{" "}
              <span className="product-name">
                {selectedProduct.productId?.name}
              </span>
            </p>
            <input
              type="text"
              placeholder="Name"
              required
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={userDetails.address}
              onChange={(e) =>
                setUserDetails({ ...userDetails, address: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={userDetails.phone}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit">Confirm Order</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cart;
