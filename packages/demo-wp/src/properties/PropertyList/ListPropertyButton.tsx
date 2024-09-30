import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type tListPropertyButtonProps = {
  onClick: () => void;
};

function ListPropertyButton({ onClick }: tListPropertyButtonProps) {
  return (
    <div className="flex justify-end">
      <button type="button" className="btn btn-sm" onClick={onClick}>
        <FontAwesomeIcon icon={faList} />
      </button>
    </div>
  );
}

export { ListPropertyButton };
