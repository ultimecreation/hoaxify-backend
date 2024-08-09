const express = require('express')
const userRouter = require('../src/user/UserRouter')
const authRouter = require('../src/auth/AuthRouter')
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')

i18next.use(Backend).use(middleware.LanguageDetector).init({
    fallBackLng: 'en',
    lng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
        loadPath: `./locales/{{lng}}/{{ns}}.json`
    },
    detection: {
        lookupHeader: 'accept-language'
    }
})
const app = express()
app.use(middleware.handle(i18next))
app.use(express.json())

app.use(authRouter)
app.use(userRouter)

module.exports = app