const mongoose = require("mongoose");
const Post = require("../models/Post");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 2,
        maxlength: 50       
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 100       
    },
    profileimg:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png", //copy img adress
            publicId:null
        }
    },
    bio: {
        type:String,
        maxlength: 200
    },
    isAdmin: {
        type:Boolean,
        default:false
    },
    verified:{
        type:Boolean,
        default: false
    },
},
 {
    timestamps:true,
    toJSON: {virtuals: true},   // To Add Virtual field, el relation between el collections
    toObject: {virtuals: true} 
 }

)

// Get user's Posts, by its id -> i've already saved in each post an id -> user: {type: mongoose.Schema.Types.ObjectId, ref: "user"}
// Now bring all posts that include the id of this user
// Its = Relation in DB ,,  in Mongoose = Virtual -> connect 2 collection (Users, Posts) >> (like: Primary Key & Foreign Key)

userSchema.virtual("posts" , {  // "posts": da hyb2a esmha as a property of user = array [] , like username, profileimg..,
    ref: "Post",  // el esm ely msmeeh fe el DB  // gy mn mongoose.model('Post' , postSchema) 
    foreignField: "user",  // Ana barbot bel _id -> msmeeh fe el posts "user"
    localField: "_id"
});
// Now, there will be a new "field" , "property" of user = posts[] , like: username, profileimg,...
// But it won't be a real property, it will be Virtually, y3ny msh mwgooda bel 72e2a, da lma a7tagha a3ml populate 3shaqn agbha
// Now, Go To Controller , and when u find user, populate posts

const User = mongoose.model("user" , userSchema);

module.exports = {
    User
}