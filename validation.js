//Validation
const joi = require('@hapi/joi');

const registerValidation = (data) => {
    const userValidationSchema = joi.object({
        email : joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
        firstName : joi.string()
            .min(1)
            .required(),
        lastName : joi.string(),
        //Password: 8-20 char length, one lower case, one upper case,
        //one number, and one special char
        password : joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"))
    });
   return userValidationSchema.validate(data);   
}

const loginValidation = (data) => {
    const userValidationSchema = joi.object({
        email : joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
        //Password: 8-20 char length, one lower case, one upper case,
        //one number, and one special char
        password : joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"))
    });
   return userValidationSchema.validate(data);   
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;



