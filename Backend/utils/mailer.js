const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, otp) => {
  const companyName = "Southern Chemicals";
  const companyContact = "Contact us at southernchemicals@example.com or +91-9876543210";
  const companyAddress = "123 Industrial Road, Chennai, Tamil Nadu - 600001";

  const message = `
Hello,

Your One-Time Password (OTP) is: ${otp}

Please use this OTP to proceed with the verification process.

Regards,  
${companyName}  
${companyAddress}  
${companyContact}
`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${companyName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
  });
};

module.exports = sendEmail;
