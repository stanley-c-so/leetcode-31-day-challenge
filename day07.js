// --- Day 7: Cousins in Binary Tree ---

// In a binary tree, the root node is at depth 0, and children of each depth k node are at depth k+1.

// Two nodes of a binary tree are cousins if they have the same depth, but have different parents.

// We are given the root of a binary tree with unique values, and the values x and y of two different nodes in the tree.

// Return true if and only if the nodes corresponding to the values x and y are cousins.
 
// Example 1:
// Input: root = [1,2,3,4], x = 4, y = 3
// Output: false

// Example 2:
// Input: root = [1,2,3,null,4,null,5], x = 5, y = 4
// Output: true

// Example 3:
// Input: root = [1,2,3,null,4], x = 2, y = 3
// Output: false

// Note:

// The number of nodes in the tree will be between 2 and 100.
// Each node has a unique integer value from 1 to 100.

// ----------

// since each node will have a unique integer value from 1 to 100, we can store information about each node in an array of length 101. we still store objects with parent and depth properties.
function solution_1 (root, x, y) {
  const nodes = [null];
  const stack = [[root, null, 0]];
  while (stack.length) {
    const [node, parent, depth] = stack.pop();
    nodes[node.val] = {
      parent: parent ? parent.val : null,
      depth
    };
    if (node.left) stack.push([node.left, node, depth + 1]);
    if (node.right) stack.push([node.right, node, depth + 1]);
  }
  return nodes[x].depth === nodes[y].depth && nodes[x].parent !== nodes[y].parent;
}

// one-liner - basically the above
var solution_2=(R,x,y,N=[],s=[[R,null,0]])=>{while(s.length){[n,p,d]=s.pop();N[n.val]={p:p?p.val:null,d};n.left?s.push([n.left,n,d+1]):0;n.right?s.push([n.right,n,d+1]):0}return N[x].d==N[y].d&&N[x].p!=N[y].p}

// thomas luo's one-liner (doesn't work in node unless you change `&` to `&&` and the final `||` to `|` - here, i just changed it)
var solution_3=(r,x,y,a,b,c,d,h=(r,x,y,p,l=0)=>{r?h(r.left,x,y,r,l+1)|h(r.right,x,y,r,l+1)|r.val==x?a=(c=p)&&l:r.val==y?b=(d=p)&&l:0:0})=>h(r,x,y)||a==b&&c!=d

// alex mok's one-liner (doesn't work in node unless you change `|` after `t(r,0)` to `&&` - here, i just changed it) - here, we declare a helper function where we feed in a node, level, and
// parent, and the function plugs this info into the `h` object, along with a recursive call to the node's children (we uselessly store this inside the `h` object as well). we kick start the
// process with the root. then at the very end we simply query the `h` object and see whether x and y are the same level, but don't have the same parents.
var solution_4=(r,x,y,h={},t=(n,l,p)=>n?h[n.val]=[l++,p,t(n.left,l,n),t(n.right,l,n)]:0)=>t(r,0)&&h[x][0]==h[y][0]&&h[x][1]!=h[y][1]

const isCousins = solution_4;

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
const func = isCousins;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  root: new BinaryTree(1)
    .insert(2, 3, true)
    .insert(true, 4, null, null, null),
  x: 4,
  y: 3,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  root: new BinaryTree(1)
    .insert(2, 3, true)
    .insert(true, null, 4, null, 5),
  x: 5,
  y: 4,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  root: new BinaryTree(1)
    .insert(2, 3, true)
    .insert(true, null, 4, null, null),
  x: 2,
  y: 3,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: