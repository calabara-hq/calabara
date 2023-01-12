const { clean } = require('../helpers/common');
const db = require('../helpers/db-init.js');
const logger = require('../logger').child({ service: 'middleware:admin' })


function isAdmin(req, res, next) {
  const { ens } = req.body;

  if (ens == null) {
    logger.log({ level: 'error', message: 'ens is not defined' })
    return res.sendStatus(401);
  }


  db.query('select addresses from organizations where ens = $1', [ens], (err, result) => {

    if (err) {
      logger.log({ level: 'error', message: `access admin addresses for ens: ${ens} failed with error: ${err}` })
      return res.sendStatus(401)
    }
    let admins = clean(result)

    // if !admins, it's a new organization
    if (admins) {
      let is_admin = admins.addresses.includes(req.session.user.address);
      if (!is_admin) {
        logger.log({ level: 'error', message: 'non-admin user attempted to perform elevated action' })
        return res.sendStatus(403)
      }

      req.session.user.isAdmin = is_admin;
    }
    else {
      req.session.user.isAdmin = true;
      req.session.user.isNewOrganization = true;
    }

    next();

  })
}

module.exports.isAdmin = isAdmin;