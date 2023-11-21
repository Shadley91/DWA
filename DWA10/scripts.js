const MAX_NUMBER = 15;
const MIN_NUMBER = -5;
const STEP_AMOUNT = 1; // Changed STEP_AMOUNT to 1 for increment/decrement by 1

const number = document.querySelector('[data-key="number"]');
const subtract = document.querySelector('[data-key="subtract"]');
const add = document.querySelector('[data-key="add"]');

const subtractHandler = () => {
  let newValue = parseInt(number.value) - STEP_AMOUNT;

  // Adjusting to meet minimum and maximum limits
  if (newValue < MIN_NUMBER) {
    newValue = MIN_NUMBER;
  }

  number.value = newValue;

  // Enable the "Add" button if it was disabled
  add.disabled = false;

  if (newValue <= MIN_NUMBER) {
    subtract.disabled = true;
  }
};

const addHandler = () => {
  let newValue = parseInt(number.value) + STEP_AMOUNT;

  // Adjusting to meet minimum and maximum limits
  if (newValue > MAX_NUMBER) {
    newValue = MAX_NUMBER;
  }

  number.value = newValue;

  // Enable the "Subtract" button if it was disabled
  subtract.disabled = false;

  if (newValue >= MAX_NUMBER) {
    add.disabled = true;
  }
};

subtract.addEventListener("click", subtractHandler);
add.addEventListener("click", addHandler);

// Reset button functionality
const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", () => {
  number.value = 0;
  subtract.disabled = false;
  add.disabled = false;
  alert("Counter has been reset");
});
