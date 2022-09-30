require('dotenv').config()
const { registerUser, sendEmail } = require('logical-echo-logic')
const { handleError } = require('./helpers')
const crypto = require('crypto')

module.exports = async (req, res) => {
    const { body: { name, username, email, password } } = req 

    try {
        await registerUser(name, username, email, password)

        // const registration_token = crypto.randomBytes(32).toString("hex")

        // await req.redis.set(username, JSON.stringify(registration_token), "EX", 21600)

        // const verify_email_url = `${process.env.BASE_URL}/users/${username}/verify/${registration_token}`

        // await sendEmail({
        //     to: email,
        //     from: process.env.SMTP_USER,
        //     subject: "Verify Your Email Address",
        //     template: "verify-email-address",
        //     templateVars: {
        //         name,
        //         verify_email_url
        //     }
        // })
        
        res.status(201).send()
    } catch (error) {
        handleError(error, res)
    }
}