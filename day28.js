// --- Day 28: Counting Bits ---

// Given a non negative integer number num. For every numbers i in the range 0 ≤ i ≤ num calculate the number of 1's in their binary representation and return them as an array.

// Example 1:

// Input: 2
// Output: [0,1,1]

// Example 2:

// Input: 5
// Output: [0,1,1,2,1,2]

// Follow up:

// It is very easy to come up with a solution with run time O(n*sizeof(integer)). But can you do it in linear time O(n) /possibly in a single pass?
// Space complexity should be O(n).
// Can you do it like a boss? Do it without using any builtin function like __builtin_popcount in c++ or in any other language.

// ----------

// i preload a 0 into `output`. i then proceed to copy `output`, increment every number by 1, and push that to the end of `output`. this is because
// every time you reach the next power of 2, it's the same as what you had before, but with an extra 1 at the left end. i keep repeating this
// doubling process until `output` is past the desired length, and then i pop from it until it is down to the appropriate length.
function solution_1 (num) {
  const output = [0];
  while (output.length < num + 1) {
    output.push(...output.map(n => n + 1));         // copy `output`, increment by 1, and stick this copy to the end of original `output`
  }
  while (output.length > num + 1) output.pop();     // pop down until `output` is the appropriate length
  return output;
}

// one-liner - basically the above
var solution_2=(n,o=[0],l='length')=>{while(o[l]<n+1)o.push(...o.map(n=>n+1));while(o[l]>n+1)o.pop();return o}

// this is leetcode's official solution: recognizing that f(n) = f(n & (n - 1)) + 1. why does this work? consider (n - 1):
// - if (n - 1) ends with a 0, then n & (n - 1) = (n - 1). thus, when you add 1 to (n - 1) to get n, that's one more 1. so f(n & (n - 1)) + 1.
// - if (n - 1) ends with a 1, then n & (n - 1) is whatever (n - 1) is but with the rightmost block of 1s all turned to 0. n is the same, but
//   with an extra 1 to the left of where that rightmost block of 1s originally were in (n - 1). so again, f(n & (n - 1)) + 1.
function solution_3 (num) {
  const output = [0];
  for (let i = 1; i <= num; ++i) {
    output.push(output[i & (i - 1)] + 1);
  }
  return output;
}

// one-liner - basically the above
var solution_4=(n,o=[0])=>{for(i=1;i<=n;++i)o.push(o[i&(i-1)]+1);return o}

const countBits = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = countBits;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  num: 2,
};
expected = [0, 1, 1];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  num: 5,
};
expected = [0, 1, 1, 2, 1, 2];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: