const request = require("supertest")
const app = require("../src/app")
const User = require("../src/user/User")
const sequelize = require("../config/database")

beforeAll(() => {
    return sequelize.sync()
})
beforeEach(() => {
    return User.destroy({ truncate: true })
})
describe('User register', () => {
    const postValidUser = () => {
        return request(app)
            .post('/api/1.0/users')
            .send({
                username: "user 1",
                email: "user1@email.com",
                password: "123456"
            })
    }

    it('Returns 200 OK when signup request is valid ', async () => {
        const response = await postValidUser()
        expect(response.status).toBe(200)
    })

    it('Returns success message when signup request is valid ', async () => {
        const response = await postValidUser()
        expect(response.body.message).toBe("User created")
    })

    it('Saves the user to db', async () => {
        await postValidUser()
        // check if user is in db
        const userList = await User.findAll()
        expect(userList.length).toBe(1)
    })

    it('Saved proper user values in db', async () => {
        await postValidUser()
        // check if user is in db
        const userList = await User.findAll()
        const user = userList[0]
        expect(user.username).toBe("user 1")

    })
    it('Hashes the password saved in db', async () => {
        await postValidUser()
        // check if user is in db
        const userList = await User.findAll()
        const user = userList[0]
        expect(user.password).not.toBe("123456")
    })

    it('Returns 400 error when invalid username is null', async () => {
        const response = await request(app)
            .post('/api/1.0/users')
            .send({
                username: null,
                email: "user1@email.com",
                password: "123456"
            })
        expect(response.status).toBe(400)
    })
})