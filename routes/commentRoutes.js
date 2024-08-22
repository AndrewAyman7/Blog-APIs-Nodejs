const { addComment, getAllComments, getUserComments, deleteComment, updateComment, getPostComments } = require("../controllers/commentController");
const { verifyToken, isAdmin, isAdminOrUserHimself } = require("../middlewares/guards/guards");
const joiValidation = require("../middlewares/validations/joiValidation");
const { validateObjectId } = require("../middlewares/validations/validations");
const { commentSchema, updateCommentSchema } = require("../middlewares/validations/validSchema");

const commentRouter = require("express").Router();

commentRouter.post("/:id" , joiValidation(commentSchema), validateObjectId, verifyToken ,addComment);
commentRouter.get("/" , isAdmin, getAllComments);
commentRouter.get("/user/:id" , isAdminOrUserHimself, getUserComments);
commentRouter.delete("/:id" , verifyToken, deleteComment);
commentRouter.put("/:id" , verifyToken , joiValidation(updateCommentSchema) , updateComment);
commentRouter.get("/post/:id" , getPostComments);

module.exports = commentRouter;