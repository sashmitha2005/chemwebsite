const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/Auth');

const app = express();

app.use(cors({credentials:true,origin:"https://chemwebsite-sfu7.vercel.app"}));
app.use(session({
  name: 'sessionId',
  secret: 'your-secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,        // Prevent JavaScript access – keep as true
    secure: false,          // Send only over HTTPS
    sameSite: 'none',      // Allow cross-site cookies (e.g., if frontend and backend are on different domains)
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  },
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
    