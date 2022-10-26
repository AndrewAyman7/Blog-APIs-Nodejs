const { StatusCodes } = require("http-status-codes");
const usersModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req,res)=>{
    try{
        let {email,password} = req.body;

        let user = await usersModel.findOne({email});
        if(user){
            let correct =  await bcrypt.compare(password,user.password); 
            if(correct){
                var token = jwt.sign({ name:user.name , role:user.role , id:user._id }, 'andoza');
                res.status(StatusCodes.OK).json({ token , user:{name:user.name, email:user.email, role:user.role, id:user._id} });

            }else{
                res.json({message:"the password is incorrect"});
            }
        }else{
            res.json({message:"the email is not exist"});
        }

    }catch(err){
        res.json( {message:"error" , err: `${err}` }); 
        console.log(err); 
    }
}