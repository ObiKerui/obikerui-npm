/* eslint-disable class-methods-use-this */
type tCalculatorInputs = {
  income: number;
  operatingProfit: number;
  costs: number;
  propertyValue: number;
  investment: number;
};

type tCalculatorOutputs = {
  cashflow: number;
  grossYield: number;
  netYield: number;
  capRate: number;
  roi: number;
  paybackPeriod: number;
};

class Calculator {
  calculate(inputs: tCalculatorInputs) {
    const cashflow = this.cashflow(inputs.income, inputs.costs);
    const grossYield = this.grossYield(inputs.income, inputs.propertyValue);
    const netYield = this.netYield(
      inputs.income,
      inputs.costs,
      inputs.propertyValue
    );
    const capRate = this.capRate(inputs.operatingProfit, inputs.propertyValue);
    const roi = this.roi(inputs.income, inputs.costs, inputs.investment);
    const paybackPeriod = this.paybackPeriod(
      inputs.income,
      inputs.costs,
      inputs.investment
    );

    return {
      cashflow,
      grossYield,
      netYield,
      capRate,
      roi,
      paybackPeriod,
    } as tCalculatorOutputs;
  }

  cashflow(income: number, costs: number) {
    return income - costs;
  }

  grossYield(income: number, propertyValue: number) {
    return income / (propertyValue ?? 1);
  }

  netYield(income: number, cost: number, propertyValue: number) {
    return this.cashflow(income, cost) / (propertyValue ?? 1);
  }

  capRate(operatingProfit: number, propertyValue: number) {
    return operatingProfit / (propertyValue ?? 1);
  }

  roi(income: number, cost: number, investment: number) {
    return this.cashflow(income, cost) / (investment ?? 1);
  }

  paybackPeriod(income: number, cost: number, investment: number) {
    const roiValue = this.roi(income, cost, investment);
    return 1 / (roiValue ?? 1);
  }
}

export { Calculator };
export type { tCalculatorInputs, tCalculatorOutputs };
