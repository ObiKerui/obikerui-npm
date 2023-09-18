import * as d3 from 'd3';
import * as d3SolarLib from '@obikerui/d3-solar-lib';
import * as d3PlotLib from '@obikerui/d3-plot-lib';

function createTimeLine(timeData: number[][], label: string, colour: string) {
  const timeLine = d3PlotLib
    .Line()
    .xs(timeData[0])
    .ys([timeData[1]])
    .labels([label])
    .colours([colour]);

  return timeLine;
}

function createDateLine(dateData: number[][], label: string, colour: string) {
  const line = d3PlotLib
    .Line()
    .xs(dateData[0])
    .ys([dateData[1]])
    .labels([label])
    .colours([colour]);
  return line;
}

export default async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const scaler = d3SolarLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat() as number[];
      const extent = d3.extent(flatXs);
      extent[1] = 350;
      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((_ys: d3.AxisDomain[][], chartHeight: number) => {
      const flatYs = _ys.flat() as number[];
      const extent = d3.extent(flatYs);

      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([chartHeight, 0]);
    });

  // const legend = d3SolarLib.Legend();
  const dateData = data[0] as unknown[];
  const timeData = data[1] as unknown[];

  const line0 = createDateLine(dateData[0] as number[][], 'dec', 'blue');
  const line1 = createDateLine(dateData[1] as number[][], 'jan', 'green');
  const line2 = createDateLine(dateData[2] as number[][], 'feb', 'yellow');
  const line3 = createDateLine(dateData[3] as number[][], 'mar', 'red');
  const line4 = createDateLine(dateData[4] as number[][], 'apr', 'orange');
  const line5 = createDateLine(dateData[5] as number[][], 'may', 'black');

  const eightTime = createTimeLine(timeData[0] as number[][], '8am', 'grey');
  const nineTime = createTimeLine(timeData[1] as number[][], '8am', 'grey');
  const tenTime = createTimeLine(timeData[2] as number[][], '9am', 'grey');
  const elevTime = createTimeLine(timeData[3] as number[][], '10am', 'grey');
  const noonTime = createTimeLine(timeData[4] as number[][], '11am', 'grey');
  const thirtTime = createTimeLine(timeData[5] as number[][], 'noon', 'grey');
  const fourtTime = createTimeLine(timeData[6] as number[][], '1pm', 'grey');
  const fiftTime = createTimeLine(timeData[7] as number[][], '2pm', 'grey');
  const sixtTime = createTimeLine(timeData[8] as number[][], '3pm', 'grey');

  const noonLine = d3PlotLib.AxLine().xs([180]).lineStyles(['--']).alpha([1]);

  const dataJune = dateData[6] as number[][];
  const line6 = d3PlotLib
    .Line()
    .xs(dataJune[0])
    .ys([dataJune[1]])
    .labels(['june'])
    .colours(['purple']);

  const container = d3SolarLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(line0)
    .plot(line1)
    .plot(line2)
    .plot(line3)
    .plot(line4)
    .plot(line5)
    .plot(line6)
    .plot(eightTime)
    .plot(nineTime)
    .plot(tenTime)
    .plot(elevTime)
    .plot(noonTime)
    .plot(thirtTime)
    .plot(fourtTime)
    .plot(fiftTime)
    .plot(sixtTime)
    .plot(noonLine);
  // .legend(legend);

  d3.select(ref).call(container);

  return container;
}
