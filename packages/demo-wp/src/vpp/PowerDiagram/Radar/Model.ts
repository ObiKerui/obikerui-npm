import { create } from 'zustand';

const map = new Map<number, number>([
  [10, 10],
  [50, 50],
  [100, 100],
]);

const contactMap = new Map<number, number>([
  [90, 56],
  [110, 87],
]);

type tMargin = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

type tState = {
  container: HTMLDivElement | null;
  setContainer: (newValue: HTMLDivElement | null) => void;
  margins: tMargin;
  setMargins: (newValue: tMargin) => void;
  dimensions: [number, number];
  setDimensions: (newValue: [number, number]) => void;
  rangeCircles: Map<number, number>;
  setRangeCircles: (newValue: Map<number, number>) => void;
  rotationSpeed: number;
  setRotationSpeed: (newValue: number) => void;
  contacts: Map<number, number>;
  setContacts: (newValue: Map<number, number>) => void;
};

const useRadar = create<tState>((set) => ({
  container: null,
  setContainer: (newValue) => set({ container: newValue }),
  margins: {
    top: 50,
    left: 50,
    bottom: 50,
    right: 50,
  },
  setMargins: (newValue) => set({ margins: newValue }),
  dimensions: [200, 200],
  setDimensions: (newValue) => set({ dimensions: newValue }),
  rangeCircles: map,
  setRangeCircles: (newValue) => set({ rangeCircles: newValue }),
  rotationSpeed: 1,
  setRotationSpeed: (newValue) => set({ rotationSpeed: newValue }),
  contacts: contactMap,
  setContacts: (newValue) => set({ contacts: newValue }),
}));

export type { tState };
export { useRadar };
