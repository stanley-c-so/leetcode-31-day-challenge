// --- Day 2: Jewels and Stones ---

// You're given strings J representing the types of stones that are jewels, and S representing the stones you have.  Each character in S is a type of stone you have.  You want to know how many of the stones you have are also jewels.

// The letters in J are guaranteed distinct, and all characters in J and S are letters. Letters are case sensitive, so "a" is considered a different type of stone from "A".

// Example 1:

// Input: J = "aA", S = "aAAbbbb"
// Output: 3

// Example 2:

// Input: J = "z", S = "ZZ"
// Output: 0
// Note:

// S and J will consist of letters and have length at most 50.
// The characters in J are distinct.

// ----------

// throw every jewel into a set, and then check if each stone is in that set, incrementing a count if it is
function solution_1 (J, S) {
  const jewels = new Set();
  for (const jewel of J) {
    jewels.add(jewel);
  }
  let count = 0;
  for (const stone of S) {
    if (jewels.has(stone)) count++;
  }
  return count;
}

// one-liner - basically the above
var solution_2=(J,S,D={},c=0)=>(J.split('').map(j=>D[j]=1),S.split('').map(s=>D[s]&&c++))|c

// one-liner - shorter but less efficient
var solution_3=(J,S)=>S.split('').reduce((c,s)=>c+J.includes(s),0)

const numJewelsInStones = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = numJewelsInStones;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  J: 'aA',
  S: 'aAAbbbb',
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  J: 'z',
  S: 'ZZ,'
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: