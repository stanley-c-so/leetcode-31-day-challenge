// --- Day 16: Odd Even Linked List ---

// Given a singly linked list, group all odd nodes together followed by the even nodes. Please note here we are talking about the node number and not the value in the nodes.

// You should try to do it in place. The program should run in O(1) space complexity and O(nodes) time complexity.

// Example 1:

// Input: 1->2->3->4->5->NULL
// Output: 1->3->5->2->4->NULL

// Example 2:

// Input: 2->1->3->5->6->4->7->NULL
// Output: 2->3->6->7->1->5->4->NULL

// Note:

// The relative order inside both the even and odd groups should remain as it was in the input.
// The first node is considered odd, the second node even and so on ...

// ----------

// first, if there are fewer than two nodes, we can simply return whatever `head` is. otherwise,
// we set `odd` and `even` pointers, and we save a reference to the first even node. then we run
// a while loop: as long as a node comes after the current `even`, we can connect and advance `odd`
// to it. then we can immediately check if another node comes after that, and if so, we can connect
// and advance `even` to it. otherwise, we must connect `even` to null (or else it's connected to
// the final odd node). after the while loop is over, just connect the final odd node to `firstEven`
// and return head.
function solution_1 (head) {
  if (!head || !head.next) return head;   // EDGE CASE: 0- or 1-node input - just return `head`
  const firstEven = head.next;            // save reference to the first even node
  let odd = head;
  let even = firstEven;
  while (even.next) {                     // continue as long as there's a node after `even`
    odd.next = even.next;                 // connect and advance `odd` to the node after `even`
    odd = even.next;
    if (odd.next) {                       // if there's another node after that...
      even.next = odd.next;               // ...connect and advance `even` to that node
      even = odd.next;
    } else {
      even.next = null;                   // ...else, connect `even` to null
    }
  }
  odd.next = firstEven;                   // connect final odd node to `firstEven`
  return head;
}

// one-liner - basically the above
var solution_2=(h,n='next')=>{if(!h||!h[n])return h;f=h[n];o=h;e=f;while(e[n]){o[n]=e[n];o=e[n];o[n]?(e[n]=o[n],e=o[n]):e[n]=null}o[n]=f;return h}

// alex mok's one-liner - since the while loop requires not only that `even.next` be truthy, but `even` itself, we can catch the edge case for only 1 node. also, the node hopscotch logic is simpler.
var solution_3=(h,n='next',o=h,E=e=h&&h[n])=>{while(e&&e[n]){o[n]=e[n];o=o[n];e[n]=o[n];e=e[n]}h?o[n]=E:0;return h}

const oddEvenList = solution_3;

// const specialTest = (...args) => {
// };

class ListNode {
  constructor (val, ...extraVals) {
    this.val = val;
    this.next = null;
    if (extraVals.length) this.insert(...extraVals);
  }
  insert (...vals) {
    let currentNode = this;
    for (const val of vals) {
      const nextNode = new ListNode(val);
      currentNode.next = nextNode;
      currentNode = nextNode;
    }
    return this;
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = oddEvenList;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  head: new ListNode(1, 2, 3, 4, 5),
};
expected = new ListNode(1, 3, 5, 2, 4);
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  head: new ListNode(2, 1, 3, 5, 6, 4, 7),
};
expected = new ListNode(2, 3, 6, 7, 1, 5, 4);
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: