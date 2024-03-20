// eslint-disable-next-line max-classes-per-file
import { Mesh } from 'three';
import Plan from '../Scenes/Plan';
import Perspective from '../Scenes/Perspective';
import Elevation from '../Scenes/Elevation';
import BuildingModel from '../Buildings/Model';
import { Istructure } from '../Lib/Structure';
import { IListener, tUIEvent, USER_EVENT } from '../Lib/sharedTypes';
import CamHandles from '../Handles/CamHandles';
import { HandleControl } from '../Handles/BuildingHandles';

// type tListener = (newModel: BuildingModel[]) => void;

enum InteractionMode {
  NONE = 'NONE',
  SELECT_STRUCTURE = 'SELECT_STRUCTURE',
  POSITION = 'POSITION',
  ROTATE = 'ROTATE',
  SCALE = 'SCALE',
  ADJUST_ROOF = 'ADJUST_ROOF',
  ADJUST_ELEVATION = 'ADJUST_ELEVATION',
}

class Model {
  elevationHandles: CamHandles;
  handleControl: HandleControl;
  planScene: Plan | null;
  perspectiveScene: Perspective | null;
  elevationScene: Elevation | null;
  structuresMap: Map<string, Istructure>;
  selectedStructureId: string | null;
  mouseIsDown: boolean;
  selectedMesh: Mesh | null;
  listeners: IListener[];
  interaction: InteractionMode;
  uiEvent: tUIEvent | null;

  constructor() {
    this.elevationHandles = new CamHandles();
    this.handleControl = new HandleControl();
    this.planScene = null;
    this.perspectiveScene = null;
    this.elevationScene = null;

    this.structuresMap = new Map();
    this.selectedStructureId = null;

    // this.buildingsMap = new Map();
    // this.selectedBuildingId = null;

    // this.dormersMap = new Map();

    // this.buildings = [];
    this.listeners = [];
    // this.selectedBuildingIndex = -1;
    this.mouseIsDown = false;
    this.selectedMesh = null;
    this.interaction = InteractionMode.NONE;
    this.uiEvent = null;
  }

  get SelectedStructure() {
    const { structuresMap, selectedStructureId } = this;
    if (!selectedStructureId) {
      return null;
    }
    return structuresMap.get(selectedStructureId);
  }

  addListener(listener: IListener) {
    this.listeners.push(listener);
  }

  notifyListeners(userEvent: USER_EVENT) {
    this.listeners.forEach((listener) => {
      listener.onUpdate(userEvent, this);
    });
  }
}

export { BuildingModel, InteractionMode, Model };
