const joi = require("joi");

userSchema = {
    body: joi.object().required().keys({
        name: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required()
    })
}

loginSchema = {
    body: joi.object().required().keys({
        email: joi.string().required().email(),
        password: joi.string().required()
    })
}

module.exports = {userSchema, loginSchema } ;