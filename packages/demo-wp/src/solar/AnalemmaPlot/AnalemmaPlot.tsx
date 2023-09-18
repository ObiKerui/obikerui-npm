/* eslint-disable no-plusplus */
import * as d3 from 'd3';
import * as SolarLib from '@obikerui/d3-solar-lib';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// import createPlot from './createPlot';
import createPlot from './createPlot';

function generateTimestamps() {
  const location = [1, 51.49];
  // const latitude = location[1];
  // const center = latitude < 0 ? 0 : 180;

  const periods = new Map([
    ['day', 1],
    ['week', 7],
    ['month', 30],
  ]);

  const start = new Date(Date.UTC(2000, 0, 1));
  const end = new Date(Date.UTC(2001, 0, 1));
  const days = d3.utcDays(start, end, periods.get('day')).slice(0, -1);
  const hours = days.flatMap((day) =>
    d3.utcHours(day, new Date(+day + 24 * 3600 * 1000), 1)
  );

  const data = hours
    .map((date) => ({
      date,
      hour: date.getUTCHours(),
      ...SolarLib.SunPos900(date, ...location),
    }))
    .filter((d) => d.altitude > 0);

  type tData = (typeof data)[number];
  const result: [number[], number[]] = [[], []];

  for (let i = 0; i < data.length; i++) {
    const elem = data[i] as tData;
    result[0].push(SolarLib.radiansToDegrees(elem.azimuth));
    result[1].push(SolarLib.radiansToDegrees(elem.altitude));
  }

  return result;
}

interface Props {
  data?: unknown[];
}

function AnalemmaPlot({ data }: Props): JSX.Element {
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
        <h3 id="bar-plot">Analemma Plot</h3>
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

AnalemmaPlot.defaultProps = {
  data: [],
};

function AnalemmaPlotContainer(): JSX.Element {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // const today = new Date();
      // const ts = Math.floor(today.getTime() / 1000);
      // const long = 1.6177;
      // const lat = 54.9783;
      // const result = SolarLib.SunPos900(ts, long, lat);

      const result = generateTimestamps();
      console.log('result of solar 900: ', result);
      setData(result);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <AnalemmaPlot data={data} />;
  }
  return <div>loading...</div>;
}

export { AnalemmaPlot, AnalemmaPlotContainer, createPlot };
