const { StatusCodes } = require("http-status-codes");
const usersModel = require("../models/users");

module.exports = async(req,res)=>{
    try{

        let {name,email,password} = req.body;

        //let newUser = await usersModel.insertMany( {name,email,password} )    
        let user = await usersModel.findOne({email}); 
        if(user){
            res.status(StatusCodes.BAD_REQUEST).json({message:"error .. email is used" ,});
        }else{
            let newUser = await new usersModel({
                name: name,
                email: email,
                password: password
            }).save();
            res.status(StatusCodes.CREATED).json( {message:"success" , newUser} );
        }

    }catch(err){
        res.json( {message:"error" , err: `${err}` }); 
        console.log(err);  
    }
}