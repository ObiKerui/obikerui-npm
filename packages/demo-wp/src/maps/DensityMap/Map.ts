import * as d3MapLib from '@obikerui/d3-map-lib';
import { create } from 'zustand';

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

type tMapModel = {
  html: HTMLDivElement | null;
  setHTML: (newHTML: HTMLDivElement | null) => void;
  zoom: number;
  setZoom: (newZoom: number) => void;
  translate: [number, number];
  setTranslate: (newTranslate: [number, number]) => void;
  projection: keyof typeof Projections;
  setProjection: (newProjection: keyof typeof Projections) => void;
  statesGeojson: unknown;
  setStatesGeojson: (newValue: unknown) => void;
  reposition: boolean;
  setReposition: (newValue: boolean) => void;
};

const useDensityMap = create<tMapModel>((set) => ({
  html: null,
  setHTML: (newHTML) => set({ html: newHTML }),
  zoom: 140,
  setZoom: (newZoom) => set({ zoom: newZoom }),
  translate: [450, 250] as [number, number],
  setTranslate: (newTranslate) => set({ translate: newTranslate }),
  projection: 'Mercator' as keyof typeof Projections,
  setProjection: (newProjection) => set({ projection: newProjection }),
  statesGeojson: null,
  setStatesGeojson: (newValue) => set({ statesGeojson: newValue }),
  reposition: false,
  setReposition: (newValue) => set({ reposition: newValue }),
}));

type tFeatureCollection = {
  type: string;
  features: unknown[];
};

class DensityMap {
  container: d3MapLib.BaseContainer;

  constructor() {
    this.container = new d3MapLib.BaseContainer();
    this.container.addPlot(new d3MapLib.CMapLayer());
    this.container.addPlot(new d3MapLib.CPosition());

    this.container.attrs = {
      ...this.container.attrs,
    };
    this.container.update();
  }

  // update(model: tModel) {
  update(model: tMapModel) {
    const { statesGeojson, html, zoom, translate, projection, reposition } =
      model;
    const { container } = this;

    let mapData = {
      type: 'FeatureCollection',
      features: [] as unknown[],
    } as tFeatureCollection;

    if (statesGeojson) {
      mapData = statesGeojson as tFeatureCollection;
    }

    const states = this.container.getPlots()[0];
    states.attrs = {
      ...states.attrs,
      zoom,
      position: translate,
      geojson: mapData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projectionType: projection as any,
      style: 'stroke: Orange; stroke-width: 1px; fill-opacity: .1; fill: blue;',
      onMouseDown: (pos) => {
        states.attrs.mouseDownOffset = pos;
        states.attrs.mouseDownPosition = states.attrs.position;
      },
      onDrag: (pos) => {
        const offset = states.attrs.mouseDownOffset;
        const oldPosition = states.attrs.mouseDownPosition;

        const offsetX = pos[0] - offset[0];
        const offsetY = pos[1] - offset[1];

        const newPosX = oldPosition[0] + offsetX;
        const newPosY = oldPosition[1] + offsetY;

        container.update();
        const { setTranslate } = useDensityMap.getState();
        setTranslate([newPosX, newPosY]);
      },
    };

    const positionLayer = this.container.getPlots()[1];
    positionLayer.attrs = {
      ...positionLayer.attrs,
      active: reposition,
      onMouseDown: (pos) => {
        if (states.attrs.onMouseDown) states.attrs.onMouseDown(pos);
      },
      onDrag: (pos) => {
        if (states.attrs.onDrag) states.attrs.onDrag(pos);
      },
      onZoomIn: () => {
        states.attrs.zoom += 1;
        container.update();

        const { setZoom } = useDensityMap.getState();
        setZoom(states.attrs.zoom);
      },
      onZoomOut: () => {
        states.attrs.zoom -= 1;
        container.update();

        const { setZoom } = useDensityMap.getState();
        setZoom(states.attrs.zoom);
      },
    };

    const updatedAttrs = {
      ...this.container.attrs,
      html,
      chartWidth: 1000,
      chartHeight: 500,
      margins: {
        ...this.container.attrs.margins,
        left: 10,
        top: 10,
      },
    } as d3MapLib.tContainerAttrs;
    // eslint-disable-next-line no-param-reassign
    this.container.attrs = updatedAttrs;
    this.container.update();
  }
}

const densityMapObj = new DensityMap();

// Subscribe to store updates
// const unsubscribe = useMapProperties.subscribe((newState) => {
//   // console.log('State changed:', prevState, '->', newState);
//   densityMapObj.update(newState);
// });

// Subscribe to store updates
useDensityMap.subscribe((newState) => {
  densityMapObj.update(newState);
});

export { Projections, DensityMap, useDensityMap };
