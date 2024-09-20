import {
  tProperty,
  tPropertyID,
  tBasicDetails,
  tInvestmentBlock,
} from '../Lib/sharedTypes';

function createROIModel() {
  const propertyModel = {
    investment: {
      propertyValue: 0,
      depositAmount: 0,
      isAdditionalProperty: false,
      stampDuty: 0,
      renovationCosts: 0,
      mortgageAmount: 0,
      interestRate: 4,
      mortgageTerm: 25,
      interestOnlyMortgage: true,
      legalFees: 0,
    } as tInvestmentBlock,
    monthlyExpenses: {
      mortgage: 0,
      management: 0,
      maintenance: 0,
      bills: 0,
      voids: 0,
    },
    monthlyIncome: {
      rent: 0,
    },
    cashflow: {
      annualProfit: 0,
      annualCost: 0,
    },
    yields: {
      gross: 0,
      net: 0,
    },
    roi: {
      gross: 0,
      net: 0,
    },
  };
  return propertyModel;
}

function createBasicDetails() {
  return {
    nameNumber: '',
    street: '',
    area: '',
    authority: '',
    postcode: '',
    latlong: [0, 0],
  } as tBasicDetails;
}

const propertyA = {
  basicDetails: createBasicDetails(),
  roiModel: createROIModel(),
} as tProperty;

const propertyB = {
  basicDetails: createBasicDetails(),
  roiModel: createROIModel(),
} as tProperty;

const propertyC = {
  basicDetails: createBasicDetails(),
  roiModel: createROIModel(),
} as tProperty;

const propertyMap = new Map<tPropertyID, tProperty>([
  ['propertyA', propertyA],
  ['propertyB', propertyB],
  ['propertyC', propertyC],
]);

export { propertyMap, createROIModel };
