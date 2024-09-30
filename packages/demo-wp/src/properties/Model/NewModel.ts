import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  properties: Map<tPropertyID, tProperty>;
  setProperties: (newValue: Map<tPropertyID, tProperty>) => void;
  currentProperty: tPropertyID | null;
  setCurrentProperty: (newValue: tPropertyID | null) => void;
};

type tPropertyEdit = {
  propertySelected: tPropertyID | null;
  setPropertySelected: (newValue: tPropertyID | null) => void;
  showPropertyList: boolean;
  setShowPropertyList: (newValue: boolean) => void;
  showNewPropertyForm: boolean;
  setShowNewPropertyForm: (newValue: boolean) => void;
  showEditPropertyForm: boolean;
  setShowEditPropertyForm: (newValue: boolean) => void;
};

// const useBoundStore = create<tPropertyModel>()(
//   persist(
//     (set) => ({
//       properties: new Map<tPropertyID, tProperty>([
//         ['default', {} as tProperty],
//       ]),
//       setProperties: (newValue) => set({ properties: newValue }),
//       currentProperty: null,
//       setCurrentProperty: (newValue) => set({ currentProperty: newValue }),
//     }),
//     {
//       name: 'properties-storage',
//       storage: createJSONStorage(() => sessionStorage),
//     }
//   )
// );

const usePropertySelect = create<tPropertyEdit>((set) => ({
  propertySelected: null,
  setPropertySelected: (newValue) => set({ propertySelected: newValue }),
  showPropertyList: false,
  setShowPropertyList: (newValue) => set({ showPropertyList: newValue }),
  showEditPropertyForm: false,
  setShowEditPropertyForm: (newValue) =>
    set({ showEditPropertyForm: newValue }),
  showNewPropertyForm: false,
  setShowNewPropertyForm: (newValue) => set({ showNewPropertyForm: newValue }),
}));

const useBoundStore = create<tPropertyModel>()((set) => ({
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

export { useBoundStore, useComputedState, usePropertySelect };
export type { tProperty, tComputedState, tPropertyEdit };
