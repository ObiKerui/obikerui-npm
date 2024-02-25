import { useEffect, useRef } from 'react';
import { useAppProvider } from './Provider';
import ControlPanel from './BuildingPanel';

function ThreeSolar() {
  const planRef = useRef<HTMLDivElement | null>(null);
  const perspRef = useRef<HTMLDivElement | null>(null);
  const { setHTMLElements } = useAppProvider();

  useEffect(() => {
    if (planRef.current && perspRef.current) {
      setHTMLElements({
        plan: planRef.current,
        perspective: perspRef.current,
      });
    }
  }, []);

  return (
    <div className="relative flex flex-row">
      <div className="absolute p-2">
        <ControlPanel />
      </div>
      <div className="h-[700px] w-[700px] min-w-[700px]" ref={planRef} />
      <div className="flex flex-row">
        <div className="h-[400px] w-[500px]" ref={perspRef} />
      </div>
    </div>
  );
}

export default ThreeSolar;
