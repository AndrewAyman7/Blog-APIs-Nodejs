const { StatusCodes } = require("http-status-codes");
const blogsModel = require("../models/blogs");
const jwt = require("jsonwebtoken");

module.exports = async (req,res,next)=>{
    try{
        let token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token,"andoza");
        let id = decoded.id;

        let {title,content} = req.body;
        let newBlog = await new blogsModel({
            title:title,
            content:content,
            createdBy:id
        }).save();
        res.json({message:"success" , newBlog});
    }catch(err){
        res.json( {message:"error" , err: `${err}` }); 
        console.log(err); 
        }
}
