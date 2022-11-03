const { expect } = require('chai');
const { pull_unregistered_tweets, main_loop, parse_tldr, create_submission } = require('../../sys/cron/register-tweets');
const { get_tweet } = require('../../twitter-client/helpers');
const { expectThrowsAsync } = require('../test-helpers');

// announcement ID = 1587435933066051586
// simple text submission = 1587591713341718529
// image submission = 1587587835552481284
// gif submission = 1587460907357147136

describe('register tweets job', async (done) => {

    /*
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

    it('submission object media thread', async () => {
        let tweet = { tweet_id: "1587460907357147136" }
        let submission_obj = await create_submission(tweet, "1539985534327595008")
        expect(submission_obj.submission_body.blocks.length).to.eql(3)
        expect(submission_obj.submission_body.blocks[0].type).to.eql('paragraph')
        expect(submission_obj.submission_body.blocks[1].type).to.eql('paragraph')
        expect(submission_obj.submission_body.blocks[2].type).to.eql('image')
    })
*/


    it('pull unregistered', async () => {
        let result = await pull_unregistered_tweets();
        console.log(result)
        console.log(result[0].contests)
    })

    done()
})