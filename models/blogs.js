const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/usersApi";

const blogSchema = mongoose.Schema({
    title : {type:String},
    content : {type:String, required:true},
    createdBy : {type: mongoose.Schema.Types.ObjectId , ref:"user"}  // ref => to use populate in getBlogs
    },
    {timestamps : true}
)

const blogsModel = mongoose.model("blog" , blogSchema);

module.exports = blogsModel;