const mongoose = require("mongoose");

module.exports = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected Successfully to Mongo DB");
    }catch(err){
        console.log(err);
    }
}