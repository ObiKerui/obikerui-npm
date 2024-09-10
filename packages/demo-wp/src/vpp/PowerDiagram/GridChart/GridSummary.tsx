import { usePowerRouter } from '../../Solax/Store';
import { useGridChart } from './Model';

type tStatProps = {
  title: string;
  desc: string;
  footer: string;
};

function Stat({ title, desc, footer }: tStatProps) {
  return (
    <div>
      <div className="stats bg-base-200 rounded-md shadow">
        <div className="stat">
          <div className="stat-title text-sm">{title}</div>
          <div className="stat-value text-sm">{desc}</div>
          <div className="stat-desc text-xs">{footer}</div>
        </div>
      </div>
    </div>
  );
}

function GridSummary() {
  const financialData = usePowerRouter((state) => state.financial);
  const profitLoss = useGridChart((state) => state.profitLoss);
  const profitLossCurr = useGridChart((state) => state.producedConsumed);

  const consumed = ((profitLoss?.consumed ?? 0) / 1000.0).toFixed(2);
  const produced = ((profitLoss?.feedin ?? 0) / 1000.0).toFixed(2);
  const consumedCurr = ((profitLossCurr?.consumed ?? 0) / 1000.0).toFixed(2);
  const producedCurr = ((profitLossCurr?.feedin ?? 0) / 1000.0).toFixed(2);

  //   console.log('financial data: ', financialData, profitLoss, profitLossCurr);

  return (
    <div className="flex justify-around">
      <div className="flex w-[400px] justify-around gap-2 p-2">
        <div>
          <Stat title="Produced" desc={`${produced}Kw`} footer="21% UP" />
        </div>
        <div>
          <Stat title="Consumed" desc={`${consumed}Kw`} footer="21% UP" />
        </div>
        <div>
          <Stat title="Produced" desc={`${produced}Kw`} footer="21% UP" />
        </div>
      </div>
    </div>
  );
}

export default GridSummary;
