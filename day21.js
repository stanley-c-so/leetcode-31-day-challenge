// --- Day 21: Count Square Submatrices with All Ones ---

// Given a m * n matrix of ones and zeros, return how many square submatrices have all ones.

// Example 1:

// Input: matrix =
// [
//   [0,1,1,1],
//   [1,1,1,1],
//   [0,1,1,1]
// ]
// Output: 15
// Explanation: 
// There are 10 squares of side 1.
// There are 4 squares of side 2.
// There is  1 square of side 3.
// Total number of squares = 10 + 4 + 1 = 15.

// Example 2:

// Input: matrix = 
// [
//   [1,0,1],
//   [1,1,0],
//   [1,1,0]
// ]
// Output: 7
// Explanation: 
// There are 6 squares of side 1.  
// There is 1 square of side 2. 
// Total number of squares = 6 + 1 = 7.
 

// Constraints:

// 1 <= arr.length <= 300
// 1 <= arr[0].length <= 300
// 0 <= arr[i][j] <= 1

// ----------

// iterate through the matrix, keeping tabs on `row1`, which is a "processed copy" of the most recent row of the matrix: for the first row of the matrix, we simply copy it and initialize `row1` with it.
// then we iterate through all remaining rows of the matrix. we initialize `row2` with only the first value in the next row of the matrix. for all remaining values, they stay 0 if the corresponding number
// in the matrix is 0, but if the corresponding number in the matrix is 1, then we dynamically calculate based on values to the left, up-left, and up (these values need to come from the processed copies,
// i.e. `row1` and `row2`, and not from the matrix itself). the idea is to take the minimum number from the 3 neighbors, and add 1. using this method we finish up `row2`, and at the end of each iteration,
// we reassign `row1` to `row2` (and before the next iteration we reset `row2` to be an array that only includes the first number of the next row of the matrix). the whole point of doing this is that every
// number in `row1` or `row2` represents the largest size square of 1s that has its lower right corner in that position. if a k*k square can be generated, that implies that there are k different squares of
// any size that have a lower right corner at that position. thus, the `total` that we are ultimately trying to calculate is simply the sum of all numbers generated in `row1` and `row2`. to find that we
// simply keep updating the `total` variable as we go along. (don't forget to include the initial `row1`, and the first number of every `row2`.)
function solution_1 (matrix) {
  let row1 = matrix[0];
  let total = row1.reduce((total, num) => total + num);
  if (matrix.length === 1) return total;
  let row2;
  for (let row = 1; row < matrix.length; ++row) {
    row2 = [matrix[row][0]];
    total += row2[0];
    for (let col = 1; col < row1.length; ++col) {
      if (matrix[row][col]) {
        const newNum = Math.min(row2[row2.length - 1], row1[col - 1], row1[col]) + 1;
        row2.push(newNum);
        total += newNum;
      } else {
        row2.push(0);
      }
    }
    row1 = row2;
  }
  return total;
}

// one-liner - basically the above
var solution_2=(m,A=m[0],B,t=A.reduce((a,b)=>a+b))=>m.length-1?m.map((r,i)=>i?(B=[r[0]],t+=B[0],r.map((c,j)=>j?(c?(n=Math.min(B[B.length-1],A[j-1],A[j])+1,B.push(n),t+=n):B.push(0)):0),A=B):0)|t:t

// alex mok's one-liner (uses O(m*n) space) - primary logic only goes when row and column index values are positive
var solution_3=(m,C=0)=>m.map((e,r)=>e.map((E,c)=>C+=E&&r&&c?m[r][c]+=Math.min(m[r][c-1],m[r-1][c],m[r-1][c-1]):E))&&C

const countSquares = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = countSquares;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  matrix: [
    [0, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ],
};
expected = 15;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  matrix: [
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 0],
  ],
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  matrix: [
    [1, 1],
    [0, 0],
    [1, 1],
  ],
};
expected = 4;
test(func, input, expected, testNum, lowestTest, highestTest);