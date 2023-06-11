import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createPlot from './createPlot';

interface Props {
  data?: unknown[];
}

function BarPlot({ data }: Props): JSX.Element {
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
        <h3 id="bar-plot">Bar Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Bar plot is for rendering such n such. Good for which types of visual, bad for these
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

BarPlot.defaultProps = {
  data: [],
};

function BarPlotContainer(): JSX.Element {
  const [data, setData] = useState<number[][]>([]);

  useEffect(() => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8];
    const bars = [4, 5, 6, 6, 6, 7, 8, 9];
    const yLineData = [2, 5];

    const fetchData = async () => {
      console.log('fetching chart container data...');
      const receivedData = [xs, bars, yLineData];
      setData(receivedData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <BarPlot data={data} />;
  }
  return <div>loading...</div>;
}

export { createPlot, BarPlot, BarPlotContainer };
