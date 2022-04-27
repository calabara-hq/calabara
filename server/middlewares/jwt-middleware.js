const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports.authenticateToken = authenticateToken;