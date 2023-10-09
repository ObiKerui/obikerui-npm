/* eslint-disable no-use-before-define */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flatten } from '../../Utils/Utils';

function LinePlotContainer(): JSX.Element {
  const [data, setData] = useState<unknown[]>([]);

  const xs1 = [1, 2, 4, 4.1, 5];
  const xs2 = [1, 2, 4, 4.1, 5];
  const xs3 = [3, 4, 5, 5.1, 10];

  const ys1 = [4, 5, 6, 6, 8];
  const ys2 = [2, 3, 1, 2, 3];
  const ys3 = [4, 5, 2, 1, 1];

  useEffect(() => {
    const fetchData = async () => {
      const receivedData = [
        [xs1, xs2, xs3],
        [ys1, ys2, ys3],
      ];
      setData(receivedData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <LinePlot data={data} />;
  }
  return <div>loading...</div>;
}

interface Props {
  data?: unknown[];
}

function LinePlot({ data }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current && data) {
      // eslint-disable-next-line no-console
      createPlot(ref.current, data).catch(console.error);
    }
    return () => {
      plotCreated.current = true;
    };
  }, [data]);

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Scatter Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>Demo Line plot where xs and ys are in arrays</p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  );
}

LinePlot.defaultProps = {
  data: [],
};

async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, ys] = data;
  console.log('what was passed as xs? ', xs);

  const lines = d3PlotLib //
    .Line()
    .xs(xs)
    .ys(ys)
    .labels(['Alpha', 'Beta', 'Charlie']);

  //   const yLines = demoChart.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .plot(lines)
    .legend(legend)
    .onGetXScale((chartWidth: number) => {
      const extent = d3.extent(flatten(xs as number[][])) as [number, number];
      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([0, chartWidth]);
    })
    .onGetYScale((chartHeight: number) => {
      const extent = d3.extent(flatten(ys as number[][])) as [number, number];
      return d3
        .scaleLinear()
        .domain([0, +extent[1] + 1])
        .rangeRound([chartHeight, 0]);
    })
    .html(ref);

  container();

  return container;
}

export { LinePlot as LinePlotB, LinePlotContainer as LinePlotContainerB };
