const mongoose = require('mongoose');

const dbconnect = async (connstr) => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(connstr, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB Atlas');
        return mongoose;
    } catch (err) {
        console.error('DB connection error:', err.message);
    }
}

module.exports = { mongoose, dbconnect };