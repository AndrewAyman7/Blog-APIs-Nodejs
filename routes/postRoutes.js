const { addPost, addPostNoImg, getPosts, getPostById, countPosts, deletePost, updatePost, updatePostWithImg, toggleLike } = require("../controllers/postController");
const { verifyToken } = require("../middlewares/guards/guards");
const { uploadMW } = require("../middlewares/upload images/uploadimgMw");
const joiValidation = require("../middlewares/validations/joiValidation");
const { validateObjectId } = require("../middlewares/validations/validations");
const { postSchema, updatePostSchema } = require("../middlewares/validations/validSchema");

const postRouter = require("express").Router();

postRouter.post("/" ,  joiValidation(postSchema), verifyToken, addPostNoImg);
postRouter.post("/postimg" , verifyToken , uploadMW.single("image"), joiValidation(postSchema), addPost);
postRouter.get("/" , getPosts);
postRouter.get("/count" , countPosts);
postRouter.get("/:id" ,validateObjectId,  getPostById);
postRouter.delete("/:id" , verifyToken, deletePost);
postRouter.put("/:id" , verifyToken , joiValidation(updatePostSchema), updatePost); 
postRouter.put("/img/:id" , verifyToken  , uploadMW.single("image") , joiValidation(updatePostSchema) , updatePostWithImg);
postRouter.put("/like/:id" , verifyToken, toggleLike);

module.exports = postRouter;