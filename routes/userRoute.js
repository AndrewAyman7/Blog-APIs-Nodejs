const route = require("express").Router();

//----------------- users controllers -----------------//
const getUsers = require("../controllers/getUsersController");
const addUser = require("../controllers/addUserController");
const deleteUser = require("../controllers/deleteUserController");
const updateUser = require("../controllers/updateUserController");
const login = require("../controllers/loginController");

//----------------- blogs controllers -----------------//
const getBlogs = require("../controllers/getBlogsController");
const addBlog = require("../controllers/addBlogController");

const joiUserSchema = require("../joiUserSchema").userSchema;
const joiLoginSchema = require("../joiUserSchema").loginSchema;
const joiValidation = require("../joiValidation"); // ely rage3 mn de = function
const guards = require("../guards"); 

//------------------ users Routes -------------------//
route.get("/users" , guards , getUsers )
route.post("/adduser" , joiValidation(joiUserSchema) , addUser)
route.delete("/delete/:id" , deleteUser)
route.put("/update/:id", updateUser)
route.post("/login", joiValidation(joiLoginSchema) , login)

//------------------ Blogs Routes -------------------//
route.get("/blogs" , getBlogs )
route.post("/addblog" , addBlog )

module.exports = route;

