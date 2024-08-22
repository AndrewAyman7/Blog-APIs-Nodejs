const { signUp, login } = require("../controllers/authController");
const joiValidation = require("../middlewares/validations/joiValidation");
const { signUpSchema, loginSchema } = require("../middlewares/validations/validSchema");

const authRouter = require("express").Router();

authRouter.post("/signup" , joiValidation(signUpSchema) , signUp);
authRouter.post("/login" , joiValidation(loginSchema) , login)

module.exports = authRouter;