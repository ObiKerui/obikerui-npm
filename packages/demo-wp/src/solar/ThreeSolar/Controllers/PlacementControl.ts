/* eslint-disable class-methods-use-this */
import {
  LineSegments,
  Object3D,
  Raycaster,
  Vector3,
  Matrix4,
  Euler,
  Mesh,
} from 'three';
import { IListener, USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import { Istructure } from '../Lib/Structure';
import {
  subtractRotation,
  convertToObjSpace,
  addRotation,
} from '../Lib/Geometry';

class PlacementControl implements IListener {
  offset: Vector3 | null;
  structures: Istructure[];
  planMeshes: Object3D[];
  perspMeshes: Object3D[];
  raycaster: Raycaster;
  attachTo: Istructure | null;

  constructor() {
    this.offset = null;
    this.structures = [];
    this.raycaster = new Raycaster();

    this.planMeshes = [];
    this.perspMeshes = [];
    this.attachTo = null;
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.POSITION) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        // this.onMouseDown(model);
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
    const { SelectedStructure, uiEvent, elevationScene, planScene } = model;
    if (!SelectedStructure || !uiEvent || !elevationScene) {
      throw new Error('Structure not selected or no ui event!');
    }
    // get the structures in the scene...
    this.populateSceneStructures(model);
    this.attachTo = null;
    console.log('mouse down attach to is: ', this.attachTo);

    // unmount what we have selected
    const { transform: transformPlan, rotation: rotatePlan } =
      SelectedStructure.Plan.Base;
    const { transform: transformPersp } = SelectedStructure.Persp.Base;

    const transformPlanMesh = transformPlan as Mesh;
    const whatIsIt = transformPlanMesh.parent;
    const isMounted = whatIsIt && whatIsIt.type !== 'Scene';

    if (!isMounted) {
      return;
    }

    // get the world coords of mounted structure
    const worldPos = new Vector3();
    transformPlan.getWorldPosition(worldPos);

    // get the rotation for the structure
    // addRotation(rotatePlan.rotation, );

    console.log('is mounted so transform back to scene...', whatIsIt);
    transformPlan.removeFromParent();
    planScene?.scene.add(transformPlan);
    transformPlan.position.copy(worldPos);
    transformPersp.position.copy(worldPos);

    // get the object it is attached to
    // set the parent to be the plan scene
  }

  getRoofGeometry(structure: Istructure) {
    const lineSegments = structure.Plan.Locations as LineSegments;
    const vectors = structure.Plan.getRoofGeometry();
    console.log('what : ', vectors, lineSegments);
  }

  setPosition(model: Model) {
    const { SelectedStructure, uiEvent, structuresMap } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    console.log('mouse move attach to is: ', this.attachTo);
    console.log('selected sutructure: ', SelectedStructure);

    const { perspMeshes } = this;

    const { AttachPoints, Base } = SelectedStructure.Persp;

    if (AttachPoints.length === 0) {
      return;
    }

    const left = AttachPoints[0];
    const leftWorldPoint = Base.structure.localToWorld(left.position.clone());
    const pos2 = new Vector3(leftWorldPoint.x, 0, leftWorldPoint.z);

    this.raycaster.set(pos2, new Vector3(0, 1, 0));
    const intersections = this.raycaster.intersectObjects(perspMeshes, false);

    // mountable structure isn't intersecting with any buildings
    if (intersections.length === 0) {
      return;
    }

    // need to get the highest building, not necessarily the 0th index?
    const platform = intersections[0];
    const obj = platform.object as Mesh;
    const id = obj.parent?.name;
    if (!id) {
      return;
    }
    const structure = structuresMap.get(id);
    if (!structure) {
      return;
    }
    this.attachTo = structure;
    console.log('attach to set to structure: ', this.attachTo);

    const { buildingPersp } = structure as BuildingModel;
    const { rotation } = buildingPersp.structureBase;

    const normalVec = platform.face?.normal;
    const height = platform.distance > 100 ? 0 : platform.distance;

    if (!normalVec) {
      return;
    }

    // TODO this point triggers some complex behaviours within the app we need to implement
    // we need access to all the scenes.
    // we need access to the structure mounted onto plus any structure already mounted.
    // we need access to the structure that mounted

    // TODO at this point we've mounted the structure to another structure
    // we need to add the structure mounted to, to the elevation scene in
    // addition to this dormer and any other structures mounted too.

    // TODO we need to create a mount point on the structure mounted to and attach
    // this dormer at that position.

    // TODO we also need to make the dormer visible in the perspective scene
    // BUT we should be able to make it invisible again as soon as it is moved
    // off another structure.

    const { rotation: planRotate } = SelectedStructure.Plan.Base;
    const { rotation: perspRotate, transform } = SelectedStructure.Persp.Base;

    const newPosition = new Vector3(
      transform.position.x,
      height,
      transform.position.z
    );

    // Create a rotation matrix that represents the current rotation of the mesh
    const rotationMatrix = new Matrix4().makeRotationFromEuler(
      rotation.rotation.clone()
    );

    // Transform the normal vector by the rotation matrix
    const transformedNormal = normalVec.clone().applyMatrix4(rotationMatrix);

    // Calculate the angle to rotate around the Y axis
    let angle = Math.atan2(transformedNormal.x, transformedNormal.z);

    // if y is positive then rotate angle by 180 degs?
    angle = transformedNormal.y > 0 ? angle + Math.PI : angle;

    // console.log('distance to roof and angle: ', angle, worldNormal);

    // Create a rotation matrix around the Y axis
    // const rotationMatrix = new Matrix4().makeRotationY(angle);

    transform.position.copy(newPosition);
    const euler = new Euler(0, angle, 0);
    planRotate.rotation.copy(euler);
    perspRotate.rotation.copy(euler);
  }

  onMouseUp(model: Model) {
    let { attachTo } = this;
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    console.log('attach to : ', attachTo);

    if (!attachTo) {
      return;
    }

    const { rotation: dormPlanRot } = SelectedStructure.Plan.Base;
    const { rotation: dormPerspRot } = SelectedStructure.Persp.Base;
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

    // calculate the new position when we add it to the parent rotation object
    const { transform: selected } = SelectedStructure.Plan.Base;
    const { rotation: mountTo } = attachTo.Plan.Base;

    const newLocalPos = convertToObjSpace(selected, mountTo);

    SelectedStructure.Plan.Base.transform.position.copy(newLocalPos);
    SelectedStructure.Persp.Base.transform.position.copy(newLocalPos);

    attachTo.Plan.Base.rotation.add(SelectedStructure.Plan.Base.transform);
    attachTo.Persp.Base.rotation.add(SelectedStructure.Persp.Base.transform);
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
