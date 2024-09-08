import {
  faWind,
  faSun,
  faCloudRain,
  faTemperatureThreeQuarters,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WIDTH = 18;

function WeatherInfo() {
  return (
    <div className="flex flex-row gap-2">
      <button type="button" className="btn bg-base-200">
        <FontAwesomeIcon icon={faWind} width={WIDTH} />
      </button>
      <button type="button" className="btn bg-base-200">
        <FontAwesomeIcon icon={faSun} width={WIDTH} />
      </button>
      <button type="button" className="btn bg-base-200">
        <FontAwesomeIcon icon={faCloudRain} width={WIDTH} />
      </button>
      <button type="button" className="btn bg-base-100">
        <FontAwesomeIcon icon={faTemperatureThreeQuarters} width={WIDTH} />
        18°C
      </button>
    </div>
  );
}

export default WeatherInfo;
