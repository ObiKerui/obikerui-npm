import { useSearchParams } from 'react-router-dom';
import { Frame as PowerRouter } from '../PowerRouter/Frame';
import { DNOMap } from '../DNOMap/DNOMap';

function SiteOptions() {
  const [searchParams, setSearchParams] = useSearchParams({
    tab: 'power-router',
  });

  const currTab = searchParams.get('tab');

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Power Router"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'power-router');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'power-router'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <PowerRouter checked={currTab === 'power-router'} />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="DNO Map"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'dno-map');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'dno-map'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <DNOMap />
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex min-w-full flex-row gap-1">
      <div className="flex flex-grow">
        <SiteOptions />
      </div>
    </div>
  );
}

export { Dashboard };
