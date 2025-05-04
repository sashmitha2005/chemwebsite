import React from "react";
import "./Contact.css";

const contactData = [
  {
    id: 1,
    title: "Office Address",
    lines: [
      "SOUTHERN CHEMICALS",
      "17, 6th CROSS 40 FEET ROAD,",
      "MANJUNATH NAGAR, WEST OF CHORD ROAD,",
      "BANGALORE -560010",
      "TEL: 080 23303137 / 29773137",
      "Mobile: 9901621531 / 9341262065 / 9341250531",
      "Email: anupamajoshi@southernchem.in, ",
      "blr.act@southernchemicalsindia.com, ",
      "anupama@southernchemicalsindia.com, ",
      " Asha@southernchemicalsindia.com, ",
      "ameya@southernchemicalsindia.com",
    ]
  },
  {
    id: 2,
    title: "Southern Chemicals – Mumbai",
    lines: [
      "SOUTHERN CHEMICALS",
      "45, MANGAL MURTHY HOUSING SOCIETY,",
      "B CABIN ROAD, WADAWALI SECTION,",
      "AMBARNATH, MUMBAI, MAHARASHTRA – 421501",
      "Mob: 9323202684",
      "Email: gore@southernchemicalsindia.com"
    ]
  },
  {
    id: 3,
    title: "Southern Chemicals – Erode",
    lines: [
      "SOUTHERN CHEMICALS",
      "Sengodapalayam RSR No 206/1234,",
      "Villrasampatti Nall Road Opp. to Coral Rewiding,",
      "Erode - 638102",
      "Mob: 7871143333",
      "Email: Dhanapal@southernchemicalsindia.com"
    ]
  },
  {
    id: 4,
    title: "Marketing Office Address",
    lines: [
      "SOUTHERN CHEMICALS",
      "4928, HIGH POINT IV, 11TH FLOOR,",
      "45/1, PALACE ROAD, BANGALORE – 560 001",
      "TEL: 080 22268722, 080 22281135",
      "Mobile: 9341262065 / 9845301065",
      "Email: Anurag@southernchemicalsindia.com",
      "Email: deepak@southernchemicalsindia.com"
    ]
  },
  {
    id: 5,
    title: "Logistic Support",
    lines: [
      "SOUTHERN ROADLINES",
      "17, 6th CROSS 40 FEET ROAD,",
      "MANJUNATH NAGAR, WEST OF CHORD ROAD,",
      "BANGALORE -560010",
      "TEL: 080 23303137",
      "Mobile: 9341262107",
      "Email: Bhima@southernchemicalsindia.com",
      "Email: srlblr786@gmail.com"
    ]
  },
  {
    id: 6,
    title: "Factory Address",
    lines: [
      "SOUTHERN AGRO INDUSTRIES",
      "438, KIADB INDL. AREA,",
      "CHIKKABALLAPUR -562101",
      "Tel: 08156-200083",
      "Mobile: 9341262065",
      "Email: Ameya@southernchemicalsindia.com",
      "Email: mahesh@southernchemicalsindia.com"
    ]
  }
];

const Contact = () => {
  return (
    <div className="about-container">
       <header className="navbar">
      <div className="navbar-brand">Contact Us</div>
      
    </header>

      <div className="contact-grid">
        {contactData.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="contact-card">
            <h2><span className="highlight">{section.id}</span>. {section.title}</h2>
            {section.lines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
