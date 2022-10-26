const blogsModel = require("../models/blogs");

module.exports = async (req,res)=>{
    try{
        let{page} = req.query;
        let skip = (page-1) * 3;
        const blogs = await blogsModel.find({}).populate("createdBy" , "name").limit(3).skip(skip); 

        const blogsNum = await blogsModel.count();
        const pagesNum = Math.ceil(blogsNum/3);
        res.json( {message:"success" , page:`${page}` , blogsNum , pagesNum, blogs } )
    }catch(err){
        res.json( {message:"error" , err: `${err}` }); 
        console.log(err);  
    }

}
