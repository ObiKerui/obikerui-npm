/* eslint-disable no-plusplus */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { tProperty } from '../../Model/NewModel';
import { tROIModel } from '../sharedTypes';

class YieldCalculator {
  // eslint-disable-next-line class-methods-use-this
  calculate(yearRent: number, yearCost: number, propertyValue: number) {
    return ((yearRent - yearCost) / propertyValue) * 100.0;
  }

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

  calculateGrossYield(model: tROIModel) {
    const propVal = model.investment.propertyValue;

    // ((Monthly Rental Income × 12) ÷ Property Value) × 100 = Gross Rental Yield
    const yearsProfit = this.calculateTotalMonthProfit(model) * 12;
    const yearsCost = this.calculateTotalMonthCost(model) * 12;

    const grossYield = this.calculate(yearsProfit, yearsCost, propVal);
    return grossYield;
  }

  calculatorNetYield(model: tROIModel) {
    const propVal = model.investment.propertyValue;

    // (((Monthly Rental Income × 12) 󠀭– Costs) ÷ Property Value) × 100 = Net Rental Yield
    // const costs = model.maintenanceCosts + model.managementFees;
    const yearsProfit = this.calculateTotalMonthProfit(model) * 12;
    const yearsCost = this.calculateTotalMonthCost(model) * 12;
    const netYield = this.calculate(yearsProfit, yearsCost, propVal);
    return netYield;
  }
}

type tYieldRangeParams = {
  startBalance: number;
  endBalance: number;
  balanceInc: number;
  startInvest: number;
  endInvest: number;
  investInc: number;
};

type tYield = {
  balance: number;
  investment: number;
  yieldValue: number;
};

class NewYieldCalculator {
  // eslint-disable-next-line class-methods-use-this
  calculate(yearRent: number, yearCost: number, propertyValue: number) {
    return ((yearRent - yearCost) / propertyValue) * 100.0;
  }

  calculateTotalMonthProfit(property: tProperty) {
    return property.rentalIncome;
  }

  calculateTotalMonthCost(property: tProperty) {
    const {
      bills,
      maintenanceFees,
      managementFees,
      mortgagePayment,
      rentalVoids,
    } = property;

    const totalMonthCost =
      (bills ?? 0) +
      (maintenanceFees ?? 0) +
      (managementFees ?? 0) +
      (mortgagePayment ?? 0) +
      (rentalVoids ?? 0);

    return totalMonthCost;
  }

  calculateGrossYield(property: tProperty) {
    const propVal = property.propertyValue;

    // ((Monthly Rental Income × 12) ÷ Property Value) × 100 = Gross Rental Yield
    const yearsProfit = this.calculateTotalMonthProfit(property) * 12;
    const yearsCost = this.calculateTotalMonthCost(property) * 12;

    const grossYield = this.calculate(yearsProfit, yearsCost, propVal);
    return grossYield;
  }

  calculatorNetYield(property: tProperty) {
    const propVal = property.propertyValue;

    // (((Monthly Rental Income × 12) 󠀭– Costs) ÷ Property Value) × 100 = Net Rental Yield
    // const costs = model.maintenanceCosts + model.managementFees;
    const yearsProfit = this.calculateTotalMonthProfit(property) * 12;
    const yearsCost = this.calculateTotalMonthCost(property) * 12;
    const netYield = this.calculate(yearsProfit, yearsCost, propVal);
    return netYield;
  }

  calculateBalance(property: tProperty) {
    const yearsProfit = this.calculateTotalMonthProfit(property) * 12;
    const yearsCost = this.calculateTotalMonthCost(property) * 12;
    return yearsProfit - yearsCost;
  }

  calculateInvestment(property: tProperty) {
    return property.propertyValue;
  }
}

class YieldRangeCalculator {
  calculate(yearRent: number, yearCost: number, propertyValue: number) {
    return ((yearRent - yearCost) / propertyValue) * 100.0;
  }

  calculateRange(args: tYieldRangeParams) {
    const yields = [] as tYield[];

    for (let i = args.startBalance; i < args.endBalance; i += args.balanceInc) {
      for (let j = args.startInvest; j < args.endInvest; j += args.investInc) {
        const yieldValue = this.calculate(i * 12, 0, j);
        yields.push({
          balance: i,
          investment: j,
          yieldValue,
        });
      }
    }
    return yields;
  }
}

// class YieldRangeCalculator {
//   calculate(yearRent: number, yearCost: number, propertyValue: number) {
//     return ((yearRent - yearCost) / propertyValue) * 100.0;
//   }

//   calculateRange(args: tYieldRangeParams) {
//     const yields = [] as tYield[];

//     for (let i = args.startProfit; i < args.endProfit; i += args.profitInc) {
//       for (let j = args.startInvest; j < args.endInvest; j += args.investInc) {
//         const yieldValue = this.calculate(i, args.cost, j);
//         yields.push({
//           profit: i,
//           investment: j,
//           yieldValue,
//         });
//       }
//     }
//     return yields;
//   }
// }

export { YieldCalculator, YieldRangeCalculator, NewYieldCalculator };
export type { tYieldRangeParams, tYield };
