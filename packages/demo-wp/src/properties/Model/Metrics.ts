import { tBoundStore, useComputedState } from './Store';

class MetricsCtrl {
  calculate(yearRent: number, yearCost: number, propertyValue: number) {
    return ((yearRent - yearCost) / propertyValue) * 100.0;
  }

  calculateGrossYield(model: tBoundStore) {
    const {
      rentalIncome,
      maintenanceFees,
      managementFees,
      bills,
      rentalVoids,
      propertyValue,
    } = model;

    // total month income
    const totalMonthIncome = rentalIncome;

    // total month expenditure
    const mortgage = useComputedState.getState().monthlyMortgagePayment;
    const monthlyFees = maintenanceFees + managementFees + bills + rentalVoids;
    const totalMonthExpend = mortgage + monthlyFees;

    const grossYield = this.calculate(
      totalMonthIncome * 12,
      totalMonthExpend * 12,
      propertyValue
    );

    return grossYield;
  }

  calculateROI(model: tBoundStore) {
    console.log('calculate roi with model: ', model);
    // const { isAdditionalProperty, deposit, propertyValue } = model;

    // useComputedState.getState().setStampDuty(stampDuty);
    // useComputedState.getState().setMortgageAmount(mortgageAmount);
    return 0;
  }

  update(model: tBoundStore) {
    const yieldValue = this.calculateGrossYield(model);
    useComputedState.getState().setYield(yieldValue);

    const roiValue = this.calculateROI(model);
    useComputedState.getState().setROI(roiValue);
  }
}

export { MetricsCtrl };
