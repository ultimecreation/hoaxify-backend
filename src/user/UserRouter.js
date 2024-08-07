const express = require('express')
const UserService = require('./UserService')
const { check, validationResult, body } = require('express-validator')
const User = require('./User')
const router = express.Router()

const validateIncomingFields = [
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
]


router.post('/api/1.0/users',
    validateIncomingFields,
    async (req, res) => {
        const errors = validationResult(req).array()

        if (errors.length > 0) {
            const validationErrors = {}
            errors.forEach(error => validationErrors[error.path] = req.t(error.msg))
            return res.status(400).send({ validationErrors })
        }

        await UserService.save(req.body)
        return res.status(200).send({ message: "user_create_success" })
    })

module.exports = router