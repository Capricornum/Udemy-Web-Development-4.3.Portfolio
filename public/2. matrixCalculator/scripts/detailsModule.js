import { accountsManager } from "./accountsModule.js";
import { numberToMoneyString } from "./outputModule.js";
import { calculationsManager } from "./calculationModule.js";

function getDate(monthsToAdd, daysToAdd) {
  let date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setMonth(date.getMonth() + monthsToAdd);
  const options = { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return date.toLocaleDateString('en-US', options);
}

class Detail {
  #value;
  #title;
  #text;

  constructor(value, title, text) {
    this.#value = value;
    this.#title = title;
    this.#text = text;
  }

  get value() {
    return this.#value;
  }
  get title() {
    return this.#title;
  }
  get text() {
    return this.#text;
  }
}

class DetailsManager {
  #detailsSection;
  #title;
  #text;
  #waitingMessage;
  #detailsOutput;
  #detailsCollection;
  #currentAccountList;

  constructor(detailsSection, detailsCollection) {
    this.#detailsSection = detailsSection;

    this.#title = detailsSection.querySelector("#detailsTitle");
    this.#text = detailsSection.querySelector("#details");
    this.#waitingMessage = detailsSection.querySelector("#detailsWaitingMessage");
    this.#detailsOutput = detailsSection.querySelector("output");

    this.#detailsCollection = detailsCollection;
  }

  displayTutorial() {
    this.#waitingMessage.textContent =
      "For further details, please click on one of the categories " +
      "in the investment or profit section, e.g. 'Account Type'.";
    this.makeInvisible();
  }

  handleDetailsButtonClick(event) {
    const value = event.target.value;

    const correspondingDetail = this.#detailsCollection.find(detail => detail.value === value);

    this.applyDetail(correspondingDetail);
    this.removeAccountList();

    if (value === "accountType") {
      this.displayAccountList();
    }

    this.makeVisible();
    this.scrollToView();
  }

  removeAccountList() {
    if (this.#currentAccountList !== undefined) {
      this.#currentAccountList.remove();
    }
  }

  displayAccountList() {
    const account = calculationsManager.currentCalculation.account;

    this.#currentAccountList = createDescriptionListForAccount(account);
    this.#detailsOutput.appendChild(this.#currentAccountList);
  }

  applyDetail(detail) {
    this.#title.textContent = detail.title;
    this.#text.innerHTML = detail.text;
  }

  makeVisible() {
    this.#waitingMessage.style.display = "none";
    this.#detailsOutput.style.display = "block";
  }

  makeInvisible() {
    this.#waitingMessage.style.display = "block";
    this.#detailsOutput.style.display = "none";
  }

  scrollToView() {
    this.#detailsSection.scrollIntoView({ behavior: "smooth" });
  }
}

function createDescriptionListForAccount(account) {
  const list = document.createElement("dl");
  for (const [key, val] of Object.entries(account)) {
    const dt = document.createElement("dt");
    let newKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1) + ':';
    dt.textContent = newKey;

    const dd = document.createElement("dd");
    dd.textContent = val;

    list.appendChild(dt);
    list.appendChild(dd);
  }

  return list;
}

const detailsCollection = [
  new Detail(
    "initialInvestment", "Initial Investment",
    `The ‚initial investment‘ is the deposit you make into the matrix program. <br><br>` +
    `The minimum initial investment is ${numberToMoneyString(accountsManager.totalRange.min)}. <br>` +
    `The maximum initial investment to any one account is ${numberToMoneyString(accountsManager.totalRange.max)}. <br><br>` +
    `The initial investment determines the type of your account. (See account for more details.) <br>` +
    `For the duration of your account type your investment will be inaccessible. <br>` +
    `The initial investment determines the basis of your account. Once the account matures it cannot be continued with less than your initial investment. <br><br>` +
    `Investments can be made in USTD or BTC. <br><br>` +
    `For more information refer to your sponsor.`
  ),
  new Detail(
    "bonus", "Bonus",
    "The ‚bonus‘ is a pecuniary resource added on top of your initial investment for incentive purposes. <br>" +
    "The amount depends on your account type (see account for more detail). <br>" +
    "Trading profits will be generated from the sum of your investment and the bonus. <br><br>" +

    "The investor will be awarded the bonus, if the account is continued for a minimum of 12 months, " +
    "either by design (see accounts gold - purple diamond) or by choice (see accounts bronze - silver plus). <br>" +
    "Additional external investments (excluding reinvests from cash balance or affiliate account) will generate additional bonus. " +
    "The awarded bonus after 12 months will then be calculated as a percentage of all received bonuses. <br>" +
    "For accounts with a duration of 6 months that are continued with a higher amount than initially started, a new bonus will be calculated. " +
    "Only the bonus from the first account cycle will be awarded after another 6 months. " +
    "To receive the bonus of the continued account it will have to be kept for another 12 months. <br><br>" +

    "For more information refer to your sponsor."
  ),
  new Detail(
    "totalInvestment", "Total Investment",
    `The ‚total investment‘ is the sum of your initial investment and the bonus. <br>` +
    `Trading profits will be generated from this sum. <br><br>` +

    `For more information refer to your sponsor.`
  ),
  new Detail(
    "accountType", "Account Type", ""
    // `The matrix program allows for different account types, depending on your initial investment. ` +
    // `The account type determines different stats such as the duration of your account, the expected daily profits, or the compound ratio. <br><br>` +

    // `For more information refer to your sponsor. <br><br>` +

    // `Your account: <br><br>`
  ),
  new Detail(
    "duration", "Account Duration",
    `The ‚duration‘ is the time in months that your investment is transferred to the matrix program. ` +
    `It will be inaccessible for this time and generate trading profits according to the account type (see accounts for more detail). <br><br>` +

    `Once the account duration has passed, an account is considered ‚matured‘ and will allow for handling of profits. <br><br>` +

    `For expedient comparison of calculations the duration of one month is defined as 30 days in the context of this calculator. <br>` +
    `The actual duration is calculated in months not days and will pass on the same day of the respective future month plus one day.<br>` +
    `Example: A six month account created today, will mature on: ${getDate(6, 1)}. <br><br>` +

    `For more information refer to your sponsor.`
  ),
  new Detail(
    "cashProfit", "Cash Profit",
    `The ‚cash profit’ is the portion of trading profits that is transferred to your cash balance. ` +
    `The amount is determined by the compound ratio of your account type. <br><br> ` +

    `Cash profit can be withdrawn once it reaches an amount of 100$. <br><br>` +

    `For more information refer to your sponsor.`
  ),
  new Detail(
    "equityProfit", "Equity Profit",
    `The ‚equity profit‘ is the portion of trading profits, that is transferred into your equity balance. ` +
    `The amount is determined by the compound ratio of your account type. <br><br>` +

    `The equity profit can be accessed once your account matures. <br><br>` +

    `For more information refer to your sponsor.`
  ),
  new Detail(
    "totalProfit", "Total Profit",
    `The ‚total profit‘ is the sum of your cash and equity profit. <br> ` +
    `It excludes your initial investment and the bonus. <br><br>` +

    `For more information refer to your sponsor.`
  ),
]

export const detailsManager = new DetailsManager(
  document.querySelector("#detailsSection"), detailsCollection
);