// --- Day 22: Sort Characters By Frequency ---

// Given a string, sort it in decreasing order based on the frequency of characters.

// Example 1:

// Input:
// "tree"

// Output:
// "eert"

// Explanation:
// 'e' appears twice while 'r' and 't' both appear once.
// So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.

// Example 2:

// Input:
// "cccaaa"

// Output:
// "cccaaa"

// Explanation:
// Both 'c' and 'a' appear three times, so "aaaccc" is also a valid answer.
// Note that "cacaca" is incorrect, as the same characters must be together.

// Example 3:

// Input:
// "Aabb"

// Output:
// "bbAa"

// Explanation:
// "bbaA" is also a valid answer, but "Aabb" is incorrect.
// Note that 'A' and 'a' are treated as two different characters.

// ----------

// start by tallying up the frequency of each letter. each unique letter will have a frequency somewhere between 1 and `s.length` (if all letters in `s` are the same). we can create a `freqArr` of length
// `s.length + 1` such that every index position `i` (except 0) is a "bucket" (it will be an array) that contains all letters that appears `i` times in `s`. we iterate through the `freq` object to dump
// the appropriate letters into the appropriate buckets. then, we iterate backward through the `freqArr`, and wherever a bucket is found, we grab the letters inside, repeat them `i` times, and
// concatenate to the `output` string.
function solution_1 (s) {
  const freq = {};
  for (const c of s) {
    freq[c] = ++freq[c] || 1;
  }
  const freqArr = Array(s.length + 1);
  for (const c in freq) {
    if (!freqArr[freq[c]]) freqArr[freq[c]] = [];
    freqArr[freq[c]].push(c);
  }
  let output = '';
  for (let i = freqArr.length - 1; i >= 0; --i) {
    if (freqArr[i]) {
      for (const c of freqArr[i]) {
        output += c.repeat(i);
      }
    }
  }
  return output;
}

// one-liner - basically the above
var solution_2=(s,f={},a=Array(s.length+1),o='')=>{for(c of s)f[c]=++f[c]||1;for(c in f){if(!a[f[c]])a[f[c]]=[];a[f[c]].push(c)}for(i=a.length-1;i>=0;--i)if(a[i])for(c of a[i])o+=c.repeat(i);return o}

const frequencySort = solution_2;

const specialTest = (s, solutions) => {
  return solutions.includes(frequencySort(s));
};

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = specialTest;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s: 'tree',
  solutions: ['eert', 'eetr'],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s: 'cccaaa',
  solutions: ['cccaaa', 'aaaccc'],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  s: 'Aabb',
  solutions: ['bbAa', 'bbaA'],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: