const path = require('path')
const { appClient } = require('../twitter-client/config')




async function uploadTwitterMedia(req, res, next) {
    const file_path = path.normalize(path.join(__dirname, '../', req.file.path))
    const media_id = await appClient.v1.uploadMedia(file_path, { additionalOwners: [req.session.twitter.user.id] })
    req.file.media_id = media_id
    next();
}


module.exports = { uploadTwitterMedia }