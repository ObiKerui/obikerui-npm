import { useEffect } from 'react';
import dayjs from 'dayjs';
import { usePowerRouter } from '../../Solax/Store';
import { PowerInput } from '../PowerInput';

const powerInput = new PowerInput();

type tSliderProps = {
  currentIdx: number;
  maxIdx: number;
  OnSetSlider: (newValue: number) => void;
};

function RangeSlider({ currentIdx, maxIdx, OnSetSlider }: tSliderProps) {
  const onChangeCB = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    OnSetSlider(+newValue);
  };

  const ticks = Array(50).fill(0);

  return (
    <div className="flex w-full flex-col">
      <input
        type="range"
        min={0}
        max={maxIdx}
        value={currentIdx}
        className="range"
        step="25"
        onChange={onChangeCB}
      />
      <div className="flex w-full justify-between px-2 text-xs">
        {ticks.map((_, ith) => (
          <span key={ith}>|</span>
        ))}
      </div>
    </div>
  );
}

function DataTest() {
  const solaxData = usePowerRouter((state) => state.data);
  const currDataIdx = usePowerRouter((state) => state.currentDataIdx);
  const setCurrDataIdx = usePowerRouter((state) => state.setCurrentDataIdx);
  const nodes = usePowerRouter((state) => state.nodes);
  const setNodes = usePowerRouter((state) => state.setNodes);
  const arches = usePowerRouter((state) => state.arches);
  const setArches = usePowerRouter((state) => state.setArches);

  useEffect(() => {
    const currSolaxData = solaxData[currDataIdx];
    powerInput.updateArchData(currSolaxData, arches);
    setArches(arches);
    powerInput.updateNodeData(currSolaxData, nodes);
    setNodes(nodes);
  }, [currDataIdx]);

  const showDate = (dateStr: string) =>
    dayjs(dateStr).format('DD/MM/YYYY HH:mm');

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-500 p-4">
      <div className="flex flex-col gap-2">
        <span>start: {showDate(solaxData[0]?.uploadTime) ?? ''}</span>
        <span>
          current date: {showDate(solaxData[currDataIdx]?.uploadTime) ?? ''}
        </span>
        <span>
          end: {showDate(solaxData[solaxData.length - 1]?.uploadTime) ?? ''}
        </span>
      </div>
      <RangeSlider
        currentIdx={currDataIdx}
        maxIdx={solaxData.length}
        OnSetSlider={setCurrDataIdx}
      />
    </div>
  );
}

export { DataTest };
