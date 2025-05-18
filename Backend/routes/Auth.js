const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('../models/user');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/user.auth");
const adminAuth = require("../middleware/admin.auth");
const userAuth = require('../middleware/user.auth');
const crypto = require('crypto');

const router = express.Router();





// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

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
  const { id } = req.params;
  const { name, quantity, unit, price } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only update fields if they are provided
    if (name !== undefined) product.name = name;
    if (quantity !== undefined) product.quantity = quantity;
    if (unit !== undefined) product.unit = unit;
    if (price !== undefined) product.price = price;

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
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
// Get all orders (Admin only)
router.get('/adminorders', authMiddleware, async (req, res) => {
  try {
    // Fetch all orders from the database, populate relevant fields
    const orders = await Order.find()
      .populate('items.productId', 'name price')  // Populate product name and price
      .populate('userId', 'name email')  // Populate user name and email
      .sort({ orderDate: -1 });  // Sort orders by order date (descending)

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});




router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      from: `"Southern Chemicals" <${process.env.EMAIL_USER}>`,
      subject: 'Password Reset OTP - Southern Chemicals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #0e6ba8;">Southern Chemicals</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) to reset your password is:</p>
          <h3 style="color: #e63946;">${otp}</h3>
          <p>This OTP is valid for 1 hour. Please do not share it with anyone.</p>

          <hr />
          <p style="margin-top: 20px;">
            <strong>Southern Chemicals</strong><br />
            123 Industrial Road, Chennai, Tamil Nadu - 600001<br />
            Email: southernchemicals@example.com<br />
            Phone: +91-9876543210
          </p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error in /forgot-password:', err.message);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    const isOtpValid = user.resetPasswordToken === otp && user.resetPasswordExpires > Date.now();
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // ✅ Don't clear OTP here
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error('Error in /verify-otp:', err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.post('/reset-password', async (req, res) => {
  const { email, newPassword, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetPasswordToken !== otp || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ✅ Clear OTP after successful password reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error('Error in /reset-password:', err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
let otpStore = {};

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and expiry time (for your logic like storing in memory or DB)
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      from: `"Southern Chemicals" <${process.env.EMAIL_USER}>`,
      subject: 'Your OTP Code - Southern Chemicals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #0e6ba8;">Southern Chemicals</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #e63946;">${otp}</h3>
          <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>

          <hr />
          <p style="margin-top: 20px;">
            <strong>Southern Chemicals</strong><br />
            123 Industrial Road, Chennai, Tamil Nadu - 600001<br />
            Email: southernchemicals@example.com<br />
            Phone: +91-9876543210
          </p>
        </div>
      `,
    });

   res.status(200).json({ message: 'OTP sent to email', otp }); // Return OTP for frontend storage (only for testing)

  } catch (err) {
    console.error('Error in /send-otp:', err.message);
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
});
// Route to verify OTP for order
router.post("/order-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const storedOtpData = otpStore[email];

  if (!storedOtpData) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  const { otp: storedOtp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    delete otpStore[email]; // Clear expired OTP
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (otp !== storedOtp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // OTP is valid
  delete otpStore[email]; // Clear OTP after successful verification
  res.status(200).json({ message: "OTP verified successfully" });
});


module.exports = { router};



module.exports = router;
