const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const dotenv = require('dotenv')
const db = require('../helpers/db-init')

dotenv.config()

const sessionStore = new pgSession({ pool: db })


let sess = {
  name: 'calabara.sid',
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}


if (process.env.NODE_ENV === 'production') {
  sess.cookie = {
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 6 // 6 hours
  }
}

else {
  sess.cookie = {
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 6 // 6 hours
  }
}

const secure_session = session(sess)

module.exports = { secure_session }

