// --- Day 10: Find the Town Judge ---

// In a town, there are N people labelled from 1 to N.  There is a rumor that one of these people is secretly the town judge.

// If the town judge exists, then:

// The town judge trusts nobody.
// Everybody (except for the town judge) trusts the town judge.
// There is exactly one person that satisfies properties 1 and 2.
// You are given trust, an array of pairs trust[i] = [a, b] representing that the person labelled a trusts the person labelled b.

// If the town judge exists and can be identified, return the label of the town judge.  Otherwise, return -1.

// Example 1:
// Input: N = 2, trust = [[1,2]]
// Output: 2

// Example 2:
// Input: N = 3, trust = [[1,3],[2,3]]
// Output: 3

// Example 3:
// Input: N = 3, trust = [[1,3],[2,3],[3,1]]
// Output: -1

// Example 4:
// Input: N = 3, trust = [[1,2],[2,3]]
// Output: -1

// Example 5:
// Input: N = 4, trust = [[1,3],[1,4],[2,3],[2,4],[4,3]]
// Output: 3

// ----------

// create a `trustObj` which will have data on everybody involved in a "trust pair": a boolean representing whether that person trusts anybody, and a number representing the count of people
// who trust that person. iterate through the "trust pairs" of the `trust` input and populate the `trustObj` accordingly. finally, iterate through the `trustObj` and check whether there is
// someone who (1) trusts no one, and (2) is trusted by all `N - 1` other people in the town. note that it is impossible for more than 1 person to fit this description (if you have 2 or more
// people who trust no one, then nobody could be trusted by `N - 1` people). if found, such a person is the judge. if nobody in the `trustObj` matches those criteria, return -1 for no judge.
function solution_1 (N, trust) {
  if (N === 1 && !trust.length) return 1;                           // EDGE CASE: the town only has 1 person and he doesn't trust anyone - he must be the judge
  const trustObj = {};                                              // each person involved somehow in a trust pair will be in `trustObj`. the value will be an array of length 2.
  for (const trustPair of trust) {
    const [A, B] = trustPair;
    if (!(A in trustObj)) trustObj[A] = [false, 0];                 // index 0 represents whether this person trusts at least 1 person (default `false`)
    if (!(B in trustObj)) trustObj[B] = [false, 0];                 // index 1 represents the number of people who trust this person (default 0)
    trustObj[A][0] = true;                                          // since A trusts B, set `trustObj[A][0]` to `true`
    trustObj[B][1]++;                                               // since B is trusted by A, increment `trustObj[B][1]`
  }
  for (const person in trustObj) {                                  // we only have to iterate through the people actually involved in the trust pairs
    const [trustsSomeone, peopleWhoTrust] = trustObj[person];
    if (!trustsSomeone && peopleWhoTrust === N - 1) return person;  // the judge trusts no one, but is trusted by all `N - 1` other people in the town (logically, at most 1 person fits this)
  }
  return -1;                                                        // if no judge, return -1
}

// one-liner - basically the above. note that i confirmed on leetcode that for the edge case of N === 1, it is sufficient to return 1 (there seems to be no test case where that person trusts
// himself, which would make him not a judge)
var solution_2=(N,t,a=[],r=-1)=>N==1?1:(t.map(p=>([A,B]=p,a[A]=a[A]||[!6,0],a[B]=a[B]||[!9,0],a[A][0]=!0,a[B][1]++)),a.map((p,i)=>r=p&&!p[0]&&p[1]==N-1?i:r))&&r

// improved one-liner - using .reduce at the end, using `|` between the .map and the .reduce, and using `N-1` instead of `N==1` in the ternary (swapping the cases)
var solution_3=(N,t,a=[])=>N-1?t.map(p=>([A,B]=p,a[A]=a[A]||[!6,0],a[B]=a[B]||[!9,0],a[A][0]=!0,a[B][1]++))|a.reduce((r,p,i)=>p&&!p[0]&&p[1]==N-1?i:r,-1):1

// thomas luo's one-liner - initialize an array of size `N + 1` and fill it with `0`. run through the trust pairs - the "truster" should be decremented in the array, and the "trusted" should be
// incremented. in the end, simply check for someone whose value in the array is equal to `N - 1` (only possible if `N - 1` people trusted him AND he trusted no one)
var solution_4=(N,t,a=Array(N+1).fill(0),p=-1)=>t.map(([r,d])=>a[r]--&a[d]++)|a.map((i,x)=>i==N-1?p=x:0)|p

const findJudge = solution_4;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findJudge;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  N: 2,
  trust: [ [1, 2] ],
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  N: 3,
  trust: [ [1, 3], [2, 3] ],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  N: 3,
  trust: [ [1, 3], [2, 3], [3, 1] ],
};
expected = -1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  N: 3,
  trust: [ [1, 2], [2, 3] ],
};
expected = -1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  N: 4,
  trust: [ [1, 3], [1, 4], [2, 3], [2, 4], [4, 3] ],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 6
input = {
  N: 1,
  trust: [],
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);