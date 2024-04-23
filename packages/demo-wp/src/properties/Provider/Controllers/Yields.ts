import { type tROIModel } from '../Model';
import { CashflowCalculator } from './CashflowCalculator';
import { YieldCalculator } from './YieldCalculator';

class Yields {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  cashflow: CashflowCalculator;
  yieldCalculator: YieldCalculator;

  constructor(model: tROIModel) {
    this.model = model;
    this.notify = null;
    this.cashflow = new CashflowCalculator();
    this.yieldCalculator = new YieldCalculator();
  }

  calculateGrossYield() {
    const { model, notify, yieldCalculator, cashflow } = this;
    model.cashflow.annualCost = cashflow.calculateTotalMonthCost(model) * 12;
    model.cashflow.annualProfit =
      cashflow.calculateTotalMonthProfit(model) * 12;

    const grossYield = yieldCalculator.calculateGrossYield(model);
    model.yields.gross = grossYield;
    if (notify) {
      notify(model);
    }
  }

  calculatorNetYield() {
    const { model, notify, yieldCalculator } = this;
    const netYield = yieldCalculator.calculatorNetYield(model);
    model.yields.net = netYield;
    if (notify) {
      notify(model);
    }
  }
}

export { Yields };
