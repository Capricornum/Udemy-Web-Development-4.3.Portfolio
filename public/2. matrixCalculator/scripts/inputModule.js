import { accountsManager } from "./accountsModule.js";
import { calculationsManager } from "./calculationModule.js";
import { outputManager } from "./outputModule.js";
import { detailsManager } from "./detailsModule.js";

export function forceNumberInput(event) { 
  if(isNaN(event.target.valueAsNumber)) 
    { event.target.value = ""; } 
}

export function handleInvestmentFormSubmit(event) {
  event.preventDefault();

  const investmentInput = event.target.elements.investment;
  const investment = investmentInput.valueAsNumber;
  const totalRange = accountsManager.totalRange;

  if(!totalRange.contains(investment)) {
    handleFalseSubmit();
  }
  else {
    handleCorrectSubmit();
  }

  function handleFalseSubmit() {
    //No data actions needed. Going to view actions.
    investmentInput.focus();
    outputManager.outputFalseInvestment(investment);
  }
  
  function handleCorrectSubmit() {
    const reinvestOption = getReinvestOption();
    const calculation = calculationsManager.calculate(investment, reinvestOption);
    outputManager.outputCalculation(calculation);
    detailsManager.displayTutorial();
    
    function getReinvestOption() {
      const checkedRadioInputValue = event.target.elements.reinvestOption.value

      if(checkedRadioInputValue === "reinvestOptionTrue") {
        return true;
      } else {
        return false;
      }    
    }
  }
}