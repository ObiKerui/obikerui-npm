import { tROIModel } from './Model';

class YieldCalculator {
  // eslint-disable-next-line class-methods-use-this
  calculate(yearRent: number, yearCost: number, propertyValue: number) {
    console.log('calculate the yields: ', yearRent, yearCost, propertyValue);
    return ((yearRent - yearCost) / propertyValue) * 100.0;
  }

  calculateGrossYield(model: tROIModel) {
    const propVal = model.investment.propertyValue;
    if (!propVal) {
      return null;
    }

    // ((Monthly Rental Income × 12) ÷ Property Value) × 100 = Gross Rental Yield
    const grossYield = this.calculate(
      model.monthlyIncome.rent * 12,
      0,
      propVal
    );
    return grossYield;
  }

  calculatorNetYield(model: tROIModel) {
    const propVal = model.investment.propertyValue;
    if (!propVal) {
      return null;
    }

    // (((Monthly Rental Income × 12) 󠀭– Costs) ÷ Property Value) × 100 = Net Rental Yield
    // const costs = model.maintenanceCosts + model.managementFees;
    const netYield = this.calculate(model.monthlyIncome.rent * 12, 0, propVal);
    return netYield;
  }
}

export { YieldCalculator };
