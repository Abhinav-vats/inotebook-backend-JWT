const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_DB_URL;//?readPreference=primary&appName=MongoDB%20Compass&directConnection=true&ssl=false";


const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to mongo Db successfully...");
    }catch(err){
        console.log("Failed to connect : ", err);
    }
   
}

module.exports = connectToMongo;