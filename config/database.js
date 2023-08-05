const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected at ${conn.connection.host}`);
    } catch(err) {
        console.log(`Error while connecting to MongoDB: ${err}`);
        process.exit(1);
    }
}

module.exports = {
    connectToDB
};