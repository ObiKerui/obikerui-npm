import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useDensityMap } from './Map';

async function loadData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ukDnoGeoJson: any = await d3.json(
    'assets/PowerRouter/UK_DNO_Regions.geojson'
  );
  return ukDnoGeoJson;
}

function DNOMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { setHTML, setStatesGeojson } = useDensityMap();

  useEffect(() => {
    setHTML(mapRef.current);
  }, [mapRef.current]);

  useEffect(() => {
    loadData()
      .then((geojson: unknown) => {
        console.log('set the geojson: ', geojson);
        setStatesGeojson(geojson);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative flex flex-row border border-blue-900">
      <div className="h-[2000px] w-[700px] min-w-[700px]" ref={mapRef} />
    </div>
  );
}

export { DNOMap };
