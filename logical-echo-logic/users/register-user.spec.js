require('dotenv').config()
const { expect } = require('chai')
const registerUser = require('./register-user')
const { mongoose, models: { User } } = require('logical-echo-data')
const { ConflictError, FormatError } = require('logical-echo-errors')
const bcrypt = require('bcryptjs')

const { env: { MONGO_URI } } = process

describe('registerUser', () => {
    before(() => mongoose.connect(MONGO_URI))

    beforeEach(() => User.deleteMany())

    it('should suceed with new user', async () => {
        const email = 'wendypan@gmail.com'
        const password = '123123123'

        const res = await registerUser(email, password)
            
        expect(res).to.be.undefined

        const user = await User.findOne({ email })
     
        expect(user).to.exist
        expect(user.email).to.equal(email)
        expect(bcrypt.compareSync(password, user.password)).to.be.true      
    })

    describe('when user already exists', () => {
        let user 

        beforeEach(() => {
            user = {
                email: 'wendypan@gmail.com',
                password: '123123123'
            }

            return User.create(user) 
        })

        it('should fail when user already exists', async () => {
            const { email, password } = user

            try {
                await registerUser(email, password)

                throw new Error('should not reach this point')

            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceOf(ConflictError) 
                expect(error.message).to.equal(`user with email ${email} already exists`)
            }
        })
    })

    describe('when parameters are not valid', () => {
        describe('when email is not valid', () => {
            it('should fail when email is not valid', () => {
                expect(() => registerUser(true, '123123123')).to.throw(TypeError, 'email is not valid')

                expect(() => registerUser(123, '123123123')).to.throw(TypeError, 'email is not valid')

                expect(() => registerUser({}, '123123123')).to.throw(TypeError, 'email is not valid')

                expect(() => registerUser(() => {}, '123123123')).to.throw(TypeError, 'email is not valid')

                expect(() => registerUser([], '123123123')).to.throw(TypeError, 'email is not valid')
            })

            it('should fail when email is empty', () => {
                expect(() => registerUser('', '123123123')).to.throw(FormatError, 'email is empty or blank')

                expect(() => registerUser('   ', '123123123')).to.throw(FormatError, 'email is empty or blank')
            })

            it('should fail when email has spaces', () => {
                expect(() => registerUser(' wendypan@gmail.com ', '123123123')).to.throw(FormatError, 'email has blank spaces')

                expect(() => registerUser('wendy pan@gmail.com', '123123123')).to.throw(FormatError, 'email has blank spaces')
            })
        })

        describe('when password is not valid', () => {
            it('should fail when password is not a string', () => {
                expect(() => registerUser('Wendy Pan', 'wendypan', true)).to.throw(TypeError, 'password is not a string')

                expect(() => registerUser('Wendy Pan', 'wendypan', 123)).to.throw(TypeError, 'password is not a string')

                expect(() => registerUser('Wendy Pan', 'wendypan', {})).to.throw(TypeError, 'password is not a string')

                expect(() => registerUser('Wendy Pan', 'wendypan', () => {})).to.throw(TypeError, 'password is not a string')

                expect(() => registerUser('Wendy Pan', 'wendypan', [])).to.throw(TypeError, 'password is not a string')
            })

            it('should fail when password is empty', () => {
                expect(() => registerUser('Wendy Pan', 'wendypan', '')).to.throw(FormatError, 'password is empty or blank')

                expect(() => registerUser('Wendy Pan', 'wendypan', '   ')).to.throw(FormatError, 'password is empty or blank')
            })

            it('should fail when password has spaces', () => {
                expect(() => registerUser('Wendy Pan', 'wendypan', ' 123123123 ')).to.throw(FormatError, 'password has blank spaces')

                expect(() => registerUser('Wendy Pan', 'wendypan', '123 123 123')).to.throw(FormatError, 'password has blank spaces')
            })

            it('should fail when password length is less than 8 characters', () => {
                expect(() => registerUser('Wendy Pan', 'wendypan', '123123')).to.throw(FormatError, 'password has less than 8 characters')
            })
        })
    })
    
    after(async () => {
        await User.deleteMany()
        
        await mongoose.disconnect()
    })
})