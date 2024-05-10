import * as d3 from 'd3';
import * as d3Array from 'd3-array';

function linspace(from: number, stop: number, len: number) {
  const multiplier = (stop - from) / len;
  const arr = d3.range(from, stop, multiplier);
  return arr;
}

function noise(from: number, stop: number, len: number) {
  const multiplier = (stop - from) / len;
  const arr = d3.range(from, stop, multiplier);
  const noisy = arr.map((elem: number) =>
    d3.randomUniform(elem - 0.05, elem + 0.05)()
  );
  return noisy;
}

function mean(arr: number[]) {
  return d3.mean(arr);
}

function std(arr: number[]) {
  return d3.deviation(arr);
}

function randomNormal(mu: number, sigma: number, len: number) {
  const ftn = d3.randomNormal(mu, sigma);
  const arr = Array.from({ length: len }, () => ftn());
  return arr;
}

function histogram(arr: number[], bins: number) {
  const extents = d3.extent(arr) as [number, number];
  const range = extents[1] - extents[0];
  const binSize = range / bins;
  const binFtn = d3Array.bin().thresholds(bins);
  const results = binFtn(arr);
}

function pdf(xs: number[], _mean: number, _std: number): number[] {
  const fnorm = (x: number) =>
    (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2);
  const result = xs.map((elem: number) => fnorm(elem));
  // var y = new Array()
  // for (var i = 0 ; i < x.length ; i++) {
  //     y[i] = fnorm(x[i])
  // }
  return result;
}

export { linspace, noise, mean, std, randomNormal, histogram, pdf };
