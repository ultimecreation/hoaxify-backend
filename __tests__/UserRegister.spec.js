const request = require("supertest")
const app = require("../src/app")
const User = require("../src/user/User")
const sequelize = require("../config/database")
const en = require('../locales/en/translation.json');


beforeAll(() => {
    return sequelize.sync()
})
beforeEach(() => {
    return User.destroy({ truncate: true })
})
const validUser = {
    username: "user 1",
    email: "user1@email.com",
    password: "123456"
}

const postUser = (user, options = {}) => {
    const agent = request(app).post('/api/1.0/users')
    if (options.language) {
        agent.set('Accept-Language', options.language)
    }
    return agent.send(user)
}
describe('User register', () => {


    it('Returns 200 OK when signup request is valid ', async () => {
        const response = await postUser(user = validUser, { language: 'en' })
        expect(response.status).toBe(200)
    })

    it('Returns success message when signup request is valid ', async () => {
        const response = await postUser(user = validUser, { language: 'en' })
        expect(response.body.message).toBe("user_create_success")
    })

    it('Saves the user to db', async () => {
        await postUser(user = validUser, { language: 'en' })
        // check if user is in db
        const userList = await User.findAll()
        expect(userList.length).toBe(1)
    })

    it('Saved proper user values in db', async () => {
        await postUser(user = validUser, { language: 'en' })
        // check if user is in db
        const userList = await User.findAll()
        const savedUser = userList[0]
        expect(savedUser.username).toBe("user 1")
    })

    it('Hashes the password saved in db', async () => {
        await postUser(user = validUser, { language: 'en' })
        // check if user is in db
        const userList = await User.findAll()
        const savedUser = userList[0]
        expect(savedUser.password).not.toBe("123456")
    })

    it('Returns 400 error when invalid username is null', async () => {
        const response = await postUser({
            username: null,
            email: "user1@email.com",
            password: "123456"
        }, { language: 'en' })
        expect(response.status).toBe(400)
    })

    it('Returns validation errors object', async () => {
        const { body } = await postUser({
            username: null,
            email: "user1@email.com",
            password: "123456"
        }, { language: 'en' })
        expect(body.validationErrors).not.toBeUndefined()
    })

    it('Returns validation error if username is null', async () => {
        const { body } = await postUser({
            username: null,
            email: "user1@email.com",
            password: "123456"
        }, { language: 'en' })
        expect(body.validationErrors.username).toBe(en.username_null)
    })

    it('Returns validation error if email is null', async () => {
        const { body } = await postUser({
            username: "user 1",
            email: null,
            password: "123456"
        }, { language: 'en' })
        expect(body.validationErrors.email).toBe(en.email_null)
    })

    it('Returns validation error if password is null', async () => {
        const { body } = await postUser({
            username: "user 1",
            email: "user1@gmail.com",
            password: null
        }, { language: 'en' })
        expect(body.validationErrors.password).toBe(en.password_null)
    })

    it('Returns validation error if email,username and password are null', async () => {
        const { body } = await postUser({
            username: null,
            email: null,
            password: null
        }, { language: 'en' })
        expect(body.validationErrors.username).toBe(en.username_null)
        expect(body.validationErrors.email).toBe(en.email_null)
        expect(body.validationErrors.password).toBe(en.password_null)
    })

    it('Returns email in use when email is already used', async () => {
        await User.create({ ...validUser })

        const { body } = await postUser(validUser, { language: 'en' })
        expect(body.validationErrors.email).toBe(en.email_inuse)
    })
})

describe('Internalization', () => {


})