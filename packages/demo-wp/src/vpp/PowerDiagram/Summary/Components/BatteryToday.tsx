import { useChart } from '../Model';
import { battIcon } from '../SharedTypes';
import Button from './SummaryButton';

type tBatteryTodayProps = {
  onClick: () => void;
};

function BatteryToday({ onClick }: tBatteryTodayProps) {
  const accumYield = useChart((state) => state.accumulatedYield);
  const formattedYield = accumYield.toFixed(2) ?? 0 / 1000.0;

  return (
    <Button icon={battIcon} onClick={onClick}>
      <span>Battery</span>
      <br />
      <span className="text-xs">{formattedYield}kw</span>
    </Button>
  );
}

export { BatteryToday };
