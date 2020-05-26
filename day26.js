// --- Day 26: Contiguous Array ---

// Given a binary array, find the maximum length of a contiguous subarray with equal number of 0 and 1.

// Example 1:
// Input: [0, 1]
// Output: 2
// Explanation: [0, 1] is the longest contiguous subarray with equal number of 0 and 1.

// Example 2:
// Input: [0, 1, 0]
// Output: 2
// Explanation: [0, 1](or[1, 0]) is a longest contiguous subarray with equal number of 0 and 1.

// Note: The length of the given binary array will not exceed 50, 000.

// ----------

// track `delta`: when you see a 1, increment. when you see a 0, decrement. the key idea is that `delta` will be the same before and after any contiguous subarray with
// equal parts 0s and 1s. we will keep a `history` object where the keys are various `delta` values, and the corresponding values are the earliest index where that `delta`
// was reached. iterate through the array, and if your current `delta` is not in the `history` object, save the current index. otherwise, find the difference between current
// index and `history` index (the earliest appearance of that `delta`), and update `max` as appropriate
function solution_1 (nums) {
  const history = { 0: -1 };
  let delta = 0;
  let max = 0;
  for (let i = 0; i < nums.length; ++i) {
    delta += nums[i] ? 1 : -1;
    if (delta in history) max = Math.max(max, i - history[delta]);
    else history[delta] = i;
  }
  return max;
}

// one-liner - basically the above
var solution_2=(n,h={0:-1},m=d=0)=>n.map((e,i)=>(e?d++:d--,d in h?(x=i-h[d],m=m>x?m:x):h[d]=i))|m

const findMaxLength = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findMaxLength;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: [0, 1],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: [0, 1, 0],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: