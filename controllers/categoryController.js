const Category = require("../models/Category");

const addCategory = async(req,res,next)=>{   // only Admins
    try{
        let cat = new Category({
            adminId: req.adminId,
            title: req.body.title
        });
        await cat.save();
        res.status(201).json({message:"category has been added"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getCategories = async(req,res,next)=>{
    try{
        const categories = await Category.find().select("title -_id");  // select id only, bs beyegy m3ah el _id, fa sheelo
        res.status(200).json(categories);
    }catch(err){
        res.status(400).json({message:err.message});
    }
    fff

}

module.exports = {
    addCategory,
    getCategories
}