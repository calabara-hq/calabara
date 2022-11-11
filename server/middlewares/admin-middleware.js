const { clean } = require('../helpers/common');
const db = require('../helpers/db-init.js')


function isAdmin(req, res, next) {
  const { ens } = req.body;

  if (ens == null) return res.sendStatus(401);


  db.query('select addresses from organizations where ens = $1', [ens], (err, result) => {

    if (err) return res.sendStatus(401)
    let admins = clean(result)

    // if !admins, it's a new organization
    if (admins) {
      let is_admin = admins.addresses.includes(req.session.user.address);
      console.log('IS ADMIN', is_admin)
      if (!is_admin) return res.sendStatus(403)

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