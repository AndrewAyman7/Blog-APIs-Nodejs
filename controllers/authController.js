const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/********************************************************
 * @Description     Register New User
 * @Route           /api/auth/signup
 * @method          POST
 * @access          public
********************************************************/

const signUp = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email is already used , choose another one"});
        }
        let hashedPass = await bcrypt.hash(password,10);
        let createdUser = new User({username, email, password:hashedPass});
        await createdUser.save();
        res.status(201).json({message:"Signed up Successfully, now Login"})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}


/********************************************************
 * @Description     Login User
 * @Route           /api/auth/login
 * @method          POST
 * @access          public
*********************************************************/

const login = async(req,res,next)=>{
    try{
        let {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User Not Exist"});
        }
        let correctPass = await bcrypt.compare(password,user.password);
        if(correctPass){
            let token = jwt.sign({id:user._id, username:user.username, admin:user.isAdmin}, process.env.SECRET_KEY);
            res.status(200).json({token , username: user.username , admin:user.isAdmin , id:user._id , profileimg:user.profileimg});
        }else{
            res.status(400).json({message:"Password is InCorrect"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}


module.exports = {
    signUp,
    login
}