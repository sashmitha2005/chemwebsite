import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-detail">
        <h2>Welcome to <span className="highlight">Southern Chemicals</span></h2>
        <p>
          Since 1987, Southern Chemicals has been at the forefront of the Karnataka chemicals market—
          constantly evolving to serve the Pharmaceutical, Textile Industry, Water Treatment Plants,
          Government Sectors, Thermal Plants, Paper Industries, Foundries, and Oil Industries.
          We have developed long-standing relationships with our suppliers and customers and pride
          ourselves on the reliable and high-quality services we provide.
        </p>
      </section>

      <section className="about-detail">
        <h2>Southern <span className="highlight">Roadlines</span></h2>
        <p>
          With over 25 years of experience, Southern Roadlines has remained a trusted leader in Karnataka's
          powerful transportation sector. We operate dozens of trucks and tankers, including:
        </p>
        <ul>
          <li>Steel tankers for petroleum products</li>
          <li>Rubber-lined tankers for hazardous chemicals</li>
          <li>Specialized trucks for hazardous materials</li>
          <li>Dedicated containers for liquid chlorine</li>
        </ul>
      </section>

      <section className="about-detail">
        <h2>Safety & <span className="highlight">Training</span></h2>
        <p>
          Our dedicated safety team conducts specialized training programs to prepare for all eventualities.
          We also demonstrate and conduct safety drills for customer shop floor staff. Our offerings include:
        </p>
        <ul>
          <li>On-site training programs</li>
          <li>Equipment supply with safety precautions</li>
          <li>Live safety demonstrations</li>
        </ul>
      </section>

      <section className="about-detail">
        <h2>Quality <span className="highlight">Credentials</span></h2>
        <p>
          Southern Chemicals ensures that all supplied products come with proper documentation and certifications.
          We provide:
        </p>
        <ul>
          <li>MSDS Data Sheets from Resil, Jaysynth, Sree Rayalaseema Alkalies and Allied Chemicals Ltd, Sree Rayalaseema Hi-strength Ltd, Venlon Enterprises, and Grasim Industries</li>
          <li>Certified Quality Certificates for all supplied chemicals</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;