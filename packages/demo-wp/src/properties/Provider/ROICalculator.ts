/* eslint-disable max-classes-per-file */
import { type tModel, tROIModel } from './Model';

class ExpensesCalculator {
  model: tModel;
  roiModel: tROIModel;
  notify: ((model: tModel) => void) | null;

  constructor(model: tModel, roiModel: tROIModel) {
    this.model = model;
    this.roiModel = roiModel;
    this.notify = null;
  }

  calculateExpenses() {
    const { model } = this;
  }
}

// Purchase details:

// Property value: £180,000
// Stamp duty: £6,500
// Mortgage and solicitor costs: £1,800
// Initial repair costs: £2,200
// Mortgage: £132,000
// Total investment: £58,500
// Income and expense details:

// Rent (annual): £9,900 (monthly rent: £825)
// Mortgage payments (annual): £3,300
// Managing agent, maintenance, voids (estimated, annual): £1,485
// Total annual costs: £4,785

// ROI: ( (9900 - 4785) / 58500) * 100 = (5115 / 58500) * 100 = 0.0874 * 100 = 8.74%

class ROICalculator {
  model: tModel;
  notify: ((model: tModel) => void) | null;
  constructor(model: tModel) {
    this.model = model;
    this.notify = null;
  }

  calculateGrossROI() {
    const { model, notify } = this;

    // ((gross profit) ÷ cost of investment) × 100 = Gross ROI
    // ((Monthly Rental Income × 12) ÷ Property Value) × 100 = Gross Rental Yield
    const grossProfit = model.cashflow.annualProfit;
    const costOfInvestment = 0; // cost of investment

    if (notify) {
      notify(model);
    }
  }

  calculatorNetROI() {
    // ((net profit) ÷ cost of investment) × 100 = Net ROI
    // (((Monthly Rental Income × 12) 󠀭– Costs) ÷ Property Value) × 100 = Net Rental Yield
    const { model, notify } = this;

    if (notify) {
      notify(model);
    }
  }
}

export { ExpensesCalculator, ROICalculator };
