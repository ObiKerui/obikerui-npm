import { type tROIModel } from '../sharedTypes';

class Mortgage {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  constructor(model: tROIModel) {
    this.model = model;
    this.notify = null;
  }

  calculateMonthlyPayments() {
    const { notify, model } = this;
    const { investment, monthlyExpenses } = model;
    const { mortgageAmount, interestRate, mortgageTerm } = investment;
    const borrowPeriod = mortgageTerm;

    if (mortgageAmount === 0) {
      monthlyExpenses.mortgage = 0;
      if (notify) {
        notify(model);
      }
      return;
    }

    // const principle = (mortgageAmount ?? 0) - (depositAmount ?? 0);
    const principle = mortgageAmount ?? 0;
    const monthlyInterest = (interestRate ?? 0) / 100 / 12.0;
    const totalMonthsBorrowed = borrowPeriod * 12;

    const numerator =
      monthlyInterest * (1 + monthlyInterest) ** totalMonthsBorrowed;
    const denominator = (1 + monthlyInterest) ** totalMonthsBorrowed - 1;

    const monthsPayments = principle * (numerator / denominator);
    monthlyExpenses.mortgage = monthsPayments;

    if (notify) {
      notify(model);
    }
  }
}

export { Mortgage };
