const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
} ,

    {
        timestamps: true,
        toJSON: {virtuals: true}, 
        toObject: {virtuals: true} 
    }
);

UserSchema.virtual("posts" , {
    ref: "Post",
    foreignField: "user",
    localField: "_id"
})

const User = mongoose.model("user" , UserSchema);

module.exports = User;