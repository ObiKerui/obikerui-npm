/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
import { Object3D, OrthographicCamera, Vector3 } from 'three';
import { IListener, UI_ACTION, USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import { IMount } from '../Lib/Mounting/MountingControl';
import { Istructure } from '../Lib/Structure';

interface IGeometryControl {
  onMouseDown(): void;
  getEavesHeightFromGround(): number;
  getRoofHeightFromGround(): number;
  getRoofHeightFromEaves(): number;
  setRoofHeightFromGround(newRoofHeight: number): void;
  setRoofHeightFromEaves(newRoofHeight: number): void;
  setEavesHeightFromGround(newEavesHeight: number): void;
}

class ElevationControl implements IListener {
  buildingModel: BuildingModel | null;
  structureModel: Istructure | null;
  handle: Object3D | null;
  vectorsOnStart: Vector3[];
  perspVectorsOnStart: Vector3[];
  elevVectorsOnStart: Vector3[];
  camera: OrthographicCamera | null;
  geometryControl: IGeometryControl | null;

  constructor() {
    this.buildingModel = null;
    this.structureModel = null;
    this.handle = null;
    this.vectorsOnStart = [];
    this.perspVectorsOnStart = [];
    this.elevVectorsOnStart = [];
    this.camera = null;
    this.geometryControl = null;
  }

  set GeometryControl(geometryControl: IGeometryControl) {
    this.geometryControl = geometryControl;
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.ADJUST_ELEVATION) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.onMouseMove(model);
        break;
      case USER_EVENT.ELEV_CAM_ZOOM:
        this.onCameraChange(model);
        break;
      default:
        break;
    }
  }

  onCameraChange(model: Model) {
    const { SelectedStructure, elevationHandles, elevationScene } = model;
    if (!SelectedStructure || !elevationScene) {
      throw new Error('Structure not selected or no ui event!');
    }

    const { camera } = elevationScene;
    if (!camera) {
      return;
    }

    const buildingModel = SelectedStructure as BuildingModel;

    const geom = buildingModel.buildingElev.getRoofGeometry();
    const roofBaseHeight = geom[2].y;
    const roofTopHeight = geom[9].y;
    // const roofBaseHeight = this.geometryControl.getEavesHeightFromGround();
    // const roofTopHeight = this.geometryControl.getRoofHeightFromGround();

    const zoomedBaseHeight = camera.zoom * roofBaseHeight;
    const roofBaseHandle = elevationHandles.roofBottomLevel.handle;
    roofBaseHandle.position.copy(new Vector3(3, zoomedBaseHeight, 9));

    const zoomedTopHeight = camera.zoom * roofTopHeight;
    const roofTopHandle = elevationHandles.roofTopLevel.handle;
    roofTopHandle.position.copy(new Vector3(3, zoomedTopHeight, 9));
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent, elevationScene } = model;
    const { geometryControl } = this;
    if (!SelectedStructure || !uiEvent || !elevationScene || !geometryControl) {
      throw new Error('Structure not selected or no ui event!');
    }

    const buildingModel = SelectedStructure as BuildingModel;
    this.buildingModel = buildingModel;
    this.handle = uiEvent.actionSource;
    this.camera = elevationScene?.camera;
    geometryControl.onMouseDown();

    // const elevVecs = this.buildingModel.buildingElev.getRoofGeometry();
    // this.elevVectorsOnStart = elevVecs.map((vec) => vec.clone());

    // const vecs = this.buildingModel.buildingPlan.getRoofGeometry();
    // this.vectorsOnStart = vecs.map((vec) => vec.clone());

    // const persVecs = this.buildingModel.buildingPersp.getRoofGeometry();
    // this.perspVectorsOnStart = persVecs.map((vec) => vec.clone());
  }

  onMouseMove(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    this.buildingModel = SelectedStructure as BuildingModel;

    const { handle } = this;
    const { worldCoords } = uiEvent.positionData;

    if (!this.buildingModel || !handle) {
      return;
    }

    const handleType = UI_ACTION[handle.name as keyof typeof UI_ACTION];

    if (handleType === UI_ACTION.ELEVATE_PEAK) {
      this.setTopPosition(worldCoords);
    }

    if (handleType === UI_ACTION.ELEVATE_BASE) {
      this.setBottomPosition(worldCoords);
    }
  }

  setTopPosition(worldCoords: Vector3) {
    const { buildingModel, handle, camera, geometryControl } = this;
    if (!buildingModel || !handle || !camera || !geometryControl) {
      return;
    }

    const { perimeter } = buildingModel.buildingElev.structureBase;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    const newYPosition = local.y;
    handle.position.set(currPos.x, newYPosition, currPos.z);

    geometryControl.setRoofHeightFromGround(newYPosition / camera.zoom);
  }

  // setTopHipPositionPersp(coords: Vector3) {
  //   const { perspVectorsOnStart, buildingModel, camera } = this;
  //   if (!buildingModel || !camera) {
  //     return;
  //   }

  //   const vecToTop = perspVectorsOnStart[9];
  //   const vecToBottom = perspVectorsOnStart[12];

  //   vecToTop.y = coords.y / camera.zoom;
  //   vecToBottom.y = coords.y / camera.zoom;
  //   buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
  // }

  setBottomPosition(worldCoords: Vector3) {
    const { buildingModel, elevVectorsOnStart, camera, geometryControl } = this;
    if (!buildingModel || !camera || !geometryControl) {
      return;
    }

    const { camHandles: elevHandles } = buildingModel.buildingElev;
    const roofBaseHandle = elevHandles?.roofBottomLevel.handle;
    const roofTopHandle = elevHandles?.roofTopLevel.handle;
    if (!roofBaseHandle || !roofTopHandle) {
      return;
    }

    const { perimeter } = buildingModel.buildingElev.structureBase;

    const currPos = roofBaseHandle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    const newBaseYPosition = local.y;
    roofBaseHandle.position.set(currPos.x, newBaseYPosition, currPos.z);

    const vece = elevVectorsOnStart[8];
    const vecf = elevVectorsOnStart[9];

    const scaledYPosition = newBaseYPosition / camera.zoom;

    geometryControl.setEavesHeightFromGround(newBaseYPosition / camera.zoom);
    const roofHeight = geometryControl.getRoofHeightFromEaves();

    // const roofHeight = vecf.y - vece.y;
    const newRoofHeight = scaledYPosition + roofHeight;

    roofTopHandle.position.y = newRoofHeight * camera.zoom;

    // scaled y position used now for mount-base y position
    // TODO - this shouldn't live here, move when working
    const mountModel = buildingModel as IMount;
    const { Plan, Elevation, Persp } = mountModel.MountBase;
    const currPlanPosition = Plan.position;
    const newPlanPosition = new Vector3(
      currPlanPosition.x,
      scaledYPosition,
      currPlanPosition.z
    );
    Plan.position.copy(newPlanPosition);

    const currPerspPosition = Persp.position;
    const newPerspPosition = new Vector3(
      currPerspPosition.x,
      scaledYPosition,
      currPerspPosition.z
    );
    Persp.position.copy(newPerspPosition);

    const currElevPosition = Elevation.position;
    const newElevPosition = new Vector3(
      currElevPosition.x,
      scaledYPosition,
      currElevPosition.z
    );
    Elevation.position.copy(newElevPosition);
  }
}

export { IGeometryControl, ElevationControl };
