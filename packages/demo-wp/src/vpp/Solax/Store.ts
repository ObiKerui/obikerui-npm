import { create } from 'zustand';
import dayjs from 'dayjs';
import { tSolaxData, tPowerNodeID, tPowerArchID, tArch, tNode } from './Types';
import { powerNodeMap, powerArchMap } from './Model';

type tTariff = {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  price: number;
};

type tFinancial = {
  feedIn: number;
  tariffs: tTariff[];
};

type tPowerRouter = {
  profile: 'light' | 'dark' | null;
  setProfile: (newValue: 'light' | 'dark' | null) => void;
  container: HTMLDivElement | null;
  setContainer: (newValue: HTMLDivElement | null) => void;
  data: tSolaxData[];
  setData: (newValue: tSolaxData[]) => void;
  id: string;
  nodes: Map<tPowerNodeID, tNode>;
  setNodes: (newValue: Map<tPowerNodeID, tNode>) => void;
  arches: Map<tPowerArchID, tArch>;
  setArches: (newValue: Map<tPowerArchID, tArch>) => void;
  focus: tPowerNodeID;
  setFocus: (newValue: tPowerNodeID) => void;
  solaxData: tSolaxData[];
  selected: boolean[];
  setSelected: (newValue: boolean[]) => void;
  financial: tFinancial;
  setFinancial: (newValue: tFinancial) => void;
};

const usePowerRouter = create<tPowerRouter>((set) => ({
  profile: null,
  setProfile: (newValue) => set({ profile: newValue }),
  container: null,
  setContainer: (newValue) => set({ container: newValue }),
  data: [],
  setData: (newValue) => set({ data: newValue }),
  id: 'hello',
  nodes: powerNodeMap,
  setNodes: (newValue) => set({ nodes: newValue }),
  arches: powerArchMap,
  setArches: (newValue) => set({ arches: newValue }),
  focus: 'battery',
  setFocus: (newValue) => set({ focus: newValue }),
  solaxData: [],
  selected: new Array(5).fill(false),
  setSelected: (newValue) => set({ selected: newValue }),
  financial: {
    feedIn: 0,
    tariffs: [
      {
        start: dayjs('1970-01-01T00:00:00'),
        end: dayjs('1970-01-01T23:59:00'),
        price: 0,
      },
    ],
  },
  setFinancial: (newValue) => set({ financial: newValue }),
}));

export { usePowerRouter };
export type { tPowerRouter };
