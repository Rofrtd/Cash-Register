const CASH_VALUE_MAP = {
  'ONE HUNDRED': 100.00 * 100,
  'TWENTY': 20.00 * 100,
  'TEN': 10.00 * 100,
  'FIVE': 5.00 * 100,
  'ONE': 1.00 * 100,
  'QUARTER': 0.25 * 100,
  'DIME': 0.10 * 100,
  'NICKEL': 0.05 * 100,
  'PENNY': 0.01 * 100,
};

class CashInDrawer {
  constructor(name, value, amount) {
    this.name = name;
    this.value = value;
    this.amount = amount;
  }

  change (changeDue){
    const amountOfBills = Math.floor(changeDue / this.value);
    const change = amountOfBills * this.value;
    return change > this.amount ? this.amount : change;
  }
}

class Drawer {
  constructor(cashesInDrawer) {
    this.cashesInDrawer = cashesInDrawer;
  }

  total() {
    let total = 0;
    this.cashInDrawer.forEach(c => total += c.amount);
    return total;
  }

  hasSufficientFunds(changeDue) {
    const changeLeftOver = this.cashesInDrawer.reduce((changeLeftOver, cashInDrawer) => {
      return changeLeftOver - cashInDrawer.change(changeLeftOver);
    }, changeDue)

    return this.total() >= changeDue && changeLeftOver === 0;
  }

  willClose(change) {
    return this.total() === change;
  }

  change(changeDue) {
    let change = [];

    this.cashesInDrawer.forEach(cashInDrawer => {
      const x = cashInDrawer.change(changeDue);
      if(x > 0){
        change.push([cashInDrawer.name, x]);
        changeDue -= x;
      }
    });
    return change;
  }
}

function checkCashRegister(price, cash, cid) {
  price *= 100;
  cash *= 100;
  const changeDue = cash - price;

  const cashesInDrawer = cid.map(([name, amount]) => {
    return new CashInDrawer(name, CASH_VALUE_MAP[name], amount * 100);
  });
  const drawer = new Drawer(cashesInDrawer.reverse());

  if(!drawer.hasSufficientFunds(changeDue)){
    return {status: "INSUFFICIENT_FUNDS", change: []};
  }

  if(drawer.willClose(changeDue)){
    return { status: "CLOSED", change: cid };
  }

  const change = drawer.change(changeDue).map(([name, value])=> {
    return [name, value / 100];
  });

  return {status: "OPEN", change: change};
}

const result = checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
console.log(result);
