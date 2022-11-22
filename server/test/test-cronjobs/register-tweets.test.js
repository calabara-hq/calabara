const { expect } = require('chai');
const { pull_unregistered_tweets, main_loop, parse_tldr, create_submission } = require('../../sys/cron/register-tweets');
const { get_tweet } = require('../../twitter-client/helpers');
const { expectThrowsAsync } = require('../test-helpers');
const db = require('../../helpers/db-init')

// announcement ID = 1587435933066051586
// simple text submission = 1587591713341718529
// image submission = 1587587835552481284
// gif submission = 1587460907357147136

describe('register tweets job', async (done) => {


    it('parse tldr simple text', async () => {
        let head_tweet = await get_tweet("1587591713341718529")  // get first tweet
        let tldr_result = await parse_tldr(head_tweet)
        expect(tldr_result.tldr_obj.tldr_text).to.eql('my submission')
        expect(tldr_result.tldr_obj.tldr_image).to.eql(null)
        expect(tldr_result.leftover_media).to.eql(null)
    })

    it('parse tldr 1 image', async () => {
        let head_tweet = await get_tweet("1587587835552481284")  // get first tweet
        let tldr_result = await parse_tldr(head_tweet)
        expect(tldr_result.tldr_obj.tldr_text).to.eql('my submission')
        expect(tldr_result.tldr_obj.tldr_image).to.not.eql(null)
        expect(tldr_result.leftover_media).to.eql(null)
    })

    it('parse tldr 1 gif', async () => {
        let head_tweet = await get_tweet("1587460907357147136")  // get first tweet
        let tldr_result = await parse_tldr(head_tweet)
        expect(tldr_result.tldr_obj.tldr_text).to.eql(null)
        expect(tldr_result.tldr_obj.tldr_image).to.not.eql(null)
        expect(tldr_result.leftover_media).to.eql(null)
    })

    it('submission object simple text', async () => {
        let tweet = { tweet_id: "1587591713341718529" }
        let submission_obj = await create_submission(tweet, "1539985534327595008")
        expect(submission_obj.submission_body.blocks.length).to.eql(0)
    })

    it('submission object multi-media thread 1', async () => {
        let tweet = { tweet_id: "1594835095600390146" }
        let submission_obj = await create_submission(tweet, "1539985534327595008")
        try {
            expect(submission_obj.submission_body.blocks.length).to.eql(3)
            expect(submission_obj.submission_body.blocks[0].type).to.eql('image')
            expect(submission_obj.submission_body.blocks[1].type).to.eql('image')
            expect(submission_obj.submission_body.blocks[2].type).to.eql('image')
        } catch (err) {
            console.error('are you sure this tweet was from the last 7 days?')
            expect(1).to.eql(2)
        }
    })

    it('submission object multi-media thread 2', async () => {
        // with a video
        let tweet = { tweet_id: "1594836602278264834" }
        let submission_obj = await create_submission(tweet, "1539985534327595008")
        console.log(submission_obj)
    })

    done()
})