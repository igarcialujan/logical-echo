require('dotenv').config()
const { expect } = require('chai')
const registerSearch = require('./register-search')
const { mongoose, models: { Search } } = require('logical-echo-data')
const { ConflictError, FormatError } = require('logical-echo-errors')

const { env: { MONGO_URI } } = process

describe('registerSearch', () => {
    before(() => mongoose.connect(MONGO_URI))

    beforeEach(() => Search.deleteMany())

    it('should suceed with new search', async () => {
        const query = 'camiseta'
        const date = new Date()

        const search = { query, date }

        const res = await registerSearch(search)
            
        expect(res).to.be.undefined

        const registered = await Search.findOne({ date })
     
        expect(registered).to.exist
        expect(registered.query).to.equal(query)
        expect(registered.date).to.equal(date)  
    })

    describe('when search already exists', () => {
        let search, searchId 

        beforeEach(async () => {
            search = {
                query: 'camiseta',
                date: new Date()
            }

            const search2 = await Search.create(search)

            searchId = search2.id
        })

        it('should fail when search already exists', async () => {
            try {
                await registerSearch(search)

                throw new Error('should not reach this point')

            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceOf(ConflictError) 
                expect(error.message).to.equal(`search with searchId ${searchId} already exists`)
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