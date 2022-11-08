
function clean(data) {
  if (data.rows.length == 0) { return null }
  else if (data.rows.length == 1) { return data.rows[0] }
  else { return data.rows }

}

// adjust db result to make sure we always get data in an array or null.
const asArray = (data) => {
  if (Array.isArray(data)) {
    return data
  }
  else if (data != null) {
    return [data]
  }
  return []

}

const shuffleArray = (array) => {
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

// asynchronously "loop" an array and apply callback to each item in order
const serializedLoop = async (arr, callback) => {
  await arr.reduce(async (previousPromise, item) => {
    await previousPromise
    return callback(item)
  }, Promise.resolve())
}




module.exports = {
  clean,
  asArray,
  shuffleArray,
  serializedLoop
}