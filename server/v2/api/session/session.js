const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
require('dotenv').config({ path: __dirname + '/./../../../.env' })
const db = require('../../services/organizations/database/db.js')

const sessionStore = new pgSession({ pool: db })


let sess = {
  name: 'calabara.sid',
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  signed: true,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}


if (process.env.NODE_ENV === 'production') {
  sess.cookie = {
    secure: true,
    sameSite: 'lax',
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

module.exports = secure_session

