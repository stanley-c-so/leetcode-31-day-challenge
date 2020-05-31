// --- Day 31: Edit Distance ---

// Given two words word1 and word2, find the minimum number of operations required to convert word1 to word2.

// You have the following 3 operations permitted on a word:

// Insert a character
// Delete a character
// Replace a character

// Example 1:

// Input: word1 = "horse", word2 = "ros"
// Output: 3
// Explanation:
// horse -> rorse(replace 'h' with 'r')
// rorse -> rose(remove 'r')
// rose -> ros(remove 'e')

// Example 2:

// Input: word1 = "intention", word2 = "execution"
// Output: 5
// Explanation:
// intention -> inention(remove 't')
// inention -> enention(replace 'i' with 'e')
// enention -> exention(replace 'n' with 'x')
// exention -> exection(replace 'n' with 'c')
// exection -> execution(insert 'u')

// ----------

// basic levenshtein algorithm
function solution_1 (word1, word2) {
  const longer = word1.length > word2.length ? word1 : word2;
  const shorter = word1.length > word2.length ? word2 : word1;
  const w = shorter.length;
  const h = longer.length;
  const grid = [];
  for (let i = 0; i <= h; ++i) grid.push(Array(w + 1).fill(0));
  for (let i = 0; i <= w; ++i) grid[0][i] = i;
  for (let i = 0; i <= h; ++i) grid[i][0] = i;
  for (let row = 1; row <= h; ++row) {
    for (let col = 1; col <= w; ++col) {
      grid[row][col] = shorter[col - 1] === longer[row - 1]
        ? grid[row - 1][col - 1]
        : Math.min(
          grid[row - 1][col - 1],
          grid[row - 1][col],
          grid[row][col - 1]
        ) + 1;
    }
  }
  return grid[h][w];
}

// space-optimized by saving only 2 rows at a time
function solution_2 (word1, word2) {
  const longer = word1.length > word2.length ? word1 : word2;
  const shorter = word1.length > word2.length ? word2 : word1;
  const w = shorter.length;
  const h = longer.length;
  const topRow = [];
  for (let i = 0; i <= w; ++i) topRow.push(i);
  const bottomRow = Array(w + 1).fill(0);                     // for edge case with empty string as one or both inputs, as for loops don't run
  const grid = [topRow, bottomRow];
  for (let row = 1; row <= h; ++row) {
    bottomRow.length = 0;
    bottomRow.push(row);
    for (let col = 1; col <= w; ++col) {
      bottomRow.push(shorter[col - 1] === longer[row - 1]
        ? topRow[col - 1]
        : Math.min(
          topRow[col - 1],
          topRow[col],
          bottomRow[bottomRow.length - 1]
        ) + 1
      );
    }
    topRow.length = 0;
    topRow.push(...bottomRow);
  }
  return grid[1][w];
}

// one-liner - basically solution 1
var solution_3=(a,b,l='length',w=a[l],h=b[l],A=Array,g=A.from({[l]:h+1},()=>A(w+1).fill(0)))=>g.map((R,r)=>r?R.map((_,c)=>c?(X=g[r-1][c-1],R[c]=a[c-1]==b[r-1]?X:Math.min(X,g[r-1][c],R[c-1])+1):R[c]=r):R.map((_,c)=>R[c]=c))&&g[h][w]

const minDistance = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = minDistance;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  word1: 'horse',
  word2: 'ros',
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  word1: 'intention',
  word2: 'execution',
};
expected = 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  word1: '',
  word2: '',
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);