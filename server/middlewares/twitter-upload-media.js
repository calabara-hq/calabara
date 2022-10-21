const OAuth = require('oauth-1.0a')
const crypto = require('crypto')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const { TwitterApi } = require('twitter-api-v2')
const MEDIA_ENDPOINT_URL = 'https://upload.twitter.com/1.1/media/upload.json'

const CONSUMER_KEY = process.env.TWITTER_API_KEY
const CONSUMER_SECRET = process.env.TWITTER_API_SECRET
const APP_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY
const APP_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET


const token = {
    key: APP_KEY,
    secret: APP_SECRET,
}



const oauth = OAuth({
    consumer: {
        key: CONSUMER_KEY,
        secret: CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})




// get file type, size, category
// categories => tweet_image, tweet_video, tweet_gif

const pre_process = (file) => {
    console.log(file)
    let media_type = 'image/png'//file.media_type;
    let size = file.size;
    let category = 'tweet_image'
    return { media_type: media_type, size: size, category: category }
}



const upload_init = async (file_data) => {


    let request_data = {
        url: MEDIA_ENDPOINT_URL,
        method: 'POST',
        data: {
            command: 'INIT',
            media_type: file_data.media_type,
            total_bytes: file_data.size,
            media_category: file_data.category
        }
    }

    //const signature = oauth.toHeader(oauth.authorize(request_data, token))

    const response = await axios({
        url: request_data.url,
        method: request_data.method,
        data: '',
        headers: oauth.toHeader(oauth.authorize(request_data, token)),
        params: request_data.data
    })

    const media_id = response.data.media_id_string
    console.log(response.data)
    return media_id

    /*
        const body = percentEncode(querystring.stringify(request_data.data))
    
        return fetch(request_data.url, request_data, )
    */

}



const upload_append = async (media_id, file_data, file) => {
    let chunk_id = 0
    let segment_size = 0

    const file_path = path.normalize(path.join(__dirname, '../', file.path))

    console.log('multer size: ', file_data.size)
    const { size } = fs.statSync(file_path);
    console.log('fs size: ', size)



    let stream = fs.createReadStream(file_path, { highWaterMark: 1024 })

    stream.on('data', async (chunk) => {
        segment_size += chunk.length
        //console.log(chunk.toString())
        console.log('streaming chunk with size: ', chunk.length)
        const request_data = {
            url: MEDIA_ENDPOINT_URL,
            method: 'POST',
            data: {
                command: 'APPEND',
                media_id: null,
                segment_index: chunk_id,
                media: chunk.toString()
            }
        }


        try {
            const response = await axios({
                url: request_data.url,
                method: request_data.method,
                headers: oauth.toHeader(oauth.authorize(request_data, token)),
                params: request_data.data
            })
        } catch (err) {
            console.log(err)
        }


        chunk_id += 1
    })


    stream.on('end', async () => {
        console.log('\ntotal segment size: ', segment_size)
        console.log('multer size: ', file_data.size)
        const { size } = fs.statSync(file_path, { encoding: "base64" });
        console.log('fs size: ', size)
        /*
        const request_data = {
            url: MEDIA_ENDPOINT_URL,
            method: 'POST',
            data: {
                command: 'FINALIZE',
                media_id: media_id,
            }
        }

        const response = await axios({
            url: request_data.url,
            method: request_data.method,
            headers: oauth.toHeader(oauth.authorize(request_data, token)),
            params: request_data.data
        })
        console.log(response)
        */
    })


}



async function uploadTwitterMedia(req, res, next) {

    const client = new TwitterApi({ appKey: CONSUMER_KEY, appSecret: CONSUMER_SECRET, accessToken: APP_KEY, accessSecret: APP_SECRET })
    const file_path = path.normalize(path.join(__dirname, '../', req.file.path))

    const media_id = await client.v1.uploadMedia(file_path, { additionalOwners: [req.session.twitter.user.id] })

    req.file.media_id = media_id

    next();
}


module.exports = { uploadTwitterMedia }