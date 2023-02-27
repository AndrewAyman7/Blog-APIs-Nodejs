const router = require("express").Router();
const signUp = require("./controllers/authController").signUp;
const login = require("./controllers/authController").login;
const validation = require("./validation/joiValidation");
const signUpSchema = require("./validation/validSchema").signUpSchema;
const loginSchema = require("./validation/validSchema").loginSchema;
const updateSchema = require("./validation/validSchema").updateSchema;
const getUsers = require("./controllers/usersController").getUsers;
const getUserById = require("./controllers/usersController").getUserById;
const updateUser = require("./controllers/usersController").updateUser;
const countUsers = require("./controllers/usersController").countUsers;
const {getUserProfileById} = require("./controllers/usersController");

const isAdmin = require("./controllers/guardController").isAdmin;
const isUser = require("./controllers/guardController").isUser;
const { isAdminOrUserHimself } = require("./controllers/guardController");
const { deleteUser } = require("./controllers/usersController");
const { addPost, getPosts, getPostById, countPosts, deletePost, updatePost, toggleLike } = require("./controllers/postController");
const { postSchema, updatePostSchema, commentSchema, updateCommentSchema, categorySchema } = require("./validation/validSchema");
const { addComment, getAllComments, getUserComments, deleteComment, updateComment, getPostComments } = require("./controllers/commentsController");
const { addCategory, getCategories } = require("./controllers/categoryController");

const uploadProfile = require("./controllers/imgsController").uploadProfile;
const uploadMW = require("./controllers/imgsController").uploadMW;


router.post("/api/auth/signup" , validation(signUpSchema), signUp);
router.post("/api/auth/login" , validation(loginSchema) ,login );
router.get("/api/users" , isAdmin , getUsers );
router.get("/api/user/:id" , getUserById);
router.put("/api/user/:id" , isUser , validation(updateSchema), updateUser);
router.get("/api/users/count" , isAdmin, countUsers);
router.delete("/api/user/:id" , isAdminOrUserHimself , deleteUser);

router.post("/api/user/upload-photo" , isUser , uploadMW.single("image") , uploadProfile );

router.post("/api/posts" , isUser , validation(postSchema) , addPost);
router.get("/api/posts" , getPosts);
router.get("/api/posts/count" , countPosts); // Lazem tb2a fo2 el Route ely t7to , el :id -> 3shan lma ad5l klma count myftkrhash :id
router.get("/api/posts/:id" , getPostById);
router.delete("/api/posts/:id" , isUser , deletePost);

router.put("/api/posts/:id" , isUser , validation(updatePostSchema) , updatePost);
router.put("/api/posts/like/:id" , isUser , toggleLike)

router.get("/api/user/profile/:id" , getUserProfileById);

//router.post("/api/posts/comment/:id" , isUser , addComment); 
router.post("/api/comments/post/:id" , isUser , validation(commentSchema) ,addComment);

//router.get("/api/posts/comments" , isAdmin, getAllComments); // Error, Read Below
//Error: Cast to ObjectId failed for value \"comments\", 3shan el api da e3tbr "Comments" = :id, 3shan el Api line 39
router.get("/api/comments/posts" , isAdmin, getAllComments);
router.get("/api/comments/user/:id" , isAdminOrUserHimself, getUserComments);
router.delete("/api/comment/:id" , isUser, deleteComment);
router.put("/api/comment/:id" , isUser , validation(updateCommentSchema) , updateComment);
router.get("/api/comments/post/:id" , getPostComments);

router.post("/api/category" , isAdmin , validation(categorySchema) , addCategory);
router.get("/api/category" ,  getCategories);

module.exports = router;