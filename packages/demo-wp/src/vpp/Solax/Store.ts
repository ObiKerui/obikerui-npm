import { create } from 'zustand';
import { tSolaxData, tPowerNodeID, tPowerArchID, tArch, tNode } from './Types';
import { powerNodeMap, powerArchMap } from './Model';

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
  focus: string;
  setFocus: (newValue: string) => void;
  solaxData: tSolaxData[];
  selected: boolean[];
  setSelected: (newValue: boolean[]) => void;
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
  focus: 'ev',
  setFocus: (newValue) => set({ focus: newValue }),
  solaxData: [],
  selected: new Array(5).fill(false),
  setSelected: (newValue) => set({ selected: newValue }),
}));

export { usePowerRouter };
export type { tPowerRouter };
