import React from "react";
import { FaFlask, FaCubes, FaTools, FaWater, FaGasPump, FaSoap } from "react-icons/fa";
import "./OurProducts.css"; // Link to external CSS

// Sample data for product categories and products
const companyData = [
  {
    company: "Sree Rayalaseema Alkalies and Allied Chemicals Ltd & Hi-Strength Hypo Ltd.",
    products: [
      "Caustic Soda Lye / Flakes",
      "Caustic Potash Lye / Flakes",
      "Hydro Chloric Acid",
      "Liquid Chlorine GAS – In 900Kgs Tonner / 100 & 10 Kgs Baby Cylinder",
      "Sodium Hypo Chlorite",
      "Potassium Carbonate",
      "Glycerine – IP Grade / CP Grade",
      "Stearic Acid",
      "Soap Noodles",
      "12 Hydroxy Stearic Acid Flakes",
      "Bleaching Powder",
      "Sulphuric Acid",
      "Stable Bleaching Powder",
      "Calcium Hypochlorite 65% (Chlorine Granules)",
      "Ferric Alum / Non Ferric Alum",
      "Hydrogen Gas",
      "Monochloric Acetic Acid",
      "Oleum 23%",
    ],
  },
  {
    company: "Grasim Industries Ltd",
    products: [
      "Poly Aluminium Chloride - Powder 28% / Liquid – 10%,14% & 18%",
      "Sizing Chemicals for Textiles",
      "Polyelectrolyte & Decolourant for ETP",
    ],
  },
  {
    company: "MF Solutions / Resil Chemicals",
    products: [
      "Pre-treatment",
      "Enzymes",
      "Dyeing Chemicals",
      "Printing Chemicals",
      "Technical Textiles",
      "Fibre",
      "Optical Brightening Agent",
      "Sizing",
      "Polymer Dispersion",
    ],
  },
  {
    company: "Jaysynth Products",
    products: [
      "Reactive Dyes",
      "Polyester - Disperse Dyes",
      "Vat Dyes, Direct Dyes",
      "Solvent Dyes",
      "Pigments",
      "Vinyl Sulphone Dyes",
      "Ternix",
      "Digital Inks - Reactive / Solvent / Disperse",
      "Polyfunctional Dyes",
      "High Exhaust Dyes",
      "Monochloro Triazine Printing Dyes",
      "Dichloro Triazine Exhaust Dyes",
      "Super Exhaust Super Level Dyes",
      "Moderate Exhaust Super Level Dyes",
      "Bifunctional Dyes",
    ],
  },
  // Add more companies and products as needed
];

const OurProducts = () => {
  return (
    <div className="our-products">
      <div className="our-products-container">
        <h1 className="our-products-title">Our Products</h1>

        {companyData.map((company, index) => (
          <section className="company-section" key={index}>
            <h2 className="company-title">{company.company}</h2>

            <div className="products-grid">
              {company.products.map((product, i) => (
                <div className="product-card" key={i}>
                  <h3 className="product-title">{product}</h3>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default OurProducts;
