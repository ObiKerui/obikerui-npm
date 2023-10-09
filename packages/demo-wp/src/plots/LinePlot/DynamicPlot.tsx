/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import dayjs from 'dayjs';
import { useRef } from 'react';
import NumpyClone from '../../Utils/NumpyClone';
import useCreatePlot from '../../Utils/UseCreatePlot';
import useResize from '../../Utils/UseResize';

function verifyExtent(extent: [undefined, undefined] | [number, number]) {
  if (!extent[0] || !extent[1]) {
    throw Error('Undefined Extent');
  }
  return extent;
}

function getDates(startDate: any, stopDate: any) {
  const dateArray = [];
  let currentDate = dayjs(startDate);
  const stopDateM = dayjs(stopDate);
  while (currentDate <= stopDateM) {
    const momentDate = dayjs(currentDate).format('YYYY-MM-DD');
    const jsDate = new Date(momentDate);
    dateArray.push(jsDate);
    currentDate = dayjs(currentDate).add(1, 'days');
  }
  return dateArray;
}

const xs = getDates('2020-01-01', '2020-12-31');
const ys = NumpyClone.noise(0, 0.5, xs.length);
const ys2 = NumpyClone.noise(0.5, 0.6, xs.length);

const vLine = d3PlotLib
  .AxLine()
  .xs([xs[15], xs[20], xs[23], xs[30]])
  .labels(['Cut Off'])
  .alpha(0.5)
  .lineStyles(['--']);

async function createPrimaryLinePlot(ref: HTMLDivElement) {
  const plot1 = d3PlotLib.Line().xs(xs).ys([ys]).tag('plot1').labels(['Norm']);
  const plot2 = d3PlotLib.Line().xs(xs).ys([ys2]).tag('plot2').labels(['Skew']);

  const container = d3PlotLib
    .Container()
    .margins({ left: 50, right: 20, top: 10, bottom: 40 })
    .height(300)
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .plot(plot1)
    .plot(plot2)
    .plot(vLine)
    .legend(d3PlotLib.Legend())
    .onGetXScale((chartWidth: number) => {
      const extent = d3.extent(xs) as [Date, Date];
      return d3.scaleTime().domain(extent).rangeRound([0, chartWidth]);
    })
    .onGetYScale((chartHeight: number) => {
      const extent = d3.extent(ys) as [number, number];
      return d3
        .scaleLinear()
        .domain([extent[0], 1])
        .rangeRound([chartHeight, 0]);
    })
    .html(ref);

  container();

  return container;
}

async function createSecondaryLinePlot(
  ref: HTMLDivElement,
  primaryPlot: any,
  primRef: any
) {
  const plot1 = d3PlotLib.Line().xs(xs).ys([ys]).tag('plot1').labels('Norm');
  const plot2 = d3PlotLib.Line().xs(xs).ys([ys2]).tag('plot2').labels('Skew');

  // function test(scale: d3.ScaleContinuousNumeric<number, number>) {
  //   return scale.invert(10);
  // }

  const brush = d3PlotLib.Brush().onChange((newScale: any) => {
    primaryPlot.onGetXScale((chartWidth: number) =>
      d3.scaleTime().domain(newScale.domain()).rangeRound([0, chartWidth])
    );
    primaryPlot(d3.select(primRef));
  });

  // let plot2 = d3PlotLib.Plot().tag('plot2').labels('SkewNorm')

  const container = d3PlotLib
    .Container()
    .margins({ left: 50, right: 20, top: 10, bottom: 60 })
    .height(200)
    .xAxisLabel('X Axis')
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .plot(plot1)
    .plot(plot2)
    .legend(brush)
    .onGetXScale((chartWidth: number) => {
      const extent = d3.extent(xs) as [Date, Date];
      return d3.scaleTime().domain(extent).rangeRound([0, chartWidth]);
    })
    .onGetYScale((chartHeight: number) => {
      const extent = d3.extent(ys) as [number, number];
      return d3
        .scaleLinear()
        .domain([extent[0], 1])
        .rangeRound([chartHeight, 0]) as d3.AxisScale<d3.AxisDomain>;
    })
    .html(ref);

  container();

  return container;
}

export default function () {
  const pRef = useRef(null);
  let primaryPlotObj: any = null;

  const sRef = useRef(null);
  let secondaryPlotObj: any = null;

  useCreatePlot(async () => {
    const pCurrRef = pRef.current;
    if (pCurrRef) {
      const pObj = await createPrimaryLinePlot(pCurrRef);
      primaryPlotObj = pObj;
    }

    const sCurrRef = sRef.current;
    if (sCurrRef) {
      const sObj = await createSecondaryLinePlot(
        sCurrRef,
        primaryPlotObj,
        pCurrRef
      );
      secondaryPlotObj = sObj;
    }
  });

  useResize(() => {
    if (primaryPlotObj) {
      primaryPlotObj();
    }

    if (secondaryPlotObj) {
      secondaryPlotObj();
    }
  });

  function updatePlot() {
    if (primaryPlotObj) {
      primaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5]);
      primaryPlotObj();
    }

    if (secondaryPlotObj) {
      secondaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5]);
      secondaryPlotObj();
    }
  }

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="dynamic-line-plot">Dynamic Line Plot</h3>
        <div className="plot--controls">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => updatePlot()}
          >
            Update Me!
          </button>
        </div>
        <div
          className="plot plot--area"
          style={{ paddingBottom: 0 }}
          ref={pRef}
        />
        <div className="plot plot--area" style={{ paddingTop: 0 }} ref={sRef} />
        <div className="plot plot--description">
          <p>
            Dynamic Line plot is for rendering such n such. Good for which types
            of visual, bad for these others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  );
}
