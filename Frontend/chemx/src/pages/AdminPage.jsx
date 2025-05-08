  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import "./AdminPage.css";
  import { axiosClient } from "../axios/AxiosSetup";

  const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
      name: "",
      quantity: "",
      unit: "",
      price: "",
      image: "",
    });
    const [productToDelete, setProductToDelete] = useState("");
    const [productToUpdate, setProductToUpdate] = useState({
      id: "",
      name: "",
      quantity: "",
      unit: "",
      price: "",
    });
    const [formType, setFormType] = useState(null); // 'add', 'update', 'delete'

    const navigate = useNavigate();

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await axiosClient.get("/view"); 
          
            // added
          

          if (response.data && Array.isArray(response.data.products)) {
            setProducts(response.data.products);
          } else {
            setProducts([]);
            console.error("Products not in expected format:", response.data);
          }
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        }
      };

      fetchProducts();
    }, []);
    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result }); // Base64
    };
    if (file) reader.readAsDataURL(file);
  }}
/>


const handleAddProduct = async () => {
  try {
    const response = await axiosClient.post("/add", newProduct);
    setProducts([...products, response.data.product]);
    setNewProduct({ name: "", quantity: "", unit: "", price: "", image: "" });
    setFormType(null);
  } catch (error) {
    console.error("Failed to add product:", error);
  }
};


    const handleDeleteProduct = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        await axiosClient.delete(`/remove/${productToDelete}`)
          // added
        
        
        
        setProducts(products.filter((product) => product._id !== productToDelete));

        setProductToDelete("");
        setFormType(null);
      } catch (error) {
        console.error("Failed to remove product:", error);
      }
    };

    const handleUpdateProduct = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axiosClient.put(
          `/update/${productToUpdate.id}`,
          productToUpdate,
          
        );
        
        setProducts(
          products.map((product) =>
            product._id === productToUpdate.id ? response.data.product : product
          )
        );
        setProductToUpdate({ id: "", name: "", quantity: "", unit: "", price: "" });
        setFormType(null);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    };

    return (
      <div className="admin-page-container">
        {/* Title */}
        <h2 className="admin-title">Admin  - Product Management</h2>

        {/* Vertical Navbar */}
        <div className="vertical-navbar">
          <button className="navbar-btn add-btn" onClick={() => setFormType("add")}>
            +
          </button>
          <button className="navbar-btn update-btn" onClick={() => setFormType("update")}>
            🔄
          </button>
          <button className="navbar-btn delete-btn" onClick={() => setFormType("delete")}>
            ❌
          </button>
          <button className="navbar-btn myorders-btn" onClick={() => navigate("/myorders")}>
            📦 
          </button>
          <button
    className="navbar-btn dashboard-btn"
    onClick={() => navigate("/admindashboard")}
  >
    📊
  </button>

        </div>

        {/* Product Cards */}
        <div className="admin-product-container">
          {products.length === 0 ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-grid">
              {products.map((product, index) => (
                <div className="product-card" key={index}>
                  <p className="product-name">{product.name}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">Price:${product.price}</p>
                  <p className="product-category">Quantity:{product.quantity}</p>
                  <p className="product-category">Unit:{product.unit}</p>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Modal for Add */}
{formType === "add" && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-btn" onClick={() => setFormType(null)}>✖</button>
      <h3>Add New Product</h3>

      <input type="text" placeholder="Name" value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
      <input type="number" placeholder="Quantity" value={newProduct.quantity}
        onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} />
      <input type="text" placeholder="Unit" value={newProduct.unit}
        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} />
      <input type="number" placeholder="Price" value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

      {/* Image Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewProduct({ ...newProduct, image: reader.result }); // Base64 string
          };
          if (file) reader.readAsDataURL(file);
        }}
      />

      {/* Optional: Preview uploaded image */}
      {newProduct.image && (
        <img
          src={newProduct.image}
          alt="Preview"
          style={{ width: "100px", marginTop: "10px" }}
        />
      )}

      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  </div>
)}


        {/* Modal for Update */}
        {formType === "update" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setFormType(null)}>✖</button>
              <h3>Update Product</h3>
              <input type="text" placeholder="Product ID to update" value={productToUpdate.id}
                onChange={(e) => setProductToUpdate({ ...productToUpdate, id: e.target.value })} />
              <input type="text" placeholder="Name" value={productToUpdate.name}
                onChange={(e) => setProductToUpdate({ ...productToUpdate, name: e.target.value })} />
              <input type="number" placeholder="Quantity" value={productToUpdate.quantity}
                onChange={(e) => setProductToUpdate({ ...productToUpdate, quantity: e.target.value })} />
              <input type="text" placeholder="Unit" value={productToUpdate.unit}
                onChange={(e) => setProductToUpdate({ ...productToUpdate, unit: e.target.value })} />
              <input type="number" placeholder="Price" value={productToUpdate.price}
                onChange={(e) => setProductToUpdate({ ...productToUpdate, price: e.target.value })} />
              <button onClick={handleUpdateProduct}>Update</button>
            </div>
          </div>
        )}

        {/* Modal for Delete */}
        {formType === "delete" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setFormType(null)}>✖</button>
              <h3>Delete Product</h3>
              <input type="text" placeholder="Product ID to delete" value={productToDelete}
                onChange={(e) => setProductToDelete(e.target.value)} />
              <button onClick={handleDeleteProduct}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AdminPage;
