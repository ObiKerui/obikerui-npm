import { tProperty } from './NewModel';
import { tBoundStore, useComputedState } from './Store';

const defaultTerm = 25;
const defaultRate = 3;

class ExpenditureCtrlOld {
  calculateMortgageMonthly(model: tBoundStore) {
    const { mortgageAmount } = useComputedState.getState();
    const { mortgageTerm, interestRate } = model;

    const checkedMortgageTerm = mortgageTerm !== 0 ? mortgageTerm : defaultTerm;
    const checkedInterestRate = interestRate !== 0 ? interestRate : defaultRate;

    // const principle = (mortgageAmount ?? 0) - (depositAmount ?? 0);
    const principle = mortgageAmount ?? 0;
    const monthlyInterest = (checkedInterestRate ?? 0) / 100 / 12.0;
    const totalMonthsBorrowed = checkedMortgageTerm * 12;

    const numerator =
      monthlyInterest * (1 + monthlyInterest) ** totalMonthsBorrowed;
    const denominator = (1 + monthlyInterest) ** totalMonthsBorrowed - 1;

    const monthsPayments = principle * (numerator / denominator);
    return monthsPayments;
  }

  calculateExpenditure(model: tBoundStore) {
    const mortgagePayments = useComputedState.getState().monthlyMortgagePayment;
    const { managementFees, maintenanceFees, bills, rentalVoids } = model;

    const monthlyCosts = managementFees + maintenanceFees + bills + rentalVoids;
    return mortgagePayments + monthlyCosts;
  }

  update(model: tBoundStore) {
    const mortgagePayments = this.calculateMortgageMonthly(model);
    useComputedState.getState().setMonthlyMortgagePayment(mortgagePayments);
    const monthlyExpenditure = this.calculateExpenditure(model);
    useComputedState.getState().setMonthlyExpenditure(monthlyExpenditure);
  }
}

class ExpenditureCtrl {
  calculateMortgageMonthly(model: tProperty) {
    const { mortgageAmount } = useComputedState.getState();
    const { mortgageTerm, interestRate } = model;

    const checkedMortgageTerm = mortgageTerm !== 0 ? mortgageTerm : defaultTerm;
    const checkedInterestRate = interestRate !== 0 ? interestRate : defaultRate;

    // const principle = (mortgageAmount ?? 0) - (depositAmount ?? 0);
    const principle = mortgageAmount ?? 0;
    const monthlyInterest = (checkedInterestRate ?? 0) / 100 / 12.0;
    const totalMonthsBorrowed = checkedMortgageTerm * 12;

    const numerator =
      monthlyInterest * (1 + monthlyInterest) ** totalMonthsBorrowed;
    const denominator = (1 + monthlyInterest) ** totalMonthsBorrowed - 1;

    const monthsPayments = principle * (numerator / denominator);
    return monthsPayments;
  }

  calculateExpenditure(model: tProperty) {
    const mortgagePayments = useComputedState.getState().monthlyMortgagePayment;
    const { managementFees, maintenanceFees, bills, rentalVoids } = model;

    const monthlyCosts = managementFees + maintenanceFees + bills + rentalVoids;
    return mortgagePayments + monthlyCosts;
  }

  update(model: tProperty) {
    const mortgagePayments = this.calculateMortgageMonthly(model);
    useComputedState.getState().setMonthlyMortgagePayment(mortgagePayments);
    const monthlyExpenditure = this.calculateExpenditure(model);
    useComputedState.getState().setMonthlyExpenditure(monthlyExpenditure);
  }
}

export { ExpenditureCtrl, ExpenditureCtrlOld };
