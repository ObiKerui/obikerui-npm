/* eslint-disable class-methods-use-this */
import { Object3D, Raycaster, Vector3, Color } from 'three';
import { IListener, USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';
import { Istructure } from '../Lib/Structure';
import { subtractRotation, convertToObjSpace } from '../Lib/Geometry';
import * as MountUtils from '../Lib/Mounting/Utils';
import { IMount, IMountable } from '../Lib/Mounting/MountingControl';

type tOnMountCB = (attachable: Istructure, attachedTo: Istructure) => void;

type tOnUnmountCB = (attachable: Istructure, attachedTo: Istructure) => void;

class PlacementControl implements IListener {
  offset: Vector3 | null;
  structures: Istructure[];
  planMeshes: Object3D[];
  perspMeshes: Object3D[];
  raycaster: Raycaster;
  attachTo: Istructure | null;
  initialColour: Color | null;
  onMountCB: tOnMountCB | null;
  onUnmountCB: tOnUnmountCB | null;

  constructor() {
    this.offset = null;
    this.structures = [];
    this.raycaster = new Raycaster();

    this.planMeshes = [];
    this.perspMeshes = [];
    this.attachTo = null;
    this.initialColour = null;
    this.onMountCB = null;
    this.onUnmountCB = null;
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.POSITION) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.setPosition(model);
        break;
      case USER_EVENT.MOUSE_UP:
        this.onMouseUp(model);
        break;
      default:
        break;
    }
  }

  populateSceneStructures(model: Model) {
    const { structuresMap, SelectedStructure } = model;
    this.structures = Array.from(structuresMap.values());
    this.perspMeshes = [];

    this.structures.forEach((s) => {
      if (s.ID !== SelectedStructure?.ID) {
        this.perspMeshes.push(s.Persp.Base.structure);
      }
    });
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent, elevationScene } = model;
    if (!SelectedStructure || !uiEvent || !elevationScene) {
      throw new Error('Structure not selected or no ui event!');
    }
    // get the structures in the scene...
    this.populateSceneStructures(model);

    const currColour = SelectedStructure.Plan.Colour as Color;
    this.initialColour = new Color(currColour);
    this.attachTo = null;

    if (MountUtils.isStructureMounted(SelectedStructure)) {
      MountUtils.unMountFromParent(SelectedStructure, model);
    }
  }

  getEnclosingObject3D(selectedStructure: Istructure) {
    const { perspMeshes } = this;

    const { AttachPoints, Base } = selectedStructure.Persp;

    if (AttachPoints.length === 0) {
      return null;
    }

    const left = AttachPoints[0];
    const leftWorldPoint = Base.structure.localToWorld(left.position.clone());
    const pos2 = new Vector3(leftWorldPoint.x, 0, leftWorldPoint.z);

    this.raycaster.set(pos2, new Vector3(0, 1, 0));
    const intersections = this.raycaster.intersectObjects(perspMeshes, false);

    // mountable structure isn't intersecting with any buildings
    if (intersections.length === 0) {
      return null;
    }

    // need to get the highest building, not necessarily the 0th index?
    const platform = intersections[0];
    return platform;
  }

  setPosition(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    if (this.initialColour) {
      SelectedStructure.Plan.Colour = this.initialColour;
    }

    this.attachTo = null;
    const platform = this.getEnclosingObject3D(SelectedStructure);
    if (!platform) {
      return;
    }

    const structure = MountUtils.getParentStructure(platform, model);
    if (!structure) {
      return;
    }

    this.attachTo = structure;
    SelectedStructure.Plan.Colour = 0x00aaff;

    // calculate the new Euler rotation for the mounted structure
    const normalVec = MountUtils.getPlatformNormal(platform);
    if (!normalVec) {
      return;
    }
    const euler = MountUtils.getMountedRotation(structure, normalVec);

    // calculate the new Vector3 position for the mounted structure
    const height = MountUtils.getPlatformHeight(platform);
    const newPosition = MountUtils.getMountedPosition(
      SelectedStructure,
      height
    );

    // update the plan/perspective models
    const { rotation: planRotate } = SelectedStructure.Plan.Base;
    const { rotation: perspRotate, transform } = SelectedStructure.Persp.Base;

    transform.position.copy(newPosition);
    planRotate.rotation.copy(euler);
    perspRotate.rotation.copy(euler);
  }

  onMouseUp(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    this.setPosition(model);

    let { attachTo } = this;
    if (!attachTo) {
      SelectedStructure.Plan.Colour =
        this.initialColour ?? SelectedStructure.Plan.Colour;
      return;
    }

    const { rotation: dormPlanRot } = SelectedStructure.Plan.Base;
    const { rotation: dormPerspRot } = SelectedStructure.Persp.Base;
    const { rotation: dormElevRot } = SelectedStructure.Elevation.Base;
    const { rotation: attachToPlanRot } = attachTo.Plan.Base;

    // calculate the new rotation of the dormer
    // when we add it as a child to parent rotation it will inherit and add-on
    // the parent rotation - so subtract the parent to keep the child
    // rotation the same as visually
    const resultEuler = subtractRotation(
      dormPlanRot.rotation,
      attachToPlanRot.rotation
    );

    // copy the rotation to the plan/perspective
    dormPlanRot.rotation.copy(resultEuler);
    dormPerspRot.rotation.copy(resultEuler);
    dormElevRot.rotation.copy(resultEuler);

    // calculate the new position when we add it to the parent rotation object
    const { transform: selected } = SelectedStructure.Plan.Base;

    // const { rotation: mountTo } = attachTo.Plan.Base;
    const mountable = attachTo as unknown as IMount;
    const base = mountable.MountBase;

    const structureToMount = SelectedStructure as unknown as IMountable;
    const mountableBase = structureToMount.MountableBase;
    mountableBase.MountParent = attachTo;

    const newLocalPos = convertToObjSpace(selected, base.Plan);

    SelectedStructure.Plan.Base.transform.position.copy(newLocalPos);
    SelectedStructure.Persp.Base.transform.position.copy(newLocalPos);
    SelectedStructure.Elevation.Base.transform.position.copy(newLocalPos);

    base.Plan.add(SelectedStructure.Plan.Base.transform);
    base.Persp.add(SelectedStructure.Persp.Base.transform);
    base.Elevation.add(SelectedStructure.Elevation.Base.transform);

    SelectedStructure.Plan.Colour = 0xcccccc;
    attachTo = null;
  }

  // onMouseUp(model: Model) {
  //   const boxGeom = new BoxGeometry(1, 1, 1);
  //   const boxMat = new LineBasicMaterial({
  //     transparent: true,
  //     opacity: 0.1,
  //   });
  //   const attachPoint = new Mesh(boxGeom, boxMat);

  //   const { attachTo } = this;
  //   const { SelectedStructure, uiEvent, structuresMap } = model;
  //   if (!SelectedStructure || !uiEvent) {
  //     throw new Error('Structure not selected or no ui event!');
  //   }

  //   if (!attachTo) {
  //     return;
  //   }

  //   const { transform: selected } = SelectedStructure.Plan.Base;
  //   const { transform: mountTo, rotation: mountToRot } = attachTo.Plan.Base;

  //   // Step 1: Get the world position of mesh1
  //   const worldPosition = new Vector3();
  //   selected.getWorldPosition(worldPosition);

  //   const local = mountTo.worldToLocal(worldPosition.clone());
  //   const quat = new Quaternion();
  //   mountToRot.getWorldQuaternion(quat);

  //   attachTo.Plan.Base.transform.add(attachPoint);
  //   attachPoint.position.copy(local);
  //   attachPoint.rotation.setFromQuaternion(quat);

  //   // const attachPointWorld = mountTo.position.clone();
  //   // attachPoint.localToWorld(attachPointWorld);
  //   const attachPointWorld = new Vector3();
  //   attachPoint.getWorldPosition(attachPointWorld);

  //   SelectedStructure.Plan.Base.transform.position.copy(attachPointWorld);
  //   SelectedStructure.Persp.Base.transform.position.copy(attachPointWorld);

  //   console.log('position on of dormer: ', worldPosition);
  //   console.log(
  //     'local / world position local to mountable: ',
  //     local,
  //     attachPointWorld
  //   );

  //   // attachTo.Plan.Base.structure.add(SelectedStructure.Plan.Base.transform);
  //   // attachTo.Persp.Base.structure.add(SelectedStructure.Persp.Base.transform);
  // }
}

export default PlacementControl;
