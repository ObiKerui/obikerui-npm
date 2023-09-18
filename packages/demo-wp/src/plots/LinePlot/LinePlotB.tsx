/* eslint-disable no-use-before-define */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

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

  console.log('line plot b wat is data: ', xs, ys);

  const scaler = d3PlotLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat(2);
      const extent = d3.extent(flatXs as number[]);
      console.log('in xs what is extent of xs: ', extent, flatXs, _xs);

      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((_ys: d3.AxisDomain[][], chartHeight: number) => {
      const flatYs = _ys.flat() as number[];
      const extent = d3.extent(flatYs);

      console.log('in ys what is extent, flat and ys: ', extent, flatYs, _ys);

      if (!extent[0]) {
        return null;
      }

      return d3
        .scaleLinear()
        .domain([0, +extent[1] + 1])
        .rangeRound([chartHeight, 0]);
    });

  const lines = d3PlotLib //
    .Line()
    .xs(xs)
    // .alpha([0.8])
    .ys(ys)
    .labels(['Alpha', 'Beta', 'Charlie']);

  //   const yLines = demoChart.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(lines)
    .legend(legend);

  d3.select(ref).call(container);

  return container;
}

export { LinePlot as LinePlotB, LinePlotContainer as LinePlotContainerB };
