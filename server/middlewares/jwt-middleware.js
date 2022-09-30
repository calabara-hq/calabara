const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const jwt_decode = require('jwt-decode');

dotenv.config();
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

const checkCurrentJwt = (token) => {
  try {
    const { exp } = jwt_decode(token);
    if (Date.now() >= exp * 1000) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  if (!checkCurrentJwt(token)) return res.sendStatus(401)

  jwt.verify(token, JWT_TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(401)
    req.user = user
    next()
  })
}

function testAuthRoute(req, res, next) {
  req.user = {
    address: '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1',
  }

  next()
}

module.exports.authenticateToken = process.env.NODE_ENV === 'test' ? testAuthRoute : authenticateToken;