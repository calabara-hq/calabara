const { expect } = require('chai')
const { process_thread } = require('../../middlewares/twitter-middleware')

describe('process thread', async (done) => {

    it('null thread', async () => {

        const thread = null
        let processed = process_thread(thread)
        expect(processed).to.eql(thread)

    })

    it('empty thread', async () => {

        const thread = []
        let processed = process_thread(thread)
        expect(processed).to.eql(thread)

    })

    it('single tweet no media', async () => {

        const thread = [
            { text: 'tweet1' }
        ]

        let processed = process_thread(thread)
        expect(processed).to.eql(thread)

    })

    it('thread no media', async () => {

        const thread = [
            { text: 'tweet1' },
            { text: 'tweet2' },
            { text: 'tweet3' },
        ]

        let processed = process_thread(thread)
        expect(processed).to.eql(thread)

    })


    it('single tweet with media', async () => {

        const thread = [
            {
                text: 'tweet1',
                media: {
                    media_id: 1,
                    url: 'xyz.com',
                    preview: 'blob'
                }
            }
        ]

        let processed = process_thread(thread)
        expect(processed).to.eql([{ text: thread[0].text, media: { media_ids: [1] } }])

    })


    it('thread with media', async () => {

        const thread = [
            {
                text: 'tweet1',
                media: {
                    media_id: 1,
                    url: 'xyz.com',
                    preview: 'blob'
                }
            },
            {
                text: 'tweet2',
                media: {
                    media_id: 2,
                    url: 'xyz.com',
                    preview: 'blob'
                }
            },
            {
                text: 'tweet2',
                media: {
                    media_id: 3,
                    url: 'xyz.com',
                    preview: 'blob'
                }
            }
        ]

        let processed = process_thread(thread)
        expect(processed).to.eql([
            {
                text: thread[0].text,
                media: { media_ids: [1] }
            },
            {
                text: thread[1].text,
                media: { media_ids: [2] }
            },
            {
                text: thread[2].text,
                media: { media_ids: [3] }
            }
        ])

    })


    done()

})