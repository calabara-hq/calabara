
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

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}





module.exports = {
  clean,
  asArray,
  shuffleArray
}