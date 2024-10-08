import dayjs from 'dayjs';

type tPowerConnection = 'load' | 'pv' | 'battery' | 'heatpump' | 'ev' | 'grid';
type tPowerNodeID = tPowerConnection | 'inverter' | 'none';

type tPowerCategory =
  | 'soc'
  | 'dailyYield'
  | 'consumption'
  | 'feedInEnergy'
  | 'unknown';

type tLabel = {
  text: string;
  coords: [number, number];
};

type tIcon = {
  path: string;
  height: number;
  width: number;
};

type tActivity = {
  iconPaths: string[];
  currIconIndex: number;
  active: boolean;
};

type tNode = {
  id: string;
  coordinates: [number, number];
  icon: tIcon;
  activity: tActivity;
  powerLevel: string;
  labels: tLabel[];
  selected: boolean;
  colour: string;
};

type tPowerArchID =
  | 'pv_inverter'
  | 'battery_inverter'
  | 'ev_inverter'
  | 'grid_inverter'
  | 'load_inverter';

type tArch = {
  id: string;
  coordinates: [number, number][];
  flow: 'positive' | 'negative' | 'none';
  current: 'none' | 'low' | 'med' | 'high';
};

type tSolaxData = {
  inverterSN: string;
  acpower: number;
  yieldtoday: number;
  yieldtotal: number;
  feedinpower: number;
  feedinenergy: number;
  consumeenergy: number;
  soc: number;
  batStatus: string;
  batPower: number;
  uploadTime: string;
};

type tPercentages = {
  full: number;
  empty: number;
  charging: number;
  discharging: number;
};

type tProfitLoss = {
  feedin: number;
  consumed: number;
};

type tTariff = {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  price: number;
};

type tFinancial = {
  feedIn: number;
  tariffs: tTariff[];
};

export type {
  tLabel,
  tNode,
  tPowerNodeID,
  tPowerArchID,
  tPowerCategory,
  tArch,
  tSolaxData,
  tPercentages,
  tProfitLoss,
  tFinancial,
  tTariff,
  tActivity,
};
