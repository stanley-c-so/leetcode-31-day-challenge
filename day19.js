// --- Day 19: Online Stock Span ---

// Write a class StockSpanner which collects daily price quotes for some stock, and returns the span of that stock's price for the current day.

// The span of the stock's price today is defined as the maximum number of consecutive days (starting from today and going backwards) for which the price of the stock was less than or equal to today's price.

// For example, if the price of a stock over the next 7 days were [100, 80, 60, 70, 60, 75, 85], then the stock spans would be [1, 1, 1, 2, 1, 4, 6].

// Example 1:

// Input: ["StockSpanner","next","next","next","next","next","next","next"], [[],[100],[80],[60],[70],[60],[75],[85]]
// Output: [null,1,1,1,2,1,4,6]
// Explanation: 
// First, S = StockSpanner() is initialized.  Then:
// S.next(100) is called and returns 1,
// S.next(80) is called and returns 1,
// S.next(60) is called and returns 1,
// S.next(70) is called and returns 2,
// S.next(60) is called and returns 1,
// S.next(75) is called and returns 4,
// S.next(85) is called and returns 6.

// Note that (for example) S.next(75) returned 4, because the last 4 prices
// (including today's price of 75) were less than or equal to today's price.

// ----------

// NOTE: in leetcode, the solution is not written with class syntax. it is written with a constructor function, and all methods are added to the prototype.

// in my initial solution, i track several things: (1) all prices entered into the class so far (`this.history`), (2) all return values calculated so far (`this.span`), (3) a stack of
// non-increasing values (`this.stack`), and (4) a dictionary of the latest "index" value at which you can find a given price (`this.latestIndexOfValue`). the theory behind my solution
// is this: when there is no previous price OR when the current price is less than previous price, span value will be 1. if current price matches previous price, span value will be 1
// more than whatever the previous span value was. and if current price is greater than previous price, we need to pop off the non-increasing stack until it is empty or we have a value
// higher than the current value. then, we can use our dictionary to see how far away that value was, and calculate our span based on the difference. in terms of some logistics - prior
// to the if/else statements, we push `price` into `this.history` - we could also do this afterward, but we would just need to adjust our references - and after the if/else statements
// we also ALWAYS push current `price` into `this.stack` and update `this.latestIndexOfValue[price]` before returning the most recently calculated span value.
class solution_1 {
  constructor () {
    this.history = [];
    this.span = [];
    this.stack = [];
    this.latestIndexOfValue = {};
  }
  next (price) {
    const previousPrice = this.history.length ? this.history[this.history.length - 1] : null;
    this.history.push(price);
    if (!previousPrice || price < previousPrice) {
      this.span.push(1);
    } else if (price === previousPrice) {
      this.span.push(this.span[this.span.length - 1] + 1);
    } else {
      while (this.stack.length && this.stack[this.stack.length - 1] <= price) {
        this.stack.pop();
      }
      if (!this.stack.length) this.span.push(this.history.length);
      else this.span.push(this.history.length - 1 - this.latestIndexOfValue[this.stack[this.stack.length - 1]]);
    }
    this.stack.push(price);
    this.latestIndexOfValue[price] = this.history.length - 1;
    return this.span[this.span.length - 1];
  }
}

// THIS IS LEETCODE'S OFFICIAL SOLUTION:
// this is the same idea as above, but we only really need to track `this.stack`. the stack will contain more than just a price value, however. each element of the stack will contain
// both the price, as well as its own span value! at the beginning of every call to `.next`, we initialize this `span` at 1. then we look to `this.stack`, and as long as the top element
// has a price less than or equal to the current, we pop it, grab its `.span`, and increment current `span` by that amount (effectively picking it up along the way).
class solution_2 {
  constructor () {
    this.stack = [];
  }
  next (price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1].price <= price) {
      span += this.stack.pop().span;
    }
    this.stack.push({ price, span });
    return span;
  }
}

// one-liner - basically the above
class solution_3{constructor(){this.s=[]}next(p,s=1,T=this.s){while(T[0]&&T[T.length-1].p<=p){s+=T.pop().s}T.push({p,s});return s}}

const StockSpanner = solution_3;

const specialTest = (commands, inputs) => {
  const stockSpanner = new StockSpanner();
  const ref = {                                           // this object holds references to the StockSpanner methods...
    next: stockSpanner.next,
  };
  const output = [];
  for (let i = 0; i < commands.length; i++) {
    output.push(
      ref[commands[i]].bind(stockSpanner)(...inputs[i])   // ...but each method still needs to be given `stockSpanner` as its `this` context
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
  commands: ['next', 'next', 'next', 'next', 'next', 'next', 'next'],
  inputs: [
    [100],
    [80],
    [60],
    [70],
    [60],
    [75],
    [85],
  ],
};
expected = [1, 1, 1, 2, 1, 4, 6];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 2
input = {
  commands: ['next', 'next', 'next', 'next', 'next'],
  inputs: [
    [31],
    [41],
    [48],
    [59],
    [79],
  ],
};
expected = [1, 2, 3, 4, 5];
test(func, input, expected, testNum, lowestTest, highestTest);