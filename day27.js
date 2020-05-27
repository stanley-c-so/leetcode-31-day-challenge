// --- Day 27: Possible Bipartition ---

// Given a set of N people (numbered 1, 2, ..., N), we would like to split everyone into two groups of any size.

// Each person may dislike some other people, and they should not go into the same group. 

// Formally, if dislikes[i] = [a, b], it means it is not allowed to put the people numbered a and b into the same group.

// Return true if and only if it is possible to split everyone into two groups in this way.

// Example 1:

// Input: N = 4, dislikes = [[1,2],[1,3],[2,4]]
// Output: true
// Explanation: group1 [1,4], group2 [2,3]

// Example 2:

// Input: N = 3, dislikes = [[1,2],[1,3],[2,3]]
// Output: false

// Example 3:

// Input: N = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]
// Output: false
 
// Note:

// 1 <= N <= 2000
// 0 <= dislikes.length <= 10000
// 1 <= dislikes[i][j] <= N
// dislikes[i][0] < dislikes[i][1]
// There does not exist i != j for which dislikes[i] == dislikes[j].

// ----------

// the general DFS approach can be described as follows: put the first hater in group A. anyone hated by this person should go in group B, and get pushed into the stack. for those folks, anyone they
// hate should go in group A, etc. at each iteration (other than the first), we check whether any conflicts arise (when we try to assign someone to one group, but realize that that person is already in
// the other group). if a conflict appears we can immediately return `false`. by using a stack, we can ensure that we fully iterate through a closed network of people who hate each other. once that
// stack runs dry, it is possible that we have analyzed everyone, in which case we can return `true`. however, if anyone has not yet been assigned to a team, then we have at least one additional closed
// network of people who hate each other, but they can be assigned to either A or B independent of the assignment of the first network, so all we need to do is recurse. some things to keep in mind:
// - on the first call of this function we parse through `dislikes` and create a `dislikesObj` for O(1) lookup of who hates whom. it is important that we mark hatred as reciprocal (see note below).
// - thus, if we recurse, we can set `dislikes` to null since we don't need it anymore
// - on the first iteration of any call of this function, we should arbitrarily assign the first hater (the first key of `dislikesObj`) to group A
// - any time we "fully process" someone (assign that person to a team, AND specifically visit that person from popping from a stack) we can mark that person as visited
// - when a person is visited, we can also delete that person's key from `dislikesObj` since we don't need that information anymore. this way, when we recurse, `dislikesObj` will only contain keys
//   for people we have not yet assigned to teams. this ensures that we are only dealing with unprocessed people.
// - why is it important to mark hate relationships as reciprocal? let's say A hates B and B hates A. let's say C hates only D, and D hates B. if we only mark the hate relationships in one direction,
//   we could incorrectly analyze A and B as one network, and potentially end up putting C on A's team, and D on B's team, even though D hates B. by marking the hate relationships in both directions,
//   we guarantee that A, B, D, and then C all get processed together as one group.
function solution_1 (N, dislikes, dislikesObj) {
  if (dislikes !== null && !dislikes.length) return true;                 // EDGE CASE: if nobody dislikes anyone, automatically return `true`. (this is set to `null` on any recursive calls)
  if (!dislikesObj) {                                                     // INITIALIZATION (only runs on original call): create `dislikesObj` for O(1) lookup of who hates whom
    dislikesObj = {};
    for (const pair of dislikes) {
      if (!(pair[0] in dislikesObj)) dislikesObj[pair[0]] = new Set();
      if (!(pair[1] in dislikesObj)) dislikesObj[pair[1]] = new Set();    // note: if A hates B, then we can say B also hates A. this will be important if we were unsure about A on first pass
      dislikesObj[pair[0]].add(pair[1]);
      dislikesObj[pair[1]].add(pair[0]);
    }
  }
  if (!Object.keys(dislikesObj).length) return true;                      // EDGE CASE: if this is a recursive call and `dislikesObj` is coming in empty, then automatically return `true`
  const groupA = new Set();
  const groupB = new Set();
  const visited = new Set();
  const stack = [+Object.entries(dislikesObj)[0][0]];                     // INITIALIZATION: `stack` contains haters, and starts with the first hater. (note that we need to coerce hater to a number)
  while (stack.length) {
    const hater = stack.pop();
    if (visited.has(hater)) continue;                                     // (if we have already FULLY processed `hater` to a team, then skip. NOTE: a `hater` is only FULLY processed once assigned a team!
    const hated = dislikesObj[hater];
    if (!groupA.size) {                                                   // this condition only runs on the first iteration of this function call: `groupA` will be empty, so assign first `hater` to A
      groupA.add(hater);
      visited.add(hater);
      for (const person of hated) {
        groupB.add(person);                                               // obviously, add everyone hated by `hater` to B. note that since this is the first iteration, there should be no conflicts yet
        stack.push(person);
      }
      delete dislikesObj[hater];                                          // delete extraneous information about `hater` now that `hater` has been assigned to a team
    }
    else if (groupA.has(hater)) {                                         // if `hater` is already in A...
      visited.add(hater);                                                 // ...then we mark `hater` as fully processed
      for (const person of hated) {                                       // ...we check if anyone that `hater` hates is also in A...
        if (groupA.has(person)) return false;                             // ...if so, there's a conflict, so return `false`
        groupB.add(person);                                               // ...otherwise, add that person to B...
        stack.push(person);                                               // ...and process that person next
      }
      delete dislikesObj[hater];                                          // (again, we can delete extraneous information about `hater` now that `hater` has been assigned a team)
    } else {                                                              // ELSE, `hater` must be in group B. why? this person only made it to the stack by virtue of being hated by someone in A.
      visited.add(hater);
      for (const person of hated) {
        if (groupB.has(person)) return false;
        groupA.add(person);
        stack.push(person);
      }
      delete dislikesObj[hater];
    }
  }

  // WHEN THE STACK RUNS DRY, THAT MEANS A CLOSED NETWORK OF PEOPLE WHO HATE EACH OTHER HAS BEEN ASSIGNED TO TEAMS WITH NO CONFLICTS.

  if (groupA.size + groupB.size === N) return true;                       // BASE CASE: has everyone now been assigned to a team? if so, then return `true` as no conflicts arose
  return arguments.callee(                                                // if not, recurse on the remaining people (`dislikesObj` is sufficient to represent their information)
    N - (groupA.size + groupB.size),                                      // (this is the new number of people who still need to be assigned)
    null,                                                                 // this information is now completely extraneous
    dislikesObj                                                           // this only retains the `dislikes` information for anyone who wasn't already processed above
  );
}

