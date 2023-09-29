/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';
import * as SolarLib from '@obikerui/d3-solar-lib';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { useLayoutEffect, useRef } from 'react';

/**
 * Analemma Plot Container
 */
function AnalemmaPlotContainer(): JSX.Element {
  return <AnalemmaPlot />;
}

/**
 * Analemma Plot
 */
function AnalemmaPlot(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current) {
      // eslint-disable-next-line no-console
      createPlot(ref.current).catch(console.error);
    }
    return () => {
      plotCreated.current = true;
    };
  }, []);

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Analemma Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Scatter plot is for rendering such n such. Good for which types of
            visual, bad for these others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  );
}

/**
 * Analemma Plot Props
 */
AnalemmaPlot.defaultProps = {
  data: [],
};

/**
 * Code to create the d3PlotLib Plot
 */
async function createPlot(ref: HTMLDivElement) {
  const location = [1, 51.49];

  // const solarDataGen = SolarLib.SolarDataGenerator()
  // .location(location)
  // .positionGenerator(SolarLib.SunPos900)
  // .yearDataGenerator(SolarLib.YearDataGenerator)
  // .analemmaGenerator(SolarLib.AnalemmaGenerator)
  // .sunpathGenerator(SolarLib.SunPathGenerator)
  // .shadeRegionGenerator(SolarLib.ShadeRegionGenerator)

  // solarDataGen();

  // const analemmaData = solarDataGen.analemma(4, 20)
  // analemmaData.xs();
  // analemmaData.ys();

  // const sunPathGen = solarDataGen.sunpath()
  // sunPathGen(WinterSolstice).xs().ys();
  // sunPathGen(SolarTwin).xs();
  // sunPathGen(SolarTwin).ys();
  // sunPathGen(SummerSolstice).xs().ys();

  const yearDataGen = SolarLib.YearDataGenerator()
    .location(location)
    .positionGenerator(SolarLib.SunPos900);

  yearDataGen();

  const analemmaXs = [];
  const analemmaYs = [];

  const analemma = SolarLib.AnalemmaGenerator()
    .yearData(yearDataGen.data())
    .hour(4);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(5);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(6);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(7);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(8);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(9);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(10);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(11);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(12);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(13);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(14);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(15);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(16);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(17);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(18);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(19);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  analemma.hour(20);
  analemma();
  analemmaXs.push(analemma.xsMerged());
  analemmaYs.push(analemma.ysMerged());

  const analemmaLines = d3PlotLib
    .Line()
    .xs(analemmaXs)
    .ys(analemmaYs)
    .labels(['8pm', '9am', '10am', '11am', 'noon', '1', '2']);

  const sunPathsXs = [];
  const sunPathsYs = [];

  const sunPath = SolarLib.SunPathGenerator()
    .yearData(yearDataGen.data())
    .period(SolarLib.AllPeriods.Dec);

  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.JanNov);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.FebOct);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.MarSept);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.AprAug);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.MayJul);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  sunPath.period(SolarLib.AllPeriods.Jun);
  sunPath();
  sunPathsXs.push(sunPath.xs());
  sunPathsYs.push(sunPath.ys());

  const sunpathLines = d3PlotLib
    .Line()
    .xs(sunPathsXs)
    .ys(sunPathsYs)
    .labels(['december', 'january', 'feb', 'mar']);

  const shadeRegionGenerator = SolarLib.ShadeRegionGenerator()
    .sunpathXs(sunPathsXs)
    .sunpathYs(sunPathsYs);

  shadeRegionGenerator();

  const legend = SolarLib.Legend();

  let mouseDown = false;

  function toggleColour(polygon: any) {
    const currColour = polygon.attr('fill');
    let newColour = 'white';
    if (currColour === 'white') {
      newColour = 'red';
    } else {
      newColour = 'white';
    }
    polygon.attr('fill', newColour);
  }

  const shadeRegions = d3PlotLib
    .Interactor()
    .data(shadeRegionGenerator.data())
    .onClick(() => {})
    .onEnter((_d: unknown, i: number, node: any) => {
      if (mouseDown) {
        const polygon = d3.select(node[i]);
        toggleColour(polygon);
      }
    })
    .onMove((_d: unknown, i: number, node: any) => {
      const polygon = d3.select(node[i]);
      // let colour = polygon.attr('fill');

      // if (mouseDown) {
      //   colour = colour === 'white' ? 'red' : 'white';
      // }

      // polygon.attr('fill', colour);
    })
    .onMouseDown((_d: unknown, i: number, node: any) => {
      mouseDown = true;
      const polygon = d3.select(node[i]);
      toggleColour(polygon);
    })
    .onMouseUp(() => {
      mouseDown = false;
      // const polygon = d3.select(node[i]);
      // polygon.attr('fill', 'black');
    });

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    // .scale(scaler)
    .plot(analemmaLines)
    .plot(sunpathLines)
    .plot(shadeRegions)
    .legend(legend)
    .onGetXScale((chartWidth: number) =>
      d3.scaleLinear().domain([0, 350]).rangeRound([0, chartWidth])
    )
    .onGetYScale((chartHeight: number) =>
      d3.scaleLinear().domain([-0.1, 1.2]).rangeRound([chartHeight, 0])
    );

  d3.select(ref).call(container);

  return container;
}

export { AnalemmaPlot, AnalemmaPlotContainer, createPlot };
