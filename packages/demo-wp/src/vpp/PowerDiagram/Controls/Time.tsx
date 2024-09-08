import { useSearchParams } from 'react-router-dom';
import { cn } from '../../../Utils/CSS';
import { tTimeFrame } from '../MergedChart/Model';

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

export default TimeControls;
