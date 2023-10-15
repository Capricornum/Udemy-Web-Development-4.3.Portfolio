import { forceNumberInput } from "./inputModule.js";
import { handleInvestmentFormSubmit } from "./inputModule.js";
import { detailsManager } from "./detailsModule.js";

const investmentInput = document.querySelector("#investmentInput");
const investmentForm = document.querySelector("form");
const detailsButtons = document.querySelectorAll(".detailsButton");

initializeCalculator();

function initializeCalculator() {
  investmentInput.focus();

  investmentForm.addEventListener("submit", handleInvestmentFormSubmit);
  investmentInput.addEventListener("input", forceNumberInput);

  for(const button of detailsButtons) {
    button.addEventListener("click", detailsManager.handleDetailsButtonClick.bind(detailsManager));
  }
}