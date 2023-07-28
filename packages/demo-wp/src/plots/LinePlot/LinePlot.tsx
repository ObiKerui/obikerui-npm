// import * as d3 from 'd3';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createPlot from './createPlot';

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
          <p>
            Scatter plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
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

function LinePlotContainer(): JSX.Element {
  const [data, setData] = useState<unknown[]>([]);
  const xs = [1, 2, 4, 4.1, 5];
  const ys1 = [4, 5, 6, 6, 8];
  const ys2 = [2, 3, 1, 2, 3];
  const ys3 = [4, 5, 2, 1, 1];

  useEffect(() => {
    const fetchData = async () => {
      const receivedData = [xs, [ys1, ys2, ys3]];
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

export { createPlot, LinePlot, LinePlotContainer };
