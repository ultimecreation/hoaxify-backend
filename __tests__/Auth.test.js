const request = require("supertest")
const app = require("../src/app")
const sequelize = require("../config/database")
const User = require("../src/user/User")
const bcryptjs = require('bcryptjs')

const addUser = async (inactive = true) => {
    const user = {
        username: 'user1',
        email: 'user1@email.com',
        password: await bcryptjs.hashSync('123456', 10),
        inactive: inactive === true ? true : false
    }

    return await User.create(user)
}
const postAuth = async (credential) => {
    return await request(app).post('/api/1.0/auth').send(credential)
}
beforeAll(async () => {
    await sequelize.sync()
})
beforeEach(async () => {
    await User.destroy({ truncate: true })
})
describe('Auth', () => {

    it('return 200 OK when credentials are correct', async () => {
        await addUser(inactive = false)
        const response = await postAuth({ email: 'user1@email.com', password: '123456' })
        expect(response.status).toBe(200)
    })

    it('returns 400 on empty password or empty email along with error messages', async () => {
        const response = await postAuth({ email: '', password: '' })
        expect(response.status).toBe(400)
        expect(response.body.validationErrors.email).toBe('email_null')
        expect(response.body.validationErrors.password).toBe('password_null')
    })

    it('returns 401 on invalid email', async () => {
        const user = await addUser()
        const response = await postAuth({ email: 'user@email.com', password: '123456' })

        expect(response.status).toBe(401)
    })

    it('returns 401 on invalid password', async () => {
        const response = await postAuth({ email: 'user1@email.com', password: '12345' })

        expect(response.status).toBe(401)
    })

    it('returns 403 on login when user is inactive', async () => {
        await addUser()
        const response = await postAuth({ email: 'user1@email.com', password: '123456' })

        expect(response.status).toBe(401)
    })

    it('return user id and username on login success', async () => {
        const user = await addUser(inactive = false)
        const response = await postAuth({ email: 'user1@email.com', password: '123456' })

        expect(response.body.id).toBe(user.id)
        expect(Object.keys(response.body)).toEqual(['id', 'username'])
    })

})