const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:50,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        maxlength:100,
        unique:true
    },
    profileImg:{
        type:Object,
        default:{
            url:process.env.USER_DEFAULT_IMAGE, //copy img adress
            publicId:null
        }
    },
    bio:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    verified:{
        type:Boolean,
        default:false
    },
},

{
    timestamps:true,
    toJSON: {virtuals: true},   // To Add Virtual field, el relation between el collections
    toObject: {virtuals: true} 
}
);

userSchema.virtual("posts" , {  // "posts": da hyb2a esmha as a property of user = array [] , like username, profileimg..,
    ref: "Post",  // el esm ely msmeeh fe el DB  // gy mn mongoose.model('Post' , postSchema) 
    foreignField: "user",  // Ana barbot bel _id -> msmeeh fe el posts "user"
    localField: "_id"
});

const User = mongoose.model("user",userSchema);

module.exports = User;