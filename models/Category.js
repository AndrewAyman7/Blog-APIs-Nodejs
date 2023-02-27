const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    adminId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: { 
        type: String,
        required: true
    }
},
    {timestamps:true}
);

const Category = mongoose.model("categorie" , categorySchema);

module.exports = Category;