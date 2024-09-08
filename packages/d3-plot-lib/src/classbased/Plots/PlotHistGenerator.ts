import * as d3Array from 'd3-array';

class PlotHistGenerator {
  binFtn: d3Array.HistogramGeneratorNumber<number, number> | null;

  useDensity: boolean;

  constructor() {
    this.binFtn = d3Array.bin();
    this.useDensity = false;
  }

  setDomain(dom: [number, number]) {
    this.binFtn?.domain(dom);
    return this;
  }

  setThresholds(ths: number) {
    this.binFtn?.thresholds(ths);
    return this;
  }

  setUseDensity(useDensity: boolean) {
    this.useDensity = useDensity;
  }

  generateBins(values: number[]) {
    const result = this.binFtn ? this.binFtn(values) : [];
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  getMaxLength(bins: d3Array.Bin<number, number>[]) {
    if (bins.length === 0) {
      return 0;
    }
    const maxLength = d3Array.reduce(
      bins,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any, v: []) => (v.length > p ? v.length : p),
      0
    );
    return maxLength;
  }

  //   getXDomain(bins: d3Array.Bin<number, number>[]) {
  //     return ['a', 'b'];
  //   }

  getYDomain(
    bins: d3Array.Bin<number, number>[],
    normalise = false
  ): [number, number] {
    let maxLength = this.getMaxLength(bins);
    maxLength = maxLength === 0 ? 1 : maxLength;
    const normaliser = normalise ? 1.0 / maxLength : 1.0;
    return [0, maxLength * normaliser];
  }
}

export { PlotHistGenerator };
