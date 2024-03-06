import { useEffect, useRef } from 'react';
import { useAppProvider } from './Provider';
import ControlPanel from './BuildingPanel';

function ThreeSolar() {
  const planRef = useRef<HTMLDivElement | null>(null);
  const perspRef = useRef<HTMLDivElement | null>(null);
  const elevRef = useRef<HTMLDivElement | null>(null);
  const { setHTMLElements } = useAppProvider();

  useEffect(() => {
    if (planRef.current && perspRef.current && elevRef.current) {
      setHTMLElements({
        plan: planRef.current,
        perspective: perspRef.current,
        elevation: elevRef.current,
      });
    }
  }, []);

  return (
    <div className="relative flex flex-row">
      <div className="absolute p-2">
        <ControlPanel />
      </div>
      <div className="h-[700px] w-[700px] min-w-[700px]" ref={planRef} />
      <div className="flex flex-col">
        <div className="h-[350px] w-[500px]" ref={perspRef} />
        <div className="h-[350px] w-[500px]" ref={elevRef} />
      </div>
    </div>
  );
}

export default ThreeSolar;
