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
// (special thanks to manny bugallo for the various improvements for shortening this one-liner)
var solution_3=(N,d,o,g={},v={},l='length',K=Object.keys,P='push')=>{if(d!==null&&!d[l])return !0;if(!o){o=d.reduce((o,p)=>{let [a,b]=p;if(!(a in o))o[a]=[];if(!(b in o))o[b]=[];o[a][P](b);o[b][P](a);return o},{})};if(!K(o)[l])return !0;let s=[+K(o)[0]];while(s[l]){let H=s.pop();if(!(H in v)){let h=o[H];if(!(H in g)){g[H]='A';v[H]=1;for(p of h){g[p]='B';s[P](p)}delete o[H]}else if(g[H]=='A'){v[H]=1;for(p of h){if(g[p]=='A')return !6;g[p]='B';s[P](p)}delete o[H]}else{v[H]=1;for(p of h){if(g[p]=='B')return !9;g[p]='A';s[P](p)}delete o[H]}}}if(K(g).length==N)return !0;return arguments.callee(N-K(g)[l],null,o)}

// alex mok's solution - alex uses `arr` to track who hates whom, and `group` to track who is on which team. by default, `group` has everyone at 0 (no team assigned). alex iterates through the array
// and if anyone is unassigned, he kick-starts a `helper` function that assigns that person to team 1 (as opposed to team -1). then, he iterates through everyone that that person hates, and attempts
// to recurse and assign those people to the opposite team. at the start of the `helper` call, he checks whether the person he is trying to assign to a certain team has already been assigned to the
// other team - if so, he returns `false`. else, if that person is already assigned to the correct team (or he is assigning that person now) then he returns `true`.
var solution_4 = function (N, dislikes) {
  const arr = [];                                           // this will store who hates whom
  const group = new Array(N + 1).fill(0);                   // this stores which team everyone is on (1 or -1, or 0 for unassigned)
  let num = N + 1;
  while (num--) arr.push(new Array());                      // initialize `arr` with an empty array for each bucket
  for (let [a,b] of dislikes) {                             // parse mutual hate relationship from `dislikes` into `arr`
    arr[a].push(b);
    arr[b].push(a);
  }
  for (let i = 1; i <= N; i++) {                            // iterate through everyone...
    if (group[i] === 0 && !helper(i, 1)) return false;      // ...and assign any unassigned person to team 1, kick-starting the recursive process. if any `helper` call comes back `false`, return `false`
  }
  return true;                                              // ...otherwise, if no recursive calls come back `false`, return `true`
  function helper (i, j) {                                  // `helper` definition: `i` marks the person, and `j` marks the team we want to assign that person to (1 or -1)
    if (group[i] !== 0) {                                   // if person `i` is already on a team...
      if (group[i] !== j) return false;                     // ...return whether that person is already on team `j` (which we want that person to be assigned to now)
      else return true;
    }
    if (arr[i].length === 0) {                              // if person `i` doesn't hate anyone...
      group[i] = j;
      return true;                                          // ...return `true` (base case)
    }
    group[i] = j;                                           // assign `i` to team `j`, as we intended
    for (let val of arr[i]) {                               // else, if person `i` hates people...
      if (!helper(val, -1 * j)) {                           // attempt to recurse `helper` on everyone `i` hates, and assign those people to the opposite team (`-1 * j`). if any call comes back `false`...
        return false;                                       // ...then we can return `false` here...
      }
    }
    return true;                                            // ...else, we can return `true`
  }
};

// alex mok's one-liner - basically the above (won't work on node but works on leetcode)
var solution_5=(N,d)=>{a=[];g=Array(N+1).fill(0);c=N+1;while(c--) a.push(Array());for([x,y] of d){a[x].push(y);a[y].push(x)};for(i=1;i<=N;i++){if(g[i]==0&&!h(i,1))return 0}return 1;function h(i,j){if(g[i]!=0){if(g[i]!=j)return 0;else return 1}if(a[i].length==0){g[i]=j;return 1}g[i]=j;for(val of a[i])if(!h(val,-1*j))return 0;return 1}}

// my improvement on alex mok's one-liner
var solution_6=(N,d,g=Array(N+1).fill(0),a=g.map(_=>[]),h=(i,t)=>{if(g[i])return g[i]==t;g[i]=t;for(v of a[i]){if(!h(v,t*-1))return !6}return !0})=>{for([x,y]of d){a[x].push(y);a[y].push(x)}for(i=1;i<=N;++i){if(!g[i]&&!h(i,1))return !9}return !0}

const possibleBipartition = solution_6;

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