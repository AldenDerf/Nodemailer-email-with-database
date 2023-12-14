// Load required modules and environment variables
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Import the EmailModel and saveEmailToDB function
const { EmailModel, saveEmailToDB } = require("../Models/EmailModels"); 


// Retrieve credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Create an OAuth2 client with Google API credentials
const oAuth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// Controller to send emails using Nodemailer
const sendEmailController = async (req, res, next) => {
  try {
    // Extract required fields from the request body
    const { to, subject, html, attachments } = req.body;

    // Check for missing required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Set OAuth credentials using the refresh token
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Retrieve the access token for authentication
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();

    // Create a Nodemailer transporter with OAuth2 authentication
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MY_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Define mail options for the email
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to,
      subject,
      html,
      attachments,
    };

    // Send the email using the Nodemailer transport
    await transport.sendMail(mailOptions);

    // Save a copy of the email data to MongoDB using the EmailModel
    await saveEmailToDB({
      to,
      subject,
      html,
      attachments,
    });

    // Respond with success message if email sent successfully
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    // Log any errors encountered during the email sending process
    console.error(error);
    // Respond with an error message if the email sending fails
    res.status(500).json({ message: "Failed to send email" });
  }
};

// Export the sendEmailController for use in routes or other modules
module.exports = { sendEmailController };
