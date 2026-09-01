const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const dbconnect = async (connstr) => {
    try {
        await mongoose.connect(connstr);
        console.log('Connected to MongoDB Atlas');
        return mongoose;
    } catch (err) {
        console.error('DB connection error:', err.message);
    }
}

module.exports = { mongoose, dbconnect };