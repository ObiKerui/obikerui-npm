import * as d3MapLib from '@obikerui/d3-map-lib';
import { create } from 'zustand';
import * as d3 from 'd3';

const DetailLevel = ['High Detail', 'Med Detail', 'Low Detail'] as const;
type tDetailLevelType = (typeof DetailLevel)[number];

type tHexmapModel = {
  html: HTMLDivElement | null;
  setHTML: (newValue: HTMLDivElement | null) => void;
  geojson: d3MapLib.tFeatureCollection | null;
  setGeojson: (newValue: d3MapLib.tFeatureCollection | null) => void;
  mapData: unknown[];
  setMapData: (newValue: unknown[]) => void;
  groupedByCoords: d3MapLib.tMapFeature[];
  setGroupedMetricByCoords: (newValue: d3MapLib.tMapFeature[]) => void;
  groupedByStates: d3MapLib.tMapFeature[];
  setGroupedMetricByStates: (newValue: d3MapLib.tMapFeature[]) => void;
  detailLevel: tDetailLevelType;
  setDetailLevel: (newValue: tDetailLevelType) => void;
};

const useHexmap = create<tHexmapModel>((set) => ({
  html: null,
  setHTML: (newValue) => set({ html: newValue }),
  geojson: null,
  setGeojson: (newValue) => set({ geojson: newValue }),
  mapData: [],
  setMapData: (newValue) => set({ mapData: newValue }),
  groupedByCoords: [],
  setGroupedMetricByCoords: (newValue) => set({ groupedByCoords: newValue }),
  groupedByStates: [],
  setGroupedMetricByStates: (newValue) => set({ groupedByStates: newValue }),
  detailLevel: 'High Detail' as tDetailLevelType,
  setDetailLevel: (newValue) => set({ detailLevel: newValue }),
}));

class HexbinMap {
  container: d3MapLib.BaseContainer;
  constructor() {
    this.container = new d3MapLib.BaseContainer();
    this.container.addPlot(new d3MapLib.CHexMask());
    this.container.addPlot(new d3MapLib.CHexLayer());
    this.container.addPlot(new d3MapLib.CMapLayer());
    this.container.update();
  }

  update(newModel: tHexmapModel) {
    const { container } = this;
    const { html, geojson, groupedByCoords, detailLevel } = newModel;

    const zoom = 500;
    const position: [number, number] = [350, 450];
    const rotation: [number, number, number] = [90, 0, 10];
    let hexRadius = 0;

    switch (detailLevel) {
      case 'High Detail':
        hexRadius = 3;
        break;
      case 'Med Detail':
        hexRadius = 8;
        break;
      case 'Low Detail':
        hexRadius = 13;
        break;
      default:
        hexRadius = 3;
    }

    container.attrs = {
      ...container.attrs,
      html,
    };

    const onComputeColourScale = (extent: [number, number]) => {
      const colorScale = d3
        .scaleSequential((t) => {
          const tNew = t ** 5;
          return d3.interpolateViridis(tNew);
          // return d3.interpolateInferno(tNew);
        })
        .domain([extent[1], 1]);

      return colorScale;
    };

    const onComputeBase = () =>
      d3.scaleSequential((t) => d3.interpolateViridis(t)).domain([100, 0]);

    const hexLayer = container.getPlots()[0];
    hexLayer.attrs = {
      ...hexLayer.attrs,
      projectionType: 'Albers',
      zoom,
      position,
      rotation,
      geojson,
      radius: hexRadius,
      onComputeColourScale: onComputeBase,
    };

    const testLayer = container.getPlots()[1];
    testLayer.attrs = {
      ...testLayer.attrs,
      projectionType: 'Albers',
      visible: true,
      zoom,
      position,
      rotation,
      geojson,
      mapFeatures: groupedByCoords,
      radius: hexRadius,
      onComputeColourScale,
    };

    const mapOutline = container.getPlots()[2];
    mapOutline.attrs = {
      ...mapOutline.attrs,
      projectionType: 'Albers',
      visible: false,
      zoom,
      position,
      rotation,
      geojson,
    };

    container.update();
  }
}

export { HexbinMap, useHexmap, DetailLevel };
