import { tROIModel } from '../sharedTypes';

class CashflowCalculator {
  calculateTotalMonthProfit(model: tROIModel) {
    return model.monthlyIncome.rent;
  }

  calculateTotalMonthCost(model: tROIModel) {
    const { bills, maintenance, management, mortgage, voids } =
      model.monthlyExpenses;

    const totalMonthCost =
      (bills ?? 0) +
      (maintenance ?? 0) +
      (management ?? 0) +
      (mortgage ?? 0) +
      (voids ?? 0);

    return totalMonthCost;
  }
}

export { CashflowCalculator };
