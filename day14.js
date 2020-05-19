// --- Day 14: Implement Trie (Prefix Tree) ---

// Implement a trie with insert, search, and startsWith methods.

// Example:

// Trie trie = new Trie();

// trie.insert("apple");
// trie.search("apple");   // returns true
// trie.search("app");     // returns false
// trie.startsWith("app"); // returns true
// trie.insert("app");   
// trie.search("app");     // returns true

// Note:

// You may assume that all inputs are consist of lowercase letters a-z.
// All inputs are guaranteed to be non-empty strings.

// ----------

// NOTE: in leetcode, the solution is not written with class syntax. it is written with a constructor function, and all methods are added to the prototype.

// note: my `TrieNode` class is purely optional - each node is actually quite simple here. in fact, `this.val` is optional since we never even read from it!
class TrieNode {
  constructor (char) {
    this.val = char;
    this.next = {};
  }
}

class solution_1 {
  constructor () {
    // this.root = new TrieNode(null);
    this.root = { val: null, next: {} };              // the `TrieNode` class is optional - this alternate code is simple enough
  }
  insert (word) {
    word += '*';                                      // after inserting every letter of `word`, we must add an additional node for value '*' to mark the end of a word
    let node = this.root;
    for (const char of word) {
      if (!(char in node.next)) {
        // node.next[char] = new TrieNode(char);
        node.next[char] = { val: char, next: {} };    // the `TrieNode` class is optional - this alternate code is simple enough
      }
      node = node.next[char];
    }
  }
  search (word) {
    return this.startsWith(word + '*');               // our insert method adds '*' to the end of words upon insertion, so we can run our `startsWith` method with '*' at the end of word
  }
  startsWith (prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!(char in node.next)) return false;
      node = node.next[char];
    }
    return true;
  }
}

// one-liner - basically the above, with no `TrieNode` class, and with no `.val` property on trie nodes because we never really need them
class solution_2{constructor(){this.r={n:{}}}insert(w){w+='*';let n=this.r;for(let c of w){if(!(c in n.n))n.n[c]={n:{}};n=n.n[c]}}search(w){return this.startsWith(w+'*')}startsWith(p){let n=this.r;for(let c of p){if(!(c in n.n))return !8;n=n.n[c]}return !0}}

const Trie = solution_2;

const specialTest = (commands, inputs) => {
  const trie = new Trie();
  const ref = {                                   // this object holds references to the Trie methods...
    insert: trie.insert,
    search: trie.search,
    startsWith: trie.startsWith,
  };
  const output = [];
  for (let i = 0; i < commands.length; i++) {
    output.push(
      ref[commands[i]].bind(trie)(...inputs[i])   // ...but each method still needs to be given `trie` as its `this` context
    );
  }
  return output;
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
  commands: ['insert', 'search', 'search', 'startsWith', 'insert', 'search'],
  inputs: [
    ['apple'],
    ['apple'],
    ['app'],
    ['app'],
    ['app'],
    ['app'],
  ],
};
expected = [undefined, true, false, true, undefined, true];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: