// Import the Mongoose library
const mongoose = require('mongoose');

// Define a Mongoose schema for email data
const EmailSchema = new mongoose.Schema({
    to: String, // Recipient's email address
    subject: String, // Email subject
    html: String, //Email content in HTML format
    attachments: Array, // Array of attachments (if any)
    sentAt: {
        type: Date, // Date of when the email was sent
        default: Date.now, // Default value is the current date/time
    },
});

// Create a Mongoose model based on the schema
const EmailModel = mongoose.model('Email', EmailSchema);

// Function to save email data to MongoDB
const saveEmailToDB = async (emailData) => {
    try {
        // Create an instance of the EmailModel with provided emailData
        const email = new EmailModel(emailData);

        // Save the email instance to the database
        await email.save();
        console.log('Email saved to databased'); // Log success message
    } catch (error) {
        // Log an error message if there's a failuer in saving the email
        console.error("Failed to save email to database:", error);
    }
};

// Export the EmailModel and saveEmailToDB function for use in other modules
module.exports = { EmailModel, saveEmailToDB};