// this is the same solution as above, but refactored so that all group information is stored in a single object, `groups`
function solution_2 (N, dislikes, dislikesObj) {
  if (dislikes !== null && !dislikes.length) return true;                 // EDGE CASE: if nobody dislikes anyone, automatically return `true`. (this is set to `null` on any recursive calls)
  if (!dislikesObj) {                                                     // INITIALIZATION (only runs on original call): create `dislikesObj` for O(1) lookup of who hates whom
    dislikesObj = {};
    for (const pair of dislikes) {
      if (!(pair[0] in dislikesObj)) dislikesObj[pair[0]] = new Set();
      if (!(pair[1] in dislikesObj)) dislikesObj[pair[1]] = new Set();    // note: if A hates B, then we can say B also hates A. this will be important if we were unsure about A on first pass
      dislikesObj[pair[0]].add(pair[1]);
      dislikesObj[pair[1]].add(pair[0]);
    }
  }
  if (!Object.keys(dislikesObj).length) return true;                      // EDGE CASE: if this is a recursive call and `dislikesObj` is coming in empty, then automatically return `true`
  const groups = {};
  const visited = new Set();
  const stack = [+Object.entries(dislikesObj)[0][0]];                     // INITIALIZATION: `stack` contains haters, and starts with the first hater. (note that we need to coerce hater to a number)
  while (stack.length) {
    const hater = stack.pop();
    if (visited.has(hater)) continue;                                     // (if we have already FULLY processed `hater` to a team, then skip. NOTE: a `hater` is only FULLY processed once assigned a team!
    const hated = dislikesObj[hater];
    if (!(hater in groups)) {                                             // this condition only runs on the first iteration of this function call: `hater` does not exist in `groups`
      groups[hater] = 'A';
      visited.add(hater);
      for (const person of hated) {
        groups[person] = 'B';                                             // obviously, add everyone hated by `hater` to B. note that since this is the first iteration, there should be no conflicts yet
        stack.push(person);
      }
      delete dislikesObj[hater];                                          // delete extraneous information about `hater` now that `hater` has been assigned to a team
    }
    else if (groups[hater] === 'A') {                                     // if `hater` is already in A...
      visited.add(hater);                                                 // ...then we mark `hater` as fully processed
      for (const person of hated) {                                       // ...we check if anyone that `hater` hates is also in A...
        if (groups[person] === 'A') return false;                         // ...if so, there's a conflict, so return `false`
        groups[person] === 'B';                                           // ...otherwise, add that person to B...
        stack.push(person);                                               // ...and process that person next
      }
      delete dislikesObj[hater];                                          // (again, we can delete extraneous information about `hater` now that `hater` has been assigned a team)
    } else {                                                              // ELSE, `hater` must be in group B. why? this person only made it to the stack by virtue of being hated by someone in A.
      visited.add(hater);
      for (const person of hated) {
        if (groups[person] === 'B') return false;
        groups[person] === 'A';
        stack.push(person);
      }
      delete dislikesObj[hater];
    }
  }
  if (Object.keys(groups).length === N) return true;                      // BASE CASE: has everyone now been assigned to a team? if so, then return `true` as no conflicts arose
  return arguments.callee(                                                // if not, recurse on the remaining people (`dislikesObj` is sufficient to represent their information)
    N - Object.keys(groups).length,                                       // (this is the new number of people who still need to be assigned)
    null,                                                                 // this information is now completely extraneous
    dislikesObj                                                           // this only retains the `dislikes` information for anyone who wasn't already processed above
  );
}

