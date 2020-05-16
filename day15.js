// --- Day 15: Maximum Sum Circular Subarray ---

// Given a circular array C of integers represented by A, find the maximum possible sum of a non-empty subarray of C.

// Here, a circular array means the end of the array connects to the beginning of the array. (Formally, C[i] = A[i] when 0 <= i < A.length, and C[i+A.length] = C[i] when i >= 0.)

// Also, a subarray may only include each element of the fixed buffer A at most once. (Formally, for a subarray C[i], C[i+1], ..., C[j], there does not exist i <= k1, k2 <= j with k1 % A.length = k2 % A.length.)

// Example 1:

// Input: [1,-2,3,-2]
// Output: 3
// Explanation: Subarray [3] has maximum sum 3

// Example 2:

// Input: [5,-3,5]
// Output: 10
// Explanation: Subarray [5,5] has maximum sum 5 + 5 = 10

// Example 3:

// Input: [3,-1,2,-1]
// Output: 4
// Explanation: Subarray [2,-1,3] has maximum sum 2 + (-1) + 3 = 4

// Example 4:

// Input: [3,-2,2,-3]
// Output: 3
// Explanation: Subarray [3] and [3,-2,2] both have maximum sum 3

// Example 5:

// Input: [-2,-3,-1]
// Output: -1
// Explanation: Subarray [-1] has maximum sum -1
 
// Note:

// -30000 <= A[i] <= 30000
// 1 <= A.length <= 30000

// ----------

// this solution features kadane's algorithm - a way to calculate either the max or min contiguous subarray sum for a regular array. if our array were not circular, then the
// kadane's by itself would be sufficient to find the max contiguous subarray sum. but since a subarray that "wraps around" the end may be even bigger, we need to find what the
// best wrap-around solution might be. how do we do this? take the total of the entire array and subtract the MIN contiguous subarray sum. (why? to figure out what wrap-around part
// of the array we are choosing to maximize, this is the same as choosing what non-wrapped part of the array we are choosing to minimize!) all we have to do, then, is choose the
// bigger option. however, there is one edge case: if the entire array has negative numbers, then the true answer is the max contiguous subarray sum, which is simply the largest
// (least negative) number. however, `total - kadanesMin` would be 0, because `kadanesMin` will result from choosing all the negative numbers. this is not a permissible solution,
// however - this would be like choosing no portion of the circular array, which is expressly forbidden. in this case, then, we just choose the largest element of the array.
function solution_1 (A) {

  // EDGE CASE: our regular logic won't work if all nums are negative: `total - kadanesMin` will be 0, which is greater than `kadanesMax`. however, choosing nothing is not allowed.
  if (A.every(n => n < 0)) return Math.max(...A);

  // HELPER FUNCTION: write `kadanes('max')` to calculate the max contiguous subarray sum, or `kadanes('min')` for the min
  function kadanes (maxOrMin) {
    let best = maxOrMin === 'max' ? -Infinity : Infinity;       // INITIALIZE: `-Infinity` or `Infinity` depending on if you're looking for max/min
    let currentBest = A[0];                                     // INITIALIZE: start `current` at first value (so there is a basis for comparison for future nums)
    for (let i = 1; i < A.length; ++i) {                        // run through subsequent numbers only
      currentBest = Math[maxOrMin](currentBest + A[i], A[i]);   // compare `A[i]` to `currentBest + A[i]`
      best = Math[maxOrMin](best, currentBest);                 // compare `best` to `currentBest`
    }
    return best;
  }
  const kadanesMax = kadanes('max');
  const kadanesMin = kadanes('min');
  const total = A.reduce((total, num) => total + num);
  return Math.max(kadanesMax, total - kadanesMin);              // choose the greater of `kadanesMax` or `total - kadanesMin` (a subarray that "wraps around")
}

// this is the exact same solution as above, except we find all of our values in one pass through the array
function solution_2 (A) {

  // INITIALIZATIONS
  let max = -Infinity;
  let min = Infinity;
  let currentMax = A[0];
  let currentMin = A[0];
  let total = A[0];
  let biggestSingleElement = A[0];
  let everyNumberIsNegative = true;

  // WE ONLY NEED ONE PASS THROUGH THE ARRAY
  for (let i = 1; i < A.length; ++i) {
    currentMax = Math.max(currentMax + A[i], A[i]);
    currentMin = Math.min(currentMin + A[i], A[i]);
    max = Math.max(max, currentMax);
    min = Math.min(min, currentMin);
    total += A[i];
    biggestSingleElement = Math.max(biggestSingleElement, A[i]);
    if (A[i] >= 0) everyNumberIsNegative = false;
  }

  // FINAL RETURN STATEMENT
  return everyNumberIsNegative ? biggestSingleElement : Math.max(max, total - min);
}

// one-liner - basically the above
var solution_3=A=>(m=Infinity,M=-m,C=c=t=b=A[0],e=!0,A.map((n,i)=>i?(C=C+n>n?C+n:n,c=c+n<n?c+n:n,M=M>C?M:C,m=m<c?m:c,t+=n,b=b>n?b:n,e=n<0?e:!8):0))&&e?b:M>t-m?M:t-m

// alex mok's regular solution - similar idea, except the for loop can include the first element as well. `sum1` and `sum2` are basically like `maxSoFar` and `minSoFar`, except if they
// ever end up on the wrong side of 0, they get reset to 0. the way to check for the edge case of the entire array being negative is to check whether `total === min`.
function solution_4 (A) {
  let max = -Infinity;
  let min = Infinity;
  let total = 0;
  let sum1 = 0;
  let sum2 = 0;
  for(let i = 0; i < A.length; i++){
      total += A[i];
      sum1 += A[i];                           // previous max sum + current
      sum2 += A[i];                           // previous min sum + current
      max = Math.max(max, sum1);
      if (sum1 < 0) sum1 = 0;                 // reset `sum1` to 0 if it is negative
      min = Math.min(sum2, min);
      if (sum2 > 0) sum2 = 0;                 // reset `sum2` to 0 if it is positive
  }
  if (total === min) return max;              // EDGE CASE: if every number was negative, then `total === min`, and we must return `max` instead
  else return Math.max(max, total - min);
};

// alex mok's one-liner
var solution_5=(A,m=Infinity,M=-m,t=i=j=0)=>A.map(e=>{t+=e;i+=e;j+=e;M=M>i?M:i;i=i<0?0:i;m=m>j?j:m;j=j>0?0:j})|t==m?M:M>t-m?M:t-m

const maxSubarraySumCircular = solution_5;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = maxSubarraySumCircular;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  A: [1, -2, 3, -2],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  A: [5, -3, 5],
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  A: [3, -1, 2, -1],
};
expected = 4;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  A: [3, -2, 2, -3],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  A: [-2, -3, -1],
};
expected = -1;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: