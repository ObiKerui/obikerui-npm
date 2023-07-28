import { useEffect } from 'react';
import debounce from 'lodash.debounce';

type tOnResizeFunc = () => void;

export default function (functionCall: tOnResizeFunc) {
  useEffect(() => {
    const handleResize = debounce(functionCall, 500);
    functionCall();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
