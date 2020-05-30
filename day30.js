// --- Day 30: K Closest Points to Origin ---

// We have a list of points on the plane. Find the K closest points to the origin (0, 0).

// (Here, the distance between two points on a plane is the Euclidean distance.)

// You may return the answer in any order.The answer is guaranteed to be unique(except for the order that it is in.)

// Example 1:

// Input: points = [[1, 3], [-2, 2]], K = 1
// Output: [[-2, 2]]
// Explanation:
// The distance between(1, 3) and the origin is sqrt(10).
// The distance between(-2, 2) and the origin is sqrt(8).
// Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
// We only want the closest K = 1 points from the origin, so the answer is just[[-2, 2]].

// Example 2:

// Input: points = [[3, 3], [5, -1], [-2, 4]], K = 2
// Output: [[3, 3], [-2, 4]]
// (The answer[[-2, 4], [3, 3]] would also be accepted.)

// Note:

// 1 <= K <= points.length <= 10000
// - 10000 < points[i][0] < 10000
// - 10000 < points[i][1] < 10000

// ----------

// simply sort on the basis of the pythagorean theorem (no need to square root it) - here i reverse sort, and then pop out the first `K` values
function solution_1 (points, K) {
  const output = [];
  const sorted = points.sort((a, b) => b[0]**2 + b[1]**2 - a[0]**2 - a[1]**2);
  while (K--) output.push(sorted.pop());
  return output;
}

// one-liner - basically the above, but in forward sort order, and i grab the first `K` values with .slice
var solution_2=(p,K)=>p.sort((a,b)=>a[0]**2+a[1]**2-b[0]**2-b[1]**2).slice(0,K)

// thomas luo's one-liner - basically the above, but with destructuring in the sort function's signature
var solution_3=(p,K)=>p.sort(([a,b],[c,d])=>a*a+b*b-c*c-d*d).slice(0,K)

const kClosest = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = kClosest;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  points: [ [1, 3], [-2, 2] ],
  K: 1,
};
expected = [ [-2, 2] ];
test(sortedFunc, input, expected.sort(), testNum, lowestTest, highestTest);

// Test case 2
input = {
  points: [ [3, 3], [5, -1], [-2, 4] ],
  K: 2,
};
expected = [ [3, 3], [-2, 4] ];
test(sortedFunc, input, expected.sort(), testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: