const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

module.exports = (req,res,next)=>{
    //console.log(req.headers);

    let token = req.headers.authorization.split(" ")[1];

    let decoded = jwt.verify(token,"andoza");
    console.log(decoded);

    let role = decoded.role;

    if(role == "admin"){
        next();
    }else{
        res.status(StatusCodes.UNAUTHORIZED).json({message:"you are not authorized bitch"})
    }
    
}