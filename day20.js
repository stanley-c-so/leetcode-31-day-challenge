// --- Day 20: Kth Smallest Element in a BST ---

// Given a binary search tree, write a function kthSmallest to find the kth smallest element in it.

// Note:
// You may assume k is always valid, 1 ≤ k ≤ BST's total elements.

// Example 1:

// Input: root = [3,1,4,null,2], k = 1
//    3
//   / \
//  1   4
//   \
//    2
// Output: 1

// Example 2:

// Input: root = [5,3,6,2,4,null,null,1], k = 3
//        5
//       / \
//      3   6
//     / \
//    2   4
//   /
//  1
// Output: 3

// Follow up:
// What if the BST is modified (insert/delete operations) often and you need to find the kth smallest frequently? How would you optimize the kthSmallest routine?

// ----------

// RECURSIVE SOLUTION - write a `helper` function that we kick-start with the `root`. given a node, the `helper` will always attempt to recurse to the left first, if it exists. if it recurses,
// we always add a check to see if `k` has reached 0 to stop further processing. after recursing, if applicable, next we consider the current node as a candidate for kth smallest node. we reassign
// `output` to the current node's value. now, we decrement `k`, and if it is 0, we immediately return to stop further processing. after this, if `node.right` exists, we recurse there.
function solution_1 (root, k) {
  let output;                               // temporarily stores the value of the current candidate for kth smallest node
  function helper (node) {
    if (node.left) {                        // if there is anything to the left, we start by recursing there
      helper(node.left);
      if (!k) return;                       // if `k` became 0 somewhere while recursing to the left, we need to add a check here to prevent further processing
    }
    output = node.val;                      // now we process current node. we reassign `output` to `root.value` as this node is potentially the kth smallest node
    if (!--k) return;                       // decrement `k` as we approach the kth smallest node. as soon as it becomes 0, we stop processing
    if (node.right) helper(node.right);     // if there is anything to the right, we recurse there next
  }
  helper(root);
  return output;
}

// ITERATIVE SOLUTION: use a stack to hold ancestors. run an indefinite loop (since we know `k` is guaranteed to be less than BST's total elements). inside, run another while loop
// while `node` exists. as long as it does, push it into the ancestor stack and advance to `node.left`. eventually, when `node` is null, then there were no more nodes to the left.
// we will then pop out of the ancestor stack, and `node` now points to the latest node that has no more left. this is the next lowest node - decrement `k`, and if `k` is now 0, then
// this node's value is the answer. the next thing to do is advance to `node.right` - then it's the end of the outer loop. if `node.right` exists then the it will continue to be
// processed on the next run of the inner while loop. if not, then the next inner while loop won't run, and we continue to pop from stack as usual.
function solution_2 (root, k) {
  const stack = [];                 // INITIALIZATION: ancestor stack
  let node = root;                  // INITIALIZATION: first `node` is `root`
  while (true) {
    while (node) {                  // we just moved to a potential child from another node - run this loop if that child exists
      stack.push(node);             // push the current `node` in the ancestor stack
      node = node.left;             // always attempt to move left
    }
    node = stack.pop();             // when potential child does not exist, pop from stack to return to earlier `node`
    if (!--k) return node.val;      // process this node by decrementing `k`. if `k` reaches 0, immediately return its value
    node = node.right;              // always attempt to move right
  }
}

// one-liner of recursive solution
var solution_3=(r,k,o,h=n=>{if(n.left){h(n.left);if(!k)return}o=n.val;if(!--k)return;if(n.right)h(n.right)})=>h(r)|o

// one-liner of iterative solution, except since the function makes no reference to the original `root` (beyond initializing `node`), we can replace `node` with `root` (`r`)
var solution_4=(r,k,s=[])=>{while(!0){while(r){s.push(r);r=r.left}r=s.pop();if(!--k)return r.val;r=r.right}}

const kthSmallest = solution_4;

// const specialTest = (...args) => {
// };

// NOTE: I developed the following BinaryTree and Batch classes for easy creation of binary trees with arbitrary values.
// first .insert must END with 'true' argument
// subsequent .inserts must START with 'false' argument...
// ...except the last .insert which must START with 'true' argument

class BinaryTree {
  constructor (value) {
    this.val = value;
    this.left = null;
    this.right = null;
  }
  insert (left, right, firstInsert = false) {
    if (left !== null) this.left = new BinaryTree(left);
    if (right !== null) this.right = new BinaryTree(right);
    return firstInsert ? new Batch(this, [this.left, this.right]) : [this.left, this.right];
  }
}

class Batch {
  constructor (root, nodes) {
    this.root = root;
    this.batch = nodes;
  }
  insert (lastInsert, ...values) {
    const nextBatch = [];
    for (let i = 0; i < this.batch.length; i++) {
      if (this.batch[i] !== null) {
        nextBatch.push(...(this.batch[i].insert(
          values[2 * i] === undefined ? null : values[2 * i],
          values[2 * i + 1] === undefined ? null : values[2 * i + 1],
        )));
      } else {
        nextBatch.push(null, null);
      }
    }
    return lastInsert ? this.root : new Batch (this.root, nextBatch);
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = kthSmallest;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  root: new BinaryTree(3)
    .insert(1, 4, true)
    .insert(true, null, 2, null, null),
  k: 1,
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  root: new BinaryTree(5)
    .insert(3, 6, true)
    .insert(false, 2, 4, null, null)
    .insert(true, 1, ...Array(7).fill(null)),
  k: 3,
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: