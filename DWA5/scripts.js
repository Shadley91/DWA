// scripts.js

const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  // Scenario: Dividing numbers result in a decimal number
  if (!isNaN(dividend) && !isNaN(divider)) {
    const resultValue = dividend / divider;

    if (Number.isInteger(resultValue)) {
      result.innerText = resultValue;
    } else {
      result.innerText = resultValue.toFixed(2); // Display up to 2 decimal places
    }
  }
  // Scenario: Validation when values are missing
  else if (dividend.trim() === "" || divider.trim() === "") {
    result.innerText =
      "Division not performed. Both values are required in inputs. Try again";
  }
  // Scenario: An invalid division should log an error in the console
  else if (isNaN(dividend) || isNaN(divider)) {
    result.innerText =
      "Division not performed. Invalid number provided. Try again";
    console.error("Error: Invalid division input", new Error().stack);
  }
  // Scenario: Providing anything that is not a number should crash the program
  else {
    document.body.innerHTML =
      "Something critical went wrong. Please reload the page";
    console.error("Critical error: Invalid input", new Error().stack);
  }
});
