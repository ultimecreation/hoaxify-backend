const express = require('express')
const UserService = require('../user/UserService')
const bcryptjs = require('bcryptjs')
const Validator = require('../middleware/Validator')
const { validationResult } = require('express-validator')
const router = express.Router()

router.post('/api/1.0/auth', Validator.validateIncomingFieldsOnLogin, async (req, res) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
        const validationErrors = {}
        errors.forEach(error => validationErrors[error.path] = req.t(error.msg))
        return res.status(400).send({ validationErrors })
    }
    const { email, password } = req.body
    const userFound = await UserService.findByEmail(email)
    if (!userFound) {
        return res.status(401).send({ message: 'invalid credentials' })
    }

    const passwordMatch = await bcryptjs.compare(password, userFound.password)
    if (!passwordMatch) {
        return res.status(401).send({ message: 'invalid credentials' })
    }

    return res.status(200).send({ id: userFound.id, username: userFound.username })
})
module.exports = router