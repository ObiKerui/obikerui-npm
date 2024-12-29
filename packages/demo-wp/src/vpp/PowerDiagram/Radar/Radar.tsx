import { useEffect, useRef } from 'react';
import RadarObj from './RadarObj';
import { useRadar } from './Model';

const radarObj = new RadarObj();

useRadar.subscribe((state) => {
  radarObj.update(state);
});

export default function Radar() {
  const container = useRef<HTMLDivElement | null>(null);
  const setContainer = useRadar((state) => state.setContainer);

  useEffect(() => {
    setContainer(container.current);
  }, []);

  return (
    <div>
      <div ref={container}>radar</div>
    </div>
  );
}
