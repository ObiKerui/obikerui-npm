import { tProfile } from '../Lib/Node/Types';
import {
  tLabel,
  tPowerNodeID,
  tNode,
  tPowerArchID,
  tArch,
  tPowerCategory,
} from './Types';

const pvLabelData = [
  {
    text: 'PV Panels',
    coords: [0, -50],
  },
  {
    text: 'power',
    coords: [0, -25],
  },
] as tLabel[];

const pvIconData = {
  path: 'assets/PowerRouter/Light/pv.svg',
  height: 30,
  width: 50,
};

const inverterLabelData = [
  {
    text: 'Inverter',
    coords: [0, -50],
  },
  {
    text: 'power',
    coords: [0, -25],
  },
] as tLabel[];

const inverterIconData = {
  path: 'assets/PowerRouter/Light/inverter.svg',
  height: 30,
  width: 50,
};

const batteryLabelData = [
  {
    text: 'Battery',
    coords: [0, -50],
  },
  {
    text: 'power',
    coords: [0, -25],
  },
] as tLabel[];

const batteryIconData = {
  path: 'assets/PowerRouter/Light/battery.svg',
  height: 30,
  width: 50,
};

const gridLabelData = [
  {
    text: 'Grid',
    coords: [0, -50],
  },
  {
    text: 'power',
    coords: [0, -25],
  },
] as tLabel[];

const gridIconData = {
  path: 'assets/PowerRouter/Light/grid.svg',
  height: 30,
  width: 50,
};

const loadLabelData = [
  {
    text: 'Load',
    coords: [0, -50],
  },
  {
    text: 'power',
    coords: [0, -25],
  },
] as tLabel[];

const loadIconData = {
  path: 'assets/PowerRouter/Light/heatpump.svg',
  height: 30,
  width: 50,
};

const powerNodeMap = new Map<tPowerNodeID, tNode>([
  [
    'pv',
    {
      id: 'pv',
      coordinates: [-150, -100],
      icon: pvIconData,
      powerLevel: '20',
      labels: pvLabelData,
      selected: false,
    },
  ],
  [
    'inverter',
    {
      id: 'inverter',
      coordinates: [0, 0],
      icon: inverterIconData,
      powerLevel: '20',
      labels: inverterLabelData,
      selected: false,
    },
  ],
  [
    'battery',
    {
      id: 'battery',
      coordinates: [-150, 100],
      icon: batteryIconData,
      powerLevel: '20',
      labels: batteryLabelData,
      selected: false,
    },
  ],
  [
    'grid',
    {
      id: 'grid',
      coordinates: [150, -100],
      icon: gridIconData,
      powerLevel: '20',
      labels: gridLabelData,
      selected: false,
    },
  ],
  [
    'load',
    {
      id: 'load',
      coordinates: [150, 100],
      icon: loadIconData,
      powerLevel: '20',
      labels: loadLabelData,
      selected: false,
    },
  ],
]);

const powerArchMap = new Map<tPowerArchID, tArch>([
  [
    'pv_inverter',
    {
      id: 'pv_inverter',
      coordinates: [
        [-150, -100],
        [-80, -100],
        [-80, -10],
        [0, -10],
      ],
      flow: 'none',
    },
  ],
  [
    'battery_inverter',
    {
      id: 'battery_inverter',
      coordinates: [
        [-150, 100],
        [-80, 100],
        [-80, 10],
        [0, 10],
      ],
      flow: 'negative',
    },
  ],
  [
    'grid_inverter',
    {
      id: 'grid_inverter',
      coordinates: [
        [150, -100],
        [80, -100],
        [80, -10],
        [0, -10],
      ],
      flow: 'none',
    },
  ],
  [
    'load_inverter',
    {
      id: 'load_inverter',
      coordinates: [
        [150, 100],
        [80, 100],
        [80, 10],
        [0, 10],
      ],
      flow: 'negative',
    },
  ],
]);

const lightProfile = {
  circleFill: 'currentColor',
  fill: 'hsl(0, 0%, 95%)',
  stroke: 'currentColor',
  strokeWidth: '2',
  svgStroke: 'currentColor',
  textFill: 'currentColor',
} as tProfile;

const darkProfile = {
  circleFill: 'currentColor',
  fill: 'black',
  stroke: 'currentColor',
  strokeWidth: '2',
  svgStroke: 'currentColor',
  textFill: 'currentColor',
} as tProfile;

const powerNodeToCategory = new Map<tPowerNodeID, tPowerCategory>([
  ['battery', 'soc'],
  ['inverter', 'unknown'],
  ['pv', 'dailyYield'],
  ['load', 'consumption'],
  ['grid', 'feedInEnergy'],
]);

export {
  powerNodeMap,
  powerArchMap,
  lightProfile,
  darkProfile,
  powerNodeToCategory,
};
