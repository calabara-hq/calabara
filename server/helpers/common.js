function clean(data) {
    if (data.rows.length == 0) { return null }
    else if (data.rows.length == 1) { return data.rows[0] }
    else { return data.rows }

}

// adjust db result to make sure we always get data in an array or null.
function asArray(data) {
    if (Array.isArray(data)) {
      return data
    }
    else if (data != null) {
      return [data]
    }
    return []
  
  }
  

module.exports = {
    clean,
    asArray
}