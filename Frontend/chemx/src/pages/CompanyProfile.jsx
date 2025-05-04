import React from "react";
import './CompanyProfile.css';

import { FaFlask, FaIndustry, FaCogs, FaWater, FaCubes, FaShip, FaCheckCircle } from "react-icons/fa";

const chemicals = [
  {
    icon: <FaFlask />,
    title: "Dyes",
    description: "High-quality dyes for textile and industrial applications."
  },
  {
    icon: <FaIndustry />,
    title: "Bulk Chemicals",
    description: "Reliable supply of bulk chemicals for various industries."
  },
  {
    icon: <FaCogs />,
    title: "Specialty Chemicals",
    description: "Customized chemical solutions for specialized applications."
  },
  {
    icon: <FaWater />,
    title: "Water Treatment Chemicals",
    description: "Effective solutions for water purification and treatment."
  },
  {
    icon: <FaCubes />,
    title: "Pressure Vessels & Cylinders",
    description: "Safe and reliable containers for chemical storage and transport."
  },
  {
    icon: <FaShip />,
    title: "Glycerin & Allied Products",
    description: "High-purity glycerin and related chemical products."
  }
];


const CompanyProfile = () => {
  return (
    <div className="bg-white min-h-screen px-6 py-10 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <h2 className="custom-style">Company Profile</h2>

        <section className="company-vision">
      <div className="container">
        <h2 className="heading">
          Our <span className="highlight">Vision</span>
        </h2>
        <p className="description">
          Continue to grow and thrive as a privately-held global chemical company well into the 21st century.
        </p>
        <a href="#mission" className="cta-button">
          Our Mission <span className="arrow">→</span>
        </a>
      </div>
    </section>

    <section id="mission" className="company-mission">
  <div className="container">
    <h2 className="heading">
      Our <span className="highlight">Mission</span>
    </h2>
    <p className="description">
      Create value by offering customers the best chemical intermediates in the world. Quality is our promise and quantity is our assurance.
    </p>
    <a href="#overview" className="cta-button">
      Company Overview <span className="arrow">→</span>
    </a>
  </div>
</section>

<section id="overview" className="company-overview">
  <div className="container">
    <h2 className="heading">
      Company <span className="highlight">Overview</span>
    </h2>
    <p className="description">
      Since 1987, we've been leading the Karnataka chemicals market,
      serving industries like Pharmaceuticals, Textiles, Thermal Plants,
      Foundries, Water Treatment, and more.
    </p>
    <p className="description">
      We maintain long-term relationships with our suppliers and customers
      and are known for our reliability and high-quality services.
    </p>
    
  </div>
</section>

    <section className="chemicals-section">
      <div className="section-header">
        <h2>Our <span className="highlight">Chemicals</span></h2>
        <p>
          We provide a comprehensive range of high-quality chemical products to meet diverse industrial needs.
        </p>
      </div>
      <div className="chemicals-grid">
        {chemicals.map((item, index) => (
          <div className="chemical-card" key={index}>
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="customer-services-section">
      <div className="container">
        <h2>
          <span className="bold">Customer</span>{" "}
          <span className="highlight">Services</span>
        </h2>
        <p className="description">
          We monitor all supplies for compliance. Our customer service includes regulatory support and warehousing across India.
        </p>
        <ul className="service-list">
          <li><FaCheckCircle className="check-icon" /> 24/7 Emergency Services</li>
          <li><FaCheckCircle className="check-icon" /> Nationwide Warehousing</li>
          <li><FaCheckCircle className="check-icon" /> Regulatory Compliance Support</li>
        </ul>
      </div>
    </section>
      </div>
    </div>
  );
};

export default CompanyProfile;
