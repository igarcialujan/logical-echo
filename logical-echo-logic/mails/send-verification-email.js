// import sendEmail from './mailer'


// export default {
//   sendVerificationEmail: (parent, args, context) => {
//     const customerId = generateId()

//     await Customers.insertOne({ _id: customerId, ...args.customer })
    
//     await sendEmail({
//       to: 'admin@myapp.com',
//       from: 'support@myapp.com',
//       subject: 'You have a new customer!',
//       text: 'Hooray! A new customer has signed up for the app.'
//     })

//     return true
//   }
// }