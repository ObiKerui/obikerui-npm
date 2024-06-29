/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Plot as StackedPlotObj, tModel } from './Plot';
import { DataGrouper, tData } from './DataGrouper';

interface IOptions {
  onClickCB: (newTimeFrame: string) => void;
}

function Options({ onClickCB }: IOptions) {
  const setTimeframe = (time: string) => {
    onClickCB(time);
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setTimeframe('years')}
      >
        by Year
      </button>
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setTimeframe('weeks')}
      >
        by Week
      </button>
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setTimeframe('days')}
      >
        by Day
      </button>
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setTimeframe('hours')}
      >
        by Hour
      </button>
    </div>
  );
}

const stackedPlotInst = new StackedPlotObj();
const grouper = new DataGrouper();

function StackedPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<unknown[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>('years');

  useEffect(() => {
    // const grouped = grouper.groupByMonths(data as tData[]);
    // const grouped = grouper.groupByHours(data as tData[]);
    let grouped = null;
    switch (timeFrame) {
      case 'years':
        grouped = grouper.groupByMonths(data as tData[]);
        break;
      case 'weeks':
        grouped = grouper.groupByWeeks(data as tData[]);
        break;
      case 'days':
        grouped = grouper.groupByDays(data as tData[]);
        break;
      case 'hours':
        grouped = grouper.groupByHours(data as tData[]);
        break;
      default:
        grouped = grouper.groupByMonths(data as tData[]);
    }
    const { model } = stackedPlotInst;
    const newModel = {
      ...model,
      container: ref.current,
      plotData: grouped.data,
      labels: grouped.labels,
      colours: grouped.colours,
      minMax: grouped.minMax,
      categories: grouped.categories,
    } as tModel;

    stackedPlotInst.update(newModel);
  }, [data, timeFrame]);

  useEffect(() => {
    async function loadData() {
      const jsonData = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as unknown[];
      setData(jsonData);
    }

    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <span>Stacked Plot</span>
      <Options onClickCB={(newTimeframe) => setTimeFrame(newTimeframe)} />
      <div ref={ref} />
    </div>
  );
}

export { StackedPlot };
