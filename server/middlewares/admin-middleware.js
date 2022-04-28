const { clean } = require('../helpers/common');
const db = require('../helpers/db-init.js')


function isAdmin(req, res, next) {
  const {ens} = req.body;
  const user = req.user;

  if (ens == null) return res.sendStatus(401);


    db.query('select addresses from organizations where ens = $1', [ens], (err, result) => {
        
        if(err) return res.sendStatus(401)

        let admins = clean(result)
        let is_admin = admins.addresses.includes(user.address);
     
        if(!is_admin) return res.status(403).send('error')
        
        req.isAdmin = is_admin;
        
        next();

    })
}

module.exports.isAdmin = isAdmin;