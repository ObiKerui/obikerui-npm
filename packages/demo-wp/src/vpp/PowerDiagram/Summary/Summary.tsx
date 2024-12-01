import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { cn } from '../../../Utils/CSS';
import { Chart } from './Plot';
import { useChart } from './Model';
import { usePowerRouter } from '../../Solax/Store';
import { tShowing } from './SharedTypes';
import { YieldToday } from './Components/YieldToday';
import { DataProcessor } from './DataProcessor';
import { EarnToday } from './Components/EarnToday';
import { BatteryToday } from './Components/BatteryToday';

const lineChart = new Chart();
const dataProcessor = new DataProcessor();

useChart.subscribe((newState) => {
  lineChart.update(newState);
});

type tPreviewPanelProps = {
  onSetDisplay: (show: tShowing) => void;
};

function PreviewPanel({ onSetDisplay }: tPreviewPanelProps) {
  return (
    <div className="grid grid-cols-3 place-items-center gap-2 rounded-sm">
      <YieldToday onClick={() => onSetDisplay('yield')} />
      <EarnToday onClick={() => onSetDisplay('earnings')} />
      <BatteryToday onClick={() => onSetDisplay('battery')} />
      <button
        type="button"
        className="btn w-full"
        onClick={() => onSetDisplay('consumed')}
      >
        consumed
      </button>
      <button type="button" className="btn w-full">
        grid
      </button>
      <button type="button" className="btn w-full">
        grid
      </button>
    </div>
  );
}

type tDetailPanelProps = {
  onSetDisplay: (show: tShowing) => void;
};

function DetailPanel({ onSetDisplay }: tDetailPanelProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const setLineContainer = useChart((state) => state.setLineContainer);

  useEffect(() => {
    setLineContainer(container.current);
  }, []);

  return (
    <div className="border-base-300 flex justify-between border">
      <div className="w-full" ref={container} />
      <div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => onSetDisplay('preview')}
        >
          X
        </button>
      </div>
    </div>
  );
}

const testTariffs = [{ time: dayjs('9:00'), rate: 1 }];

function Summary() {
  const data = usePowerRouter((state) => state.data);
  const currentDataIdx = usePowerRouter((state) => state.currentDataIdx);
  const setRangedData = useChart((state) => state.setRangedData);
  const setAccumulatedYield = useChart((state) => state.setAccumulatedYield);
  const setAccumulatedExport = useChart((state) => state.setAccumulatedExport);
  const showingOption = useChart((state) => state.showingOption);
  const setShowingOption = useChart((state) => state.setShowingOption);

  useEffect(() => {
    const currentDateStr = data[currentDataIdx]?.uploadTime;
    const currentDate = dayjs(currentDateStr);
    const filteredData = dataProcessor.getDataForDate(data, currentDate);
    const accumYield = dataProcessor.getAccumulatedYield(filteredData);
    const accumExport = dataProcessor.getAccumulatedExport(
      filteredData,
      testTariffs
    );
    console.log('current date / filtered data? ', currentDate, filteredData);
    setRangedData(filteredData);
    setAccumulatedYield(accumYield);
    setAccumulatedExport(accumExport);
  }, [data, currentDataIdx]);

  const setDisplay = (displayPanel: tShowing) => {
    setShowingOption(displayPanel);
  };

  return (
    <div className="border-base-300 h-40 rounded-sm border p-2">
      <div
        className={cn('hidden', {
          block: showingOption === 'preview',
        })}
      >
        <PreviewPanel onSetDisplay={setDisplay} />
      </div>
      <div
        className={cn('hidden', {
          block: showingOption !== 'preview',
        })}
      >
        <DetailPanel onSetDisplay={setDisplay} />
      </div>
    </div>
  );
}

export { Summary };
