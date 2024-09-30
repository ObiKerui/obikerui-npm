import { tProfile } from '../Lib/Node/Types';
import {
  tLabel,
  tPowerNodeID,
  tNode,
  tPowerArchID,
  tArch,
  tPowerCategory,
  tActivity,
} from './Types';

const pvLabelData = [
  {
    text: 'PV Panels',
    coords: [0, -40],
  },
  {
    text: 'power',
    coords: [0, -15],
  },
] as tLabel[];

const pvIconData = {
  path: 'assets/PowerRouter/Light/newpv.svg',
  height: 20,
  width: 35,
};

const pvActivityData: tActivity = {
  iconPaths: ['assets/PowerRouter/Light/sun.svg'],
  currIconIndex: 0,
  active: true,
};

const inverterLabelData = [
  {
    text: 'Inverter',
    coords: [0, -40],
  },
  {
    text: 'power',
    coords: [0, -15],
  },
] as tLabel[];

const inverterIconData = {
  path: 'assets/PowerRouter/Light/newinverter.svg',
  height: 20,
  width: 35,
};

const inverterActivityData: tActivity = {
  iconPaths: [
    'assets/PowerRouter/Light/consume.svg',
    'assets/PowerRouter/Light/produce.svg',
  ],
  currIconIndex: 0,
  active: false,
};

const batteryLabelData = [
  {
    text: 'Battery',
    coords: [0, -40],
  },
  {
    text: 'power',
    coords: [0, -15],
  },
] as tLabel[];

const batteryIconData = {
  path: 'assets/PowerRouter/Light/newbattery.svg',
  height: 20,
  width: 35,
};

const batteryActivityData: tActivity = {
  iconPaths: [
    'assets/PowerRouter/Light/consume.svg',
    'assets/PowerRouter/Light/produce.svg',
  ],
  currIconIndex: 0,
  active: false,
};

const gridLabelData = [
  {
    text: 'Grid',
    coords: [0, -40],
  },
  {
    text: 'power',
    coords: [0, -15],
  },
] as tLabel[];

const gridIconData = {
  path: 'assets/PowerRouter/Light/newgrid.svg',
  height: 20,
  width: 35,
};

const gridActivityData: tActivity = {
  iconPaths: [
    'assets/PowerRouter/Light/consume.svg',
    'assets/PowerRouter/Light/produce.svg',
  ],
  currIconIndex: 0,
  active: false,
};

const loadLabelData = [
  {
    text: 'Load',
    coords: [0, -40],
  },
  {
    text: 'power',
    coords: [0, -15],
  },
] as tLabel[];

const loadIconData = {
  path: 'assets/PowerRouter/Light/heatpump.svg',
  height: 20,
  width: 35,
};

const loadActivityData: tActivity = {
  iconPaths: [
    'assets/PowerRouter/Light/consume.svg',
    'assets/PowerRouter/Light/produce.svg',
  ],
  currIconIndex: 0,
  active: false,
};

const powerNodeMap = new Map<tPowerNodeID, tNode>([
  [
    'pv',
    {
      id: 'pv',
      coordinates: [-120, -80],
      icon: pvIconData,
      activity: pvActivityData,
      powerLevel: '20',
      labels: pvLabelData,
      selected: false,
      colour: 'red',
    },
  ],
  [
    'inverter',
    {
      id: 'inverter',
      coordinates: [0, 0],
      icon: inverterIconData,
      activity: inverterActivityData,
      powerLevel: '20',
      labels: inverterLabelData,
      selected: false,
      colour: 'default',
    },
  ],
  [
    'battery',
    {
      id: 'battery',
      coordinates: [-120, 80],
      icon: batteryIconData,
      activity: batteryActivityData,
      powerLevel: '20',
      labels: batteryLabelData,
      selected: false,
      colour: 'green',
    },
  ],
  [
    'grid',
    {
      id: 'grid',
      coordinates: [120, -80],
      icon: gridIconData,
      activity: gridActivityData,
      powerLevel: '20',
      labels: gridLabelData,
      selected: false,
      colour: 'grey',
    },
  ],
  [
    'load',
    {
      id: 'load',
      coordinates: [120, 80],
      icon: loadIconData,
      activity: loadActivityData,
      powerLevel: '20',
      labels: loadLabelData,
      selected: false,
      colour: 'blue',
    },
  ],
]);

const powerArchMap = new Map<tPowerArchID, tArch>([
  [
    'pv_inverter',
    {
      id: 'pv_inverter',
      coordinates: [
        // [-150, -100],
        // [-80, -100],
        // [-80, -10],
        // [0, -10],
        [-120, -80],
        [-60, -80],
        [-60, -10],
        [0, -10],
      ],
      flow: 'none',
      current: 'none',
    },
  ],
  [
    'battery_inverter',
    {
      id: 'battery_inverter',
      coordinates: [
        // [-150, 100],
        // [-80, 100],
        // [-80, 10],
        // [0, 10],
        [-120, 80],
        [-60, 80],
        [-60, 10],
        [0, 10],
      ],
      flow: 'negative',
      current: 'none',
    },
  ],
  [
    'grid_inverter',
    {
      id: 'grid_inverter',
      coordinates: [
        [120, -80],
        [60, -80],
        [60, -10],
        [0, -10],
      ],
      flow: 'none',
      current: 'none',
    },
  ],
  [
    'load_inverter',
    {
      id: 'load_inverter',
      coordinates: [
        [120, 80],
        [60, 80],
        [60, 10],
        [0, 10],
      ],
      flow: 'negative',
      current: 'none',
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
