import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SavePropertyButton() {
  return (
    <div className="flex justify-end">
      <button type="button" className="btn">
        <FontAwesomeIcon icon={faSave} />
      </button>
    </div>
  );
}

export { SavePropertyButton };
