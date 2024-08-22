const { addCategory, getCategories } = require("../controllers/categoryController");
const { isAdmin } = require("../middlewares/guards/guards");
const joiValidation = require("../middlewares/validations/joiValidation");
const { categorySchema } = require("../middlewares/validations/validSchema");

const categoryRouter = require("express").Router();

categoryRouter.post("/" , isAdmin , joiValidation(categorySchema) , addCategory);
categoryRouter.get("/" ,  getCategories);


module.exports = categoryRouter;