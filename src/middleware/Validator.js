const { body } = require('express-validator')
const UserService = require('../user/UserService')

module.exports = {
    validateIncomingFieldsOnRegistration: [
        body('username')
            .notEmpty()
            .withMessage('username_null'),
        body('email')
            .notEmpty()
            .withMessage("email_null")
            .bail()
            .custom(async email => {
                const userExists = await UserService.findByEmail(email)
                if (userExists) throw new Error("email_inuse")
                return true
            }),
        body('password')
            .notEmpty()
            .withMessage("password_null"),
    ],
    validateIncomingFieldsOnLogin: [
        body('email')
            .notEmpty()
            .withMessage("email_null"),
        body('password')
            .notEmpty()
            .withMessage("password_null"),
    ],

}