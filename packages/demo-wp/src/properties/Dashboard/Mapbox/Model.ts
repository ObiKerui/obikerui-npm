import { create } from 'zustand';

type tModel = {
  container: HTMLDivElement | null;
  setContainer: (newValue: HTMLDivElement | null) => void;
  style: string;
  setStyle: (newValue: string) => void;
  center: [number, number];
  setCenter: (newValue: [number, number]) => void;
  zoom: number;
  setZoom: (newValue: number) => void;
  pitch: number;
  setPitch: (newValue: number) => void;
};

const useMapModel = create<tModel>((set) => ({
  container: null,
  setContainer: (newValue) => set({ container: newValue }),
  style: 'mapbox://styles/mapbox/streets-v12',
  setStyle: (newValue) => set({ style: newValue }),
  center: [-1.61, 54.9] as [number, number], // starting position [lng, lat]
  setCenter: (newValue) => set({ center: newValue }),
  zoom: 9, // starting zoom
  setZoom: (newValue) => set({ zoom: newValue }),
  pitch: 40,
  setPitch: (newValue) => set({ pitch: newValue }),
}));

export { useMapModel };
export type { tModel };
