import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faHouse,
  faIndustry,
  faMap,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '../Utils/CSS';

export default function () {
  const location = useLocation();
  const { pathname } = location;

  return (
    <ul>
      <li
        className={cn({
          'font-semibold': pathname === '/plots',
        })}
      >
        <Link to="plots">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/plots',
            })}
            icon={faChartSimple}
          />
          &nbsp;Plots
        </Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/maps',
        })}
      >
        <Link to="maps">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/maps',
            })}
            icon={faMap}
          />
          &nbsp;Maps
        </Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/solar',
        })}
      >
        <Link to="solar">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/solar',
            })}
            icon={faSun}
          />
          &nbsp;Solar
        </Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/three-solar',
        })}
      >
        <Link to="three-solar">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/three-solar',
            })}
            icon={faSun}
          />
          &nbsp;Three Solar
        </Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/properties',
        })}
      >
        <Link to="properties">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/properties',
            })}
            icon={faHouse}
          />
          &nbsp;Properties
        </Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/virtual-power-plant',
        })}
      >
        <Link to="virtual-power-plant">
          <FontAwesomeIcon
            className={cn('opacity-60', {
              'opacity-100': pathname === '/virtual-power-plant',
            })}
            icon={faIndustry}
          />
          &nbsp;Virtual Power Plant
        </Link>
      </li>
    </ul>
  );
}
