import { useState } from 'react';
import { usePowerRouter } from '../../Solax/Store';
import { Collapsable } from './InfoPanel';
import { useGridChart } from './Model';
import { cn } from '../../../Utils/CSS';

type tStatProps = {
  title: string;
  desc: string;
  footer: string;
  onClick: () => void;
};

function Stat({ title, desc, footer, onClick }: tStatProps) {
  return (
    <button type="button" onClick={onClick}>
      <div className="stats bg-base-200 rounded-md shadow hover:cursor-pointer">
        <div className="stat">
          <div className="stat-title text-sm">{title}</div>
          <div className="stat-value text-sm">{desc}</div>
          <div className="stat-desc text-xs">{footer}</div>
        </div>
      </div>
    </button>
  );
}

function Collapse() {
  return (
    <div className="bg-base-200 collapse">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {/* <Stat title="test" desc="test" footer="test" /> */}
      </div>
      <div className="collapse-content">
        <p>hello</p>
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

  const [hidden, setHidden] = useState<boolean>(true);

  //   console.log('financial data: ', financialData, profitLoss, profitLossCurr);
  // max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out mt-4 bg-white p-4 shadow-lg rounded

  return (
    <div className="border-base-300 flex flex-col justify-around border">
      <div className="border-base-300 flex w-[400px] justify-around gap-2 border p-2">
        <Stat
          title="Produced"
          desc={`${produced}Kw`}
          footer="21% Up"
          onClick={() => setHidden((prev) => !prev)}
        />
        <Stat
          title="Consumed"
          desc={`${consumed}Kw`}
          footer="21% Down"
          onClick={() => setHidden((prev) => !prev)}
        />
        <Stat
          title="What"
          desc="what"
          footer="help"
          onClick={() => setHidden((prev) => !prev)}
        />
      </div>
      <div className="border-base-300 border">
        <Collapsable
          hidden={hidden}
          render={() => <div>the hidden content</div>}
        />
      </div>
      {/* <InfoPanelBody
        render={() => (
          <div className="border-base-300 border p-2">
            <div
              className={cn(
                'border-base-300 overflow-hidden border transition-all duration-500 ease-in-out',
                {
                  'max-h-0 opacity-0': hidden,
                  'max-h-[500px] opacity-100': !hidden,
                }
              )}
            >
              hidable content
            </div>
          </div>
        )}
      /> */}
    </div>
  );
}

export default GridSummary;
