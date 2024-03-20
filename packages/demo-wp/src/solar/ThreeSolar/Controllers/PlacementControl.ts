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

class PlacementControl implements IListener {
  offset: Vector3 | null;
  structures: Istructure[];
  planMeshes: Object3D[];
  perspMeshes: Object3D[];
  raycaster: Raycaster;

  constructor() {
    this.offset = null;
    this.structures = [];
    this.raycaster = new Raycaster();

    this.planMeshes = [];
    this.perspMeshes = [];
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
    // const { worldCoords } = uiEvent.positionData;
    // const pos = new Vector3(worldCoords.x, 0, worldCoords.z);
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

  // setPosition(model: Model) {
  //   const { SelectedStructure, uiEvent } = model;
  //   if (!SelectedStructure || !uiEvent) {
  //     throw new Error('Structure not selected or no ui event!');
  //   }
  //   const { structures } = this;

  //   const { structure, id } = SelectedStructure.Plan.Base;

  //   const box = new Box3().setFromObject(structure);

  //   const intersecting = structures.filter((struct) => {
  //     const bbox = new Box3().setFromObject(struct.Plan.Base.structure);
  //     const sameObject = id === struct.Plan.Base.id;
  //     return sameObject === false && box.intersectsBox(bbox);
  //   });

  //   const box = new Box3().setFromObject(structure);

  //   let intersects = false;
  //   structures.forEach((s) => {
  //     const bbox = new Box3().setFromObject(s.Plan.Base.structure);
  //     const sameObject = structureModel.Plan.Base.id === s.Plan.Base.id;
  //     intersects =
  //       intersects || (sameObject === false && box.intersectsBox(bbox));
  //     if (intersects) {
  //       this.getRoofGeometry(s);
  //     }
  //   });

  //   if (intersects) {
  //     structureModel.Plan.Colour = 0x0000ff;
  //   } else {
  //     structureModel.Plan.Colour = 0xff0000;
  //   }
}

export default PlacementControl;
