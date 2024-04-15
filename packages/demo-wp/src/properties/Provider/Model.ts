/* eslint-disable max-classes-per-file */
type tInvestmentBlock = {
  propertyValue: null | number;
  depositAmount: null | number;
  stampDuty: null | number;
  renovationCosts: null | number;
  mortgageAmount: null | number;
  interestRate: null | number;
  legalFees: null | number;
};

type tYields = {
  gross: null | number;
  net: null | number;
};

const ROIModel = {
  investment: {
    propertyValue: null,
    depositAmount: null,
    stampDuty: null,
    renovationCosts: null,
    mortgageAmount: null,
    interestRate: null,
    legalFees: null,
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
  yields: {
    gross: 0,
    net: 0,
  } as tYields,
  roi: {
    gross: 0,
    net: 0,
  },
};

type tROIModel = typeof ROIModel;

const PropertyModel = {
  propertyPrice: 0,
  depositAmount: 0,
  stampDuty: 0,
  renovationCosts: 0,
  mortgageAmount: 0,
  interestRate: 0,
  rentalIncome: 0,
  rentalVoids: 0,
  maintenanceCosts: 0,
  legalFees: 0,
  bills: 0,
  managementFees: 0,
  yields: {
    gross: 0,
    net: 0,
  },
};

type tModel = typeof PropertyModel;

function createROIModel() {
  const propertyModel = {
    investment: {
      propertyValue: null,
      depositAmount: null,
      stampDuty: null,
      renovationCosts: null,
      mortgageAmount: null,
      interestRate: null,
      legalFees: null,
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

function createModel() {
  const propertyModel = {
    propertyPrice: null,
    depositAmount: null,
    stampDuty: 0,
    renovationCosts: 0,
    mortgageAmount: 0,
    interestRate: 0,
    rentalIncome: 0,
    rentalVoids: 0,
    maintenanceCosts: 0,
    legalFees: 0,
    bills: 0,
    managementFees: 0,
    yields: {
      gross: 0,
      net: 0,
    },
  };
  return propertyModel;
}

export { createModel, createROIModel };
export type { tModel, tROIModel };
