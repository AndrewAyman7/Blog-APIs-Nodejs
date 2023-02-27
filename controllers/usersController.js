const User = require("../models/User").User;
const Posts = require("../models/Post");
const Comment = require("../models/Comments");
const bcrypt = require("bcrypt");

// Note About StatusCodes -> 200: successfully, 201: Created Successfully , so, any get req = 200
const getUsers = async (req,res,next)=>{
    let users = await User.find().select("-password");
    res.status(200).json({message:users});
}

const getUserById = async(req,res,next)=>{
    const {id} = req.params;
    try{
        const user = await User.findById(id).select("-password");
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message})  // 3shan lw d5l id msh object id asln -> el mongoose, findById htrg3lo error fe el catch
    }
}

const getUserProfileById = async(req,res,next)=>{
    const {id} = req.params;
    try{
        const user = await User.findById(id).select("-password").populate("posts");
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message})  // 3shan lw d5l id msh object id asln -> el mongoose, findById htrg3lo error fe el catch
    }
}

const updateUser = async(req,res,next)=>{
    let userId = req.user;
    let id = req.params.id;
    try{
        const user = await User.findById(id).select("-password");
        if(user){
            if(user._id == userId){    // 3shan at2kd en ely by3dl da hwa sa7eb el account, mmmkn t3mla MW lw7dha
                if(req.body.password){
                    req.body.password = await bcrypt.hash(req.body.password , 2);
                }
                let updatedData = await User.findByIdAndUpdate( id, {
                    $set: {
                        username: req.body.username,
                        password: req.body.password,
                        bio: req.body.bio
                    }
                } );
                res.status(201).json({message: "updated Success" , updatedData});
            }else{
                res.status(401).json({message:"You Are Not Authorized"});
            }
        }else{
            res.status(400).json({message:"user not found"});
        }

    }catch(err){
        res.status(400).json({message:err.message});  // ela7san t3mlo fe middleware lw7do
    } 
}

const countUsers = async (req,res,next)=>{
    let num = await User.count();
    res.status(200).json(num);
}

const deleteUser = async(req,res,next)=>{
    //console.log(req.params);
    try{
        let user = await User.findById(req.params.id);
        if(user){
            await User.findByIdAndDelete(req.params.id);

            // @ ToDo -> Delete All Users Photos , Posts , comments , likes
            await Posts.deleteMany({user: req.params.id});
            await Comment.deleteMany({userId: req.params.id});
            res.status(201).json({message:"User Deleted Successfully"});
        }
        else{
            res.status(404).json({message:"User Not Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

    // @ ToDo -> Delete All Users Photos , cloudinary
}


module.exports = {
    getUsers,
    getUserById,
    updateUser,
    countUsers,
    deleteUser,
    getUserProfileById
}