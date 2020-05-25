// --- Day 25: Uncrossed Lines ---

// We write the integers of A and B (in the order they are given) on two separate horizontal lines.

// Now, we may draw connecting lines: a straight line connecting two numbers A[i] and B[j] such that:

// A[i] == B[j];
// The line we draw does not intersect any other connecting(non - horizontal) line.

// Note that a connecting lines cannot intersect even at the endpoints: each number can only belong to one connecting line.

// Return the maximum number of connecting lines we can draw in this way.

// Example 1:

// 1  4  2
// |    \
// 1  2  4

// Input: A = [1, 4, 2], B = [1, 2, 4]
// Output: 2
// Explanation: We can draw 2 uncrossed lines as in the diagram.
// We cannot draw 3 uncrossed lines, because the line from A[1] = 4 to B[2] = 4 will intersect the line from A[2] = 2 to B[1] = 2.

// Example 2:

// Input: A = [2, 5, 1, 2, 5], B = [10, 5, 2, 1, 5, 2]
// Output: 3

// Example 3:

// Input: A = [1, 3, 7, 1, 7, 5], B = [1, 9, 2, 5, 1]
// Output: 2

// Note:

// 1 <= A.length <= 500
// 1 <= B.length <= 500
// 1 <= A[i], B[i] <= 2000

// ----------

// we use a dynamic programming grid to solve this one. let's say `A` goes along the vertical axis while `B` goes along the horizontal axis. make sure to initialize the grid with one extra row and column
// relative to the lengths of `A` and `B`, and pre-fill everything with 0. now, starting at `row` 1 and `col` 1 (but the corresponding indices for `A` and `B` are offset by 1), simply compare the latest
// value of `A` and `B`. if they are the same, then grab the number to your upper left, and add 1 (because the marginal numbers are the same, so the max number of connections is whatever it was before,
// plus 1). if they are not the same, then grab the greater of the number to your left, or right above you (because the marginal numbers are not the same, so you would not gain any new connections with
// either marginal number). thanks to alex mok for showing me this solution.
function solution_1 (A, B) {

  // INITIALIZATIONS
  const grid = [];
  const a = A.length;
  const b = B.length;
  for (let i = 0; i < a + 1; ++i) grid.push(Array(b + 1).fill(0));      // remember to create the grid with 1 extra row and column

  // DYNAMIC PROGRAMMING
  for (let row = 1; row <= a; ++row) {
    for (let col = 1; col <= b; ++col) {
      grid[row][col] = A[row - 1] === B[col - 1]                        // do the marginal numbers match?
        ? grid[row - 1][col - 1] + 1                                    // if so, then grab the previous result (to the upper left) and add 1
        : Math.max(grid[row - 1][col], grid[row][col - 1]);             // if not, grab the greater of the result to the left and the result just above
    }
  }

  return grid[a][b];
}

// one-liner - basically the above
var solution_2=(A,B,a=A.length,b=B.length,g=Array.from({length:a+1},()=>Array(b+1).fill(0)))=>g.map((r,i)=>r.map((c,j)=>i&&j&&(g[i][j]=A[i-1]==B[j-1]?g[i-1][j-1]+1:Math.max(g[i-1][j],g[i][j-1]))))|g[a][b]

const maxUncrossedLines = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = maxUncrossedLines;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  A: [1, 4, 2],
  B: [1, 2, 4],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  A: [2, 5, 1, 2, 5],
  B: [10, 5, 2, 1, 5, 2],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  A: [1, 3, 7, 1, 7, 5],
  B: [1, 9, 2, 5, 1],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 4
