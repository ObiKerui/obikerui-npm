import { useEffect, useRef } from 'react';
import { useMapModel } from './Model';
import MapObj from './Map';
import { PropertyList } from './PropertyList';

const mapObj = new MapObj();

useMapModel.subscribe((state) => {
  mapObj.update(state);
});

type tControlProps = {
  currPitch: number;
  onChangePitch: (newPitch: number) => void;
  currZoom: number;
  onChangeZoom: (newZoom: number) => void;
};

function Controls({
  currPitch,
  onChangePitch,
  currZoom,
  onChangeZoom,
}: tControlProps) {
  const changePitch = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const newPitch = +changeEvent.target.value;
    onChangePitch(newPitch);
  };

  const changeZoom = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = +changeEvent.target.value;
    onChangeZoom(newZoom);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={0}
        max="60"
        value={currPitch}
        className="range"
        onChange={changePitch}
      />
      <input
        type="range"
        min={0}
        max="60"
        value={currZoom}
        className="range"
        onChange={changeZoom}
      />
    </div>
  );
}

function MapBoxMap() {
  const mapBoxContainerRef = useRef<HTMLDivElement | null>(null);
  const setContainer = useMapModel((state) => state.setContainer);
  const setPitch = useMapModel((state) => state.setPitch);
  const currPitch = useMapModel((state) => state.pitch);
  const setZoom = useMapModel((state) => state.setZoom);
  const currZoom = useMapModel((state) => state.zoom);

  useEffect(() => {
    setContainer(mapBoxContainerRef.current);
  }, []);

  return (
    <div>
      <Controls
        currPitch={currPitch}
        onChangePitch={(newPitch) => setPitch(newPitch)}
        currZoom={currZoom}
        onChangeZoom={(newZoom) => setZoom(newZoom)}
      />
      <div className="relative h-[500px]">
        <div
          className="border-base-300 absolute bottom-0 top-0 h-[500px] w-[800px] border"
          ref={mapBoxContainerRef}
        />
        <div className="bg-base-100 absolute right-2 top-2 rounded-sm p-2 opacity-80 shadow-md">
          <PropertyList />
        </div>
      </div>
    </div>
  );
}

export { MapBoxMap };
