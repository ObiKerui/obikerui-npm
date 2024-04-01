import {
  Euler,
  Intersection,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import { Istructure } from '../Structure';
import { Model } from '../../Model/Model';
import { IMount } from './MountingControl';

function isStructureMounted(selectedStructure: Istructure) {
  const { transform: transformPlan } = selectedStructure.Plan.Base;

  const transformPlanMesh = transformPlan as Mesh;
  const meshAttachedTo = transformPlanMesh.parent;
  return meshAttachedTo !== null && meshAttachedTo.type !== 'Scene';
}

function unMountFromParent(selectedStructure: Istructure, model: Model) {
  const { planScene, perspectiveScene } = model;
  // unmount what we have selected
  const { transform: transformPlan, rotation: rotatePlan } =
    selectedStructure.Plan.Base;
  const { transform: transformPersp, rotation: rotatePersp } =
    selectedStructure.Persp.Base;

  // get the world coords of mounted structure
  const worldPos = new Vector3();
  transformPlan.getWorldPosition(worldPos);

  // get the world space rotation
  const worldQuaternion = new Quaternion();
  rotatePlan.getWorldQuaternion(worldQuaternion);
  const worldRotation = new Euler().setFromQuaternion(worldQuaternion);

  // we have to remove from parent - but when we do the rotation will change
  // we want to keep it the same
  transformPlan.removeFromParent();
  planScene?.scene.add(transformPlan);
  transformPlan.position.copy(worldPos);
  rotatePlan.rotation.copy(worldRotation);

  transformPersp.removeFromParent();
  perspectiveScene?.scene.add(transformPersp);
  transformPersp.position.copy(worldPos);
  rotatePersp.rotation.copy(worldRotation);
}

function getPlatformNormal(platform: Intersection<Object3D>) {
  return platform.face?.normal ?? null;
}

function getPlatformHeight(platform: Intersection<Object3D>) {
  const height = platform.distance > 100 ? 0 : platform.distance;
  return height;
}

function getMountedPosition(selectedStructure: Istructure, height: number) {
  const { transform } = selectedStructure.Persp.Base;
  const newPosition = new Vector3(
    transform.position.x,
    height,
    transform.position.z
  );
  return newPosition;
}

function getMountedRotation(
  platformStructure: Istructure,
  platformAngle: Vector3
) {
  const { Base } = platformStructure.Persp;
  const { rotation } = Base;

  // Create a rotation matrix that represents the current rotation of the mesh
  const rotationMatrix = new Matrix4().makeRotationFromEuler(
    rotation.rotation.clone()
  );

  // Transform the normal vector by the rotation matrix
  const transformedNormal = platformAngle.clone().applyMatrix4(rotationMatrix);

  // Calculate the angle to rotate around the Y axis
  let angle = Math.atan2(transformedNormal.x, transformedNormal.z);

  // if y is positive then rotate angle by 180 degs?
  angle = transformedNormal.y > 0 ? angle + Math.PI : angle;
  const euler = new Euler(0, angle, 0);
  return euler;
}

function getParentStructure(platform: Intersection<Object3D>, model: Model) {
  const { structuresMap } = model;
  const obj = platform.object as Mesh;
  const id = obj.parent?.name;
  if (!id) {
    return null;
  }
  const struct = structuresMap.get(id);
  const toRet = struct ?? null;
  return toRet;
}

export {
  isStructureMounted,
  unMountFromParent,
  getPlatformNormal,
  getPlatformHeight,
  getMountedPosition,
  getMountedRotation,
  getParentStructure,
};
