const { getUsers, getUserById, updateUser, countUsers, uploadProfile, deleteUser } = require("../controllers/usersController");
const { verifyToken, isAdminOrUserHimself, isAdmin } = require("../middlewares/guards/guards");
const { uploadMW } = require("../middlewares/upload images/uploadimgMw");
const joiValidation = require("../middlewares/validations/joiValidation");
const { validateObjectId } = require("../middlewares/validations/validations");
const { updateUserSchema } = require("../middlewares/validations/validSchema");

const userRouter = require("express").Router();

userRouter.get("/" , verifyToken, getUsers);
userRouter.put("/:id" , joiValidation(updateUserSchema),  validateObjectId, isAdminOrUserHimself, updateUser);
userRouter.get("/count" , isAdmin ,countUsers);
userRouter.get("/:id" , validateObjectId, verifyToken, getUserById);
userRouter.post("/upload-photo" , verifyToken , uploadMW.single("image") , uploadProfile);
userRouter.delete("/:id" , validateObjectId, isAdminOrUserHimself , deleteUser);

module.exports = userRouter;
