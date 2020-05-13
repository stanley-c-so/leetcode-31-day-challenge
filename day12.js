// --- Day 12: Single Element in a Sorted Array ---

// You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Find this single element that appears only once.

// Example 1:

// Input: [1,1,2,3,3,4,4,8,8]
// Output: 2

// Example 2:

// Input: [3,3,7,7,10,11,11]
// Output: 10
 
// Note: Your solution should run in O(log n) time and O(1) space.

// ----------

// this is basically a binary search problem. `left` and `right` will represent the bounds of the range that may hold our value, so we should initialize them at 0 and `nums.length - 1`.
// we can keep a for loop running indefinitely because we are guaranteed to have a solution. calculate `middle`, and first check if it is the unique number (if it is equal to `left`,
// then the window has reduced to size 1 [and not 2, which would mean there is no solution]; else we compare `nums[middle]` to its neighbors). eventually, the true answer will hit this
// condition and get returned. otherwise, we know `middle` does not point to the unique number, so we need to determine whether we can eliminate the left half or the right half from our
// next search. this logic depends on whether the size of the left half (`middle - left`) is even or odd. if it's odd, and `num[middle]` matches previous num, OR if it's even, and
// `num[middle]` matches the next num, then we know the left half can be eliminated, so we move `left` up past `middle` (whether it's `middle + 1` or `middle + 2` again depends on the
// odd/even we determined above). otherwise, we know the right half can be eliminated, so we move `right` down past `middle` (whether it's `middle - 1` or `middle - 2` again depends on the
// odd/even we determined above).
function solution_1 (nums) {
  let left = 0;
  let right = nums.length - 1;
  while (true) {
    const middle = Math.floor((right - left) / 2) + left;     // we write it this way to prevent overflow
    if (
      middle === left ||                                      // since we are guaranteed a solution, if `middle === nums`, range could only be 1 number (not 2 - no soluiton)
      nums[middle] !== nums[middle - 1] &&                    // we should also check if `nums[middle]` is the non-duplicate. in fact, we must ultimately fall into this block with the answer
      nums[middle] !== nums[middle + 1]
    ) {
      return nums[middle];
    } else if (
      nums[middle] === nums[
        (middle - left) % 2 ? middle - 1 : middle + 1         // check if we can eliminate left half: if length of left half is odd, middle matches previous num; if even, middle matches next num
      ]
    ) {
      left = middle + ((middle - left) % 2 ? 1 : 2);          // if length of left half is odd, move `left` to 1 position after `middle`; if even, move it to 2 positions after
    } else {                                                  // if we didn't eliminate left half, then we can eliminate right half
      right = middle - ((middle - left) % 2 ? 1 : 2);         // if length of left half is odd, move `right` to 1 position before `middle`; if even, move it to 2 positions before
    }
  }
}

// one-liner - basically the above
var solution_2=(n,l=0,r=n.length-1)=>{while(!0){m=(l+r)>>1;x=(m-l)%2;if(m==l||n[m]!=n[m-1]&&n[m]!=n[m+1])return n[m];else if(n[m]==n[x?m-1:m+1])l=m+(x?1:2);else r=m-(x?1:2)}}

const singleNonDuplicate = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = singleNonDuplicate;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: [1, 1, 2, 3, 3, 4, 4, 8, 8],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: [3, 3, 7, 7, 10, 11, 11],
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: