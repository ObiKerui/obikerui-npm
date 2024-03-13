/* eslint-disable prefer-destructuring */
import { Object3D, Vector3 } from 'three';
import { IListener, UI_ACTION, USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';

class RoofControl implements IListener {
  buildingModel: BuildingModel | null;
  handle: Object3D | null;
  vectorsOnStart: Vector3[];
  perspVectorsOnStart: Vector3[];

  constructor() {
    this.buildingModel = null;
    this.handle = null;
    this.vectorsOnStart = [];
    this.perspVectorsOnStart = [];
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.ADJUST_ROOF) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.onMouseMove(model);
        break;
      default:
        break;
    }
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const buildingModel = SelectedStructure as BuildingModel;
    this.buildingModel = buildingModel;

    const { actionSource } = uiEvent;
    if (!actionSource) {
      return;
    }
    this.handle = actionSource;

    const vecs = buildingModel.buildingPlan.getRoofGeometry();
    this.vectorsOnStart = vecs.map((vec) => vec.clone());

    const persVecs = buildingModel.buildingPersp.getRoofGeometry();
    this.perspVectorsOnStart = persVecs.map((vec) => vec.clone());
  }

  onMouseMove(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const { action } = uiEvent;

    const buildingModel = SelectedStructure as BuildingModel;
    const { handle } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { worldCoords } = uiEvent.positionData;

    if (action === UI_ACTION.MOVE_N_HIP) {
      this.setTopHipPosition(worldCoords);
    }

    if (action === UI_ACTION.MOVE_S_HIP) {
      this.setBottomHipPosition(worldCoords);
    }

    if (action === UI_ACTION.MOVE_RIDGE) {
      this.setRidgePosition(worldCoords);
    }
  }
  setTopHipPosition(worldCoords: Vector3) {
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(currPos.x, currPos.y, local.z);

    // need to adjust the roof geometry now too 9,11,16
    const vecFromLeftToTop = vectorsOnStart[9];
    const vecFromRightToTop = vectorsOnStart[11];
    const vecFromRidgeToTop = vectorsOnStart[16];

    vecFromLeftToTop.z = local.z;
    vecFromRightToTop.z = local.z;
    vecFromRidgeToTop.z = local.z;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);

    this.setTopHipPositionPersp(local);
  }

  setTopHipPositionPersp(coords: Vector3) {
    const { perspVectorsOnStart, buildingModel } = this;
    if (!buildingModel) {
      return;
    }

    const vecFromLeftToTop = perspVectorsOnStart[9];
    vecFromLeftToTop.z = coords.z;
    buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
    buildingModel.buildingElev.setRoofGeometry(perspVectorsOnStart);
  }

  setBottomHipPosition(worldCoords: Vector3) {
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(currPos.x, currPos.y, local.z);

    // need to adjust the roof geometry now too 13,15,17
    const vecFromLeftToBottom = vectorsOnStart[13];
    const vecFromRightToBottom = vectorsOnStart[15];
    const vecFromRidgeToBottom = vectorsOnStart[17];

    vecFromLeftToBottom.z = local.z;
    vecFromRightToBottom.z = local.z;
    vecFromRidgeToBottom.z = local.z;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);
    this.setBottomHipPositionPersp(local);
  }

  setBottomHipPositionPersp(coords: Vector3) {
    const { perspVectorsOnStart, buildingModel } = this;
    if (!buildingModel) {
      return;
    }

    const vecFromLeftToTop = perspVectorsOnStart[12];
    vecFromLeftToTop.z = coords.z;
    buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
    buildingModel.buildingElev.setRoofGeometry(perspVectorsOnStart);
  }

  setRidgePosition(worldCoords: Vector3) {
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { handles } = buildingModel.buildingPlan;

    // TODO as expecteed issue now moved handles!
    const topHip = handles[4];
    const bottomHip = handles[5];

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(local.x, currPos.y, currPos.z);

    const { handleObject: topHipObj } = topHip;

    topHipObj.position.set(local.x, topHipObj.position.y, topHipObj.position.z);

    const { handleObject: bottomHipObj } = bottomHip;
    bottomHipObj.position.set(
      local.x,
      bottomHipObj.position.y,
      bottomHipObj.position.z
    );

    const vecFromLeftToTop = vectorsOnStart[9];
    const vecFromRightToTop = vectorsOnStart[11];
    const vecFromRidgeToTop = vectorsOnStart[16];

    const vecFromLeftToBottom = vectorsOnStart[13];
    const vecFromRightToBottom = vectorsOnStart[15];
    const vecFromRidgeToBottom = vectorsOnStart[17];

    vecFromLeftToTop.x = local.x;
    vecFromRightToTop.x = local.x;
    vecFromRidgeToTop.x = local.x;

    vecFromLeftToBottom.x = local.x;
    vecFromRightToBottom.x = local.x;
    vecFromRidgeToBottom.x = local.x;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);
    this.setRidgePositionPersp(local);
  }

  setRidgePositionPersp(coords: Vector3) {
    const { perspVectorsOnStart, buildingModel } = this;
    if (!buildingModel) {
      return;
    }

    const vecToTopHip = perspVectorsOnStart[9];
    const vecToBottomHip = perspVectorsOnStart[12];
    vecToTopHip.x = coords.x;
    vecToBottomHip.x = coords.x;
    buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
  }
}

export default RoofControl;