input = {
  A: [1, 1, 3, 5, 3, 3, 5, 5, 1, 1],
  B: [2, 3, 2, 1, 3, 5, 3, 2, 2, 1],
};
expected = 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  A: [4, 4, 4, 2, 4, 1, 4, 3, 2, 4, 4, 2, 2, 2, 5, 2, 5, 4, 5, 1],
  B: [2, 1, 5, 4, 2, 3, 5, 1, 2, 2],
};
expected = 6;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  A: [2, 3, 4, 1, 3, 3, 2, 4, 2, 2, 1, 5, 2, 4, 3, 4, 4, 5, 1, 5, 1, 5, 4, 3, 1, 2, 5, 2, 4, 4],
  B: [2, 2, 4, 2, 4, 1, 1, 5, 5, 3, 2, 1, 1, 1, 3, 1, 2, 5, 2, 4, 3, 4, 5, 5, 3, 3, 5, 1, 4, 3],
};
expected = 16;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  A: [3, 1, 2, 1, 4, 1, 2, 2, 5, 3, 2, 1, 1, 4, 5, 2, 3, 2, 5, 5],
  B: [2, 4, 1, 2, 3, 4, 2, 4, 5, 5, 1, 1, 2, 1, 1, 1, 5, 4, 1, 4, 2, 1, 5, 4, 2, 3, 1, 5, 2, 1],
};
expected = 14;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  A: [1, 5, 3, 5, 3, 5, 5, 4, 4, 3, 2, 3, 5, 4, 5, 4, 5, 2, 5, 3, 3, 1, 4, 4, 3, 1, 1, 1, 4, 4],
  B: [1, 3, 2, 2, 5, 2, 3, 1, 1, 3, 5, 4, 5, 5, 3, 5, 4, 1, 2, 5],
};
expected = 12;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  A: [4, 3, 5, 5, 5, 4, 5, 2, 1, 3, 3, 5, 1, 5, 2, 4, 2, 1, 2, 3, 3, 3, 5, 3, 4, 2, 2, 3, 5, 1],
  B: [1, 2, 4, 4, 1, 3, 2, 2, 1, 5, 5, 5, 2, 1, 2],
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  A: [19,5,19,19,2,9,5,19,20,17,3,1,7,10,19,16,8,3,13,13,16,3,16,7,14,11,18,5,8,12,8,15,18,10,8,8,12,8,9,17,17,14,14,1,8,19,8,1,5,4],
  B: [18,20,18,18,4,7,17,17,1,18,6,4,11,14,19,15,12,20,3,5,12,2,13,14,9,16,6,4,16,8,10,19,15,18,12,11,9,14,7,9,14,15,6,18,12,8,20,11,2,17],
};
expected = 16;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 11
input = {
  A: [4,2,1,4,2,2,5,1,4,4,1,2,4,2,1,4,1,4,1,5],
  B: [4,3,4,4,3,3,1,1,4,2,3,2,5,1,2],
};
expected = 8;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 12
input = {
  A: [5,1,2,5,1,2,2,3,1,1,1,1,1,3,1],
  B: [2,5,1,3,4,5,5,2,2,4,5,2,2,3,1,4,5,3,2,4,5,2,4,4,2,2,2,1,3,1],
};
expected = 11;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 13
input = {
  A: [1,2,4,1,4,4,3,5,5,1,4,4,4,1,4,3,4,2,4,2],
  B: [2,4,1,1,3,5,2,1,5,1,2,3,3,2,1,4,1,2,5,5],
};
expected = 11;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 14
input = {
  A: [2,3,1,2,5,1,3,1,3,2,3,1,2,2,3,3,3,1,3,4,4,3,4,3,4,5,4,4,1,3],
  B: [5,4,5,1,1,3,4,3,2,3],
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 15
input = {
  A: [3,2,5,3,2,3,1,2,2,5,2,5,4,4,5],
  B: [3,2,3,3,5,5,1,3,3,1,5,2,5,5,3,2,4,2,1,2],
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 16
input = {
  A: [15,14,1,7,15,1,12,18,9,15,1,20,18,15,16,18,11,8,11,18,11,11,17,20,16,20,15,15,9,18,16,4,16,1,13,10,10,20,4,18,17,3,8,1,8,19,14,10,10,12],
  B: [12,8,17,4,2,18,16,10,11,12,7,1,8,16,4,14,12,18,18,19,19,1,11,18,1,6,12,17,6,19,10,5,11,16,6,17,12,1,9,3,19,2,18,18,2,4,11,11,14,9,20,19,2,20,9,15,8,7,8,6,19,12,4,11,18,18,1,6,9,17,13,19,5,4,14,9,11,15,2,5,4,1,10,11,6,4,9,7,11,7,3,8,11,12,4,19,12,17,14,18],
};
expected = 23;
test(func, input, expected, testNum, lowestTest, highestTest);
