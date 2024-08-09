const User = require('./User')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const EmailService = require('../email/emailService')


const generateToken = (length) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length)
}
const save = async (body) => {
    const { username, email, password } = body
    const hashedPassword = await bcryptjs.hashSync(password, 10)
    const activationToken = generateToken(10)
    const newUser = {
        username,
        email,
        password: hashedPassword,
        activationToken
    }
    await User.create(newUser)
    await EmailService.sendAccountActivationEmail(email, activationToken)
}

const findByEmail = async (email) => {
    return await User.findOne({
        where: { email, inactive: false }
    })
}

const activate = async (token) => {
    const user = await User.findOne({ where: { activationToken: token } })
    user.inactive = false
    user.activationToken = null
    await user.save()
}

const getUsers = async (page, size) => {

    const users = await User.findAndCountAll({
        where: { inactive: false },
        attributes: [
            'id', 'username', 'email'
        ],
        limit: size,
        offset: page * size
    })
    return {
        content: users.rows,
        page,
        size,
        totalPages: Math.ceil(users.count / size)
    }
}
const getUser = async (userId) => {

    const user = await User.findOne({
        where: { id: userId, inactive: false },
        attributes: ['id', 'username', 'email']
    })
    return user
}

module.exports = {
    save, findByEmail, activate, getUsers, getUser
}