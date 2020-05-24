// --- Day 9: Valid Perfect Square ---

// Given a positive integer num, write a function which returns True if num is a perfect square else False.

// Note: Do not use any built-in library function such as sqrt.

// Example 1:
// Input: 16
// Output: true

// Example 2:
// Input: 14
// Output: false

// ----------

// can't think of a constant time approach without using Math.sqrt (which is forbidden by the problem) so instead i'm just iterating `i` until `i**2` is not less than `num`, and checking if
// `i**2` is equal to `num`
function solution_1 (num) {
  let i = 1;
  while (i ** 2 < num) ++i;
  return i ** 2 === num;
}

// one-liner - basically the above, but with `i*i` to save a character each time
var solution_2=n=>{i=1;while(i*i<n)++i;return i*i==n}

const isPerfectSquare = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = isPerfectSquare;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  num: 16,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  num: 14,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: