const express = require("express");
const router = express.Router();
const { sendEmailController } = require("../Controllers/sendEmailController");

// Define a route for sending emails
router.post("/send", sendEmailController);

module.exports = router;
