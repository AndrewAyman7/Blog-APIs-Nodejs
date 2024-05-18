const Comment = require("../models/Comment");
const Post = require("../models/Post")

const addPost = async (req,res,next) => {
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        user: req.user.id,
        image: { 
            url: `/${req.file.filename}`,
            publicId: `/${req.file.filename}`
        }
    });

    await post.save();
    res.status(201).json({message:"Post Created" , post});
}


const addPostNoImg = async(req,res,next)=>{
    let post = new Post(
        {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            user: req.user.id, // id
        }
    );
    await post.save();
    res.status(201).json({message:"Post Created" , post});
}

const getPosts = async(req,res,next)=>{
    const {page , category} = req.query;
    const postsPerPage = 3;
    let posts;
    if(page){
        posts = await Post.find().skip((page-1)*postsPerPage).limit(postsPerPage).sort({createdAt: -1}).populate("user comments" , ["-password"]);
    }else if(category){
        posts = await Post.find({category}).limit(postsPerPage).sort({createdAt: -1}).populate("user comments" , ["-password"]);
    }else{
        posts = await Post.find().sort({createdAt: -1}).populate("user comments" , ["-password"]);
    }

    res.status(200).json(posts);
}

const getPostById = async(req,res,next)=>{
    let {id} = req.params;
    try{
        let post = await Post.findById(id).populate("user comments" , ["-password"]);
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:"No Post Found" });
        }
    }catch(err){ 
        res.status(400).json({message:err.message});
    }
}

const deletePost = async (req,res,next) =>{
    let postId = req.params.id;
    try{
        let post = await Post.findById(postId);
        if(post){
            let postOwner = post.user._id.toString();
            if(postOwner === req.user.id || req.user.admin){
                let xPost = await Post.findByIdAndDelete(postId);
                await Comment.deleteMany({postId:postId});
                res.status(200).json({message:"Post has been Deleted Successfully"})
            }else{
                res.status(400).json({message:"You Are Not Allowed To Delete This Post"});
            }
        }else{
            res.status(404).json({message:"No Post Found" });
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const updatePost = async (req,res,next) =>{
    let postId = req.params.id;
    try{
        let post = await Post.findById(postId);
        if(post){
            let postOwner = post.user._id.toString();
            if(postOwner === req.user.id || req.user.admin){
                let updatedPost = await Post.findByIdAndUpdate(postId, {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category
                    }
                },
                {new: true} // to return post after update // To render it in frontend
                ).populate("user" , ["-password"]);
                res.status(200).json(updatedPost);
            }else{
                res.status(400).json({message:"You Are Not Allowed To Update This Post"});
            }
        }else{
            res.status(404).json({message:"No Post Found" });
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const updatePostWithImg = async (req,res,next) =>{
    let postId = req.params.id;
    try{
        let post = await Post.findById(postId);
        if(post){
            let postOwner = post.user._id.toString();
            if(postOwner === req.user.id || req.user.admin){
                let updatedPost = await Post.findByIdAndUpdate(postId, {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category,
                        image: {    
                            url: `/${req.file.filename}`,
                            publicId: `/${req.file.filename}`
                        }
                    }
                },
                {new: true} 
                ).populate("user" , ["-password"]);
                res.status(200).json(updatedPost);
            }else{
                res.status(400).json({message:"You Are Not Allowed To Update This Post"});
            }
        }else{
            res.status(404).json({message:"No Post Found" });
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const toggleLike = async(req,res,next)=>{
    let userId = req.user.id;
    let postId = req.params.id;
    let toggleLikePost;

    try{
        let post = await Post.findById(postId);
        if(post){
            let isAlreadyLiked = post.likes.find((user)=> user.toString() === userId);
            if(isAlreadyLiked){
                toggleLikePost = await Post.findByIdAndUpdate(postId , {
                    $pull: {likes: userId}
                } , {new:true});
            }else{
                toggleLikePost = await Post.findByIdAndUpdate(postId , {
                    $push: {likes: userId}
                }, {new:true});
            }
            res.status(200).json(toggleLikePost);
        }else{
            res.status(400).json({message:"No post found"});
        }
    }catch(err){
        res.status(400).json({message:"failed" , error: err.message});
    }
}


module.exports = {
    addPost,
    addPostNoImg,
    getPosts,
    getPostById,
    deletePost,
    updatePost,
    updatePostWithImg ,
    toggleLike
}