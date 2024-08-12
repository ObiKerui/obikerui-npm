/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Plot as StackedPlotObj } from './Plot';
import { DataGrouper, LineData, tData, useChartData } from './DataGrouper';
import { cn } from '../../Utils/CSS';

function Options() {
  const { sorting, setSorting } = useChartData();

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': sorting === 'months',
        })}
        onClick={() => setSorting('months')}
      >
        by Month
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': sorting === 'weeks',
        })}
        onClick={() => setSorting('weeks')}
      >
        by Week
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': sorting === 'days',
        })}
        onClick={() => setSorting('days')}
      >
        by Day
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': sorting === 'hours',
        })}
        onClick={() => setSorting('hours')}
      >
        by Hour
      </button>
    </div>
  );
}

const stackedPlotInst = new StackedPlotObj();
const grouper = new DataGrouper();
const lineData = new LineData();

useChartData.subscribe((newState) => {
  stackedPlotInst.update(newState);
});

function StackedArea() {
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    dataSeries,
    setDataSeries,
    sorting,
    setGroupedData,
    setChartRef,
    setAverageData,
  } = useChartData();

  useEffect(() => {
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

    const lineDataArr = lineData.averaged(grouped);

    setGroupedData(grouped);
    setAverageData(lineDataArr);
  }, [sorting, dataSeries]);

  useEffect(() => {
    async function loadData() {
      const jsonData = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as unknown[];
      setDataSeries(jsonData as tData[]);
    }

    loadData().catch(console.error);
  }, []);

  useEffect(() => {
    setChartRef(ref.current);
  }, [ref.current]);

  return (
    <div>
      <span>Stacked Area Plot</span>
      <Options />
      <div ref={ref} />
    </div>
  );
}

export { StackedArea };
