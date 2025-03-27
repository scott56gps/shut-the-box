const countChoices = require('../../utils/findAvailableChoices');

test('N: 0, M: 2, to yield S: {2}', () => {
  expect(countChoices(0, 2, new Set())).toEqual(new Set([2]));
});

test('N: 5, M: 7, to yield S: {5,7,4,8,3,9}', () => {
  expect(countChoices(5, 7, new Set())).toEqual(new Set([5,7,4,8,3,9]));
});

test('N: 1, M: 2, to yield S: {1,2,3}', () => {
  expect(countChoices(1, 2, new Set())).toEqual(new Set([1,2,3]));
});

test('N: 4, M: 6, to yield S: {4,6,3,7,2,8,1,9}', () => {
  expect(countChoices(4, 6, new Set())).toEqual(new Set([4, 6, 3, 7, 2, 8, 1, 9]));
});

test('N: 5, M: 6, to yield S: {5,6,4,7,3,8,2,9}', () => {
  expect(countChoices(5, 6, new Set())).toEqual(new Set([5, 6, 4, 7, 3, 8, 2, 9]));
});

test('N: 3, M: 4, to yield S: {3,4,2,5,1,6,7}', () => {
  expect(countChoices(3, 4, new Set())).toEqual(new Set([3, 4, 2, 5, 1, 6, 7]));
});
