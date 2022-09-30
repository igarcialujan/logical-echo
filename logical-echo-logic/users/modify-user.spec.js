require('dotenv').config()
const { expect } = require('chai')
const modifyUser = require('./modify-user')
const { mongoose, models: { User } } = require('logical-echo-data')
const { Types: { ObjectId } } = mongoose
const { CredentialsError, FormatError, ConflictError, NotFoundError } = require('logical-echo-errors')
const bcrypt = require('bcryptjs')

const { env: { MONGO_URI } } = process

describe('modifyUser', () => {
    before(() => mongoose.connect(MONGO_URI))

    beforeEach(() => User.deleteMany())
 
    let user, userId

    beforeEach(async () => {
        user = {
            name: 'Wendy Pan',
            username: 'wendypan',
            email: 'wendypan@gmail.com',
            password: '123123123'
        }

        const user2 = await User.create({ ...user, password: bcrypt.hashSync(user.password) })
        
        userId = user2.id
    })

    it('should succeed with existing id and correct password', async () => {
        let { name, username, password } = user 

        name += '-updated'
        username += '-updated'
        const newPassword = password + '-updated'

        const data = { name, username, password, newPassword }

        const res = await modifyUser(userId, data)

        expect(res).to.be.undefined
    
        const user2 = await User.findById(userId)   

        expect(user2.name).to.equal(name)
        expect(user2.username).to.equal(username)
        expect(user2.password).to.equal(newPassword)
    })

    it('should fail with non-existing id', async () => {
        const { username, password } = user

        const userId = ObjectId().toString()

        try {
            await modifyUser(userId, { username, password })
            
            throw new Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userId} not found`)
        }
    })

    it('should fail with incorrect password', async () => {
        let { username, password } = user

        password += '-wrong'

        const data = { username, password }

        try {
            await modifyUser(userId, data)
            
            throw new Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.equal('wrong password')
        }
    })

    it('should fail when trying to update the username to another that already exists', async () => {
        const user2 = {
            name: 'Peter Pan',
            username: 'peterpan',
            password: '123123123'
        }

        const username = 'peterpan'
        
        const { password } = user

        try {
            await User.create(user2)
                
            await modifyUser(userId, { username, password })
            
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.instanceOf(ConflictError)
            expect(error.message).to.equal(`user with username ${username} already exists`)
        }
    })
    

    describe('when parameters are not valid', () => {
        describe('when id is not valid', () => {
            it('should fail when id is not a string', () => {
                expect(() => modifyUser(true, { })).to.throw(TypeError, 'id is not a string')

                expect(() => modifyUser(123, { })).to.throw(TypeError, 'id is not a string')

                expect(() => modifyUser({}, { })).to.throw(TypeError, 'id is not a string')

                expect(() => modifyUser(() => {}, { })).to.throw(TypeError, 'id is not a string')

                expect(() => modifyUser([], { })).to.throw(TypeError, 'id is not a string')
            })

            it('should fail when id is empty or blank', () => {
                expect(() => modifyUser('', { })).to.throw(Error, 'id is empty or blank')

                expect(() => modifyUser('   ', { })).to.throw(Error, 'id is empty or blank')
            })

            it('should fail when id has spaces', () => {
                expect(() => modifyUser(' abcd1234abcd1234abcd1234 ', { })).to.throw(Error, 'id has blank spaces')

                expect(() => modifyUser('abcd 1234abc d1234abc d1234', { })).to.throw(Error, 'id has blank spaces')
            })
        })

        describe('when data is not valid', () => {
            it('should fail when data is not an object', () => {
                expect(() => modifyUser('abcd1234abcd1234abcd1234', true)).to.throw(TypeError, 'data is not an object')

                expect(() => modifyUser('abcd1234abcd1234abcd1234', 123)).to.throw(TypeError, 'data is not an object')

                expect(() => modifyUser('abcd1234abcd1234abcd1234', '')).to.throw(TypeError, 'data is not an object')

                expect(() => modifyUser('abcd1234abcd1234abcd1234', () => {})).to.throw(TypeError, 'data is not an object')

                expect(() => modifyUser('abcd1234abcd1234abcd1234', [])).to.throw(TypeError, 'data is not an object')
            })
        })

        describe('when properties in data are not valid', () => {
            describe('when name is not valid', () => {
                it('should fail when name is not a string', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: true })).to.throw(TypeError, 'name is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: 123 })).to.throw(TypeError, 'name is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: {} })).to.throw(TypeError, 'name is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: () => {} })).to.throw(TypeError, 'name is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: [] })).to.throw(TypeError, 'name is not a string')
                })

                it('should fail when name is empty', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: '' })).to.throw(FormatError, 'name is empty or blank')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: '   ' })).to.throw(FormatError, 'name is empty or blank')
                })

                it('should fail when name has spaces around', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', name: ' Wendy Pan ' })).to.throw(FormatError, 'blank spaces around name')
                })
            })

            describe('when username is not valid', () => {
                it('should fail when username is not a string', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: true })).to.throw(TypeError, 'username is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: 123 })).to.throw(TypeError, 'username is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: {} })).to.throw(TypeError, 'username is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: () => {} })).to.throw(TypeError, 'username is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: [] })).to.throw(TypeError, 'username is not a string')
                })

                it('should fail when username is empty', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: '' })).to.throw(FormatError, 'username is empty or blank')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: '   ' })).to.throw(FormatError, 'username is empty or blank')
                })

                it('should fail when username has spaces', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: ' wendypan ' })).to.throw(FormatError, 'username has blank spaces')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: 'wendy pan' })).to.throw(FormatError, 'username has blank spaces')
                })

                it('should fail when username length is less that 4 characters', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', username: 'wp' })).to.throw(FormatError, 'username has less than 4 characters')
                })
            })

            describe('when password is not valid', () => {
                it('should fail when password is not a string', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: true })).to.throw(TypeError, 'password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: 123 })).to.throw(TypeError, 'password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: {} })).to.throw(TypeError, 'password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: () => {} })).to.throw(TypeError, 'password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: [] })).to.throw(TypeError, 'password is not a string')
                })

                it('should fail when password is empty', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '' })).to.throw(FormatError, 'password is empty or blank')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '   ' })).to.throw(FormatError, 'password is empty or blank')
                })

                it('should fail when password has spaces', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: ' 123123123 ' })).to.throw(FormatError, 'password has blank spaces')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123 123 123' })).to.throw(FormatError, 'password has blank spaces')
                })

                it('should fail when password length is less that 8 characters', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123' })).to.throw(FormatError, 'password has less than 8 characters')
                })
            })

            describe('when new password is not valid', () => {
                it('should fail when new password is not a string', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: true })).to.throw(TypeError, 'new password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: 123 })).to.throw(TypeError, 'new password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: {} })).to.throw(TypeError, 'new password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: () => {} })).to.throw(TypeError, 'new password is not a string')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: [] })).to.throw(TypeError, 'new password is not a string')
                })

                it('should fail when new password is empty', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: '' })).to.throw(FormatError, 'new password is empty or blank')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: '   ' })).to.throw(FormatError, 'new password is empty or blank')
                })

                it('should fail when new password has spaces', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: ' 123123123 ' })).to.throw(FormatError, 'new password has blank spaces')

                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: '123 123 123' })).to.throw(FormatError, 'new password has blank spaces')
                })

                it('should fail when new password length is less that 8 characters', () => {
                    expect(() => modifyUser('abcd1234abcd1234abcd1234', { password: '123123123', newPassword: '123123' })).to.throw(FormatError, 'new password has less than 8 characters')
                })
            })
        })
    })

    after(async () => {
        await User.deleteMany()

        await mongoose.disconnect()
    })
})