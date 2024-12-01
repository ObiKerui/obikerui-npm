import { useChart } from '../Model';
import { pvIcon } from '../SharedTypes';
import Button from './SummaryButton';

type tEarnTodayProps = {
  onClick: () => void;
};

function EarnToday({ onClick }: tEarnTodayProps) {
  const accumExport = useChart((state) => state.accumulatedExport);
  const formattedExport = accumExport.toFixed(2) ?? 0;

  return (
    <Button icon={pvIcon} onClick={onClick}>
      <span>Earnings</span>
      <br />
      <span className="text-xs">£{formattedExport}</span>
    </Button>
  );
}

export { EarnToday };
