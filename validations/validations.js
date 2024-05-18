const mongoose = require("mongoose");

const validateObjectId = (req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message:"InValid id"});
    }
    next();
}

module.exports = {
    validateObjectId
}