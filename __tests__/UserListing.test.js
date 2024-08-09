const request = require("supertest")
const app = require("../src/app")
const sequelize = require("../config/database")
const User = require("../src/user/User")

const getUser = (id) => {
    return request(app).get(`/api/1.0/users/${id}`)
}
const getUsers = () => {
    return request(app).get('/api/1.0/users')
}
const addUsers = async (activeUserCount, inactiveUserCount = 0) => {
    for (let i = 0; i < activeUserCount + inactiveUserCount; i++) {
        await User.create({
            username: `user${i + 1}`,
            email: `user${i + 1}@email.com`,
            inactive: i >= activeUserCount
        })
    }
}
beforeAll(async () => {
    await sequelize.sync()
})
beforeEach(() => {
    return User.destroy({ truncate: true })
})

describe('UserListing', () => {

    it('returns 200 ok status when there are no users in db', async () => {
        const response = await request(app).get('/api/1.0/users')
        expect(response.status).toBe(200)
    })

    it('returns page object as response body', async () => {
        const response = await getUsers()
        expect(response.body).toEqual({
            content: [],
            page: 0,
            size: 10,
            totalPages: 0
        })
    })
    it('returns 10 users when there are 11 eleven users in db', async () => {
        await addUsers(11)

        const response = await getUsers()
        expect(response.body.content.length).toBe(10)
    })

    it('returns 6  users there 6 active users and 5 inactive users in db', async () => {
        await addUsers(6, 5)

        const response = await getUsers()
        expect(response.body.content.length).toBe(6)
    })
    it('returns id,username and email from db', async () => {
        await addUsers(1)

        const response = await getUsers()
        const user = response.body.content[0]
        expect(Object.keys(user)).toEqual(['id', 'username', 'email'])
    })
    it('returns 2 pages when there are 15 active users and 7 inactive users in db', async () => {
        await addUsers(15, 7)
        const response = await getUsers()
        expect(response.body.totalPages).toBe(2)
    })
    it('returns next page when the current page number is 1', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ page: 1 })
        expect(response.body.content[0].username).toBe('user11')
        expect(response.body.page).toBe(1)
    })
    it('returns first page when page number below 0', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ page: -1 })
        expect(response.body.page).toBe(0)
    })
    it('returns 5 users and related size indicator when size is set to 5', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ size: 5 })
        expect(response.body.content.length).toBe(5)
        expect(response.body.size).toBe(5)
    })
    it('returns 10 users and related size indicator when size is set to 100', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ size: 100 })
        expect(response.body.content.length).toBe(10)
        expect(response.body.size).toBe(10)
    })
    it('returns 10 users and related size indicator when size is set to 0', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ size: 0 })
        expect(response.body.content.length).toBe(10)
        expect(response.body.size).toBe(10)
    })
    it('returns 10 users and related size indicator and page is 0 when size is set to a non numeric value', async () => {
        await addUsers(15, 7)
        const response = await getUsers().query({ size: 'size' })
        expect(response.body.content.length).toBe(10)
        expect(response.body.size).toBe(10)
        expect(response.body.page).toBe(0)
    })
})

describe('Get User', () => {

    it('returns a 404 error when user is not found', async () => {
        const response = await getUser(5)
        expect(response.status).toBe(404)
    })
    it('returns an error message when user is not found', async () => {
        const response = await getUser(5)

        expect(response.body.message).toBe('User not found')
    })
    it('returns 200 OK when user is found', async () => {
        const user = await User.create({
            username: `user1`,
            email: `user1@email.com`,
            inactive: false
        })
        const response = await getUser(user.id)

        expect(response.status).toBe(200)
    })
})