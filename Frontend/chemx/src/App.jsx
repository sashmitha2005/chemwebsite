// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompanyProfile from './pages/CompanyProfile';
import OurProducts from './pages/OurProducts';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ProductPage from './pages/Product'; // ✅ Import the product page
import Cart from './pages/Cart'; // ✅ Import the cart page
import OrderPage from './pages/OrderPage'; // ✅ Import the order page
import MyOrdersPage from './pages/MyOrders'; // ✅ Import the my orders page
import Login from './pages/Login';
import AdminPage from "./pages/AdminPage";
import OrderBill from "./pages/OrderBill";
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/our-products" element={<OurProducts />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/products" element={<ProductPage />} /> {/* ✅ Added route for products */}
        <Route path="/cart" element={<Cart />} /> {/* ✅ Added route for cart */}
        <Route path="/order" element={<OrderPage />} /> {/* ✅ Added route for order */}
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminPage" element={<AdminPage />} /> 
        <Route path="/bill" element={<OrderBill />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        

         
{/* ✅ Added route for my orders */}
      </Routes>
    </Router>
  );
}

export default App;
