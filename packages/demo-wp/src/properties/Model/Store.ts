import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tProperty, tPropertyID } from '../Lib/sharedTypes';
import { propertyMap } from './Model';

type tPropertyValue = {
  propertyValue: number;
  setPropertyValue: (newValue: number) => void;
  deposit: number;
  setDeposit: (newValue: number) => void;
  isAdditionalProperty: boolean;
  setIsAdditionalProperty: (newValue: boolean) => void;
  stampDuty: number;
  setStampDuty: (newValue: number) => void;
};

const createPropertyValue: StateCreator<tPropertyValue> = (set, get) => ({
  propertyValue: 0,
  setPropertyValue: (newValue) => set({ propertyValue: newValue }),
  deposit: 0,
  setDeposit: (newValue) => set({ deposit: newValue }),
  isAdditionalProperty: false,
  setIsAdditionalProperty: (newValue) =>
    set({ isAdditionalProperty: newValue }),
  stampDuty: 0,
  setStampDuty: (newValue) => set({ stampDuty: newValue }),
  compStampDuty: () => get().stampDuty * 2,
});

type tMortgageModel = {
  legalFees: number;
  setLegalFees: (newValue: number) => void;
  renovationFees: number;
  setRenovationFees: (newValue: number) => void;
  interestRate: number;
  setInterestRate: (newValue: number) => void;
  mortgageTerm: number;
  setMortgageTerm: (newValue: number) => void;
};

const createMortgageModel: StateCreator<tMortgageModel> = (set) => ({
  legalFees: 0,
  setLegalFees: (newValue) => set({ legalFees: newValue }),
  renovationFees: 0,
  setRenovationFees: (newValue) => set({ renovationFees: newValue }),
  interestRate: 0,
  setInterestRate: (newValue) => set({ interestRate: newValue }),
  mortgageTerm: 0,
  setMortgageTerm: (newValue) => set({ mortgageTerm: newValue }),
});

type tPropertyModel = {
  properties: Map<tPropertyID, tProperty>;
  setProperties: (newValue: Map<tPropertyID, tProperty>) => void;
};

const createPropertyModel: StateCreator<tPropertyModel> = (set) => ({
  properties: propertyMap,
  setProperties: (newValue) => set({ properties: newValue }),
});

type tMonthlyExpenditure = {
  mortgagePayment: number;
  setMortgagePayment: (newValue: number) => void;
  managementFees: number;
  setManagementFees: (newValue: number) => void;
  maintenanceFees: number;
  setMaintenanceFees: (newValue: number) => void;
  bills: number;
  setBills: (newValue: number) => void;
  rentalVoids: number;
  setRentalVoids: (newValue: number) => void;
};

const createMonthlyExpenditure: StateCreator<tMonthlyExpenditure> = (set) => ({
  mortgagePayment: 0,
  setMortgagePayment: (newValue) => set({ mortgagePayment: newValue }),
  bills: 0,
  setBills: (newValue) => set({ bills: newValue }),
  rentalVoids: 0,
  setRentalVoids: (newValue) => set({ rentalVoids: newValue }),
  managementFees: 0,
  setManagementFees: (newValue) => set({ managementFees: newValue }),
  maintenanceFees: 0,
  setMaintenanceFees: (newValue) => set({ maintenanceFees: newValue }),
});

type tMonthlyIncome = {
  rentalIncome: number;
  setRentalIncome: (newValue: number) => void;
};

const createMonthlyIncome: StateCreator<tMonthlyIncome> = (set) => ({
  rentalIncome: 0,
  setRentalIncome: (newValue) => set({ rentalIncome: newValue }),
});

const period = ['monthly', 'annual'] as const;

type tPeriod = (typeof period)[number];

type tPeriodSettings = {
  expenditurePeriod: tPeriod;
  setExpenditurePeriod: (newValue: tPeriod) => void;
  incomePeriod: tPeriod;
  setIncomePeriod: (newValue: tPeriod) => void;
};

const createPeriodSettings: StateCreator<tPeriodSettings> = (set) => ({
  expenditurePeriod: 'monthly',
  setExpenditurePeriod: (newValue) => set({ expenditurePeriod: newValue }),
  incomePeriod: 'monthly',
  setIncomePeriod: (newValue) => set({ incomePeriod: newValue }),
});

type tMetrics = {
  netYield: number;
  netROI: number;
};

const createMetrics: StateCreator<tMetrics> = () => ({
  netYield: 0,
  netROI: 0,
});

type tBoundStore = tPropertyValue &
  tMortgageModel &
  tPropertyModel &
  tMonthlyExpenditure &
  tMonthlyIncome &
  tPeriodSettings &
  tMetrics;

const useBoundStore = create<tBoundStore>()(
  persist(
    (...a) => ({
      ...createPropertyValue(...a),
      ...createMortgageModel(...a),
      ...createPropertyModel(...a),
      ...createMonthlyExpenditure(...a),
      ...createMonthlyIncome(...a),
      ...createPeriodSettings(...a),
      ...createMetrics(...a),
    }),
    {
      name: 'calculator-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

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

export { useBoundStore, useComputedState };
export type { tBoundStore, tComputedState };
