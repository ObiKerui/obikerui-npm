import { BufferAttribute, Euler, Object3D, Quaternion, Vector3 } from 'three';

function convertToPoints(buffer: BufferAttribute) {
  const { itemSize, array } = buffer;

  if (array.length % itemSize !== 0) {
    throw new Error('Error - Geometry not divisible by itemsize');
  }

  const vectors: Vector3[] = [];
  for (let i = 0; i < array.length; i += itemSize) {
    vectors.push(new Vector3(array[i], array[i + 1], array[i + 2]));
  }
  return vectors;
}

/**
 *
 * @param subFrom Euler rotation to subtract from
 * @param subAmount Euler rotation amount to subtract from subtractFrom
 * @returns The result Euler
 */
function subtractRotation(subFrom: Euler, subAmount: Euler) {
  const quatDorm = new Quaternion().setFromEuler(subFrom);
  const quatBuild = new Quaternion().setFromEuler(subAmount);
  const quatBuildInverse = new Quaternion().copy(quatBuild).invert();

  // Combine quaternion1 with the inverse of quaternion2
  const resultQuaternion = new Quaternion().multiplyQuaternions(
    quatBuildInverse,
    quatDorm
  );

  // Convert the resulting quaternion back to Euler angles
  const resultEuler = new Euler().setFromQuaternion(resultQuaternion);
  return resultEuler;
}

/**
 *
 * @param addTo Euler rotation to subtract from
 * @param addAmount Euler rotation amount to subtract from subtractFrom
 * @returns The result Euler
 */
function addRotation(addTo: Euler, addAmount: Euler) {
  const quatDorm = new Quaternion().setFromEuler(addTo);
  const quatBuild = new Quaternion().setFromEuler(addAmount);

  // Combine quaternion1 with the inverse of quaternion2
  const resultQuaternion = new Quaternion().multiplyQuaternions(
    quatBuild,
    quatDorm
  );

  const result = resultQuaternion.normalize();

  // Convert the resulting quaternion back to Euler angles
  const resultEuler = new Euler().setFromQuaternion(result);
  return resultEuler;
}

function convertToObjSpace(fromObjSpace: Object3D, toObjSpace: Object3D) {
  const worldPosition = new Vector3();
  fromObjSpace.getWorldPosition(worldPosition);
  const local = toObjSpace.worldToLocal(worldPosition.clone());
  return local;
}

export { convertToPoints, subtractRotation, addRotation, convertToObjSpace };
