const User = require('./User')
const bcryptjs = require('bcryptjs')
const save = async (body) => {
    const { username, email, password } = body
    const hashedPassword = await bcryptjs.hashSync(password, 10)
    const newUser = {
        username,
        email,
        password: hashedPassword
    }
    await User.create(newUser)
}

const findByEmail = async (email) => {
    return await User.findOne({ where: { email } })
}

module.exports = {
    save, findByEmail
}