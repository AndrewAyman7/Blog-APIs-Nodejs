const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => { 
    let headerToken = req.headers.authorization;
    if(headerToken){
        const token = headerToken.split(" ")[1];
        try{
            const decoded = jwt.verify(token , process.env.JWt_SECRET_KEY);
            req.user = decoded;
            next();
        }catch(err){
            res.status(401).json({message:"invalid Token"});
        }
    }else{
        res.status(401).json({message:"You Are Not Authorized .. No Token , Login first"});
    }
}


const isAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.admin) next();
        else res.status(403).json({message:"You Are Not Authorized .. Only Admins"});
    })
}


const isAdminOrUserHimself = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.admin || req.user.id === req.params.id) next();
        else res.status(403).json({message:"You Are Not Authorized .. Only Admins or User Himself"});
    })
}

module.exports = {
    verifyToken,
    isAdmin,
    isAdminOrUserHimself
}