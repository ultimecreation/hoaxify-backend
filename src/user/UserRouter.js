const express = require('express')
const UserService = require('./UserService')
const router = express.Router()


router.post('/api/1.0/users', async (req, res) => {
    const { username } = req.body

    if (username === null) {
        res.status(400).send()
    }
    await UserService.save(req.body)
    return res.status(200).send({ message: "User created" })
})

module.exports = router