const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {    
        type: String,
        required: true
    }
},
    {timestamps:true}
);

const Comment = mongoose.model("comment" , commentSchema);

module.exports = Comment;