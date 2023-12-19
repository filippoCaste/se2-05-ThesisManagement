import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { isEmailInputValid } from "../utils/utils.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "thesisadmmanagement@gmail.com",
    pass: "nzcbfernygmhzklv",
    //clientId: process.env.OAUTH_CLIENT_ID,
    //clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    //accessToken: process.env.OAUTH_ACCESS_TOKEN
  }
});

export const sendEmail = async (receiver, subject, htmlContent) => {
  const mailOptions = {
    from: {
      name: "Thesis Management",
      address: "thesisadmmanagement@gmail.com"
    },
    to: receiver,
    subject: subject,
    html: htmlContent,
    attachments: [],
  };

  try {
    if(!receiver || !subject || !htmlContent || !isEmailInputValid([receiver])) throw new Error("invalid settins for email sending");
    
    transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.log(error);
  }
};

// Example usage:
// sendMail("bruno2001@hotmail.it", "Send test", "HELLO", "<b>Hello</b>");
