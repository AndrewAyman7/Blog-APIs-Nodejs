const mongoose = require("mongoose");

module.exports = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase Connected");
    }catch(err){
        console.log("DataBase Connection Failed !! " , err);
    }
}