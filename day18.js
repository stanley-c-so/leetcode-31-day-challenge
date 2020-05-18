// --- Day 18: Permutation in String ---

// Given two strings s1 and s2, write a function to return true if s2 contains the permutation of s1. In other words, one of the first string's permutations is the substring of the second string.

// Example 1:

// Input: s1 = "ab" s2 = "eidbaooo"
// Output: True
// Explanation: s2 contains one permutation of s1 ("ba").

// Example 2:

// Input:s1= "ab" s2 = "eidboaoo"
// Output: False

// ----------

// first create a frequency dictionary of `s1`, but make the values negative rather than positive. then, using that dictionary, go through the letters of `s2`. for each new letter, increment
// the frequency the normal way. for any `i` >= `s1.length` we also have an outgoing letter at `i - s1.length`, so decrement. in both cases if the end result is 0, delete the key-value pair.
// then at the end of each iteration, check whether the frequency object is empty - if so, then return true. otherwise, if we make it through the for loop, return false.
function solution_1 (s1, s2) {
  if (s2.length < s1.length) return false;
  const freq = {};
  for (const char of s1) {
    freq[char] = freq[char] ? freq[char] - 1 : -1;
  }
  for (let i = 0; i < s2.length; i++) {
    const newChar = s2[i];
    freq[newChar] = freq[newChar] ? freq[newChar] + 1 : 1;
    if (!freq[newChar]) delete freq[newChar];
    if (i >= s1.length) {
      const oldChar = s2[i - s1.length]
      freq[oldChar] = freq[oldChar] ? freq[oldChar] - 1 : -1;
      if (!freq[oldChar]) delete freq[oldChar];
    }
    if (!Object.keys(freq).length) return true;
  }
  return false;
}

// one-liner based on alex mok's one-liner from day 17 - basically instead of a frequency object, we use an array of size 122 to hold counts for ASCII values of letters, and we compare those arrays
// (by joining) against that of `s1`
var solution_2=(s,S,A=Array(122).fill(0),f=(w,a=[...A])=>[...w].map(e=>a[e.charCodeAt()]++)&&a.join``,x=f(s),r=!8)=>[...S].map((_,i)=>r=f(S.slice(i,i+s.length))==x?!0:r)&&r

const checkInclusion = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = checkInclusion;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s1: 'ab',
  s2: 'eidbaooo',
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s1: 'ab',
  s2: 'eidboaoo',
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: