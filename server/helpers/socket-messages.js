const { sendSocketMessage } = require('../sys/socket/socket-io');
const db = require('../helpers/db-init')
const { clean } = require('../helpers/common')

const get_contest_config = async (ens, contest_hash) => {
    let params = await db.query('select \
    settings->\'visible_votes\' as visible_votes,\
    settings->\'anon_subs\' as anon_subs,\
    _start, _voting, _end from contests where ens=$1 and _hash = $2', [ens, contest_hash]).then(clean)
    return params
}


// calculate broadcast data

const construct_broadcast_data = async (contest_hash, ens, submission_fields) => {
    const { id, _url, author, votes } = submission_fields;
    const config = await get_contest_config(ens, contest_hash)

    broadcast_data = {
        id: id,
        _url: _url,
        ...(!config.anon_subs && { author: author }),
        ...(config.visible_votes && { votes: votes })
    }

    return broadcast_data

}





const socketSendNewSubmission = async (contest_hash, ens, submission_fields) => {
    const broadcast_data = await construct_broadcast_data(contest_hash, ens, submission_fields)
    try {
        return sendSocketMessage(contest_hash, 'new_submission', broadcast_data)
    } catch (err) { console.log(err) }
}


module.exports = socketSendNewSubmission