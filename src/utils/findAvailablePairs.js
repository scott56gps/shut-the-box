/**
   Finds a set of pairs of numbers that sum to the given sum within the given
   array.  If the sum is less than 9, the sum itself forms an available single
   "pair."

   @param {Number} sum A sum that can be rolled with 2 6-sided dice
   @param {Set} available An array or set of available numbers to choose from.
   @returns A Set object containing pairs of numbers that sum to the given sum.
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

   @param {Number} N The lower component of a sum
   @param {Number} M The upper component of a sum
   @param {Set} choiceSet A set of numbers that represent possible choices
   @param {Set} available An array of available numbers to choose from.
   @returns {Set} A Set object containing possible combinations of numbers.
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
