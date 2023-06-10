/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import AttrsGenerator from '../generators/attributeGenerator';
import { type tContainerAttrs } from '../container';

const plotAttributes = {
  plotID: null as string | null,
  index: 0,
  xs: [] as d3.AxisDomain[],
  ys: [] as d3.AxisDomain[] | d3.AxisDomain[][],
  alpha: 0,
  labels: [] as string[],
  colours: [] as string[],
};

const barsAttributes = {};

const publicAttributes = {
  ...plotAttributes,
  ...barsAttributes,
};

function BarChart() {
  let container: tContainerAttrs | null = null;
  const obj = rfdc()(publicAttributes);

  function buildContainerGroups(_container: tContainerAttrs) {
    const { svg } = _container;
    if (!svg) {
      return;
    }

    const chartGroup = svg.select('g.chart-group');
    const children = chartGroup.selectAll('*');
    const existingElements = children.filter(`g.${obj.plotID}`);

    if (existingElements.size() > 0) {
      return;
    }

    obj.index = children.size();
    obj.plotID = `plot-${obj.index}`;
    chartGroup.append('g').classed(`${obj.plotID}`, true);
  }

  function drawData(_container: tContainerAttrs) {
    const { ys, xs, alpha } = obj;
    const { xScale, yScale, chartHeight, svg } = _container;

    if (!svg || !xScale || !yScale) {
      return;
    }

    // check ys array is in correct format
    if (Array.isArray(ys)) {
      if (ys.length > 0 && Array.isArray(ys[0])) {
        return;
      }
    }

    const ysChecked = ys as d3.AxisDomain[];

    const xsValidated = Array.isArray(xs) ? xs : [];

    // alpha is currently an array and somehow works
    // probably could be modified so the array length = data array length

    const chartGroup = svg.select(`.${obj.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(xsValidated);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true) as any;

    // join the new data points with existing
    bars = bars.merge(enterGroup);

    // now position and colour what exists on the dom
    bars
      .attr('x', (x: d3.AxisDomain) => {
        const result = xScale(x);
        return result || null;
      })
      .attr('y', (_x: d3.AxisDomain, idx: number) => {
        const yValue = yScale(ysChecked[idx]);
        return yValue || null;
      })
      .attr('width', () => {
        const bandwidthFtn = xScale.bandwidth;
        return bandwidthFtn ? bandwidthFtn() : 0;
      })
      .attr('height', (_x: d3.AxisDomain, idx: number) => {
        const yValue = yScale(ysChecked[idx]);
        if (!yValue) return 0;
        const height = chartHeight - +yValue;
        return height;
      })
      .attr('fill', () => 'red')
      .style('opacity', alpha)
      .on('mouseover', function () {
        d3.select(this).style('cursor', 'pointer');
        // dispatcher.call('customMouseOver', this, d)
      })
      .on('mousemove', function () {
        d3.select(this).style('cursor', 'pointer');
        // dispatcher.call('customMouseMove', this, d)
      })
      .on('mouseout', () => {
        // dispatcher.call('customMouseOut', this, d)
      })
      .on('click', () => {
        // dispatcher.call('customMouseClick', this, d)
      });
  }

  function toExport(_container: tContainerAttrs) {
    container = _container;
    buildContainerGroups(container);
    drawData(container);
  }

  const chart: any = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.xs = attrsGen('xs');
  toExport.ys = attrsGen('ys');
  toExport.alpha = attrsGen('alpha');
  toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');

  return chart;
}

export { plotAttributes, barsAttributes, publicAttributes, BarChart };

export type tPlotAttrs = typeof plotAttributes;
export type tBarAttrs = typeof barsAttributes;
export type tPublicAttrs = typeof publicAttributes;
export type tBarChart = typeof BarChart;
