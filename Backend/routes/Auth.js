const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('../models/user');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const authMiddleware = require("../middleware/user.auth");
const adminAuth = require("../middleware/admin.auth");
const userAuth = require('../middleware/user.auth');

const router = express.Router();



// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route - session-based login
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });


    // Store user data in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ message: "Login successful" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" });
  }
});

// Admin login
router.post('/adminlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ error: "Admin not found" });

    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({ message: "Admin login successful" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add product (Admin only)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, quantity, unit, price, image } = req.body;

    if (!name || quantity == null || price == null || !image) {
      return res.status(400).json({ error: "Please provide name, quantity, price, and image" });
    }

    const newProduct = new Product({
      adminId: req.userId,
      name,
      quantity,
      unit,
      price,
      image, // Save base64 string
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add product" });
  }
});


// Add to cart (User only)
router.post('/addcart', userAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({ error: "Please provide productId and quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    const cartItem = {
      productId: product._id,
      name: product.name,
      quantity,
      unit: product.unit,
      price: product.price
    };

    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        items: [cartItem]
      });
    } else {
      const existingIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push(cartItem);
      }
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// View Cart (User only)
router.get("/viewcart", userAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    if (!cart) return res.status(200).json({ cart: { items: [] } });

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
});

// User Profile (User only)
router.get('/userprofile', userAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("name email");
  res.json(user);
});

// Remove item from cart (User only)
router.delete('/removecart/:productId', userAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.items.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

// Place order from cart (User only)
router.post('/cartorder', userAuth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided to place an order" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let productRequest of products) {
      const { productId, quantity } = productRequest;

      if (!productId || quantity == null || quantity <= 0) {
        return res.status(400).json({ error: "Invalid productId or quantity" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }

      product.quantity -= quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity,
        unit: product.unit,
        price: product.price,
        totalPrice: product.price * quantity
      });

      totalAmount += product.price * quantity;
    }

    const order = new Order({
      userId: req.userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      orderDate: new Date(),
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orders: order.items.map(item => ({
        product: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        status: order.status,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.delete('/remove/:id', userAuth, async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOne({ _id: productId, adminId: req.userId });

    if (!product) {
      return res.status(404).json({ error: "Product not found or not authorized to delete" });
    }

    await Product.deleteOne({ _id: productId });

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product" });
  }
});

// Backend: Express.js route for updating a product
router.put('/update/:id', async (req, res) => {
  const { id } = req.params; // Get product ID from URL
  const { name, quantity, unit, price } = req.body; // Get updated product details from the request body

  try {
    const product = await Product.findById(id); // Look for the product by its ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product
    product.name = name;
    product.quantity = quantity;
    product.unit = unit;
    product.price = price;

    await product.save(); // Save the updated product

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product: ' + error.message });
  }
});







// Get user orders (User only)
router.get('/myorders', userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId', 'name price')
      .populate('userId', 'name email')
      .sort({ orderDate: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout (session-based)
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});
router.get('/view', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().populate('adminId', 'name email');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

module.exports = router;
