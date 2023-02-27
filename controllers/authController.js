const User = require("../models/User").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let fEmail = await User.findOne({email});
        if (fEmail){
            res.status(400).json({message:"Email is already used , choose another one"});
        }else{
            let hashed = await bcrypt.hash(password , 2);
            let user = new User({username,email,password:hashed});
            await user.save();
            res.status(201).json({message:"Signed up Successfully"})
        }
    }catch(err){
        console.log("My Api Error : " , err);
    }
}

const login = async (req,res,next)=>{
    try{
        let {email,password} = req.body;
       let user = await User.findOne({email});
        if(user){
            let correctPass = await bcrypt.compare(password,user.password);
            if(correctPass){
                let token = jwt.sign({id:user._id , username:user.username, admin:user.isAdmin} , process.env.SECRET_KEY);
                res.status(201).json({message:"Login Successfully" , token} )
            }else{
                res.status(201).json({message:"Password is not correct"})
            }
        }else{
            res.status(400).json({message:"this email is not exist"})
        }

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    signUp,
    login
}