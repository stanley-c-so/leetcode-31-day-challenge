// --- Day 23: Interval List Intersections ---

// Given two lists of closed intervals, each list of intervals is pairwise disjoint and in sorted order.

// Return the intersection of these two interval lists.

// (Formally, a closed interval [a, b] (with a <= b) denotes the set of real numbers x with a <= x <= b.  The intersection of two closed intervals is a set of real numbers that is either empty, or can be represented as a closed interval.  For example, the intersection of [1, 3] and [2, 4] is [2, 3].)

// Example 1:

// Input: A = [[0,2],[5,10],[13,23],[24,25]], B = [[1,5],[8,12],[15,24],[25,26]]
// Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

// Reminder: The inputs and the desired output are lists of Interval objects, and not arrays or lists.

// Note:
// 0 <= A.length < 1000
// 0 <= B.length < 1000
// 0 <= A[i].start, A[i].end, B[i].start, B[i].end < 10^9

// NOTE: input types have been changed on April 15, 2019. Please reset to default code definition to get new method signature.

// ----------

// i first started by reversing `A` and `B` so i can process the next interval by popping. i set `currentA` and `currentB` (current intervals from either `A` or `B`) as empty arrays so that when i
// later refer to these using variables `early` and `late`, PBR happens and any mutation i do to `early` or `late` also happens to `currentA` or `currentB`. i continue a loop while `A` or `B` continue
// to be non-empty. if `currentA` or `currentB` is empty, i attempt to pop from `A` or `B` (or if those are empty, i set the interval to [Infinity, Infinity]). then i determine between `currentA` or
// `currentB` which interval is `early` or `late` (based on their START numbers). by comparing `early[1]` and `late[0]` i can see whether there is an overlap. if there is an overlap, then depending on
// how `early[1]` compares to `late[1]` i calculate and process the corresponding intersection, and then i either discard the interval that ends earlier, or i discard both if they are the same. if,
// however, there was no overlap to begin with, then i simply discard the earlier interval.
function solution_1 (A, B) {
  if (!A.length || !B.length) return [];                                // EDGE CASE: empty input `A` or `B`
  A.reverse();                                                          // INITIALIZATION: reverse `A` so we can pop out next interval
  B.reverse();                                                          // INITIALIZATION: reverse `B` so we can pop out next interval
  const output = [];
  let currentA = [];                                                    // INITIALIZATION: give these empty arrays so that our `early` and `late` variables refer to these via PBR
  let currentB = [];
  while (A.length || B.length) {
    if (!currentA.length) currentA = A.pop() || [Infinity, Infinity];   // if `A` or `B` has run dry then use `[Infinity, Infinity]` to guarantee no overlap
    if (!currentB.length) currentB = B.pop() || [Infinity, Infinity];
    let early;
    let late;
    if (currentA[0] < currentB[0]) {                                    // `early` is the interval that starts first; `late` is the interval that starts second
      early = currentA;
      late = currentB;
    } else {
      early = currentB;
      late = currentA;
    }
    if (late[0] <= early[1]) {                                          // there is an overlap if and only if `late[0] <= early[1]`
      if (early[1] < late[1]) {
        output.push([late[0], early[1]]);                               // the intersection interval always begins with `late[0]` and ends with whichever is lesser: `early[1]` or `late[1]`
        early.length = 0;                                               // whichever interval needs to get discarded should now just be set to empty so that we can pop from `A` or `B` in the next iteration
      } else if (early[1] > late[1]) {
        output.push([late[0], late[1]]);
        late.length = 0;
      } else {
        output.push([late[0], early[1]]);
        early.length = 0;                                               // (if `late[0] === early[1]` then clear both `early` and `late`)
        late.length = 0;
      }
    } else {
      early.length = 0;                                                 // if no overlap, clear `early`
    }
  }
  return output;
}

// alex mok's solution (i refactored slightly) - ultimately a similar idea as above, but much more concise and clean. we use `i` and `j` to point to the current interval of `A` or `B`. we continue as
// long as BOTH `i` and `j` are in bounds. now we derive the `min` and `max` of our intersection such that `min` is the MAX of the two start positions of the two intervals, and `max` is the MIN of the
// two end positions of the two intervals. as long as `min <= max`, we have an intersection, and we construct this and push this into the `output` array. in any event, we next decide whether to increment
// `i` or `j` depending on which interval has the lower end point (or if they are the same, then incrementing either is fine). alternatively, you could have two independent if statements: if `aEnd >=
// bEnd` then increment `j`, and then, if `bEnd >= aEnd` then increment `i`. thus, if one is bigger than the other, only one increment happens; if they are both equal, both increments happen, which is
// fine, because both intervals have been processed.
function solution_2 (A, B) {
  const output = [];
  let i = 0;
  let j = 0;
  while (i < A.length && j < B.length) {
    const [aStart, aEnd] = A[i];
    const [bStart, bEnd] = B[j];
    const min = Math.max(aStart, bStart);
    const max = Math.min(aEnd, bEnd);
    if (min <= max) output.push([min, max]);
    // if (aEnd > bEnd) j++;                      // from alex's original solution
    // else i++;                                  // from alex's original solution
    if (aEnd >= bEnd) j++;
    if (bEnd >= aEnd) i++;
  }
  return output;
}

// one-liner - adopted from alex's main solution
var solution_3=(A,B,o=[],i=j=0)=>{while(i<A.length&&j<B.length){let [s,e]=A[i],[S,E]=B[j],m=Math.max(s,S),M=Math.min(e,E);m>M?0:o.push([m,M]);e>E?j++:i++}return o}

const intervalIntersection = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intervalIntersection;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  A: [ [0,2], [5,10], [13,23], [24,25] ],
  B: [ [1,5], [8,12], [15,24], [25,26] ],
};
expected = [ [1,2], [5,5], [8,10], [15,23], [24,24], [25,25] ];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 2
input = {
  A: [ [4,11] ],
  B: [ [1,2], [8,11], [12,13], [14,15], [17,19] ],
};
expected = [ [8,11] ];
test(func, input, expected, testNum, lowestTest, highestTest);