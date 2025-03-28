/**
   Finds a set of pairs of numbers that sum to the given sum within the given
   array.  If the sum is less than 9, the sum itself forms an available single
   "pair."

   @param {number} sum A sum that can be rolled with 2 6-sided dice
   @param {Array} available An array of available numbers to choose from.
 */
const findAvailablePairs = (sum, available) => {
  const midpoint = Math.floor(sum / 2);
  const remainder = sum % 2;

  return remainder === 0 ?
    countChoices(midpoint - 1, midpoint + 1, new Set(), new Set(available)) :
    countChoices(midpoint, midpoint + 1, new Set(), new Set(available));
};

/**
   Creates a set of numbers that represent combinations that sum to the sum of
   N and M.  N and M must not be the same.  If N and M are the same, an empty
   set is returned.

   @param {number} N The lower component of a sum
   @param {number} M The upper component of a sum
   @param {set} choiceSet A set of numbers that represent possible choices
   @param {set} available An array of available numbers to choose from.
   @returns {array} A Set object containing possible combinations of numbers.
 */
const countChoices = (N, M, choiceSet, available) => {
  if (M === 10) {
    return choiceSet;
  } else if (N === 0) {
    if (available.has(M)) choiceSet.add([M]);
    return choiceSet;
  } else {
    if (available.has(N) && available.has(M)) choiceSet.add([N,M]);
    return countChoices(N-1, M+1, choiceSet, available);
  }
}

module.exports = findAvailablePairs;
