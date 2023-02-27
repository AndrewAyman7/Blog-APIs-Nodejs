const Post = require("../models/Post");
const User = require("../models/User").User;

const addPost = async(req,res,next)=>{
    let post = new Post(
        {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            user: req.user, // id
            image: {
                url: "",
                publicId: ""
            }
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
        let post = await Post.findById(id).populate("user comments" , ["-password"]); // gwa el try 3shan -> lw da5l id msh objectId -> elmongoose ht3ml error
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:"No Post Found" });
        }
    }catch(err){   // 3shan lw da5l id msh objectId -> elmongoose ht3ml error
        res.status(400).json({message:"No Post Found" , error: err.message });
    }
}

const countPosts = async(req,res,next)=>{
    const num = await Post.count();
    res.status(200).json(num);
}

const deletePost = async(req,res,next)=>{
    // using isUser Guard MW 
    let userId = req.user;
    let paramId = req.params.id; // Post

    try{
        let user = await User.findById(userId).select("-password");
        //console.log(user);
        let admin = user.isAdmin;
    
        let postId = await Post.findById(paramId);
        //console.log(postId);  //console.log(postId.user.toString());
        let postUser = postId.user.toString(); // sa7eb el post ->  ( new ObjectId("63f526039da94819392f883c") -> 63f526039da94819392f883c )
    
        
        if(admin || userId==postUser){
            let xPost = await Post.findByIdAndDelete(paramId);
            // @ ToDo -> Delete Photo , comments and likes of post
            res.status(201).json({message:"Post has been Deleted Successfully" , xPost});
        }else{
            res.status(403).json({message:"You Are Not Allowd, user himself only or admin"})
        }
    }catch(err){   // To handle error: UnhandledPromiseRejectionWarning: CastError: Cast to ObjectId failed for value "vvvsvsv", lw d5l ay id
        res.status(400).json({message:"failed" , error: err.message})
    }

    
}

const updatePost = async (req,res,next)=>{
    // @ToDo -> controller for Update Image , #14
    let postId = req.params.id;
    let userId = req.user;

    let post = await Post.findById(postId);
    //console.log(post);
    try{
        if(post){
            if(userId == post.user.toString()){
                let updatedPost = await Post.findByIdAndUpdate(postId, {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category
                    }
                },
                {new: true} // to return post after update
                );
                res.status(201).json({message:"Updated Successfully" , updatedPost});
            }else{
                res.status(401).json({message:"user himself only can update post"});
            }
        }else{
            res.status(400).json({message:"No post found"});
        }
    }catch(err){
        res.status(400).json({message:"failed" , error: err.message});
    }

}

const toggleLike = async(req,res,next)=>{
    let userId = req.user;
    let postId = req.params.id;

    try{
        let post = await Post.findById(postId);
        if(post){
            let isAlreadyLiked = post.likes.find((user)=>user.toString() === userId);
            if(isAlreadyLiked){
                let toggleLikePost = await Post.findByIdAndUpdate(postId , {
                    $pull: {likes: userId}
                } , {new:true});   // mtktbhash lw 3ayez, de 3shan a return ellikes elgdeda
            }else{
                let toggleLikePost = await Post.findByIdAndUpdate(postId , {
                    $push: {likes: userId}
                }, {new:true});
            }
            res.status(201).json({likes: post.likes })
        }else{
            res.status(400).json({message:"No post found"});
        }
    }catch(err){
        res.status(400).json({message:"failed" , error: err.message});
    }

}

//------------------ @ToDo -> controller for Update Image , #14 --------------------//

module.exports = {
    addPost,
    getPosts,
    getPostById,
    countPosts,
    deletePost,
    updatePost,
    toggleLike
}

