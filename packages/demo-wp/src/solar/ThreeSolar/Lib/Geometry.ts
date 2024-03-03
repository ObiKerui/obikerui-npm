import { BufferAttribute, Vector3 } from 'three';

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

export { convertToPoints };
