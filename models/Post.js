const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    category: {
        type: String,
        required: true,
        maxlength: 50
    },
    image:{
        type: Object,
        default:{
            url: "",
            publicId: null
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},
{
    timestamps:true,
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
}
)

postSchema.virtual("comments" , {
    ref: "comment",
    foreignField: "postId",
    localField: "_id"    
});

const Post = mongoose.model('Post' , postSchema);

module.exports = Post;