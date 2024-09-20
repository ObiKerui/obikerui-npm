/* eslint-disable class-methods-use-this */
import { type tROIModel } from '../sharedTypes';

class Summary {
  getSummary(model: tROIModel) {
    const { investment, monthlyIncome, monthlyExpenses } = model;
    const {
      mortgageAmount,
      depositAmount,
      legalFees,
      renovationCosts,
      stampDuty,
    } = investment;

    const totalInv =
      (mortgageAmount ?? 0) +
      (depositAmount ?? 0) +
      (legalFees ?? 0) +
      (renovationCosts ?? 0) +
      (stampDuty ?? 0);

    const { rent } = monthlyIncome;
    const totalMonthProfit = rent ?? 0;

    const { bills, maintenance, management, mortgage, voids } = monthlyExpenses;
    const totalMonthExpend =
      (bills ?? 0) +
      (maintenance ?? 0) +
      (management ?? 0) +
      (mortgage ?? 0) +
      (voids ?? 0);

    return {
      totalInvestment: totalInv,
      totalMonthlyExpenditure: totalMonthExpend,
      totalMonthlyProfit: totalMonthProfit,
      balance: totalMonthProfit - totalMonthExpend,
    };
  }
}

export { Summary };
