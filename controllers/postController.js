const path = require("path");
const Post = require("../models/Post");
const fs = require("fs");
const Comment = require("../models/Comment");


// @ToDo 1 -> e3ml el 2 controllers (addPost , addPostImg) fe 1 Controller ..  -->  if (req.file.filename) ....
// @ToDo 2 -> e3ml el 2 controllers (updatePost , updatePostImg) fe 1 Controller ..  -->  if (req.file.filename) ....

/********************************************************
 * @Description     Add New Post
 * @Route           /api/posts
 * @method          POST
 * @access          public
********************************************************/
const addPost = async (req,res,next) => {
    let {title,content,category} = req.body;
    let post = new Post({
        title,
        content,
        category,
        user: req.user.id,
        image: { 
            url: `/${req.file.filename}`,
            publicId: `/${req.file.filename}`
        }
    });

    await post.save();
    res.status(201).json({message:"Post Created" , post});
}

/********************************************************
 * @Description     Add New Post With An Attached Image
 * @Route           /api/posts/postimg
 * @method          POST
 * @access          public
********************************************************/
const addPostNoImg = async(req,res,next)=>{
    let {title,content,category} = req.body;
    let post = new Post(
        {
            title,
            content,
            category,
            user: req.user.id, // id
        }
    );
    await post.save();
    res.status(201).json({message:"Post Created" , post});
}

/********************************************************
 * @Description     Get Posts
 * @Route           /api/posts
 * @method          GET
 * @access          public
********************************************************/
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

/********************************************************
 * @Description     Get Post
 * @Route           /api/posts/:id
 * @method          GET
 * @access          public
********************************************************/
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

/********************************************************
 * @Description     Get Posts Number
 * @Route           /api/posts/count
 * @method          GET
 * @access          public
********************************************************/
const countPosts = async(req,res,next)=>{
    const num = await Post.countDocuments();
    res.status(200).json(num);
}

/********************************************************
 * @Description     Delete Post
 * @Route           /api/posts/:id
 * @method          DELETE
 * @access          private (Only User Himself or Admin)
********************************************************/
const deletePost = async(req,res,next)=>{
    let postId = req.params.id;
    let user = req.user;
    try{
        let post = await Post.findById(postId);
        if(post){
            let postOwner = post.user.toString();
            if(user.id === postOwner || user.admin){
                await Post.findByIdAndDelete(postId);
                if(post.image.url != ""){
                    fs.unlinkSync(path.join(__dirname,"../images/" +post.image.url))
                }
                await Comment.deleteMany({postId: post._id});
                res.status(200).json({message:"Post has been Deleted Successfully"});
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

/********************************************************
 * @Description     Update Post
 * @Route           /api/posts/:id
 * @method          PUT
 * @access          private (Only User Himself or Admin)
********************************************************/
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

/********************************************************
 * @Description     Update Post
 * @Route           /api/posts/img/:id
 * @method          PUT
 * @access          private (Only User Himself or Admin)
********************************************************/
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

/********************************************************
 * @Description     Toggle Like Post
 * @Route           /api/posts/like/:id
 * @method          PUT
 * @access          private (Only User Himself)
********************************************************/
const toggleLike = async(req,res,next)=>{
    let userId = req.user.id;
    let postId = req.params.id;
    let toggleLikePost;

    try{
        let post = await Post.findById(postId);
        if(!post) return res.status(400).json({message:"No post found"});
        let isAlreadyLiked = post.likes.find( user=> user.toString() === userId);
        if(isAlreadyLiked) {
            toggleLikePost = await Post.findByIdAndUpdate(postId , {
                $pull: {likes: userId}
            } ,  {new:true})
        }else{
            toggleLikePost = await Post.findByIdAndUpdate(postId , {
                $push: {likes: userId}
            }, {new:true});
        }
        res.status(200).json(toggleLikePost);
    }catch(err){
        res.status(400).json({message:"failed" , error: err.message});
    }
}

module.exports = {
    addPost,
    addPostNoImg,
    getPosts,
    getPostById,
    countPosts,
    deletePost,
    updatePost,
    updatePostWithImg,
    toggleLike
}