import { create } from 'zustand';

type tAddress = {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  region: string;
  postcode: string;
};

type tPropertyRecord = {
  id: string;
  setID: (newValue: string) => void;
  address: tAddress;
  setAddress: (newValue: tAddress) => void;
  costprofitModel: string;
  setCostProfit: (newValue: string) => void;
  dateAdded: string;
  setDateAdded: (newValue: string) => void;
  yield: number;
  setYield: (newValue: number) => void;
};

type tPropertiesModel = {
  properties: tPropertyRecord[];
  setProperties: (newValue: tPropertyRecord[]) => void;
};

const useProperties = create<tPropertiesModel>((set) => ({
  properties: [],
  setProperties: (newValue) => set({ properties: newValue }),
}));

export type { tPropertiesModel, tPropertyRecord, tAddress };
export { useProperties };
