import { tProperty } from './NewModel';
import { tBoundStore, useComputedState } from './Store';

class IncomeCtrlOld {
  calculateIncome(model: tBoundStore) {
    const { rentalIncome } = model;

    return rentalIncome;
  }

  update(model: tBoundStore) {
    const monthlyIncome = this.calculateIncome(model);
    useComputedState.getState().setMonthlyIncome(monthlyIncome);
  }
}

class IncomeCtrl {
  calculateIncome(model: tProperty) {
    const { rentalIncome } = model;

    return rentalIncome;
  }

  update(model: tProperty) {
    const monthlyIncome = this.calculateIncome(model);
    useComputedState.getState().setMonthlyIncome(monthlyIncome);
  }
}

export { IncomeCtrl, IncomeCtrlOld };
