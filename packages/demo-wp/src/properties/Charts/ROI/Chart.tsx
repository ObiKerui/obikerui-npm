// import * as d3 from 'd3';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import createPlot, { type tEntry } from './createROI';
import { useAppProvider } from '../../Provider/Provider';
import { type tYield } from '../../Provider/Controllers/YieldCalculator';

interface Props {
  data?: tYield[];
}

function HeatPlot({ data }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current && data) {
      // eslint-disable-next-line no-console
      const converted = data.map(
        (elem) =>
          ({
            x: elem.profit,
            y: elem.investment,
            v: elem.yieldValue,
          } as tEntry)
      );
      createPlot(ref.current, converted).catch(console.error);
    }
    return () => {
      plotCreated.current = true;
    };
  }, [data]);

  return (
    <div>
      <div>
        <h3 id="heat-plot">ROI Plot</h3>
        <div ref={ref} />
      </div>
    </div>
  );
}

HeatPlot.defaultProps = {
  data: [],
};

function LinePlotContainer(): JSX.Element {
  const [data, setData] = useState<tYield[]>([]);
  const { controller } = useAppProvider();

  const calculator = controller.yieldCalculator;

  useEffect(() => {
    const fetchData = async () => {
      const yieldData = calculator.calculateRange({
        startProfit: 100 * 12,
        endProfit: 1500 * 12,
        profitInc: 100 * 12,
        startInvest: 50000,
        endInvest: 200000,
        investInc: 10000,
        cost: 500 * 12,
      });
      setData(yieldData);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (data.length > 0) {
    return <HeatPlot data={data} />;
  }
  return <div>loading...</div>;
}

export { createPlot, HeatPlot as LinePlot, LinePlotContainer };
