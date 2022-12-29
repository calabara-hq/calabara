const logger = console//require('../logger').child({ service: 'middleware:authentication' })

function authenticateToken(req, res, next) {
    let session = JSON.parse(req.get('Cookie'))
    if (!session || !session?.user?.address) return res.sendStatus(401)
    req.session = session
    next();
}

module.exports.authenticateToken = authenticateToken;