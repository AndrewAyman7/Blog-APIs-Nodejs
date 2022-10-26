const {StatusCodes} = require("http-status-codes"); //const statusCodes = require("http-status-codes").StatusCodes;

module.exports = (schema)=>{
    return (req,res,next)=>{
        let validation = [];

        let validationResult = schema.body.validate(req.body)
       // console.log(validationResult);
        //res.json( {message:"joi"} )

        if(validationResult.error){
            validation.push(validationResult.error.details[0].message)
        }
        if(validation.length > 0){
            res.status(StatusCodes.BAD_REQUEST).json( {message:validation.join()} ) // To Convert Array to String
        }
        else{
            next();
        }
    }
}