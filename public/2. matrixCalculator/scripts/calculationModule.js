import { accountsManager, CompoundRatio } from "./accountsModule.js";

const DAYS_PER_MONTH = 30;

function lastItem(array) {
  return array[array.length - 1];
}

function twoDigitDecimal(num) {
  return Math.round(num * 100) / 100;
}

class InvestmentInfo {
  #initialInvestment;
  #bonus;

  constructor(investment, bonus) {
    this.#initialInvestment = investment;
    this.#bonus = bonus;
  }

  get initialInvestment() { return this.#initialInvestment; }
  get bonus() { return this.#bonus; }
  get totalInvestment() { return this.#initialInvestment + this.#bonus; }
}

class ProfitInfo {
  #dailyCashAdditions;
  #dailyEquityAdditions;

  #dailyCashBalances;
  #dailyEquityBalances;

  constructor(dailyCashAdditions, dailyEquityAdditions, dailyCashBalances, dailyEquityBalances) {
    this.#dailyCashAdditions = dailyCashAdditions;
    this.#dailyEquityAdditions = dailyEquityAdditions;
    this.#dailyCashBalances = dailyCashBalances;
    this.#dailyEquityBalances = dailyEquityBalances;
  }

  get finalCashProfit() { return lastItem(this.#dailyCashBalances); }
  get finalEquityProfit() { return lastItem(this.#dailyEquityBalances); }
  get finalTotalProfit() {return this.finalCashProfit + this.finalEquityProfit; }

  //getters for balance or addition by day or the whole array once neccessary.
}

class Calculation {
  #account
  #investmentInfo
  #profitInfo

  constructor(account, investmentInfo, profitInfo)
  {
    this.#account = account;
    this.#investmentInfo = investmentInfo;
    this.#profitInfo = profitInfo;
  }

  get account() { return this.#account; }

  get initialInvestment() { return this.#investmentInfo.initialInvestment; }
  get bonus() { return this.#investmentInfo.bonus; }
  get totalInvestment() { return this.#investmentInfo.totalInvestment; }

  get totalProfit() { return this.#profitInfo.finalTotalProfit; }
  get totalCashProfit() { return this.#profitInfo.finalCashProfit; }
  get totalEquityProfit() { return this.#profitInfo.finalEquityProfit; }
}

class CalculationsManager {
  #calculations;

  constructor() {
    this.#calculations = [];
  }

  get currentCalculation() {
    return lastItem(this.#calculations);
  }

  calculate(investment, reinvestOption) {
    const account = accountsManager.getMatchingAccountOrUndefined(investment);
  
    const investmentInfo = this.calculateInvestmentInfo(investment, account);
    const profitInfo = this.calculateProfitInfo(investmentInfo, reinvestOption, account);
  
    const calculation = new Calculation(account, investmentInfo, profitInfo);
  
    this.#calculations.push(calculation);
  
    return calculation;
  }

  calculateInvestmentInfo(investment, account) {
    const bonus = account.bonusPercentage.multiply(investment);
    return new InvestmentInfo(investment, bonus);
  }

  calculateProfitInfo(investmentInfo, reinvestOption, account) {
    const dailyCompoundRatio = this.calculateDailyCompoundRatio(account, reinvestOption);

    let currentInvestment = investmentInfo.totalInvestment;
    let currentCashBalance = 0;
    let currentEquityBalance = 0;

    const accountDurationInDays = DAYS_PER_MONTH * account.durationInMonths;

    const dailyCashAdditions = [accountDurationInDays];
    const dailyEquityAdditions = [accountDurationInDays];
    const dailyCashBalances = [accountDurationInDays];
    const dailyEquityBalances = [accountDurationInDays];

    for(let i = 0; i < accountDurationInDays; i++) {
      const dailyProfit = twoDigitDecimal(account.expectedDailyReturns.multiply(currentInvestment));

      const dailyCashAddition = twoDigitDecimal(dailyProfit * dailyCompoundRatio.cash / 100);
      const dailyEquityAddition = twoDigitDecimal(dailyProfit * dailyCompoundRatio.reinvest / 100);

      currentInvestment += dailyEquityAddition;
      currentCashBalance += dailyCashAddition;
      currentEquityBalance += dailyEquityAddition;

      dailyCashAdditions[i] = dailyCashAddition;
      dailyEquityAdditions[i] = dailyEquityAddition;
      dailyCashBalances[i] = currentCashBalance;
      dailyEquityBalances[i] = currentEquityBalance;
    }

    return new ProfitInfo(dailyCashAdditions, dailyEquityAdditions, dailyCashBalances, dailyEquityBalances);
  }

  calculateDailyCompoundRatio(account, reinvestOption) {
    const actualReinvestPercentage = reinvestOption === true ? 100 : account.compoundRatio.reinvest;
    const actualCashPercentage = reinvestOption === true ? 0 : account.compoundRatio.cash;
  
    return new CompoundRatio(actualReinvestPercentage, actualCashPercentage);
  }
}

export const calculationsManager = new CalculationsManager();
