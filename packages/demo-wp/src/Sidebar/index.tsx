import { Link } from 'react-router-dom';

export default function () {
  return (
    <ul className="sidebar sidebar--list">
      <li className="sidebar--element" key={0}>
        <Link to="plots">Plots</Link>
      </li>
      <li>
        <Link to="maps">Maps</Link>
      </li>
      <li>
        <Link to="solar">Solar</Link>
      </li>
      <li>
        <Link to="three-solar">Three Solar</Link>
      </li>
      <li>
        <Link to="properties">Properties</Link>
      </li>
    </ul>
  );
}
