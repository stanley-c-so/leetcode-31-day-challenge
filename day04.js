// --- Day 4: Number Complement ---

// Given a positive integer, output its complement number. The complement strategy is to flip the bits of its binary representation.

// Example 1:

// Input: 5
// Output: 2
// Explanation: The binary representation of 5 is 101 (no leading zero bits), and its complement is 010. So you need to output 2.

// Example 2:

// Input: 1
// Output: 0
// Explanation: The binary representation of 1 is 1 (no leading zero bits), and its complement is 0. So you need to output 0.
 

// Note:

// The given integer is guaranteed to fit within the range of a 32-bit signed integer.
// You could assume no leading zero bit in the integer’s binary representation.
// This question is the same as 1009: https://leetcode.com/problems/complement-of-base-10-integer/

// ----------

// take the binary of the input `num` and convert all its 0s to 1s. that number (`completeNum`) is 1 less than the next power of 2. `completeNum - num` is the complement.
function solution_1 (num) {
  const completeNum = 2 ** num.toString(2).length - 1;  // this is the number if you convert all 0s in num's binary to 1, e.g. num is 5, 101 --> 111 --> 7 = 2**3 - 1
  return completeNum - num;
}

// one-liner - basically the above
var solution_2=n=>2**n.toString(2).length-1-n

const findComplement = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findComplement;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  num: 5,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  num: 1,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: