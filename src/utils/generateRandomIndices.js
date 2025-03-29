/**
   Generates a random list of indices from 0 to n.
 */
const generateRandomIndices = (n) => {
  var arr = [];
  while (arr.length < n) {
    var r = Math.floor(Math.random() * n)
    if (arr.indexOf(r) === -1) {
      arr.push(r)
    }
  }
  return arr;
};

export default generateRandomIndices;
