const textAttributes = {
  plotID: null as string | null,
  clipPathID: null as string | null,
  index: 0,
  coordinates: [] as unknown[],
  alpha: 0,
  labels: [] as string[],
  colours: [] as string[],
  anchor: null as string | null,

  tag: null as string | null,
  data: [] as unknown[],
  styles: [] as string[],
  curve: null as unknown,
  onClick: null as unknown,
  onMouseDown: null as unknown,
  onMouseUp: null as unknown,
  onEnter: null as unknown,
  onLeave: null as unknown,
  onMove: null as unknown,
  onGetCoordinates: null as ((data: unknown) => [number, number]) | null,
  onGetText: null as ((data: unknown) => string) | null,
  onSetAttrs: null as ((data: unknown) => string) | null,
};

export default textAttributes;
export type tPlotAttrs = typeof textAttributes;
