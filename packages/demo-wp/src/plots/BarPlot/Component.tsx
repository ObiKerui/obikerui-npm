import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { atom, useAtom, getDefaultStore } from 'jotai';
import { BarPlot as BarPlotObj } from './Plot';
import {
  DataGrouper,
  tChartData,
  tData,
  TimePeriods,
  Metric,
} from './DataGrouper';

const BarPlotAtom = atom<tChartData>({
  chartRef: null,
  dataSeries: [],
  sorting: 'months',
  groupedData: null,
  metric: 'Avg Consumption',
});

const store = getDefaultStore();

const barPlotObj = new BarPlotObj();
const grouper = new DataGrouper();

store.sub(BarPlotAtom, () => {
  const newState = store.get(BarPlotAtom);
  barPlotObj.update(newState);
});

function Controls() {
  const [barPlotData, setBarPlotData] = useAtom(BarPlotAtom);

  const setTime = (value: string) => {
    setBarPlotData(
      (prev) =>
        ({
          ...prev,
          sorting: value,
        } as tChartData)
    );
  };

  const setMetric = (value: string) => {
    setBarPlotData(
      (prev) =>
        ({
          ...prev,
          metric: value,
        } as tChartData)
    );
  };

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">{barPlotData.sorting}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {TimePeriods.map((value, id) => (
              <li key={id}>
                <button type="button" onClick={() => setTime(value)}>
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">{barPlotData.metric}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Metric.map((value, id) => (
              <li key={id}>
                <button type="button" onClick={() => setMetric(value)}>
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function BarPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [barPlot, setBarPlot] = useAtom(BarPlotAtom);
  const { sorting, dataSeries } = barPlot;

  useEffect(() => {
    console.log('sorting or data series changed: ', sorting, dataSeries);
    let grouped = null;
    switch (sorting) {
      case 'months':
        grouped = grouper.groupByMonths(dataSeries);
        break;
      case 'weeks':
        grouped = grouper.groupByWeeks(dataSeries);
        break;
      case 'days':
        grouped = grouper.groupByDays(dataSeries);
        break;
      case 'hours':
        grouped = grouper.groupByHours(dataSeries);
        break;
      default:
        grouped = grouper.groupByMonths(dataSeries);
    }

    setBarPlot({
      ...barPlot,
      groupedData: grouped,
    });
  }, [sorting, dataSeries]);

  useEffect(() => {
    setBarPlot((prev) => ({
      ...prev,
      chartRef: ref.current,
    }));
  }, [ref.current]);

  useEffect(() => {
    async function loadData() {
      const data = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as tData[];
      setBarPlot((prev) => ({
        ...prev,
        dataSeries: data,
      }));
    }
    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <span>Bar Plot</span>
      <Controls />
      <div className="flex gap-4">
        <div className="w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { BarPlot };
