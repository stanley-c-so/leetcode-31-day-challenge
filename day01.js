// --- Day 01: First Bad Version ---

// You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

// Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.

// You are given an API bool isBadVersion(version) which will return whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

// Example:

// Given n = 5, and version = 4 is the first bad version.

// call isBadVersion(3) -> false
// call isBadVersion(5) -> true
// call isBadVersion(4) -> true

// Then 4 is the first bad version. 

// ----------

function solution_1 (isBadVersion) {
  return function (n) {
    let low = 1;
    let high = n;
    while (true) {
      const middle = Math.floor((high - low) / 2 + low);
      if (!isBadVersion(middle)) {
        low = middle + 1;
      } else if (middle === low || !isBadVersion(middle - 1)) {     // condition `middle === low` is needed because then you wouldn't search `middle - 1`
        return middle
      } else {
        high = middle - 1;
      }
    }
  }
}

var solution_2=B=>(n,l=1,h=n)=>{while(!0){m=~~((l+h)/2);if(!B(m))l=m+1;else if(m==l||!B(m-1))return m;else h=m-1}}

// thomas luo's recursive solution - no need for `while (true)` (which will make one-lining it easier because we don't have to deal with writing `return`)
// my only note: `left` should actually be initialized at 1, since the way we refer to our versions is 1-indexed, not 0-indexed. both ways work in leetcode.
function solution_3 (isBadVersion) {
  let lowestBadVersion;                                                       // this is our "record-keeping" variable. it needs no initial value because it will be reassigned at first known bad version.
  return function recurse (right, left = 0) {                                 // since we feed in `n` (for an array of `n` versions), `n` represents `right` (highest possibility). `left` defaults to 0.
    if (left > right) return lowestBadVersion;                                // recursive base case: when range completely closes (because `left > right`), you are done
    let middle = Math.floor((left + right) / 2);
    if (isBadVersion(middle)) lowestBadVersion = (right = middle - 1) + 1;    // if the middle of our range is bad, this is the lowest so far. code reads: `lowestBadVersion = middle; right = middle - 1;`
    else left = middle + 1;
    return recurse(right, left);                                              // once `left` or `right` have been updated, always recurse until you hit base case
  };
}

// thomas luo's one-liner - basically the above. `i` is `isBadVersion`. `p` is the helper (saving it to `p` is necessary so it can refer to itself). `b` is `lowestBadVersion`. `|0` is Math.floor.
// my only note: `l` should actually be initialized at 1, since the way we refer to our versions is 1-indexed, not 0-indexed both ways work in leetcode.
var solution_4=i=>p=(r,l=0,b,m=(l+r)/2|0)=>l>r?b:(i(m)?b=(r=m-1)+1:l=m+1)&&p(r,l,b)

const solution = solution_4;                                        // yes, this is what it is called in leetcode

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = solution;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// this feels like an "interactive" problem on leetcode even though they don't call it that. it uses a hidden API called `isBadVersion` which, when fed a number, should return a boolean. the code editor
// is pre-filled with a function that takes in the isBadVersion API, and returns a function whose code you have to fill in. for our purposes, in order to test, we will simulate the `isBadVersion` API
// with a simple function written up based on the known solution of test case. so, if the test case tells us that the first bad version should be 4, for example, then the `isBadVersion` "API" just returns
// whether the input is greater than or equal to 4. when using our own `test` function we just need to structure the syntax a little differently.

// Test case 1
input = {
  isBadVersion: n => n >= 4,                                                                          // in this test case we know the actual first bad version is 4 - we simulate `isBadVersion` API with 4
  testN: 5,                                                                                           // testN lives here so our test suite knows what input to test. this will be ignored by `func`
};
expected = 4;
test(func(...Object.values(input)), { n: input.testN }, expected, testNum, lowestTest, highestTest);  // here, the actual function we are testing is the one returned by invoking `func`, not `func` itself

// INITIALLY FAILED THESE TEST CASES: