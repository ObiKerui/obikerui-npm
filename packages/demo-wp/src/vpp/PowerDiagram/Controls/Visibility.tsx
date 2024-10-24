import { useSearchParams } from 'react-router-dom';
import { cn } from '../../../Utils/CSS';

import pvIcon from '../../../assets/PowerRouter/Light/newpv.svg';
import gridIcon from '../../../assets/PowerRouter/Light/newgrid.svg';
import loadIcon from '../../../assets/PowerRouter/Light/heatpump.svg';
import battIcon from '../../../assets/PowerRouter/Light/newbattery.svg';

function VisibilityControls() {
  //   visible: 'pv,battery,load,grid',
  const [searchParams, setSearchParams] = useSearchParams();

  const profile = searchParams.get('theme') ?? 'light';
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
        className={cn('btn btn-square p-1', {
          'btn-active pv-light':
            visibleArray.includes('pv') && profile === 'light',
          'btn-active pv-dark':
            visibleArray.includes('pv') && profile === 'dark',
        })}
        onClick={() => setVisibility('pv')}
      >
        <img src={pvIcon} alt="pv" />
      </button>
      <button
        type="button"
        className={cn('btn btn-square', {
          'btn-active grid-light':
            visibleArray.includes('grid') && profile === 'light',
          'btn-active grid-dark':
            visibleArray.includes('grid') && profile === 'dark',
        })}
        onClick={() => setVisibility('grid')}
      >
        <img src={gridIcon} alt="grid" />
      </button>
      <button
        type="button"
        className={cn('btn btn-square', {
          'btn-active load-light':
            visibleArray.includes('load') && profile === 'light',
          'btn-active load-dark':
            visibleArray.includes('load') && profile === 'dark',
        })}
        onClick={() => setVisibility('load')}
      >
        <img src={loadIcon} alt="load" />
      </button>

      <hr className="mx-auto w-full border border-gray-300" />

      <button
        type="button"
        className={cn('btn btn-square', {
          'btn-active battery-light':
            visibleArray.includes('battery') && profile === 'light',
          'btn-active battery-dark':
            visibleArray.includes('battery') && profile === 'dark',
        })}
        onClick={() => setVisibility('battery')}
      >
        <img src={battIcon} alt="battery" />
      </button>
    </div>
  );
}

export default VisibilityControls;
