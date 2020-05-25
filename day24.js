// --- Day 24: Construct Binary Search Tree from Preorder Traversal ---

// Return the root node of a binary search tree that matches the given preorder traversal.

// (Recall that a binary search tree is a binary tree where for every node, any descendant of node.left has a value < node.val, and any descendant of node.right has a value > node.val.Also recall that a preorder traversal displays the value of the node first, then traverses node.left, then traverses node.right.)

// It's guaranteed that for the given test cases there is always possible to find a binary search tree with the given requirements.

// Example 1:

// Input: [8, 5, 1, 7, 10, 12]
// Output: [8, 5, 10, 1, 7, null, 12]

//          8
//         / \
//        5   10
//       / \    \
//      1   7    12

// Constraints:

// 1 <= preorder.length <= 100
// 1 <= preorder[i] <= 10 ^ 8
// The values of preorder are distinct.

// ----------

// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

// the most straightforward approach is to create a root from the first preorder number, and then recursively insert the subsequent numbers into
// the BST according to BST insertion rules. however, i think this is O(n log n) time complexity because each insert is log n, and we insert n
// times.
function solution_1 (preorder) {
  const root = new TreeNode(preorder[0]);
  function insert (root, val) {
    if (val <= root.val) {
      if (root.left) {
        insert(root.left, val);
      } else {
        root.left = new TreeNode(val);
      }
    } else {
      if (root.right) {
        insert(root.right, val);
      } else {
        root.right = new TreeNode(val);
      }
    }
  }
  for (let i = 1; i < preorder.length; ++i) {
    insert(root, preorder[i]);
  }
  return root;
}

// this is leetcode's optimized recursive solution (linear time and space complexity):
function solution_2 (preorder) {
  function helper (lower = -Infinity, upper = Infinity) {
    if (idx === preorder.length) return null;               // BASE CASE: if out of bounds, tree is complete, so return `null`
    const val = preorder[idx];                              // INITIALIZATION: get `val`
    if (val < lower || val > upper) return null;            // BASE CASE: if `val` is not within range, return `null`
    const root = new TreeNode(val);                         // if `val` is in bounds, create a `root` by making a new `TreeNode`
    ++idx;                                                  // increment "global" `idx` - ONLY RUNS WHEN A NEW NODE WAS MADE!
    root.left = helper(lower, val);                         // recurse to the left with new lower and upper bounds
    root.right = helper(val, upper);                        // recurse to the right with new lower and upper bounds
    return root;                                            // return newly created `root`
  }
  let idx = 0;                                              // note: `idx` is "global" to this solution
  return helper();                                          // kick start the `helper` function
}

// this is leetcode's optimized iterative solution (linear time and space complexity):
function solution_3 (preorder) {
  const root = new TreeNode(preorder[0]);
  const stack = [root];                                                 // INITIALIZATION: put `root` in `stack`
  for (let i = 1; i < preorder.length; ++i) {
    let node = stack[stack.length - 1];                                 // note: `stack` will never be empty at this point (we always push `child`)
    const child = new TreeNode(preorder[i]);                            // `child` is the new node for the next number in `preorder` list
    while (stack.length && stack[stack.length - 1].val < child.val) {   // while last element of `stack` has a LESSER value than `child`...
      node = stack.pop();                                               // ...pop `stack`. (last stack item is greater than `child`, OR empty stack)
    }                                                                   // (that said, if we pop, `node` is still less than `child`)
    if (node.val < child.val) {
      node.right = child;                                               // we end up here if we popped earlier
    } else {
      node.left = child;                                                // if we didn't pop, we end up here
    }
    stack.push(child);                                                  // always push `child` into the `stack`
  }
  return root;
}

// one-liner - iterative solution
var solution_4=(p,T=TreeNode,r=new T(p[0]),s=[r],l='length')=>{for(i=1;i<p[l];++i){let n=s[s[l]-1],c=new T(p[i]);while(s[l]&&s[s[l]-1].val<c.val)n=s.pop();n.val<c.val?n.right=c:n.left=c;s.push(c)}return r}

// thomas luo's one-liner
var solution_5=(p,T=TreeNode,r=new T(p[0]),I=(v,n)=>n?(v>n.val?n.right=I(v,n.right):n.left=I(v,n.left))&&n:new T(v))=>p.map((v,i)=>i&&I(v,r))&&r

// alex mok's one-liner
var solution_6=(a,I=Infinity,f=(l,h,c=a[0],t=!c||c<l||c>h?null:new TreeNode(a.shift()),N=t&&[t.left=f(l,t.val),t.right=f(t.val,h)])=>t)=>f(-I,I)

const bstFromPreorder = solution_6;

// const specialTest = (...args) => {
// };

// NOTE: I developed the following BinaryTree and Batch classes for easy creation of binary trees with arbitrary values.
// first .insert must END with 'true' argument
// subsequent .inserts must START with 'false' argument...
// ...except the last .insert which must START with 'true' argument

class BinaryTree {
  constructor(value) {
    this.val = value;
    this.left = null;
    this.right = null;
  }
  insert(left, right, firstInsert = false) {
    if (left !== null) this.left = new BinaryTree(left);
    if (right !== null) this.right = new BinaryTree(right);
    return firstInsert ? new Batch(this, [this.left, this.right]) : [this.left, this.right];
  }
}

class Batch {
  constructor(root, nodes) {
    this.root = root;
    this.batch = nodes;
  }
  insert(lastInsert, ...values) {
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
    return lastInsert ? this.root : new Batch(this.root, nextBatch);
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = bstFromPreorder;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
const test1 = new TreeNode(8);
test1.left = new TreeNode(5);
test1.left.left = new TreeNode(1);
test1.left.right = new TreeNode(7);
test1.right = new TreeNode(10);
test1.right.right = new TreeNode(12);
input = {
  preorder: [8, 5, 1, 7, 10, 12],
};
expected = test1;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: