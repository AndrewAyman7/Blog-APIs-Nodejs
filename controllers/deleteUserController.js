const usersModel = require("../models/users");

module.exports = async(req,res)=>{
    let {id} = req.params;
    try{
        let deletedUser = await usersModel.deleteOne({_id:id});
        res.json( {message:"delete success" , deletedUser} );
    }catch(err){
        res.json( {message:"delete failed" , err} );
    }
}