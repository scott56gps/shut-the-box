const countChoices = require('../../utils/findAvailableChoices');

test('N: 0, M: 2, to yield S: {2}', () => {
  expect(countChoices(0, 2, new Set())).toEqual(new Set([2]));
});

test('N: 5, M: 7, to yield S: {5,7,4,8,3,9}', () => {
  expect(countChoices(5, 7, new Set())).toEqual(new Set([5,7,4,8,3,9]));
});
