/* eslint-disable max-classes-per-file */
import { calculateSDLT } from '../../Utils';
// import { type tROIModel, createROIModel } from '../Model';
import { tROIModel } from '../sharedTypes';
import { Mortgage } from './Mortgage';
import { Summary } from './Summary';
import { YieldRangeCalculator } from './YieldCalculator';
import { Yields } from './Yields';
import { createROIModel } from '../../Model/Model';

class Controller {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  summary: Summary;
  yields: Yields;
  mortgage: Mortgage;
  yieldCalculator: YieldRangeCalculator;

  constructor() {
    this.model = createROIModel();
    this.notify = null;
    this.summary = new Summary();
    this.yields = new Yields(this.model);
    this.mortgage = new Mortgage(this.model);
    this.yieldCalculator = new YieldRangeCalculator();
  }

  calculateInvestment() {
    const { model } = this;
    const isAdditional = model.investment.isAdditionalProperty;
    const deposit = model.investment.depositAmount;
    const propVal = model.investment.propertyValue;
    model.investment.stampDuty = calculateSDLT(propVal, isAdditional);
    model.investment.mortgageAmount = propVal - deposit;
  }

  calculateExpenditure() {}

  // eslint-disable-next-line class-methods-use-this
  updatePropertyPrice(newPrice: number) {
    const { model, notify } = this;
    model.investment.propertyValue = newPrice;

    if (notify) {
      notify(model);
    }
  }

  updateDepositAmount(newAmount: number) {
    const { model, notify } = this;
    model.investment.depositAmount = newAmount;

    if (notify) {
      notify(model);
    }
  }

  updateAdditionalProperty(isAdditional: boolean) {
    const { model, notify } = this;
    model.investment.isAdditionalProperty = isAdditional;
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

  updateMortgage(_newValue: number) {
    const { model, notify } = this;
    const { investment } = model;
    const { depositAmount, propertyValue } = investment;
    const mortgageAmount = propertyValue - (depositAmount ?? 0);
    model.investment.mortgageAmount = mortgageAmount;

    if (notify) {
      notify(model);
    }
  }

  updateMortgageTerm(newValue: number) {
    const { model, notify } = this;
    model.investment.mortgageTerm = newValue;
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
