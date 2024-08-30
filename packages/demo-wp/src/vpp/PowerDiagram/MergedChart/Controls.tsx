import { useSearchParams } from 'react-router-dom';
import { cn } from '../../../Utils/CSS';
import { tTimeFrame } from './Model';

function TimeControls() {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeFrame = searchParams.get('timeFrame');

  const setTimeFrame = (timeFrameParam: tTimeFrame) => {
    setSearchParams(
      (prev) => {
        prev.set('timeFrame', `${timeFrameParam}`);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === '48hours',
        })}
        onClick={() => setTimeFrame('48hours')}
      >
        Last 48 Hours
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'week',
        })}
        onClick={() => setTimeFrame('week')}
      >
        Last Week
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'month',
        })}
        onClick={() => setTimeFrame('month')}
      >
        Last Month
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'quarter',
        })}
        onClick={() => setTimeFrame('quarter')}
      >
        Last Quarter
      </button>
    </div>
  );
}

function VisibilityControls() {
  const [searchParams, setSearchParams] = useSearchParams({
    visible: 'pv,battery,load,grid',
  });

  const visibleArrayStr = searchParams.get('visible') ?? '';
  let visibleArray = visibleArrayStr.split(',');

  const setVisibility = (visibleParam: string) => {
    if (visibleArray.includes(visibleParam)) {
      visibleArray = visibleArray.filter((elem) => elem !== visibleParam);
    } else {
      visibleArray.push(visibleParam);
    }

    const newVisibleStr = visibleArray.map((elem) => `${elem}`).join(',');

    setSearchParams(
      (prev) => {
        prev.set('visible', `${newVisibleStr}`);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': visibleArray.includes('pv'),
        })}
        onClick={() => setVisibility('pv')}
      >
        PV
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': visibleArray.includes('battery'),
        })}
        onClick={() => setVisibility('battery')}
      >
        Battery
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': visibleArray.includes('grid'),
        })}
        onClick={() => setVisibility('grid')}
      >
        Grid
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': visibleArray.includes('load'),
        })}
        onClick={() => setVisibility('load')}
      >
        Load
      </button>
    </div>
  );
}

export { TimeControls, VisibilityControls };
