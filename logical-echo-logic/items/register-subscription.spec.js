require('dotenv').config()

const { expect } = require('chai')
const registerSubscription = require('./register-subscription')
const { mongoose, models: { Subscription, User } } = require('logical-echo-data')
const { ConflictError, FormatError } = require('logical-echo-errors')

const { env: { MONGO_URL } } = process

describe('registerSubscription', () => {
    before(() => mongoose.connect(MONGO_URL))

    beforeEach(() => Subscription.deleteMany())

    let user, userId 

    beforeEach(async () => {
        user = {
            name: 'Wendy Pan',
            username: 'wendypan',
            password: '123123123'
        }

        const user2 = await User.create(user)
        
        userId = user2.id
    })

    it('should suceed with new subscription', async () => {
        const user_id = userId
        const email = 'igluit3@gmail.com'

        const subscription = { user_id, email }

        const res = await registerSubscription(subscription)
            
        expect(res).to.be.undefined

        const registered = await Subscription.findOne({ email })
     
        expect(registered).to.exist
        expect(registered.user_id).to.equal(user_id)
        expect(registered.email).to.equal(email)  
    })

    describe('when subscription already exists', () => {
        let subscription 

        beforeEach(() => {
            subscription = {
                user_id: userId,
                email: 'igluit3@gmail.com'
            }

            return Subscription.create(subscription) 
        })

        it('should fail when subscription already exists', async () => {
            const { email } = subscription
            try {
                await registerSubscription(subscription)

                throw new Error('should not reach this point')

            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceOf(ConflictError) 
                expect(error.message).to.equal(`subscription with email ${email} already exists`)
            }
        })
    })

    describe('when parameters are not valid', () => {
        describe('when user_id is not valid', () => {
            it('should fail when user-id is not a string', () => {
                expect(() => registerSubscription(true, 'igluit3@gmail.com')).to.throw(TypeError, 'user-id is not a string')

                expect(() => registerSubscription(123, 'igluit3@gmail.com')).to.throw(TypeError, 'user-id is not a string')

                expect(() => registerSubscription({}, 'igluit3@gmail.com')).to.throw(TypeError, 'user-id is not a string')

                expect(() => registerSubscription(() => {}, 'igluit3@gmail.com')).to.throw(TypeError, 'user-id is not a string')

                expect(() => registerSubscription([], 'igluit3@gmail.com')).to.throw(TypeError, 'user-id is not a string')
            })

            it('should fail when user-id is empty or blank', () => {
                expect(() => registerSubscription('', 'igluit3@gmail.com')).to.throw(FormatError, 'user-id is empty or blank')

                expect(() => registerSubscription('   ', 'igluit3@gmail.com')).to.throw(FormatError, 'user-id is empty or blank')
            })

            it('should fail when user-id has spaces', () => {
                expect(() => registerSubscription(' abcd1234abcd1234abcd1234 ', 'igluit3@gmail.com')).to.throw(FormatError, 'user-id has blank spaces')

                expect(() => registerSubscription('abcd 1234abc d1234abc d1234', 'igluit3@gmail.com')).to.throw(FormatError, 'user-id has blank spaces')
            })

            it('should fail when user-id length is different from 24 characters', () => {
                expect(() => registerSubscription('abc', 'igluit3@gmail.com')).to.throw(FormatError, 'user-id does not have 24 characters')
            })
        })

        describe('when email is not valid', () => {
            it('should fail when email is not a string', () => {
                expect(() => registerSubscription('abcd1234abcd1234abcd1234', true)).to.throw(TypeError, 'email is not a string')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', 123)).to.throw(TypeError, 'email is not a string')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', {})).to.throw(TypeError, 'email is not a string')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', () => {})).to.throw(TypeError, 'email is not a string')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', [])).to.throw(TypeError, 'email is not a string')
            })

            it('should fail when email is empty or blank', () => {
                expect(() => registerSubscription('abcd1234abcd1234abcd1234', '')).to.throw(FormatError, 'email is empty or blank')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', '   ')).to.throw(FormatError, 'email is empty or blank')
            })

            it('should fail when email has spaces', () => {
                expect(() => registerSubscription('abcd1234abcd1234abcd1234', '  igluit3@gmail.com  ')).to.throw(FormatError, 'email has blank spaces')

                expect(() => registerSubscription('abcd1234abcd1234abcd1234', 'iglu it3@gma il.com')).to.throw(FormatError, 'email has blank spaces')
            })
        })
    })
    
    after(async () => {
        await Subscription.deleteMany()
        
        await mongoose.disconnect()
    })
})