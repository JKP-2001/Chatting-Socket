const mongoose = require("mongoose");

const mongoURI =  process.env.NODE_ENV === "dev"?"mongodb://0.0.0.0:27017/clone":process.env.MONGO_URI;

console.log({mongoURI});

const connectDB = async () => {
    
    try {
        const conn = await mongoose.connect(mongoURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
