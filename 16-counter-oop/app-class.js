function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

class Counter {
  constructor(element, value) {
    this.counter = element;
    this.value = value;
    this.resetBtn = element.querySelector(".reset");
    this.decreaseBtn = element.querySelector(".decrease");
    this.increaseBtn = element.querySelector(".increase");
    this.valueDOM = element.querySelector(".value");
    this.valueDOM.textContent = this.value;
    // bind this to all function
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.reset = this.reset.bind(this);
    // if we didn't bind, this.increase will point button element
    // bu when we bind with this, it points Counter.
    // so we can now use Counter's prototype's methods like increase , decrease
    this.increaseBtn.addEventListener("click", this.increase);
    this.decreaseBtn.addEventListener("click", this.decrease);
    this.resetBtn.addEventListener("click", this.reset);
  }

  // methods
  increase = function () {
    this.value++;
    this.valueDOM.textContent = this.value;
  };
  decrease = function () {
    this.value--;
    this.valueDOM.textContent = this.value;
  };
  reset = function () {
    this.value = 0;
    this.valueDOM.textContent = this.value;
  };
}

const firstCounter = new Counter(getElement(".first-counter"), 0);
const secondCounter = new Counter(getElement(".second-counter"), 0);
