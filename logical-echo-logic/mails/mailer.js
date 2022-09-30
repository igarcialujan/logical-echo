require('dotenv').config()
const nodemailer = require("nodemailer")
const fs = require("fs")
const ejs = require("ejs")
const { htmlToText } = require("html-to-text")
const juice = require("juice")
const crypto = require('crypto')

// let testAccount = await nodemailer.createTestAccount()

// let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: testAccount.user, // generated ethereal user
//         pass: testAccount.pass // generated ethereal password
//     }
// })

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     service: process.env.SMTP_SERVICE,
//     port: process.env.SMTP_PORT,
//     secure: process.env.NODE_ENV !== "development",
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     },
//     // tls: {
//     //     rejectUnauthorized: false
//     // }
// })

function sendEmail({ template: templateName, templateVars, ...restOfOptions }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 587,
        secure: process.env.NODE_ENV !== "development",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    console.log(transporter)

    const templatePath = `./templates/${templateName}.html`
    const options = {
        ...restOfOptions
    }

    if (templateName && fs.existsSync(templatePath)) {
        const template = fs.readFileSync(templatePath, "utf-8")
        const html = ejs.render(template, templateVars)
        const text = htmlToText(html)
        const htmlWithStylesInlined = juice(html)
        console.log(htmlWithStylesInlined)
        console.log(text)

        options.html = htmlWithStylesInlined
        options.text = text
    }

    return transporter.sendMail(options)
}

// (async () => {
//     const registration_token = crypto.randomBytes(32).toString("hex")

//     await sendEmail({
//         to: 'igluit3@gmail.com',
//         from: process.env.SMTP_USER,
//         subject: "Verify Your Email Address",
//         template: "verify-email-address",
//         templateVars: {
//             name: 'Ismael García',
//             verify_email_url: `http://localhost:8000/api/igluit/verify/${registration_token}`
//         }
//     })
// })()

// module.exports = sendEmail

// const nodemailer = require("nodemailer")

// const smtp = nodemailer.createTransport({
//   host: 'smtp.mailgun.org',
//   port: 587,
//   secure: process.env.NODE_ENV !== "development",
//   auth: {
//     user: 'postmaster@sandboxe6849da5c8ac4ed7b7497b499d603d11.mailgun.org',
//     pass: 'f54a1cba47e1c9e5061c362b353def47-53ce4923-8266eb6f'
//   }
// })

// export default (options = {}) => {
//     return smtp.sendMail(options)
// }

// const sendEmail = async (email, subject, text) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: process.env.HOST,
//             service: process.env.SERVICE,
//             port: 587,
//             secure: true,
//             auth: {
//                 user: process.env.USER,
//                 pass: process.env.PASS
//             }
//         })

//         await transporter.sendMail({
//             from: process.env.USER,
//             to: email,
//             subject: subject,
//             text: text
//         })

//         console.log("email sent sucessfully")
//     } catch (error) {
//         console.log("email not sent")

//         console.error(error)
//     }
// }

// module.exports = sendEmail