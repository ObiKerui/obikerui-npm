/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

const createPlot = (ref: HTMLDivElement, data: any) => {
  const bays = data?.bays;

  // function getXandYs(bayData: any) {
  //   const xs: number[] = [];
  //   const ys: number[] = [];
  //   bayData.forEach((element: any) => {
  //     const coords = element.coordinates;
  //     coords.forEach((coord: number[]) => {
  //       xs.push(coord[0]);
  //       ys.push(coord[1]);
  //     });
  //   });
  //   return { xs, ys };
  // }
  // const { xs, ys } = getXandYs(bays);

  // const scaler = d3PlotLib.Scaler();
  // scaler.xScaleCallback((_xs, chartWidth) => {
  //   const flatXs = _xs.flat() as number[];
  //   return d3
  //     .scaleLinear()
  //     .domain(flatXs)
  //     .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
  // });
  // scaler.yScaleCallback((_ys, chartHeight) => {
  //   const flatYs = _ys.flat() as number[];
  //   const extent = d3.extent(flatYs);

  //   if (!extent || !extent[1]) {
  //     throw new Error('cannot determine y range');
  //   }

  //   return d3
  //     .scaleLinear()
  //     .domain([0, +extent[1]])
  //     .rangeRound([chartHeight, 0]) as d3.AxisScale<d3.AxisDomain>;
  // });

  const baysCoords = d3PlotLib.Polygon().coordinates(bays);

  const container = d3PlotLib.Container().plot(baysCoords);

  d3.select(ref).call(container);

  return container;
};

interface IShapePlot {
  data: unknown;
}

function ShapePlot({ data }: IShapePlot) {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current && data) {
      // eslint-disable-next-line no-console
      createPlot(ref.current, data);
    }
    return () => {
      plotCreated.current = true;
    };
  }, [data]);

  return <div ref={ref}>plot</div>;
}

function ShapePlotContainer() {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      const jsonData = await d3.json('assets/bays.json');
      setData(jsonData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data) {
    return <ShapePlot data={data} />;
  }
  return <div>loading data...</div>;
}

export { createPlot, ShapePlot, ShapePlotContainer };
