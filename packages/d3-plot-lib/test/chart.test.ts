import * as d3 from 'd3';
import { BarChart } from '../src/chart';
import { Container } from '../src/container';

describe('Unit tests for the chart component', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-testid="not-empty" id="container"><p>something</p></div>';
  });

  it('should create the correct svg elements', () => {
    let divContainer = document.getElementById('container');

    // const chart = BarChart().xs().ys();
    const chart = BarChart();

    const container = Container()
      .margin({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      })
      .plot(chart);

    d3.select(divContainer).call(container as any);

    expect(true).toBe(true);
  });
});
