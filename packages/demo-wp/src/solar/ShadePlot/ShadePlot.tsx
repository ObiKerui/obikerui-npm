import * as d3 from 'd3';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createPlot from './createPlot';
import createChartData from './createChartData';

createChartData();

interface Props {
  data?: unknown[];
}

function ShadePlot({ data }: Props): JSX.Element {
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
        <h3 id="bar-plot">Shade Plot</h3>
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

ShadePlot.defaultProps = {
  data: [],
};

function ShadePlotContainer(): JSX.Element {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const lineData = createChartData();
      // console.log('result of solar 900: ', lineData);
      setData(lineData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <ShadePlot data={data} />;
  }
  return <div>loading...</div>;
}

export { ShadePlot, ShadePlotContainer, createPlot };
