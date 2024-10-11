import dayjs from 'dayjs';
import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

type tPropertyDetails = {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  region: string;
  postcode: string;
  authority: string;
  latlong: [number, number];
  dateAdded: string;
};

type tPropertyValue = {
  propertyValue: number;
  deposit: number;
  isAdditionalProperty: boolean;
  stampDuty: number;
};

type tMortgageModel = {
  legalFees: number;
  renovationFees: number;
  interestRate: number;
  mortgageTerm: number;
  interestOnly: boolean;
};

type tMonthlyExpenditure = {
  mortgagePayment: number;
  managementFees: number;
  maintenanceFees: number;
  bills: number;
  rentalVoids: number;
};

type tMonthlyIncome = {
  rentalIncome: number;
};

type tMetrics = {
  netYield: number;
  netROI: number;
};

const period = ['monthly', 'annual'] as const;

type tPeriod = (typeof period)[number];

type tPeriodSettings = {
  expenditurePeriod: tPeriod;
  incomePeriod: tPeriod;
};

type tProperty = tPropertyDetails &
  tPropertyValue &
  tMortgageModel &
  tMonthlyExpenditure &
  tMonthlyIncome &
  tMetrics &
  tPeriodSettings;

type tPropertyID = string;

type tPropertyModel = {
  defaultProperty: tProperty;
  setDefaultProperty: (newValue: tProperty) => void;
  properties: Map<tPropertyID, tProperty>;
  setProperties: (newValue: Map<tPropertyID, tProperty>) => void;
  currentProperty: tPropertyID | null;
  setCurrentProperty: (newValue: tPropertyID | null) => void;
};

type tPropertyEdit = {
  changesMade: boolean;
  setChangesMade: (newValue: boolean) => void;
  propertySelected: tPropertyID | null;
  setPropertySelected: (newValue: tPropertyID | null) => void;
  showPropertyList: boolean;
  setShowPropertyList: (newValue: boolean) => void;
  showNewPropertyForm: boolean;
  setShowNewPropertyForm: (newValue: boolean) => void;
  showEditPropertyForm: boolean;
  setShowEditPropertyForm: (newValue: boolean) => void;
  showSavePropertyForm: boolean;
  setShowSavePropertyForm: (newValue: boolean) => void;
};

const usePropertySelect = create<tPropertyEdit>((set) => ({
  changesMade: false,
  setChangesMade: (newValue) => set({ changesMade: newValue }),
  propertySelected: null,
  setPropertySelected: (newValue) => set({ propertySelected: newValue }),
  showPropertyList: false,
  setShowPropertyList: (newValue) => set({ showPropertyList: newValue }),
  showEditPropertyForm: false,
  setShowEditPropertyForm: (newValue) =>
    set({ showEditPropertyForm: newValue }),
  showSavePropertyForm: false,
  setShowSavePropertyForm: (newValue) =>
    set({ showSavePropertyForm: newValue }),
  showNewPropertyForm: false,
  setShowNewPropertyForm: (newValue) => set({ showNewPropertyForm: newValue }),
}));

const defaultProperty: tProperty = {
  // property details
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  authority: '',
  postcode: '',
  region: '',
  latlong: [0, 0],
  dateAdded: dayjs().format('dd-mm-yyyy'),

  // total investment
  propertyValue: 0,
  deposit: 0,
  isAdditionalProperty: false,
  stampDuty: 0,

  // fees
  legalFees: 0,
  renovationFees: 0,
  interestRate: 0,
  mortgageTerm: 0,
  interestOnly: false,

  // mortgage
  mortgagePayment: 0,
  bills: 0,
  rentalVoids: 0,
  managementFees: 0,
  maintenanceFees: 0,

  // rental income
  rentalIncome: 0,

  //
  expenditurePeriod: 'monthly',
  incomePeriod: 'monthly',

  //
  netYield: 0,
  netROI: 0,
};

// getProperty: (propKey: tPropertyID | null) => {
//   const propertiesMap = get().properties;
//   const property = propKey ? propertiesMap.get(propKey) ?? null : null;
//   return property ?? defaultProperty;
// },

const useBoundStore = create<tPropertyModel>()((set) => ({
  defaultProperty: { ...defaultProperty },
  setDefaultProperty: (newValue) => set({ defaultProperty: newValue }),
  properties: new Map<tPropertyID, tProperty>([]),
  setProperties: (newValue) => set({ properties: newValue }),
  currentProperty: null,
  setCurrentProperty: (newValue) => set({ currentProperty: newValue }),
}));

type tComputedState = {
  stampDuty: number;
  setStampDuty: (newValue: number) => void;
  mortgageAmount: number;
  setMortgageAmount: (newValue: number) => void;
  totalInvestment: number;
  setTotalInvestment: (newValue: number) => void;
  monthlyMortgagePayment: number;
  setMonthlyMortgagePayment: (newValue: number) => void;
  monthlyExpenditure: number;
  setMonthlyExpenditure: (newValue: number) => void;
  monthlyIncome: number;
  setMonthlyIncome: (newValue: number) => void;
  yield: number;
  setYield: (newValue: number) => void;
  roi: number;
  setROI: (newValue: number) => void;
};

const useComputedState = create<tComputedState>((set) => ({
  stampDuty: 0,
  setStampDuty: (newValue) => set({ stampDuty: newValue }),
  mortgageAmount: 0,
  setMortgageAmount: (newValue) => set({ mortgageAmount: newValue }),
  totalInvestment: 0,
  setTotalInvestment: (newValue) => set({ totalInvestment: newValue }),
  monthlyMortgagePayment: 0,
  setMonthlyMortgagePayment: (newValue) =>
    set({ monthlyMortgagePayment: newValue }),
  monthlyExpenditure: 0,
  setMonthlyExpenditure: (newValue) => set({ monthlyExpenditure: newValue }),
  monthlyIncome: 0,
  setMonthlyIncome: (newValue) => set({ monthlyIncome: newValue }),
  yield: 0,
  setYield: (newValue) => set({ yield: newValue }),
  roi: 0,
  setROI: (newValue) => set({ roi: newValue }),
}));

export { useBoundStore, useComputedState, usePropertySelect, defaultProperty };
export type { tProperty, tComputedState, tPropertyEdit };
