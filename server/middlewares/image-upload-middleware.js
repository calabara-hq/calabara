const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const logger = require('../logger').child({ service: 'middleware:image_upload' })


dotenv.config();


const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'contest-assets/staging/media',
  filename: (req, file, cb) => {
    cb(null, '_' + new Date().toISOString() + '_'
      + path.extname(file.originalname))
  }
});


const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|svg|gif)$/)) {
      logger.log({ level: 'error', message: 'user attempted to upload unsupported media type' })
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})


const twitterMediaUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, cb) {
    console.log('file too large', file.size)
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      logger.log({ level: 'error', message: 'user attempted to upload unsupported media type' })
      return cb(new Error('Please upload a Image'))
    }

    cb(undefined, true)
  }
})

const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    logger.log({ level: 'error', message: 'media file is too large' })
    res.sendStatus(413)
  }
  else {
    next()
  }
}


module.exports = { imageUpload, twitterMediaUpload, fileSizeLimitErrorHandler }