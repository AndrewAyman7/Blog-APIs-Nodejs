const usersModel = require("../models/users");

module.exports = async (req,res)=>{

    try{
        let users = await usersModel.find({}).select("-password");
        res.json( {message:"success" , users} )
    }catch(err){
        res.json( {message:"error" , err: `${err}` }); 
        console.log(err);  
    }
    
}
