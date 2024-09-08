import { create } from 'zustand';

// type tReading = {
//   value_exc_vat: string;
//   value_inc_vat: string;
//   valid_from: string;
//   valid_to: string;
//   payment_method: null;
// };

type tReading = {
  valueExcVat: number;
  valueIncVat: number;
  validFrom: string;
  validTo: string;
  paymentMethod: null;
};

type tChart = {
  lineContainer: HTMLDivElement | null;
  setLineContainer: (newValue: HTMLDivElement | null) => void;
  jsonData: tReading[];
  setJsonData: (newValue: tReading[]) => void;
  processedData: tReading[];
  setProcessedData: (newValue: tReading[]) => void;
  visibility: string[];
  setVisibility: (newValue: string[]) => void;
};

const useChart = create<tChart>((set) => ({
  lineContainer: null,
  setLineContainer: (newValue) => set({ lineContainer: newValue }),
  jsonData: [],
  setJsonData: (newValue) => set({ jsonData: newValue }),
  processedData: [],
  setProcessedData: (newValue) => set({ processedData: newValue }),

  //   batContainer: null,
  //   setBatContainer: (newValue) => set({ batContainer: newValue }),
  //   pvContainer: null,
  //   setPVContainer: (newValue) => set({ pvContainer: newValue }),
  //   categories: [],
  //   setCategories: (newValue) => set({ categories: newValue }),
  //   rangedData: [],
  //   setRangedData: (newValue) => set({ rangedData: newValue }),
  //   timeFrame: '48hours',
  //   setTimeFrame: (newValue) => set({ timeFrame: newValue }),
  visibility: [],
  setVisibility: (newValue) => set({ visibility: newValue }),
}));

export { useChart };
export type { tChart, tReading };
