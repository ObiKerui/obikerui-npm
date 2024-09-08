import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { PowerDiagram } from '../PowerDiagram/PowerDiagram';
import { DNOMap } from '../DNOMap/DNOMap';
import { Settings } from '../Settings/Settings';

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

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Power Router"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'power-router-b');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'power-router-b'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <PowerDiagram />
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Settings"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'settings');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'settings'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <div className="flex w-full">
          <Settings />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('tab', 'power-router-b');
        prev.set('detail', 'inverter');
        prev.set('timeFrame', '48hours');
        prev.set('visible', 'pv,load,grid,battery');
        return prev;
      },
      {
        replace: true,
      }
    );
  }, []);

  return (
    <div className="flex min-w-full flex-row gap-1">
      <div className="flex flex-grow">
        <SiteOptions />
      </div>
    </div>
  );
}

export { Dashboard };
