// /* eslint-disable max-classes-per-file */
// enum eInputType {
//   PERCENTAGE,
//   CURRENCY,
// }

// type tInvestmentBlock = {
//   propertyValue: number;
//   depositAmount: number;
//   isAdditionalProperty: boolean;
//   stampDuty: number;
//   renovationCosts: number;
//   mortgageAmount: number;
//   interestRate: number;
//   mortgageTerm: number;
//   interestOnlyMortgage: boolean;
//   legalFees: number;
// };

// type tYields = {
//   gross: number;
//   net: number;
// };

// const ROIModel = {
//   investment: {
//     propertyValue: 0,
//     depositAmount: 0,
//     isAdditionalProperty: false,
//     stampDuty: 0,
//     renovationCosts: 0,
//     mortgageAmount: 0,
//     interestRate: 4,
//     mortgageTerm: 25,
//     interestOnlyMortgage: true,
//     legalFees: 0,
//   } as tInvestmentBlock,
//   monthlyExpenses: {
//     mortgage: 0,
//     management: 0,
//     maintenance: 0,
//     bills: 0,
//     voids: 0,
//   },
//   monthlyIncome: {
//     rent: 0,
//   },
//   cashflow: {
//     annualProfit: 0,
//     annualCost: 0,
//   },
//   yields: {
//     gross: 0,
//     net: 0,
//   } as tYields,
//   roi: {
//     gross: 0,
//     net: 0,
//   },
// };

// type tROIModel = typeof ROIModel;

// function createROIModel() {
//   const propertyModel = {
//     investment: {
//       propertyValue: 0,
//       depositAmount: 0,
//       isAdditionalProperty: false,
//       stampDuty: 0,
//       renovationCosts: 0,
//       mortgageAmount: 0,
//       interestRate: 4,
//       mortgageTerm: 25,
//       interestOnlyMortgage: true,
//       legalFees: 0,
//     } as tInvestmentBlock,
//     monthlyExpenses: {
//       mortgage: 0,
//       management: 0,
//       maintenance: 0,
//       bills: 0,
//       voids: 0,
//     },
//     monthlyIncome: {
//       rent: 0,
//     },
//     cashflow: {
//       annualProfit: 0,
//       annualCost: 0,
//     },
//     yields: {
//       gross: 0,
//       net: 0,
//     },
//     roi: {
//       gross: 0,
//       net: 0,
//     },
//   };
//   return propertyModel;
// }

// export { createROIModel, eInputType };
// export type { tROIModel };
