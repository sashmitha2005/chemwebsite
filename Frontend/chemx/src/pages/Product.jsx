import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";

const ProductPage = () => {
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://chemwebsite.onrender.com/view", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, productName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post(
        "https://chemwebsite.onrender.com/addcart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartCount(cartCount + 1);
      setCartMessage(`${productName} added to cart!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setCartMessage("Failed to add item to cart");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const handleBuyNow = (productName) => {
    navigate("/order", { state: { product: productName } });
  };

  const navigateToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="product-wrapper">
      <div className="cart-icon" onClick={navigateToCart}>
        🛒 {cartCount}
      </div>

      {cartMessage && <div className="cart-popup">{cartMessage}</div>}

      <div className="product-container">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product, index) => (
            <div className="product-card" key={index}>
              <p className="product-name">{product.name}</p>
              <p className="product-quantity">Quantity: {product.quantity}</p>
              <p className="product-price">Price: Rs.{product.price}</p>
              <p className="product-unit">Unit: {product.unit}</p>
              <div className="product-buttons">
                <button
                  className="add-to-cart"
                  onClick={() =>
                    handleAddToCart(product._id, product.name)
                  }
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now"
                  onClick={() => handleBuyNow(product.name)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPage;
