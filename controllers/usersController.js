const path = require("path");
const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

/********************************************************
 * @Description     Get All Users
 * @Route           /api/users
 * @method          GET
 * @access          private (Only Admins)
*********************************************************/
const getUsers = async(req,res,next)=>{
    let users = await User.find().select("-password");
    res.status(200).json(users);
}

/********************************************************
 * @Description     Get User
 * @Route           /api/users/:id
 * @method          GET
 * @access          public
*********************************************************/
const getUserById = async (req,res,next) => {
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

/********************************************************
 * @Description     Update User
 * @Route           /api/users
 * @method          PUT
 * @access          private (Only User Himself or Admin)
*********************************************************/
const updateUser = async (req,res,next) => {
    let {id} = req.params;
    try{
        let user = await User.findById(id); // You can Skip This line of code, save queries
        if(!user){
            return res.status(404).json("user not found");
        }
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,10);
        }
        let updateData = await User.findByIdAndUpdate(id , {
            $set : {
                username: req.body.username,
                password: req.body.password,
                bio: req.body.bio
            }
        } , {new:true}).select("-password");

        res.status(201).json({message: "updated Successfully" , updateData});
    }catch(err){
        res.status(400).json({message:err.message}); 
    }
}

/********************************************************
 * @Description     Get Users Number
 * @Route           /api/users/count
 * @method          GET
 * @access          private (Only Admins)
*********************************************************/
const countUsers = async (req,res,next)=>{
    let num = await User.countDocuments();
    res.status(200).json(num);
}

/********************************************************
 * @Description     Add Profile Image
 * @Route           /api/users/upload-photo
 * @method          POST
 * @access          private (Only User Himself)
*********************************************************/
const uploadProfile = async(req,res,next)=>{
    if(req.file){
        let img = "/" + req.file.filename;  // for example: http://localhost:9000/2023-02-23T12-45-06.669ZIMG-20210905-WA0173.jpg

        let user = await User.findById(req.user.id);
        user.profileImg = {
            publicId : img,
            url : img
        }
        await user.save();

        res.status(200).json({message:"uploaded successfully" , img});
    }else{
        res.status(400).json({message:"No photos uploaded, please choose img"});
    }
}

/********************************************************
 * @Description     Get All Users
 * @Route           /api/users/:id
 * @method          DELETE
 * @access          private (Only User Himself or Admin)
*********************************************************/


// @ToDo -> lma tms7 user, btms7 koll el Posts bta3to tmam , but lazem tms7 koll el swr bta3et el Posts kman !!
//          so, @ToDo -> lma tms7 user, ems7 koll el swr bta3et el posts bta3to ,,  Video #20
const deleteUser = async(req,res,next)=>{
    try{
        let user = await User.findById(req.params.id);
        if(user){
            await User.findByIdAndDelete(req.params.id);
            if(user.profileImg.url !== process.env.USER_DEFAULT_IMAGE){
                fs.unlinkSync(path.join(__dirname,"../images/" +user.profileImg.url))
            }
            await Post.deleteMany({user:user._id});
            await Comment.deleteMany({userId: user._id});
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
    uploadProfile,
    deleteUser
}