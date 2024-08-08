const { transporter } = require("../../config/emailTransporter")

const sendAccountActivationEmail = async (email, token) => {
    await transporter.sendMail({
        from: 'john.doe@domain.com',
        to: email,
        subject: 'Account activation',
        text: 'Token is ' + token
    })
}

module.exports = { sendAccountActivationEmail }