import * as d3MapLib from '@obikerui/d3-map-lib';
import * as d3 from 'd3';
import { create } from 'zustand';

const Metrics = ['unemployment'] as const;
const Groupings = ['By State', 'By County'] as const;

type tMapModel = {
  html: HTMLDivElement | null;
  setHTML: (newHTML: HTMLDivElement | null) => void;
  zoom: number;
  setZoom: (newZoom: number) => void;
  translate: [number, number];
  setTranslate: (newTranslate: [number, number]) => void;
  metric: keyof typeof Metrics;
  setMetric: (newValue: keyof typeof Metrics) => void;
  grouping: keyof typeof Groupings;
  setGrouping: (newValue: keyof typeof Groupings) => void;
  statesGeojson: unknown;
  setStatesGeojson: (newValue: unknown) => void;
  unemploymentCSV: unknown;
  setUnemploymentCSV: (newValue: unknown) => void;
  countiesGeojson: unknown;
  setCountiesGeojson: (newValue: unknown) => void;
  groupedMetricByCounties: Map<string, number>;
  setGroupedMetricByCounties: (newValue: Map<string, number>) => void;
  groupedMetricByStates: Map<string, number>;
  setGroupedMetricByStates: (newValue: Map<string, number>) => void;
};

const useDensityMap = create<tMapModel>((set) => ({
  html: null,
  setHTML: (newHTML) => set({ html: newHTML }),
  zoom: 430,
  setZoom: (newZoom) => set({ zoom: newZoom }),
  translate: [1000, 460] as [number, number],
  setTranslate: (newTranslate) => set({ translate: newTranslate }),
  metric: 'unemployment' as keyof typeof Metrics,
  setMetric: (newValue) => set({ metric: newValue }),
  grouping: 'By County' as keyof typeof Groupings,
  setGrouping: (newValue) => set({ grouping: newValue }),
  statesGeojson: null,
  setStatesGeojson: (newValue) => set({ statesGeojson: newValue }),
  unemploymentCSV: null,
  setUnemploymentCSV: (newValue) => set({ unemploymentCSV: newValue }),
  countiesGeojson: null,
  setCountiesGeojson: (newValue) => set({ countiesGeojson: newValue }),
  groupedMetricByCounties: new Map<string, number>(),
  setGroupedMetricByCounties: (newValue: Map<string, number>) =>
    set({ groupedMetricByCounties: newValue }),
  groupedMetricByStates: new Map<string, number>(),
  setGroupedMetricByStates: (newValue: Map<string, number>) =>
    set({ groupedMetricByStates: newValue }),
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
    this.container.addPlot(new d3MapLib.CMapLayer());

    this.container.attrs = {
      ...this.container.attrs,
    };
    this.container.update();
  }

  computeMinMaxRate(groupedData: Map<string, number>) {
    const extentRate = d3.extent(Array.from(groupedData.values()));
    return [extentRate[0] ?? 0, extentRate[1] ?? 0] as [number, number];
  }

  getColourScale(minMax: [number, number]) {
    const colorScale = d3
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .scaleSequential((t: any) =>
        // return d3.interpolateViridis(t)
        d3.interpolateReds(t)
      )
      .domain(minMax);

    return colorScale;
  }

  getCountyMetric(dataPoint: unknown, groupedData: Map<string, number>) {
    const dpoint = dataPoint as {
      properties: {
        GEOID: string;
      };
    };
    return groupedData.get(dpoint.properties.GEOID);
  }

  getStateMetric(dataPoint: unknown, groupedData: Map<string, number>) {
    const dpoint = dataPoint as {
      properties: {
        name: string;
      };
    };
    return groupedData.get(dpoint.properties.name);
  }

  update(model: tMapModel) {
    const {
      statesGeojson,
      countiesGeojson,
      html,
      zoom,
      translate,
      groupedMetricByStates,
      groupedMetricByCounties,
      grouping,
    } = model;
    const { container, getCountyMetric, getStateMetric } = this;

    let mapData = {
      type: 'FeatureCollection',
      features: [] as unknown[],
    } as tFeatureCollection;

    if (statesGeojson) {
      mapData = statesGeojson as tFeatureCollection;
    }

    let countyData = {
      type: 'FeatureCollection',
      features: [] as unknown[],
    } as tFeatureCollection;

    if (countiesGeojson) {
      countyData = countiesGeojson as tFeatureCollection;
    }

    const countyMinMax = this.computeMinMaxRate(groupedMetricByCounties);
    const countyColourScale = this.getColourScale(countyMinMax);

    const stateMinMax = this.computeMinMaxRate(groupedMetricByStates);
    const stateColourScale = this.getColourScale(stateMinMax);

    const states = container.getPlots()[0];
    states.attrs = {
      ...states.attrs,
      zoom,
      position: translate,
      geojson: mapData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projectionType: 'Mercator' as any,
      onGetSelections: (selections) => {
        selections.style('fill', (data) => {
          const value = getStateMetric(data, groupedMetricByStates);
          const colour = stateColourScale(value as unknown as number);
          return colour ?? 'none';
        });
      },
    };

    const counties = container.getPlots()[1];
    counties.attrs = {
      ...counties.attrs,
      zoom,
      position: translate,
      geojson: countyData,
      visible: grouping === ('By County' as keyof typeof Groupings),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projectionType: 'Mercator' as any,
      onGetSelections: (selections) => {
        selections
          .style('fill', (data) => {
            const value = getCountyMetric(data, groupedMetricByCounties);
            const colour = countyColourScale(value as unknown as number);
            return colour ?? 'none';
          })
          .style('stroke', 'none');
      },
    };

    const updatedAttrs = {
      ...container.attrs,
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
useDensityMap.subscribe((newState) => {
  densityMapObj.update(newState);
});

export { Metrics, Groupings, DensityMap, useDensityMap };
