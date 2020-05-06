// --- Day 6: Majority Element ---

// Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊ n/2 ⌋ times.

// You may assume that the array is non-empty and the majority element always exist in the array.

// Example 1:

// Input: [3,2,3]
// Output: 3

// Example 2:

// Input: [2,2,1,1,1,2,2]
// Output: 2

// ----------

// while updating frequency of each num, within the same 'for of' loop, if the frequency goes above `nums.length / 2`, we can immediately return since that must be the answer
function solution_1 (nums) {
  const freq = {};
  for (const num of nums) {
    freq[num] = (freq[num] + 1) || 1;
    if (freq[num] > nums.length / 2) return num;
  }
}

// one-liner - basically the above
var solution_2=(N,f={},r)=>N.map(n=>(f[n]=f[n]+1||1,f[n]>N.length/2?r=n:0))|r

// alex mok's one-liner - since there must be a majority element that takes up over half the array, we can sort and grab the element in the middle!
var solution_3=n=>n.sort()[0|n.length/2]

// my improvement on alex mok's one-liner - using `n.length>>1` (bitwise sign-propagating right shift to accomplish `Math.floor(n.length/2)`) to save one character
var solution_4=n=>n.sort()[n.length>>1]

const majorityElement = solution_4;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = majorityElement;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: [3, 2, 3],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: [2, 2, 1, 1, 1, 2, 2],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  nums: [6, 6, 6, 7, 7],
};
expected = 6;
test(func, input, expected, testNum, lowestTest, highestTest);