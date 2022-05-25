"use strict";

document.body.addEventListener(
  "load",
  alert("hi you can use USER: hz and PIN: 1111 to login")
);

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Hicham Zakroum",
  movements: [200, 450.50471, -400, 3000, -650, -130, 70.2, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-10-10T23:36:17.929Z",
    "2021-10-14T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-us",
};

const account2 = {
  owner: "Othman Osffar",
  movements: [5000.8546, 3400, -150, -790, -3210, -1000, 8500.3625, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2021-10-08T18:49:59.371Z",
    "2021-10-13T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "pt-pt",
};

const account3 = {
  owner: "Zakaria El Harchi",
  movements: [200, -200, 340.2, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2021-10-15T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-GB",
};

const account4 = {
  owner: "Mona Chokri",
  movements: [430, 1000.5, 700.054, 50, 90.02],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2021-10-12T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-us",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
////

///////// functions
const calcDateMove = function (date, locale) {
  const calcDatePassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDatePassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  // sorting movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  ////////////////////
  movs.forEach(function (e, i) {
    const type = e > 0 ? `deposit` : `withdrawal`;
    const date = new Date(acc.movementsDates[i]);
    const formattedDate = calcDateMove(date, currentAccount.locale);

    const formattedMove = new Intl.NumberFormat(acc.locale, {
      style: "currency",
      currency: acc.currency,
    }).format(e);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${formattedDate}</div>
    <div class="movements__value">${formattedMove}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

////// function create username accounts
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedMove = new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(acc.balance);
  labelBalance.textContent = formattedMove;
};

// formating movements summary
const formattedMove = function (acc, move) {
  return new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(move);
};
// calc summary
const culcSummary = function (acc) {
  const sumIn = acc.movements
    .filter((cur) => cur > 0)
    .reduce((accu, cur) => accu + cur);
  labelSumIn.textContent = formattedMove(acc, sumIn);
  const sumOut = acc.movements
    .filter((cur) => cur < 0)
    .reduce((accu, cur) => {
      return accu + cur;
    }, 0);
  labelSumOut.textContent = formattedMove(acc, -Math.abs(sumOut));
  const interest = acc.movements
    .filter((cur) => cur > 0)
    .map((cur) => (cur * currentAccount.interestRate) / 100)
    .filter((cur) => cur > 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = formattedMove(acc, interest);
};
// update ui
const updateUI = function () {
  //display Movements
  displayMovements(currentAccount);
  // display balance
  currentBalance(currentAccount);
  //display summary
  culcSummary(currentAccount);
};

//clear input
const clearInput = function (input1, input2) {
  input1.value = input2.value = "";
  input1.blur();
  input2.blur();
};

//clear label welcome
const clearWelcome = function (color, opacity, text) {
  labelWelcome.textContent = `${text}`;
  labelWelcome.style.color = `${color}`;
  containerApp.style.opacity = `${opacity}`;
};

// timer
function startLogOutTimer() {
  labelTimer.textContent = "";
  let time = 60 * 5;
  const timer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      clearWelcome("black", "0", "Log in to get started");
    }
    time--;
  }, 1000);
}

//// events handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (cur) => cur.username === inputLoginUsername.value
  );
  if (
    currentAccount === undefined ||
    currentAccount.pin !== +inputLoginPin.value
  ) {
    // Display Error Message
    clearWelcome("red", "0", "Sorry you don't have an account ❌");
    clearInput(inputLoginPin, inputLoginUsername);
  } else {
    startLogOutTimer();
    // Display UI and Message
    clearWelcome("black", "100", "");
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    // clear input
    clearInput(inputLoginPin, inputLoginUsername);
    clearInput(inputClosePin, inputCloseUsername);
    // update UI
    updateUI();
    // format time
    const date = new Date();
    //API formating time
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI();
      // clear
      clearWelcome("black", "100", "your request is completed ✅");
    }, 3500);
    clearInput(inputLoanAmount, inputLoanAmount);
  } else {
    // clear
    clearWelcome("red", "100", "sorry your request fail ❌");
    // clear input
    clearInput(inputLoanAmount, inputLoanAmount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const trasferTo = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    trasferTo !== undefined &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    trasferTo.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    trasferTo.movements.push(amount);
    trasferTo.movementsDates.push(new Date().toISOString());
    ///update UI
    clearInput(inputTransferAmount, inputTransferTo);
    updateUI();
    clearWelcome("black", "100", "Transfer money is completed ✅");
  } else {
    clearInput(inputTransferAmount, inputTransferTo);
    clearWelcome("red", "100", "Sorry your information is incorrect ❌");
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let confirmUser = inputCloseUsername.value;
  let confirmPin = inputClosePin.value;
  if (
    currentAccount.username === confirmUser &&
    currentAccount.pin === +confirmPin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // delete user
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = "0";
    //update UI
    clearWelcome("black", "0", "Log in to get started");
  } else {
    clearWelcome("red", "100", "Sorry your information is incorrect ❌");
    clearInput(inputClosePin, inputCloseUsername);
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
