// --- Day 17: Find All Anagrams in a String ---

// Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.

// Strings consists of lowercase English letters only and the length of both strings s and p will not be larger than 20,100.

// The order of output does not matter.

// Example 1:

// Input:
// s: "cbaebabacd" p: "abc"

// Output:
// [0, 6]

// Explanation:
// The substring with start index = 0 is "cba", which is an anagram of "abc".
// The substring with start index = 6 is "bac", which is an anagram of "abc".

// Example 2:

// Input:
// s: "abab" p: "ab"

// Output:
// [0, 1, 2]

// Explanation:
// The substring with start index = 0 is "ab", which is an anagram of "ab".
// The substring with start index = 1 is "ba", which is an anagram of "ab".
// The substring with start index = 2 is "ab", which is an anagram of "ab".

// ----------

// first create a frequency dictionary of `p`, but make the values negative rather than positive. then, using that dictionary, go through the letters of `s`. for each new letter, increment
// the frequency the normal way. for any `i` >= `p.length` we also have an outgoing letter at `i - p.length`, so decrement. in both cases if the end result is 0, delete the key-value pair.
// then at the end of each iteration, check whether the frequency object is empty - if so, then `i - p.length + 1` is a solution, so push it into output.
function solution_1 (s, p) {
  const output = [];
  if (s.length < p.length) return output;                         // UNNECESSARY EDGE CASE HANDLING: while leetcode does have a test case like this, the logic still holds. this just optimizes.
  const freq = {};                                                // INITIALIZATION: start a `freq` object and DECREMENT it with the letters of `p`
  for (const char of p) {
    freq[char] = freq[char] || 0;
    freq[char]--;
  }
  for (let i = 0; i < s.length; i++) {                            // now, process every incoming letter by incrementing the normal way...
    const newChar = s[i];
    freq[newChar] = freq[newChar] || 0;
    freq[newChar]++;
    if (!freq[newChar]) delete freq[newChar];                     // (if a frequency reaches 0, delete the key-value pair)
    if (i >= p.length) {                                          // when `i` reaches `p.length` or higher, there are now outgoing letters too, so decrement those
      const oldChar = s[i - p.length]
      freq[oldChar] = freq[oldChar] || 0;
      freq[oldChar]--;
      if (!freq[oldChar]) delete freq[oldChar];                   // (again, if a frequency reaches 0, delete the key-value pair)
    }
    if (!Object.keys(freq).length) output.push(i - p.length + 1); // at the end of each iteration, check whether the `freq` object is empty. if so, add `i - p.length + 1` to `output`
  }
  return output;
}

// one-liner - basically the above, but instead of deleting empty keys, i just check whether every key has a value of 0 to determine whether to push this iteration into the output.
// as a result, i can simplify a bit of the logic for outgoing letters (i don't need to check if their key already exists).
var solution_2=(s,p,O=[],f={},P=p.length)=>[...p].map(c=>f[c]=f[c]?f[c]-1:-1)&&[...s].map((n,i)=>(f[n]=f[n]?f[n]+1:1,i>=P?(o=s[i-P],f[o]--):0,Object.keys(f).every(k=>!f[k])?O.push(i-P+1):0))&&O

const findAnagrams = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findAnagrams;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s: 'cbaebabacd',
  p: 'abc'
};
expected = [0, 6];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s: 'abab',
  p: 'ab'
};
expected = [0, 1, 2];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: