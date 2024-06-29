/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import rfdc from 'rfdc';

type tD3SvgSelect = d3.Selection<SVGSVGElement, unknown, null, any>;

type tPowerConnection = 'load' | 'pv' | 'battery' | 'heatpump' | 'ev' | 'grid';
type tPowerNodeID = tPowerConnection | 'inverter';

type tPowerLine = {
  id: tPowerConnection;
  coordinates: [number, number][];
  flow: 'positive' | 'negative' | 'none';
  powerLevel: number;
  duration: number;
  stroke: string;
  strokeWidth: number;
  width: number;
  height: number;
  fill: string;
};

type tPowerNode = {
  id: tPowerNodeID;
  coordinates: [number, number];
  label: string;
  iconPath: string | null;
  icon: string | null;
  powerLevel: string;
  stroke: string;
  strokeWidth: number;
  width: number;
  height: number;
  fill: string;
  rx: number;
  ry: number;
};

const modelData = {
  container: null as HTMLDivElement | null,
  svg: null as tD3SvgSelect | null,
  xScale: d3.scaleLinear().domain([0, 100]).range([0, 500]),
  yScale: d3.scaleLinear().domain([0, 100]).range([500, 0]),
  width: 500 as number,
  height: 500 as number,
  powerLines: [] as tPowerLine[],
  powerNodeMap: {} as Map<tPowerNodeID, tPowerNode>,
  theme: 'light' as 'light' | 'dark',
};

type tModelData = typeof modelData;

const lightThemedNode = {
  stroke: 'black',
  strokeWidth: 1.5,
  width: 90,
  height: 80,
  fill: 'white',
  rx: 3,
  ry: 3,
  iconPath: 'assets/PowerRouter/Light',
};

const darkThemedNode = {
  stroke: 'white',
  strokeWidth: 1.5,
  width: 90,
  height: 80,
  fill: 'black',
  rx: 3,
  ry: 3,
  iconPath: 'assets/PowerRouter/Dark',
};

const lightThemedLine = {
  stroke: 'black',
  strokeWidth: 1.5,
  fill: 'white',
};

const darkThemedLine = {
  stroke: 'white',
  strokeWidth: 1.5,
  fill: 'black',
};

function createPowerLines(theme: 'light' | 'dark') {
  const themeColours = theme === 'light' ? lightThemedLine : darkThemedLine;

  return [
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
      ...themeColours,
    },
    {
      coordinates: [
        [35, 25],
        [40, 25],
        [48, 35],
        [48, 48],
      ],
      flow: 'positive',
      id: 'ev',
      powerLevel: 0,
      duration: 1000,
      ...themeColours,
    },
    {
      coordinates: [
        [56, 50],
        [76, 50],
      ],
      flow: 'positive',
      id: 'grid',
      powerLevel: 0,
      duration: 3000,
      ...themeColours,
    },
    {
      coordinates: [
        [20, 50],
        [50, 50],
      ],
      flow: 'negative',
      id: 'battery',
      powerLevel: 0,
      duration: 5000,
      ...themeColours,
    },
    {
      coordinates: [
        [65, 80],
        [60, 80],
        [52, 70],
        [52, 52],
      ],
      flow: 'positive',
      id: 'heatpump',
      powerLevel: 0,
      duration: 5000,
      ...themeColours,
    },
  ] as tPowerLine[];
}

function createPowerNodes(theme: 'light' | 'dark') {
  const themeColours = theme === 'light' ? lightThemedNode : darkThemedNode;

  return new Map<tPowerNodeID, tPowerNode>([
    [
      'pv',
      {
        id: 'pv',
        coordinates: [100, 80],
        icon: 'pv.svg',
        label: 'PV Panels',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
    [
      'ev',
      {
        id: 'ev',
        coordinates: [100, 350],
        icon: 'evcharger.svg',
        label: 'EV Charger',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
    [
      'battery',
      {
        id: 'battery',
        coordinates: [50, 200],
        icon: 'battery.svg',
        label: 'Battery',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
    [
      'inverter',
      {
        id: 'inverter',
        coordinates: [210, 200],
        icon: 'inverter.svg',
        label: 'Inverter',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
    [
      'heatpump',
      {
        id: 'heatpump',
        coordinates: [320, 80],
        icon: 'heatpump.svg',
        label: 'HeatPump',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
    [
      'grid',
      {
        id: 'grid',
        coordinates: [370, 200],
        icon: 'grid.svg',
        label: 'Grid',
        powerLevel: '20',
        ...themeColours,
      } as tPowerNode,
    ],
  ]);
}

function createModel() {
  const model = rfdc()(modelData);
  return {
    ...model,
    powerLines: createPowerLines('light'),
    powerNodeMap: createPowerNodes('light'),
  } as tModelData;
}

class VPPModel {
  modelData: tModelData;
  constructor() {
    this.modelData = {
      ...modelData,
      powerLines: createPowerLines('light'),
      powerNodeMap: createPowerNodes('light'),
    } as tModelData;
  }
}

export type { tModelData as tD3Model, tPowerNodeID, tPowerNode, tPowerLine };

export {
  modelData as D3Model,
  createModel,
  createPowerLines,
  createPowerNodes,
  lightThemedNode,
  darkThemedNode,
  lightThemedLine,
  darkThemedLine,
  VPPModel,
};
