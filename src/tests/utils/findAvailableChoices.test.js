const findAvailablePairs = require('../../utils/findAvailablePairs');

describe('findAvailablePairs', () => {
  test('sum: 2, available: [1,2,3,4,5,6,7,8,9], to yield S: {2}', () => {
    expect(findAvailablePairs(2, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[2]]));
  });

  test('sum: 2, available: [2], to yield S: {2}', () => {
    expect(findAvailablePairs(2, [2])).toEqual(new Set([[2]]));
  });

  test('sum: 2, available: [1,3,4,7], to yield S: {}', () => {
    expect(findAvailablePairs(2, [1, 3, 4, 7])).toEqual(new Set());
  });

  test('sum: 12, available: [1,2,3,4,5,6,7,8,9], to yield S: {5,7,4,8,3,9}', () => {
    expect(findAvailablePairs(12, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[5, 7], [4, 8], [3, 9]]));
  });

  test('sum: 12, available: [6,7,8,9], to yield S: {}', () => {
    expect(findAvailablePairs(12, [6, 7, 8, 9])).toEqual(new Set());
  });

  test('sum: 3, available: [3,4,5,6,7,8,9], to yield S: {3}', () => {
    expect(findAvailablePairs(3, [3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[3]]));
  });

  test('sum: 10, available: [1,2,3,4,5,6,7,8,9], to yield S: {4,6,3,7,2,8,1,9}', () => {
    expect(findAvailablePairs(10, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[4, 6], [3, 7], [2, 8], [1, 9]]));
  });

  test('sum: 10, available: [4,5,6,7,8,9], to yield S: {4,6}', () => {
    expect(findAvailablePairs(10, [4, 5, 6, 7, 8, 9])).toEqual(new Set([[4, 6]]));
  });

  test('sum: 11, available: [1,2,3,4,5,6,7,8,9], to yield S: {5,6,4,7,3,8,2,9}', () => {
    expect(findAvailablePairs(11, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[5, 6], [4, 7], [3, 8], [2, 9]]));
  });

  test('sum: 11, available: [1,2,3,4,5,6,7,8], to yield S: {5,6,4,7,3,8}', () => {
    expect(findAvailablePairs(11, [1, 2, 3, 4, 5, 6, 7, 8])).toEqual(new Set([[5, 6], [4, 7], [3, 8]]));
  });

  test('sum: 7, available: [1,2,3,4,5,6,7,8,9], to yield S: {3,4,2,5,1,6,7}', () => {
    expect(findAvailablePairs(7, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(new Set([[3, 4], [2, 5], [1, 6], [7]]));
  });

  test('sum: 7, available: [6,8,9], to yield S: {}', () => {
    expect(findAvailablePairs(7, [6, 8, 9])).toEqual(new Set());
  });
});
