// plindroms
const isPlindrom = (str) => str === str.split("").reverse().join("");

// console.log(isPlindrom("racecar"));

// int reverse
const reverseInt = (num) => {
  const reversed = num.toString().split("").reverse().join("");
  return parseInt(reversed) * Math.sign(num);
};
// console.log(reverseInt(-12345));

const capitalize = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
// console.log(capitalize("muhammad sefat"));

const fizzBuzz = (n) => {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
};
// fizzBuzz(15);

const maxProfit = (prices) => {
  if (prices.length === 0) return 0;
  let minPrice = prices[0];
  let maxPrice = 0;
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];

    minPrice = Math.min(minPrice, currentPrice);
    const potentialProfit = currentPrice - minPrice;
    maxPrice = Math.max(maxPrice, potentialProfit);
  }
  return maxPrice;
};

const prices = [7, 1, 5, 3, 6, 4];
const profit = maxProfit(prices);
// console.log(profit);

const chunk = (array, size) => {
  const chunked = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, index + size));
    index += size;
  }
  return chunked;
};

const array = [1, 2, 3, 4, 5, 6, 7];
const size = 3;
const chunkedArray = chunk(array, size);
console.log(chunkedArray);
