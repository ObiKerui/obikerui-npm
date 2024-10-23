import { useSearchParams } from 'react-router-dom';
import { PowerDiagram } from '../PowerDiagram/PowerDiagram';
import { DNOMap } from '../DNOMap/DNOMap';
import { Settings } from '../Settings/Settings';
import { Details } from './Details';

function SiteOptions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currTab = searchParams.get('tab');

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="dno_tab"
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
        className="tab-content bg-base-100 rounded-box p-2 md:p-6"
      >
        <DNOMap />
      </div>

      <input
        type="radio"
        name="power_router_tab"
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
        className="tab-content bg-base-100 rounded-box p-2 md:p-6"
      >
        {/* <div className="flex min-h-[900px] min-w-[350px] max-w-[500px]">
          <PowerDiagram />
        </div> */}
        <div className="flex min-h-[900px] min-w-[320px] max-w-[320px]">
          <PowerDiagram />
        </div>
      </div>

      <input
        type="radio"
        name="settings_tab"
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
        className="tab-content bg-base-100 rounded-box p-2 md:p-6"
      >
        <div className="flex min-h-[900px] min-w-[320px] max-w-[320px]">
          <Settings />
        </div>
      </div>
    </div>
  );
}

function DetailOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currTab = searchParams.get('detailstab');

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="charts_tab"
        role="tab"
        className="tab"
        aria-label="Charts"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('detailtab', 'charts');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'charts'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 rounded-box p-2 md:p-6"
      >
        <div className="flex min-h-[900px] min-w-[350px] max-w-[500px]">
          <Details />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex w-full min-w-full flex-row gap-1 text-xs md:text-sm">
      <div className="flex w-full flex-row gap-2">
        <SiteOptions />
        <DetailOptions />
      </div>
    </div>
  );
}

export { Dashboard };
