/**
   Creates a set of numbers that represent combinations that sum to the sum of
   N and M.  N and M must not be the same.  If N and M are the same, an empty
   set is returned.

   @param {number} N The lower component of a sum
   @param {number} M The upper component of a sum
   @param {object} choiceSet A set of numbers that represent possible choices
 */
const countChoices = (N, M, choiceSet) => {
  if (M === 10) {
    return choiceSet;
  } else if (N === 0) {
    choiceSet.add(M);
    return choiceSet;
  } else {
    choiceSet.add(N);
    choiceSet.add(M);
    return countChoices(N-1, M+1, choiceSet);
  }
}

module.exports = countChoices;
