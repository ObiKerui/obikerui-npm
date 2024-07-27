import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { atom, useAtom, getDefaultStore } from 'jotai';
import rfdc from 'rfdc';
import { ScatterPlot as ScatterPlotObj } from './Plot';
import {
  DataGrouper,
  tChartData,
  Metric,
  tCSVElement,
  tSpeciesKey,
  tMetric,
  tGroupedData,
  tSpeciesParams,
  tMetricParams,
} from './DataGrouper';
import { cn } from '../../Utils/CSS';

const speciesFilter = new Map<tSpeciesKey, tSpeciesParams>();
speciesFilter.set('setosa', {
  label: 'Setosa',
  active: true,
});
speciesFilter.set('versicolor', {
  label: 'Versicolor',
  active: true,
});
speciesFilter.set('virginica', {
  label: 'Virginica',
  active: true,
});

const metricFilter = new Map<tMetric, tMetricParams>();
Metric.forEach((metric) => {
  metricFilter.set(metric, {
    label: metric,
    active: true,
  });
});

const groupedDataMap = new Map<tMetric, number[]>();
Metric.forEach((metric) => {
  groupedDataMap.set(metric, []);
});

const grouped = {
  data: groupedDataMap,
} as tGroupedData;

const PlotAtom = atom<tChartData>({
  chartRef: null,
  dataSeries: [],
  columns: Array.from(groupedDataMap.keys()),
  colours: ['red', 'green', 'blue', 'grey'],
  species: speciesFilter,
  groupedData: grouped,
  metric: metricFilter,
});

const store = getDefaultStore();

const plotObj = new ScatterPlotObj();
const grouper = new DataGrouper();

store.sub(PlotAtom, () => {
  const newState = store.get(PlotAtom);
  plotObj.update(newState);
});

function Controls() {
  const [plotData, setPlotData] = useAtom(PlotAtom);
  const { species, metric } = plotData;

  const updateSpecies = (value: tSpeciesKey) => {
    setPlotData((prev) => {
      const currFilter = prev.species;
      const currValue = currFilter.get(value);
      if (!currValue) throw new Error('Error updating species!');
      currFilter.set(value, {
        ...currValue,
        active: !currValue.active,
      });

      return {
        ...prev,
        species: rfdc()(currFilter),
      };
    });
  };

  const updateMetric = (value: tMetric) => {
    setPlotData((prev) => {
      const currFilter = prev.metric;
      const currValue = currFilter.get(value);
      if (!currValue) throw new Error('Error updating metric!');

      currFilter.set(value, {
        ...currValue,
        active: !currValue.active,
      });

      return {
        ...prev,
        metric: rfdc()(currFilter),
      };
    });
  };

  const isSpeciesEnabled = (value: tSpeciesKey) =>
    plotData.species.get(value)?.active ?? false;

  const isMetricEnabled = (value: tMetric) =>
    plotData.metric.get(value)?.active ?? false;

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">Filter Species</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Array.from(species.keys()).map((elem) => (
              <li key={elem}>
                <button type="button" onClick={() => updateSpecies(elem)}>
                  <span
                    className={cn('font-extralight', {
                      'font-semibold': isSpeciesEnabled(elem),
                    })}
                  >
                    {species.get(elem)?.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">Filter Metric</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Array.from(metric.keys()).map((elem) => (
              <li key={elem}>
                <button type="button" onClick={() => updateMetric(elem)}>
                  <span
                    className={cn('font-extralight', {
                      'font-semibold': isMetricEnabled(elem),
                    })}
                  >
                    {metric.get(elem)?.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function ScatterPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [plotData, setPlotData] = useAtom(PlotAtom);
  const { species, dataSeries, metric } = plotData;

  useEffect(() => {
    let columnData = null;
    const filtered = grouper.filterBySpecies(dataSeries, species);
    columnData = grouper.groupByMetric(filtered);

    const { groupedData } = plotData;
    if (groupedData) {
      groupedData.data = columnData;
    }

    setPlotData({
      ...plotData,
      groupedData,
    });
  }, [species, dataSeries, metric]);

  useEffect(() => {
    setPlotData((prev) => ({
      ...prev,
      chartRef: ref.current,
    }));
  }, [ref.current]);

  useEffect(() => {
    async function loadData() {
      const csvresult: tCSVElement[] = await d3.csv(
        'assets/iris.csv',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any) => ({
          sepalLength: +d.Sepal_Length,
          sepalWidth: +d.Sepal_Width,
          petalLength: +d.Petal_Length,
          petalWidth: +d.Petal_Width,
          species: d.Species as tSpeciesKey,
        })
      );

      setPlotData((prev) => ({
        ...prev,
        dataSeries: csvresult,
      }));
    }

    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <span>Scatter Plot</span>
      <Controls />
      <div className="flex gap-4">
        <div className="w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { ScatterPlot };
