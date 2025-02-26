const findPairs = (n, A) => {
    return n <= 9 ? A[n - 1] ?
        findRest(0, n - 2, A, { 0: n }) :
        findRest(0, n - 2, A, []) :
        findRest((n - 9) - 1, 9 - 1, A, []);
};

const findRest = (i, j, A, R) => {
    return j <= i ? R :
        A[i] && A[j] ?
        findRest(i + 1, j - 1, A, {...R, [i + 1]: j + 1 }) :
        findRest(i + 1, j - 1, A, R);
};

export default findPairs;
