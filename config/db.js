const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to MongoDB Database ${mongoose.connection.host}`.bgMagenta);
    } catch (error) {
        console.log(`mongoDB Database Error ${error}`.bgRed.white);
    }
};

module.exports = connectDB;