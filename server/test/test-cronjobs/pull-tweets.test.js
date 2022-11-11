const { expect } = require('chai');
const { pull_active_twitter_contests, main_loop, lookup_twitter_user } = require('../../sys/cron/pull-tweets');
const { expectThrowsAsync } = require('../test-helpers');



describe('pull tweets job', async (done) => {
/*
    it('pull active contests', async () => {
        let result = await pull_active_twitter_contests();
        console.log(result)
    })
*/
    /*
        it('get quote tweets', async () => {
            let result = await scan_quote_tweets('1585426821197307904');
            for (const quote of result) {
                console.log(quote)
            }
        })
    
        it('get quote tweets invalid tweet_id', async () => {
            //let result = await scan_quote_tweets(null);
            let result = await scan_quote_tweets(null);
            expect(result).to.eql(null)
        })
    */
    /*
        it('full loop', async () => {
            let result = await main_loop()
        })
    */
    done()
})