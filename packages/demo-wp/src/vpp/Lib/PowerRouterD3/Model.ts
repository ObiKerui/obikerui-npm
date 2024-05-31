/* eslint-disable @typescript-eslint/no-explicit-any */
type tD3SvgSelect = d3.Selection<SVGGElement, unknown, null, any>;

type tPowerConnection = 'load' | 'pv' | 'battery' | 'heatpump' | 'ev';
type tPowerNodeID = tPowerConnection | 'inverter';

type tPowerLine = {
  id: tPowerConnection;
  coordinates: [number, number][];
  flow: 'positive' | 'negative' | 'none';
  powerLevel: number;
  duration: number;
};

type tPowerNode = {
  id: tPowerNodeID;
  coordinates: [number, number];
  label: string;
  icon: SVGAElement | null;
  powerLevel: string;
};

const D3Model = {
  container: null as HTMLDivElement | null,
  svg: null as tD3SvgSelect | null,
  xScale: null as unknown,
  yScale: null as unknown,
  width: 0 as number,
  height: 0 as number,
  powerLines: [] as tPowerLine[],
  powerNodes: [] as tPowerNode[],
};

type tD3Model = typeof D3Model;

const powerLineData = [
  {
    coordinates: [
      [35, 80],
      [40, 80],
      [48, 70],
      [48, 52],
    ],
    flow: 'positive',
    id: 'pv',
    powerLevel: 0,
    duration: 2000,
  },
  {
    coordinates: [
      [35, 10],
      [40, 10],
      [48, 20],
      [48, 48],
    ],
    flow: 'positive',
    id: 'battery',
    powerLevel: 0,
    duration: 1000,
  },
  {
    coordinates: [
      [65, 10],
      [60, 10],
      [52, 20],
      [52, 48],
    ],
    flow: 'positive',
    id: 'ev',
    powerLevel: 0,
    duration: 3000,
  },
  {
    coordinates: [
      [20, 50],
      [40, 50],
    ],
    flow: 'negative',
    id: 'load',
    powerLevel: 0,
    duration: 5000,
  },
  {
    coordinates: [
      [80, 50],
      [60, 50],
    ],
    flow: 'positive',
    id: 'heatpump',
    powerLevel: 0,
    duration: 5000,
  },
] as tPowerLine[];

const powerNodes = [
  {
    id: 'inverter',
    coordinates: [30, 30],
    icon: null,
    label: 'inverter',
    powerLevel: '20',
  },
] as tPowerNode[];

export type { tD3Model };

export { D3Model, powerLineData, powerNodes };
