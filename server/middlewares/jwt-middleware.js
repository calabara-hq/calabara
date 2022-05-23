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

  if(!checkCurrentJwt(token)) return res.sendStatus(401)

  jwt.verify(token, JWT_TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(401)

    req.user = user
    console.log(user)
    next()
  })
}

module.exports.authenticateToken = authenticateToken;