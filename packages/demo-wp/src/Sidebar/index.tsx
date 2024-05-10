import { Link, useLocation } from 'react-router-dom';
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
        <Link to="plots">Plots</Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/maps',
        })}
      >
        <Link to="maps">Maps</Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/solar',
        })}
      >
        <Link to="solar">Solar</Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/three-solar',
        })}
      >
        <Link to="three-solar">Three Solar</Link>
      </li>
      <li
        className={cn({
          'font-semibold': pathname === '/properties',
        })}
      >
        <Link to="properties">Properties</Link>
      </li>
    </ul>
  );
}
