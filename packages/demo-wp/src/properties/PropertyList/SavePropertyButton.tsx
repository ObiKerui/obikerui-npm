import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type tSavePropertyButtonProps = {
  onClick: () => void;
};

function SavePropertyButton({ onClick }: tSavePropertyButtonProps) {
  return (
    <div className="flex justify-end">
      <button type="button" className="btn btn-sm" onClick={onClick}>
        <FontAwesomeIcon icon={faSave} />
        Save
      </button>
    </div>
  );
}

export { SavePropertyButton };
