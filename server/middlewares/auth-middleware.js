const dotenv = require('dotenv');
const logger = require('../logger').child({ service: 'middleware:authentication' })
dotenv.config();


function authenticateToken(req, res, next) {
  if (!(req.sessionID && req.session.user)) {
    logger.log({ level: 'info', message: 'user authentication timed out' })
    return res.sendStatus(401)
  }

  next();
}


function testAuthRoute(req, res, next) {
  req.session.user = {
    address: '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1',
  }
  next()
}

module.exports.authenticateToken = process.env.NODE_ENV === 'test' ? testAuthRoute : authenticateToken;