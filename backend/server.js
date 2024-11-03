const express = require('express');
const app = express();
const dotenv = require('dotenv'); // Add this line
const cors = require('cors');
const router = require('./routs/notes');
const rout = require('./routs/auth')
const mongoose = require('mongoose');
const connectiondb = require('./config/db');

dotenv.config();

    
// Connect to the database
connectiondb();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', router);
app.use('/data', rout);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})