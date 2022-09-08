const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path')


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
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
})


module.exports.imageUpload = imageUpload;