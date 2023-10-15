class Range {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  contains(num) {
    if(typeof num !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return num >= this.min && num <= this.max;
  }

  toString() {
    return `${this.min}$ - ${this.max}$`;
  }
}

class Percentage {
  constructor(value) {
    this.value = value;
  }
  
  multiply(operand) {
    return operand * this.value / 100;
  }

  toString() {
    return `${this.value}%`
  }
}

export class CompoundRatio {
  constructor(reinvest, cash) {
    this.reinvest = reinvest;
    this.cash = cash;
  }

  toString() {
    return `${this.reinvest}% / ${this.cash}%`;
  }
}

class Account {
  constructor(accountType, durationInMonths, bonusPercentage, expectedDailyReturns, 
    compoundRatio, investmentRange, coinDiscount, affiliateStatus) {
      this.accountType = accountType;
      this.investmentRange = investmentRange;
      this.durationInMonths = durationInMonths;
      this.bonusPercentage = bonusPercentage;
      this.compoundRatio = compoundRatio;
      this.expectedDailyReturns = expectedDailyReturns;
      this.coinDiscount = coinDiscount;
      this.affiliateStatus = affiliateStatus;
  }
}

class AccountsManager {
  #accounts;

  constructor(accountArray) {
    this.#accounts = accountArray;
  }

  getMatchingAccountOrUndefined(investment) {
    if(typeof investment !== "number") {
      throw new TypeError("investment must be a number");
    }

    return this.#accounts.find(account => account.investmentRange.contains(investment));
  }

  get totalRange() {
    let min = this.#accounts[0].investmentRange.min;
    let max = this.#accounts[0].investmentRange.max;

    for(const account of this.#accounts) {
      if(account.investmentRange.min < min) {
        min = account.investmentRange.min;
      }
      if(account.investmentRange.max > max) {
        max = account.investmentRange.max;
      }
    }

    return new Range(min, max);
  }
}

export const accountsManager = new AccountsManager([
  new Account(
    "Bronze", "6", new Percentage(20), new Percentage(1), 
    new CompoundRatio(80, 20), new Range(500, 2499), new Percentage(10), 1
    ),
  new Account(
    "Silver", "6", new Percentage(50), new Percentage(0.83), 
    new CompoundRatio(80, 20), new Range(2500, 9999), new Percentage(15), 1
    ),
  new Account(
    "Silver Plus", "6", new Percentage(100), new Percentage(0.66), 
    new CompoundRatio(80, 20), new Range(10000, 24999), new Percentage(20), 1
    ),
  new Account(
    "Gold", "12", new Percentage(150), new Percentage(0.58), 
    new CompoundRatio(80, 20), new Range(25000, 49999), new Percentage(25), 1
    ),
  new Account(
    "Gold Plus", "12", new Percentage(200), new Percentage(0.5), 
    new CompoundRatio(85, 15), new Range(50000, 99999), new Percentage(30), 1
    ),
  new Account(
    "Platinum", "12", new Percentage(300), new Percentage(0.42), 
    new CompoundRatio(90, 10), new Range(100000, 249999), new Percentage(35), 2
    ),
  new Account(
    "Purple Diamond", "12", new Percentage(400), new Percentage(0.33), 
    new CompoundRatio(95, 5), new Range(250000, 1000000), new Percentage(40), 2
    ),
]);