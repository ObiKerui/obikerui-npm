import { useChart } from '../Model';
import { pvIcon } from '../SharedTypes';
import Button from './SummaryButton';

type tYieldTodayProps = {
  onClick: () => void;
};

function YieldToday({ onClick }: tYieldTodayProps) {
  const accumYield = useChart((state) => state.accumulatedYield);
  const formattedYield = accumYield.toFixed(2) ?? 0 / 1000.0;

  return (
    <Button icon={pvIcon} onClick={onClick}>
      <span>Yield</span>
      <br />
      <span className="text-xs">{formattedYield}kw</span>
    </Button>
  );
}

export { YieldToday };
