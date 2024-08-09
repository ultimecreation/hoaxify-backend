const express = require('express')
const UserService = require('./UserService')
const { validationResult } = require('express-validator')

const Validator = require('../middleware/Validator')
const Paginator = require('../middleware/Paginator')
const router = express.Router()


router.post('/api/1.0/users',
    Validator.validateIncomingFieldsOnRegistration,
    async (req, res) => {
        const errors = validationResult(req).array()

        if (errors.length > 0) {
            const validationErrors = {}
            errors.forEach(error => validationErrors[error.path] = req.t(error.msg))
            return res.status(400).send({ validationErrors })
        }

        try {
            await UserService.save(req.body)
            return res.status(200).send({ message: "user_create_success" })
        } catch (error) {
            return res.status(502).send()
        }
    })

router.post(`/api/1.0/users/token/:token`, async (req, res) => {
    const token = req.params.token
    await UserService.activate(token)
    res.send()
})

router.get('/api/1.0/users', Paginator.getPagination, async (req, res) => {
    const { page, size } = req.pagination
    const users = await UserService.getUsers(page, size)
    return res.status(200).send(users)
})

router.get('/api/1.0/users/:userId', async (req, res) => {
    const { userId } = req.params
    const userFound = await UserService.getUser(userId)
    if (!userFound) {
        return res.status(404).send({ message: "User not found" })
    }
    return res.status(200).send(userFound)
})

module.exports = router