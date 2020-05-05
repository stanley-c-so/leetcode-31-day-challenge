// --- Day 3: Ransom Note ---

// Given an arbitrary ransom note string and another string containing letters from all the magazines, write a function that will return true if the ransom note can be constructed from the magazines ; otherwise, it will return false.

// Each letter in the magazine string can only be used once in your ransom note.

// Note:
// You may assume that both strings contain only lowercase letters.

// canConstruct("a", "b") -> false
// canConstruct("aa", "ab") -> false
// canConstruct("aa", "aab") -> true

// ----------

// create a `freq` dictionary for the letters in the magazine, and then decrement as you analyze the note. if you ever hit 0 or don't have the letter you need, return false.
function solution_1 (ransomNote, magazine) {
  const freq = {};
  for (const char of magazine) {
    freq[char] = freq[char] + 1 || 1;
  }
  for (const char of ransomNote) {
    if (!freq[char]) return false;
    freq[char]--;
  }
  return true;
}

// one-liner - basically the above, but i set `R` (for return) to be true from the start, and switch it to false if necessary, just to avoid having to write `return` twice (saves 1 char)
var solution_2=(r,m,f={},R=!0)=>{for(c of m)f[c]=f[c]+1|1;for(c of r){if(!f[c])R=!8;f[c]--}return R}

// thomas luo's one-liner - using spread operator on the magazine string, and then using .every to make sure that the frequency counter is non-zero before decrementing for every letter in the note
var solution_3=(r,m,o={})=>[...m].map(e=>o[e]=(o[e]|0)+1)&&[...r].every(e=>o[e]--)

// my improvement on thomas' one-liner - got rid of 2 parentheses by writing `o[e]+1|1` instead of `(o[e]|0)+1`
var solution_4=(r,m,o={})=>[...m].map(e=>o[e]=o[e]+1|1)&&[...r].every(e=>o[e]--)

// alex mok's one-liner - trading efficiency for shorter code. for every letter in the ransom note, check whether the message includes that letter. if so, replace the first occurrence of that letter with ''
var solution_5=(r,m)=>[...r].every(e=>m.includes(e)?m=m.replace(e,''):0)

const canConstruct = solution_5;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = canConstruct;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  ransomNote: 'a',
  magazine: 'b',
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  ransomNote: 'aa',
  magazine: 'ab',
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  ransomNote: 'aa',
  magazine: 'aab',
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: