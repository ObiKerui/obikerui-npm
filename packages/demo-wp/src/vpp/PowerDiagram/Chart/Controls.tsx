import { useSearchParams } from 'react-router-dom';
import { cn } from '../../../Utils/CSS';

function Controls() {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeFrame = searchParams.get('timeFrame');

  const setTimeFrame = (timeFrameParam: string) => {
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
          'btn-active': timeFrame === 'months',
        })}
        onClick={() => setTimeFrame('months')}
      >
        by Month
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'weeks',
        })}
        onClick={() => setTimeFrame('weeks')}
      >
        by Week
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'days',
        })}
        onClick={() => setTimeFrame('days')}
      >
        by Day
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': timeFrame === 'hours',
        })}
        onClick={() => setTimeFrame('hours')}
      >
        by Hour
      </button>
    </div>
  );
}

export { Controls };
