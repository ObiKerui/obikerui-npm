// import { atom } from 'jotai';
import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tModel } from './Model';

// class HistogramGenerator {
//   binFtn: d3Array.HistogramGeneratorNumber<number, number> | null;
//   useDensity: boolean;

//   constructor() {
//     this.binFtn = d3Array.bin();
//     this.useDensity = false;
//   }

//   setDomain(dom: [number, number]) {
//     this.binFtn?.domain(dom);
//     return this;
//   }

//   setThresholds(ths: number) {
//     this.binFtn?.thresholds(ths);
//     return this;
//   }

//   setUseDensity(useDensity: boolean) {
//     this.useDensity = useDensity;
//   }

//   generateBins(values: number[]) {
//     console.log('bin ftn? ', this.binFtn, values);
//     const result = this.binFtn ? this.binFtn(values) : [];

//     return result;
//   }

//   getMaxLength(bins: d3Array.Bin<number, number>[]) {
//     const maxLength = d3Array.reduce(
//       bins,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (p: any, v: []) => (v.length > p ? v.length : p),
//       0
//     );
//     return maxLength;
//   }

//   getXDomain(bins: d3Array.Bin<number, number>[]) {
//     console.log('bins length: ', bins.length);
//     return ['a', 'b'];
//   }

//   getYDomain(
//     bins: d3Array.Bin<number, number>[],
//     normalise = false
//   ): [number, number] {
//     const maxLength = this.getMaxLength(bins);
//     const normaliser = normalise ? 1.0 / maxLength : 1.0;
//     return [0, maxLength * normaliser];
//   }
// }

// function createBars(
//   xScale: d3.ScaleLinear<number, number>,
//   bins: number,
//   ys: number[],
//   yScale: d3.ScaleLinear<number, number>
// ) {
//   const binFtn = d3Array
//     .bin()
//     .domain(xScale.domain() as [number, number])
//     .thresholds(bins);

//   const binObjs = binFtn(ys as unknown as ArrayLike<number>);

//   console.log('what are the bin objects? ', binObjs);

//   const maxLength = d3Array.reduce(
//     binObjs,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     (p: any, v: []) => (v.length > p ? v.length : p),
//     0
//   );

//   const normlise = true;
//   const normaliser = normlise ? 1.0 / maxLength : 1.0;
//   let maxHeight = maxLength;

//   console.log('max height / max length: ', maxLength);

//   const useDensity = true;
//   if (useDensity) {
//     let binWidth = 0;

//     if (binObjs.length > 0) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const firstBin: any = binObjs[0];
//       binWidth = firstBin.x1 - firstBin.x0;
//     }

//     maxHeight = maxLength / (ys.length * binWidth);
//   }

//   // const d3YScale = yScale as unknown as tD3Scale;

//   const currMaxHeight: number = yScale.domain()[1];
//   if (currMaxHeight < maxHeight) {
//     yScale.domain([0, maxHeight * normaliser]);
//   }

//   return binObjs;
// }

class Histogram {
  container: d3PlotLib.CContainer;
  generator: d3PlotLib.CBinGenerator;

  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CHistogram());
    this.container.addPlot(new d3PlotLib.CHistogram());
    this.container.addPlot(new d3PlotLib.CFillArea());
    this.container.addPlot(new d3PlotLib.CLines());

    this.generator = new d3PlotLib.CBinGenerator();
  }

  update(plotModel: tModel) {
    const { chartRef, xs, logMassA, logMassB, pdfNorm } = plotModel;
    const { generator } = this;

    const bins = generator
      .setDomain(d3.extent(logMassA))
      .setThresholds(100)
      .generateBins(logMassA);

    const yDomain = generator.getYDomain(bins) as [number, number];

    const binsB = generator
      .setDomain(d3.extent(logMassB))
      .setThresholds(100)
      .generateBins(logMassB);

    const bYDomain = generator.getYDomain(binsB) as [number, number];

    const totalDomain = d3.extent([...yDomain, ...bYDomain]) as [
      number,
      number
    ];

    const lineValues = bins.map(
      (elem: d3Array.Bin<number, number>) => elem.length
    );

    this.container.attrs = {
      ...this.container.attrs,
      html: chartRef,
      xAxisText: {
        ...this.container.attrs.xAxisText,
        rotation: 0,
        onRender: (d) => d,
      },
      onGetXScale: (chartWidth: number) =>
        d3
          .scaleLinear()
          .domain(d3.extent(xs) as [number, number])
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3
          .scaleLinear()
          .domain(d3.extent(totalDomain) as [number, number])
          .rangeRound([chartHeight, 0]),
    };

    const logMassABarPlot =
      this.container.getPlots()[0] as d3PlotLib.CHistogram;
    logMassABarPlot.histAttrs = {
      ...logMassABarPlot.histAttrs,
      bins,
      colour: 'blue',
      opacity: 0.5,
    } as d3PlotLib.CHistogram['histAttrs'];

    const logMassBBarPlot =
      this.container.getPlots()[1] as d3PlotLib.CHistogram;
    logMassBBarPlot.histAttrs = {
      ...logMassBBarPlot.attrs,
      bins: binsB,
      colour: 'red',
      opacity: 0.5,
    } as d3PlotLib.CHistogram['histAttrs'];

    // const fill = this.container.getPlots()[2] as d3PlotLib.CFillArea;
    // fill.attrs = {
    //   ...fill.attrs,
    //   ys: lineValues,
    //   where: (x: number) => x > 0.9 && x < 2,
    //   colour: 'red',
    //   opacity: 0.5,
    // } as d3PlotLib.tPlotAttrs;

    // const lines = this.container.getPlots()[3] as d3PlotLib.CLines;
    // lines.attrs = {
    //   ...lines.attrs,
    //   xs,
    //   ys: [lineValues],
    //   colour: 'red',
    //   opacity: 0.5,
    // } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Histogram };
