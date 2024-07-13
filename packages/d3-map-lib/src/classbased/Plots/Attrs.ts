type tFeatureCollection = {
  type: string;
  features: unknown[];
};

const defaultPlotAttrs = {
  plotID: null as string | null,
  index: 0 as number,
  clipPathID: null as string | null,
  geojson: null as tFeatureCollection | null,
  json: [] as unknown,
  style: null as string | null,
  zoom: 1 as number,
};

const MarkerAttrs = {
  onDrawMarker: null as ((data: unknown, index: number) => string) | null,
};

// type tProjection =
//   | 'AzimuthalEqualArea'
//   | 'AzimuthalEquidistant'
//   | 'Gnomonic'
//   | 'Orthographic'
//   | 'Stereographic'
//   | 'Albers'
//   | 'ConicConformal'
//   | 'ConicEqualArea'
//   | 'ConicEquidistant'
//   | 'Equirectangular'
//   | 'Mercator'
//   | 'TransverseMercator';

const Projections = [
  'AzimuthalEqualArea',
  'AzimuthalEquidistant',
  'Gnomonic',
  'Orthographic',
  'Stereographic',
  'Albers',
  'ConicConformal',
  'ConicEqualArea',
  'ConicEquidistant',
  'Equirectangular',
  'Stereographic',
  'Mercator',
  'TransverseMercator',
] as const;

type tProjection = (typeof Projections)[number];

const LayerAttrs = {
  projectionType: 'Mercator' as tProjection,
  scale: 100 as number,
  position: [0, 0] as [number, number],
  centre: [0, 0] as [number, number],
  rotation: [0.1, 0, 0] as [number, number, number],
  visible: true as boolean,
};

type tSVGPathSelectionsCallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selections: d3.Selection<SVGPathElement, unknown, SVGElement, any>
) => void;

const InteractionAttrs = {
  onGetSelections: null as tSVGPathSelectionsCallback | null,
};

type tCallback = (position: [number, number]) => void;

const PositionAttrs = {
  active: false as boolean,
  mouseInside: false as boolean,
  mouseDown: false as boolean,
  mouseDownPosition: [0, 0] as [number, number],
  mouseDownOffset: [0, 0] as [number, number],
  onMouseEnter: null as tCallback | null,
  onMouseLeave: null as tCallback | null,
  onMouseDown: null as tCallback | null,
  onMouseUp: null as tCallback | null,
  onMouseMove: null as tCallback | null,
  onDrag: null as tCallback | null,
  onZoomOut: null as tCallback | null,
  onZoomIn: null as tCallback | null,
};

const PlotAttrs = {
  ...defaultPlotAttrs,
  ...MarkerAttrs,
  ...LayerAttrs,
  ...InteractionAttrs,
  ...PositionAttrs,
};

type tPlotAttrs = typeof PlotAttrs;
export type { tPlotAttrs, tFeatureCollection, tProjection };
export { PlotAttrs, Projections };
