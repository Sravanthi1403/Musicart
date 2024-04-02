require("dotenv").config();
const mongoose = require('mongoose');


const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('connection successful to DB');
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(0);
    }
}

module.exports = connectDB;