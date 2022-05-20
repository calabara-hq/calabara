const { clean } = require('../helpers/common');
const db = require('../helpers/db-init.js')


function isAdmin(req, res, next) {
  const { ens } = req.body;
  const user = req.user;

  if (ens == null) return res.sendStatus(401);


  db.query('select addresses from organizations where ens = $1', [ens], (err, result) => {

    if (err) return res.sendStatus(401)
    let admins = clean(result)
    
    // if !admins, it's a new organization
    if (admins) {
      let is_admin = admins.addresses.includes(user.address);

      if (!is_admin) return res.status(403).send('error')

      req.user.isAdmin = is_admin;
    }
    else {
      req.user.isAdmin = true;
      req.user.isNewOrganization = true;
    }

    next();

  })
}

module.exports.isAdmin = isAdmin;