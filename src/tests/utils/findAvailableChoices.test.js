const generateAvailableChoices = require('../../utils/findAvailableChoices');

test('sum: 2, to yield S: {2}', () => {
  expect(generateAvailableChoices(2)).toEqual(new Set([2]));
});

test('sum: 12, to yield S: {5,7,4,8,3,9}', () => {
  expect(generateAvailableChoices(12)).toEqual(new Set([5, 7, 4, 8, 3, 9]));
});

test('sum: 3, to yield S: {1,2,3}', () => {
  expect(generateAvailableChoices(3)).toEqual(new Set([1, 2, 3]));
});

test('sum: 10, to yield S: {4,6,3,7,2,8,1,9}', () => {
  expect(generateAvailableChoices(10)).toEqual(new Set([4, 6, 3, 7, 2, 8, 1, 9]));
});

test('sum: 11, to yield S: {5,6,4,7,3,8,2,9}', () => {
  expect(generateAvailableChoices(11)).toEqual(new Set([5, 6, 4, 7, 3, 8, 2, 9]));
});

test('sum: 7, to yield S: {3,4,2,5,1,6,7}', () => {
  expect(generateAvailableChoices(7)).toEqual(new Set([3, 4, 2, 5, 1, 6, 7]));
});
