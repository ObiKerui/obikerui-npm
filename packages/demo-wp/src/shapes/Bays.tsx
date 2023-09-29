/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

type tData = {
  name: string;
  coordinates: number[][][];
};

const createPlot = (ref: HTMLDivElement, data: any, width: number) => {
  const bays = data?.bays as tData[];

  const baysCoords = d3PlotLib
    .Polygon()
    .coordinates(bays)
    .onMouseDown((d: any) => {
      console.log('mouse down event happened! ', d);
    });

  const bayText = d3PlotLib
    .TextPlot()
    .coordinates(bays)
    .onGetCoordinates((d: tData) => d.coordinates[0])
    .onGetText((d: tData) => d.name);

  const container = d3PlotLib
    .Container()
    .width(width)
    .plot(baysCoords)
    .plot(bayText)
    .onGetXScale((chartWidth: number) =>
      d3.scaleLinear().domain([0, 100]).range([0, chartWidth])
    )
    .onGetYScale((chartHeight: number) =>
      d3.scaleLinear().domain([0, 100]).range([0, chartHeight])
    );

  d3.select(ref).call(container);

  return container;
};

interface IShapePlot {
  data: unknown;
  width: number;
}

function BayPlot({ data, width }: IShapePlot) {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current && data) {
      // eslint-disable-next-line no-console
      createPlot(ref.current, data, width);
    }
    return () => {
      plotCreated.current = true;
    };
  }, [data]);

  return <div ref={ref} />;
}

export default BayPlot;
