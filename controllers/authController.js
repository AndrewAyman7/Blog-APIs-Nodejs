const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req,res,next) => {
    try{
        let {username,email,password} = req.body;
        let emailExist = await User.findOne({email});
        if(emailExist){
            res.status(400).json({message: "Email is already used , choose another one"});
        }else{
            let hashedPass = await bcrypt.hash(password,2);
            let user = new User({username, email, password:hashedPass});
            await user.save();
            res.status(201).json({message:"Signed up Successfully, now Login"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const login = async (req,res,next)=>{
    try{
        let {email, password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: "user not found"});
        }
        let correctPass = await bcrypt.compare(password, user.password);
        if(!correctPass){
            res.status(400).json({message: "Password is not correct"});
        }
        let token = jwt.sign({id:user._id , username:user.username, admin:user.isAdmin} , process.env.JWt_SECRET_KEY);
        res.status(200).json({token , username: user.username , admin:user.isAdmin , id:user._id , profileimg:user.profileimg} );
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    signUp,
    login
}