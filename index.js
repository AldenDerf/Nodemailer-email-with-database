const express = require("express");
const mongoose = require('mongoose'); // Import Mongoose
const app = express();
require("dotenv").config();
const PORT = process.env.PORT ; // Define the PORT variable
const emailRoutes = require("./Routes/emailRoutes"); // Import email routes


// Connect to MongoDB database using Mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // MongoDB connection options
    useUnifiedTopology: true,
})
.then( ()=> console.log('MongoDB is connected successfully') )
.catch( ()=> console.error(err) );


// Middleware to parse incoming JSON data
app.use(express.json());

// Mount the email routes
app.use("/email", emailRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
