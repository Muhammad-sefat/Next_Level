const friendList = ["Alice", "Bob", "Charlie", "David"];

const getFriends = (friendList, findFriend) => {
  for (let i = 0; i < friendList.length; i++) {
    if (friendList[i] === findFriend) {
      return `${findFriend} is in your friend list.`;
    }
  }
  return `${findFriend} is not in your friend list.`;
};
// console.log(getFriends(friendList, "Charlie"));
// console.log(getFriends(friendList, "Bob"));

class Item {
  constructor() {
    this.length = 0;
    this.items = {};
  }

  push(item) {
    this.items[this.length] = item;
    this.length++;
    return this.length;
  }
  getItem(index) {
    return this.items[index];
  }
  pop() {
    if (this.length === 0) {
      return undefined;
    }
    const lastItem = this.items[this.length - 1];
    delete this.items[this.length - 1];
    this.length--;
    return lastItem;
  }

  shift() {
    const firstItem = this.items[0];
    if (this.length === 0) {
      return undefined;
    }
    for (let i = 0; i < this.length - 1; i++) {
      this.items[i] = this.items[i + 1];
    }
    delete this.items[this.length];
    this.length--;
    return firstItem;
  }
  deleteItemByIndex(index) {
    const deletedItem = this.items[index];
    for (let i = index; i < this.length - 1; i++) {
      this.items[i] = this.items[i + 1];
    }
    delete this.items[this.length - 1];
    this.length--;
    return deletedItem;
  }
}

const myItem = new Item();
myItem.push("Item1");
myItem.push("Item2");
myItem.push("Item3");
myItem.push("Item4");

// console.log(myItem.deleteItemByIndex(3));
// console.log("my new items", myItem);

const reverseString = (str) => {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
};
console.log(reverseString("Hello"));
