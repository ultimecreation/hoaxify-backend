const app = require("./src/app");
const sequelize = require("./config/database");
const User = require("./src/user/User");
const addUsers = async (activeUserCount, inactiveUserCount = 0) => {
    for (let i = 0; i < activeUserCount + inactiveUserCount; i++) {
        await User.create({
            username: `user${i + 1}`,
            email: `user${i + 1}@email.com`,
            inactive: i >= activeUserCount
        })
    }
}
sequelize.sync()
    .then(async () => {
        await addUsers(18, 12)
    })

app.listen(3000, () => console.log('app is running'))
