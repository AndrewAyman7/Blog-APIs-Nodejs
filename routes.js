const router = require("express").Router();
const { signUp, login } = require("./controllers/authController");
const { isAdmin, isAdminOrUserHimself, verifyToken } = require("./controllers/guards");
const { addPost, addPostNoImg, getPosts, getPostById, deletePost, updatePost, updatePostWithImg, toggleLike } = require("./controllers/postController");
const { getUsers, getUserById, updateUser, countUsers, deleteUser, getUserProfileById } = require("./controllers/userController");
const { addComment, getAllComments, getUserComments, deleteComment, updateComment, getPostComments } = require("./controllers/commentsController");
const validation = require("./validations/joiValidation");
const { loginSchema, postSchema, updatePostSchema, updateCommentSchema, commentSchema, categorySchema } = require("./validations/validSchema");
const { validateObjectId } = require("./validations/validations");
const { addCategory, getCategories } = require("./controllers/categoryController");
const signupSchema = require("./validations/validSchema").signUpSchema;
const uploadProfile = require("./controllers/imgsController").uploadProfile;
const uploadMW = require("./controllers/imgsController").uploadMW;


// Auth & Users
router.post("/api/auth/signup" , validation(signupSchema) , signUp);

router.post("/api/auth/login" , validation(loginSchema) , login);

router.get("/api/users" , isAdmin , getUsers);

router.get("/api/users/count" , isAdmin, countUsers);

router.get("/api/users/:id" , validateObjectId , getUserById);

router.put("/api/users/:id" , validateObjectId, isAdminOrUserHimself, updateUser);

router.delete("/api/user/:id" , validateObjectId, isAdminOrUserHimself , deleteUser);

router.post("/api/user/upload-photo" , verifyToken , uploadMW.single("image") , uploadProfile );


// Posts
router.post("/api/posts" , verifyToken , validation(postSchema) , addPostNoImg);
router.post("/api/postsimg" , verifyToken , uploadMW.single("image") , validation(postSchema) , addPost);
router.get("/api/posts" , getPosts);
router.get("/api/posts/:id" , validateObjectId , getPostById);
router.delete("/api/posts/:id" , verifyToken , deletePost);
router.put("/api/posts/:id" , verifyToken , validation(updatePostSchema) , updatePost); 
router.put("/api/posts/img/:id" , verifyToken  , uploadMW.single("image") , validation(updatePostSchema) , updatePostWithImg);
router.put("/api/posts/like/:id" , verifyToken , toggleLike);
router.get("/api/user/profile/:id" , getUserProfileById);

// Comments & Categories
router.post("/api/comments/post/:id" , verifyToken , validation(commentSchema) ,addComment);
router.get("/api/comments/posts" , isAdmin, getAllComments);
router.get("/api/comments/user/:id" , isAdminOrUserHimself, getUserComments);
router.delete("/api/comment/:id" , verifyToken, deleteComment);
router.put("/api/comment/:id" , verifyToken , validation(updateCommentSchema) , updateComment);
router.get("/api/comments/post/:id" , getPostComments);
router.post("/api/category" , isAdmin , validation(categorySchema) , addCategory);
router.get("/api/category" ,  getCategories);

module.exports = router;