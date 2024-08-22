const path = require("path");
const multer = require("multer");

const Storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname,"../../images"))
    },
    filename: function(req,file,cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g,"-")+ file.originalname);
        }else{
            cb(null,false)
        }
    }
})

const uploadMW = multer({
    storage: Storage,
    fileFilter: function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb({message:"UnSupported file format, img only"} , false)
        }
    },
    limits: {fileSize: 1024*1024*3 }  // 3 mb at most
})



module.exports = {
    uploadMW
}