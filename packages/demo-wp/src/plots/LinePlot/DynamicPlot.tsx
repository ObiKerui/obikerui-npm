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
  const scaler = d3PlotLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat() as number[];
      const extent = verifyExtent(d3.extent(flatXs));
      return d3
        .scaleTime()
        .domain(extent)
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((_ys: d3.AxisDomain[][], chartHeight: number) => {
      const extent = verifyExtent(d3.extent(ys));
      return d3
        .scaleLinear()
        .domain([extent[0], 1])
        .rangeRound([chartHeight, 0]);
    });

  const plot1 = d3PlotLib.Line().xs(xs).ys([ys]).tag('plot1').labels(['Norm']);
  const plot2 = d3PlotLib.Line().xs(xs).ys([ys2]).tag('plot2').labels(['Skew']);

  const container = d3PlotLib
    .Container()
    .margin({ left: 50, right: 20, top: 10, bottom: 40 })
    .height(300)
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    .plot(vLine)
    .legend(d3PlotLib.Legend());

  d3.select(ref).call(container);

  return container;
}

async function createSecondaryLinePlot(
  ref: HTMLDivElement,
  primaryPlot: any,
  primRef: any
) {
  const scaler = d3PlotLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat() as number[];
      const extent = verifyExtent(d3.extent(flatXs));
      return d3
        .scaleTime()
        .domain(extent)
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((_ys: d3.AxisDomain[][], chartHeight: number) => {
      const extent = verifyExtent(d3.extent(ys));
      return d3
        .scaleLinear()
        .domain([extent[0], 1])
        .rangeRound([chartHeight, 0]) as d3.AxisScale<d3.AxisDomain>;
    });

  const plot1 = d3PlotLib.Line().xs(xs).ys([ys]).tag('plot1').labels('Norm');

  const plot2 = d3PlotLib.Line().xs(xs).ys([ys2]).tag('plot2').labels('Skew');

  // try to get the info before we create brush
  // const primaryScaler = primaryPlot.scale();
  // const someScale = d3.scaleTime().domain([0, 1]).rangeRound([0, 1]);
  // primaryScaler.xScaleCallback(() => d3.scaleTime().domain(someScale.domain()));
  // const whatisIt = d3.scaleLinear().domain([0, 1]).range([0, 1]);

  // function test(scale: d3.ScaleContinuousNumeric<number, number>) {
  //   return scale.invert(10);
  // }

  // test(whatisIt);

  // const star = dayjs('2020-01-01');
  // const end = dayjs('2020-12-01');
  // const whatisthat = d3.scaleTime().domain([star, end]).range([0, 1]);

  const brush = d3PlotLib.Brush().onChange((newScale: any) => {
    const localScaler = primaryPlot.scale();
    localScaler.xScaleCallback((_x: any, chartWidth: number) =>
      d3.scaleTime().domain(newScale.domain()).rangeRound([0, chartWidth])
    );
    primaryPlot(d3.select(primRef));
  });

  // let plot2 = d3PlotLib.Plot().tag('plot2').labels('SkewNorm')

  const container = d3PlotLib
    .Container()
    .margin({ left: 50, right: 20, top: 10, bottom: 60 })
    .height(200)
    .xAxisLabel('X Axis')
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    // .plot(vLine)
    .legend(brush);

  d3.select(ref).call(container);

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
      const pCurrRef = pRef.current;
      primaryPlotObj(d3.select(pCurrRef));
    }

    if (secondaryPlotObj) {
      const sCurrRef = sRef.current;
      secondaryPlotObj(d3.select(sCurrRef));
    }
  });

  function updatePlot() {
    if (primaryPlotObj) {
      const pCurrRef = pRef.current;
      primaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5]);

      primaryPlotObj(d3.select(pCurrRef));
    }

    if (secondaryPlotObj) {
      const sCurrRef = sRef.current;
      secondaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5]);

      secondaryPlotObj(d3.select(sCurrRef));
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
