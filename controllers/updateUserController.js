const usersModel = require("../models/users");

module.exports = async(req,res)=>{
    let {id} = req.params;
    let {name} = req.body;
    try{
        let updatedUser = await usersModel.updateOne( {_id:id} , {name} );
        res.json( {message:"update success" , updatedUser} );
    }catch(err){
        res.json( {message:"update failed" , err} );
    }
}