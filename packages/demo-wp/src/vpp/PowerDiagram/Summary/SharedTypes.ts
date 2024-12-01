import pvIcon from '../../../assets/PowerRouter/Light/newpv.svg';
import gridIcon from '../../../assets/PowerRouter/Light/newgrid.svg';
import loadIcon from '../../../assets/PowerRouter/Light/heatpump.svg';
import battIcon from '../../../assets/PowerRouter/Light/newbattery.svg';

const showingOptions = [
  'preview',
  'yield',
  'earnings',
  'battery',
  'consumed',
] as const;

type tShowing = (typeof showingOptions)[number];

export { showingOptions, pvIcon, gridIcon, loadIcon, battIcon };
export type { tShowing };
