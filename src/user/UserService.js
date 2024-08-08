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
    return await User.findOne({ where: { email } })
}

const activate = async (token) => {
    const user = await User.findOne({ where: { activationToken: token } })
    user.inactive = false
    user.activationToken = null
    await user.save()
    console.log({ 'user': user, 'token': token })

}

module.exports = {
    save, findByEmail, activate
}