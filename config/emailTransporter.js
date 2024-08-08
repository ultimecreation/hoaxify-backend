const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 5857,
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = { transporter }