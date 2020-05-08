// --- Day 8: Check if it is a Straight Line ---

// You are given an array coordinates, coordinates[i] = [x, y], where [x, y] represents the coordinate of a point. Check if these points make a straight line in the XY plane.

// Example 1:
// Input: coordinates = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
// Output: true

// Example 2:
// Input: coordinates = [[1,1],[2,2],[3,4],[4,5],[5,6],[7,7]]
// Output: false
 
// Constraints:
// 2 <= coordinates.length <= 1000
// coordinates[i].length == 2
// -10^4 <= coordinates[i][0], coordinates[i][1] <= 10^4
// coordinates contains no duplicate point.

// ----------

// simply define `slope` based on the first two coordinates (guaranteed to be at least 2), and for the rest, calculate slope against the first point and see if the slope never deviates
function solution_1 (coordinates) {
  const slope = (coordinates[1][1] - coordinates[0][1]) / (coordinates[1][0] - coordinates[0][0]);
  for (let i = 2; i < coordinates.length; ++i) {
    if (slope !== (coordinates[i][1] - coordinates[0][1]) / (coordinates[i][0] - coordinates[0][0])) {
      return false;
    }
  }
  return true;
}

// one-liner - basically the above
var solution_2=(c,A=c[0],B=c[1])=>c.every((e,i)=>i<2||(e[1]-A[1])/(e[0]-A[0])==(B[1]-A[1])/(B[0]-A[0]))

// thomas luo's one-liner - one trick is destructuring to set references (`a`, `b`, `d`, `e`) to the first two points. then the main function is checking if it is NOT the case that any of the
// points form a different slope compared to the first two points. iff (b-e)/(a-d) = (b-y)/(a-x), then (b-e)/(a-d)*(a-x) - (b-y) = 0. (thomas writes this expression a bit differently.) if that
// statement is truthy for any (x,y), then that point deviates from the first slope.
var solution_3=(c,[[a,b],[d,e]]=c)=>!c.some(([x,y])=>(b-e)/(a-d)*(x-a)+b-y)

const checkStraightLine = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = checkStraightLine;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  coordinates: [ [1,2], [2,3], [3,4], [4,5], [5,6], [6,7] ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  coordinates: [ [1,1], [2,2], [3,4], [4,5], [5,6] ,[7,7] ],
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: