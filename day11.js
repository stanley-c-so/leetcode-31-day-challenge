// --- Day 11: Flood Fill ---

// An image is represented by a 2-D array of integers, each integer representing the pixel value of the image (from 0 to 65535).

// Given a coordinate (sr, sc) representing the starting pixel (row and column) of the flood fill, and a pixel value newColor, "flood fill" the image.

// To perform a "flood fill", consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color as the starting pixel), and so on. Replace the color of all of the aforementioned pixels with the newColor.

// At the end, return the modified image.

// Example 1:
// Input: 
// image = [[1,1,1],[1,1,0],[1,0,1]]
// sr = 1, sc = 1, newColor = 2
// Output: [[2,2,2],[2,2,0],[2,0,1]]
// Explanation: 
// From the center of the image (with position (sr, sc) = (1, 1)), all pixels connected 
// by a path of the same color as the starting pixel are colored with the new color.
// Note the bottom corner is not colored 2, because it is not 4-directionally connected
// to the starting pixel.

// Note:

// The length of image and image[0] will be in the range [1, 50].
// The given starting pixel will satisfy 0 <= sr < image.length and 0 <= sc < image[0].length.
// The value of each color in image[i][j] and newColor will be an integer in [0, 65535].

// ----------

// DFS solution (keep in mind the edge case where `newColor` is the same as the color of the starting pixel - just return `image` and avoid an infinite loop)
function solution_1 (image, sr, sc, newColor) {
  const h = image.length;
  const w = image[0].length;
  const originalColor = image[sr][sc];
  if (newColor === originalColor) return image;                                             // EDGE CASE: if `newColor` matches the color of `image[sr][sc]`, return `image` and avoid infinite loop
  const stack = [[sr, sc]];                                                                 // initialize stack with starting pixel
  while (stack.length) {                                                                    // DFS to avoid shift/unshift
    const [row, col] = stack.pop();                                                         // pop current pixel from stack and grab references
    image[row][col] = newColor;                                                             // adjust color of pixel
    if (row > 0 && image[row - 1][col] === originalColor) stack.push([row - 1, col]);       // check up
    if (row < h - 1 && image[row + 1][col] === originalColor) stack.push([row + 1, col]);   // check down
    if (col > 0 && image[row][col - 1] === originalColor) stack.push([row, col - 1]);       // check left
    if (col < w && image[row][col + 1] === originalColor) stack.push([row, col + 1]);       // check right
  }
  return image;
}

// recursive solution
function solution_2 (image, sr, sc, newColor) {
  const h = image.length;
  const w = image[0].length;
  const originalColor = image[sr][sc];
  if (newColor === originalColor) return image;                                             // EDGE CASE
  function helper (row, col) {
    if (
      row < 0 || row === h ||
      col < 0 || col === w ||
      image[row][col] !== originalColor
    ) return;
    image[row][col] = newColor;
    helper(row - 1, col);
    helper(row + 1, col);
    helper(row, col - 1);
    helper(row, col + 1);
  }
  helper(sr, sc);
  return image;
}

// one-liner - basically the above
var solution_3=(i,R,C,n,o=i[R][C],H=(r,c)=>r>=0&&r<i.length&&c>=0&&c<i[0].length&&i[r][c]==o&&(i[r][c]=n,H(r-1,c),H(r+1,c),H(r,c-1),H(r,c+1)))=>(n!=o?H(R,C):0,i)

const floodFill = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = floodFill;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  image: [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
  ],
  sr: 1,
  sc: 1,
  newColor: 2,
};
expected = [
  [2, 2, 2],
  [2, 2, 0],
  [2, 0, 1],
];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: