import { tBoundStore, useComputedState } from './Store';

class IncomeCtrl {
  calculateIncome(model: tBoundStore) {
    const { rentalIncome } = model;

    return rentalIncome;
  }

  update(model: tBoundStore) {
    const monthlyIncome = this.calculateIncome(model);
    useComputedState.getState().setMonthlyIncome(monthlyIncome);
  }
}

export { IncomeCtrl };
