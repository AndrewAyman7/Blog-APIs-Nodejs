const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");


const getUsers = async (req,res,next) => {
    let users = await User.find({}).select("-password");
    res.status(200).json(users);
}

const getUserById = async (req,res,next) => {
    let {id} = req.params;
    try{
        let user = await User.findById(id).select("-password");
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getUserProfileById = async (req,res,next) => {
    let {id} = req.params;
    try{
        let user = await User.findById(id).select("-password").populate("posts");
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const updateUser = async (req,res,next) => {
    try{
        let user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json("user not found");
        }
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,2);
        }
        let updateData = await User.findByIdAndUpdate(req.params.id , {
            $set : {
                username: req.body.username,
                password: req.body.password,
                bio: req.body.bio
            }
        } , {new:true}).select("-password");

        res.status(201).json({message: "updated Success" , updateData});
    }catch(err){
        res.status(400).json({message:err.message}); 
    }
}

const countUsers = async (req,res,next)=>{
    let num = await User.countDocuments();
    res.status(200).json(num);
}

const deleteUser = async(req,res,next)=>{
    try{
        let user = await User.findById(req.params.id);
        if(user){
            await User.findByIdAndDelete(req.params.id);
            await Post.deleteMany({user:user._id});
            await Comment.deleteMany({userId:user._id});

            res.status(201).json({message:"User Deleted Successfully"});
        }
        else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    countUsers,
    deleteUser,
    getUserProfileById 
}