/* eslint-disable max-classes-per-file */
import { type tROIModel, createROIModel } from './Model';
import { YieldCalculator } from './YieldCalculator';

class Yields {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  yieldCalculator: YieldCalculator;

  constructor(model: tROIModel) {
    this.model = model;
    this.notify = null;
    this.yieldCalculator = new YieldCalculator();
  }
  calculateGrossYield() {
    const { model, notify, yieldCalculator } = this;
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

class Summary {
  getSummary(model: tROIModel) {
    const { investment } = model;
    const {
      propertyValue,
      depositAmount,
      legalFees,
      renovationCosts,
      stampDuty,
    } = investment;

    const totalInv =
      (propertyValue ?? 0) +
      (depositAmount ?? 0) +
      (legalFees ?? 0) +
      (renovationCosts ?? 0) +
      (stampDuty ?? 0);

    return {
      totalInvestment: totalInv,
      totalMonthlyExpenditure: 0,
      totalMonthlyProfit: 0,
    };
  }
}

class Controller {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  summary: Summary;
  yields: Yields;

  constructor() {
    this.model = createROIModel();
    this.notify = null;
    this.summary = new Summary();
    this.yields = new Yields(this.model);
  }

  // eslint-disable-next-line class-methods-use-this
  updatePropertyPrice(newPrice: number) {
    const { model, notify } = this;

    model.investment.propertyValue = newPrice;

    if (notify) {
      notify(model);
    }
  }

  updateDeposit(newDeposit: number) {
    const { model, notify } = this;
    model.investment.depositAmount = newDeposit;

    if (notify) {
      notify(model);
    }
  }

  updateStampDuty(newStampDuty: number) {
    const { model, notify } = this;
    model.investment.stampDuty = newStampDuty;

    if (notify) {
      notify(model);
    }
  }

  updateMortgage(newValue: number) {
    const { model, notify } = this;
    model.investment.mortgageAmount = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateRenovations(newRenovations: number) {
    const { model, notify } = this;
    model.investment.renovationCosts = newRenovations;

    if (notify) {
      notify(model);
    }
  }

  updateInterestRate(newValue: number) {
    const { model, notify } = this;
    model.investment.interestRate = newValue;
    if (notify) {
      notify(model);
    }
  }

  updateRentalIncome(newValue: number) {
    const { model, notify } = this;
    model.monthlyIncome.rent = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateRentalVoids(newValue: number) {
    const { model, notify } = this;
    model.monthlyExpenses.voids = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateMaintenance(newValue: number) {
    const { model, notify } = this;
    model.monthlyExpenses.maintenance = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateLegalFees(newValue: number) {
    const { model, notify } = this;
    model.investment.legalFees = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateBills(newValue: number) {
    const { model, notify } = this;
    model.monthlyExpenses.bills = newValue;

    if (notify) {
      notify(model);
    }
  }

  updateManagementFees(newValue: number) {
    const { model, notify } = this;
    model.monthlyExpenses.management = newValue;

    if (notify) {
      notify(model);
    }
  }
}

export { Controller };
