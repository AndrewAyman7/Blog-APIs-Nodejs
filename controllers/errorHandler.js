
const notFoundMW = (req,res,next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`);  // 3shan lw elclient da5l link msh mwgood asln, hayb3t html error, 3ayzo json
    res.status(404);
    next(error);
}

const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode === 200? 500 : res.statusCode;
    res.status(statusCode).json({   // 3shan myrg3sh lel client error HTML , yrg3 json , fe 7ala el upload le unSupported format
        message: err.message,
        stack: err.stack
    });
}

module.exports = {
    errorHandler,
    notFoundMW
}