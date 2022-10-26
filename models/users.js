const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DB_URL = "mongodb://localhost:27017/usersApi";


const userSchema = mongoose.Schema({
    name : String,
    email: {type:String, required:true},
    password: String,
    verified : {type:Boolean , default:false},
    role : {type:String, default:"user"}
},
    { timestamps:true }
)

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password,10);
    next();
} )

const user = mongoose.model("user" , userSchema);

module.exports = user;

