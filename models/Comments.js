const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    // barbot el comment b (post , user) -> elcomment da 3la anhy post, w meen ely 3amlo
    postId: {   // Ha5do mn el param, posts/id , --But-- , hwa 5dha mn elbody m3rfsh leh
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {   // Ha5do mn el token, MW
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {      //3shan ashof esm eluser ely 3amel elcomment
        type: String,
        required: true
    }
},
    {timestamps:true}
);

const Comment = mongoose.model("comment" , commentSchema);

module.exports = Comment;