import * as d3 from 'd3';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createPlot from './createPlot';

const np = {
  linspace(from: number, stop: number, len: number) {
    const multiplier = (stop - from) / len;
    const arr = d3.range(from, stop, multiplier);
    return arr;
  },

  mean(arr: ArrayLike<d3.Numeric>) {
    return d3.mean(arr);
  },

  std(arr: ArrayLike<d3.Numeric>) {
    return d3.deviation(arr);
  },

  random_normal(mu: number, sigma: number, len: number) {
    const ftn = d3.randomNormal(mu, sigma);
    const arr = Array.from({ length: len }, () => ftn());
    return arr;
  },
};

interface Props {
  data?: unknown[];
}

function ScatterPlot({ data }: Props): JSX.Element {
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

ScatterPlot.defaultProps = {
  data: [],
};

function ScatterPlotContainer(): JSX.Element {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const csvresult = await d3.csv('assets/iris.csv');
      const xs = np.linspace(0, 160, 160);
      const keys = Object.keys(csvresult[0]);
      const obj: any = keys.reduce(
        (accumulator, value) => ({ ...accumulator, [value]: [] }),
        {}
      );

      csvresult.forEach((elem: { [x: string]: any }) => {
        keys.forEach((e) => {
          obj[e].push(+elem[e]);
        });
        return elem;
      });

      const ys = Object.values(obj);

      const receivedData = [xs, ys, keys];
      setData(receivedData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    console.log('data for scatter plot: ', data);
    return <ScatterPlot data={data} />;
  }
  return <div>loading...</div>;
}

export { createPlot, ScatterPlot, ScatterPlotContainer };