// one-liner - basically the above (note that in leetcode, `arguments.callee` won't work for some reason, so replace it with the proper name)
var solution_3=(N,d,o,g={},v={},l='length',O=Object,K=O.keys)=>{if(d!==null&&!d[l])return !0;if(!o){o=d.reduce((o,p)=>{let [a,b]=p;if(!(a in o))o[a]=[];if(!(b in o))o[b]=[];o[a].push(b);o[b].push(a);return o},{})};if(!K(o)[l])return !0;let s=[+O.entries(o)[0][0]];while(s[l]){let H=s.pop();if(!(H in v)){let h=o[H];if(!(H in g)){g[H]='A';v[H]=1;for(p of h){g[p]='B';s.push(p)}delete o[H]}else if(g[H]=='A'){v[H]=1;for(p of h){if(g[p]=='A')return !6;g[p]='B';s.push(p)}delete o[H]}else{v[H]=1;for(p of h){if(g[p]=='B')return !9;g[p]='A';s.push(p)}delete o[H]}}}if(K(g).length==N)return !0;return arguments.callee(N-K(g)[l],null,o)}

const possibleBipartition = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = possibleBipartition;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  N: 4,
  dislikes: [ [1,2], [1,3], [2,4] ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  N: 3,
  dislikes: [ [1,2], [1,3], [2,3] ],
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  N: 5,
  dislikes: [ [1,2], [2,3], [3,4], [4,5], [1,5] ],
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: