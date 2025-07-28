// selecting html element for further use
const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthcontainer]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copymsg]");
const copyBtn = document.querySelector("#copyButton");
const uppercaseCheckbox = document.querySelector("#uppercase");
const lowercaseCheckbox = document.querySelector("#lowercase");
const numbersCheckbox = document.querySelector("#numbers");
const symbolsCheckbox = document.querySelector("#symbols");
const strengthIndicator = document.querySelector("[data-strengthindicator]");
const generateBtn = document.querySelector("#generateButton");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

// string for generating random symbols
const symbols = '!@#$%^&*(){}[],./<>?;|-=:"`~';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

// set password length and display it
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

// set the color of the indicator 
function setIndicator(color) {
  strengthIndicator.style.backgroundColor = color;
  strengthIndicator.style.shadow = "0 0 15px white";
}

// return a random no between min and max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calculateStrength() {
  // initially consider all the checkbox as false 
  let hasUpper = false;
  let hasLower = false;
  let hasInteger = false;
  let hasSymbol = false;

  // now check for the checked checkbox 
  if (uppercaseCheckbox.checked) hasUpper = true;
  if (lowercaseCheckbox.checked) hasLower = true;
  if (symbolsCheckbox.checked) hasSymbol = true;
  if (numbersCheckbox.checked) hasInteger = true;

  // apply condition to set the strength of the password 
  if (
    hasUpper &&
    hasLower &&
    (hasSymbol || hasInteger) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasInteger || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}


async function copyContent() {
  // the await keyword make it wait until the password is copied to clipboard and then copied is shown 
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  //   to make the copy msg visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// count no of checkboxes ticked 
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //  special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// call a function to count the no of checked boxes after encountering any change in checkbox
allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// here e is event object and contains details about what happened to the target element, 
// here changes in slider value is stored in passwordlength 
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  // none of the checkboxes are checked
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //  finding new password

  // remove old password
  password = "";

  // array to store functions that generate different letters,numbers and symbols 
  let funcArr = [];

  if (uppercaseCheckbox.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheckbox.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheckbox.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheckbox.checked) {
    funcArr.push(generateSymbols);
  }

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  } 
  // shuffle the password generated
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  // calculating Strength
  calculateStrength();
});
