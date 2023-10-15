import { accountsManager } from "./accountsModule.js";
import { drawChartToCanvas, getNewChartData, updateChartWithData } from "./chartModule.js";

export function numberToMoneyString(number) {
  if (typeof(number) === "number") {
    return "$ " + number.toLocaleString("en-US", {maximumFractionDigits: 2});
  } else {
    return number;
  }
}

class MessageController {
  #message;
  #timeoutID;

  constructor(messageElement) {
    this.#message = messageElement;
  }

  showForTime(message, milliseconds) {
    this.#message.textContent = message;
    this.#message.style.visibility = "visible";
    this.hide(milliseconds);
  }

  hide(milliseconds = 0) {
    clearTimeout(this.#timeoutID);
    this.#timeoutID = setTimeout(() => this.#message.style.visibility = "hidden", milliseconds);
  }
}

class OutputManager {
  #investmentSection;
  #profitSection;
  
  #warningMessageController;

  #isAwaitingOutput;

  #doughnutChart;

  constructor(investmentSection, profitSection, chartContext) {
    this.#investmentSection = investmentSection;
    this.#profitSection = profitSection;

    this.#warningMessageController = new MessageController(investmentSection.querySelector("#warningMessage"));
    
    this.#isAwaitingOutput = true;

    this.#doughnutChart = drawChartToCanvas(chartContext);
  }

  outputFalseInvestment(investment) {
    const totalRange = accountsManager.totalRange;
  
    const message = `Please input a number between ${totalRange.min}$ and ${totalRange.max}$`;
    const fadeoutTime = 3000;
    
    this.#warningMessageController.showForTime(message, fadeoutTime);
  }

  outputCalculation(calculation) {
    this.#warningMessageController.hide();

    outputCalculationToSection(this.#investmentSection, calculation);
    outputCalculationToSection(this.#profitSection, calculation);
    if(this.#isAwaitingOutput) {
      const messageElement = this.#profitSection.querySelector("#profitWaitingMessage");

      messageElement.style.display = "none";
      this.#isAwaitingOutput = false;
    }
    updateDoughnutChart(calculation, this.#doughnutChart);

    this.#profitSection.scrollIntoView({ behavior: "smooth" });

    function outputCalculationToSection(section, calculation) {
      const listOfOutputElements = section.querySelectorAll("dd");

      for(const element of listOfOutputElements) {
        element.textContent = getOutputFromElementID(element.id, calculation);
      }

      section.querySelector("output").style.display = "block";
    }

    function getOutputFromElementID(id, calculation) {
      let outputString;
      switch(id) {
        case "totalProfit":
          outputString = numberToMoneyString(calculation.totalProfit);
          break;
        case "equityProfit":
          outputString = numberToMoneyString(calculation.totalEquityProfit);
          break;
        case "cashProfit":
          outputString = numberToMoneyString(calculation.totalCashProfit);
          break;
        case "duration":
          outputString = calculation.account.durationInMonths + " months";
          break;
        case "initialInvestment":
          outputString = numberToMoneyString(calculation.initialInvestment);
          break;
        case "bonus":
          outputString = numberToMoneyString(calculation.bonus);
          break;
        case "totalInvestment":
          outputString = numberToMoneyString(calculation.totalInvestment);
          break;
        case "accountType":
          outputString = calculation.account.accountType;
          break;
        default:
          console.log("You must have altered the id's on the output 'dd' elements in the " +
            "output sections of the html document. They do not longer match the switch statment.")
            break;
      }
      return outputString;
    }

    function updateDoughnutChart(calculation, chart) {
      //get the new data from calculation
      const newChartData = getNewChartData(calculation);
      //set the new data in chart
      updateChartWithData(newChartData, chart);
      //update chart
    }
  }
}

export const outputManager = new OutputManager(
  document.querySelector("#investmentSection"), document.querySelector("#profitSection"),
  document.querySelector("#profitCanvas").getContext("2d")
  );