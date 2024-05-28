import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createMap from './createMap';

interface Props {
  data?: unknown[];
}

function MapPlot({ data }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current && data) {
      // eslint-disable-next-line no-console
      createMap(ref.current).catch(console.error);
    }
    return () => {
      plotCreated.current = true;
    };
  }, [data]);

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Map Plot</h3>
        <div className="plot map--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Map plot is for rendering such n such. Good for which types of
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

MapPlot.defaultProps = {
  data: [],
};

function MapPlotContainer(): JSX.Element {
  const [data, setData] = useState<number[][]>([]);

  useEffect(() => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8];
    const bars = [4, 5, 6, 6, 6, 7, 8, 9];
    const yLineData = [2, 5];

    const fetchData = async () => {
      const receivedData = [xs, bars, yLineData];
      setData(receivedData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <MapPlot data={data} />;
  }
  return <div>loading...</div>;
}

export { createMap, MapPlot, MapPlotContainer };
