const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const addComment = async(req,res,next)=>{
    let postId = req.params.id;
    let userId = req.user.id;

    try{
        let user = await User.findById(userId);
        let post = await Post.findById(postId);
        if(post){
            let comment = new Comment({
                postId,
                userId,
                content: req.body.content,
                username: user.username
            });
            await comment.save();
            res.status(201).json({message:"comment has been sent" , comment});
        }else{
            res.status(400).json({message:"this post is not exist"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

}

const getAllComments = async(req,res,next)=>{
    try{
        let comments = await Comment.find();
        res.status(200).json(comments);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getUserComments = async(req,res,next)=>{
    let user = req.params.id;
    try{
        let comments = await Comment.find({userId:user});
        res.json(comments);
    }catch(err){
        res.json(err.message);
    }
}

const deleteComment = async(req,res,next)=>{
    let commentId = req.params.id;
    let userId = req.user.id;

    try{
        let user = await User.findById(userId);
        let comment = await Comment.findById(commentId);
        if(comment){
            if(user.isAdmin || userId === comment.userId.toString()){
                await Comment.findByIdAndDelete(commentId);
                res.status(200).json({message:"delete success"});
            }else{
                res.status(401).json({message:"Not Authorized, user only can"});
            }
        }else{
            res.status(404).json({message:"Comment No Found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

}

const updateComment = async(req,res,next)=>{
    let userId = req.user.id;
    let commentId = req.params.id;

    try{
        let comment = await Comment.findById(commentId);
        if(comment){
            if(comment.userId.toString() === userId){
                let updatedComm = await Comment.findByIdAndUpdate(commentId , { $set: {content: req.body.content} } , {new:true});
                res.status(201).json({message:"Updated successfully" , updatedComm});
            }else{
                res.status(403).json({message:"Access Denied, only user himself"});
            }
        }else{
            res.status(400).json({message:"Comment not found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

}

const getPostComments = async(req,res,next)=>{
    let postId = req.params.id;
    try{
        let comments = await Comment.find({postId});
        if(comments){
            res.status(200).json(comments);
        }else{
            res.status(400).json({message:"No Comments for this post"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }

}


module.exports = {
    addComment,
    getAllComments,
    getUserComments,
    deleteComment,
    updateComment,
    getPostComments,
}
