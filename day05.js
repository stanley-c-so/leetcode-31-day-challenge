// --- Day 5: First Unique Character in a String ---

// Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.

// Examples:

// s = "leetcode"
// return 0.

// s = "loveleetcode",
// return 2.

// Note: You may assume the string contain only lowercase letters.

// ----------

// just make a frequency object and return the index of the first letter that has frequency 1 (or -1 if none)
function solution_1 (s) {
  const freq = {};
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}

// one-liner - basically the above
var solution_2=(s,f={},S=[...s],r=-1)=>(S.map(c=>f[c]=(f[c]||0)+1),S.map((c,i)=>r=f[c]==1&&r<0?i:r))|r

// thomas luo's improvement on my one-liner - using `o[e]+1|1` instead of `(f[c]||0)+1`, ... && ... to avoid (... , ...), and chained ternary
// statements as a substitute for checking `f[c]==1&&r<0` (although this is not better!!)
var solution_3=(s,p=[...s],o={},z=-1)=>p.map(e=>o[e]=o[e]+1|1)&&p.map((e,i)=>o[e]-1?0:z+1?z:z=i)&&z

// hybrid of our one-liners - borrowed a few of thomas' ideas, and refactored the ternary to shorten by 1 character. also brought back `|r`
var solution_4=(s,S=[...s],f={},r=-1)=>S.map(c=>f[c]=f[c]+1|1)&&S.map((c,i)=>f[c]-1||r+1?0:r=i)|r

const firstUniqChar = solution_4;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = firstUniqChar;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s: 'leetcode',
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s: 'loveleetcode',
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: